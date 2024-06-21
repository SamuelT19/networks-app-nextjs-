'use client'

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

import { defineAbilitiesFor } from "@/lib/abilities";
import { User } from "@prisma/client";
import { UserWithRole } from "@/context/types";

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

const idToRoleName: { [key: number]: string } = {
  1: "Admin",
  2: "Editor",
  3: "Contributor",
  4: "Viewer",
};
interface UserManagementProps {
  currentUser: UserWithRole;
}

const UserManagement: React.FC<UserManagementProps> = ({ currentUser }) => {
  
  const abilities = defineAbilitiesFor(currentUser);

  if (!abilities.can('manage', 'all')) {
    return <div>Access Denied</div>;
  }

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [validationError, setValidationError] = useState<string | null>(null);
  const [roles, setRoles] = useState<Setter[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllUsers(currentUser);
      if ('error' in response) {
        setIsError(true);
        console.error("Error fetching users:", response.error);
      } else {
        setUsers(response.users.map((user) => ({ ...user, role: idToRoleName[user.roleId!] })));
      }
    } catch (error) {
      console.error("Unexpected error fetching users:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setRoles([
      { id: 1, name: "Admin" },
      { id: 2, name: "Editor" },
      { id: 3, name: "Contributor" },
      { id: 4, name: "Viewer" },
    ]);
  }, []);

  const handleOpen = (user: User | null = null) => {
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
    try {
      const parsedData = userSchema.parse(formData);

      if (selectedUser) {
        await updateUser(currentUser, parsedData, selectedUser.id!);
      } else {
        await createUser(currentUser, parsedData);
      }
      fetchData();
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
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(currentUser, id);
        fetchData();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const columns = useMemo<MRT_ColumnDef<User>[]>(
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
        accessorKey: "role",
        header: "Role",
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
    enableRowActions: true,
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
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default UserManagement;

