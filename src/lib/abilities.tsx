import Mustache from "mustache";
import { User, Channel, Program, Prisma } from "@prisma/client";
import { AbilityBuilder, AbilityClass, FieldMatcher, PureAbility } from "@casl/ability";
import { createPrismaAbility, PrismaQuery, Subjects } from "@casl/prisma";
import { UserWithRole } from "@/context/types";
import { getUser } from "@/server-actions/userActions";


export type AppAbility = PureAbility<
  [
    string,
    "all" | Subjects<{ User: User; Channel: Channel; Program: Program }>
  ],
  PrismaQuery
>;
type AppSubjects = "User" | "Channel" | "Program" | "all";

export const AppAbility = PureAbility as AbilityClass<AppAbility>;

export const fieldMatcher: FieldMatcher = fields => field => fields.includes(field);

export async function defineAbilitiesFor(user: UserWithRole) {
  const id = user.id;
  const loggedUser = await getUser(id);

  if (!loggedUser) throw new Error("User not found");

  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createPrismaAbility
  );

  loggedUser.role.permissions.forEach(({ permission }) => {
    const subject = permission.subject as AppSubjects;
    let conditions: any;
    let inverted = permission.inverted;

    try {
      conditions = parseConditions(permission.conditions, loggedUser);
    } catch (error) {
      console.error(
        `Error parsing conditions for permission ${permission.id}:`,
        error
      );
      conditions = undefined;
    }

    const fields = permission.fields as Prisma.JsonArray;

    if (Array.isArray(fields)) {
      fields.forEach((fieldOne: any) => {
        const fieldCondition = `${fieldOne}`;
        if (conditions) {
          if (inverted) {
            cannot(permission.action, subject, [fieldCondition], conditions);
          } else {
            can(permission.action, subject, [fieldCondition], conditions);
          }
        } else {
          // If no conditions, grant permission based on field only
          can(permission.action, subject, [fieldCondition]);
        }
      });
    } else {
      // Only conditions
      if (conditions) {
        if (inverted) {
          cannot(permission.action, subject, conditions);
        } else {
          can(permission.action, subject, conditions);
        }
      } else {
        // If no conditions, just grant permission without any specific conditions
        can(permission.action, subject);
      }
    }
  });

  return build({ fieldMatcher });
}

function parseConditions(
  conditions: Prisma.JsonValue,
  user: UserWithRole
): Prisma.JsonValue {
  if (!conditions) {
    return conditions;
  }

  if (typeof conditions === "string") {
    conditions = JSON.parse(conditions);
  }

  if (Array.isArray(conditions)) {
    return conditions.map((condition) => parseConditions(condition, user));
  }

  if (typeof conditions == "object") {
    const parsedConditions: Prisma.JsonObject = {};

    for (const key in conditions) {
      const value = conditions[key];
      if (typeof value === "string") {
        const parsedVal = Mustache.render(value, { userId: user.id });
        parsedConditions[key] = isNaN(parseInt(parsedVal))
          ? parsedVal
          : parseInt(parsedVal);
      } else {
        parsedConditions[key] = value;
      }
    }
    return parsedConditions;
  }

  return conditions;
}
