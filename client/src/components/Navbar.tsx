import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "History", path: "/history", icon: "📜" },
    { name: "Diet", path: "/diet", icon: "🥗" },
    { name: "Charts", path: "/charts", icon: "📊" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-green-100/80 shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-3">

        {/* 🔥 LOGO */}
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-bold text-green-500 cursor-pointer"
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium border ${
                    isActive
                      ? "bg-green-50 text-green-600 border-green-200/50 shadow-sm"
                      : "text-gray-600 border-transparent hover:text-[#1a2e1a] hover:bg-green-50/40"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.name}
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* 🔥 RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* User email */}
          {user && (
            <span className="text-xs text-gray-500 hidden sm:block">
              {user.email}
            </span>
          )}

          {/* Logout button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
          >
            🚪 Logout
          </motion.button>

          {/* Settings */}
          <motion.div
            whileHover={{ rotate: 20 }}
            className="text-gray-500 cursor-pointer hover:text-[#1a2e1a] transition"
          >
            ⚙️
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Navbar;