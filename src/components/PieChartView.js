import React, { useState, useEffect } from "react";
import { Typography, Grid2 } from "@mui/material";
import { PieChart } from "@mui/x-charts";
const PieChartView = ({ title, data, half = false }) => {
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
    <Grid2
      size={4}
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
          series={[
            {
              arcLabel: (item) => item.value.toString(),
              arcLabelMinAngle: 40,
              arcLabelRadius: "60%",
              ...(half && {
                startAngle: -90,
                endAngle: 90,
              }),
              data: pieChartData,
            },
          ]}
          width={350}
          height={200}
          slotProps={{
            legend: {
              itemGap: 2,
              labelStyle: {
                fontSize: 14,
              },
              itemMarkWidth: 10,
              itemMarkHeight: 10,
            },
          }}
        />
      )}
    </Grid2>
  );
};

export default PieChartView;
