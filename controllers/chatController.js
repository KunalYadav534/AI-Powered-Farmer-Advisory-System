import { validationResult } from "express-validator";
import ChatHistory from "../models/ChatHistory.js";

export const askQuestion = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => e.msg),
    });
  }

  const { question } = req.body;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

    const prompt = "You are an expert AI agricultural advisor for Indian farmers. Your role is to provide helpful, accurate, and practical farming advice in simple language. You specialize in crop selection, fertilizer recommendations, pest control, irrigation, government schemes, and market prices. Always give specific actionable advice in simple language. If unrelated to farming, politely redirect. Farmer's Question: " + question;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", JSON.stringify(data));
      return res.status(500).json({
        success: false,
        message: "AI service failed. Please try again.",
      });
    }

    const answer = data.candidates[0].content.parts[0].text;

    try {
      await ChatHistory.create({
        userId: req.user._id,
        question,
        answer,
      });
    } catch (e) {}

    res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("Chat Error:", error.message);
    res.status(500).json({
      success: false,
      message: "AI service failed. Please try again.",
    });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const history = await ChatHistory.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    console.error("Chat History Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat history.",
    });
  }
};

export const clearChatHistory = async (req, res) => {
  try {
    await ChatHistory.deleteMany({ userId: req.user._id });

    res.status(200).json({
      success: true,
      message: "Chat history cleared successfully.",
    });
  } catch (error) {
    console.error("Clear History Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to clear chat history.",
    });
  }
};