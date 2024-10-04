import React, { useEffect, useState } from "react";

const HalfPizzaGraph = ({ sliceData }) => {
  const bigRadius = 200; // Max radius

  const [angleStep, setAngleStep] = useState(0);
  const [sum, setSum] = useState(0);

  useEffect(() => {
    let newNum = 0;
    sliceData.forEach((slice) => {
      newNum += slice.value;
    });
    setSum(newNum);
    setAngleStep(Math.PI / sliceData.length);
  }, [sliceData]);

  const calculateSlicePath = (radius, startAngle) => {
    const x1 = bigRadius + radius * Math.cos(startAngle);
    const y1 = bigRadius + radius * Math.sin(startAngle);
    const x2 = bigRadius + radius * Math.cos(startAngle + angleStep);
    const y2 = bigRadius + radius * Math.sin(startAngle + angleStep);

    return `M ${bigRadius},${bigRadius} L ${x1},${y1} A ${radius},${radius} 0 0,1 ${x2},${y2} Z`;
  };

  const calculateBackgroundPath = (radius) => {
    const x1 = bigRadius + radius * Math.cos(Math.PI);
    const y1 = bigRadius + radius * Math.sin(Math.PI);
    const x2 = bigRadius + radius * Math.cos(0);
    const y2 = bigRadius + radius * Math.sin(0);

    return `M ${bigRadius},${bigRadius} L ${x1},${y1} A ${radius},${radius} 0 0,1 ${x2},${y2} Z`;
  };

  return (
    <>
      {sum > 0 && (
        <svg width={bigRadius * 2} height={bigRadius}>
          {/* Light gray background semi-circle */}
          <path
            d={calculateBackgroundPath(bigRadius)}
            fill="lightgray"
            stroke="none"
          />
          {sliceData.map((slice, index) => {
            const startAngle = Math.PI + index * angleStep; // Start at π to make it face upwards

            // Calculate radius based on square root of the value (for proportional area)
            const sliceRadius = Math.sqrt(slice.value / sum) * bigRadius;

            return (
              <g key={index}>
                {/* Draw the main slice without stroke */}
                <path
                  d={calculateSlicePath(sliceRadius, startAngle)}
                  fill={slice.color}
                  stroke="none"
                />
              </g>
            );
          })}
          {sliceData.map((slice, index) => {
            if (index !== 0) {
              const startAngle = Math.PI + index * angleStep;

              return (
                <line
                  x1={bigRadius}
                  y1={bigRadius}
                  x2={bigRadius + bigRadius * Math.cos(startAngle)}
                  y2={bigRadius + bigRadius * Math.sin(startAngle)}
                  stroke="white"
                  strokeWidth={6}
                  key={index}
                />
              );
            }
          })}
          <line
            x1={0}
            y2={bigRadius}
            x2={bigRadius * 2}
            y1={bigRadius}
            stroke="white"
            strokeWidth={6}
          />
        </svg>
      )}
      {sum === 0 && (
        <svg width={bigRadius * 2} height={bigRadius}>
          <path
            d={calculateBackgroundPath(bigRadius)}
            fill="lightgray"
            stroke="none"
          />
        </svg>
      )}
    </>
  );
};

export default HalfPizzaGraph;
