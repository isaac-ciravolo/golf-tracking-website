import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

const StudentsView = ({ students }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {students.map((student) => {
        return (
          <Box key={student} sx={{ display: "flex", flexDirection: "row" }}>
            <Typography>{student}</Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default StudentsView;
