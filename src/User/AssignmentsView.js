import { useState, useEffect } from "react";
import { fetchUserAssignments } from "../firebase/DatabaseFunctions";
import { useAuth } from "../firebase/AuthContext";
import { Paper, Button, Typography } from "@mui/material";
const AssignmentsView = () => {
  const [assignments, setAssignments] = useState([]);
  const { currentUser: user } = useAuth();

  useEffect(() => {
    if (!user || !user.id) return;
    fetchUserAssignments(user.id).then((assignments) => {
      setAssignments(assignments);
    });
  }, [user]);

  return (
    <>
      {/* {assignments && JSON.stringify(assignments)} */}
      <div>
        {assignments.map((assignment) => (
          <Paper
            key={assignment.id}
            sx={{
              p: 2,
              m: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: 400,
            }}
          >
            <Typography>{assignment.title}</Typography>
            <Button
              variant="contained"
              href={assignment.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              GO
            </Button>
          </Paper>
        ))}
      </div>
    </>
  );
};

export default AssignmentsView;
