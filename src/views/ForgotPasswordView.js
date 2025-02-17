import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase/firebase";
import { Navigate, useNavigate } from "react-router-dom";
import { Typography, Paper, Box, Button, TextField, Link } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { doPasswordReset } from "../firebase/auth.js";
import { useAuth } from "../firebase/AuthContext.js";
function ForgotPasswordView() {
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const [sendingEmail, setSendingEmail] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSendingEmail(true);
    try {
      await doPasswordReset(email);
      setSuccessMessage("Email sent successfully! Check your inbox.");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage("");
    }
    setSendingEmail(false);
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
      }}
    >
      {userLoggedIn && <Navigate to={"/home"} replace={true} />}
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
              Forgot Password?
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

            <LoadingButton
              type="submit"
              variant="contained"
              fullWidth
              sx={{ height: "50px", width: "100%", fontSize: "20px" }}
              loading={sendingEmail}
            >
              SEND RESET EMAIL
            </LoadingButton>

            {successMessage && (
              <Typography color="success">{successMessage}</Typography>
            )}
            {errorMessage && (
              <Typography color="error">{errorMessage}</Typography>
            )}
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default ForgotPasswordView;
