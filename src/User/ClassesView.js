import React, { useState, useEffect } from "react";
import { Box, Button, Dialog, Typography, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { addRequest, fetchClasses, leaveClass } from "../DatabaseFunctions.js";

const ClassesView = ({ userId, userName }) => {
  const [openJoinClass, setOpenJoinClass] = useState(false);
  const [openLeaveClass, setOpenLeaveClass] = useState(false);
  const [classToLeave, setClassToLeave] = useState("");
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
        onClick={() => setOpenJoinClass(true)}
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
              <Button
                variant="contained"
                onClick={async () => {
                  setOpenLeaveClass(true);
                  setClassToLeave(classData);
                }}
              >
                Leave Class
              </Button>
            </Box>
          ))}
      </Box>
      <Dialog
        open={openJoinClass}
        onClose={() => {
          if (!loading) setOpenJoinClass(false);
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
              const error = await addRequest(classCode, userId, userName);
              setLoading(false);
              if (error === "Success!") {
                setOpenJoinClass(false);
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
      <Dialog
        open={openLeaveClass}
        onClose={() => {
          if (!loading) setOpenLeaveClass(false);
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
            Leave {classToLeave.name}?
          </Typography>
          <LoadingButton
            variant="contained"
            fullWidth
            sx={{ height: "50px", width: "100%", fontSize: "20px" }}
            loading={loading}
            onClick={async () => {
              setLoading(true);
              const res = await leaveClass(classToLeave.id, userId);
              setLoading(false);
              if (res === "Success!") {
                setClasses(classes.filter((c) => c.id !== classToLeave.id));
                setOpenLeaveClass(false);
              } else {
                alert("Failed to leave class:", res);
              }
            }}
          >
            LEAVE CLASS
          </LoadingButton>
          <Typography color="error">{errorMessage}</Typography>
        </Box>
      </Dialog>
    </Box>
  );
};

export default ClassesView;
