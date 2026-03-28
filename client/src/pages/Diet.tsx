    import { useState } from "react";
    import { motion } from "framer-motion";
import axios from "axios";
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
    const [calories, setCalories] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 🔥 SIMPLE CALORIE CALCULATION (BMR approx)
    const calculateCalories = () => {
        const weight = Number(form.weight);
        const height = Number(form.height);
        const age = Number(form.age);

        let bmr = 10 * weight + 6.25 * height - 5 * age + 5;

        if (form.goal === "loss") bmr -= 400;
        if (form.goal === "gain") bmr += 400;

        return Math.round(bmr);
    };

    const generatePlan = async () => {
    setLoading(true);

    try {
        const res = await axios.post("http://localhost:5000/diet", form);

        setPlan(res.data.plan);
        setCalories(res.data.calories);

    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
    };
    return (
        <div className="min-h-screen text-white p-6">

        <h1 className="text-4xl font-heading text-center mb-6">
            🧠 Smart Diet Planner
        </h1>

        {/* FORM */}
        <div className="max-w-xl mx-auto bg-white/10 p-6 rounded-xl space-y-4">

            <input
            type="number"
            name="age"
            placeholder="Age"
            onChange={handleChange}
            className="w-full p-2 rounded bg-black/30"
            />

            <input
            type="number"
            name="height"
            placeholder="Height (cm)"
            onChange={handleChange}
            className="w-full p-2 rounded bg-black/30"
            />

            <input
            type="number"
            name="weight"
            placeholder="Weight (kg)"
            onChange={handleChange}
            className="w-full p-2 rounded bg-black/30"
            />

            {/* GOAL */}
            <select
            name="goal"
            onChange={handleChange}
            className="w-full p-2 rounded bg-black/30"
            >
            <option value="">Select Goal</option>
            <option value="loss">Weight Loss</option>
            <option value="gain">Muscle Gain</option>
            <option value="maintain">Maintain</option>
            </select>

            {/* DIET TYPE */}
            <select
            name="type"
            onChange={handleChange}
            className="w-full p-2 rounded bg-black/30"
            >
            <option value="">Diet Type</option>
            <option value="veg">Vegetarian</option>
            <option value="nonveg">Non-Vegetarian</option>
            </select>

            <input
            type="text"
            name="condition"
            placeholder="Medical condition (optional)"
            onChange={handleChange}
            className="w-full p-2 rounded bg-black/30"
            />

            <button
  onClick={generatePlan}
  disabled={loading}
  className={`w-full py-2 rounded-lg ${
    loading
      ? "bg-gray-500 cursor-not-allowed"
      : "bg-green-500 hover:bg-green-600"
  }`}
>
  {loading ? "Generating..." : "Generate Diet Plan"}
</button>
        </div>

        {/* RESULT */}
        {plan.length > 0 && (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 max-w-xl mx-auto bg-white/10 p-6 rounded-xl"
            >
            <h2 className="text-xl font-semibold mb-3">
                🔥 Daily Calories: {calories} kcal
            </h2>

            <ul className="space-y-2">
                {plan.map((item, i) => (
                <li key={i} className="bg-white/5 p-3 rounded">
                    {item}
                </li>
                ))}
            </ul>
            </motion.div>
        )}
        </div>
    );
    };

    export default Diet;