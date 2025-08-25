import { useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase/firebase";
import { Navigate, useNavigate } from "react-router-dom";
import { Typography, Paper, Box, Button, TextField, Link } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { doSendEmailVerification } from "../firebase/auth.js";
import { useAuth } from "../firebase/AuthContext.js";
import { logOut } from "../firebase/DatabaseFunctions.js";
const VerificationView = () => {
  const { authUser } = useAuth();
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
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 10,
        overflowY: "auto",
        flexDirection: "column",
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
              Click To Send Email To Your Inbox!
            </Typography>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ height: "50px", width: "100%", fontSize: "20px" }}
              onClick={async () => {
                const res = await doSendEmailVerification();
                if (res !== "Success!") alert("Error: " + res);
                else {
                  alert(`Verification email sent to ${authUser.email}!`);
                  const logOutRes = await logOut();
                  if (logOutRes !== "Success!")
                    alert("Error during logout: " + logOutRes);
                  else navigate("/login");
                }
              }}
            >
              SEND EMAIL AND LOG OUT
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default VerificationView;
