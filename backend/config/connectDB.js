import dotenv from "dotenv";
import weaviate, { ApiKey } from "weaviate-client";

dotenv.config();

const weaviateEndpoint = process.env.WEAVIATE_ENDPOINT;
const weaviateApiKey = process.env.WEAVIATE_ADMIN_API_KEY;
const studioApiKey = process.env.GOOGLE_API_KEY;

const weaviateClient = await weaviate.connectToWeaviateCloud(weaviateEndpoint, {
  authCredentials: new ApiKey(weaviateApiKey),
  headers: {
    "X-Goog-Studio-Api-Key": studioApiKey,
  },
});

export default weaviateClient;
