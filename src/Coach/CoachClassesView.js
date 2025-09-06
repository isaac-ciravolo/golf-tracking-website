import { Box, Button, Dialog, TextField, Typography } from "@mui/material";
import { useAuth } from "../firebase/AuthContext";
import { useState, useEffect } from "react";
// import { fetchClasses } from "../firebase/DatabaseFunctions";
import { List, ListItem, ListItemButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
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
  const [className, setClassName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const temp = async () => {
        const newClasses = await fetchCoachClasses(user.id);
        setCoachClasses(newClasses);
      };

      temp();
    }
  }, [user]);

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
          coachClasses.map((_class, index) => (
            <ListItem key={index}>
              <ListItemButton
                onClick={() => {
                  navigate("/home/" + _class.id);
                }}
                sx={{ width: "100%", height: "50px" }}
              >
                {_class.name}
              </ListItemButton>
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
              const error = await createClass(className, user.id);
              setLoading(false);

              if (error !== "Success!") {
                setErrorMessage(error);
              } else {
                const newClasses = await fetchCoachClasses(user.id);
                setCoachClasses(newClasses);
                setOpen(false);
              }
            }}
          >
            CREATE CLASS
          </LoadingButton>
          <Typography color="error">{errorMessage}</Typography>
        </Box>
      </Dialog>
    </Box>
  );
};

export default CoachClassesView;
