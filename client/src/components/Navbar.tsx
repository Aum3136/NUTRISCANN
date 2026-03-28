import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "History", path: "/history", icon: "📜" },
    { name: "Diet", path: "/diet", icon: "🥗" },
    { name: "Charts", path: "/charts", icon: "📊" },
  ];

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-lg border-b border-white/10">

      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-3">

        {/* 🔥 LOGO */}
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-bold text-green-400 cursor-pointer"
        >
          NutriScann 🍃
        </motion.h1>

        {/* 🔥 NAV LINKS */}
        <div className="flex items-center gap-3">

          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                    isActive
                      ? "bg-white/10 text-green-400 shadow-md"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.name}
                </motion.div>
              </Link>
            );
          })}

        </div>

        {/* 🔥 RIGHT SIDE (SETTINGS / PROFILE PLACEHOLDER) */}
        <motion.div
          whileHover={{ rotate: 20 }}
          className="text-gray-400 cursor-pointer hover:text-white transition"
        >
          ⚙️
        </motion.div>

      </div>
    </div>
  );
};

export default Navbar;