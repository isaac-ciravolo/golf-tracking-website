import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./styles.css";

import { Box, createTheme, ThemeProvider } from "@mui/material";

import Header from "./components/header.js";
import UserView from "./User/UserView.js";
import LoadingView from "./views/LoadingView.js";
import LoginView from "./views/LoginView.js";
import SignUpView from "./views/SignUpView.js";
import CoachView from "./Coach/CoachView.js";
import ReadOnlyUserView from "./Coach/ReadOnlyUserView.js";
import GameView from "./Games/GameView.js";
import UserSettings from "./User/UserSettings.js";
import CoachSettings from "./Coach/CoachSettings.js";

import { fetchUser } from "./DatabaseFunctions.js";

const theme = createTheme({
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 4,
      },
    },
  },
  palette: {
    primary: {
      main: "#db7125", // orange color
    },
  },
});

const App = () => {
  const [isCoach, setIsCoach] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchUser((newUser, newCoach) => {
      if (!newUser && !newCoach) {
        if (location.pathname !== "/login" && location.pathname !== "/signup")
          navigate("/login");
        setUser(null);
      } else if (newUser) {
        setUser(newUser);
        setIsCoach(false);
      } else if (newCoach) {
        setUser(newCoach);
        setIsCoach(true);
      }
    });
  }, []);

  return (
    <Box
      className="App"
      style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
    >
      <ThemeProvider theme={theme}>
        <Header showLogOut={user !== null} />
        <Box
          sx={{
            width: "100vw",
            height: "calc(100vh - 100px)",
            marginTop: "100px",
          }}
        >
          <Routes>
            <Route
              path="/"
              element={user ? <Navigate to="/analysis" /> : <LoginView />}
            />
            <Route path="/login" element={<LoginView />} />
            <Route path="/signup" element={<SignUpView />} />
            <Route
              path="/analysis"
              element={
                user && user.name ? (
                  isCoach ? (
                    <CoachView user={user} />
                  ) : (
                    <UserView user={user} />
                  )
                ) : (
                  <LoadingView />
                )
              }
            />
            <Route path="/analysis/:id" element={<ReadOnlyUserView />} />
            <Route path="/editGames" element={<GameView user={user} />} />
            <Route
              path="/settings"
              element={
                user &&
                (!isCoach ? (
                  <UserSettings user={user} />
                ) : (
                  <CoachSettings user={user} />
                ))
              }
            />
          </Routes>
        </Box>
      </ThemeProvider>
    </Box>
  );
};

export default App;
