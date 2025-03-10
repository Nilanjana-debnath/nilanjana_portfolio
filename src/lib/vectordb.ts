import { DataAPIClient } from "@datastax/astra-db-ts";
import { AstraDBVectorStore } from "@langchain/community/vectorstores/astradb";
import { GeminiEmbeddings } from "./gemini_embeddings"; // Adjust the path as needed

// Astra DB configuration
const endpoint = process.env.ASTRA_DB_API_ENDPOINT || "";
const token = process.env.ASTRA_DB_APPLICATION_TOKEN || "";
const collection = process.env.ASTRA_DB_COLLECTION || "";

if (!endpoint || !token || !collection) {
  throw new Error("Please set environmental variables for Astra DB!");
}

export async function getVectorStore() {
  const embeddings = new GeminiEmbeddings();

  return AstraDBVectorStore.fromExistingIndex(embeddings, {
    token,
    endpoint,
    collection,
    collectionOptions: {
      vector: { dimension: 768, metric: "cosine" }, // Adjust dimension if needed
    },
  });
}

export async function getEmbeddingsCollection() {
  const client = new DataAPIClient(token);
  const db = client.db(endpoint);

  return db.collection(collection);
}