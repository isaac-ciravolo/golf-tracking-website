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
  const [par3d, setPar3d] = useState([]);
  const [par4d, setPar4d] = useState([]);
  const [par5d, setPar5d] = useState([]);
  const [currentHoles, setCurrentHoles] = useState([]);
  const [selectedGames, setSelectedGames] = useState([]);
  const [girSelection, setGirSelection] = useState("Both");
  const [totalPutts, setTotalPutts] = useState(0);
  const [firstPuttDistAvg, setFirstPuttDistAvg] = useState(0);

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

  useEffect(() => {
    setSelectedGames(gameData);
  }, []);

  useEffect(() => {
    let numHoles = 0;

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

    let tPutts = 0;
    let fPuttDistAvg = 0;

    for (let i = 0; i < currentHoles.length; i++) {
      const hole = currentHoles[i];
      numHoles++;
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
        par4clubs.push(hole.club);
      }

      tPutts += hole.totalPutts;
      fPuttDistAvg += hole.firstPuttDist;
    }

    // par 4 per club
    const par4dc = countOccurrences(par4clubs);
    const par4labels = Object.keys(par4dc);
    const par4dv = Object.values(par4dc);

    let par4data = [];

    for (let i = 0; i < par4labels.length; i++) {
      const par4dataHole = {
        id: i,
        label: par4labels[i],
        value: par4dv[i],
      };
      par4data.push(par4dataHole);
    }

    // par 3 per club
    const par3dc = countOccurrences(par3clubs);
    const par3labels = Object.keys(par3dc);
    const par3dv = Object.values(par3dc);

    let par3data = [];

    for (let i = 0; i < par3labels.length; i++) {
      const par3dataHole = {
        id: i,
        label: par3labels[i],
        value: par3dv[i],
      };
      par3data.push(par3dataHole);
    }

    // par 5 per club
    const par5dc = countOccurrences(par5clubs);
    const par5labels = Object.keys(par5dc);
    const par5dv = Object.values(par5dc);

    let par5data = [];

    for (let i = 0; i < par5labels.length; i++) {
      const par5dataHole = {
        id: i,
        label: par5labels[i],
        value: par5dv[i],
      };
      par5data.push(par5dataHole);
    }

    setPar5d(par5data);
    setPar4d(par4data);
    setPar3d(par3data);

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

    setTotalPutts(tPutts);
    setFirstPuttDistAvg(fPuttDistAvg / numHoles);
  }, [currentHoles]);

  useEffect(() => {
    const newSelection = [];

    selectedGames.forEach((game) => {
      for (let i = 0; i < game.holes.length; i++) {
        if (girSelection == "True" && !game.holes[i].gir) continue;
        if (girSelection == "False" && game.holes[i].gir) continue;
        newSelection.push(game.holes[i]);
      }
    });

    setCurrentHoles(newSelection);
  }, [selectedGames, girSelection]);

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
              setCurrentHoles(gameData);
              return;
            }
            const selectedGame = gameData.find(
              (game) => game.id == e.target.value
            );
            setCurrentHoles([selectedGame]);
          }}
          defaultValue={gameData}
        />

        <CustomSelect
          name="Select GIR"
          options={[
            { value: "Both", label: "Both" },
            { value: "True", label: "True" },
            { value: "False", label: "False" },
          ]}
          onChange={(e) => {
            setGirSelection(e.target.value);
          }}
          defaultValue={girSelection}
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
          <PieChartView title="Club Hit from Tee on Par 3" data={par3d} />
          <PieChartView title="Club Hit from Tee on Par 4" data={par4d} />
          <PieChartView title="Club Hit from Tee on Par 5" data={par5d} />
        </Grid2>

        <Typography
          textAlign="center"
          variant="h4"
          sx={{ width: "100%", fontWeight: "bold" }}
        >
          Total Putts: {totalPutts}
        </Typography>

        <Typography
          textAlign="center"
          variant="h4"
          sx={{ width: "100%", fontWeight: "bold" }}
        >
          Average First Putt Distance: {firstPuttDistAvg.toFixed(2)}
        </Typography>

        {selectedGames && selectedGames.length === 1 && (
          <HolesView game={selectedGames[0]} />
        )}
      </Grid2>
    </Box>
  );
};

export default UserView;
