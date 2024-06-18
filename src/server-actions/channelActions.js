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

const createChannel = async (data) => {

  return await createRecord("channel", data);
};

const updateChannel = async (id, data) => {
  return await updateRecord("channel", id, data);
};

const deleteChannel = async (id) => {
  return await deleteRecord("channel", id);
};
const countChannels = async () => {
  return await countRecord("channel");
};

const allChannels = async () => {
  return await allRecords("channel");
};

const fetchChannels = async ({
  start = "0",
  size = "10",
  filters = "[]",
  globalFilter = "",
  sorting = "[]",
}) => {
  const pageIndex = parseInt(start, 10) || 0;
  const pageSize = parseInt(size, 10) || 10;
  let where = {};

  // Apply global filter
  if (globalFilter) {
    where.OR = [{ name: { contains: globalFilter, mode: "insensitive" } }];
  }

  // Apply column filters
  if (filters) {
    const parsedFilters = JSON.parse(filters);
    parsedFilters.forEach((filter) => {
      applyFilter(filter, where);
    });
  }

  // Apply sorting
  let orderBy = [];
  if (sorting) {
    const parsedSorting = JSON.parse(sorting);
    orderBy = parsedSorting.map((sort) => ({
      [sort.id]: sort.desc ? "desc" : "asc",
    }));
  }
  return await fetchRecords("channel", where, orderBy, {
    skip: pageIndex * pageSize,
    take: pageSize,
  });
};

export {
  createChannel,
  updateChannel,
  deleteChannel,
  countChannels,
  allChannels,
  fetchChannels,
};
