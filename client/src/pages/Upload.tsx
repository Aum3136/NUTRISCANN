import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const BACKEND = "http://localhost:5000";

interface NutritionResult {
  food: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

export default function Upload() {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<NutritionResult | null>(null);
  const [error, setError] = useState<string>("");
  const [dragging, setDragging] = useState<boolean>(false);
  const [cameraOn, setCameraOn] = useState<boolean>(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  const loadFileAsBase64 = (file: File): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => resolve(reader.result as string);
    });

  const handleFile = async (file: File) => {
    const base64 = await loadFileAsBase64(file);
    setPreview(base64);
    setResult(null);
    setError("");
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) await handleFile(file);
  };

  const startCamera = async () => {
    setCameraOn(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) videoRef.current.srcObject = stream;
  };

  const stopCamera = () => {
    setCameraOn(false);
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach((t) => t.stop());
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    setPreview(canvas.toDataURL("image/jpeg"));
    setResult(null);
    stopCamera();
  };

  const handleScan = async () => {
    if (!preview) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${BACKEND}/analyze`, { imageBase64: preview });
      setResult(res.data);
    } catch {
      setError("Failed to analyze. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPreview(null);
    setResult(null);
    setError("");
    setCameraOn(false);
  };

  const macroCards = [
    { label: "Calories", key: "calories", unit: "kcal", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { label: "Protein",  key: "protein",  unit: "g",    color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20"   },
    { label: "Carbs",    key: "carbs",    unit: "g",    color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
    { label: "Fat",      key: "fat",      unit: "g",    color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] py-8">
      {/* HERO — hidden after result */}
      {!result && (
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
          <div className="flex-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold mb-6">
              ✨ AI-Powered Analysis
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-5xl lg:text-6xl font-black leading-tight mb-6" style={{ fontFamily: "'Georgia', serif" }}>
              Scan, Analyze &<br /><span className="text-green-400">Track Your Meals</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
              Turn your food photos into powerful nutrition insights. Stay healthy, track calories, and improve your lifestyle with AI.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex gap-3 mb-10">
              <button onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold text-sm shadow-lg shadow-green-500/25 transition-all">
                📸 Scan Food Now
              </button>
              <Link to="/history">
                <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 text-gray-300 hover:text-white hover:border-white/30 font-semibold text-sm transition-all">
                  View History
                </button>
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex gap-8">
              {[{ label: "Calories tracked", value: "2M+" }, { label: "Meals scanned", value: "800K+" }, { label: "Accuracy", value: "98%" }].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-black text-white">{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="flex-1 flex justify-center">
            <div className="relative w-80 h-80 lg:w-96 lg:h-96">
              <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80"
                alt="Healthy meal" className="w-full h-full object-cover rounded-3xl border border-white/8" />
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 bg-gray-950 border border-white/10 rounded-2xl px-4 py-2.5 shadow-xl">
                <div className="text-[10px] text-gray-500 uppercase tracking-wide">Calories</div>
                <div className="text-lg font-black text-green-400">342 kcal</div>
              </motion.div>
              <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-gray-950 border border-white/10 rounded-2xl px-4 py-2.5 shadow-xl">
                <div className="text-[10px] text-gray-500 uppercase tracking-wide">Protein</div>
                <div className="text-lg font-black text-blue-400">24g</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}

      {/* SCAN SECTION */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="max-w-2xl mx-auto">
        <input ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={async (e) => { const f = e.target.files?.[0]; if (f) await handleFile(f); }} />
        <canvas ref={canvasRef} className="hidden" />

        {/* Camera */}
        {cameraOn && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 rounded-3xl overflow-hidden border border-white/10">
            <video ref={videoRef} autoPlay className="w-full" />
            <div className="p-4 flex gap-3 bg-white/3">
              <button onClick={captureImage} className="flex-1 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm transition-all">📸 Capture</button>
              <button onClick={stopCamera} className="px-4 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm transition-all">Cancel</button>
            </div>
          </motion.div>
        )}

        {/* Drop zone */}
        {!preview && !cameraOn && (
          <div onDrop={handleDrop} onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 ${
              dragging ? "border-green-400 bg-green-500/8 scale-[1.01]" : "border-white/10 hover:border-green-500/40 hover:bg-white/2"
            }`}>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-3xl">📸</div>
              <div>
                <p className="text-white font-bold text-lg mb-1">Drop your food photo here</p>
                <p className="text-gray-500 text-sm">or <span className="text-green-400 font-semibold">browse files</span> · PNG, JPG, WEBP</p>
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={(e) => { e.stopPropagation(); startCamera(); }}
                  className="px-5 py-2 rounded-xl bg-blue-500/15 border border-blue-500/25 text-blue-400 text-sm font-semibold hover:bg-blue-500/25 transition-all">
                  🎥 Use Camera
                </button>
                <Link to="/manual" onClick={(e) => e.stopPropagation()}>
                  <button className="px-5 py-2 rounded-xl border border-white/10 text-sm text-gray-400 hover:text-white hover:border-white/20 transition-all">
                    ✍️ Enter manually
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Preview */}
        {preview && !cameraOn && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-white/10 bg-white/3 overflow-hidden">
            <div className="relative">
              <img src={preview} alt="Preview" className="w-full max-h-72 object-cover" />
              <button onClick={handleReset}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white text-sm hover:bg-black/80 transition-all flex items-center justify-center">✕</button>
              {loading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-green-400 font-semibold">Analyzing nutrition...</p>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 flex gap-3">
              <button onClick={handleScan} disabled={loading}
                className="flex-1 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm transition-all shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Scanning..." : "🔍 Scan Food Now"}
              </button>
              <button onClick={() => fileRef.current?.click()}
                className="px-4 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-all text-sm">Change</button>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">⚠️ {error}</motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-6 rounded-3xl border border-white/10 bg-white/3 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-black text-white">{result.food}</h3>
                  <p className="text-gray-500 text-sm">Nutritional breakdown</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-green-500/15 border border-green-500/25 text-green-400 text-xs font-bold">✓ Analyzed</div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {macroCards.map((n) => (
                  <div key={n.label} className={`${n.bg} border ${n.border} rounded-2xl p-4 text-center`}>
                    <div className={`text-2xl font-black ${n.color}`}>
                      {result[n.key as keyof NutritionResult] ?? "—"}
                      <span className="text-xs font-normal ml-0.5">{n.unit}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{n.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => navigate("/history")}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm font-semibold transition-all">📜 View History</button>
                <button onClick={handleReset}
                  className="flex-1 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-all">+ Scan Another</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}