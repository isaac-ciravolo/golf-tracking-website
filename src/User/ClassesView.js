import React, { useState, useEffect } from "react";
import { Box, Button, Dialog, Typography, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { addRequest, fetchClasses } from "../DatabaseFunctions.js";

const ClassesView = ({ userId, userName }) => {
  const [open, setOpen] = useState(false);
  const [classCode, setClassCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    if (userId) {
      const fetchUserClasses = async () => {
        try {
          const classesData = await fetchClasses(userId);
          setClasses(classesData);
        } catch (error) {
          alert("Failed to fetch classes:", error);
        }
      };

      fetchUserClasses();
    }
  }, [userId]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <Button
        onClick={() => setOpen(true)}
        variant="contained"
        sx={{ width: "300px", fontSize: "20px" }}
      >
        Join a Class
      </Button>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {classes &&
          classes.length > 0 &&
          classes.map((classData) => (
            <Box
              key={classData}
              sx={{
                width: "300px",
                display: "flex",
                gap: "10px",
                flexDirection: "column",
                p: 2,
                border: "1px solid black",
                borderRadius: "5px",
              }}
            >
              <Typography>{classData.name}</Typography>
              <Typography>Class Code: {classData.id}</Typography>
            </Box>
          ))}
      </Box>
      <Dialog
        open={open}
        onClose={() => {
          if (!loading) setOpen(false);
        }}
      >
        <Box
          sx={{
            width: "500px",
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <Typography variant="h3" fontWeight="bold">
            Join a Class
          </Typography>
          <TextField
            label="Code"
            type="text"
            fullWidth
            variant="outlined"
            placeholder="Enter code"
            value={classCode}
            sx={{ width: "100%" }}
            onChange={(e) => {
              setClassCode(e.target.value.toUpperCase().substring(0, 6));
              setErrorMessage("");
            }}
          />
          <LoadingButton
            variant="contained"
            fullWidth
            sx={{ height: "50px", width: "100%", fontSize: "20px" }}
            loading={loading}
            onClick={async () => {
              setLoading(true);
              console.log(classCode, userId);
              const error = await addRequest(classCode, userId, userName);
              setLoading(false);
              console.log(error);
              if (error === "Success!") {
                setOpen(false);
              } else {
                setErrorMessage(error);
              }
            }}
          >
            JOIN CLASS
          </LoadingButton>
          <Typography color="error">{errorMessage}</Typography>
        </Box>
      </Dialog>
    </Box>
  );
};

export default ClassesView;
