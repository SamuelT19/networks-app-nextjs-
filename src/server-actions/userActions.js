"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const createUser = async (data, io) => {
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
    return { error: error.message };
  }
};

const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany();
    return { users, count: users.length };
  } catch (error) {
    return { error: error.message };
  }
};

const getUserById = async (id, io) => {
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
    return { error: error.message };
  }
};

const updateUser = async (data, id, io) => {
  try {
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
    return { error: error.message };
  }
};

const deleteUser = async (id, io) => {
  try {
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
  } catch (error) {
    return { error: error.message };
  }
};

const loginUser = async ({ username, password }) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    // if (!user || !(await bcrypt.compare(password, user.password))) {
    if(!user){
      return { success: false };
    }
    return { success: true, user };
  } catch (error) {
    console.error("Login failed:", error);
    return { error: "Internal Server Error" };
  }
};

const usersCount = async ()=>{
  try {
    const count = await prisma.user.count()
    return {count}
  } catch (error) {
    return {error: error.message}
  }
}

export {
  loginUser,
  deleteUser,
  updateUser,
  getAllUsers,
  createUser,
  getUserById,
  usersCount
};
