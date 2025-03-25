import React, { useState, useEffect } from "react";
import { useAuth } from "../firebase/AuthContext";
import { fetchClassAssignments } from "../firebase/DatabaseFunctions";
import { useParams } from "react-router-dom";
import { Paper, Button, Typography } from "@mui/material";
import formatDateFromMilliseconds from "../util/DateConverter";
import { fetchUserById } from "../firebase/DatabaseFunctions";
const CoachAssignmentView = () => {
  const { id: classCode, assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [userNameLookup, setUserNameLookup] = useState({});
  useEffect(() => {
    const temp = async () => {
      const data = await fetchClassAssignments(classCode);
      const foundAssignment = data.find((item) => item.id === assignmentId);
      setAssignment(foundAssignment);
      const newUserNames = {};
      for (const student of foundAssignment.students) {
        const user = await fetchUserById(student);
        newUserNames[student] = user.name;
      }
      setUserNameLookup(newUserNames);
    };

    temp();
  }, []);

  return (
    <>
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
      <Typography>Students:</Typography>
      {assignment?.students.map((studentId) => (
        <Typography key={studentId}>{userNameLookup[studentId]}</Typography>
      ))}
      <br></br>
      <Typography>Completed:</Typography>
      {assignment?.completed.map((student) => (
        <>
          <Typography key={student.userId}>
            {userNameLookup[student.userId]} | Completed on:{" "}
            {formatDateFromMilliseconds(student.timeStamp)}
          </Typography>
        </>
      ))}
    </>
  );
};
export default CoachAssignmentView;
