"use client";

import React from "react";
import AdminNav from "@/components/admin/AdminNav";
import AdminMenu from "@/components/admin/AdminMenu";
import { Box, Container } from "@mui/material";
import ChannelManagement from "@/components/admin/channels/ChannelManagement";
import { useRouter } from "next/navigation";
import { useProgramsContext } from "@/context/ProgramsContext";
const Channel: React.FC = () => {
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
        <AdminNav title="Channels" />
      </Box>
      <Box sx={{ display: "flex" }}>
        <AdminMenu />
        <Box sx={{ flex: 1, margin: " 10px 30px" }}>
          <ChannelManagement />
        </Box>
      </Box>
    </>
  );
};

export default Channel;
