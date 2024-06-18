import React from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import tmoviesLogo from "../../../../public/t_movie_logo.png";

const LogoSection: React.FC = () => {
  return (
    <Box
      sx={{
        background: "#000",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: "center",
        justifyContent: "center",
        borderTopLeftRadius: 32,
        borderBottomLeftRadius: { sm: 0, md: 32 },
        borderTopRightRadius: { xs: 32, sm: 32, md: 0 },
      }}
    >
      <Image src={tmoviesLogo} width="100" alt="T-Movie Logo" />
      <Typography
        sx={{
          fontSize: {
            xs: 30,
            sm: 40,
            md: 60,
            lg: 80,
            xl: 100,
          },
          color: "#FFF",
        }}
      >
        T-Movie
      </Typography>
    </Box>
  );
};

export default LogoSection;
