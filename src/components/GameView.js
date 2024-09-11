import React from "react";
import formatDateFromMilliseconds from "../util/DateConverter.js";

const GameView = (game) => {
  return (
    <div>
      <p>Game Name: {game.game.title}</p>
      <p>Game Created Date: {formatDateFromMilliseconds(game.game.gameDate)}</p>
      {game.game.holes.map((hole) => {
        return (
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
        );
      })}
    </div>
  );
};

export default GameView;
