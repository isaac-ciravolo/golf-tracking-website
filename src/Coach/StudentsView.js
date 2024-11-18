import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
const StudentsView = ({ students }) => {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {students.map((student) => {
        return (
          <Box key={student} sx={{ display: "flex", flexDirection: "row" }}>
            <Typography>{student}</Typography>
            <Button onClick={() => navigate("/analysis/" + student)}>
              View
            </Button>
          </Box>
        );
      })}
    </Box>
  );
};

export default StudentsView;
