import { useState, useEffect } from "react";
import {
  CustomSelect,
  CustomNumberInput,
} from "../components/CustomComponents";
import { Box, Button } from "@mui/material";
import { clubs, teeShots, approachShots, yesAndNo } from "../util/Constants";
import { fetchGame, updateGame } from "../database/GameFunctions.js";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../firebase/AuthContext";
import { auth } from "../firebase/firebase.js";
const EditHoleView = () => {
  const [par, setPar] = useState(null);
  const [yardage, setYardage] = useState(null);
  const [score, setScore] = useState(null);
  const [teeClub, setTeeClub] = useState(null);
  const [teeShot, setTeeShot] = useState(null);
  const [approachClub, setApproachClub] = useState(null);
  const [approachShot, setApproachShot] = useState(null);
  const [upAndDown, setUpAndDown] = useState(null);
  const [upAndDownClub, setUpAndDownClub] = useState(null);
  const [totalPutts, setTotalPutts] = useState(null);
  const [firstPuttDist, setFirstPuttDist] = useState(null);
  const [penaltyStrokes, setPenaltyStrokes] = useState(null);
  const [shotsInside100, setShotsInside100] = useState(null);
  const [game, setGame] = useState(null);
  const { gameId, holeIndex } = useParams();
  const { userData: user } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHole = async () => {
      const token = await auth.currentUser.getIdToken();
      const res = await fetchGame(token, gameId);

      if (res.status !== 200) {
        alert("Error fetching game: " + res.error);
        return;
      }

      if (res.data && res.data.holes[holeIndex]) {
        const hole = res.data.holes[holeIndex];
        setPar(hole.par);
        setYardage(hole.yardage);
        setScore(hole.score);
        setTeeClub(hole.teeClub);
        setTeeShot(hole.teeShot);
        setApproachClub(hole.approachClub);
        setApproachShot(hole.approachShot);
        setUpAndDown(hole.upAndDown);
        setUpAndDownClub(hole.upAndDownClub);
        setTotalPutts(hole.totalPutts);
        setFirstPuttDist(hole.firstPuttDist);
        setPenaltyStrokes(hole.penaltyStrokes);
        setShotsInside100(hole.shotsInside100);
        setGame(res.data);
      }
    };

    fetchHole();
  }, [user, gameId, holeIndex]);

  const saveHole = async (e) => {
    const oldHole = game.holes[holeIndex];
    const newHole = {
      par: par === "-" ? "-" : Number(par),
      yardage: Number(yardage),
      score: Number(score),
      teeClub: par === 3 ? "-" : teeClub,
      teeShot: par === 3 ? "-" : teeShot,
      approachClub: approachClub,
      approachShot: approachShot,
      upAndDown: approachShot === "GIR" ? "-" : upAndDown,
      upAndDownClub: approachShot === "GIR" ? "-" : upAndDownClub,
      totalPutts: Number(totalPutts),
      firstPuttDist: Number(firstPuttDist),
      penaltyStrokes: Number(penaltyStrokes),
      shotsInside100: Number(shotsInside100),
    };
    game.holes[holeIndex] = newHole;

    const token = await auth.currentUser.getIdToken();
    const res = await updateGame(token, gameId, game);

    if (res.status !== 200) {
      alert("Error saving hole " + res.error);
      game.holes[holeIndex] = oldHole;
    }
    navigate("/editGames/" + gameId);
  };

  const deleteHole = async (e) => {
    const oldHole = game.holes[holeIndex];
    game.holes.splice(holeIndex, 1);
    const token = await auth.currentUser.getIdToken();
    const res = await updateGame(token, gameId, game);
    if (res.status !== 200) {
      alert("Error deleting hole " + res);
      game.holes.splice(holeIndex, 0, oldHole);
    }
    navigate("/editGames/" + gameId);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "calc(100vh - 230px)",
        overflowY: "auto",
        boxSizing: "border-box",
        p: 3,
      }}
    >
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
              marginBottom: 3,
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
              onClick={() => {
                navigate("/editGames/" + gameId);
              }}
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
          {(par === 4 || par === 5) && (
            <>
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
            </>
          )}
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
          {approachShot !== "GIR" && (
            <>
              <CustomSelect
                name="Up and Down"
                onChange={(e) => setUpAndDown(e.target.value)}
                defaultValue={upAndDown}
                options={yesAndNo.map((shot) => ({ value: shot, label: shot }))}
              />
              <CustomSelect
                name="Up and Down Club"
                onChange={(e) => setUpAndDownClub(e.target.value)}
                defaultValue={upAndDownClub}
                options={clubs.map((club) => ({ value: club, label: club }))}
              />
            </>
          )}
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
  );
};

export default EditHoleView;
