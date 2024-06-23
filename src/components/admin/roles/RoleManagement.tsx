import React, { useState, useEffect } from 'react';
import { 
  Container,
  TextField,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { getAllPermissions, createRole } from "@/server-actions/userActions" // Import your Prisma API functions
import { JsonValue } from '@prisma/client/runtime/library';

type PermissionType = {
  id: number;
  name: string;
  action: string;
  subject: string;
  inverted: boolean;
  conditions: JsonValue;
  reason: string | null;
}

const RoleManagement = () => {
  const [name, setName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [permissions, setPermissions] = useState<PermissionType[]>([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const permissionsData = await getAllPermissions();
        setPermissions(permissionsData);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    fetchPermissions();
  }, []);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const permissionId = parseInt(event.target.value);
    if (event.target.checked) {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    } else {
      setSelectedPermissions(selectedPermissions.filter(id => id !== permissionId));
    }
  };

  console.log(selectedPermissions);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const permissionIds = selectedPermissions; 
      const response = await createRole(name, permissionIds);
      console.log('Role created successfully:', response);
      // Optionally, you can reset form fields or show a success message
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  // Group permissions by subject
  const groupedPermissions: { [key: string]: PermissionType[] } = {};
  permissions.forEach((permission: PermissionType) => {
    if (!groupedPermissions[permission.subject]) {
      groupedPermissions[permission.subject] = [];
    }
    groupedPermissions[permission.subject].push(permission);
  });

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Add New Role</Typography>
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

        {/* Accordion for each subject */}
        {Object.keys(groupedPermissions).map(subject => (
          <Accordion key={subject} elevation={3} style={{ marginBottom: '10px' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{subject}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ width: '100%' }}>
                {groupedPermissions[subject].map(permission => (
                  <FormControlLabel
                    key={permission.id}
                    control={
                      <Checkbox
                        checked={selectedPermissions.includes(permission.id)}
                        onChange={handleCheckboxChange}
                        value={permission.id.toString()}
                      />
                    }
                    label={permission.name}
                  />
                ))}
              </div>
            </AccordionDetails>
          </Accordion>
        ))}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: '20px' }}
        >
          Create Role
        </Button>
      </form>
    </Container>
  );
};

export default RoleManagement;

