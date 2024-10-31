import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import { Typography, Paper, Box, Button, TextField, Link } from "@mui/material";
import { autocompleteClasses } from "@mui/material";
import { sortingOptions } from "../util/Constants";

function SignUpView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function isValidEmail(email) {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (email === "") {
        setErrorMessage("Please enter an email");
        return;
      }
      if (!isValidEmail(email)) {
        setErrorMessage("Invalid email");
        return;
      }
      if (password === "") {
        setErrorMessage("Please enter a password");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match");
        return;
      }
      if (password.length <= 6) {
        setErrorMessage("Password must be at least 7 characters long");
        return;
      }
      if (name === "") {
        setErrorMessage("Please enter a name");
        return;
      }

      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          id: user.uid,
          email: user.email,
          name: name,
          joined: new Date().getTime() / 1000,
          sortBy: sortingOptions[0],
        });
      }
    } catch (error) {
      if (error.message === "Firebase: Error (auth/email-already-in-use).")
        setErrorMessage("Email already in use");
      else setErrorMessage(error.message);
    }
  };

  return (
    <Paper
      style={{
        display: "flex",
        margin: "auto",
        width: "500px",
        padding: "20px",
        marginTop: "50px",
      }}
    >
      <form onSubmit={handleRegister} style={{ width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <Typography variant="h3" fontWeight="bold">
            Sign Up
          </Typography>

          <TextField
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            placeholder="Enter name"
            value={name}
            sx={{ width: "100%" }}
            onChange={(e) => {
              setName(e.target.value);
              setErrorMessage("");
            }}
          />

          <TextField
            label="Email address"
            type="email"
            fullWidth
            variant="outlined"
            placeholder="Enter email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMessage("");
            }}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            placeholder="Enter password"
            value={password}
            sx={{ width: "100%" }}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMessage("");
            }}
          />

          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            variant="outlined"
            placeholder="Confirm password"
            value={confirmPassword}
            sx={{ width: "100%" }}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrorMessage("");
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ height: "50px", width: "100%", fontSize: "20px" }}
          >
            SIGN UP
          </Button>

          <Typography>
            Already Signed Up? <Link href="/login">Login Here</Link>
          </Typography>
          <Typography color="error">{errorMessage}</Typography>
        </Box>
      </form>
    </Paper>
  );
}
export default SignUpView;
