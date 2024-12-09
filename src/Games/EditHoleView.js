import { useState, useEffect } from "react";
import {
  CustomSelect,
  CustomNumberInput,
} from "../components/CustomComponents";
import { Box, Button } from "@mui/material";
import { clubs, teeShots, approachShots, yesAndNo } from "../util/Constants";
import { updateGame } from "../DatabaseFunctions";
const EditHoleView = ({ userId, game, index, goBack }) => {
  const [par, setPar] = useState(null);
  const [yardage, setYardage] = useState(null);
  const [score, setScore] = useState(null);
  const [teeClub, setTeeClub] = useState(null);
  const [teeShot, setTeeShot] = useState(null);
  const [approachClub, setApproachClub] = useState(null);
  const [approachShot, setApproachShot] = useState(null);
  const [upAndDown, setUpAndDown] = useState(null);
  const [totalPutts, setTotalPutts] = useState(null);
  const [firstPuttDist, setFirstPuttDist] = useState(null);
  const [penaltyStrokes, setPenaltyStrokes] = useState(null);
  const [shotsInside100, setShotsInside100] = useState(null);

  useEffect(() => {
    if (game.holes[index]) {
      const hole = game.holes[index];
      setPar(hole.par);
      setYardage(hole.yardage);
      setScore(hole.score);
      setTeeClub(hole.teeClub);
      setTeeShot(hole.teeShot);
      setApproachClub(hole.approachClub);
      setApproachShot(hole.approachShot);
      setUpAndDown(hole.upAndDown);
      setTotalPutts(hole.totalPutts);
      setFirstPuttDist(hole.firstPuttDist);
      setPenaltyStrokes(hole.penaltyStrokes);
      setShotsInside100(hole.shotsInside100);
    }
  }, [game]);

  const saveHole = async (e) => {
    const oldHole = game.holes[index];
    const newHole = {
      par: Number(par),
      yardage: Number(yardage),
      score: Number(score),
      teeClub: teeClub,
      teeShot: teeShot,
      approachClub: approachClub,
      approachShot: approachShot,
      upAndDown: upAndDown,
      totalPutts: Number(totalPutts),
      firstPuttDist: Number(firstPuttDist),
      penaltyStrokes: Number(penaltyStrokes),
      shotsInside100: Number(shotsInside100),
    };
    game.holes[index] = newHole;

    const res = await updateGame(userId, game.id, game);

    if (res !== "Success!") {
      alert("Error saving hole " + res);
      game.holes[index] = oldHole;
    }
    goBack();
  };

  const deleteHole = async (e) => {
    const oldHole = game.holes[index];
    game.holes.splice(index, 1);
    const res = await updateGame(userId, game.id, game);
    if (res !== "Success!") {
      alert("Error deleting hole " + res);
      game.holes.splice(index, 0, oldHole);
    }
    goBack();
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <Box sx={{ p: 3 }}>
        {approachClub && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                gap: 3,
                justifyContent: "center",
                m: 4,
              }}
            >
              <Button
                onClick={saveHole}
                variant="contained"
                sx={{ width: "200px", height: "50px" }}
              >
                Save Hole
              </Button>
              <Button
                onClick={() => goBack()}
                variant="contained"
                sx={{ width: "200px", height: "50px" }}
              >
                Back
              </Button>
              <Button
                onClick={deleteHole}
                variant="contained"
                sx={{ width: "200px", height: "50px" }}
              >
                Delete Hole
              </Button>
            </Box>

            <CustomSelect
              name="Par"
              onChange={(e) => setPar(e.target.value)}
              defaultValue={par}
              options={["-", 3, 4, 5].map((par) => ({
                value: par,
                label: par,
              }))}
            />
            <CustomNumberInput
              name="Yardage"
              defaultValue={yardage}
              onChange={(e) => setYardage(e.target.value)}
            />
            <CustomNumberInput
              name="Score"
              defaultValue={score}
              onChange={(e) => setScore(e.target.value)}
            />
            <CustomSelect
              name="Tee Club"
              onChange={(e) => setTeeClub(e.target.value)}
              defaultValue={teeClub}
              options={clubs.map((club) => ({ value: club, label: club }))}
            />
            <CustomSelect
              name="Tee Shot"
              onChange={(e) => setTeeShot(e.target.value)}
              defaultValue={teeShot}
              options={teeShots.map((shot) => ({ value: shot, label: shot }))}
            />
            <CustomSelect
              name="Approach Club"
              onChange={(e) => setApproachClub(e.target.value)}
              defaultValue={approachClub}
              options={clubs.map((club) => ({ value: club, label: club }))}
            />
            <CustomSelect
              name="Approach Shot"
              onChange={(e) => setApproachShot(e.target.value)}
              defaultValue={approachShot}
              options={approachShots.map((shot) => ({
                value: shot,
                label: shot,
              }))}
            />
            <CustomSelect
              name="Up and Down"
              onChange={(e) => setUpAndDown(e.target.value)}
              defaultValue={upAndDown}
              options={yesAndNo.map((shot) => ({ value: shot, label: shot }))}
            />
            <CustomNumberInput
              name="Total Putts"
              defaultValue={totalPutts}
              onChange={(e) => setTotalPutts(e.target.value)}
            />
            <CustomNumberInput
              name="First Putt Distance"
              defaultValue={firstPuttDist}
              onChange={(e) => setFirstPuttDist(e.target.value)}
            />
            <CustomNumberInput
              name="Penalty Strokes"
              defaultValue={penaltyStrokes}
              onChange={(e) => setPenaltyStrokes(e.target.value)}
            />
            <CustomNumberInput
              name="Shots Inside 100"
              defaultValue={shotsInside100}
              onChange={(e) => setShotsInside100(e.target.value)}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default EditHoleView;
