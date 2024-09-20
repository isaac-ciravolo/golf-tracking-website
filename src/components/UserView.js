import React, { useState, useEffect } from "react";
import formatDateFromMilliseconds from "../util/DateConverter.js";
import HolesView from "./HolesView.js";
import { Box, Typography, Grid2 } from "@mui/material";
import PieChartView from "./PieChartView.js";
import { CustomSelect } from "./CustomComponents.js";

const clubs = [
  "-",
  "Driver",
  "3-Wood",
  "4-Wood",
  "5-Wood",
  "7-Wood",
  "2-Hybrid",
  "3-Hybrid",
  "4-Hybrid",
  "5-Hybrid",
  "2-Iron",
  "3-Iron",
  "4-Iron",
  "5-Iron",
  "6-Iron",
  "7-Iron",
  "8-Iron",
  "9-Iron",
  "Pitching Wedge",
  "Gap/Approach Wedge",
  "Lob Wedge",
  "Sand Wedge",
];

const UserView = ({ userData, gameData }) => {
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

    let tPutts = 0;
    let fPuttDistAvg = 0;
    for (let i = 0; i < currentHoles.length; i++) {
      const hole = currentHoles[i];
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

  const getCount = (conditions) => {
    let count = 0;

    currentHoles.forEach((hole) => {
      if (conditions.gir != undefined && hole.gir !== conditions.gir) return;
      if (
        conditions.upAndDown != undefined &&
        hole.upAndDown !== conditions.upAndDown
      )
        return;
      if (
        conditions.fairway != undefined &&
        hole.fairway !== conditions.fairway
      )
        return;
      if (
        conditions.missTee != undefined &&
        hole.missTee !== conditions.missTee
      )
        return;
      if (
        conditions.missApproach != undefined &&
        hole.missApproach !== conditions.missApproach
      )
        return;
      if (conditions.club != undefined && hole.club !== conditions.club) return;
      if (conditions.par != undefined && hole.par !== conditions.par) return;
      count++;
    });

    return count;
  };

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
              setSelectedGames(gameData);
              return;
            }
            const selectedGame = gameData.find(
              (game) => game.id == e.target.value
            );
            setSelectedGames([selectedGame]);
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

        <Typography textAlign="center" variant="h4" sx={{ width: "100%" }}>
          Number of Holes: {currentHoles.length}
        </Typography>

        <Grid2 container spacing={3}>
          <PieChartView
            title="GIR"
            data={[
              {
                id: 0,
                label: "Yes",
                value: getCount({ gir: true }),
                color: "#468f15",
              },
              {
                id: 1,
                label: "No",
                value: getCount({ gir: false }),
                color: "#94042b",
              },
            ]}
          />
          <PieChartView
            title="Up and Down"
            data={[
              {
                id: 0,
                label: "Yes",
                value: getCount({ upAndDown: true }),
                color: "#468f15",
              },
              {
                id: 1,
                label: "No",
                value: getCount({ upAndDown: false }),
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
                value: getCount({ fairway: true }),
                color: "#468f15",
              },
              {
                id: 1,
                label: "No",
                value: getCount({ fairway: false }),
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
                value: getCount({ missTee: "Left" }),
                color: "#468f15",
              },
              {
                id: 1,
                label: "Right",
                value: getCount({ missTee: "Right" }),
                color: "#94042b",
              },
            ]}
          />
          <PieChartView
            title="Approach Miss Direction"
            data={[
              "Short Left",
              "Short",
              "Short Right",
              "Long Left",
              "Long",
              "Long Right",
            ].map((miss) => {
              return {
                id: miss,
                label: miss,
                value: getCount({ missApproach: miss }),
              };
            })}
          />
          <PieChartView
            title="Club Hit from Tee on Par 3"
            data={clubs.map((club) => {
              return {
                id: club,
                label: club,
                value: getCount({ club: club, par: 3 }),
              };
            })}
            showLabel={false}
          />
          <PieChartView
            title="Club Hit from Tee on Par 4"
            data={clubs.map((club) => {
              return {
                id: club,
                label: club,
                value: getCount({ club: club, par: 4 }),
              };
            })}
            showLabel={false}
          />
          <PieChartView
            title="Club Hit from Tee on Par 5"
            data={clubs.map((club) => {
              return {
                id: club,
                label: club,
                value: getCount({ club: club, par: 5 }),
              };
            })}
            showLabel={false}
          />
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
