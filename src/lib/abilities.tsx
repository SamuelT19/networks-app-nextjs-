import { User, Channel, Program, Prisma } from "@prisma/client";
import { AbilityBuilder, AbilityClass, PureAbility } from "@casl/ability";
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

export async function defineAbilitiesFor(user: UserWithRole) {
  const userId = user.id;
  const logeduser = await getUser(userId);

  if (!logeduser) throw new Error("User not found");

  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createPrismaAbility
  );

  logeduser.role.permissions.forEach(({ permission }) => {
    const subject = permission.subject as AppSubjects;
    
    let conditions: any; 

    try {
      conditions = parseConditions(permission.conditions);
    } catch (error) {
      console.error(`Error parsing conditions for permission ${permission.id}:`, error);
      conditions = undefined;
    }
    can(permission.action, subject, conditions);
  });

  return build();
}

function parseConditions(conditions: Prisma.JsonValue): any {
  if (typeof conditions === 'string') {
    return JSON.parse(conditions);
  } else {
    return conditions;
  }
}
