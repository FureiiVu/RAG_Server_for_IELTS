import { vectors, dataType } from "weaviate-client";

import weaviateClient from "../config/connectDB.js";

const createTempCollection = async () => {
  try {
    await weaviateClient.collections.create({
      name: "TempCollection",
      description: "A temporary collection for storing mini-chunks.",
      vectorizers: vectors.text2VecWeaviate(),
      properties: [{ name: "text", dataType: dataType.TEXT }],
    });
    console.log("[INFO] TempCollection created successfully");
  } catch (error) {
    console.error("[ERROR] Error creating TempCollection:", error);
  }
};

export default createTempCollection;
