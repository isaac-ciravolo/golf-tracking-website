import React, { useState, useEffect } from "react";
import formatDateFromMilliseconds from "../util/DateConverter.js";
import { PieChart } from "react-minimal-pie-chart";

const GameView = (game) => {
  const [GIRtrue, setGIRtrue] = useState(0);
  const [GIRfalse, setGIRfalse] = useState(0);
  const [showHoles, setShowHoles] = useState(false); // State to track visibility of holes

  useEffect(() => {
    let trueCount = 0;
    let falseCount = 0;
    for (let i = 0; i < game.game.holes.length; i++) {
      if (game.game.holes[i].gir) {
        trueCount++;
      } else {
        falseCount++;
      }
    }
    setGIRtrue(trueCount);
    setGIRfalse(falseCount);
  }, [game]);

  // Function to toggle hole visibility
  const toggleHolesVisibility = () => {
    setShowHoles((prevState) => !prevState);
  };

  return (
    <div>
      <p>Game Name: {game.game.title}</p>
      <p>Game Created Date: {formatDateFromMilliseconds(game.game.gameDate)}</p>

      {/* Button to toggle hole visibility */}
      <button onClick={toggleHolesVisibility}>
        {showHoles ? "Hide Holes" : "Show Holes"}
      </button>

      {/* Conditionally render the holes list */}
      {showHoles &&
        game.game.holes.map((hole) => (
          <div key={hole.id}>
            <p>Holes:</p>
            <p>Par: {hole.par}</p>
            <p>Yardage: {hole.yardage}</p>
            <p>Score: {hole.score}</p>
            <h1>Tee Shot</h1>
            <p>Club: {hole.club}</p>
            <p>Fairway: {hole.fairway ? "Yes" : "No"}</p>
            <p>Miss: {hole.missTee}</p>
            <h1>Approach</h1>
            <p>Club Hit: {hole.clubHit}</p>
            <p>Green in Regulation: {hole.gir ? "Yes" : "No"}</p>
            <p>Miss: {hole.missApproach}</p>
            <h1>Short Game</h1>
            <p>Up and Down: {hole.upAndDown ? "Yes" : "No"}</p>
            <h1>Putts</h1>
            <p>Total Putts: {hole.totalPutts}</p>
            <p>First Putt Distance: {hole.firstPuttDist}</p>
          </div>
        ))}

      <div style={{ width: "500px" }}>
        <p style= {{ fontSize: "20px"}}><strong>GIR</strong></p>
        <p>True: Blue | False: Red</p>
        <PieChart
          data={[
            { title: "GIR True", value: GIRtrue, color: "#4287f5" },
            { title: "GIR False", value: GIRfalse, color: "#94042b" },
          ]}
        />
      </div>
    </div>
  );
};

export default GameView;
