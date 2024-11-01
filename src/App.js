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
import UserView from "./views/UserView.js";
import LoadingView from "./views/LoadingView.js";
import LoginView from "./views/LoginView.js";
import SignUpView from "./views/SignUpView.js";
import CoachView from "./views/CoachView.js";

import generateClassCode from "./util/ClassCode.js";

import { auth } from "./firebase";
import { db } from "./firebase.js"; // Import Firestore config
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";

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
      main: "#4E2A84", // Purple color
    },
  },
});

function App() {
  const [games, setGames] = useState([]);
  const [user, setUser] = useState(null);
  const [isCoach, setIsCoach] = useState(false);
  const [coachClasses, setClasses] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const createClass = async (className) => {
    let newClassCode = generateClassCode();
    let classCodeExists = true;
    while (classCodeExists) {
      const classDocRef = doc(db, "classes", newClassCode);
      const classDocSnap = await getDoc(classDocRef);
      if (!classDocSnap.exists()) {
        classCodeExists = false;
      } else {
        newClassCode = generateClassCode(); // Generate a new class code if it already exists
      }
    }

    const newClass = {
      name: className,
      id: newClassCode,
      coach: user.id,
      students: [],
    };
    await setDoc(doc(db, "classes", newClassCode), newClass);
    setClasses((prevClasses) => [...prevClasses, newClass]);

    const updatedUser = {
      ...user,
      classes: [...user.classes, { id: newClassCode }],
    };
    setUser(updatedUser);
    const userDocRef = doc(db, "coaches", user.id);
    await setDoc(userDocRef, updatedUser);
  };

  useEffect(() => {
    const fetchUser = async () => {
      auth.onAuthStateChanged(async (user) => {
        if (!user) {
          if (location.pathname !== "/login" && location.pathname !== "/signup")
            navigate("/login");
          setUser(null);
          return;
        }
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUser(userDocSnap.data());
          setIsCoach(false);
          return;
        }

        const coachDocRef = doc(db, "coaches", user.uid);
        const coachDocSnap = await getDoc(coachDocRef);

        if (coachDocSnap.exists()) {
          setUser(coachDocSnap.data());
          setIsCoach(true);
          return;
        }

        console.error("User not found in Firestore.");
        setUser(null);
        navigate("/login");
      });
    };

    fetchUser();
  }, []);

  useEffect(() => {
    console.log(coachClasses);
    console.log([{ id: "123", name: "test", students: [] }]);
  }, [coachClasses]);

  useEffect(() => {
    if (!user || !user.id) return;

    const fetchGames = async () => {
      const userDocRef = doc(db, "users", user.id);
      const gamesCollectionRef = collection(userDocRef, "games");
      const gamesSnapshot = await getDocs(gamesCollectionRef);
      const userGames = [];
      gamesSnapshot.forEach((gameDoc) => {
        userGames.push({
          id: gameDoc.id,
          ...gameDoc.data(),
        });
      });
      userGames.sort((a, b) => a.gameDate - b.gameDate);
      setGames(userGames);
    };

    const fetchClasses = async () => {
      const newClasses = await Promise.all(
        user.classes.map(async (_class) => {
          const classDocRef = doc(db, "classes", _class.id);
          const classDocSnap = await getDoc(classDocRef);

          return classDocSnap.exists() ? classDocSnap.data() : null;
        })
      );
      setClasses(newClasses.filter(Boolean));
    };

    if (isCoach) fetchClasses();
    else fetchGames();
  }, [user]);

  const logOut = () => {
    const auth = getAuth();

    signOut(auth)
      .then(() => {
        navigate("/login"); // Redirect to login page
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Header showLogOut={user !== null} logOut={logOut} />
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
                  <CoachView
                    user={user}
                    coachClasses={coachClasses}
                    createClass={createClass}
                  />
                ) : (
                  <UserView user={user} games={games} />
                )
              ) : (
                <LoadingView />
              )
            }
          />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
