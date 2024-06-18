"use client";

import React, { use, useEffect, useState } from "react";
import DashboardCountCard from "./DashboardCountCard";
import { countChannels } from "@/server-actions/channelActions";
// import { useSocket } from "@/utils/socketUtils";

const ChannelCount: React.FC = () => {
  const [channelCount, setChannelCount] = useState<number>(0);

  const fetchChannelCount = async () => {
    try {
      const { count } = await countChannels();
      setChannelCount(count);
    } catch (error) {
      console.error("Error fetching channel count:", error);
    }
  };
  useEffect(() => {
    fetchChannelCount();
  }, []);
  // useSocket("channelsUpdated", fetchChannelCount);

  return (
    <DashboardCountCard
      title="Channels"
      value={channelCount}
      change="+12% This Month"
    />
  );
};

export default ChannelCount;
