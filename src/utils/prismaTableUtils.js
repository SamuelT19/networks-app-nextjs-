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




// import { PrismaClient, Prisma } from "@prisma/client";
// import { Socket } from "socket.io";

// const prisma = new PrismaClient();

// type Model = keyof PrismaClient;
// type OrderBy = Prisma.QueryOrderBy;
// type Pagination = {
//   skip?: number;
//   take?: number;
// };
// type Include =
//   | Prisma.ProgramInclude
//   | Prisma.ProgramFindManyArgs['include'];

// const createRecord = async (
//   model: Model,
//   data: PrismaClient[model]['create']['args']['data'],
//   io?: Socket,
//   eventName?: string
// ): Promise<PrismaClient[model]> => {
//   try {
//     const recordData = { ...data, isActive: true };
//     const records = await prisma[model].create({ data: recordData });
//     if (io && eventName) {
//       io.emit(eventName);
//     }
//     return records;
//   } catch (error) {
//     console.error(`Error creating ${model}:`, error);
//     throw new Error(error.message);
//   }
// };

// const updateRecord = async (
//   model: Model,
//   id: string,
//   data: PrismaClient[model]['update']['args']['data'],
//   io?: Socket,
//   eventName?: string
// ): Promise<PrismaClient[model]> => {
//   try {
//     const records = await prisma[model].update({
//       where: { id: parseInt(id, 10) },
//       data,
//     });
//     if (io && eventName) {
//       io.emit(eventName);
//     }
//     return records;
//   } catch (error) {
//     console.error(`Error updating ${model}:`, error);
//     throw new Error(error.message);
//   }
// };

// const deleteRecord = async (
//   model: Model,
//   id: string,
//   io?: Socket,
//   eventName?: string
// ): Promise<void> => {
//   try {
//     await prisma[model].delete({
//       where: { id: parseInt(id, 10) },
//     });
//     if (io && eventName) {
//       io.emit(eventName);
//     }
//   } catch (error) {
//     console.error(`Error deleting ${model}:`, error);
//     throw new Error(error.message);
//   }
// };

// const fetchRecords = async (
//   model: Model,
//   where: PrismaClient[model]['findMany']['args']['where'],
//   orderBy: OrderBy[],
//   pagination: Pagination,
//   include?: Include
// ): Promise<{ records: PrismaClient[model][]; totalRowCount: number }> => {
//   try {
//     const totalRowCount = await prisma[model].count({ where });
//     const records = await prisma[model].findMany({
//       where,
//       orderBy,
//       skip: pagination.skip,
//       take: pagination.take,
//       include: model === "Program" ? include : undefined,
//     });
//     return {
//       records,
//       totalRowCount,
//     };
//   } catch (error) {
//     console.error(`Error fetching ${model} records:`, error);
//     throw new Error(error.message);
//   }
// };

// const countRecord = async (
//   model: Model
// ): Promise<{ count: number } | { error: string }> => {
//   try {
//     const count = await prisma[model].count();
//     return { count };
//   } catch (error) {
//     return { error: error.message };
//   }
// };

// const allRecords = async (
//   model: Model,
//   include?: Include
// ): Promise<PrismaClient[model][]> => {
//   try {
//     const records = await prisma[model].findMany({
//       include: model === "Program" ? include : undefined,
//     });
//     return records;
//   } catch (error) {
//     console.error(`Error fetching all ${model} records:`, error);
//     throw new Error(error.message);
//   }
// };

// export {
//   createRecord,
//   updateRecord,
//   deleteRecord,
//   fetchRecords,
//   allRecords,
//   countRecord,
// };

