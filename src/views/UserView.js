import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import OverviewView from "./OverviewView.js";
import DrivingView from "./DrivingView.js";
import ApproachView from "./ApproachView.js";
import GreenView from "./GreenView.js";
import CardView from "./CardView.js";
import AdvancedView from "./AdvancedView.js";
import { Box, Tab, Tabs, Typography } from "@mui/material";

const UserView = ({ data, users }) => {
  const { userId } = useParams();
  const [value, setValue] = useState(0);
  const [currentHoles, setCurrentHoles] = useState([]);
  const [selectedGames, setSelectedGames] = useState([]);

  useEffect(() => {
    setSelectedGames(data[userId]);
  }, [data]);

  useEffect(() => {
    const newHoles = [];
    selectedGames.forEach((game) => {
      game.holes.forEach((hole) => {
        newHoles.push(hole);
      });
    });
    setCurrentHoles(newHoles);
  }, [selectedGames]);

  return (
    <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
      <Box
        sx={{
          width: "150px",
          height: "100vh",
          backgroundColor: "lightGray",
          p: 3,
        }}
      >
        <Typography textAlign="center" fontWeight={"bold"}>
          Select Games
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          p: 3,
        }}
      >
        <Typography variant="h3" fontWeight="bold" sx={{ width: "100%" }}>
          {users[userId].name.toUpperCase()}
        </Typography>
        <Tabs value={value} onChange={(event, newValue) => setValue(newValue)}>
          <Tab label="Overview" index={0} />
          <Tab label="Driving" index={1} />
          <Tab label="Approach" index={2} />
          <Tab label="Green" index={3} />
          <Tab label="Card" index={4} />
          <Tab label="Advanced" index={5} />
        </Tabs>
        <Box
          sx={{
            width: "100%",
            p: 3,
            ...(value !== 0 && { display: "none" }),
          }}
        >
          <OverviewView currentHoles={currentHoles} />
        </Box>
        <Box
          sx={{
            width: "100%",
            p: 3,
            ...(value !== 1 && { display: "none" }),
          }}
        >
          <DrivingView currentHoles={currentHoles} />
        </Box>
        <Box
          sx={{
            width: "100%",
            p: 3,
            ...(value !== 2 && { display: "none" }),
          }}
        >
          <ApproachView currentHoles={currentHoles} />
        </Box>
        <Box
          sx={{
            width: "100%",
            p: 3,
            ...(value !== 3 && { display: "none" }),
          }}
        >
          <GreenView currentHoles={currentHoles} />
        </Box>
        <Box
          sx={{
            width: "100%",
            p: 3,
            ...(value !== 4 && { display: "none" }),
          }}
        >
          <CardView currentHoles={currentHoles} />
        </Box>
        <Box
          sx={{
            width: "100%",
            p: 3,
            ...(value !== 5 && { display: "none" }),
          }}
        >
          <AdvancedView currentHoles={currentHoles} />
        </Box>
      </Box>
    </Box>
  );
};

export default UserView;
