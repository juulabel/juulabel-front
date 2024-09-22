import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

// Register the required components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler);

const roundCornersPlugin = {
  id: "roundCorners",
  afterDraw(chart: any) {
    const ctx = chart.ctx;
    const { datasets } = chart.data;

    datasets.forEach((dataset: any, datasetIndex: any) => {
      ctx.save();
      ctx.beginPath();

      const { points } = dataset;

      // Draw the rounded corners
      points.forEach((point: any, index: any) => {
        const nextPoint = points[(index + 1) % points.length];

        const radius = 10; // Adjust this for corner radius
        ctx.moveTo(point.x, point.y);
        ctx.arcTo(nextPoint.x, nextPoint.y, nextPoint.x, nextPoint.y, radius);
      });

      ctx.closePath();
      ctx.fillStyle = dataset.backgroundColor;
      ctx.fill();
      ctx.restore();
    });
  },
};

const RadarChart = ({ data }: any) => {
  const chartData = {
    labels: ["단맛", "신맛", "쓴맛", "감칠맛", "여운", "무게감"],
    datasets: [
      {
        data: data, // Pass the dynamic data here
        backgroundColor: "#FF823C", // Custom background with transparency
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 6, // Scale range
        pointLabels: {
          font: {
            size: 15,
          },
        },
        ticks: {
          display: false,
          stepSize: 1, // Step size for the radial axis
        },
        grid: {
          circular: false,
          lineWidth: 2,
          color: (ctx: any) => {
            if (ctx.index == 6) {
              return "#FFB78E";
            } else {
              return "#E2E8F0";
            }
          },
        },
        angleLines: {
          display: false, // This removes the lines from labels to the center
        },
      },
    },
  };

  return (
    <div style={{ width: "230px", height: "230px" }}>
      <Radar data={chartData} options={options} />
    </div>
  );
};

export default RadarChart;
