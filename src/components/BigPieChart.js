import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { PieChart } from "@mui/x-charts";
const BigPieChart = ({ title, data, half = false }) => {
  const [pieChartData, setPieChartData] = useState([]);
  useEffect(() => {
    const newData = [];
    for (let i = 0; i < data.length; i++)
      if (data[i].value > 0) {
        newData.push(data[i]);
      }
    setPieChartData(newData);
  }, [data]);

  return (
    <Box
      sx={{
        width: "500px",
        height: "250px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {pieChartData.length === 0 ? (
        <Typography>No data</Typography>
      ) : (
        <PieChart
          series={[
            {
              startAngle: -90,
              endAngle: 90,
              data: pieChartData,
            },
          ]}
          width={500}
          height={250}
          margin={{ left: 20, right: 20, bottom: -250 }}
          position={"center"}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        />
      )}
    </Box>
  );
};

export default BigPieChart;
