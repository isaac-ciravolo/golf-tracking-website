import React, { useState, useEffect } from "react";
import { useAuth } from "../firebase/AuthContext";
import {
  fetchClass,
  fetchClassAssignments,
  fetchStudent,
} from "../firebase/DatabaseFunctions";
import { useParams } from "react-router-dom";
import {
  Paper,
  Button,
  Typography,
  Dialog,
  MenuItem,
  ListItemText,
  InputLabel,
  FormControl,
  Select,
  TextField,
  Box,
} from "@mui/material";
import formatDateFromMilliseconds from "../util/DateConverter";
import { fetchUserById, editAssignment } from "../firebase/DatabaseFunctions";
import { LoadingButton } from "@mui/lab";
const CoachAssignmentView = () => {
  const { currentUser: user } = useAuth();
  const { id: classCode, assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [userNameLookup, setUserNameLookup] = useState({});
  const [drillTitle, setDrillTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [drillLink, setDrillLink] = useState("");
  const [selectedStudentIds, setSelectedStudents] = useState([]);
  const [students, setStudents] = useState([]);
  useEffect(() => {
    const temp = async () => {
      const classAssignments = await fetchClassAssignments(classCode);
      const foundAssignment = classAssignments.find(
        (item) => item.id === assignmentId
      );
      setAssignment(foundAssignment);
      setDrillTitle(foundAssignment.title);
      setDrillLink(foundAssignment.link);
      setSelectedStudents(foundAssignment.students);

      const newUserNames = {};
      for (const student of foundAssignment.students) {
        const user = await fetchUserById(student);
        newUserNames[student] = user.firstName + " " + user.lastName;
      }
      setUserNameLookup(newUserNames);
    };

    temp();
  }, []);

  useEffect(() => {
    const temp = async () => {
      const newClass = await fetchClass(classCode);
      const studentIds = newClass.students;
      const newStudents = await Promise.all(
        studentIds.map(async (student) => {
          const studentData = await fetchStudent(student);
          return { ...studentData, id: student };
        })
      );
      setStudents(newStudents);
    };

    temp();
  }, []);

  const [open, setOpen] = useState(false);

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
            {formatDateFromMilliseconds(student.timeStamp / 1000)}
          </Typography>
        </>
      ))}
      {assignment && (
        <>
          <Button variant="contained" onClick={() => setOpen(true)}>
            Edit Assignment
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
                Edit Assignment
              </Typography>
              <TextField
                label="Drill Title"
                type="text"
                fullWidth
                variant="outlined"
                placeholder="Enter drill title"
                value={drillTitle}
                sx={{ width: "100%" }}
                onChange={(e) => setDrillTitle(e.target.value)}
              />

              <TextField
                label="Drill Link"
                type="text"
                fullWidth
                variant="outlined"
                placeholder="Enter drill link"
                value={drillLink}
                sx={{ width: "100%" }}
                onChange={(e) => setDrillLink(e.target.value)}
              />
              <Box sx={{ display: "flex", gap: 3, justifyContent: "center" }}>
                <Button
                  variant="contained"
                  onClick={() =>
                    setSelectedStudents(students.map((student) => student.id))
                  }
                >
                  Select All Students
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setSelectedStudents([])}
                >
                  Deselect All Students
                </Button>
              </Box>
              <FormControl>
                <InputLabel>Select Students</InputLabel>
                <Select
                  multiple
                  label="Select Students"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={selectedStudentIds}
                  onChange={(e) => setSelectedStudents(e.target.value)}
                  renderValue={(selected) =>
                    selected
                      .map((studentId) => {
                        const student = students.find(
                          (s) => s.id === studentId
                        );
                        return student
                          ? student.firstName + " " + student.lastName
                          : "";
                      })
                      .join(", ")
                  }
                >
                  {students &&
                    students.map((student) => (
                      <MenuItem key={student.id} value={student.id}>
                        <ListItemText
                          primary={student.firstName + " " + student.lastName}
                        />
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <LoadingButton
                variant="contained"
                fullWidth
                sx={{ height: "50px", width: "100%", fontSize: "20px" }}
                loading={loading}
                onClick={async () => {
                  if (!drillTitle || !drillLink) {
                    alert("Please fill out all fields");
                    return;
                  }
                  if (selectedStudentIds.length === 0) {
                    alert("Please select at least one student");
                    return;
                  }
                  setLoading(true);
                  const newCompleted = assignment.completed.filter((student) =>
                    selectedStudentIds.includes(student.userId)
                  );
                  const res = await editAssignment(classCode, assignmentId, {
                    title: drillTitle,
                    link: drillLink,
                    students: selectedStudentIds,
                    completed: newCompleted,
                  });
                  setLoading(false);
                  if (res === "Success!") {
                    setOpen(false);
                    window.location.reload();
                  } else alert("Failed to save assignment:", res);
                }}
              >
                SAVE ASSIGNMENT
              </LoadingButton>
            </Box>{" "}
          </Dialog>
        </>
      )}
    </>
  );
};
export default CoachAssignmentView;
