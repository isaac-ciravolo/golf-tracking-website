import React, { useState, useEffect } from "react";
import {
  Box,
  Tab,
  Tabs,
  Typography,
  Button,
  ToggleButton,
} from "@mui/material";

const CoachView = ({ user, classes }) => {
  const [value, setValue] = useState(0);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    if (classes.length > 0) {
      setSelectedClass(classes[0]);
    }
  }, [classes]);

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
          {classes.length > 0 &&
            classes.map((_class) => (
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
            ))}
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
              <Tab label="Users" index={0} />
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
            User List
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CoachView;
