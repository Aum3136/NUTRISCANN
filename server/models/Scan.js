import mongoose from "mongoose";

const scanSchema = new mongoose.Schema({
  food: String,
  calories: String,
  protein: String,
  carbs: String,
  fat: String,
  image: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Scan", scanSchema);