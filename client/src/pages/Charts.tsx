

<div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white"></div>
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


// 🔥 HELPER
const extractNumber = (val: string) => {
  if (!val) return 0;

  if (val.includes("-")) {
    const parts = val.split("-");
    return (Number(parts[0]) + Number(parts[1])) / 2;
  }

  return Number(val.replace(/[^\d]/g, ""));
};

interface Scan {
  food: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  createdAt?: string;
}

type Mode = "all" | "weekly" | "monthly";

const Charts = () => {
  const [rawData, setRawData] = useState<Scan[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [meals, setMeals] = useState<string[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<string>("all");
  const [mode, setMode] = useState<Mode>("all");

  // 🔥 FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get<Scan[]>("http://localhost:5000/history");

        setRawData(res.data);

        // ✅ SIMPLE + ERROR-FREE UNIQUE MEALS
        const uniqueMeals = Array.from(
          new Set(res.data.map((item) => item.food || "Unknown"))
        );

        setMeals(uniqueMeals);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // 🔥 FILTER + MODE
  useEffect(() => {
    const now = new Date();

    let filtered = [...rawData];

    // 👉 Meal filter
    if (selectedMeal !== "all") {
      filtered = filtered.filter(
        (item) => item.food === selectedMeal
      );
    }

    // 👉 Weekly
    if (mode === "weekly") {
      const last7 = new Date();
      last7.setDate(now.getDate() - 7);

      filtered = filtered.filter(
        (item) =>
          item.createdAt &&
          new Date(item.createdAt) >= last7
      );
    }

    // 👉 Monthly
    if (mode === "monthly") {
      const last30 = new Date();
      last30.setDate(now.getDate() - 30);

      filtered = filtered.filter(
        (item) =>
          item.createdAt &&
          new Date(item.createdAt) >= last30
      );
    }

    // 👉 FORMAT
    const formatted = filtered.map((item, index) => ({
      name: `Scan ${index + 1}`,
      calories: extractNumber(item.calories),
      protein: extractNumber(item.protein),
      carbs: extractNumber(item.carbs),
      fat: extractNumber(item.fat),
    }));

    console.log("FINAL CHART DATA:", formatted);

    setData(formatted);
  }, [rawData, selectedMeal, mode]);

  // 🔥 PIE DATA
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

        {/* TITLE */}
        <h1 className="text-4xl mb-6">
          📊 Nutrition Analytics
        </h1>

        {/* 🔥 CONTROLS */}
        <div className="flex flex-wrap gap-4 mb-6">

          {/* Meal Dropdown */}
          <select
            value={selectedMeal}
            onChange={(e) => setSelectedMeal(e.target.value)}
            className="bg-white/10 px-4 py-2 rounded-lg border border-white/20"
          >
            <option value="all">All Meals</option>
            {meals.map((meal, i) => (
              <option key={i} value={meal}>
                {meal}
              </option>
            ))}
          </select>

          {/* Mode Buttons */}
          {["all", "weekly", "monthly"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m as Mode)}
              className={`px-4 py-2 rounded-lg ${
                mode === m
                  ? "bg-green-500"
                  : "bg-white/10"
              }`}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>

        {/* LABEL */}
        <p className="text-green-400 mb-4">
          Showing: {selectedMeal} | Mode: {mode}
        </p>

        {/* LINE CHART */}
        <div className="bg-white/10 p-6 rounded-2xl mb-8">
          <h2 className="mb-4 text-lg font-semibold">
            Calories Trend
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid stroke="#444" />
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
        <div className="bg-white/10 p-6 rounded-2xl">
          <h2 className="mb-4 text-lg font-semibold">
            Macronutrient Distribution
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={100} label>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
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