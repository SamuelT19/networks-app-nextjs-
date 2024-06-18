"use client";

import React, { useEffect, useState } from "react";
import DashboardCountCard from "./DashboardCountCard";
import { countPrograms } from "@/server-actions/programActions";
// import { useSocket } from "@/utils/socketUtils";

const ProgramCount: React.FC = () => {
  const [programCount, setProgramCount] = useState<number>(0);

  const fetchProgramCount = async () => {
    try {
      const { count } = await countPrograms();
      setProgramCount(count);
    } catch (error) {
      console.error("Error fetching program count:", error);
    }
  };
  useEffect(() => {
    fetchProgramCount();
  }, []);

  // useSocket("programsUpdated", fetchProgramCount);

  return (
    <DashboardCountCard
      title="Programs"
      value={programCount}
      change="+12% This Month"
    />
  );
};

export default ProgramCount;
