"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import MovieCard from "./MovieCard";
import Header from "./Header";
import { Movie } from "@/context/types";
import { fetchMovies } from "./FetchMovies";
import { useProgramsContext } from "@/context/ProgramsContext";

interface MoviesListProps {
  data: string;
}

const MoviesList: React.FC<MoviesListProps> = ({ data }) => {
  const { state } = useProgramsContext();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesData = await fetchMovies();
        if (data === "movies") {
          setMovies(moviesData);
        } else if (data === "favorites") {
          const favoriteMovies = moviesData.filter((movie: Movie) =>
            state.favorites.includes(movie.Title)
          );
          setFilteredMovies(favoriteMovies);
        } else if (data === "watchLater") {
          const watchLaterMovies = moviesData.filter((movie: Movie) =>
            state.watchLater.includes(movie.Title)
          );
          setFilteredMovies(watchLaterMovies);
        }
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };

    fetchData();
  }, [data, state]);

  const convertMinutesToHours = (minutes: string) => {
    let match = minutes.match(/^(\d+)/);

    if (match) {
      let numericPart = match[1];
      let timeInMinutes = parseInt(numericPart, 10);
      if (timeInMinutes < 60) {
        return `${timeInMinutes}m`;
      }
      const hours = Math.floor(timeInMinutes / 60);
      const mins = timeInMinutes % 60;
      return `${hours}h ${mins}m`;
    } else {
      return minutes;
    }
  };

  return (
    <>
      <Container
        sx={{
          position: "relative",
          backgroundColor: "#121f4d",
          minHeight: "100vh",
          paddingTop: isSmallScreen ? "130px" : "35px",
          "@media (min-width:600px)": {
            width: "100%",
          },
        }}
      >
        <Box
          sx={{
            position: isSmallScreen ? "fixed" : "relative",
            top: isSmallScreen ? "35px" : 0,
            width: "100%",
            zIndex: 1000,
            backgroundColor: "#121f4d",
          }}
        >
          <Header
            movies={movies}
            setFilteredMovies={setFilteredMovies}
            data={data}
          />
          {data === "movies" && (
            <Container
              sx={{
                height: "50px",
                top: isSmallScreen ? "60px" : "auto",
                width: "100%",
                zIndex: 1000,
                backgroundColor: "#121f4d",
                paddingTop: isSmallScreen ? "10px" : "0",
              }}
            >
              <Grid container gap="40px" color="white" mb={1}>
                {["Recommended", "Popular", "Featured"].map((text) => (
                  <Typography
                    key={text}
                    variant="h3"
                    sx={{
                      fontSize: "1rem",
                      fontWeight: 500,
                      opacity: 0.8,
                      "&:hover": {
                        opacity: 1,
                        transform: "scale(1.1)",
                        transition: "all 0.3s ease",
                      },
                    }}
                  >
                    {text}
                  </Typography>
                ))}
              </Grid>
              <hr />
            </Container>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "103%",
            height: "470px",
            overflowY: "auto",
            whiteSpace: "nowrap",
            padding: "25px 10px",
            "@media (min-width: 700px) and (max-width: 1050px) and (min-height: 1000px)":
              {
                minHeight: "calc(100vh - 165px)",
                scrollbarWidth: "none",
              },
            "@media (max-width: 600px)": {
              minHeight: "calc(100vh - 130px)",
              scrollbarWidth: "none",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              "@media (max-width:600px),(min-width:700px) and (max-width:1050px) and (min-height:1000px)":
                {
                  flexDirection: "column",
                  width: "80%",
                  margin: "auto",
                },
            }}
          >
            {filteredMovies.length === 0 ? (
              <Typography variant="h6" color="red" fontWeight={500}>
                No data of {data}, Please add some
              </Typography>
            ) : (
              filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.Title}
                  title={movie.Title}
                  length={convertMinutesToHours(movie.Runtime)}
                  poster={movie.Poster}
                />
              ))
            )}
          </Box>
          <Box
            sx={{
              height: "70%",
              width: "15%",
              position: "absolute",
              right: "-13px",
              background: "linear-gradient(to right,transparent, #121F4D)",
              "@media (max-width: 600px), (min-width: 700px) and (max-width: 1050px) and (min-height: 1000px)":
                {
                  height: "25%",
                  width: "100%",
                  position: "absolute",
                  bottom: 0,
                  background: "linear-gradient(to top, #121F4D, transparent )",
                },
            }}
          ></Box>
        </Box>
      </Container>
    </>
  );
};

export default MoviesList;
