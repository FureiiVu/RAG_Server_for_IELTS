import weaviateClient from "../config/connectDB.js";
import { vectors, dataType } from "weaviate-client";

export const insertChunksToWeaviate = async (collectionName, chunkData) => {
  try {
    // Lấy collection từ Weaviate dựa trên tên collection
    const collection = weaviateClient.collections.get(collectionName);

    // Chèn nhiều chunk vào collection
    console.log("[INFO] Inserting chunk to Weaviate");
    const response = await collection.data.insertMany(chunkData);
    console.log("[INFO] Chunk inserted successfully");

    // Trả về UUIDs của các chunk đã chèn
    return response.uuids;
  } catch (error) {
    console.error("[ERROR] Error inserting chunk to Weaviate:", error);
    throw error;
  }
};

export const fetchChunkVectorByUUID = async (collectionName, uuid) => {
  try {
    // Lấy collection từ Weaviate dựa trên tên collection
    const collection = weaviateClient.collections.use(collectionName);

    // Lấy vector của chunk dựa trên UUID
    console.log("[INFO] Fetching chunk vector by UUID from Weaviate:", uuid);
    const response = await collection.query.fetchObjectById(uuid, {
      includeVector: true,
    });
    console.log("[INFO] Chunk vector fetched successfully");

    // Trả về vector của chunk
    return response?.vectors.default;
  } catch (error) {
    console.error(
      "[ERROR] Error fetching chunk vector by UUID from Weaviate",
      error
    );
    throw error;
  }
};

export const fetchAllChunksFromCollection = async (collectionName) => {
  try {
    // Lấy collection từ Weaviate dựa trên tên collection
    const collection = weaviateClient.collections.use(collectionName);
    const allChunksText = [];
    const allChunksVectors = [];

    console.log(
      "[INFO] Fetching all chunks from Weaviate collection:",
      collectionName
    );

    for await (let item of collection.iterator({
      includeVector: true,
    })) {
      allChunksText.push(item.properties.content);
      allChunksVectors.push(item.vectors.default);
    }

    console.log("[INFO] All chunks fetched successfully");

    return {
      miniChunksContent: allChunksText,
      miniChunksVectors: allChunksVectors,
    };
  } catch (error) {
    console.error("[ERROR] Error fetching all chunks from Weaviate", error);
    throw error;
  }
};

export const deleteCollection = async (collectionName) => {
  try {
    // Lấy collection từ Weaviate dựa trên tên collection
    await weaviateClient.collections.delete(collectionName);
    console.log(`[INFO] Collection ${collectionName} deleted successfully`);
  } catch (error) {
    console.error("[ERROR] Error deleting collection in Weaviate:", error);
    throw error;
  }
};

export const checkCollectionExists = async (collectionName) => {
  try {
    const result = await weaviateClient.collections.exists(collectionName);
    return result;
  } catch (error) {
    console.error(
      "[ERROR] Error checking collection exists in Weaviate:",
      error
    );
    throw error;
  }
};
