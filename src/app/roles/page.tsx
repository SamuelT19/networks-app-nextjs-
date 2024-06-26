"use client";

import React from "react";
import AdminNav from "@/components/admin/AdminNav";
import AdminMenu from "@/components/admin/AdminMenu";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useProgramsContext } from "@/context/ProgramsContext";
import RoleManagement from "@/components/admin/roles/RoleManagement";
const Channel: React.FC = () => {
  const { state } = useProgramsContext();

  const { user } = state;
  console.log(user)

  const router = useRouter();

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <>
      <Box>
        <AdminNav title="Roles" />
      </Box>
      <Box sx={{ display: "flex" }}>
        <AdminMenu />
        <Box sx={{ flex: 1, margin: " 10px 30px" }}>
          <RoleManagement/>
        </Box>
      </Box>
    </>
  );
};

export default Channel;
