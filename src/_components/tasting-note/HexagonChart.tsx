import {
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Filler,
  LineElement,
  Plugin,
  PointElement,
  RadialLinearScale,
  ScriptableScaleContext,
} from "chart.js";
import { Radar } from "react-chartjs-2";

// Register the required components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler);

// Define the type for chart points
interface ChartPoint {
  x: number;
  y: number;
}

const roundCornersPlugin: Plugin = {
  id: "roundCorners",
  afterDraw(chart) {
    const ctx = chart.ctx;
    const { datasets } = chart.data as ChartData<"radar">;

    datasets.forEach((dataset) => {
      if (!dataset || !dataset.data) return;

      ctx.save();
      ctx.beginPath();

      // Cast dataset.data to number[]
      const points = dataset.data as unknown as ChartPoint[]; // Cast data to the correct type

      // Draw the rounded corners
      points.forEach((point: ChartPoint, index: number) => {
        const nextPoint = points[(index + 1) % points.length];
        const radius = 10; // Adjust this for corner radius
        ctx.moveTo(point.x, point.y);
        ctx.arcTo(nextPoint.x, nextPoint.y, nextPoint.x, nextPoint.y, radius);
      });

      ctx.closePath();
      ctx.fillStyle = dataset.backgroundColor as string;
      ctx.fill();
      ctx.restore();
    });
  },
};

interface DataPoint {
  label: string;
  data: number;
}

interface RadarChartProps {
  dataPoints: DataPoint[];
}

const RadarChart = ({ dataPoints }: RadarChartProps) => {
  const labels = dataPoints.map((point) => point.label);
  const data = dataPoints.map((point) => point.data);

  const chartData: ChartData<"radar"> = {
    labels: labels,
    datasets: [
      {
        data: data.map((value) => (value > 6 ? 6 : value)), // Pass the dynamic data here
        backgroundColor: "#FF823C", // Custom background with transparency
        borderColor: "#FF823C",
        borderWidth: 2,
        pointRadius: 0, // Adjust this for rounded data points
        tension: 0.05, // Adjust this for curved lines
      },
    ],
  };

  const options: ChartOptions<"radar"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        // max: Math.max(...data), // Scale range
        max: 6,
        pointLabels: {
          font: {
            size: 14,
          },
        },
        ticks: {
          display: false,
          stepSize: 1, // Step size for the radial axis
        },
        grid: {
          circular: false,
          lineWidth: 2,
          color: (ctx: ScriptableScaleContext) => {
            return ctx.index === 6 ? "#FFB78E" : "#E2E8F0";
          },
        },
        angleLines: {
          display: false, // This removes the lines from labels to the center
        },
      },
    },
  };

  return (
    <div style={{ width: "195px", height: "190px" }}>
      <Radar data={chartData} options={options} />
    </div>
  );
};

export default RadarChart;
