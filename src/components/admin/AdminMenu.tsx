"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { AppAbility, defineAbilitiesFor } from "@/lib/abilities";
import { useProgramsContext } from "@/context/ProgramsContext";
import { UserWithRole } from "@/context/types";

function AdminMenu() {
  const pathname = usePathname();
  const { state } = useProgramsContext();

  const { user } = state;
  // const ability = defineAbilitiesFor(user as UserWithRole);

  const [ability, setAbility] = useState<AppAbility | null>(null);

  useEffect(() => {
    const fetchAbilities = async () => {
      const fetchedAbility = await defineAbilitiesFor(user as UserWithRole);
      setAbility(fetchedAbility); // Store the fetched ability in state
    };

    fetchAbilities();
  }, [user]);

  const buttonStyles = (path: string) => ({
    width: "100%",
    backgroundColor: pathname === path ? "#053d75" : "transparent",
    color: pathname === path ? "#fff" : "inherit",
    "&:hover": {
      backgroundColor: "#869eb5",
      color: "#fff",
    },
  });

  return (
    <Box
      sx={{
        minWidth: "15%",
        boxShadow: "10px 0px 5px -5px rgba(0, 0, 0, 0.2)",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          top: 50,
          left: 0,
          width: "15%",
          minHeight: "calc(100vh - 50px)",
          textAlign: "start",
          p: 0,
          mt: 1,
          zIndex: 10,
        }}
      >
        <Link href="/dashboard" passHref>
          <Button
            variant="text"
            startIcon={<DashboardIcon />}
            sx={buttonStyles("/dashboard")}
          >
            Dashboard
          </Button>
        </Link>

        {ability?.can("read", "Channel") && (
          <Link href="/channels" passHref>
            <Button
              variant="text"
              startIcon={<LiveTvIcon />}
              sx={buttonStyles("/channels")}
            >
              Channels
            </Button>
          </Link>
        )}
        {ability?.can("read", "Program") && (
          <Link href="/programs" passHref>
            <Button
              variant="text"
              startIcon={<MovieFilterIcon />}
              sx={buttonStyles("/programs")}
            >
              Programs
            </Button>
          </Link>
        )}
        {ability?.can("manage", "all") && (
          <>
            <Link href="/users" passHref>
              <Button
                variant="text"
                startIcon={<MovieFilterIcon />}
                sx={buttonStyles("/users")}
              >
                Users
              </Button>
            </Link>
            <Link href="/roles" passHref>
              <Button
                variant="text"
                startIcon={<MovieFilterIcon />}
                sx={buttonStyles("/roles")}
              >
                Roles
              </Button>
            </Link>
          </>
        )}
      </Box>
    </Box>
  );
}

export default AdminMenu;
