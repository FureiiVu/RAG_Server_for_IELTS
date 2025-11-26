import weaviateClient from "../config/connectDB.js";
import { vectors, dataType } from "weaviate-client";

export const insertChunksToWeaviate = async (collectionName, chunkData) => {
  try {
    // Lấy collection từ Weaviate dựa trên tên collection
    const collection = weaviateClient.collections.get(collectionName);

    // Chèn nhiều chunk vào collection
    console.log("[INFO] Inserting chunk to Weaviate:", chunkData);
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
      "[ERROR] Error fetching chunk vector by UUID from Weaviate:",
      error
    );
    throw error;
  }
};
