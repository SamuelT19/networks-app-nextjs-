"use client";

import { allPrograms, fetchPrograms } from "@/server-actions/programActions";
// import { useSocket } from "@/utils/socketUtils";
import { Box, Card, CardContent, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface Program {
  id: number;
  category: {
    id: number;
    name: string;
  };
}

const ProgramCategoryPieChart: React.FC = () => {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];
  const categories = [
    { id: 1, name: "Recommended" },
    { id: 2, name: "Popular" },
    { id: 3, name: "Featured" },
  ];

  const [programData, setProgramData] = useState<Program[]>([]);
  const [isError, setIsError] = useState<boolean>(false);

  const programsData = async () => {
    try {
      const records = await allPrograms();
      setProgramData(records);
      setIsError(false);
    } catch (error) {
      console.error("Error fetching program categories:", error);
      setIsError(true);
    }
  };

  useEffect(() => {
    programsData();
  }, []);
  // useSocket("programsUpdated", fetchPrograms);

  const getCategoryCounts = () => {
    const categoryCounts = new Map<string, number>();
    categories.forEach((category) => {
      categoryCounts.set(category.name, 0);
    });

    programData.forEach((program) => {
      const categoryName = program.category.name;
      const currentCount = categoryCounts.get(categoryName) || 0;
      categoryCounts.set(categoryName, currentCount + 1);
    });

    return Array.from(categoryCounts.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  };

  const data = getCategoryCounts();

  return (
    <Card sx={{ boxShadow: "2px 2px 5px 5px rgba(0, 0, 0, 0.2)" }}>
      <CardContent>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{
            display: "inline-block",
            padding: "20px",
            color: "white",
            backgroundColor: "black",
            borderRadius: "5px",
          }}
        >
          Programs by Category
        </Typography>

        {isError ? (
          <Typography color="error">Error loading data</Typography>
        ) : (
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ResponsiveContainer width="50%" height={350}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  fill="#8884d8"
                  dataKey="count"
                  label
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <Box>
              <Typography variant="h5" component="h6" color="black" mb="4">
                Total Programs
              </Typography>
              {data.map((entry, index) => (
                <Box
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: COLORS[index % COLORS.length],
                      marginRight: "10px",
                    }}
                  ></div>
                  <span>
                    {entry.name}: {entry.count}
                  </span>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgramCategoryPieChart;
