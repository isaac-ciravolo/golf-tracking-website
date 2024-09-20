import React from "react";
import { Grid2, Box, Typography } from "@mui/material";

const Cell = ({ text, bold = false, color = "white" }) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "20px",
        display: "flex",
        alignItems: "center",
        border: "1px solid black",
        backgroundColor: color,
      }}
      border={"1px solid black"}
    >
      <Typography
        sx={{
          fontSize: "10px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          marginLeft: "5px",
        }}
        fontWeight={bold ? "bold" : "normal"}
      >
        {text}
      </Typography>
    </Box>
  );
};

const HolesView = ({ holes }) => {
  return (
    <Grid2 container sx={{ width: "100%" }}>
      <Grid2 size={(12 / (holes.length + 3)) * 3}>
        <Cell text={""} />
        <Cell text={""} color="purple" />
        <Cell text={"PAR"} bold color="lightGray" />
        <Cell text={"YARDAGE"} bold />
        <Cell text={"SCORE"} bold color="lightGray" />
        <Cell text={""} color="purple" />
        <Cell text={"TEE SHOT"} bold color="lightGray" />
        <Cell text={"Club"} />
        <Cell text={"Fairway"} color="lightGray" />
        <Cell text={"Miss"} />
        <Cell text={""} color="purple" />
        <Cell text={"APPROACH"} bold />
        <Cell text={"Club Hit"} color="lightGray" />
        <Cell text={"GIR"} />
        <Cell text={"Miss"} color="lightGray" />
        <Cell text={""} color="purple" />
        <Cell text={"SHORT GAME"} bold color="lightGray" />
        <Cell text={"Up and Down"} />
        <Cell text={""} color="purple" />
        <Cell text={"PUTTS"} bold />
        <Cell text={"Total Putts"} color="lightGray" />
        <Cell text={"1st Putt Distance"} />
        <Cell text={""} color="purple" />
        <Cell text={"PENALTY STROKES"} bold />
        <Cell text={"SHOTS INSIDE 100 YARDS"} bold color="lightGray" />
      </Grid2>
      {holes.map((hole, i) => (
        <Grid2 size={12 / (holes.length + 3)} key={hole.id}>
          <Cell text={i + 1} bold />
          <Cell text={""} color="purple" />
          <Cell text={hole.par} color={"lightGray"} />
          <Cell text={hole.yardage} />
          <Cell text={hole.score} color={"lightGray"} />
          <Cell text={""} color="purple" />
          <Cell text={""} color="lightGray" />
          <Cell text={hole.club} />
          <Cell text={hole.fairway ? "Yes" : "No"} color="lightGray" />
          <Cell text={hole.missTee} />
          <Cell text={""} color="purple" />
          <Cell text={""} />
          <Cell text={hole.clubHit} color="lightGray" />
          <Cell text={hole.gir ? "Yes" : "No"} />
          <Cell text={hole.missApproach} color="lightGray" />
          <Cell text={""} color="purple" />
          <Cell text={""} color="lightGray" />
          <Cell text={hole.upAndDown ? "Yes" : "No"} />
          <Cell text={""} color="purple" />
          <Cell text={""} />
          <Cell text={hole.totalPutts} color="lightGray" />
          <Cell text={hole.firstPuttDist} />
          <Cell text={""} color="purple" />
          <Cell text={hole.penaltyStrokes} />
          <Cell text={hole.shotsInside100} color="lightGray" />
        </Grid2>
      ))}
    </Grid2>
  );
};

export default HolesView;
