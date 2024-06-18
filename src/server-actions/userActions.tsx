"use server";

import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

type UserData = {
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
};

const createUser = async (
  data: UserData
): Promise<User | { error: string }> => {
  try {
    const { username, email, password, isAdmin } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        isAdmin,
      },
    });
    return user;
  } catch (error) {
    return { error: (error as Error).message };
  }
};

const getAllUsers = async (): Promise<
  { users: User[]; count: number } | { error: string }
> => {
  try {
    const users = await prisma.user.findMany();
    return { users, count: users.length };
  } catch (error) {
    return { error: (error as Error).message };
  }
};

const getUserById = async (id: string): Promise<User | { error: string }> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
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

const updateUser = async (
  data: Partial<UserData>,
  id: string
): Promise<User | { error: string }> => {
  try {
    const { username, email, password, isAdmin } = data;
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        username,
        email,
        ...(hashedPassword && { password: hashedPassword }),
        isAdmin,
      },
    });
    return user;
  } catch (error) {
    return { error: (error as Error).message };
  }
};

const deleteUser = async (id: string): Promise<void | { error: string }> => {
  try {
    await prisma.user.delete({
      where: { id: parseInt(id) },
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
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
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
