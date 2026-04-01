import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Scan {
  _id: string;
  food: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  image: string;
  createdAt?: string;
}

const History = () => {
  const [scans, setScans] = useState<Scan[]>([]);
  const navigate = useNavigate();

  // 🔥 FETCH HISTORY
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:5000/history");
        setScans(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHistory();
  }, []);

  // 🔥 DELETE FUNCTION (FIXED POSITION)
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Delete this entry?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/delete/${id}`);

      // remove from UI instantly
      setScans((prev) => prev.filter((item) => item._id !== id));

    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white p-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <h1 className="text-4xl font-semibold mb-2">
          📜 Scan History
        </h1>

        <p className="text-gray-400 mb-8">
          Track your meals and nutrition insights over time
        </p>

        {/* EMPTY STATE */}
        {scans.length === 0 && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-10 rounded-2xl text-center">
            <p className="mb-4 text-gray-400 text-lg">
              No scans yet
            </p>

            <button
              onClick={() => navigate("/")}
              className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl transition"
            >
              Start Scanning
            </button>
          </div>
        )}

        {/* 🔥 HISTORY GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {scans.map((scan) => (
            <motion.div
              key={scan._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl"
            >

              {/* IMAGE */}
              <div className="relative">
                <img
                  src={scan.image}
                  alt="food"
                  className="w-full h-44 object-cover"
                />

                {scan.createdAt && (
                  <span className="absolute top-2 right-2 text-xs bg-black/60 px-2 py-1 rounded">
                    {new Date(scan.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-4">

                {/* FOOD NAME */}
                <h2 className="text-lg font-semibold mb-3">
                  {scan.food}
                </h2>

                {/* NUTRITION */}
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">

                  <div className="bg-white/5 p-2 rounded-lg">
                    🔥 {scan.calories} kcal
                  </div>

                  <div className="bg-white/5 p-2 rounded-lg">
                    💪 {scan.protein} g
                  </div>

                  <div className="bg-white/5 p-2 rounded-lg">
                    🍞 {scan.carbs} g
                  </div>

                  <div className="bg-white/5 p-2 rounded-lg">
                    🥑 {scan.fat} g
                  </div>

                </div>

                {/* 🔥 DELETE BUTTON */}
                <button
                  onClick={() => handleDelete(scan._id)}
                  className="w-full bg-red-500/20 text-red-400 py-2 rounded-xl hover:bg-red-500/30 transition"
                >
                  🗑 Delete
                </button>

              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default History;