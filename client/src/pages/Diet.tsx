import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Diet = () => {
  const [form, setForm] = useState({
    age: "",
    height: "",
    weight: "",
    goal: "",
    type: "",
    condition: "",
  });

  const [plan, setPlan] = useState<string[]>([]);
  const [calories, setCalories] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generatePlan = async () => {
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/diet", form);

      setPlan(res.data.plan);
      setCalories(res.data.calories);
    } catch (error) {
      console.error(error);
      alert("Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white p-6">

      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <h1 className="text-4xl font-heading mb-2">
          🧠 Smart Diet Planner
        </h1>
        <p className="text-gray-400 mb-8">
          Get personalized AI-based meal plans tailored to your body & goals
        </p>

        {/* FORM CARD */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-2xl space-y-5">

          {/* BASIC INFO */}
          <div className="grid grid-cols-3 gap-4">
            <input name="age" placeholder="Age" onChange={handleChange} className="input" />
            <input name="height" placeholder="Height (cm)" onChange={handleChange} className="input" />
            <input name="weight" placeholder="Weight (kg)" onChange={handleChange} className="input" />
          </div>

          {/* GOAL */}
          <select name="goal" onChange={handleChange} className="input">
            <option value="">Select Goal</option>
            <option value="loss">Weight Loss</option>
            <option value="gain">Muscle Gain</option>
            <option value="maintain">Maintain</option>
          </select>

          {/* DIET TYPE */}
          <select name="type" onChange={handleChange} className="input">
            <option value="">Diet Type</option>
            <option value="veg">Vegetarian</option>
            <option value="nonveg">Non-Vegetarian</option>
          </select>

          {/* CONDITION */}
          <input
            name="condition"
            placeholder="Medical condition (optional)"
            onChange={handleChange}
            className="input"
          />

          {/* BUTTON */}
          <button
            onClick={generatePlan}
            className="w-full bg-green-500 py-3 rounded-xl font-medium hover:bg-green-600 transition"
          >
            {loading ? "Generating..." : "Generate Diet Plan"}
          </button>
        </div>

        {/* RESULT */}
        {plan.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 bg-white/10 p-6 rounded-2xl border border-white/10"
          >

            <h2 className="text-xl font-semibold mb-4">
              🔥 Daily Calories: {calories}
            </h2>

            <div className="space-y-3">
              {plan.map((item, i) => (
                <div key={i} className="bg-white/5 p-3 rounded-lg">
                  {item}
                </div>
              ))}
            </div>

          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Diet;