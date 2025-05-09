import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import {
  fetchRequests,
  acceptRequest,
  rejectRequest,
} from "../firebase/DatabaseFunctions";
const RequestsView = ({ classCode }) => {
  const [requests, setRequests] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    if (classCode) {
      const temp = async () => {
        const newRequests = await fetchRequests(classCode);
        setRequests(newRequests);
      };

      temp();
    }
  });
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {requests.map((request) => {
        return (
          <Paper
            key={request.userId}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "500px",
              p: 3,
            }}
          >
            <Box sx={{ display: "flex", width: "100%" }}>
              <Typography variant="h6" fontWeight={"bold"}>
                {request.firstName} {request.lastName}
              </Typography>
              <Box sx={{ flexGrow: 1 }}></Box>
              <Button
                variant="contained"
                onClick={async () => {
                  const res = await acceptRequest(classCode, request.userId);
                  if (res) {
                    setErrorMessage(res);
                  } else {
                    window.location.reload();
                  }
                }}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={async () => {
                  const res = await rejectRequest(classCode, request.userId);
                  if (res) {
                    setErrorMessage(res);
                  } else {
                    window.location.reload();
                  }
                }}
                sx={{ ml: 2 }}
              >
                Reject
              </Button>
            </Box>
            {errorMessage && (
              <Typography color="error" textAlign="center">
                {errorMessage}
              </Typography>
            )}
          </Paper>
        );
      })}
    </Box>
  );
};

export default RequestsView;
