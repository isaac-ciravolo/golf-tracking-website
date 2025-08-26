import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  Link,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { createUser } from "../database/UserFunctions";

function SignUpView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [accountType, setAccountType] = useState("user");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function isValidEmail(email) {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  }

  const handleRegister = async (e) => {
    setLoading(true);
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
      if (firstName === "") {
        setErrorMessage("Please enter a first name");
        return;
      }
      if (lastName === "") {
        setErrorMessage("Please enter a last name");
        return;
      }
      const res = await createUser(
        email,
        password,
        firstName,
        lastName,
        accountType !== "user"
      );

      if (res.status != 201)
        setErrorMessage(`Error ${res.status}: ${res.message}`);
      else {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/verify");
      }
    } catch (error) {
      if (error.message === "Firebase: Error (auth/email-already-in-use).")
        setErrorMessage("Email already in use");
      else setErrorMessage(error.message);
    }
    setLoading(false);
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
        marginBottom: 10,
      }}
    >
      <Paper
        sx={{
          display: "flex",
          width: "500px",
          p: 3,
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

            <Typography textAlign={"center"} fontWeight={"bold"}>
              Account Type
            </Typography>
            <Box
              sx={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <ToggleButtonGroup
                value={accountType}
                exclusive
                onChange={(e, value) => setAccountType(value)}
              >
                <ToggleButton sx={{ width: "200px" }} value="user">
                  User
                </ToggleButton>
                <ToggleButton sx={{ width: "200px" }} value="coach">
                  Coach
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Typography textAlign={"center"}>
              {accountType === "user"
                ? "Users have the ability to input data and view their progress."
                : "Coaches have the ability to create classes for users to join."}
            </Typography>

            <TextField
              label="First name"
              type="text"
              fullWidth
              variant="outlined"
              placeholder="Enter first name"
              value={firstName}
              sx={{ width: "100%" }}
              onChange={(e) => {
                setFirstName(e.target.value);
                setErrorMessage("");
              }}
            />

            <TextField
              label="Last name"
              type="text"
              fullWidth
              variant="outlined"
              placeholder="Enter last name"
              value={lastName}
              sx={{ width: "100%" }}
              onChange={(e) => {
                setLastName(e.target.value);
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

            <LoadingButton
              type="submit"
              variant="contained"
              fullWidth
              sx={{ height: "50px", width: "100%", fontSize: "20px" }}
              loading={loading}
            >
              SIGN UP
            </LoadingButton>

            <Typography>
              Already Have an Account? <Link href="/login">Login Here</Link>
            </Typography>
            <Typography color="error">{errorMessage}</Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
export default SignUpView;
