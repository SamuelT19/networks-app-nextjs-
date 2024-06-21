"use client";

import React from "react";
import AdminNav from "@/components/admin/AdminNav";
import AdminMenu from "@/components/admin/AdminMenu";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useProgramsContext } from "@/context/ProgramsContext";
import UserManagement from "@/components/admin/user/UserManagment";
const User: React.FC = () => {
  const { state } = useProgramsContext();

  const { user } = state;

  const router = useRouter();

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <>
      <Box>
        <AdminNav title="Users" />
      </Box>
      <Box sx={{ display: "flex" }}>
        <AdminMenu />
        <Box sx={{ flex: 1, margin: " 10px 30px" }}>
          <UserManagement currentUser={user}/>
        </Box>
      </Box>
    </>
  );
};

export default User;
