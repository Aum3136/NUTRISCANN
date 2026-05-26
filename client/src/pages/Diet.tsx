import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const BACKEND = "http://localhost:5000";

const mealIcons: Record<string, string> = {
  Breakfast: "🌅",
  Lunch: "☀️",
  Snack: "🍎",
  Dinner: "🌙",
};

const mealColors: Record<string, { bg: string; border: string; accent: string; dot: string }> = {
  Breakfast: { bg: "bg-yellow-500/8",  border: "border-yellow-500/20", accent: "text-yellow-400",  dot: "bg-yellow-400"  },
  Lunch:     { bg: "bg-green-500/8",   border: "border-green-500/20",  accent: "text-green-400",   dot: "bg-green-400"   },
  Snack:     { bg: "bg-purple-500/8",  border: "border-purple-500/20", accent: "text-purple-400",  dot: "bg-purple-400"  },
  Dinner:    { bg: "bg-blue-500/8",    border: "border-blue-500/20",   accent: "text-blue-400",    dot: "bg-blue-400"    },
};

const defaultColors = { bg: "bg-white/5", border: "border-white/10", accent: "text-gray-300", dot: "bg-gray-400" };

// Parse "Breakfast: Oats + Fruits" into { name, content }
function parseMealItem(item: string) {
  const colonIdx = item.indexOf(":");
  if (colonIdx === -1) return { name: "Meal", content: item };
  return {
    name: item.slice(0, colonIdx).trim(),
    content: item.slice(colonIdx + 1).trim(),
  };
}

export default function Diet() {
  const [form, setForm] = useState({
    age: "", height: "", weight: "", goal: "", type: "", condition: "",
  });
  const [plan, setPlan] = useState<string[]>([]);
  const [calories, setCalories] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const generatePlan = async () => {
    if (!form.age || !form.height || !form.weight || !form.goal || !form.type) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${BACKEND}/diet`, form);
      setPlan(res.data.plan || []);
      setCalories(res.data.calories || null);
    } catch {
      setError("Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-2xl bg-white/4 border border-white/10 text-white text-sm outline-none placeholder-gray-600 focus:border-green-400/50 transition-all";
  const selectClass =
    "w-full px-4 py-3 rounded-2xl bg-white/4 border border-white/10 text-sm outline-none focus:border-green-400/50 transition-all appearance-none cursor-pointer";

  return (
    <div className="py-8 min-h-[calc(100vh-80px)]">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold mb-3">
          🥗 AI Diet Planner
        </div>
        <h1 className="text-4xl font-black text-white mb-2" style={{ fontFamily: "'Georgia', serif" }}>
          Smart <span className="text-green-400">Diet Plan</span>
        </h1>
        <p className="text-gray-500">Get a personalized AI meal plan tailored to your body and goals.</p>
      </motion.div>

      <div className="max-w-2xl mx-auto">
        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-3xl border border-white/8 bg-white/2 p-6 space-y-5 mb-6">

          {/* Basic info */}
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">Your Body Info</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: "age",    placeholder: "Age",        icon: "🎂" },
                { key: "height", placeholder: "Height (cm)", icon: "📏" },
                { key: "weight", placeholder: "Weight (kg)", icon: "⚖️" },
              ].map((f) => (
                <div key={f.key} className="flex items-center gap-2 px-3 py-3 rounded-2xl bg-white/4 border border-white/10 focus-within:border-green-400/50 transition-all">
                  <span className="text-base flex-shrink-0">{f.icon}</span>
                  <input
                    type="number" min="0"
                    placeholder={f.placeholder}
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) => set(f.key, e.target.value)}
                    className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-600 w-0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Goal */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2">
              Goal <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              {[
                { value: "loss",     label: "Weight Loss", icon: "📉" },
                { value: "gain",     label: "Muscle Gain", icon: "💪" },
                { value: "maintain", label: "Maintain",    icon: "⚖️" },
              ].map((g) => (
                <button key={g.value} onClick={() => set("goal", g.value)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                    form.goal === g.value
                      ? "bg-green-500/20 border-green-500/40 text-green-400"
                      : "bg-white/4 border-white/10 text-gray-500 hover:text-gray-300"
                  }`}>
                  {g.icon} {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Diet type */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2">
              Diet Type <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              {[
                { value: "veg",    label: "Vegetarian",     icon: "🥦" },
                { value: "nonveg", label: "Non-Vegetarian", icon: "🍗" },
              ].map((t) => (
                <button key={t.value} onClick={() => set("type", t.value)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                    form.type === t.value
                      ? "bg-green-500/20 border-green-500/40 text-green-400"
                      : "bg-white/4 border-white/10 text-gray-500 hover:text-gray-300"
                  }`}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Medical condition */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2">Medical Condition (optional)</label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/4 border border-white/10 focus-within:border-green-400/50 transition-all">
              <span className="text-base">🏥</span>
              <input type="text" placeholder="e.g. Diabetes, Hypertension..."
                value={form.condition} onChange={(e) => set("condition", e.target.value)}
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-600" />
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">⚠️ {error}</motion.div>
          )}

          {/* Submit */}
          <button onClick={generatePlan} disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm transition-all shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating your plan...
              </span>
            ) : "🧠 Generate Diet Plan"}
          </button>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {plan.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              {/* Calories banner */}
              {calories && (
                <div className="flex items-center gap-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl p-5 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-2xl">🔥</div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Daily Calorie Target</div>
                    <div className="text-2xl font-black text-orange-400">{calories}</div>
                  </div>
                </div>
              )}

              {/* Meal cards */}
              <div className="space-y-4">
                {plan.map((item, i) => {
                  const { name, content } = parseMealItem(item);
                  const colors = mealColors[name] || defaultColors;
                  const icon = mealIcons[name] || "🍽️";

                  return (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                      className={`${colors.bg} border ${colors.border} rounded-2xl p-5`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-2xl">{icon}</div>
                        <h3 className={`font-black text-sm ${colors.accent}`}>{name}</h3>
                      </div>
                      {/* Split content by + or , into items */}
                      <div className="space-y-1.5">
                        {content.split(/[+,]/).map((part, j) => (
                          part.trim() && (
                            <div key={j} className="flex items-center gap-2 text-sm text-gray-300">
                              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.dot}`} />
                              {part.trim()}
                            </div>
                          )
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Regenerate button */}
              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                onClick={generatePlan} disabled={loading}
                className="w-full mt-6 py-3 rounded-2xl border border-green-500/30 text-green-400 hover:bg-green-500/10 font-semibold text-sm transition-all disabled:opacity-50">
                🔄 Regenerate Plan
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}