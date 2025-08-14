import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ResultChartProps {
  correct: number;
  incorrect: number;
}

export default function ResultChart({ correct, incorrect }: ResultChartProps) {
  const data = {
    labels: ["Correct", "Incorrect"],
    datasets: [
      {
        label: "Quiz Results",
        data: [correct, incorrect],
        backgroundColor: ["#4CAF50", "#F44336"], // Green, Red
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
  };

  return <Bar data={data} options={options} />;
}
