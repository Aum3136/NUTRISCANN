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
    { key: "calories", label: "Calories", unit: "kcal", icon: "🔥", color: "text-orange-400", border: "focus-within:border-orange-400/50", required: true },
    { key: "protein",  label: "Protein",  unit: "g",    icon: "💪", color: "text-blue-400",   border: "focus-within:border-blue-400/50"   },
    { key: "carbs",    label: "Carbs",    unit: "g",    icon: "🌾", color: "text-yellow-400", border: "focus-within:border-yellow-400/50" },
    { key: "fat",      label: "Fat",      unit: "g",    icon: "🥑", color: "text-purple-400", border: "focus-within:border-purple-400/50" },
  ];

  const mealTypes = ["Breakfast", "Lunch", "Snack", "Dinner", "Other"];

  return (
    <div className="py-8 min-h-[calc(100vh-80px)] max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-3">
          ✍️ Manual Entry
        </div>
        <h1 className="text-4xl font-black text-white mb-2" style={{ fontFamily: "'Georgia', serif" }}>
          Log a <span className="text-green-400">Meal</span>
        </h1>
        <p className="text-gray-500">Don't have a photo? Enter nutrition details manually.</p>
      </motion.div>

      {success ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 rounded-3xl border border-green-500/20 bg-green-500/5">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-white font-black text-xl mb-2">Meal Saved!</h3>
          <p className="text-gray-500 text-sm">Redirecting to history...</p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-3xl border border-white/8 bg-white/2 p-6 space-y-5">

          {/* Food name */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2">
              Food Name <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/4 border border-white/10 focus-within:border-green-400/50 transition-all">
              <span className="text-lg">🍽️</span>
              <input type="text" placeholder="e.g. Grilled Chicken Salad" value={form.food} onChange={(e) => set("food", e.target.value)}
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-600" />
            </div>
          </div>

          {/* Meal type */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2">Meal Type</label>
            <div className="flex gap-2 flex-wrap">
              {mealTypes.map((m) => (
                <button key={m} onClick={() => set("meal", m)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    form.meal === m
                      ? "bg-green-500/20 border-green-500/40 text-green-400"
                      : "bg-white/4 border-white/10 text-gray-500 hover:text-gray-300"
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
                <label className="block text-xs font-semibold text-gray-400 mb-2">
                  {m.label} <span className="text-gray-600 font-normal">({m.unit})</span>
                  {m.required && <span className="text-red-400 ml-1">*</span>}
                </label>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/4 border border-white/10 ${m.border} transition-all`}>
                  <span className="text-base">{m.icon}</span>
                  <input type="number" min="0" placeholder="0"
                    value={form[m.key as keyof typeof form]}
                    onChange={(e) => set(m.key, e.target.value)}
                    className={`flex-1 bg-transparent text-sm outline-none placeholder-gray-600 ${m.color} font-bold`} />
                  <span className="text-gray-600 text-xs">{m.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Live preview */}
          {(form.calories || form.protein || form.carbs || form.fat) && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              className="rounded-2xl border border-white/8 bg-white/3 p-4">
              <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">Preview</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-bold text-sm">{form.food || "Unnamed meal"}</span>
                <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-lg">{form.meal}</span>
              </div>
              <div className="flex gap-3">
                {[
                  { label: "Cal", value: form.calories, unit: "kcal", color: "text-orange-400" },
                  { label: "Pro", value: form.protein, unit: "g", color: "text-blue-400" },
                  { label: "Carb", value: form.carbs, unit: "g", color: "text-yellow-400" },
                  { label: "Fat", value: form.fat, unit: "g", color: "text-purple-400" },
                ].map((n) => (
                  <div key={n.label} className="flex-1 text-center bg-white/3 rounded-xl py-2">
                    <div className={`text-base font-black ${n.color}`}>{n.value || "0"}<span className="text-[10px] font-normal">{n.unit}</span></div>
                    <div className="text-[10px] text-gray-600">{n.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">⚠️ {error}</motion.div>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={() => navigate(-1)}
              className="px-5 py-3 rounded-2xl border border-white/10 text-gray-400 hover:text-white text-sm font-semibold transition">← Cancel</button>
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 py-3 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm transition-all shadow-lg shadow-green-500/20 disabled:opacity-50">
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