<div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white"></div>
import { useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import { useNavigate } from "react-router-dom";

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
  const [cameraOn, setCameraOn] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const navigate = useNavigate();

  // 📁 FILE UPLOAD
  const handleImageChange = (file: File | null) => {
  if (!file) return;

  setImage(file);
  setResult(null);

  // 🔥 Convert to BASE64 (IMPORTANT FIX)
  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onloadend = () => {
    setPreview(reader.result as string); // ✅ base64 string
  };
};

  // 🎥 START CAMERA
  const startCamera = async () => {
    setCameraOn(true);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  // 📸 CAPTURE IMAGE
  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0);

    const base64 = canvas.toDataURL("image/jpeg");

    setPreview(base64);
    setImage(null); // reset file
    setResult(null);
    setCameraOn(false);

    // stop camera
    const stream = video.srcObject as MediaStream;
    stream.getTracks().forEach((track) => track.stop());
  };

  // 🔥 ANALYZE (works for both upload + camera)
  const handleUpload = async () => {
    if (!preview) return alert("Please upload or capture an image");

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/analyze", {
        imageBase64: preview,
      });

      setResult(res.data);
    } catch (error) {
      console.error(error);
      alert("Error analyzing image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">

      {/* HERO */}
      <Hero />

      {/* ANALYZE SECTION */}
      <div
        id="analyze-section"
        className="flex justify-center mt-16 scroll-mt-32"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/10 text-center w-[700px] md:w-[500px]"
        >

          {/* TITLE */}
          <h1 className="text-3xl font-heading font-semibold mb-2">
            NutriScan <span className="text-green-400">🍔</span>
          </h1>

          <p className="text-gray-400 text-sm mb-6">
            Upload or capture your meal for instant AI nutrition insights
          </p>

          {/* 🔥 BUTTONS */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={startCamera}
              className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-xl"
            >
              📸 Camera
            </button>

            <label className="w-full bg-white/10 border border-white/20 py-2 rounded-xl cursor-pointer">
              📁 Upload
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) =>
                  handleImageChange(e.target.files?.[0] || null)
                }
              />
            </label>
          </div>
          <button
          
  onClick={() => navigate("/manual")}
  className="bg-blue-500 px-4 py-2 rounded-lg"
>
  Manual Entry
</button>

          {/* 🎥 CAMERA VIEW */}
          {cameraOn && (
            <div className="mb-4">
              <video
                ref={videoRef}
                autoPlay
                className="w-full rounded-lg"
              />

              <button
                onClick={captureImage}
                className="mt-3 bg-green-500 px-6 py-2 rounded-xl"
              >
                Capture
              </button>
            </div>
          )}

          {/* HIDDEN CANVAS */}
          <canvas ref={canvasRef} className="hidden" />

          {/* PREVIEW */}
          {preview && (
  <motion.img
    src={preview}
    alt="preview"
    className="w-full h-44 object-cover rounded-xl mb-4 
    border border-white/10 shadow-lg hover:scale-[1.02] transition"
  />
)}

          {/* ANALYZE BUTTON */}
          {preview && (
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
          )}
{/* RESULT */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-white/10 p-5 rounded-xl border border-white/10 text-left"
            >
              <h2 className="text-lg font-semibold mb-3 text-center">
                {result.food}
              </h2>

              <ul className="text-sm text-gray-300 space-y-1 mb-4">
                <li>• Balanced nutrients</li>
                <li>• Good mix of macros</li>
                <li>• Suitable for daily intake</li>
              </ul>

              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">

  <div className="bg-white/5 p-3 rounded-lg">
    <p className="text-gray-400 text-xs">🔥 Calories</p>
    <p className="text-lg font-semibold text-white">
      {result.calories} kcal
    </p>
    <p className="text-[10px] text-gray-500">
      Energy source for body
    </p>
  </div>

  <div className="bg-white/5 p-3 rounded-lg">
    <p className="text-gray-400 text-xs">💪 Protein</p>
    <p className="text-lg font-semibold text-white">
      {result.protein} g
    </p>
    <p className="text-[10px] text-gray-500">
      Builds muscles
    </p>
  </div>

  <div className="bg-white/5 p-3 rounded-lg">
    <p className="text-gray-400 text-xs">🍞 Carbs</p>
    <p className="text-lg font-semibold text-white">
      {result.carbs} g
    </p>
    <p className="text-[10px] text-gray-500">
      Provides energy
    </p>
  </div>

  <div className="bg-white/5 p-3 rounded-lg">
    <p className="text-gray-400 text-xs">🥑 Fats</p>
    <p className="text-lg font-semibold text-white">
      {result.fat} g
    </p>
    <p className="text-[10px] text-gray-500">
      Supports body functions
    </p>
  </div>

</div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </div>
  );
};


export default Upload;