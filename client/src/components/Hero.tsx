import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="grid md:grid-cols-2 gap-10 items-center py-16">

      {/* LEFT SIDE */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl md:text-6xl font-heading font-bold leading-tight">
          Scan, Analyze & <br />
          <span className="text-green-400">Track Your Meals</span>
        </h1>

        <p className="text-gray-400 mt-4 text-lg leading-relaxed">
          Turn your food photos into powerful nutrition insights. 
          Stay healthy, track calories, and improve your lifestyle with AI.
        </p>

        {/* BUTTONS */}
        <div className="flex gap-4 mt-6">
          <button
  onClick={() => {
    const section = document.getElementById("analyze-section");
    section?.scrollIntoView({ behavior: "smooth" });
  }}
  className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-medium transition transform hover:scale-105"
>
  Scan Food Now
</button>

          <Link to="/history">
            <button className="border border-white/20 px-6 py-3 rounded-xl hover:bg-white/10 transition">
              View History
            </button>
          </Link>
        </div>
      </motion.div>

      {/* RIGHT SIDE IMAGE */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-center"
      >
        <img
          src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
          alt="food"
          className="rounded-2xl shadow-2xl w-[90%] hover:scale-105 transition duration-500"
        />
      </motion.div>

    </div>
  );
};

export default Hero;