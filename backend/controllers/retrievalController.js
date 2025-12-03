import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

import weaviateClient from "../config/connectDB.js";
import { requestPrompt } from "../promts/requestPromt.js";

dotenv.config();

export const handleRetrievalAndSendRequest = async (req, res) => {
  try {
    const { topic, essay } = req.body;

    // 1. Retrieval 5 nearest chunks từ Weaviate
    const finalChunks = weaviateClient.collections.get("FinalChunksCollection");
    const retrieved = await finalChunks.query.nearText("What is RAG?", {
      limit: 5,
    });

    const contexts = retrieved.objects
      .map((obj) => obj.properties.content)
      .join("\n\n");

    // 2. Gửi prompt sang Gemini
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
    const promt = requestPrompt(contexts, topic, essay);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promt,
    });

    res.json({
      message: "Retrieval and request handling completed successfully",
      answer: response.text,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const handleGetClusterContents = async (req, res) => {
  try {
    const { clusterId } = req.body;

    // Validate input
    if (!clusterId) {
      return res.status(400).json({ error: "clusterId is required" });
    }

    const finalChunks = weaviateClient.collections.get("FinalChunksCollection");
    const retrieved = await finalChunks.query.fetchObjectById(clusterId);

    res.json({
      message: "Get cluster contents successfully",
      clusterContent: retrieved.properties.content,
    });
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};
