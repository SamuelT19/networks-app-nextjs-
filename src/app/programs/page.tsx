"use client";

import React from "react";
import AdminNav from "@/components/admin/AdminNav";
import AdminMenu from "@/components/admin/AdminMenu";
import { Box } from "@mui/material";
import ProgramManagement from "@/components/admin/programs/ProgramManagement";
import { useProgramsContext } from "@/context/ProgramsContext";
import { useRouter } from "next/navigation";

const Program: React.FC = () => {
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
        <AdminNav title="Programs" />
      </Box>
      <Box sx={{ display: "flex" }}>
        <AdminMenu />
        <Box sx={{ flex: 1, margin: " 10px 30px" }}>
          <ProgramManagement user={user}/>
        </Box>
      </Box>
    </>
  );
};

export default Program;
