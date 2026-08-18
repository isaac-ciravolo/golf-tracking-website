import { Box, Button, Dialog, TextField, Typography } from "@mui/material";
import { useAuth } from "../firebase/AuthContext";
import { useState, useEffect } from "react";
// import { fetchClasses } from "../firebase/DatabaseFunctions";
import { List, ListItem, ListItemButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { auth } from "../firebase/firebase.js";
// import { createClass } from "../firebase/DatabaseFunctions";
import {
  createClass,
  fetchCoachClasses,
  deleteClass,
} from "../database/ClassFunctions.js";

const CoachClassesView = () => {
  const [coachClasses, setCoachClasses] = useState([]);
  const { userData: user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openDeleteClass, setOpenDeleteClass] = useState(false);
  const [className, setClassName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteClassError, setDeleteClassError] = useState("");
  const [classToDelete, setClassToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const temp = async () => {
        const token = await auth.currentUser.getIdToken();
        const res = await fetchCoachClasses(token);
        if (res.status === 200) {
          setCoachClasses(res.data.classes);
        } else {
          console.log(res);
        }
      };

      temp();
    }
  }, [user]);

  useEffect(() => {
    console.log(coachClasses);
  }, [coachClasses]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        p: 3,
        boxSizing: "border-box",
        gap: 3,
      }}
    >
      <Typography variant="h2" fontFamily="sans-serif" fontWeight="bold">
        Classes
      </Typography>
      <Box sx={{ display: "flex" }}>
        {" "}
        <Button
          variant="contained"
          sx={{ width: "200px", height: "50px" }}
          onClick={() => {
            setOpen(true);
          }}
        >
          Add a Class
        </Button>
      </Box>
      <List
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "80%",
          height: "100%",
          alignItems: "center",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {coachClasses.length > 0 &&
          coachClasses.map((_class) => (
            <ListItem key={_class.id} sx={{ width: "100%", gap: 2 }}>
              <ListItemButton
                onClick={() => {
                  navigate("/home/" + _class.id);
                }}
                sx={{ flexGrow: 1, height: "50px" }}
              >
                {_class.name}
              </ListItemButton>
              <Button
                color="error"
                variant="outlined"
                onClick={() => {
                  setClassToDelete(_class);
                  setDeleteClassError("");
                  setOpenDeleteClass(true);
                }}
              >
                Delete
              </Button>
            </ListItem>
          ))}
      </List>
      <Dialog
        open={open}
        onClose={() => {
          if (!loading) setOpen(false);
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
            Create a Class
          </Typography>
          <TextField
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            placeholder="Enter name"
            value={className}
            sx={{ width: "100%" }}
            onChange={(e) => {
              setClassName(e.target.value);
              setErrorMessage("");
            }}
          />
          <LoadingButton
            variant="contained"
            fullWidth
            sx={{ height: "50px", width: "100%", fontSize: "20px" }}
            loading={loading}
            onClick={async () => {
              setLoading(true);
              const token = await auth.currentUser.getIdToken();
              const error = await createClass(token, className);
              setLoading(false);

              console.log(error);

              if (error.status !== 200 && error.status !== 201) {
                setErrorMessage(
                  error.error || error.message || "An error occurred",
                );
              } else {
                const res = await fetchCoachClasses(token);
                if (res.status === 200) {
                  setCoachClasses(res.data.classes);
                } else {
                  console.log(res);
                }
                setOpen(false);
              }
            }}
          >
            CREATE CLASS
          </LoadingButton>
          <Typography color="error">{errorMessage}</Typography>
        </Box>
      </Dialog>
      <Dialog
        open={openDeleteClass}
        onClose={() => {
          if (!deleteLoading) setOpenDeleteClass(false);
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
            Delete {classToDelete?.name}?
          </Typography>
          <LoadingButton
            color="error"
            variant="contained"
            fullWidth
            sx={{ height: "50px", width: "100%", fontSize: "20px" }}
            loading={deleteLoading}
            onClick={async () => {
              if (!classToDelete) return;
              setDeleteLoading(true);
              const token = await auth.currentUser.getIdToken();
              const res = await deleteClass(token, classToDelete.id);
              setDeleteLoading(false);

              if (res.status >= 200 && res.status < 300) {
                setCoachClasses((prevCoachClasses) =>
                  prevCoachClasses.filter(
                    (coachClass) => coachClass.id !== classToDelete.id,
                  ),
                );
                setOpenDeleteClass(false);
                setClassToDelete(null);
              } else {
                const deleteError =
                  typeof res.message === "string"
                    ? res.message
                    : res.error ||
                      res.message?.error ||
                      "Failed to delete class.";
                setDeleteClassError(deleteError);
              }
            }}
          >
            DELETE CLASS
          </LoadingButton>
          <Typography color="error">{deleteClassError}</Typography>
        </Box>
      </Dialog>
    </Box>
  );
};

export default CoachClassesView;
