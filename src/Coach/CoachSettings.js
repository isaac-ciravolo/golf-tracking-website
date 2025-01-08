import { useState, useEffect } from "react";
import { Box, Typography, Button, Dialog } from "@mui/material";
import { logOut, deleteAccount } from "../DatabaseFunctions";
import { useNavigate } from "react-router-dom";
const CoachSettings = ({ coach }) => {
  const [showLogOutDialog, setShowLogOutDialog] = useState(false);
  const [logOutError, setLogOutError] = useState(null);
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState(null);
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        p: 3,
      }}
    >
      <Typography variant="h4">Coach Settings</Typography>
      <Typography variant="h6">{coach.name}</Typography>
      <Typography variant="h6">{coach.email}</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setShowLogOutDialog(true);
        }}
      >
        Log Out
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={() => {
          setShowDeleteAccountDialog(true);
        }}
      >
        Delete Account
      </Button>
      <Dialog
        open={showLogOutDialog}
        onClose={() => setShowLogOutDialog(false)}
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
            Log Out?
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              const res = await logOut();
              if (res === "Success!") navigate("/login");
              else setLogOutError(res);
            }}
          >
            Log Out
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowLogOutDialog(false)}
          >
            Cancel
          </Button>
          <Typography variant="h6" color="error">
            {logOutError}
          </Typography>
        </Box>
      </Dialog>
      <Dialog
        open={showDeleteAccountDialog}
        onClose={() => setShowDeleteAccountDialog(false)}
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
            Delete Account?
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              const res = await deleteAccount(coach.id);
              if (res === "Success!") navigate("/login");
              else setDeleteAccountError(res);
            }}
          >
            Delete Account
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowDeleteAccountDialog(false)}
          >
            Cancel
          </Button>
          <Typography variant="h6" color="error">
            {deleteAccountError}
          </Typography>
        </Box>
      </Dialog>
    </Box>
  );
};

export default CoachSettings;
