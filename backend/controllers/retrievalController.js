import { generativeParameters } from "weaviate-client";
import weaviateClient from "../config/connectDB.js";

export const handleTestRetrieval = async (req, res) => {
  try {
    const finalChunks = weaviateClient.collections.get("FinalChunksCollection");
    const response = await finalChunks.generate.nearText(
      "RAG",
      {
        groupedTask: "What is RAG?",
        config: generativeParameters.google({
          modelId: "gemini-1.5-flash",
          temperature: 0.2,
        }),
      },
      {
        limit: 1,
      }
    );
    res
      .status(200)
      .json({ message: "Test retrieval endpoint is working!", data: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
