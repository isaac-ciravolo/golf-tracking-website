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
import StudentsView from "./StudentsView";
import { fetchClass } from "../firebase/DatabaseFunctions";
import { useAuth } from "../firebase/AuthContext";
import CoachAssignmentsView from "./CoachAssignmentsView";
import { useParams } from "react-router-dom";
import LoadingView from "../views/LoadingView";

const CoachView = () => {
  const { currentUser: user } = useAuth();

  const [value, setValue] = useState(0);
  const [selectedClass, setSelectedClass] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (user) {
      const temp = async () => {
        const newClass = await fetchClass(id);
        setSelectedClass(newClass);
      };

      temp();
    }
  }, [user]);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        backgroundColor: "lightGray",
      }}
    >
      {selectedClass === null ? (
        <LoadingView />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "80%",
            height: "100%",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "130px",
              backgroundColor: "rgb(240, 240, 240)",
            }}
          >
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <Typography variant="h3" fontWeight="bold">
                  {selectedClass.name}
                </Typography>
                {selectedClass && <Typography>{selectedClass.id}</Typography>}
              </Box>
              <Tabs
                value={value}
                onChange={(event, newValue) => setValue(newValue)}
              >
                <Tab label="Students" index={0} />
                <Tab label="Requests" index={0} />
                <Tab label="Assignments" index={0} />
              </Tabs>
            </Box>
          </Box>
          <Box
            sx={{
              width: "100%",
              backgroundColor: "white",
              height: "calc(100% - 130px)",
            }}
          >
            <Box
              sx={{
                width: "100%",
                p: 3,
                ...(value !== 0 && { display: "none" }),
              }}
            >
              {selectedClass && (
                <StudentsView studentIds={selectedClass.students} />
              )}
            </Box>
            <Box
              sx={{
                width: "100%",
                p: 3,
                ...(value !== 1 && { display: "none" }),
              }}
            >
              {selectedClass && <RequestsView classCode={selectedClass.id} />}
            </Box>
            <Box
              sx={{
                width: "100%",
                p: 3,
                ...(value !== 2 && { display: "none" }),
              }}
            >
              {selectedClass && (
                <CoachAssignmentsView studentIds={selectedClass.students} />
              )}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CoachView;
