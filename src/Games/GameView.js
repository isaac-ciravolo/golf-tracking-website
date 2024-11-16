import React, { useState, useEffect } from "react";
import { listenToGames } from "../DatabaseFunctions";
import { Box, Button, Typography } from "@mui/material";
const GameView = ({ user }) => {
  const [games, setGames] = useState([]);
  const [value, setValue] = useState(0);

  useEffect(() => {
    console.log(user);
    if (user && user.id) {
      let unsubscribe;

      const fetchData = async () => {
        unsubscribe = await listenToGames(user.id, setGames);
      };

      fetchData();

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [user]);

  return (
    <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
      <Box
        sx={{
          width: "200px",
          height: "100vh",
          backgroundColor: "lightGray",
          position: "fixed",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          zIndex: 100,
        }}
      ></Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          marginLeft: "200px",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "fixed",
            width: "100%",
            height: "130px",
            backgroundColor: "rgb(240, 240, 240)",
            zIndex: 10,
          }}
        >
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <Typography variant="h3" fontWeight="bold">
                {user && user.name && user.name.toUpperCase()}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ marginTop: "130px", width: "1200px" }}>
          <Box
            sx={{
              width: "100%",
              p: 3,
              ...(value !== 0 && { display: "none" }),
            }}
          >
            <Box>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                {games.map((game) => (
                  <Button
                    key={game.id}
                    variant="contained"
                    sx={{ height: "100px", width: "300px" }}
                  >
                    <Typography fontSize="20px">{game.title}</Typography>
                  </Button>
                ))}
                <Button
                  variant="contained"
                  sx={{ height: "100px", width: "300px" }}
                >
                  <Typography fontSize="20px">Add Game</Typography>
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GameView;
