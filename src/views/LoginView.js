import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase/firebase";
import { Navigate, useNavigate } from "react-router-dom";
import { Typography, Paper, Box, Button, TextField, Link } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from "../firebase/auth.js";
import { useAuth } from "../firebase/AuthContext.js";

function LoginView() {
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/analysis");
      } catch (error) {
        if (error.message === "Firebase: Error (auth/invalid-email).")
          setErrorMessage("Invalid email");
        else if (error.message === "Firebase: Error (auth/invalid-credential).")
          setErrorMessage("Invalid email or password");
        else setErrorMessage(error.message);
        setIsSigningIn(false);
      }
    }
  };

  const onGoogleSignIn = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithGoogle();
        navigate("/analysis");
      } catch (error) {
        setErrorMessage(error.message);
        setIsSigningIn(false);
      }
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: 10,
        overflowY: "auto",
        marginTop: "100px",
      }}
    >
      <img
        src={"/images/eeaLoginLogo.png"}
        alt="EEA Logo"
        style={{ width: "548px", paddingRight: "100px" }}
      />

      {userLoggedIn && <Navigate to={"/analysis"} replace={true} />}
      <Paper
        sx={{
          display: "flex",
          width: "500px",
          p: 3,
        }}
      >
        <form onSubmit={onSubmit} style={{ width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <Typography variant="h3" fontWeight="bold">
              Login
            </Typography>

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

            <LoadingButton
              type="submit"
              variant="contained"
              fullWidth
              sx={{ height: "50px", width: "100%", fontSize: "20px" }}
              loading={isSigningIn}
            >
              LOGIN
            </LoadingButton>

            <Typography>
              New User? <Link href="/signup">Register Here</Link>
            </Typography>
            <Typography>
              Forgot Password? <Link href="/forgotpassword">Reset Here</Link>
            </Typography>
            <Typography color="error">{errorMessage}</Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default LoginView;
