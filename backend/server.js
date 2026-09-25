const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Gemini setup
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// Test route
app.get("/", (req, res) => {
    res.send("G-Chatbot backend is running.");
});

// Chat API
app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                error: "Message is required."
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: message
        });

        res.json({
            response: response.text
        });

    } catch (error) {
        console.error("Gemini API Error:", error);
    
        res.status(500).json({
            error: error.message
        });
    }
    
});

// Start server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(
        `G-Chatbot backend running on http://localhost:${PORT}`
    );
});