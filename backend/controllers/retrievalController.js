import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { Filters } from "weaviate-client";

import weaviateClient from "../config/connectDB.js";
import { requestPrompt } from "../promts/requestPromt.js";
import { deleteCollection } from "../middleware/crudWeaviate.js";

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

    res.status(200).json({
      message: "Retrieval and request handling completed successfully",
      answer: response.text,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    res.status(200).json({
      message: "Get cluster contents successfully",
      clusterContent: retrieved.properties.content,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const handleDeleteClusters = async (req, res) => {
  try {
    const { clusterIds } = req.body;

    // Validate input
    if (!clusterIds || !Array.isArray(clusterIds) || clusterIds.length === 0) {
      return res
        .status(400)
        .json({ error: "clusterIds must be a non-empty array" });
    }

    // Delete clusters by UUID
    const collection = weaviateClient.collections.get("FinalChunksCollection");
    await collection.data.deleteMany(
      collection.filter.byId().containsAny(clusterIds)
    );

    res.status(200).json({ message: "Clusters deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getClustersInDuration = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    // Validate input
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "startDate and endDate are required" });
    }

    // Lọc và trả về danh sách cluster trong khoảng thời gian
    const collection = weaviateClient.collections.get("FinalChunksCollection");
    const clusters = await collection.query.fetchObjects({
      filters: Filters.and(
        collection.filter.byCreationTime().greaterOrEqual(startDate),
        collection.filter.byCreationTime().lessOrEqual(endDate)
      ),
    });

    // Trích xuất danh sách UUID của các cluster
    const resultList = clusters.objects.map((obj) => obj.uuid);

    res.status(200).json({
      message: "Clusters retrieved successfully",
      clustersUUIDs: resultList,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAllClusters = async (req, res) => {
  try {
    await deleteCollection("FinalChunksCollection");

    res.status(200).json({
      message: "All clusters have been deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
