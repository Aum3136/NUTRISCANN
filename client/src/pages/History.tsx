import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND = "http://localhost:5000";

interface Scan {
  _id: string;
  food: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  image: string;
  createdAt: string;
}

export default function History() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [selected, setSelected] = useState<Scan | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${BACKEND}/history`)
      .then((r) => setScans(r.data))
      .catch(() => setError("Failed to load history."))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    try {
      await axios.delete(`${BACKEND}/delete/${id}`);
      setScans((prev) => prev.filter((s) => s._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch {
      alert("Delete failed");
    }
  };

  const filtered = scans.filter((s) =>
    s.food?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="py-8 min-h-[calc(100vh-80px)]">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold mb-3">
          📜 Scan History
        </div>
        <h1 className="text-4xl font-black text-white mb-2" style={{ fontFamily: "'Georgia', serif" }}>
          Your Meal <span className="text-green-400">Timeline</span>
        </h1>
        <p className="text-gray-500">Every meal you've scanned, all in one place.</p>
      </motion.div>

      {/* Stats */}
      {!loading && scans.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Meals", value: scans.length, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
            { label: "Total Calories", value: `${scans.reduce((a, b) => a + (parseInt(b.calories) || 0), 0).toLocaleString()} kcal`, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
            { label: "Avg Protein", value: scans.length ? `${Math.round(scans.reduce((a, b) => a + (parseFloat(b.protein) || 0), 0) / scans.length)}g` : "0g", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 text-center`}>
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Search */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mb-6">
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/4 border border-white/10 max-w-sm">
          <span className="text-gray-500 text-sm">🔍</span>
          <input type="text" placeholder="Search meals..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder-gray-600" />
          {search && <button onClick={() => setSearch("")} className="text-gray-500 hover:text-white text-xs">✕</button>}
        </div>
      </motion.div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Loading your history...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-24">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-400">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
          <div className="text-5xl mb-4">🍽️</div>
          <p className="text-gray-400 font-semibold text-lg mb-2">{search ? "No meals match your search" : "No meals yet"}</p>
          <p className="text-gray-600 text-sm mb-6">Start scanning food to build your history</p>
          {!search && (
            <button onClick={() => navigate("/")}
              className="px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm transition-all">
              📸 Start Scanning
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((scan, i) => (
            <motion.div key={scan._id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02, translateY: -2 }}
              className="rounded-2xl border border-white/8 bg-white/3 hover:border-green-500/30 hover:bg-white/5 transition-all duration-200 overflow-hidden"
            >
              {scan.image && (
                <div className="h-40 overflow-hidden cursor-pointer" onClick={() => setSelected(scan)}>
                  <img src={scan.image} alt={scan.food} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3" onClick={() => setSelected(scan)}>
                  <div className="cursor-pointer">
                    <h3 className="text-white font-bold text-sm">{scan.food}</h3>
                    <p className="text-gray-600 text-xs mt-0.5">{formatDate(scan.createdAt)}</p>
                  </div>
                  <div className="px-2 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 flex-shrink-0">
                    <span className="text-orange-400 text-xs font-bold">{scan.calories} kcal</span>
                  </div>
                </div>
                <div className="flex gap-2 mb-3">
                  {[
                    { label: "P", value: scan.protein, unit: "g", color: "text-blue-400" },
                    { label: "C", value: scan.carbs, unit: "g", color: "text-yellow-400" },
                    { label: "F", value: scan.fat, unit: "g", color: "text-purple-400" },
                  ].map((n) => (
                    <div key={n.label} className="flex-1 text-center bg-white/4 rounded-lg py-1.5">
                      <div className={`text-sm font-black ${n.color}`}>{n.value}<span className="text-[10px]">{n.unit}</span></div>
                      <div className="text-[10px] text-gray-600">{n.label}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => handleDelete(scan._id)}
                  className="w-full py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-all">
                  🗑 Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-950 border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black text-white">{selected.food}</h3>
                <button onClick={() => setSelected(null)}
                  className="w-8 h-8 rounded-full bg-white/8 text-gray-400 hover:text-white flex items-center justify-center text-sm">✕</button>
              </div>
              {selected.image && (
                <img src={selected.image} alt={selected.food} className="w-full h-48 object-cover rounded-2xl mb-4" />
              )}
              <p className="text-gray-500 text-xs mb-4">📅 {formatDate(selected.createdAt)}</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Calories", value: selected.calories, unit: "kcal", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
                  { label: "Protein",  value: selected.protein,  unit: "g",    color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20"   },
                  { label: "Carbs",    value: selected.carbs,    unit: "g",    color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
                  { label: "Fat",      value: selected.fat,      unit: "g",    color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
                ].map((n) => (
                  <div key={n.label} className={`${n.bg} border ${n.border} rounded-2xl p-4 text-center`}>
                    <div className={`text-2xl font-black ${n.color}`}>{n.value}<span className="text-xs font-normal ml-0.5">{n.unit}</span></div>
                    <div className="text-xs text-gray-500 mt-1">{n.label}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => handleDelete(selected._id)}
                className="w-full py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-sm font-semibold transition-all">
                🗑 Delete Entry
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}