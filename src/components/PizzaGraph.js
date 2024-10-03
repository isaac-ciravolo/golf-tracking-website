import React from "react";

const PizzaGraph = () => {
  const sliceData = [
    { value: 120, color: "#ff9999" }, // Slice 1 radius
    { value: 90, color: "#66b3ff" }, // Slice 2 radius
    { value: 150, color: "#99ff99" }, // Slice 3 radius
    { value: 80, color: "#ffcc99" }, // Slice 4 radius
    { value: 130, color: "#c2c2f0" }, // Slice 5 radius
    { value: 110, color: "#ffb3e6" }, // Slice 6 radius
  ];

  const centerX = 200;
  const centerY = 200;
  const numberOfSlices = sliceData.length;
  const angleStep = (2 * Math.PI) / numberOfSlices; // Equal angle for each slice

  const calculateSlicePath = (radius, startAngle) => {
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(startAngle + angleStep);
    const y2 = centerY + radius * Math.sin(startAngle + angleStep);

    return `M ${centerX},${centerY} L ${x1},${y1} A ${radius},${radius} 0 0,1 ${x2},${y2} Z`;
  };

  return (
    <svg width={400} height={400}>
      <g transform={`rotate(30, ${centerX}, ${centerY})`}>
        {sliceData.map((slice, index) => {
          const startAngle = index * angleStep;
          return (
            <path
              key={index}
              d={calculateSlicePath(slice.value, startAngle)}
              fill={slice.color}
              stroke="#fff"
              strokeWidth={2}
            />
          );
        })}
        {/* Center circle */}
        <circle cx={centerX} cy={centerY} r={50} fill="#fff" />
      </g>
    </svg>
  );
};

export default PizzaGraph;
