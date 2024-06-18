"use client";

import React from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GradeIcon from "@mui/icons-material/Grade";
import CastIcon from "@mui/icons-material/Cast";
import { Box, useTheme, useMediaQuery, Avatar } from "@mui/material";
import Link from "next/link";
import avatar from "../../../public/avatar_profile.jpg";
import tMoviesLogo from "../../../public/t_movie_logo.png";
import { usePathname, useRouter } from "next/navigation";
import { ArrowBackIos } from "@mui/icons-material";
import Image from "next/image";

const Navigate = () => {
  const router = useRouter();
  const currentPath = usePathname();
  const handleBack = () => {
    router.back();
  };
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const iconStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "#3a4363",
    color: "#fff",
    transition: "background-color 0.3s, transform 0.3s",
    "&:hover": {
      backgroundColor: "#0165FE",
      transform: "scale(1.1)",
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isSmallScreen ? "row" : "column",
        alignItems: "center",
        justifyContent: isSmallScreen ? "space-around" : "flex-start",
        width: isSmallScreen ? "100%" : "14%",
        backgroundColor: "#121f4d",
        marginTop: isSmallScreen ? "auto" : "50px",
        minHeight: isSmallScreen ? "11vh" : "100%",
        position: isSmallScreen ? "fixed" : "relative",
        bottom: isSmallScreen ? 0 : "auto",
        padding: isSmallScreen ? "10px 0" : "0",
        minWidth: isSmallScreen ? "100%" : "100px",
        zIndex: 20,
      }}
    >
      {!isSmallScreen && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#121f4d",
            width: "100%",
            height: "200px",
          }}
        >
          <Box sx={{ height: "200px", pt: "50px" }}>
            {currentPath !== "/tvNetworks" ? (
              <Box sx={iconStyles}>
                <Box
                  onClick={handleBack}
                  style={{
                    marginLeft: "5px",
                    marginTop: "3px",
                  }}
                >
                  <ArrowBackIos />
                </Box>
              </Box>
            ) : (
              <Image
                src={tMoviesLogo}
                width={60}
                height={60}
                alt="T-Movie Logo"
              />
            )}
          </Box>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "row" : "column",
          gap: isSmallScreen ? "35px" : "25px",
          alignItems: "center",
        }}
      >
        <Box sx={iconStyles}>
          <Link href={"/movies"} passHref style={{ paddingTop: "3px" }}>
            <CastIcon />
          </Link>
        </Box>
        <Box sx={iconStyles}>
          <Link href={"/favorites"} passHref style={{ paddingTop: "3px" }}>
            <GradeIcon />
          </Link>
        </Box>
        <Box sx={iconStyles}>
          <Link href={"/watchLater"} passHref style={{ paddingTop: "3px" }}>
            <AccessTimeIcon />
          </Link>
        </Box>
        {isSmallScreen && (
          <Box>
            <Avatar
              alt="Remy Sharp"
              src={avatar.src}
              sx={{ width: 48, height: 48 }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Navigate;