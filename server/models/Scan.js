import mongoose from "mongoose";

const scanSchema = new mongoose.Schema({
  food: {
    type: String,
    required: true,
  },
  calories: {
    type: String,
    default: "0",
  },
  protein: {
    type: String,
    default: "0",
  },
  carbs: {
    type: String,
    default: "0",
  },
  fat: {
    type: String,
    default: "0",
  },
  image: {
    type: String,
    default: "",
  },

  // 🔥 NEW FIELD (IMPORTANT)
  meal: {
    type: String,
    default: "Other", // Breakfast, Lunch, Dinner, Snacks
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Scan", scanSchema);