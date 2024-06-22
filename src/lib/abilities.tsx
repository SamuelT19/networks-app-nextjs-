// abilities.js
import { UserWithRole } from "@/context/types";
import { PureAbility, AbilityBuilder, AbilityClass } from "@casl/ability";
import { createPrismaAbility, PrismaQuery, Subjects } from "@casl/prisma";
import { User, Channel, Program } from "@prisma/client";

type AppAbility = PureAbility<
  [string,"all" | Subjects<{ User: User; Channel: Channel; Program: Program, }>],
  PrismaQuery
>;

const AppAbility = PureAbility as AbilityClass<AppAbility>;

export function defineAbilitiesFor(user: UserWithRole) {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createPrismaAbility
  );

  if (user.role.name === "Admin") {
    can("manage", "all");
  } else if (user.role.name === "Editor") {
    can(["read", "create", "update", "delete"], "Channel");
    can(["read", "create", "update", "delete"], "Program");
  } else if (user.role.name === "Contributor") {
    can("create", "Channel");
    can(["update", "delete", "read"], "Channel", { userId: user.id });
    can(["read", "create", "update", "delete"], "Program");
  } else if (user.role.name === "Viewer") {
    can("read", "Program");
  }

  return build();
}
