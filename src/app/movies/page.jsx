'use client'
import React from 'react'
import Navigate from '@/components/customer/Navigate'
import MoviesList from '@/components/customer/MoviesList'
import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function Movies() {

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
 

  return (
    <>
      <Box sx={{ display: "flex", backgroundColor: "#121f4d" }}>
        {!isSmallScreen && <Navigate />}
        <MoviesList data="movies" />
      </Box>
    </>
  )
}

export default Movies
