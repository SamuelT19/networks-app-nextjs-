"use client";
import React from "react";

import tMoviesLogo from "../../../public/t_movie_logo.png";
import { Box} from "@mui/material";
import Image from "next/image";
import { ArrowBackIos } from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";

function LogoBack() {
  const router = useRouter();
  const currentPath = usePathname();
  const handleBack = () => {
    router.back();
  };
  const iconStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "#1e3264",
    color: "#fff",
    transition: "background-color 0.3s, transform 0.3s",
    "&:hover": {
      backgroundColor: "#0165FE",
      transform: "scale(1.1)",
    },
  };
  return (
    <>
      {currentPath !== "/tvNetworks" ? (
        <Box
          sx={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#121f4d",
            width: "13%",
          }}
        >
          <Box sx={{ height: "200px", pt: "50px" }}>
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
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#121f4d",
            width: "15%",
          }}
        >
          <Box sx={{ height: "200px", pt: "50px" }}>
            <Image
              src={tMoviesLogo}
              width={60}
              height={60}
              alt="T-Movie Logo"
            />
          </Box>
        </Box>
      )}
    </>
  );
}

export default LogoBack;
