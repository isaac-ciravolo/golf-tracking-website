import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchStudent,
  createAssignment,
  fetchClassAssignments,
  deleteAssignment,
} from "../firebase/DatabaseFunctions";

const CoachAssignmentsView = ({ studentIds }) => {
  const { id: classCode } = useParams();
  const [open, setOpen] = useState(false);
  const [drillTitle, setDrillTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [drillLink, setDrillLink] = useState("");
  const [selectedStudentIds, setSelectedStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const temp = async () => {
      const data = await fetchClassAssignments(classCode);
      setAssignments(data);
    };

    temp();
  }, [classCode]);

  useEffect(() => {
    const temp = async () => {
      const newStudents = await Promise.all(
        studentIds.map(async (student) => {
          const studentData = await fetchStudent(student);
          return { ...studentData, id: student };
        }),
      );
      setStudents(newStudents);
    };

    temp();
  }, [studentIds]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Button
        variant="contained"
        sx={{ width: "200px", height: "50px" }}
        onClick={() => setOpen(true)}
      >
        Add Drill
      </Button>
      <List
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          alignItems: "center",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {assignments.length > 0 &&
          assignments.map((assignment) => (
            <ListItem key={assignment.id} sx={{ width: "100%", gap: 2 }}>
              <ListItemButton
                onClick={() => {
                  navigate(
                    "/home/" + classCode + "/assignments/" + assignment.id,
                  );
                }}
                sx={{ flexGrow: 1, height: "50px" }}
              >
                {assignment.title}
              </ListItemButton>
              <Button
                color="error"
                variant="outlined"
                onClick={() => {
                  setAssignmentToDelete(assignment);
                  setOpenDeleteDialog(true);
                }}
              >
                Delete
              </Button>
            </ListItem>
          ))}
      </List>
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
            Create an Assignment
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
            <Button variant="contained" onClick={() => setSelectedStudents([])}>
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
                    const student = students.find((s) => s.id === studentId);
                    return student
                      ? student.firstName + " " + student.lastName
                      : "";
                  })
                  .join(", ")
              }
            >
              {students.map((student) => (
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
              const res = await createAssignment(classCode, {
                title: drillTitle,
                link: drillLink,
                students: selectedStudentIds,
                completed: [],
              });
              setLoading(false);
              if (res === "Success!") {
                setOpen(false);
                setDrillTitle("");
                setDrillLink("");
                setSelectedStudents([]);
                const data = await fetchClassAssignments(classCode);
                setAssignments(data);
              } else alert("Failed to create assignment:", res);
            }}
          >
            CREATE ASSIGNMENT
          </LoadingButton>
        </Box>
      </Dialog>
      <Dialog
        open={openDeleteDialog}
        onClose={() => {
          if (!deleteLoading) setOpenDeleteDialog(false);
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
            Delete {assignmentToDelete?.title}?
          </Typography>
          <LoadingButton
            color="error"
            variant="contained"
            fullWidth
            sx={{ height: "50px", width: "100%", fontSize: "20px" }}
            loading={deleteLoading}
            onClick={async () => {
              if (!assignmentToDelete) return;
              setDeleteLoading(true);
              const res = await deleteAssignment(
                classCode,
                assignmentToDelete.id,
              );
              setDeleteLoading(false);
              if (res === "Success!") {
                setAssignments((prevAssignments) =>
                  prevAssignments.filter(
                    (assignment) => assignment.id !== assignmentToDelete.id,
                  ),
                );
                setOpenDeleteDialog(false);
                setAssignmentToDelete(null);
              } else {
                alert("Failed to delete assignment:", res);
              }
            }}
          >
            DELETE ASSIGNMENT
          </LoadingButton>
        </Box>
      </Dialog>
    </Box>
  );
};

export default CoachAssignmentsView;
