import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./styles.css";

import { Box, createTheme, ThemeProvider } from "@mui/material";

import Header from "./components/header.js";
import UserView from "./User/UserView.js";
import LoginView from "./views/LoginView.js";
import SignUpView from "./views/SignUpView.js";
import CoachView from "./Coach/CoachView.js";
import UserSettings from "./User/UserSettings.js";
import CoachSettings from "./Coach/CoachSettings.js";
import GamesView from "./Games/GamesView.js";
import ForgotPasswordView from "./views/ForgotPasswordView.js";
import { useAuth } from "./firebase/AuthContext.js";
import VerificationView from "./views/VerificationView.js";
import CoachClassesView from "./Coach/CoachClassesView.js";
import CoachAssignmentView from "./Coach/CoachAssignmentView.js";

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
  const { isCoach, userLoggedIn } = useAuth();
  return (
    <Box
      className="App"
      style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
    >
      <ThemeProvider theme={theme}>
        {userLoggedIn && <Header />}
        <Box
          sx={{
            width: "100vw",
            height: "calc(100vh - 100px)",
            marginTop: "100px",
            overflow: "hidden",
          }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/login" element={<LoginView />} />
            <Route path="/signup" element={<SignUpView />} />
            <Route path="/forgotpassword" element={<ForgotPasswordView />} />
            <Route path="/verify" element={<VerificationView />} />
            <Route
              path="/home"
              element={isCoach ? <CoachClassesView /> : <UserView />}
            />
            <Route
              path="/home/:id/*"
              element={
                isCoach ? (
                  <Routes>
                    <Route path="" element={<CoachView />} />
                    <Route
                      path="/assignments/:assignmentId"
                      element={<CoachAssignmentView />}
                    />
                  </Routes>
                ) : (
                  <UserView />
                )
              }
            />
            <Route
              path="/editGames/*"
              element={isCoach ? <Navigate to="/home" /> : <GamesView />}
            />
            <Route
              path="/settings"
              element={!isCoach ? <UserSettings /> : <CoachSettings />}
            />
          </Routes>
        </Box>
      </ThemeProvider>
    </Box>
  );
};

export default App;
