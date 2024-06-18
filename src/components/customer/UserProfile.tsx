import { Avatar, Box } from "@mui/material";
import React from "react";
import avatar from "../../../public/avatar_profile.jpg";

function UserProfile() {
  return (
    <>
      <Box>
        <Avatar alt="Remy Sharp" src={avatar.src} />
      </Box>
    </>
  );
}

export default UserProfile;
