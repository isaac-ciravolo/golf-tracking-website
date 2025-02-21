import React, { useState, useEffect } from "react";
import { useAuth } from "../firebase/AuthContext";
import { fetchClassAssignments } from "../firebase/DatabaseFunctions";
import { useParams } from "react-router-dom";
import { Paper, Button, Typography } from "@mui/material";
const CoachAssignmentView = () => {
  const { id: classCode, assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  useEffect(() => {
    const temp = async () => {
      const data = await fetchClassAssignments(classCode);
      const foundAssignment = data.find((item) => item.id === assignmentId);
      setAssignment(foundAssignment);
    };

    temp();
  }, []);

  return (
    <>
      {/* {assignment && JSON.stringify(assignment)} */}
      <Paper
        sx={{
          p: 2,
          m: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: 400,
        }}
      >
        <Typography>{assignment?.title}</Typography>

        <Button
          variant="contained"
          href={assignment?.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          GO
        </Button>
      </Paper>
      {assignment?.students.map((student) => (
        <Typography key={student}>{student}</Typography>
      ))}
    </>
  );
};
export default CoachAssignmentView;
