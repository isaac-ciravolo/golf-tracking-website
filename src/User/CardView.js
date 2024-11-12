import React from "react";
import { Grid2, Box, Typography } from "@mui/material";

const Cell = ({ text, bold = false, color = "white" }) => {
  return (
    <Box
      sx={{
        width: "200px",
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
          overflow: "auto",
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

const CardView = ({ currentHoles }) => {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "200px",
          zIndex: 1,
        }}
      >
        <Cell text={"HOLE"} bold />
        <Cell text={""} color="rgb(188, 139, 216)" />
        <Cell text={"PAR"} bold color="lightGray" />
        <Cell text={"YARDAGE"} bold />
        <Cell text={"SCORE"} bold color="lightGray" />
        <Cell text={""} color="rgb(188, 139, 216)" />
        <Cell text={"TEE SHOT"} bold color="lightGray" />
        <Cell text={"Club"} />
        <Cell text={"Shot"} color="lightGray" />
        <Cell text={""} color="rgb(188, 139, 216)" />
        <Cell text={"APPROACH"} bold />
        <Cell text={"Club"} color="lightGray" />
        <Cell text={"Shot"} />
        <Cell text={""} color="rgb(188, 139, 216)" />
        <Cell text={"SHORT GAME"} bold />
        <Cell text={"Club"} color="lightGray" />
        <Cell text={"Up and Down"} />
        <Cell text={""} color="rgb(188, 139, 216)" />
        <Cell text={"PUTTS"} bold />
        <Cell text={"Total Putts"} color="lightGray" />
        <Cell text={"1st Putt Distance"} />
        <Cell text={""} color="rgb(188, 139, 216)" />
        <Cell text={"PENALTY STROKES"} bold />
        <Cell text={"SHOTS INSIDE 100 YARDS"} bold color="lightGray" />
      </Box>
      <Box
        sx={{
          display: "flex",
          overflowX: "scroll",
          overflowY: "hidden",
          whiteSpace: "nowrap",
          scrollBehavior: "smooth",
          width: "800px",
        }}
      >
        {currentHoles.map((hole, i) => (
          <Box
            key={hole.id}
            sx={{ display: "flex", flexDirection: "column", width: "200px" }}
          >
            <Cell text={i + 1} bold />
            <Cell text={""} color="rgb(188, 139, 216)" />
            <Cell text={hole.par} color={"lightGray"} />
            <Cell text={hole.yardage} />
            <Cell text={hole.score} color={"lightGray"} />
            <Cell text={""} color="rgb(188, 139, 216)" />
            <Cell text={""} color="lightGray" />
            <Cell text={hole.teeClub} />
            <Cell text={hole.teeShot} color="lightGray" />
            <Cell text={""} color="rgb(188, 139, 216)" />
            <Cell text={""} />
            <Cell text={hole.approachClub} color="lightGray" />
            <Cell text={hole.approachShot} />
            <Cell text={""} color="rgb(188, 139, 216)" />
            <Cell text={""} />
            <Cell text={hole.upAndDownClub} color="lightGray" />
            <Cell text={hole.upAndDown} />
            <Cell text={""} color="rgb(188, 139, 216)" />
            <Cell text={""} />
            <Cell text={hole.totalPutts} color="lightGray" />
            <Cell text={hole.firstPuttDist} />
            <Cell text={""} color="rgb(188, 139, 216)" />
            <Cell text={hole.penaltyStrokes} />
            <Cell text={hole.shotsInside100} color="lightGray" />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CardView;
