import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Typography, Paper, Box, Button, TextField, Link } from "@mui/material";

function UserLoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/profile");
    } catch (error) {
      if (error.message === "Firebase: Error (auth/invalid-email).")
        setErrorMessage("Invalid email");
      else if (error.message === "Firebase: Error (auth/invalid-credential).")
        setErrorMessage("Invalid email or password");
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
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
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

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ height: "50px", width: "100%", fontSize: "20px" }}
          >
            LOGIN
          </Button>

          <Typography>
            New User? <Link href="/signup">Register Here</Link>
          </Typography>
          <Typography color="error">{errorMessage}</Typography>
        </Box>
      </form>
    </Paper>
  );
}

export default UserLoginView;
