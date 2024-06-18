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

// Define types for the channel data
type ChannelData = {
  id?: number;
  name?: string;
  isActive?: boolean;
};

// Define types for the fetchChannels parameters
type FetchChannelsParams = {
  start?: string;
  size?: string;
  filters?: string;
  filtersFn?: string;
  globalFilter?: string;
  sorting?: string;
};

const createChannel = async (data: ChannelData) => {
  return await createRecord("channel", data);
};

const updateChannel = async (id: number, data: ChannelData) => {
  return await updateRecord("channel", id, data);
};

const deleteChannel = async (id: number) => {
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
  filtersFn = "[]",
  globalFilter = "",
  sorting = "[]",
}: FetchChannelsParams) => {
  const pageIndex = parseInt(start, 10) || 0;
  const pageSize = parseInt(size, 10) || 10;
  let where: Record<string, any> = {};

  // Apply global filter
  if (globalFilter) {
    where.OR = [{ name: { contains: globalFilter, mode: "insensitive" } }];
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
