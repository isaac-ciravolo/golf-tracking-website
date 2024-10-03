import React, { useState, useEffect } from "react";
import { Box, Grid2, Paper, Typography } from "@mui/material";
import { CustomSelect } from "./CustomComponents.js";
import PercentBox from "./PercentBox.js";
import HalfPizzaGraph from "./HalfPizzaGraph.js";

import { clubs, colors } from "../util/Constants.js";

const DrivingView = ({ currentHoles }) => {
  useEffect(() => {}, [currentHoles]);
  const [selectedClub, setSelectedClub] = useState("-");
  const [numLeft, setNumLeft] = useState(0);
  const [numFairway, setNumFairway] = useState(0);
  const [numRight, setNumRight] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setNumLeft(
      getCount(currentHoles, {
        teeShot: "Left",
        par: 4,
        teeClub: selectedClub,
      }) +
        getCount(currentHoles, {
          teeShot: "Left",
          par: 5,
          teeClub: selectedClub,
        })
    );
    setNumFairway(
      getCount(currentHoles, {
        teeShot: "Fairway",
        par: 4,
        teeClub: selectedClub,
      }) +
        getCount(currentHoles, {
          teeShot: "Left",
          par: 5,
          teeClub: selectedClub,
        })
    );
    setNumRight(
      getCount(currentHoles, {
        teeShot: "Right",
        par: 4,
        teeClub: selectedClub,
      }) +
        getCount(currentHoles, {
          teeShot: "Right",
          par: 5,
          teeClub: selectedClub,
        })
    );
    setTotal(
      getCount(currentHoles, { teeClub: selectedClub, par: 4 }) +
        getCount(currentHoles, { teeClub: selectedClub, par: 5 })
    );
  }, [currentHoles, selectedClub]);

  const getCount = (currHoles, conditions) => {
    let count = 0;
    currHoles.forEach((hole) => {
      let add = 1;
      Object.keys(hole).forEach((key) => {
        if (conditions[key] !== undefined && conditions[key] !== hole[key])
          add = 0;
      });
      count += add;
    });
    return count;
  };

  return (
    <Box
      sx={{
        p: 3,
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
      }}
    >
      <Box sx={{ width: "500px" }}>
        <CustomSelect
          name={"Select Club"}
          onChange={(e) => setSelectedClub(e.target.value)}
          defaultValue={selectedClub}
          options={clubs.map((club) => {
            if (
              club === "-" ||
              getCount(currentHoles, { teeClub: club, par: 4 }) +
                getCount(currentHoles, { teeClub: club, par: 5 }) >
                0
            )
              return { value: club, label: club };
          })}
        />
      </Box>
      <Grid2 container spacing={3}>
        <Paper
          sx={{
            width: "500px",
            height: "500px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
          }}
        >
          <HalfPizzaGraph
            sliceData={[
              { value: numLeft, label: "Missed Left", color: colors["Left"] },
              { value: numFairway, label: "Fairway", color: colors["Fairway"] },
              {
                value: numRight,
                label: "Missed Right",
                color: colors["Right"],
              },
            ]}
          />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <PercentBox
              title="Missed Left"
              percent={(numLeft / total) * 100}
              shots={numLeft}
            />
            <PercentBox
              title="Fairway"
              percent={(numFairway / total) * 100}
              shots={numFairway}
            />
            <PercentBox
              title="Missed Right"
              percent={(numRight / total) * 100}
              shots={numRight}
            />
          </Box>
        </Paper>
      </Grid2>
    </Box>
  );
};

export default DrivingView;
