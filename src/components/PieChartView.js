import React from "react";
import { Typography, Grid2 } from "@mui/material";
import { PieChart } from "@mui/x-charts";
const PieChartView = ({ title, data }) => {
  return (
    <Grid2
      size={6}
      sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}
    >
      <Typography textAlign={"center"} variant="h6">
        {title}
      </Typography>
      <PieChart
        series={[
          {
            data,
          },
        ]}
        width={300}
        height={200}
      />
    </Grid2>
  );
};

export default PieChartView;