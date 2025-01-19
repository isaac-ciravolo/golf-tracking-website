import { useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase/firebase";
import { Navigate, useNavigate } from "react-router-dom";
import { Typography, Paper, Box, Button, TextField, Link } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { doSendEmailVerification } from "../firebase/auth.js";
import { useAuth } from "../firebase/AuthContext.js";
const VerificationView = () => {
  const { userLoggedIn, currentUser } = useAuth();
  const [sendingEmail, setSendingEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
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
              Verify Your Email
            </Typography>

            <Typography variant="h6" fontWeight="bold">
              Click Send And Check Your Inbox!
            </Typography>

            <LoadingButton
              type="submit"
              variant="contained"
              fullWidth
              sx={{ height: "50px", width: "100%", fontSize: "20px" }}
              loading={sendingEmail}
              onClick={async () => {
                setSendingEmail(true);
                await doSendEmailVerification();
                setSendingEmail(false);
              }}
            >
              SEND EMAIL
            </LoadingButton>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default VerificationView;
