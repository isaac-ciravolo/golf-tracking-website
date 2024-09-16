import React, { useState, useEffect } from "react";
import formatDateFromMilliseconds from "../util/DateConverter.js";

const GameView = (game) => {
  const [showHoles, setShowHoles] = useState(false); // State to track visibility of holes

  return (
    <div className="GameView" style={{ width: "100%", textAlign: "center" }}>
      <p>Game Name: {game.game.title}</p>
      <p>Game Created Date: {formatDateFromMilliseconds(game.game.gameDate)}</p>

      {/* Button to toggle hole visibility */}
      <button onClick={() => setShowHoles(!showHoles)}>
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
    </div>
  );
};

export default GameView;
