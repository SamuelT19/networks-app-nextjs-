"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createRole = async (name: string, permissionIds: number[]) => {
  try {
    const existingPermissions = await prisma.permission.findMany({
      where: {
        id: { in: permissionIds },
      },
    });

    if (existingPermissions.length !== permissionIds.length) {
      throw new Error("Some permissions do not exist.");
    }

    const createdRole = await prisma.role.create({
      data: {
        name,
        permissions: {
          create: permissionIds.map((permissionId) => ({
            permission: { connect: { id: permissionId } },
          })),
        },
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
    return createdRole;
  } catch (error) {
    console.error(`Error creating role: ${(error as Error).message}`);
    throw new Error("Failed to create new role");
  }
};
const getAllRoles = async () => {
  try {
    const roles = await prisma.role.findMany();
    return roles;
  } catch (error) {
    console.error(`Error fetching roles: ${(error as Error).message}`);
    throw new Error("Failed to fetch roles");
  }
};
const getAllRolesWithPermission = async () => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
    return roles;
  } catch (error) {
    console.error(`Error fetching roles: ${(error as Error).message}`);
    throw new Error("Failed to fetch roles");
  }
};

const getRoleById = async (id: number) => {
  try {
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
    return role;
  } catch (error) {
    console.error(`Error fetching role: ${(error as Error).message}`);
    throw new Error("Failed to fetch role");
  }
};

const updateRole = async (
  id: number,
  name: string,
  permissionIds: number[]
) => {
  try {
    const existingPermissions = await prisma.permission.findMany({
      where: {
        id: { in: permissionIds },
      },
    });

    if (existingPermissions.length !== permissionIds.length) {
      throw new Error("Some permissions do not exist.");
    }

    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        name,
        permissions: {
          deleteMany: {},
          create: permissionIds.map((permissionId) => ({
            permission: { connect: { id: permissionId } },
          })),
        },
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
    return updatedRole;
  } catch (error) {
    console.error(`Error updating role: ${(error as Error).message}`);
    throw new Error("Failed to update role");
  }
};

const deleteRole = async (id: number) => {
  try {
    await prisma.role.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`Error deleting role: ${(error as Error).message}`);
    throw new Error("Failed to delete role");
  }
};

export {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  getAllRolesWithPermission,
};
