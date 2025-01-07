export const getCountAnd = (currHoles, conditions) => {
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

export const getCountOr = (currHoles, conditions) => {
  let count = 0;
  currHoles.forEach((hole) => {
    let add = 0;
    Object.keys(hole).forEach((key) => {
      if (conditions[key] !== undefined && conditions[key] === hole[key])
        add = 1;
    });
    count += add;
  });
  return count;
};
