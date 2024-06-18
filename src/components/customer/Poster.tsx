import React from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Container,
  Avatar,
} from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import posterM from "../../../public/movies/test-movie.jpg";
import hboLogo from "../../../public/channels/hbo-logo.png";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import avatar from "../../../public/avatar_profile.jpg";

import Types from "./Types";
import Image from "next/image";

interface PosterProps {
  playedTime: number;
  totalTime: number;
}

const Poster: React.FC<PosterProps> = ({ playedTime, totalTime }) => {
  const truncate = (str: string, n: number) => {
    return str?.length > n ? str.slice(0, n - 1) + "..." : str;
  };

  const progress = (playedTime / totalTime) * 100;

  const description =
    "In the small, fog-covered town of Raventhorne, strange occurrences have become a part of daily life. When a young journalist named Emily moves to the town to escape her past, she quickly finds herself entangled in its enigmatic allure.";

  return (
    <Box
      flex={1}
      bgcolor="#121F4D"
      color="white"
      sx={{
        position: "relative",
        minHeight: "100vh",
        "@media (max-width:600px)": {
          minHeight: "90vh",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          position: "relative",
          height: "60vh",
          marginBottom: 2,
          backgroundImage: `url(${posterM.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          "@media (max-width:600px)": {
            height: "50vh",
          },
        }}
      >
        <Container
          sx={{
            position: "absolute",
            top: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            height: "50px",
            mt: 2,
          }}
        >
          <Image src={hboLogo} alt="hbo-logo" width="80" />
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <Typography component="p" sx={{ fontSize: "14px", opacity: 0.8 }}>
              12:30PM
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", opacity: 0.8 }}>
              <WbSunnyIcon />
              <Typography variant="h6" sx={{ fontSize: "14px" }}>
                32°
              </Typography>
            </Box>

            <Avatar
              alt="Remy Sharp"
              src={avatar.src}
              sx={{
                "@media (max-width:600px)": {
                  display: "none",
                },
              }}
            />
          </Box>
        </Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            width: "100%",
          }}
        >
          <Box
            sx={{
              width: { md: "60%", sm: "80%" },
              height: "92px",
              mt: "118px",
              ml: "2%",
              color: "seashell",
              overflow: "hidden",
              "@media (max-width:400px) and (max-height:750px)": {
                height: "140px",
              },
            }}
          >
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="p"
              sx={{ color: "#bdc9c8" }}
            >
              Now Playing
            </Typography>
            <Typography
              component="h3"
              variant="h4"
              sx={{ color: "#fff", fontWeight: "600", letterSpacing: "-1px" }}
            >
              Grey's Anatomy
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "30%",
              gap: "11%",

              "@media (max-height:800px) and (max-width:600px), (max-height:625px) and (max-width:1050px)": {
                display: "none",
              },
            }}
          >
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="p"
              style={{
                color: "#bdc9c8",
                lineHeight: "1.5",
                width: "91%",
                marginLeft: "2%",
              }}
            >
              {truncate(description, 150)}
            </Typography>
            <Box sx={{ display: "flex" }}>
              <Box
                sx={{
                  width: "50%",
                  height: "250px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  paddingLeft: 1,
                  paddingBottom: 1,
                  "@media (max-width:600px)": {
                    width: "90%",
                  },
                }}
              >
                <Box sx={{ width: "100%", paddingX: 1, paddingBottom: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 6,
                      borderRadius: 5,
                      backgroundColor: "rgb(157 163 169 / 59%)",
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    width: "95%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    component="div"
                    sx={{ color: "white" }}
                  >
                    {new Date(playedTime * 1000).toISOString().substr(11, 8)}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    component="div"
                    sx={{ marginLeft: "auto", color: "white" }}
                  >
                    {new Date(totalTime * 1000).toISOString().substr(11, 8)}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  "@media (max-width:800px)": {
                    display: "none"
                  },
                }}
              >
                <PlayCircleOutlineIcon
                  sx={{
                    marginLeft: 1,
                    color: "white",
                    fontSize: "40px",
                    mt: -2,
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            height: "45%",
            width: "100%",
            position: "absolute",
            bottom: 0,
            background: "linear-gradient(to top, #121F4D, transparent)",
            "@media (max-width:600px)": {
              height: "56%",
              bottom: "5%",
            },

            "@media (max-width:400px) and (max-height:750px)": {
              height: "65%",
              bottom: "100px",
            },
          }}
        ></Box>
      </Box>

      <Types />
    </Box>
  );
};

export default Poster;
