"use client";

import React, { useEffect, useState } from "react";
import DashboardCountCard from "./DashboardCountCard";
import { usersCount } from "@/server-actions/userActions";

// import { useSocket } from "@/utils/socketUtils";

const UserCount: React.FC = () => {
  const [userCount, setUserCount] = useState<number>(0);

  const fetchUserCount = async () => {
    try {
      const {count } = await usersCount();
      let counted = count !== undefined ? count : 0;
      setUserCount(counted);
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
