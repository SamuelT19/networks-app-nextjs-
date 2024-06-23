"use server";

import { UserWithRole } from "@/context/types";
import { PermissionData } from "@/lib/typeCollection";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createPermission = async (data: PermissionData, user: UserWithRole) => {
  try {
    const createdPermission = await prisma.permission.create({
      data,
    });
    return createdPermission;
  } catch (error) {
    console.error(`Error creating permission: ${(error as Error).message}`);
    throw new Error("Failed to create new permission");
  }
};

const getAllPermissions = async () => {
  try {
    const permissions = await prisma.permission.findMany();
    return permissions;
  } catch (error) {
    console.error(`Error fetching permissions: ${(error as Error).message}`);
    throw new Error("Failed to fetch permissions");
  }
};

const getPermissionById = async (id: number) => {
  try {
    const permission = await prisma.permission.findUnique({
      where: { id },
    });
    return permission;
  } catch (error) {
    console.error(`Error fetching permission: ${(error as Error).message}`);
    throw new Error("Failed to fetch permission");
  }
};

const updatePermission = async (id: number, data: PermissionData) => {
  try {
    const updatedPermission = await prisma.permission.update({
      where: { id },
      data,
    });
    return updatedPermission;
  } catch (error) {
    console.error(`Error updating permission: ${(error as Error).message}`);
    throw new Error("Failed to update permission");
  }
};

const deletePermission = async (id: number) => {
  try {
    await prisma.permission.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`Error deleting permission: ${(error as Error).message}`);
    throw new Error("Failed to delete permission");
  }
};

export {
  createPermission,
  getAllPermissions,
  getPermissionById,
  updatePermission,
  deletePermission,
};
