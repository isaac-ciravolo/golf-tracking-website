import React, { useState, useEffect } from "react";
import {
  Box,
  Tab,
  Tabs,
  Typography,
  Button,
  ToggleButton,
  Dialog,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import RequestsView from "./RequestsView";

const CoachView = ({
  user,
  coachClasses,
  createClass,
  requests,
  acceptRequest,
}) => {
  const [value, setValue] = useState(0);
  const [selectedClass, setSelectedClass] = useState(null);
  const [open, setOpen] = useState(false);
  const [className, setClassName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (coachClasses.length > 0) {
      setSelectedClass(coachClasses[0]);
    }
  }, [coachClasses]);

  return (
    <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
      <Box
        sx={{
          width: "200px",
          height: "100vh",
          backgroundColor: "lightGray",
          position: "fixed",
          paddingTop: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          zIndex: 100,
        }}
      >
        <Typography textAlign="center" fontWeight={"bold"}>
          Select A Class
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: "90%",
            overflow: "scroll",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Button
            variant="contained"
            sx={{ width: "90%", height: "48.5px" }}
            onClick={() => {
              setOpen(true);
            }}
          >
            Add a Class
          </Button>
          {coachClasses &&
            coachClasses.map((_class) => {
              return (
                <Box
                  key={_class.id}
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <ToggleButton
                    color="primary"
                    value={_class === selectedClass}
                    selected={_class === selectedClass}
                    onClick={() => setSelectedClass(_class)}
                    sx={{ width: "90%" }}
                  >
                    {_class.name}
                  </ToggleButton>
                </Box>
              );
            })}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          marginLeft: "200px",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "fixed",
            width: "100%",
            height: "130px",
            backgroundColor: "rgb(240, 240, 240)",
            zIndex: 10,
          }}
        >
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <Typography variant="h3" fontWeight="bold">
                {user.name && user.name.toUpperCase()}
              </Typography>
            </Box>
            <Tabs
              value={value}
              onChange={(event, newValue) => setValue(newValue)}
            >
              <Tab label="Requests" index={0} />
            </Tabs>
          </Box>
        </Box>
        <Box sx={{ marginTop: "130px", width: "1200px" }}>
          <Box
            sx={{
              width: "100%",
              p: 3,
              ...(value !== 0 && { display: "none" }),
            }}
          >
            {selectedClass &&
              selectedClass.id &&
              requests[selectedClass.id] && (
                <RequestsView
                  classCode={selectedClass.id}
                  requests={requests[selectedClass.id]}
                  acceptRequest={acceptRequest}
                />
              )}
          </Box>
        </Box>
      </Box>
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
              const error = await createClass(className);
              setLoading(false);

              if (error) {
                setErrorMessage(error);
              } else {
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

export default CoachView;
