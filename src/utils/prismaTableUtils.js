import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createRecord = async (model, data, io, eventName) => {
  try {
    const recordData = { ...data, isActive: true };
    const records = await prisma[model].create({ data: recordData });
    if (io && eventName) {
      io.emit(eventName);
    }
    return records;
  } catch (error) {
    console.error(`Error creating ${model}:`, error);
    throw new Error(error.message);
  }
};

const updateRecord = async (model, id, data, io, eventName) => {
  try {
    const records = await prisma[model].update({
      where: { id: parseInt(id) },
      data ,
    });
    if (io && eventName) {
      io.emit(eventName);
    }
    return records;
  } catch (error) {
    console.error(`Error updating ${model}:`, error);
    throw new Error(error.message);
  }
};

const deleteRecord = async (model, id, io, eventName) => {
  try {
    await prisma[model].delete({
      where: { id: parseInt(id) },
    });
    if (io && eventName) {
      io.emit(eventName);
    }
  } catch (error) {
    console.error(`Error deleting ${model}:`, error);
    throw new Error(error.message);
  }
};

const fetchRecords = async (model, where, orderBy, pagination, include) => {
  try {
    const totalRowCount = await prisma[model].count({ where });
    const records = await prisma[model].findMany({
      where,
      orderBy,
      skip: pagination.skip,
      take: pagination.take,
      include: model === "program" ? include : undefined,
    });
    return {
      records,
      totalRowCount,
    };
  } catch (error) {
    console.error(`Error fetching ${model} records:`, error);
    throw new Error(error.message);
  }
};

const countRecord = async (model) => {
  try {
    const count = await prisma[model].count();
    return { count };
  } catch (error) {
    return { error: error.message };
  }
};

const allRecords = async (model, include) => {
  try {
    const records = await prisma[model].findMany({
      include: model === "program" ? include : undefined,
    });
    return records;
  } catch (error) {
    console.error(`Error fetching all ${model} records:`, error);
    throw new Error(error.message);
  }
};

export {
  createRecord,
  updateRecord,
  deleteRecord,
  fetchRecords,
  allRecords,
  countRecord,
};
