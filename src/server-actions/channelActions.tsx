"use server";

import {
  createRecord,
  updateRecord,
  deleteRecord,
  fetchRecords,
  countRecord,
  allRecords,
  getRecordById,
} from "../utils/prismaTableUtils";

import { applyFilter } from "@/utils/filterHandler";
import { defineAbilitiesFor } from "@/lib/abilities";
import { UserWithRole } from "@/context/types";
import { accessibleBy } from "@casl/prisma";
import { ChannelData, ProgramData } from "@/lib/typeCollection";
import { pick } from "lodash";
import { permittedFieldsOf } from "@casl/ability/extra";

const createChannel = async (data: ChannelData, user: UserWithRole) => {
  const ability = await defineAbilitiesFor(user);

  if (ability.can("create", "Channel")) {
    return await createRecord("channel", data);
  }
  throw new Error("Permission denied");
};

const updateChannel = async (
  id: number,
  data: ChannelData,
  user: UserWithRole
) => {
  const ability = await defineAbilitiesFor(user);
const FIELDS_OF_CHANNEL = ["name","isActive"]
  const fields = permittedFieldsOf(ability, "update", "Channel", {
    fieldsFrom: (rule) => rule.fields || FIELDS_OF_CHANNEL,
  });
  console.log(fields);
  // if (!fields.includes('name')) {
  //   throw new Error('You are not allowed to update the name of the channel');
  // }
  const updateData = pick(data, fields);

  if (Object.keys(updateData).length === 0) {
    throw new Error(
      "You do not have permission to update any of the provided fields"
    );
  }

  try {
    return await updateRecord(
      "channel",
      { AND: accessibleBy(ability, "update").Channel, id },
      updateData
    );
  } catch (error) {
    throw new Error("Permission denied");
  }
};

const deleteChannel = async (id: number, user: UserWithRole) => {
  const ability = await defineAbilitiesFor(user);

  if (ability.can("delete", "Channel")) {
    try {
      return await deleteRecord("channel", {
        where: { AND: accessibleBy(ability, "delete").Channel, id },
      });
    } catch (error) {
      throw new Error("Permission denied");
    }
  }

  throw new Error("Permission denied");
};

const countChannels = async () => {
  return await countRecord("channel");
};

const allChannels = async () => {
  return await allRecords("channel");
};

const getChannelById = async (id: number) => {
  return await getRecordById("channel", id);
};

const fetchChannels = async (
  {
    start = "0",
    size = "10",
    filters = "[]",
    filtersFn = "[]",
    globalFilter = "",
    sorting = "[]",
  }: ProgramData,
  user: UserWithRole
) => {
  const ability = await defineAbilitiesFor(user);

  let where: Record<string, any> = {};

  if (globalFilter) {
    where.OR = [{ name: { contains: globalFilter, mode: "insensitive" } }];
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
    "channel",
    {
      AND: accessibleBy(ability).Channel,
      ...where,
    },

    orderBy,
    {
      skip: parseInt(start, 10) * parseInt(size, 10),
      take: parseInt(size, 10),
    }
  );

  return {
    records,
    totalRowCount,
  };
};

export {
  createChannel,
  updateChannel,
  deleteChannel,
  countChannels,
  allChannels,
  fetchChannels,
  getChannelById,
};
