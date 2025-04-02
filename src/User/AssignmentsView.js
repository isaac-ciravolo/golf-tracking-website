import { useState, useEffect } from "react";
import { fetchUserAssignments } from "../firebase/DatabaseFunctions";
import { useAuth } from "../firebase/AuthContext";
import {
  Paper,
  Button,
  Typography,
  Checkbox,
  Dialog,
  Box,
} from "@mui/material";
import { ConstructionOutlined } from "@mui/icons-material";
import formatDateFromMilliseconds from "../util/DateConverter";
import { LoadingButton } from "@mui/lab";
const AssignmentsView = () => {
  const [incompleteAssignments, setIncompleteAssignment] = useState([]);
  const [completedAssignments, setCompletedAssignments] = useState([]);
  const { currentUser: user } = useAuth();
  const [showCompleted, setShowCompleted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    if (!user || !user.id) return;
    fetchUserAssignments(user.id).then((assignments) => {
      const incomplete = assignments.filter(
        (assignment) =>
          !assignment.completed.some(
            (completion) => completion.userId === user.id
          )
      );
      const completed = assignments.filter((assignment) =>
        assignment.completed.some((completion) => completion.userId === user.id)
      );
      setIncompleteAssignment(incomplete);
      setCompletedAssignments(completed);
    });
  }, [user]);

  const getAssignmentDate = (assignment) => {
    const completion = assignment.completed.find(
      (completion) => completion.userId === user.id
    );
    return completion
      ? formatDateFromMilliseconds(completion.timeStamp / 1000)
      : null;
  };

  const markAssignmentCompleted = async (assignment) => {
    const currentTime = Date.now(); // Get the current time in milliseconds since January 1, 1970
    fetch(
      `https://markassignmentcompleted-2uga654xhq-uc.a.run.app?id=${user.id}&assignmentId=${assignment.id}&timeStamp=${currentTime}`,
      {
        method: "POST",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to mark assignment as completed");
        }
        // Update the state to move the assignment to completed
        assignment.completed.push({ userId: user.id, timeStamp: currentTime });
        setIncompleteAssignment((prev) =>
          prev.filter((item) => item.id !== assignment.id)
        );
        setCompletedAssignments((prev) => [...prev, assignment]);
      })
      .catch((error) => {
        alert("Error:", error.message);
      });
  };

  return (
    <>
      <div>
        {incompleteAssignments.map((assignment) => (
          <Paper
            key={assignment.id}
            sx={{
              p: 2,
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: 2,
              display: "grid",
              gridTemplateColumns: "8fr 1fr 1fr",
              alignItems: "center",
              maxWidth: "50%",
              columnGap: "1rem",
            }}
          >
            <Typography
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={assignment.title}
            >
              {assignment.title}
            </Typography>

            <Button
              variant="contained"
              href={assignment.link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ width: "80px" }}
            >
              GO
            </Button>
            <Button
              variant="contained"
              sx={{ width: "200px" }}
              onClick={() => {
                setDialogOpen(true);
                setSelectedAssignment(assignment);
              }}
            >
              Mark as Completed
            </Button>
          </Paper>
        ))}
      </div>

      <div>
        <Button
          variant="contained"
          onClick={() => setShowCompleted(!showCompleted)}
          sx={{ margin: "1rem auto", display: "block" }}
        >
          {showCompleted
            ? "Hide Completed Assignments"
            : "Show Completed Assignments"}
        </Button>
        {showCompleted && (
          <div>
            {completedAssignments.map((assignment) => (
              <Paper
                key={assignment.id}
                sx={{
                  p: 2,
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginTop: 2,
                  marginBottom: 2,

                  display: "grid",
                  gridTemplateColumns: "8fr 1fr 1fr",

                  alignItems: "center",
                  width: "50%",
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
                <Typography sx={{ width: "200px" }}>
                  Completed {getAssignmentDate(assignment)}
                </Typography>
              </Paper>
            ))}
          </div>
        )}
      </div>
      <Dialog
        open={dialogOpen}
        onClose={() => {
          if (!loading) setDialogOpen(false);
        }}
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
          <Typography variant="h3" fontWeight="bold">
            Mark Assignment Completed?
          </Typography>
          <LoadingButton
            variant="contained"
            fullWidth
            sx={{ height: "50px", width: "100%", fontSize: "20px" }}
            loading={loading}
            onClick={async () => {
              setLoading(true);
              await markAssignmentCompleted(selectedAssignment);
              setLoading(false);
              setDialogOpen(false);
            }}
          >
            MARK COMPLETED
          </LoadingButton>
        </Box>
      </Dialog>
    </>
  );
};

export default AssignmentsView;
