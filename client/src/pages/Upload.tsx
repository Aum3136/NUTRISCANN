import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Hero from "../components/Hero";

interface NutritionResult {
  food: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

const Upload = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<NutritionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (file: File | null) => {
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image");

    setLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(image);

    reader.onloadend = async () => {
      try {
        const res = await axios.post("http://localhost:5000/analyze", {
          imageBase64: reader.result,
        });

        setResult(res.data);
      } catch (error) {
        console.error(error);
        alert("Error analyzing image");
      } finally {
        setLoading(false);
      }
    };
  };

  return (
    <div className="w-full">

      {/* 🔥 HERO */}
      <Hero />

      {/* 🔥 ANALYZE SECTION (IMPORTANT FOR SCROLL) */}
      <div
        id="analyze-section"
        className="flex justify-center mt-16 scroll-mt-32"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/10 text-center w-[700px] md:w-[500px]hover:shadow-green-500/20 transition-all"
        >

          {/* TITLE */}
          <h1 className="text-3xl font-heading font-semibold mb-2">
            NutriScan <span className="text-green-400">🍔</span>
          </h1>

          <p className="text-gray-400 text-sm mb-4">
            Upload your meal and get instant AI-powered nutrition insights
          </p>

          {/* FILE INPUT */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageChange(e.target.files?.[0] || null)
            }
            className="mb-4 text-sm"
          />

          {/* IMAGE PREVIEW */}
          {preview && (
            <motion.img
              src={preview}
              alt="preview"
              className="w-full h-40 object-cover rounded-lg mb-4 border border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}

          {/* BUTTON */}
          <button
            onClick={handleUpload}
            disabled={loading}
            className={`w-full py-2 rounded-xl font-medium transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 hover:scale-105"
            }`}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>

          {/* RESULT */}
          {result && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="mt-6 bg-white/10 p-5 rounded-xl border border-white/10 text-left"
  >
    {/* FOOD TITLE */}
    <h2 className="text-lg font-semibold mb-3 text-center text-white">
      {result.food}
    </h2>

    {/* 🔥 BULLET POINTS (DESCRIPTION CLEANED) */}
    <ul className="text-sm text-gray-300 space-y-1 mb-4">
      <li>• Rich in vegetables & fresh greens</li>
      <li>• Includes whole grains & healthy fats</li>
      <li>• Balanced mix of carbs, protein & fiber</li>
    </ul>

    {/* 🔥 NUTRITION GRID */}
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div className="bg-white/5 p-2 rounded-lg">🔥 {result.calories} kcal</div>
      <div className="bg-white/5 p-2 rounded-lg">💪 {result.protein}</div>
      <div className="bg-white/5 p-2 rounded-lg">🍞 {result.carbs}</div>
      <div className="bg-white/5 p-2 rounded-lg">🥑 {result.fat}</div>
    </div>
  </motion.div>
)}
          
        </motion.div>
      </div>

    </div>
  );
};

export default Upload;