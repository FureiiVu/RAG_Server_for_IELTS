import { vectors, dataType } from "weaviate-client";

import weaviateClient from "../config/connectDB.js";

const createFinalChunksCollection = async () => {
  try {
    await weaviateClient.collections.create({
      name: "FinalChunksCollection",
      description: "A final collection for storing chunks.",
      vectorizers: vectors.text2VecWeaviate(),
      properties: [{ name: "text", dataType: dataType.TEXT }],
    });
    console.log("[INFO] FinalChunksCollection created successfully");
  } catch (error) {
    console.error("[ERROR] Error creating FinalChunksCollection:", error);
    throw error;
  }
};

export default createFinalChunksCollection;
