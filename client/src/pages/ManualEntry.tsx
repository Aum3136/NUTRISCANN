<div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white"></div>
import { useState } from "react";
import axios from "axios";

const mealsList = ["Breakfast", "Lunch", "Dinner", "Snacks"];

const suggestions = [
  { name: "Rice (1 cup)", calories: "200", protein: "4", carbs: "45", fat: "1" },
  { name: "Roti (1)", calories: "120", protein: "3", carbs: "20", fat: "2" },
  { name: "Egg (boiled)", calories: "70", protein: "6", carbs: "1", fat: "5" },
  { name: "Milk (1 glass)", calories: "150", protein: "8", carbs: "12", fat: "8" },
  { name: "Banana", calories: "100", protein: "1", carbs: "27", fat: "0" },
];

const ManualEntry = () => {
  const [meal, setMeal] = useState("Breakfast");
  const [food, setFood] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const handleAdd = async () => {
    try {
      await axios.post("http://localhost:5000/manual", {
        food,
        calories,
        protein,
        carbs,
        fat,
        meal,
      });

      alert("Food Added ✅");

      // reset
      setFood("");
      setCalories("");
      setProtein("");
      setCarbs("");
      setFat("");

    } catch (err) {
      console.error(err);
      alert("Error adding food");
    }
  };

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl mb-6">🍽 Manual Food Entry</h1>

        {/* MEAL SELECT */}
        <select
          value={meal}
          onChange={(e) => setMeal(e.target.value)}
          className="mb-4 bg-white/10 px-4 py-2 rounded-lg"
        >
          {mealsList.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>

        {/* FOOD INPUT */}
        <input
          placeholder="Enter food name..."
          value={food}
          onChange={(e) => setFood(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-white/10"
        />

        {/* SUGGESTIONS */}
        <div className="bg-white/10 p-4 rounded-xl mb-4">
          <p className="mb-2 text-gray-400">Quick Add</p>

          {suggestions.map((item, i) => (
            <div
              key={i}
              onClick={() => {
                setFood(item.name);
                setCalories(item.calories);
                setProtein(item.protein);
                setCarbs(item.carbs);
                setFat(item.fat);
              }}
              className="cursor-pointer hover:bg-white/10 p-2 rounded"
            >
              {item.name} - {item.calories} kcal
            </div>
          ))}
        </div>

        {/* MACROS INPUT */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input placeholder="Calories" value={calories} onChange={(e) => setCalories(e.target.value)} className="p-2 bg-white/10 rounded" />
          <input placeholder="Protein" value={protein} onChange={(e) => setProtein(e.target.value)} className="p-2 bg-white/10 rounded" />
          <input placeholder="Carbs" value={carbs} onChange={(e) => setCarbs(e.target.value)} className="p-2 bg-white/10 rounded" />
          <input placeholder="Fat" value={fat} onChange={(e) => setFat(e.target.value)} className="p-2 bg-white/10 rounded" />
        </div>

        {/* ADD BUTTON */}
        <button
          onClick={handleAdd}
          className="w-full bg-green-500 py-2 rounded-lg"
        >
          Add Food
        </button>

      </div>
    </div>
  );
};

export default ManualEntry;