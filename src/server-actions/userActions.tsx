"use server";

import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

type UserData = {
  id?: number;
  username: string;
  email: string;
  password: string;
  roleId: number;
};

const updateUser = async (data: UserData, id: number) => {
  try {
    const { username, email, password, roleId } = data;
    let updateData: any = {
      username,
      email,
    };

    if (password) {
      updateData.password = password;
    }

    // Ensure the role exists
    const role = await prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      return { error: `Role with ID '${roleId}' not found.` };
    }

    updateData.roleId = role.id;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        role: true,
      },
    });

    return updatedUser;
  } catch (error) {
    return { error: (error as Error).message };
  }
};

const createUser = async (data: UserData) => {
  try {
    const { username, email, password, roleId } = data;

    // Ensure the role exists
    const role = await prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      return { error: `Role with ID '${roleId}' not found.` };
    }

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password,
        roleId: role.id,
      },
      include: {
        role: true,
      },
    });

    return user;
  } catch (error) {
    return { error: (error as Error).message };
  }
};

const getAllUsers = async (): Promise<
  { users: User[] } | { error: string }
> => {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: true,
      },
    });
    return { users };
  } catch (error) {
    return { error: (error as Error).message };
  }
};

const getUserById = async (id: number): Promise<User | { error: string }> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
      },
    });

    if (user) {
      return user;
    } else {
      return { error: "User not found" };
    }
  } catch (error) {
    return { error: (error as Error).message };
  }
};

const deleteUser = async (id: number): Promise<void | { error: string }> => {
  try {
    await prisma.user.delete({
      where: { id },
    });
  } catch (error) {
    return { error: (error as Error).message };
  }
};

const loginUser = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<{ success: boolean; user?: User }> => {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        role: true,
      },
    });

    if (!user || user.password !== password) {
      return { success: false };
    }

    return { success: true, user };
  } catch (error) {
    console.error("Login failed:", error);
    return { success: false };
  }
};

const usersCount = async (): Promise<{ count: number } | { error: string }> => {
  try {
    const count = await prisma.user.count();
    return { count };
  } catch (error) {
    return { error: (error as Error).message };
  }
};

export {
  loginUser,
  deleteUser,
  updateUser,
  getAllUsers,
  createUser,
  getUserById,
  usersCount,
};
