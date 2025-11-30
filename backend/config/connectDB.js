import dotenv from "dotenv";
import weaviate, { ApiKey } from "weaviate-client";

dotenv.config();

const weaviateEndpoint = process.env.WEAVIATE_ENDPOINT;
const weaviateApiKey = process.env.WEAVIATE_ADMIN_API_KEY;

const weaviateClient = await weaviate.connectToWeaviateCloud(weaviateEndpoint, {
  authCredentials: new ApiKey(weaviateApiKey),
});

export default weaviateClient;
