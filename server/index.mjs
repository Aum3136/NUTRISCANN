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
// 🔥 ANALYZE ROUTE (FINAL FIXED)
app.post("/analyze", async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "No image provided" });
    }

    // ✅ SAFE BASE64 CLEANING
    let base64Data = imageBase64;

    if (imageBase64.startsWith("data:")) {
      const parts = imageBase64.split(",");
      base64Data = parts[1];
    }

    // ✅ FORCE MIME TYPE (avoid detection issues)
    const mimeType = "image/jpeg";

    // ✅ LIMIT SIZE (VERY IMPORTANT)
    if (base64Data.length > 2_000_000) {
      return res.status(400).json({
        error: "Image too large. Please use smaller image.",
      });
    }

    console.log("Image size:", base64Data.length);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType,
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

    // ✅ SAFE TEXT EXTRACTION
    const text =
      response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

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

    // ✅ SAVE TO DATABASE
    await Scan.create({
      food: data.food,
      calories: data.calories,
      protein: data.protein,
      carbs: data.carbs,
      fat: data.fat,
      image: imageBase64,
    });

    console.log("Saved to DB ✅");

    res.json(data);

  } catch (error) {
    console.error("ANALYZE ERROR:", error);

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

// 🔥 DELETE ROUTE
app.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Scan.findByIdAndDelete(id);

    res.json({ message: "Deleted successfully ✅" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Delete failed" });
  }
});

// 🚀 START SERVER
app.listen(5000, () =>
  console.log("Server running on http://localhost:5000 🚀")
);

app.post("/diet", async (req, res) => {
  try {
    const { age, height, weight, goal, type, condition } = req.body;

    const prompt = `
    Create a personalized diet plan.

    User:
    Age: ${age}
    Height: ${height} cm
    Weight: ${weight} kg
    Goal: ${goal}
    Diet Type: ${type}
    Medical Condition: ${condition || "None"}

    Requirements:
    - Include breakfast, lunch, snack, dinner
    - Mention calories
    - Keep it simple and realistic (Indian diet)
    
    Return ONLY JSON:
    {
      "calories": "2000 kcal",
      "plan": [
        "Breakfast: ...",
        "Lunch: ...",
        "Snack: ...",
        "Dinner: ..."
      ]
    }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // 🔥 safer than 2.5
      contents: [{ text: prompt }],
    });

    // ✅ FIXED TEXT EXTRACTION
    const text = response.candidates[0].content.parts[0].text;

    console.log("RAW DIET:", text);

    // ✅ CLEAN JSON
    const cleaned = text.replace(/```json|```/g, "").trim();

    let data;

    try {
      data = JSON.parse(cleaned);
    } catch (err) {
      console.log("JSON parse failed");

      // fallback (IMPORTANT)
      return res.json({
        calories: "2000 kcal",
        plan: [
          "Breakfast: Oats + Fruits",
          "Lunch: Rice + Dal + Salad",
          "Snack: Nuts",
          "Dinner: Roti + Vegetables",
        ],
      });
    }

    res.json(data);

  } catch (error) {
    console.error("DIET ERROR:", error);

    res.status(500).json({
      error: "Diet generation failed",
    });
  }
});


app.post("/manual", async (req, res) => {
  try {
    const { food, calories, protein, carbs, fat, meal } = req.body;

    if (!food) {
      return res.status(400).json({ error: "Food name required" });
    }

    const newEntry = await Scan.create({
      food,
      calories,
      protein,
      carbs,
      fat,
      meal: meal || "Other",
      image: "", // no image
    });

    res.json(newEntry);

  } catch (error) {
    console.error("MANUAL ERROR:", error);
    res.status(500).json({ error: "Failed to add food" });
  }
});

