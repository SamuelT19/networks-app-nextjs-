import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
} from "@mui/material";
import { getAllPermissions, createRole } from "@/server-actions/userActions";
import { Permission } from "@prisma/client";

const RoleManagement = () => {
  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const permissionsData = await getAllPermissions();
        setPermissions(permissionsData);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };

    fetchPermissions();
  }, []);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const permissionId = parseInt(event.target.value);
    if (event.target.checked) {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    } else {
      setSelectedPermissions(
        selectedPermissions.filter((id) => id !== permissionId)
      );
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const permissionIds = selectedPermissions;
      await createRole(name, permissionIds);
      setSuccessMessage("Role created successfully");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Error creating role");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const groupedPermissions: { [key: string]: Permission[] } = {};
  permissions.forEach((permission: Permission) => {
    if (!groupedPermissions[permission.subject]) {
      groupedPermissions[permission.subject] = [];
    }
    groupedPermissions[permission.subject].push(permission);
  });

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Add New Role
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Role Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {Object.keys(groupedPermissions).map((subject) => (
          <Paper elevation={3} style={{ marginBottom: "10px", padding: "10px" }} key={subject}>
            <Typography variant="subtitle1" fontSize="24px">
              {subject}
            </Typography>
            <Grid container spacing={2}>
              {groupedPermissions[subject].map((permission) => (
                <Grid item xs={12} sm={6} key={permission.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedPermissions.includes(permission.id)}
                        onChange={handleCheckboxChange}
                        value={permission.id.toString()}
                      />
                    }
                    label={permission.name}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        ))}

        {successMessage && <Typography color="green" fontWeight="600">{successMessage}</Typography>}
        {errorMessage && <Typography color="red" fontWeight="600">{errorMessage}</Typography>}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: "20px" }}
        >
          Create Role
        </Button>
      </form>
    </Container>
  );
};

export default RoleManagement;
