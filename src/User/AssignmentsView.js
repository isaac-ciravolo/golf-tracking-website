import { useState, useEffect } from "react";
import { fetchUserAssignments } from "../firebase/DatabaseFunctions";
import { useAuth } from "../firebase/AuthContext";
import { auth } from "../firebase/firebase.js";
import { Paper, Button, Typography, Dialog, Box } from "@mui/material";
import formatDateFromMilliseconds from "../util/DateConverter";
import { LoadingButton } from "@mui/lab";

const AssignmentsView = () => {
  const [incompleteAssignments, setIncompleteAssignments] = useState([]);
  const [completedAssignments, setCompletedAssignments] = useState([]);
  const { userData: user } = useAuth();
  const [showCompleted, setShowCompleted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const userId = user?.id;
  const authUserId = auth.currentUser?.uid;

  const getAssignmentUrl = (assignmentLink) => {
    if (!assignmentLink) return "#";

    if (/^https?:\/\//i.test(assignmentLink)) {
      return assignmentLink;
    }

    return `https://${assignmentLink}`;
  };

  useEffect(() => {
    if (!userId) return;

    const temp = async () => {
      let completed = [];
      let incomplete = [];
      const assignments = await fetchUserAssignments(userId);
      if (!assignments) {
        setIncompleteAssignments([]);
        setCompletedAssignments([]);
        return;
      }

      const assignmentList = Array.isArray(assignments)
        ? assignments
        : Object.values(assignments).flat();

      assignmentList.forEach((assignment) => {
        const completedByCurrentUser = (assignment.completed || []).some(
          (completion) => completion.userId === userId,
        );

        if (completedByCurrentUser) {
          completed.push(assignment);
        } else {
          incomplete.push(assignment);
        }
      });

      setIncompleteAssignments(incomplete);
      setCompletedAssignments(completed);
    };

    temp();
  }, [userId]);

  const getAssignmentDate = (assignment) => {
    const completion = (assignment.completed || []).find(
      (completion) => completion.userId === userId,
    );

    return completion
      ? formatDateFromMilliseconds(completion.timeStamp / 1000)
      : null;
  };

  const markAssignmentCompleted = async (assignment) => {
    const currentTime = Date.now();

    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(
        `https://markassignmentcompleted-2uga654xhq-uc.a.run.app?id=${encodeURIComponent(authUserId || userId)}&assignmentId=${encodeURIComponent(assignment.id)}&timeStamp=${currentTime}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: userId,
            authUserId,
            assignmentId: assignment.id,
            timeStamp: currentTime,
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to mark assignment as completed");
      }
      window.location.reload();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <div>
        <Typography
          variant="h5"
          sx={{
            marginTop: 2,
            marginBottom: 1,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Assignments
        </Typography>
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
              href={getAssignmentUrl(assignment.link)}
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
          onClick={() => setShowCompleted((previousValue) => !previousValue)}
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
                  href={getAssignmentUrl(assignment.link)}
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
