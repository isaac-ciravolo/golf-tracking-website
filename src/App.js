import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./styles.css";

import { createTheme, ThemeProvider } from "@mui/material";

import Header from "./components/header.js";
import UserView from "./User/UserView.js";
import LoadingView from "./views/LoadingView.js";
import LoginView from "./views/LoginView.js";
import SignUpView from "./views/SignUpView.js";
import CoachView from "./Coach/CoachView.js";
import ReadOnlyUserView from "./Coach/ReadOnlyUserView.js";

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

  // useEffect(() => {
  //   const fetchAllRequests = async () => {
  //     const newRequests = {};
  //     await Promise.all(
  //       coachClasses.map(async (cls) => {
  //         const currRequests = await fetchRequests(cls.id);
  //         newRequests[cls.id] = currRequests;
  //       })
  //     );
  //     setRequests(newRequests);
  //   };

  //   fetchAllRequests();
  // }, [coachClasses]);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Header showLogOut={user !== null} />
        <div style={{ height: "100px" }}></div>

        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/profile" /> : <LoginView />}
          />
          <Route path="/login" element={<LoginView />} />
          <Route path="/signup" element={<SignUpView />} />
          <Route
            path="/profile"
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
          <Route path="/view/:id" element={<ReadOnlyUserView />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
};

export default App;
