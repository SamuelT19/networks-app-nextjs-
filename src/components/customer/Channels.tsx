"use client";

import React, { useRef, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import hboLogo from "../../../public/channels/hbo-logo.png";
import abcLogo from "../../../public/channels/abc-logo.png";
import disneyLogo from "../../../public/channels/disney-logo.png";
import foxLogo from "../../../public/channels/fox-tv-logo.png";
import cnnLogo from "../../../public/channels/cnn-logo.png";
import espnLogo from "../../../public/channels/espn-hd-logo.png";
import netflixLogo from "../../../public/channels/netflixx-logo.png";
import nbcLogo from "../../../public/channels/nbc-logo.png";
import bbcLogo from "../../../public/channels/bbc-logo.png";

const channels = [
  { name: "ABC", logo: abcLogo },
  { name: "Disney", logo: disneyLogo },
  { name: "HBO", logo: hboLogo },
  { name: "Fox", logo: foxLogo },
  { name: "CNN", logo: cnnLogo },
  { name: "ESPN", logo: espnLogo },
  { name: "Netflix", logo: netflixLogo },
  { name: "NBC", logo: nbcLogo },
  { name: "BBC", logo: bbcLogo },
];

function Channels() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (container) {
        const children = Array.from(container.children) as HTMLDivElement[];
        let middleChild: HTMLDivElement | null = containerRef.current;
        const containerRect = container.getBoundingClientRect();
        let minDistance = Infinity;

        children.forEach((child) => {
          const childRect = child.getBoundingClientRect();
          const containerMiddleX = containerRect.left + containerRect.width / 2;
          const containerMiddleY = containerRect.top + containerRect.height / 2;
          const childMiddleX = (childRect.left + childRect.right) / 2;
          const childMiddleY = (childRect.top + childRect.bottom) / 2;

          const distance = Math.hypot(
            containerMiddleX - childMiddleX,
            containerMiddleY - childMiddleY
          );

          if (distance < minDistance) {
            minDistance = distance;
            middleChild = child;
          }

          child.classList.remove("middle");
        });

        if (middleChild) {
          middleChild.classList.add("middle");
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        "&::before, &::after": {
          content: '""',
          position: "absolute",
          left: 0,
          right: 0,
          height: "150px",
          zIndex: 1,
        },
        "&::before": {
          top: 0,
          background: "linear-gradient(to bottom, #121F4D, transparent)",
        },
        "&::after": {
          bottom: 0,
          background: "linear-gradient(to top, #121F4D, transparent)",
        },
        "@media (max-width:600px)": {
          position: "absolute",
          top: "45vh",
          left: 0,
          flexDirection: "row",
          height: "165px",
          width: "100%",
          zIndex: 100,
          overflowX: "scroll",
          overflowY: "hidden",
          display: "flex",
          gap: 4,
          "&::before, &::after": {
            content: '""',
            position: "absolute",
            width: "90px",
            height: "100%",
            zIndex: 1,
          },
          "&::before": {
            left: 0,
            background: "linear-gradient(to right, #121F4D, transparent)",
          },
          "&::after": {
            display: "none",
            right: 0,
            background: "linear-gradient(to left, #121F4D, transparent)",
          },
        },
        "@media (max-width:600px) and (max-height:750px)": {
          top: "33vh",
          height: "165px",
        },
        "@media (min-width:335px) and (max-width:600px) and (min-height:800px)": {
          top: "44vh",
        },
        "@media (max-width:550px) and (min-height:700px) and (max-height:800px)": {
          top: "29vh",
          height: "165px",
        },

      }}
    >
      <Box
        ref={containerRef}
        sx={{
          position: "sticky",
          left: "10%",
          top: 0,
          backgroundColor: "#121F4D",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          width: "220px",
          paddingBlock: 6,
          paddingInline: 3,
          gap: 6,
          overflowY: "scroll",
          scrollbarWidth: "none",
          "@media (max-width:600px)": {
            height: "100%",
            width: "100%",
            flexDirection: "row",
            paddingBlock: "0px",
            paddingInline: 6,
            gap: 4,
            alignItems: "center",
          },
          "@media (min-height:1000px)": {
            paddingTop: "10vh",
          },
        }}
      >
        {channels.map((channel, index) => (
          <Box
            key={index}
            className="channel-box"
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              textAlign: "center",
              transition: "transform 0.3s ease-in-out",
              gap: "20px",
              "@media (max-width:600px)": {
                flexDirection: "column",
                justifyContent: "center",
                width: "80px",
              },
              "&.middle .inner-box::after": {
                content: '""',
                position: "absolute",
                top: "-12px",
                left: "-11px",
                width: "calc(100% + 17px)",
                height: "calc(100% + 17px)",
                borderRadius: "50%",
                border: "3px solid rgba(255, 255, 255, 0.5)",
              },
              "&.middle": {
                transform: "scale(1.3) translate(30px)",
                "@media (max-width:600px)": {
                  transform: "scale(1.2)",
                },
              },
            }}
          >
            <Box
              className="inner-box"
              sx={{
                width: "50px",
                height: "50px",
                position: "relative",
                borderRadius: "50%",
                backgroundColor: "#1e3264",
                transition:
                  "transform 0.2s ease-in-out, border 0.2s ease-in-out, padding 0.2s ease-in-out",
                "@media (max-width:600px)": {
                  width: "60px",
                  height: "60px",
                },
                "@media (max-width:400px) and (max-height:750px)": {
                  width: "40px",
                  height: "40px",
                },
              }}
            >
              <Image
                src={channel.logo}
                alt={`${channel.name} logo`}
                className="channel-image"
                style={{
                  position: "absolute",
                  inset: "5px",
                  color: "transparent",
                  height: "80%",
                  width: "80%",
                  objectFit: "contain",
                  transition: "all 0.2s ease-in-out",
                }}
              />
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: "#fff",
                "@media (max-width:600px)": {
                  fontSize: "0.8rem",
                },
              }}
            >
              {channel.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default Channels;
