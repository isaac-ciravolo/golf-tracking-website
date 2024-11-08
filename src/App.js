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
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
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

const App = () => {
  const [games, setGames] = useState([]);
  const [user, setUser] = useState(null);
  const [isCoach, setIsCoach] = useState(false);
  const [coachClasses, setClasses] = useState([]);
  const [requests, setRequests] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const createClass = async (className) => {
    try {
      if (className === "") return "Please enter a class name.";
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

      const userDocRef = doc(db, "coaches", user.id);
      await setDoc(doc(userDocRef, "classes", newClassCode), {});
    } catch (error) {
      return error.message;
    }
  };

  const fetchClass = async (classCode) => {
    const classDocRef = doc(db, "classes", classCode);
    const classDocSnap = await getDoc(classDocRef);

    if (!classDocSnap.exists()) {
      return "Class not found.";
    }

    return classDocSnap.data();
  };

  const addRequest = async (classCode, userId) => {
    try {
      const classDocRef = doc(db, "classes", classCode);
      const classDocSnap = await getDoc(classDocRef);

      if (!classDocSnap.exists()) {
        return "Class not found.";
      }

      if (classDocSnap.data().students.includes(userId)) {
        return "You are already a member of this class.";
      }

      const requestsCollectionRef = collection(classDocRef, "requests");
      const requestDocRef = doc(requestsCollectionRef, userId);
      const requestDocSnap = await getDoc(requestDocRef);

      if (requestDocSnap.exists()) {
        return "You have already requested to join this class.";
      }

      await setDoc(requestDocRef, { userId, name: user.name });
    } catch (error) {
      return error.message;
    }
  };

  const acceptRequest = async (classCode, userId) => {
    try {
      const classDocRef = doc(db, "classes", classCode);
      const classDocSnap = await getDoc(classDocRef);

      if (!classDocSnap.exists()) {
        return "Class not found.";
      }

      const requestsCollectionRef = collection(classDocRef, "requests");
      const requestDocRef = doc(requestsCollectionRef, userId);
      const requestDocSnap = await getDoc(requestDocRef);

      if (!requestDocSnap.exists()) {
        return "Request not found.";
      }

      await deleteDoc(requestDocRef);

      const classData = classDocSnap.data();
      classData["students"].push(userId);
      await setDoc(classDocRef, classData);
    } catch (error) {
      return error.message;
    }
  };

  const fetchRequests = async (classCode) => {
    try {
      const classDocRef = doc(db, "classes", classCode);
      const classDocSnap = await getDoc(classDocRef);

      if (!classDocSnap.exists()) {
        return "Class not found.";
      }

      const requestsCollectionRef = collection(classDocRef, "requests");
      const requestsSnapshot = await getDocs(requestsCollectionRef);

      const requests = [];
      requestsSnapshot.forEach((requestDoc) => {
        requests.push({
          id: requestDoc.id,
          ...requestDoc.data(),
        });
      });

      return requests;
    } catch (error) {
      return error.message;
    }
  };

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
    const userDocRef = doc(db, "coaches", user.id);
    const userDocSnap = await getDoc(userDocRef);
    const userData = userDocSnap.data();
    const userClasses = await Promise.all(
      userData.classes.map(async (classId) => {
        const classDocRef = doc(db, "classes", classId);
        const classDocSnap = await getDoc(classDocRef);

        if (classDocSnap.exists()) {
          return {
            id: classId,
            ...classDocSnap.data(),
          };
        }
        return null;
      })
    );

    const filteredClasses = userClasses.filter((cls) => cls !== null);
    setClasses(filteredClasses);
  };

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

  useEffect(() => {
    if (!user || !user.id) return;

    if (isCoach) fetchClasses();
    else fetchGames();
  }, [user]);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchAllRequests = async () => {
      const newRequests = {};
      await Promise.all(
        coachClasses.map(async (cls) => {
          const currRequests = await fetchRequests(cls.id);
          newRequests[cls.id] = currRequests;
        })
      );
      setRequests(newRequests);
    };

    fetchAllRequests();
  }, [coachClasses]);

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
                    requests={requests}
                    acceptRequest={acceptRequest}
                  />
                ) : (
                  <UserView user={user} games={games} addRequest={addRequest} />
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
};

export default App;
