import React, { useState } from "react";
import { Box, Button, Dialog, Typography, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

const ClassesView = () => {
  const [open, setOpen] = useState(false);
  const [classCode, setClassCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Button
        onClick={() => setOpen(true)}
        variant="contained"
        sx={{ width: "300px", fontSize: "20px" }}
      >
        Join a Class
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
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
            placeholder="Enter name"
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
              //   const error = await createClass(className);
              const error = null;
              setLoading(false);

              if (error) {
                setErrorMessage(error);
              } else {
                setOpen(false);
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
