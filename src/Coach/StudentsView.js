import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchStudent } from "../firebase/DatabaseFunctions";
import { useParams } from "react-router-dom";
const StudentsView = ({ studentIds }) => {
  const [students, setStudents] = useState([]);
  const { id: classCode } = useParams();

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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        overflowY: "scroll",
        maxHeight: "80vh",
      }}
    >
      {students.map((student) => {
        return (
          <Box key={student.id} sx={{ display: "flex", flexDirection: "row" }}>
            <Typography>
              {student.firstName} {student.lastName}
            </Typography>

            <Button
              onClick={() => navigate(`/home/${classCode}/view/${student.id}`)}
            >
              View
            </Button>
          </Box>
        );
      })}
    </Box>
  );
};

export default StudentsView;
