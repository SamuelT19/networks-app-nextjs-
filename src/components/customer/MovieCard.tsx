import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import {
  Favorite,
  WatchLater,
  FavoriteBorder,
  AccessTime,
  PlayCircleOutline,
} from "@mui/icons-material";
import { useProgramsContext } from "@/context/ProgramsContext";

interface MovieCardProps {
  title: string;
  length: string;
  poster: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ title, length, poster }) => {
  const { state, dispatch } = useProgramsContext();
  const isFavorite = state.favorites.includes(title);
  const isWatchLater = state.watchLater.includes(title);

  const handleFavoriteClick = () => {
    dispatch({ type: "TOGGLE_FAVORITE", payload: title });
  };

  const handleWatchLaterClick = () => {
    dispatch({ type: "TOGGLE_WATCH_LATER", payload: title });
  };

  const bottomBoxStyles = {
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "35%",
    height: 7,
    backgroundColor: "white",
    borderRadius: 2,
    zIndex: 1,
    opacity: 0, 
    transition: "opacity 0.2s",
  };

  return (
    <Card
      sx={{
        width: 260,
        position: "relative",
        margin: "16px",
        display: "inline-block",
        transform: "scale(1)",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.08)",
          "& .bottom-box": {
            opacity: 1,
          },
        },
        "@media (max-width: 600px),(min-width:700px) and (max-width:1050px) and (min-height:1000px)": {
          position: "relative",
          width: "100%",
        },
        backgroundImage: `url(${poster})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box
        sx={{
          position: "relative",
          height: "225px",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            position: "absolute",
            top: 10,
            right: 8,
            padding: "4px 8px",
            borderRadius: 1,
            color: "white",
            fontSize: "21px",
            zIndex:10
          }}
        >
          {length}
        </Typography>
      </Box>
      <CardContent>
        <Typography variant="h4" component="h4" fontWeight="600" color="white">
          {title}
        </Typography>
      </CardContent>
      <CardActions
        className="movie_card_icons"
        sx={{
          justifyContent: "center",
          background: "linear-gradient(to top, #121F4D,transparent)",
          borderRadius: "0 0 4px 4px",
          "@media (max-width: 600px)": {
            position: "absolute",
            right: "-13px",
            top: 0,
            bottom: 0,
            width: "110px",
            flexDirection: "column",
            justifyContent: "center",
            background: "linear-gradient(to right,transparent, #121F4D)",
          },
        }}
      >
        <IconButton aria-label="add to favorites" onClick={handleFavoriteClick}>
          {isFavorite ? (
            <Favorite color="error" />
          ) : (
            <FavoriteBorder sx={{ color: "white" }} />
          )}
        </IconButton>
        <IconButton aria-label="watch later" onClick={handleWatchLaterClick}>
          {isWatchLater ? (
            <WatchLater color="primary" />
          ) : (
            <AccessTime sx={{ color: "white" }} />
          )}
        </IconButton>
        <IconButton aria-label="play">
          <PlayCircleOutline sx={{ color: "white" }} />
        </IconButton>
      </CardActions>
      <Box className="bottom-box" sx={bottomBoxStyles} />
    </Card>
  );
};

export default MovieCard;
