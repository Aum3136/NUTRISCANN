import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

import connectDB from "./db.js";
import Scan from "./models/Scan.js";

dotenv.config();
connectDB();

const app = express();

// ✅ middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// 🔥 ANALYZE ROUTE
app.post("/analyze", async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "No image provided" });
    }

    const base64Data = imageBase64.split(",")[1];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Data,
          },
        },
        {
          text: `Analyze the food and return ONLY JSON:
          {
            "food": "",
            "calories": "",
            "protein": "",
            "carbs": "",
            "fat": ""
          }`,
        },
      ],
    });

    // ✅ SAFE TEXT EXTRACTION (FIXED)
    const text =response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    console.log("AI RAW:", text);

    let data;

    try {
      const cleaned = text.replace(/```json|```/g, "").trim();
      data = JSON.parse(cleaned);
    } catch (err) {
      console.log("Parsing failed:", text);

      return res.json({
        food: "Could not analyze",
        calories: "-",
        protein: "-",
        carbs: "-",
        fat: "-",
      });
    }

    // 🔥 SAVE TO DATABASE
    await Scan.create({
      food: data.food,
      calories: data.calories,
      protein: data.protein,
      carbs: data.carbs,
      fat: data.fat,
      image: imageBase64,
    });

    console.log("Saved to DB ✅");

    // ✅ SEND RESPONSE
    res.json(data);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "AI failed",
    });
  }
});

// 🔥 HISTORY ROUTE
app.get("/history", async (req, res) => {
  try {
    const scans = await Scan.find().sort({ createdAt: -1 });
    res.json(scans);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// 🚀 START SERVER
app.listen(5000, () =>
  console.log("Server running on http://localhost:5000 🚀")
);