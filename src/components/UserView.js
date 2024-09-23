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
  const [currentHoles, setCurrentHoles] = useState([]);
  const [selectedGames, setSelectedGames] = useState([]);
  const [girSelection, setGirSelection] = useState("Both");
  const [fairwaySelection, setFairwaySelection] = useState("Both");
  const [totalPutts, setTotalPutts] = useState(0);
  const [firstPuttDistAvg, setFirstPuttDistAvg] = useState(0);

  useEffect(() => {
    setSelectedGames(gameData);
  }, []);

  useEffect(() => {
    let tPutts = 0;
    let fPuttDistAvg = 0;
    for (let i = 0; i < currentHoles.length; i++) {
      const hole = currentHoles[i];
      tPutts += hole.totalPutts;
      fPuttDistAvg += hole.firstPuttDist;
    }

    setTotalPutts(tPutts);
    setFirstPuttDistAvg(fPuttDistAvg / currentHoles.length);
  }, [currentHoles]);

  useEffect(() => {
    const newSelection = [];

    selectedGames.forEach((game) => {
      for (let i = 0; i < game.holes.length; i++) {
        if (girSelection == "True" && !game.holes[i].gir) continue;
        if (girSelection == "False" && game.holes[i].gir) continue;
        if (fairwaySelection == "True" && !game.holes[i].fairway) continue;
        if (fairwaySelection == "False" && game.holes[i].fairway) continue;
        newSelection.push(game.holes[i]);
      }
    });

    setCurrentHoles(newSelection);
  }, [selectedGames, girSelection, fairwaySelection]);

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
    <Box sx={{ p: 3 }}>
      <Grid2 container spacing={3}>
        <Typography
          textAlign="center"
          variant="h2"
          sx={{ fontWeight: "bold", width: "100%" }}
        >
          {userData.name}
        </Typography>

        <Box sx={{ width: "100%" }}>
          <Typography
            textAlign="center"
            variant="h6"
            sx={{ width: "100%", fontWeight: "bold" }}
          >
            Number of Holes: {currentHoles.length}
          </Typography>

          <Typography
            textAlign="center"
            variant="h6"
            sx={{ width: "100%", fontWeight: "bold" }}
          >
            Total Putts: {totalPutts}
          </Typography>

          <Typography
            textAlign="center"
            variant="h6"
            sx={{ width: "100%", fontWeight: "bold" }}
          >
            Average First Putt Distance: {firstPuttDistAvg.toFixed(2)}
          </Typography>
        </Box>

        <Box sx={{ width: "100%" }}>
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

          <CustomSelect
            name="Select Fairway"
            options={[
              { value: "Both", label: "Both" },
              { value: "True", label: "True" },
              { value: "False", label: "False" },
            ]}
            onChange={(e) => {
              setFairwaySelection(e.target.value);
            }}
            defaultValue={fairwaySelection}
          />
        </Box>

        <Grid2 container spacing={3}>
          <PieChartView
            title="Green in Regulation"
            data={[
              {
                id: 0,
                label: "Yes",
                value: getCount(currentHoles, { gir: true }),
                color: "#468f15",
              },
              {
                id: 1,
                label: "No",
                value: getCount(currentHoles, { gir: false }),
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
                value: getCount(currentHoles, { upAndDown: true }),
                color: "#468f15",
              },
              {
                id: 1,
                label: "No",
                value: getCount(currentHoles, { upAndDown: false }),
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
                value: getCount(currentHoles, { fairway: true }),
                color: "#468f15",
              },
              {
                id: 1,
                label: "No",
                value: getCount(currentHoles, { fairway: false }),
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
                value: getCount(currentHoles, { missTee: "Left" }),
                color: "#468f15",
              },
              {
                id: 1,
                label: "Right",
                value: getCount(currentHoles, { missTee: "Right" }),
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
                value: getCount(currentHoles, { missApproach: miss }),
              };
            })}
          />

          {[3, 4, 5].map((par) => {
            return (
              <PieChartView
                key={par}
                title={`Club Hit from Tee on Par ${par}`}
                data={clubs.map((club) => {
                  return {
                    id: club,
                    label: club,
                    value: getCount(currentHoles, { club: club, par: par }),
                  };
                })}
              />
            );
          })}

          {[3, 4, 5].map((par) => {
            return (
              <PieChartView
                key={par}
                title={`Putts per Hole on Par ${par}`}
                data={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((putt) => {
                  return {
                    id: putt,
                    label: putt.toString(),
                    value: getCount(currentHoles, {
                      totalPutts: putt,
                      par: par,
                    }),
                  };
                })}
              />
            );
          })}
        </Grid2>

        {selectedGames && selectedGames.length === 1 && (
          <HolesView holes={currentHoles} />
        )}
      </Grid2>
    </Box>
  );
};

export default UserView;
