import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";

type DashboardCardProps = {
  title: string;
  value: number;
  change: string;
};

const DashboardCountCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  change,
}) => {
  return (
    <Card sx={{ marginBottom: 2, boxShadow: 3, position: "relative" }}>
      <Box
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          backgroundColor: "#053d75",
          color: "#fff",
          p: 1.5,
          borderRadius: "6px",
        }}
      >
        <PeopleOutlineIcon
          sx={{
            color: "#fff",
          }}
        />
      </Box>

      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography color="textSecondary" sx={{ marginBottom: 1.5 }}>
          {value}
        </Typography>
        <Typography variant="body2">{change}</Typography>
      </CardContent>
    </Card>
  );
};

export default DashboardCountCard;
