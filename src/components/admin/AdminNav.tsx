"use client";

import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import tmoviesLogo from "../../../public/t_movie_logo.png";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import CircleIcon from "@mui/icons-material/Circle";
import UserProfileDialog from "./UserProfileDialog";

function AdminNav({ title }: { title: string }) {
  const [open, setOpen] = useState(false);

  const handleCircleIconClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        right: 0,
        left: 0,
        display: "flex",
        height: "50px",
        boxShadow: "0px 4px 5px 0px rgba(0, 0, 0, 0.2)",
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          boxShadow: "4px 0px 0px rgba(0, 0, 0, 0.8)",
          justifyContent: "center",
          gap: "15px",
          width: "15%",
          backgroundColor: "#fff",
          zIndex: 10,
        }}
      >
        <Image src={tmoviesLogo} width="30" alt="T-Movie Logo" />
        <Typography
          sx={{
            fontSize: {
              xs: 15,
              md: 25,
            },
            fontWeight: 500,
            color: "#000",
            display: {
              md: "block",
              xs: "none",
            },
          }}
        >
          T-Movie
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#000",
          flex: 1,
          paddingInline: "20px",
        }}
      >
        <Typography variant="h5" sx={{ color: "#fff" }}>
          {title}
        </Typography>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <NotificationsNoneIcon sx={{ color: "#fff", right: 0 }} />

          <CircleIcon
            sx={{ color: "#fff", cursor: "pointer" }}
            onClick={handleCircleIconClick}
          />
          <UserProfileDialog open={open} onClose={handleClose} />
        </Box>
      </Box>
    </Box>
  );
}

export default AdminNav;
