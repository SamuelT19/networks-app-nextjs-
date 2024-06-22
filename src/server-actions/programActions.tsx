"use server";

import {
  createRecord,
  updateRecord,
  deleteRecord,
  fetchRecords,
  countRecord,
  allRecords,
} from "../utils/prismaTableUtils";
import { applyFilter } from "@/utils/filterHandler";
import { defineAbilitiesFor } from "@/lib/abilities";
import { UserWithRole } from "@/context/types";
import { accessibleBy } from "@casl/prisma";
import {
  ProgramSchema,
  Program,
} from "@/components/admin/programs/programType";

type FetchProgramsParams = {
  start?: string;
  size?: string;
  filters?: string;
  filtersFn?: string;
  globalFilter?: string;
  sorting?: string;
};

const include = { channel: true, type: true, category: true };

const createProgram = async (data: Partial<Program>, user: UserWithRole) => {
  const ability = defineAbilitiesFor(user);
  
  if (ability.can("create", "Program")) {
    ProgramSchema.parse(data);
    return await createRecord("program", data);
  }
  throw new Error("Permission denied");
};

const updateProgram = async (
  id: number,
  data: Partial<Program>,
  user: UserWithRole
) => {
  const ability = defineAbilitiesFor(user);

  if (ability.can("update", "Program")) {
    try {
      ProgramSchema.partial().parse(data); // Validation using Zod
      return await updateRecord(
        "program",
        { AND: accessibleBy(ability).Program, id },
        data
      );
    } catch (error) {
      throw new Error("Permission denied");
    }
  }
  throw new Error("Permission denied");
};

const deleteProgram = async (id: number, user: UserWithRole) => {
  const ability = defineAbilitiesFor(user);

  if (ability.can("delete", "Program")) {
    try {
      return await deleteRecord("program", {
        where: { AND: accessibleBy(ability).Program, id },
      });
    } catch (error) {
      throw new Error("Permission denied");
    }
  }
  throw new Error("Permission denied");
};

const countPrograms = async () => {
  return await countRecord("program");
};

const allPrograms = async () => {
  return await allRecords("program", include);
};

const fetchPrograms = async (
  {
    start = "0",
    size = "10",
    filters = "[]",
    filtersFn = "[]",
    globalFilter = "",
    sorting = "[]",
  }: FetchProgramsParams,
  user: UserWithRole
) => {
  const ability = defineAbilitiesFor(user);
  
  let where: Record<string, any> = {};

  if (globalFilter) {
    where.OR = [
      { title: { contains: globalFilter, mode: "insensitive" } },
      { description: { contains: globalFilter, mode: "insensitive" } },
      { videoUrl: { contains: globalFilter, mode: "insensitive" } },
      { channel: { name: { contains: globalFilter, mode: "insensitive" } } },
      { type: { name: { contains: globalFilter, mode: "insensitive" } } },
      { category: { name: { contains: globalFilter, mode: "insensitive" } } },
    ];
  }

  let mergedFilters: any[] = [];
  if (filters && filtersFn) {
    const parsedFilters = JSON.parse(filters);
    const parsedFilterFns = JSON.parse(filtersFn);
    mergedFilters = parsedFilters.map((filter: any) => {
      return { ...filter, type: parsedFilterFns[filter.id] };
    });
  }

  if (mergedFilters.length > 0) {
    mergedFilters.forEach((filter) => {
      applyFilter(filter, where);
    });
  }

  let orderBy: any[] = [];
  if (sorting) {
    const parsedSorting = JSON.parse(sorting);
    orderBy = parsedSorting.map((sort: any) => ({
      [sort.id]: sort.desc ? "desc" : "asc",
    }));
  }

  const { records, totalRowCount } = await fetchRecords(
    "program",
    {
      AND: accessibleBy(ability).Program,...where
    },
    orderBy,
    {
      skip: parseInt(start, 10) * parseInt(size, 10),
      take: parseInt(size, 10),
    },
    include
  );

 
  return {
    records,
    totalRowCount,
  };
};

export {
  createProgram,
  updateProgram,
  deleteProgram,
  fetchPrograms,
  countPrograms,
  allPrograms,
};

