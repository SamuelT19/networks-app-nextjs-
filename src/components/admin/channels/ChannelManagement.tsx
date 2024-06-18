"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_SortingState,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
  MRT_ColumnFiltersState,
  useMaterialReactTable,
  MRT_FilterOption,
  MRT_ColumnFilterFnsState,
} from "material-react-table";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  MenuItem,
  Switch,
  TextField,
  Tooltip,
  lighten,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { z, ZodError } from "zod";

import {
  createChannel,
  updateChannel,
  deleteChannel,
  fetchChannels,
} from "@/server-actions/channelActions";

const channelSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1).max(20),
  isActive: z.boolean().optional(),
});

type Channel = {
  id: number;
  name: string;
  isActive: boolean;
};

const ChannelManagement = () => {
  const [open, setOpen] = useState(false);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [formData, setFormData] = useState<Partial<Channel>>({});
  const [validationError, setValidationError] = useState<string | null>(null);

  const [channels, setChannels] = useState<Channel[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  console.log(columnFilters);
  const [columnFilterFns, setColumnFilterFns] =
    useState<MRT_ColumnFilterFnsState>({ id: "equals", name: "startsWith" });
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  console.log(columnFilterFns);
  const channelsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        start: `${pagination.pageIndex}`,
        size: `${pagination.pageSize}`,
        filters: JSON.stringify(columnFilters ?? []),
        filtersFn: JSON.stringify(columnFilterFns ?? []),
        globalFilter: globalFilter ?? "",
        sorting: JSON.stringify(sorting ?? []),
      };

      const { records, totalRowCount } = await fetchChannels(params);
      setChannels(records);
      setRowCount(totalRowCount);
    } catch (error) {
      console.error("Error fetching channels:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [
    columnFilters,
    columnFilterFns,
    globalFilter,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
  ]);

  useEffect(() => {
    channelsData();
  }, [channelsData, columnFilterFns]);

  const handleOpen = (channel: Channel | null = null) => {
    setCurrentChannel(channel);
    setFormData(channel ? { ...channel } : {});
    setOpen(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, isActive: event.target.checked });
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentChannel(null);
    setFormData({});
    setValidationError(null);
  };

  const handleSubmit = async () => {
    try {
      channelSchema.parse(formData);

      if (currentChannel) {
        await updateChannel(currentChannel.id, formData);
        channelsData();
      } else {
        await createChannel(formData);
        channelsData();
      }
      handleClose();
    } catch (error) {
      if (error instanceof ZodError) {
        setValidationError(error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this channel?")) {
      try {
        await deleteChannel(id);
        channelsData();
      } catch (error) {
        console.error("Error deleting channel:", error);
      }
    }
  };

  const handleColumnFiltersChange = useCallback(
    (updaterOrValue: any) => {
      const newFilters =
        typeof updaterOrValue === "function"
          ? updaterOrValue(columnFilters)
          : updaterOrValue;

      const updatedFilters = newFilters.map((filter: any) => {
        const column = columns.find(
          (col) => col.accessorKey === filter.id || col.id === filter.id
        );
        let filtervariant;
        if (["id"].includes(filter.id)) {
          filtervariant = "number";
        } else {
          filtervariant = column?.filterVariant;
        }

        return {
          ...filter,
          ...(filtervariant && { filtervariant }),
          ...(column?.accessorFn && { filtervariant: filtervariant || "text" }),
        };
      });
      setColumnFilters(updatedFilters);
    },
    [columnFilters, columnFilterFns]
  );

  const filteringMethods = {
    numeric: [
      "equals",
      "notEquals",
      "between",
      "betweenInclusive",
      "greaterThan",
      "greaterThanOrEqual",
      "lessThan",
      "lessThanOrEqual",
    ],
    character: [
      "fuzzy",
      "contains",
      "startsWith",
      "endsWith",
      "equals",
      "notEquals",
    ],
  };

  const columns = useMemo<MRT_ColumnDef<Channel>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        filterFn: "equals",
        filterVariant: "text",
        columnFilterModeOptions: filteringMethods.numeric as MRT_FilterOption[],
      },
      {
        accessorKey: "name",
        header: "Name",
        filterFn: "startsWith",
        filterVariant: "autocomplete",
      },
      {
        header: "Status",
        accessorFn: (row) => (row.isActive ? "true" : "false"),
        id: "isActive",
        filterVariant: "checkbox",
        enableColumnFilterModes: false,
        Cell: ({ cell }) =>
          cell.getValue() === "true" ? "Active" : "Inactive",
        size: 170,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: channels,
    getRowId: (row) => String(row.id),
    initialState: {
      showColumnFilters: true,
      showGlobalFilter: true,
    },
    enableRowActions: true,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    enableFilterMatchHighlighting: true,
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    enableRowPinning: true,
    onColumnFiltersChange: handleColumnFiltersChange,
    onColumnFilterFnsChange: setColumnFilterFns,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount,
    state: {
      columnFilters,
      columnFilterFns,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => handleOpen(row.original)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            color="error"
            onClick={() => handleDelete(row.original.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbar: ({ table }) => (
      <Box
        sx={(theme) => ({
          backgroundColor: lighten(theme.palette.background.default, 0.05),
          display: "flex",
          gap: "0.5rem",
          p: "8px",
          justifyContent: "space-between",
        })}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpen()}
          startIcon={<AddIcon />}
        >
          Add Channel
        </Button>
        <Box sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <MRT_GlobalFilterTextField table={table} />
          <MRT_ToggleFiltersButton table={table} />
        </Box>
      </Box>
    ),
  });

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "auto",
        maxWidth: "calc(100vw - 15vw)",
        boxShadow: "2px 2px 10px 5px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Box sx={{ position: "relative" }}>
        <MaterialReactTable table={table} />
        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle>
            {currentChannel ? "Edit Channel" : "Add Channel"}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Channel Name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              fullWidth
            />
            {currentChannel && (
              <Box mt={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive || false}
                      onChange={handleSwitchChange}
                      color="primary"
                    />
                  }
                  label="Active"
                />
              </Box>
            )}
            {validationError && (
              <p style={{ color: "red" }}>{validationError}</p>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit}>
              {currentChannel ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ChannelManagement;
