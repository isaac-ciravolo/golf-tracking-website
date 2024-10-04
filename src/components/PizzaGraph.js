import React, { useEffect, useState } from "react";

const PizzaGraph = ({ sliceData, circleData }) => {
  const bigRadius = 200; // Max radius of the pizza
  const smallCircleRadius = 80; // Radius for the inner small gray background circle
  const numberOfSlices = sliceData.length;
  const angleStep = (2 * Math.PI) / numberOfSlices; // Full circle angle (2π radians)

  const [sum, setSum] = useState(0);

  useEffect(() => {
    let newNum = 0;
    sliceData.forEach((slice) => {
      newNum += slice.value;
    });
    newNum += circleData.value;
    setSum(newNum);
  }, [sliceData, circleData]);

  const calculateSlicePath = (innerRadius, outerRadius, startAngle) => {
    const x1 = bigRadius + outerRadius * Math.cos(startAngle);
    const y1 = bigRadius + outerRadius * Math.sin(startAngle);
    const x2 = bigRadius + outerRadius * Math.cos(startAngle + angleStep);
    const y2 = bigRadius + outerRadius * Math.sin(startAngle + angleStep);

    const x3 = bigRadius + innerRadius * Math.cos(startAngle + angleStep);
    const y3 = bigRadius + innerRadius * Math.sin(startAngle + angleStep);
    const x4 = bigRadius + innerRadius * Math.cos(startAngle);
    const y4 = bigRadius + innerRadius * Math.sin(startAngle);

    return `M ${x4},${y4} L ${x1},${y1} A ${outerRadius},${outerRadius} 0 0,1 ${x2},${y2} L ${x3},${y3} A ${innerRadius},${innerRadius} 0 0,0 ${x4},${y4} Z`;
  };

  const calculateBackgroundPath = (radius) => {
    return `
      M ${bigRadius},${bigRadius} 
      m -${radius}, 0 
      a ${radius},${radius} 0 1,0 ${2 * radius},0 
      a ${radius},${radius} 0 1,0 -${2 * radius},0
    `;
  };

  const calculateOuterRadius = (sliceValue) => {
    const totalAvailableArea =
      Math.PI * (bigRadius * bigRadius - smallCircleRadius * smallCircleRadius);
    const sliceProportionalArea = (sliceValue / sum) * totalAvailableArea;

    // Solve for R_outer^2 = sliceProportionalArea + smallCircleRadius^2
    const sliceOuterRadius = Math.sqrt(
      sliceProportionalArea / Math.PI + smallCircleRadius * smallCircleRadius
    );

    return sliceOuterRadius;
  };

  return (
    <>
      {sum > 0 && (
        <svg width={bigRadius * 2} height={bigRadius * 2}>
          {/* Light gray background full circle */}
          <path
            d={calculateBackgroundPath(bigRadius)}
            fill="lightgray"
            stroke="none"
          />

          {sliceData.map((slice, index) => {
            const startAngle = index * angleStep + Math.PI / 6;
            const outerRadius = calculateOuterRadius(slice.value);

            return (
              <g key={index}>
                {/* Draw the slice from inner circle's radius to the calculated outer radius */}
                <path
                  d={calculateSlicePath(
                    smallCircleRadius,
                    outerRadius,
                    startAngle
                  )}
                  fill={slice.color}
                  stroke="none"
                />
              </g>
            );
          })}

          {sliceData.map((slice, index) => {
            const startAngle = index * angleStep + Math.PI / 6;

            return (
              <line
                x1={bigRadius + smallCircleRadius * Math.cos(startAngle)}
                y1={bigRadius + smallCircleRadius * Math.sin(startAngle)}
                x2={bigRadius + bigRadius * Math.cos(startAngle)}
                y2={bigRadius + bigRadius * Math.sin(startAngle)}
                stroke="white"
                strokeWidth={6}
                key={index}
              />
            );
          })}

          {/* Inner small gray background circle */}
          <circle
            cx={bigRadius}
            cy={bigRadius}
            r={smallCircleRadius + 6}
            fill="white"
          />
          <circle
            cx={bigRadius}
            cy={bigRadius}
            r={smallCircleRadius}
            fill="lightgray"
          />

          {/* Inner colored circle proportional to circleData.value */}
          {circleData && (
            <circle
              cx={bigRadius}
              cy={bigRadius}
              r={Math.sqrt(circleData.value / sum) * smallCircleRadius} // Proportional radius within small gray circle
              fill={circleData.color}
              stroke="none"
            />
          )}
        </svg>
      )}
      {sum === 0 && (
        <svg width={bigRadius * 2} height={bigRadius * 2}>
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

export default PizzaGraph;
