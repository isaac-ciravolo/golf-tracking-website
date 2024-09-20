import React, { useState, useEffect } from "react";
import { Typography, Grid2 } from "@mui/material";
import { PieChart } from "@mui/x-charts";
const PieChartView = ({ title, data }) => {
  const [pieChartData, setPieChartData] = useState([]);
  useEffect(() => {
    const newData = [];
    for (let i = 0; i < data.length; i++)
      if (data[i].value > 0) newData.push(data[i]);
    setPieChartData(newData);
  }, [data]);

  return (
    <Grid2
      size={6}
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Typography textAlign={"center"} variant="h6">
        {title}
      </Typography>
      {pieChartData.length === 0 ? (
        <Typography sx={{ marginTop: "80px" }}>No data</Typography>
      ) : (
        <PieChart
          series={[{ data: pieChartData }]}
          width={400}
          height={200}
          slotProps={{ legend: { hidden: pieChartData.length > 5 } }}
        />
      )}
    </Grid2>
  );
};

export default PieChartView;
