"use client";

import React, { useEffect, useState } from "react";
import { Box, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface Movie {
  Title: string;
  Runtime: string;
  Poster: string;
}

interface HeaderProps {
  movies: Movie[];
  setFilteredMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
}

function SearchBar({ movies, setFilteredMovies }: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchClicked, setIsSearchClicked] = useState(false);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter((movie: Movie): boolean =>
        movie.Title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  }, [searchTerm, movies]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const toggleSearchField = () => {
    setIsSearchClicked(!isSearchClicked);
    if (!isSearchClicked) {
      setSearchTerm("");
    }
  };
  return (
    <>
      {isSearchClicked ? (
        <Box
          sx={{
            marginBottom: "16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onBlur={toggleSearchField}
        >
          <TextField
            id="search"
            label="Search"
            variant="standard"
            value={searchTerm}
            onChange={handleSearchChange}
            fullWidth
            sx={{
              color: "white",
              "& .MuiInputBase-input": {
                color: "white",
              },
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "40px",
            height: "40px",
            backgroundColor: "#5f5f61",
            borderRadius: "50%",
          }}
          onClick={toggleSearchField}
        >
          <SearchIcon />
        </Box>
      )}
    </>
  );
}

export default SearchBar;
