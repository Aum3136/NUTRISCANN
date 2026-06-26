import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const BACKEND = "http://localhost:5000";

export default function ManualEntry() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ food: "", calories: "", protein: "", carbs: "", fat: "", meal: "Other" });
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.food || !form.calories) { setError("Food name and calories are required."); return; }
    setLoading(true);
    setError("");
    try {
      await axios.post(`${BACKEND}/manual`, {
        food: form.food,
        calories: form.calories,
        protein: form.protein || "0",
        carbs: form.carbs || "0",
        fat: form.fat || "0",
        meal: form.meal,
      });
      setSuccess(true);
      setTimeout(() => navigate("/history"), 1500);
    } catch {
      setError("Failed to save entry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const macros = [
    { key: "calories", label: "Calories", unit: "kcal", icon: "🔥", color: "text-orange-600", border: "focus-within:border-orange-400", required: true },
    { key: "protein",  label: "Protein",  unit: "g",    icon: "💪", color: "text-blue-600",   border: "focus-within:border-blue-400"   },
    { key: "carbs",    label: "Carbs",    unit: "g",    icon: "🌾", color: "text-amber-600",  border: "focus-within:border-amber-400" },
    { key: "fat",      label: "Fat",      unit: "g",    icon: "🥑", color: "text-purple-600", border: "focus-within:border-purple-400" },
  ];

  const mealTypes = ["Breakfast", "Lunch", "Snack", "Dinner", "Other"];

  return (
    <div className="py-8 min-h-[calc(100vh-80px)] max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-55 border border-purple-100 text-purple-600 text-xs font-semibold mb-3">
          ✍️ Manual Entry
        </div>
        <h1 className="text-4xl font-black text-[#1a2e1a] mb-2" style={{ fontFamily: "'Georgia', serif" }}>
          Log a <span className="text-green-500">Meal</span>
        </h1>
        <p className="text-gray-600">Don't have a photo? Enter nutrition details manually.</p>
      </motion.div>

      {success ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 rounded-3xl border border-green-200 bg-green-50">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-green-800 font-black text-xl mb-2">Meal Saved!</h3>
          <p className="text-gray-500 text-sm">Redirecting to history...</p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-3xl border border-green-100 bg-white p-6 space-y-5 shadow-md">

          {/* Food name */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              Food Name <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-gray-200 focus-within:border-green-400 transition-all">
              <span className="text-lg">🍽️</span>
              <input type="text" placeholder="e.g. Grilled Chicken Salad" value={form.food} onChange={(e) => set("food", e.target.value)}
                className="flex-1 bg-transparent text-[#1a2e1a] text-sm outline-none placeholder-gray-400" />
            </div>
          </div>

          {/* Meal type */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">Meal Type</label>
            <div className="flex gap-2 flex-wrap">
              {mealTypes.map((m) => (
                <button key={m} onClick={() => set("meal", m)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    form.meal === m
                      ? "bg-green-50 border-green-300 text-green-600 shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:text-green-600 hover:border-green-300"
                  }`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Macro inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {macros.map((m) => (
              <div key={m.key}>
                <label className="block text-xs font-semibold text-gray-500 mb-2">
                  {m.label} <span className="text-gray-400 font-normal">({m.unit})</span>
                  {m.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-gray-200 ${m.border} transition-all`}>
                  <span className="text-base">{m.icon}</span>
                  <input type="number" min="0" placeholder="0"
                    value={form[m.key as keyof typeof form]}
                    onChange={(e) => set(m.key, e.target.value)}
                    className={`flex-1 bg-transparent text-sm outline-none placeholder-gray-400 ${m.color} font-bold`} />
                  <span className="text-gray-400 text-xs">{m.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Live preview */}
          {(form.calories || form.protein || form.carbs || form.fat) && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              className="rounded-2xl border border-green-100 bg-white p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">Preview</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#1a2e1a] font-bold text-sm">{form.food || "Unnamed meal"}</span>
                <span className="text-xs text-gray-500 bg-gray-100 border border-gray-200 px-2 py-1 rounded-lg">{form.meal}</span>
              </div>
              <div className="flex gap-3">
                {[
                  { label: "Cal", value: form.calories, unit: "kcal", color: "text-orange-600" },
                  { label: "Pro", value: form.protein, unit: "g", color: "text-blue-600" },
                  { label: "Carb", value: form.carbs, unit: "g", color: "text-amber-600" },
                  { label: "Fat", value: form.fat, unit: "g", color: "text-purple-600" },
                ].map((n) => (
                  <div key={n.label} className="flex-1 text-center bg-gray-50 rounded-xl py-2 border border-green-50/50">
                    <div className={`text-base font-black ${n.color}`}>{n.value || "0"}<span className="text-[10px] font-normal">{n.unit}</span></div>
                    <div className="text-[10px] text-gray-500">{n.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-500 text-sm font-medium">⚠️ {error}</motion.div>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={() => navigate(-1)}
              className="px-5 py-3 rounded-2xl border-2 border-gray-300 bg-white text-gray-700 hover:text-[#1a2e1a] hover:border-gray-400 text-sm font-semibold transition-all">← Cancel</button>
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 py-3 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm transition-all shadow-lg hover:shadow-green-200 hover:shadow-xl disabled:opacity-50">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...
                </span>
              ) : "✅ Save Meal"}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}