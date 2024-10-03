import React, { useEffect, useState } from "react";

const HalfPizzaGraph = ({ sliceData, radius = 200 }) => {
  const numberOfSlices = sliceData.length;
  const angleStep = Math.PI / numberOfSlices; // Half circle angle (π radians)
  const [sum, setSum] = useState(0);

  useEffect(() => {
    let newSum = 0;
    sliceData.forEach((slice) => {
      newSum += slice.value;
    });
    setSum(newSum);
  }, [sliceData]);

  const calculateSlicePath = (radius, startAngle) => {
    const x1 = radius + radius * Math.cos(startAngle);
    const y1 = radius + radius * Math.sin(startAngle);
    const x2 = radius + radius * Math.cos(startAngle + angleStep);
    const y2 = radius + radius * Math.sin(startAngle + angleStep);

    return `M ${radius},${radius} L ${x1},${y1} A ${radius},${radius} 0 0,1 ${x2},${y2} Z`;
  };

  return (
    <svg width={400} height={200}>
      {sliceData.map((slice, index) => {
        const startAngle = Math.PI + index * angleStep; // Start at π to make it face upwards
        return (
          <path
            key={index}
            d={calculateSlicePath((slice.value / sum) * radius, startAngle)}
            fill={slice.color}
            stroke="#fff"
            strokeWidth={2}
          />
        );
      })}
    </svg>
  );
};

export default HalfPizzaGraph;
