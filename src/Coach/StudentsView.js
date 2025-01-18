import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchStudent } from "../firebase/DatabaseFunctions";
const StudentsView = ({ studentIds }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const temp = async () => {
      const newStudents = await Promise.all(
        studentIds.map(async (student) => {
          const studentData = await fetchStudent(student);
          return { ...studentData, id: student };
        })
      );
      setStudents(newStudents);
    };

    temp();
  }, [studentIds]);

  const navigate = useNavigate();
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {students.map((student) => {
        return (
          <Box key={student.id} sx={{ display: "flex", flexDirection: "row" }}>
            <Typography>{student.name}</Typography>
            <Button onClick={() => navigate("/analysis/" + student.id)}>
              View
            </Button>
          </Box>
        );
      })}
    </Box>
  );
};

export default StudentsView;
