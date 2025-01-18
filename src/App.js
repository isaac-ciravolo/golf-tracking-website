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
import UserSettings from "./User/UserSettings.js";
import CoachSettings from "./Coach/CoachSettings.js";
import GamesView from "./Games/GamesView.js";

import { fetchUser } from "./firebase/DatabaseFunctions.js";

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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchUser((newUser, newCoach) => {
      setLoading(false);
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
        {loading ? (
          <LoadingView />
        ) : (
          <Box
            sx={{
              width: "100vw",
              height: "calc(100vh - 100px)",
              marginTop: "100px",
              overflow: "hidden",
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
              <Route path="/editGames/*" element={<GamesView user={user} />} />
              <Route
                path="/settings"
                element={
                  user &&
                  (!isCoach ? (
                    <UserSettings user={user} />
                  ) : (
                    <CoachSettings coach={user} />
                  ))
                }
              />
            </Routes>
          </Box>
        )}
      </ThemeProvider>
    </Box>
  );
};

export default App;
