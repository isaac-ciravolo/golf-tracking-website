export const validHole = (hole) => {
  if (hole.par === "-") {
    return false;
  }
  if (hole.yardage === 0) {
    return false;
  }
  if (hole.score === 0) {
    return false;
  }
  if (hole.par > 3 && hole.teeClub === "-") {
    return false;
  }
  if (hole.par > 3 && hole.teeShot === "-") {
    return false;
  }
  if (hole.approachShot === "-") {
    return false;
  }
  if (hole.approachClub === "-") {
    return false;
  }
  if (hole.approachShot !== "GIR" && hole.upAndDown === "-") {
    return false;
  }
  if (hole.approachShot !== "GIR" && hole.upAndDownClub === "-") {
    return false;
  }
  return true;
};

export const validGame = (game) => {
  if (game.holes.length !== 9 && game.holes.length !== 18) {
    return false;
  }
  for (let i = 0; i < game.holes.length; i++) {
    if (!validHole(game.holes[i])) {
      return false;
    }
  }
  return true;
};
