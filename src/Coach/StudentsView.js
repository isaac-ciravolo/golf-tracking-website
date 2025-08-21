import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Dialog } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  fetchStudent,
  removeStudentFromClass,
} from "../firebase/DatabaseFunctions";
import { useParams } from "react-router-dom";
const StudentsView = ({ studentIds }) => {
  const [students, setStudents] = useState([]);
  const { id: classCode } = useParams();
  const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

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

            <Button
              onClick={() => {
                setUserToDelete(student);
                setShowDeleteUserDialog(true);
              }}
            >
              Delete
            </Button>
          </Box>
        );
      })}
      <Dialog
        open={showDeleteUserDialog}
        onClose={() => setShowDeleteUserDialog(false)}
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
          <Typography variant="h4" fontWeight="bold">
            Delete {userToDelete?.firstName} {userToDelete?.lastName}?
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              const response = await removeStudentFromClass(
                classCode,
                userToDelete.id
              );
              if (response === "Success!") {
                window.location.reload();
              } else {
                alert(response);
              }
            }}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowDeleteUserDialog(false)}
          >
            Cancel
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default StudentsView;
