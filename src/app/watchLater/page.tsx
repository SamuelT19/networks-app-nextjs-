"use client";
import React from "react";
import Navigate from "@/components/customer/Navigate";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import MoviesList from "@/components/customer/MoviesList";

function WatchLater() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      <Box sx={{ display: "flex", backgroundColor: "#121f4d" }}>

        {!isSmallScreen && <Navigate />}

        <MoviesList data="watchLater" />
      </Box>
    </>
  );
}

export default WatchLater;
