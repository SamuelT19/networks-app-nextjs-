import React from "react";
import { Box, Typography, Container } from "@mui/material";

import WbSunnyIcon from "@mui/icons-material/WbSunny";
import SearchBar from "./SearchBar";
import UserProfile from "./UserProfile";
import { Movie } from "@/context/types";
import { ArrowBackIos } from "@mui/icons-material";

interface HeaderProps {
  movies: Movie[];
  setFilteredMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
  data: string;
}
import { useRouter } from "next/navigation";

function Header({ movies, setFilteredMovies, data }: HeaderProps) {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const title = data.charAt(0).toUpperCase() + data.slice(1);
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
    "@media (min-width:600px)": {
      display: "none",
    },
  };
  return (
    <>
      <Box
        sx={{
          position: "relative",
          height: "75px",
          top: 0,
          width: "100%",
          zIndex: 1000,
          "@media (man-width:600px)": {
            position: "fixed",
          },
        }}
      >
        <Container
          sx={{
            position: "absolute",
            top: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            height: "50px",
            mt: 1,
            color: "white",
            "@media (max-width:600px)": {
              paddingLeft: 0,
              gap: "10px",
            },
          }}
        >
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
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
              gap: "20px",
              paddingRight: "50px",
              "@media (max-width:600px)": {
                paddingRight: "10px",
                gap: "10px",
              },
            }}
          >
            <Typography
              component="p"
              sx={{
                fontSize: "14px",
                opacity: 0.8,
                display: { xs: "none", sm: "block" },
              }}
            >
              12:30PM
            </Typography>
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                opacity: 0.8,
              }}
            >
              <WbSunnyIcon />
              <Typography variant="h6" sx={{ fontSize: "14px" }}>
                32°
              </Typography>
            </Box>

            <SearchBar movies={movies} setFilteredMovies={setFilteredMovies} />
            <UserProfile />
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Header;
