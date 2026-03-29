import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Scan {
  food: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  createdAt?: string;
}

const Charts = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/history");

        // 🔥 Transform data for charts
        const formatted = res.data.map((item: Scan, index: number) => ({
          name: item.food.substring(0, 10),
          calories: parseInt(item.calories),
protein: parseInt(item.protein),
carbs: parseInt(item.carbs),
fat: parseInt(item.fat),
        }));

        setData(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // 🔥 PIE DATA (aggregate)
  const total = data.reduce(
    (acc, item) => {
      acc.protein += item.protein || 0;
      acc.carbs += item.carbs || 0;
      acc.fat += item.fat || 0;
      return acc;
    },
    { protein: 0, carbs: 0, fat: 0 }
  );

  const pieData = [
    { name: "Protein", value: total.protein },
    { name: "Carbs", value: total.carbs },
    { name: "Fat", value: total.fat },
  ];

  const COLORS = ["#22c55e", "#3b82f6", "#f97316"];

  return (
    <div className="min-h-screen text-white p-6">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-heading mb-6">
          📊 Nutrition Analytics
        </h1>

        {/* LINE CHART */}
        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl mb-8">
          <h2 className="mb-4 text-lg font-semibold">
            Calories Trend
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="calories"
                stroke="#22c55e"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl">
          <h2 className="mb-4 text-lg font-semibold">
            Macronutrient Distribution
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={100}
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Charts;