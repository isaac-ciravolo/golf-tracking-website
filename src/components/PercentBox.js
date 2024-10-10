import { Paper, Typography } from "@mui/material";

const PercentBox = ({ title, percent, shots }) => (
  <Paper
    sx={{
      width: "80px",
      height: "80px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 1,
      p: 3,
    }}
  >
    <Typography noWrap fontWeight={"bold"}>
      {title}
    </Typography>
    <Typography noWrap variant="h5">
      {percent.toFixed(1) + "%"}
    </Typography>
    <Typography noWrap>{shots + " shots"}</Typography>
  </Paper>
);

export default PercentBox;
