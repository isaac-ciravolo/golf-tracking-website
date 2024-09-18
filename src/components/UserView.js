import React, { useState, useEffect } from "react";
import formatDateFromMilliseconds from "../util/DateConverter.js";
import HolesView from "./HolesView.js";
import { Box, Typography, Grid2 } from "@mui/material";
import PieChartView from "./PieChartView.js";
import { CustomSelect } from "./CustomComponents.js";

const UserView = ({ userData, gameData }) => {
  const [GIRtrue, setGIRtrue] = useState(0);
  const [GIRfalse, setGIRfalse] = useState(0);
  const [UDtrue, setUDtrue] = useState(0);
  const [UDfalse, setUDfalse] = useState(0);
  const [Ftrue, setFtrue] = useState(0);
  const [Ffalse, setFfalse] = useState(0);
  const [FMissLeft, setFMissLeft] = useState(0);
  const [FMIssRight, setFMissRight] = useState(0);
  const [SL, setSL] = useState(0);
  const [S, setS] = useState(0);
  const [LL, setLL] = useState(0);
  const [SR, setSR] = useState(0);
  const [L, setL] = useState(0);
  const [LR, setLR] = useState(0);
  const [currentSelection, setCurrentSelection] = useState([]);

  const par5clubs = [];
  const par4clubs = [];
  const par3clubs = [];

  const countOccurrences = (array) => {
    const count = {};
    array.forEach((item) => {
      count[item] = (count[item] || 0) + 1;
    });
    return count;
  };

  // const dataCount = countOccurrences(stringArray);

  useEffect(() => {
    setCurrentSelection(gameData);
  }, []);

  useEffect(() => {
    let girTrueCount = 0;
    let girFalseCount = 0;
    let udTrueCount = 0;
    let udFalseCount = 0;
    let FTrueCount = 0;
    let FFalseCount = 0;
    let FLeftCount = 0;
    let FRightCount = 0;
    let SLCount = 0;
    let SCount = 0;
    let LLCount = 0;
    let SRCount = 0;
    let LCount = 0;
    let LRCount = 0;

    for (let i = 0; i < currentSelection.length; i++) {
      for (let j = 0; j < currentSelection[i].holes.length; j++) {
        const hole = currentSelection[i].holes[j];
        if (hole.gir) {
          girTrueCount++;
        } else {
          girFalseCount++;
        }
        if (hole.upAndDown) {
          udTrueCount++;
        } else {
          udFalseCount++;
        }
        if (hole.fairway) {
          FTrueCount++;
        } else {
          FFalseCount++;
          if (hole.missTee == "Left") {
            FLeftCount++;
          } else if (hole.missTee == "Right") {
            FRightCount++;
          }
        }
        if (hole.missApproach == "Short Left") {
          SLCount++;
        }
        if (hole.missApproach == "Short Right") {
          SRCount++;
        }
        if (hole.missApproach == "Short") {
          SCount++;
        }
        if (hole.missApproach == "Long") {
          LCount++;
        }
        if (hole.missApproach == "Long Left") {
          LLCount++;
        }
        if (hole.missApproach == "Long Right") {
          LRCount++;
        }
        if (hole.par == 4) {
          par4clubs.push(hole.club);
        }
        if (hole.par == 3) {
          par3clubs.push(hole.club);
        }
        if (hole.par == 5) {
          par5clubs.push(hole.club);
        }
      }
    }
    console.log(countOccurrences(par4clubs));
    setGIRtrue(girTrueCount);
    setGIRfalse(girFalseCount);
    setUDtrue(udTrueCount);
    setUDfalse(udFalseCount);
    setFtrue(FTrueCount);
    setFfalse(FFalseCount);
    setFMissLeft(FLeftCount);
    setFMissRight(FRightCount);
    setSL(SLCount);
    setSR(SRCount);
    setS(SCount);
    setL(LCount);
    setLL(LLCount);
    setLR(LRCount);
  }, [currentSelection]);

  return (
    <Box sx={{ p: 3 }}>
      <Grid2 container spacing={3}>
        <Typography
          textAlign="center"
          variant="h2"
          sx={{ fontWeight: "bold", width: "100%" }}
        >
          {userData.name}
        </Typography>
        <CustomSelect
          name="Select Game"
          options={[
            { value: gameData, label: "All Games" },
            ...gameData.map((game) => {
              return {
                value: game.id,
                label:
                  game.title +
                  " - " +
                  formatDateFromMilliseconds(game.gameDate),
              };
            }),
          ]}
          onChange={(e) => {
            if (e.target.value == gameData) {
              setCurrentSelection(gameData);
              return;
            }
            const selectedGame = gameData.find(
              (game) => game.id == e.target.value
            );
            setCurrentSelection([selectedGame]);
          }}
          defaultValue={gameData}
        />

        <Grid2 container spacing={3}>
          <PieChartView
            title="GIR"
            data={[
              { id: 0, label: "Yes", value: GIRtrue, color: "#468f15" },
              { id: 1, label: "No", value: GIRfalse, color: "#94042b" },
            ]}
          />
          <PieChartView
            title="Up and Down"
            data={[
              {
                id: 0,
                label: "Yes",
                value: UDtrue,
                color: "#468f15",
              },
              {
                id: 1,
                label: "No",
                value: UDfalse,
                color: "#94042b",
              },
            ]}
          />
          <PieChartView
            title="Fairway"
            data={[
              {
                id: 0,
                label: "Yes",
                value: Ftrue,
                color: "#468f15",
              },
              {
                id: 1,
                label: "No",
                value: Ffalse,
                color: "#94042b",
              },
            ]}
          />
          <PieChartView
            title="Fairway Miss Direction"
            data={[
              {
                id: 0,
                label: "Left",
                value: FMissLeft,
                color: "#468f15",
              },
              {
                id: 1,
                label: "Right",
                value: FMIssRight,
                color: "#94042b",
              },
            ]}
          />
          <PieChartView
            title="Approach Miss Direction"
            data={[
              {
                id: 0,
                label: "Short Left",
                value: SL,
              },
              {
                id: 1,
                label: "Short",
                value: S,
              },
              {
                id: 2,
                label: "Short Right",
                value: SR,
              },
              {
                id: 3,
                label: "Long Left",
                value: LL,
              },
              {
                id: 4,
                label: "Long",
                value: L,
              },
              {
                id: 5,
                label: "Long Right",
                value: LR,
              },
            ]}
          />
        </Grid2>

        {currentSelection &&
          currentSelection.length > 0 &&
          currentSelection != gameData && (
            <HolesView game={currentSelection[0]} />
          )}
      </Grid2>
    </Box>
  );
};

export default UserView;
