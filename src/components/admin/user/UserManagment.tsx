"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
  useMaterialReactTable,
} from "material-react-table";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
  lighten,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { z, ZodError } from "zod";

import {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
} from "@/server-actions/userActions";

import { AppAbility, defineAbilitiesFor } from "@/lib/abilities";
import { UserWithRole } from "@/context/types";
import { getAllRoles } from "@/server-actions/roleActions";

const userSchema = z.object({
  id: z.number().optional(),
  username: z.string().min(1).max(20),
  email: z.string().email(),
  password: z.string(),
  roleId: z.number().min(1),
});

interface Setter {
  id: number;
  name: string;
}

interface UserManagementProps {
  user: UserWithRole;
}

const UserManagement: React.FC<UserManagementProps> = ({ user }) => {
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [formData, setFormData] = useState<Partial<UserWithRole>>({});
  const [validationError, setValidationError] = useState<string | null>(null);
  const [roles, setRoles] = useState<Setter[]>([]);
  const [users, setUsers] = useState<UserWithRole[]>([]);

  const [ability, setAbility] = useState<AppAbility | null>(null);
  const [open, setOpen] = useState(false);

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchAbilities = async () => {
      const fetchedAbility = await defineAbilitiesFor(user);
      setAbility(fetchedAbility);
    };

    fetchAbilities();
  }, [user]);
  if (ability && !ability.can("manage", "all")) {
    return <div>Access Denied</div>;
  }

  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllUsers(user);
      if ("error" in response) {
        setIsError(true);
        console.error("Error fetching users:", response.error);
      } else {
        setUsers(response.users as UserWithRole[]);
      }
    } catch (error) {
      console.error("Unexpected error fetching users:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);
  console.log(users);
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    const fetchRoles = async () => {
      const roles = await getAllRoles();

      setRoles(roles);
    };
    fetchRoles();
  }, []);
  console.log(roles);
  const handleOpen = (user: UserWithRole | null = null) => {
    setSelectedUser(user);
    setFormData(user ? { ...user } : {});
    setOpen(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
    setFormData({});
    setValidationError(null);
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const parsedData = userSchema.parse(formData);

      if (selectedUser) {
        await updateUser(user, parsedData, selectedUser.id!);
      } else {
        await createUser(user, parsedData);
      }
      fetchUserData();
      handleClose();
    } catch (error) {
      if (error instanceof ZodError) {
        setValidationError(error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(user, id);
        fetchUserData();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const columns = useMemo<MRT_ColumnDef<UserWithRole>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "username",
        header: "Username",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorFn: (row) => row.role?.name || "",
        id: "roleId",
        header: "Role",
        filterVariant: "multi-select",
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: users,
    getRowId: (row) => String(row.id),
    initialState: {
      showColumnFilters: true,
      showGlobalFilter: true,
    },
    enableFacetedValues: true,
    enableRowActions: true,
    enableColumnFilterModes: true,
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => handleOpen(row.original)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            color="error"
            onClick={() => handleDelete(row.original.id!)}
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
          Add User
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
          <DialogTitle>{selectedUser ? "Edit User" : "Add User"}</DialogTitle>
          <DialogContent>
            <TextField
              label="Username"
              name="username"
              value={formData.username || ""}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Password"
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="password"
            />
            <FormControl fullWidth margin="normal">
              <TextField
                select
                label="Role"
                name="roleId"
                value={formData.roleId || ""}
                onChange={handleChange}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
            {validationError && (
              <Box mt={2}>
                <Alert severity="error">{validationError}</Alert>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            {/* add here success or error message and add time out to the dialog to show the message*/}
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {selectedUser
                ? isSaving
                  ? "Updating..."
                  : "Update"
                : isSaving
                ? "Adding..."
                : "Add"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default UserManagement;
