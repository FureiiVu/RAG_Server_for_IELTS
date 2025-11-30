import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

import weaviateClient from "../config/connectDB.js";

dotenv.config();

export const handleTestRetrieval = async (req, res) => {
  try {
    const { question } = req.body;

    // 1. Retrieval
    const finalChunks = weaviateClient.collections.get("FinalChunksCollection");
    const retrieved = await finalChunks.query.nearText("What is RAG?", {
      limit: 5,
    });

    console.log("Retrieved objects:", retrieved.objects);

    const contexts = retrieved.objects
      .map((obj) => obj.properties.content)
      .join("\n\n");

    // 2. Gửi prompt sang Gemini
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
    You are an AI assistant.
    Use the context below to answer the question.

    --- CONTEXT ---
    ${contexts}

    --- QUESTION ---
    ${question}

    Answer:`,
    });

    res.json({
      answer: response.text,
      retrieved_chunks: contexts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
