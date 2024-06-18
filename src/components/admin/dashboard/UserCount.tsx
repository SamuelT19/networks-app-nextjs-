"use client";

import React, { useEffect, useState } from "react";
import DashboardCountCard from "./DashboardCountCard";
import { usersCount } from "@/server-actions/userActions";

// import { useSocket } from "@/utils/socketUtils";

const UserCount: React.FC = () => {
  const [userCount, setUserCount] = useState<number>(0);

  const fetchUserCount = async () => {
    try {
      const result = await usersCount();
      
      if ('count' in result) {
        setUserCount(result.count); // TypeScript knows result is { count: number }
      } else {
        console.error("Error fetching user count:", result.error); // TypeScript knows result is { error: string }
      }
    } catch (error) {
      console.error("Error fetching user count:", error);
    }
  };
  useEffect(() => {
    fetchUserCount();
  }, [fetchUserCount]);

  // useSocket("updatedUser", fetchUserCount);

  return (
    <DashboardCountCard
      title="System Users"
      value={userCount}
      change="+12% This Month"
    />
  );
};

export default UserCount;
