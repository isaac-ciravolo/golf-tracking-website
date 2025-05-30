import React, { useState, useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import GamesListView from "./GamesListView";
import EditGameView from "./EditGameView";
import GameRouter from "./GameRouter";
import { useAuth } from "../firebase/AuthContext";

const GamesView = () => {
  const { currentUser: user } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
      <Box
        sx={{
          width: "200px",
          height: "calc(100vh - 100px)",
          backgroundColor: "lightGray",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          zIndex: 100,
          alignItems: "center",
          p: 3,
        }}
      >
        <Button
          variant="contained"
          sx={{ width: "90%", height: "48.5px" }}
          onClick={() => {
            navigate("/home");
          }}
        >
          ANALYSIS
        </Button>
        <Button
          variant="contained"
          sx={{ width: "90%", height: "48.5px" }}
          onClick={() => {
            navigate("/editGames");
          }}
        >
          ROUNDS
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "130px",
            backgroundColor: "rgb(240, 240, 240)",
            zIndex: 10,
          }}
        >
          <Box sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "baseline",
              }}
            >
              <Typography variant="h3" fontWeight="bold">
                {user && user.firstName && user.lastName
                  ? `${user.firstName.toUpperCase()} ${user.lastName.toUpperCase()}`
                  : "User"}
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="gray">
                Edit Games
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            height: "100%",
          }}
        >
          <Routes>
            <Route path="" element={<GamesListView userId={user.id} />} />
            <Route path=":gameId/*" element={<GameRouter userId={user.id} />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default GamesView;
