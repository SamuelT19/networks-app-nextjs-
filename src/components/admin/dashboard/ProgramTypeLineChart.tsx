"use client";

import { allPrograms } from "@/server-actions/programActions";
// import { useSocket } from "@/utils/socketUtils";
import { Box, Card, CardContent, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface Program {
  id: number;
  airDate: string;
  type: {
    id: number;
    name: string;
  };
}

const ProgramTypeLineChart: React.FC = () => {
  const [programTypeData, setProgramTypeData] = useState<
    Array<{ [key: string]: string | number }>
  >([]);

  const [dataCount, setDataCount] = useState<Program[]>([]);
  const types = [
    { id: 1, name: "Live TV" },
    { id: 2, name: "Movies" },
    { id: 3, name: "TV Shows" },
    { id: 4, name: "Sports" },
  ];

  const COLORS = ["#f2281d", "#48f21d", "#1d2bf2", "#eff21d"];

  const getDayOfMonth = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    if (day <= 5) return 5;
    if (day <= 10) return 10;
    if (day <= 15) return 15;
    if (day <= 20) return 20;
    if (day <= 25) return 25;
    return 30;
  };

  const aggregateProgramData = (records: Array<Program>) => {
    const aggregatedData: Array<{ [key: string]: string | number }> = [
      { day: 5 },
      { day: 10 },
      { day: 15 },
      { day: 20 },
      { day: 25 },
      { day: 30 },
    ];

    aggregatedData.forEach((data) => {
      types.forEach((type) => {
        data[type.name] = 0;
      });
    });

    records.forEach((program) => {
      const day = getDayOfMonth(program.airDate);
      const dayIndex = aggregatedData.findIndex((item) => item.day === day);
      types.forEach((type) => {
        if (program.type.id === type.id) {
          for (let i = dayIndex; i < aggregatedData.length; i++) {
            aggregatedData[i][type.name] =
              (aggregatedData[i][type.name] as number) + 1;
          }
        }
      });
    });

    return aggregatedData;
  };

  const getTypeCounts = () => {
    const typeCounts = new Map<string, number>();
    types.forEach((type) => {
      typeCounts.set(type.name, 0);
    });

    dataCount.forEach((program) => {
      const typeName = program.type.name;
      const currentCount = typeCounts.get(typeName) || 0;
      typeCounts.set(typeName, currentCount + 1);
    });

    return Array.from(typeCounts.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  };

  const data = getTypeCounts();

  const fetchProgramData = async () => {
    try {
      const records  = await allPrograms();
      setProgramTypeData(aggregateProgramData(records));
      setDataCount(records);
    } catch (error) {
      console.error("Error fetching program types:", error);
    }
  };
  useEffect(() => {
    fetchProgramData();
  }, []);

  // useSocket("programsUpdated", fetchProgramData);

  return (
    <Card
      sx={{
        marginTop: "20px",
        boxShadow: "2px 2px 5px 5px rgba(0, 0, 0, 0.2)",
      }}
    >
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
          Programs by Types
        </Typography>
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LineChart
            width={600}
            height={400}
            data={programTypeData}
            margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              label={{
                value: "Days of the Month",
                position: "insideBottom",
                marginTop: "29px",
              }}
              ticks={[5, 10, 15, 20, 25, 30]}
            />
            <YAxis
              label={{
                value: "Total Programs",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Legend style={{ marginTop: "50px" }} />
            {types.map((type, index) => (
              <Line
                key={type.id}
                type="monotone"
                dataKey={type.name}
                stroke={COLORS[index]}
              />
            ))}
          </LineChart>

          <Box>
            <Typography variant="h5" component="h6" color="black" mb="2">
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
                <Box
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    backgroundColor: COLORS[index % COLORS.length],
                    marginRight: "10px",
                  }}
                ></Box>
                <span>
                  {entry.name}: {entry.count}
                </span>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProgramTypeLineChart;
