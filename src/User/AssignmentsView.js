import { useState, useEffect } from "react";
import { fetchUserAssignments } from "../firebase/DatabaseFunctions";
import { useAuth } from "../firebase/AuthContext";
import { Paper, Button, Typography, Checkbox } from "@mui/material";
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
              marginLeft: "1vw",
              marginTop: "1vh",
              marginBottom: 2,
              display: "grid",
              gridTemplateColumns: "8fr 1fr 1fr",
              alignItems: "center",
              maxWidth: "30%",
              columnGap: "1rem",
            }}
          >
            <Typography>{assignment.title}</Typography>

            <Button
              variant="contained"
              href={assignment.link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ width: "80px" }}
            >
              GO
            </Button>
            <Checkbox></Checkbox>
          </Paper>
        ))}
      </div>
    </>
  );
};

export default AssignmentsView;
