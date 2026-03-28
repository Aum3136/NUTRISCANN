import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/analyze", async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    const base64Data = imageBase64.split(",")[1];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // ✅ WORKING MODEL
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

   let text = response.text;

// Clean markdown (```json ... ```)
text = text.replace(/```json/g, "").replace(/```/g, "").trim();

const parsed = JSON.parse(text);

res.json(parsed);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error analyzing image");
  }
});


const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🔥 DIET PLAN ROUTE
app.post("/diet", async (req, res) => {
  try {
    const { age, height, weight, goal, type, condition } = req.body;

    const prompt = `
    Create a personalized daily diet plan.

    User details:
    Age: ${age}
    Height: ${height} cm
    Weight: ${weight} kg
    Goal: ${goal}
    Diet Type: ${type}
    Medical Condition: ${condition || "None"}

    Requirements:
    - Include breakfast, lunch, snack, dinner
    - Mention calories approx
    - Keep it simple and practical
    - Avoid harmful food for medical condition
    - Format in JSON:
    {
      "calories": "",
      "plan": ["", "", "", ""]
    }
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // 🔥 Convert string → JSON
    const cleaned = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleaned);

    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI generation failed" });
  }
});
app.listen(5000, () => console.log("Server running on 5000 🚀"));