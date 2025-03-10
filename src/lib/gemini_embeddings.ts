import { Embeddings, EmbeddingsParams } from "@langchain/core/embeddings";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const geminiApiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "embedding-001" });

// Custom class for Gemini embeddings
export class GeminiEmbeddings extends Embeddings {
  constructor(params?: EmbeddingsParams) {
    super(params || {}); // Pass the params to the parent class
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    const embeddings = await Promise.all(
      texts.map((text) => this.embedQuery(text)),
    );
    return embeddings;
  }

  async embedQuery(text: string): Promise<number[]> {
    const result = await model.embedContent(text);
    return result.embedding.values;
  }
}