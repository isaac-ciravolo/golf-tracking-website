import { auth, db } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import generateClassCode from "./util/ClassCode";

export const createClass = async (className, coachId) => {
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
      coach: coachId,
      students: [],
    };

    await setDoc(doc(db, "classes", newClassCode), newClass);

    const coachDocRef = doc(db, "coaches", coachId);
    const coachDocSnap = await getDoc(coachDocRef);
    const newCoachData = coachDocSnap.data();
    newCoachData.classes.push(newClassCode);
    await setDoc(coachDocRef, newCoachData);
    return "Success!";
  } catch (error) {
    return error.message;
  }
};

export const fetchClass = async (classCode) => {
  const classDocRef = doc(db, "classes", classCode);
  const classDocSnap = await getDoc(classDocRef);

  if (!classDocSnap.exists()) {
    return "Class not found.";
  }

  return classDocSnap.data();
};

export const addRequest = async (classCode, userId, userName) => {
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

    await setDoc(requestDocRef, { userId, name: userName });
    return "Success!";
  } catch (error) {
    return error.message;
  }
};

export const acceptRequest = async (classCode, userId) => {
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
    return "Success!";
  } catch (error) {
    return error.message;
  }
};

export const fetchRequests = async (classCode) => {
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

export const fetchUser = async (callback) => {
  try {
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        callback(null, null);
        return;
      }
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        callback(userDocSnap.data(), false);
        return;
      }

      const coachDocRef = doc(db, "coaches", user.uid);
      const coachDocSnap = await getDoc(coachDocRef);

      if (coachDocSnap.exists()) {
        callback(null, coachDocSnap.data());
        return;
      }

      console.error("User not found in Firestore.");
      callback(null, null);
    });
  } catch (error) {
    console.error(error.message);
    callback(null, null);
  }
};

export const fetchGames = async (userId) => {
  try {
    const userDocRef = doc(db, "users", userId);
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
    return userGames;
  } catch (error) {
    return error.message;
  }
};

export const fetchClasses = async (id) => {
  try {
    const coachDocRef = doc(db, "coaches", id);
    const coachDocSnap = await getDoc(coachDocRef);
    if (coachDocSnap.exists()) {
      const coachData = coachDocSnap.data();
      const coachClasses = await Promise.all(
        coachData.classes.map(async (classId) => {
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

      const filteredClasses = coachClasses.filter((cls) => cls !== null);
      return filteredClasses;
    }

    const userDocRef = doc(db, "users", id);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
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
      return filteredClasses;
    }
  } catch (error) {
    return error.message;
  }
};

export const fetchStudent = async (studentId) => {
  try {
    const studentDocRef = doc(db, "users", studentId);
    const studentDocSnap = await getDoc(studentDocRef);

    if (!studentDocSnap.exists()) {
      return "Student not found.";
    }

    return studentDocSnap.data();
  } catch (error) {
    return error.message;
  }
};

export const logOut = () => {
  try {
    const auth = getAuth();
    signOut(auth);
  } catch (error) {
    return error.message;
  }
};

export const addGame = async (userId, gameData) => {
  try {
    const gamesCollectionRef = collection(db, "users", userId, "games");
    await addDoc(gamesCollectionRef, gameData);
    return "Success!";
  } catch (error) {
    return error.message;
  }
};

export const listenToGames = (userId, setGames) => {
  const gamesCollectionRef = collection(db, "users", userId, "games");

  const unsubscribe = onSnapshot(gamesCollectionRef, (querySnapshot) => {
    const games = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setGames(games);
  });

  return unsubscribe;
};

export const deleteAccount = async (userId) => {
  try {
    const userDocRef = doc(db, "users", userId);
    await deleteDoc(userDocRef);

    const user = auth.currentUser;
    if (user && user.uid === userId) {
      await user.delete();
    }

    return "Success!";
  } catch (error) {
    return error.message;
  }
};

export const deleteGame = async (userId, gameId) => {
  try {
    const gameDocRef = doc(db, "users", userId, "games", gameId);
    await deleteDoc(gameDocRef);
    return "Success!";
  } catch (error) {
    return error.message;
  }
};

export const updateGame = async (userId, gameId, gameData) => {
  try {
    const gameDocRef = doc(db, "users", userId, "games", gameId);
    await setDoc(gameDocRef, gameData);
    return "Success!";
  } catch (error) {
    return error.message;
  }
};

export const fetchGame = async (userId, gameId) => {
  try {
    const gameDocRef = doc(db, "users", userId, "games", gameId);
    const gameDocSnap = await getDoc(gameDocRef);

    if (!gameDocSnap.exists()) {
      return "Game not found.";
    }

    return gameDocSnap.data();
  } catch (error) {
    return error.message;
  }
};
