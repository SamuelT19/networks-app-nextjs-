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

const createProgram = async (data: Partial<Program>) => {
  ProgramSchema.parse(data);
  return await createRecord("program", data);
};

const updateProgram = async (
  id: number | undefined,
  data: Partial<Program>
) => {
  ProgramSchema.partial().parse(data); // Validation using Zod
  return await updateRecord("program", id, data);
};

const deleteProgram = async (id: number) => {
  return await deleteRecord("program", id);
};

const countPrograms = async () => {
  return await countRecord("program");
};

const allPrograms = async () => {
  return await allRecords("program", include);
};

const fetchPrograms = async ({
  start = "0",
  size = "10",
  filters = "[]",
  filtersFn = "[]",
  globalFilter = "",
  sorting = "[]",
}: FetchProgramsParams) => {
  const pageIndex = parseInt(start, 10) || 0;
  const pageSize = parseInt(size, 10) || 10;
  let where: Record<string, any> = {};

  // Apply global filter
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

  // Merge filterFns into filters based on their id
  let mergedFilters: any[] = [];
  if (filters && filtersFn) {
    const parsedFilters = JSON.parse(filters);
    const parsedFilterFns = JSON.parse(filtersFn);
    mergedFilters = parsedFilters.map((filter: any) => {
      return { ...filter, type: parsedFilterFns[filter.id] };
    });
  }

  // Apply column filters
  if (mergedFilters.length > 0) {
    mergedFilters.forEach((filter) => {
      applyFilter(filter, where);
    });
  }

  // Apply sorting
  let orderBy: any[] = [];
  if (sorting) {
    const parsedSorting = JSON.parse(sorting);
    orderBy = parsedSorting.map((sort: any) => ({
      [sort.id]: sort.desc ? "desc" : "asc",
    }));
  }

  return await fetchRecords(
    "program",
    where,
    orderBy,
    {
      skip: pageIndex * pageSize,
      take: pageSize,
    },
    include
  );
};

export {
  createProgram,
  updateProgram,
  deleteProgram,
  fetchPrograms,
  countPrograms,
  allPrograms,
};
