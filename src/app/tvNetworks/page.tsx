import React from "react";
import Navigate from "@/components/customer/Navigate";
import Channels from "@/components/customer/Channels";
import Poster from "@/components/customer/Poster";
import { Box, Grid } from "@mui/material";
import LogoBack from "@/components/customer/LogoBack";

function page() {
  return (
    <>
      <Box sx={{ display: "flex", backgroundColor: "#121f4d" }}>
        {/* <LogoBack /> */}
        <Navigate />
        <Channels />
        <Poster playedTime={3410} totalTime={6540} />
      </Box>
    </>
  );
}

export default page;
