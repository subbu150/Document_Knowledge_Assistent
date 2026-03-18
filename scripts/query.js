import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import { QdrantClient } from "@qdrant/js-client-rest";
import { generateEmbedding } from "../services/embeddingClient.js";
import { cosineSimilarity } from "../utils/cosinesimilarity.js";

dotenv.config();
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});
const qclient = new QdrantClient({
  url: "http://127.0.0.1:6333" ,
   checkCompatibility: false // Change from localhost to this
});
export async function runQuery(question) {

  console.log("\nGenerating query embedding...");

  const queryEmbedding = await generateEmbedding(question);
  console.log("Searching Qdrant for similar vectors...");
  const searchResponse = await qclient.search("documents", {
        vector: queryEmbedding,
        limit: 5, 
        with_payload: true, 
        with_vector: false, 
      });
  const scored = searchResponse.map(point => ({
        text: point.payload.text, 
        score: point.score,
        document: point.payload.document
      }));


  scored.sort((a, b) => b.score - a.score);

  const topChunks = scored.slice(0, 3);



  // topChunks.forEach((c, i) => {
  //   console.log(`Chunk ${i + 1}:`, c.text);
  // });

  const context = topChunks.map(c => c.text).join("\n");

  const prompt = `
Use the context below to answer the question.

Context:
${context}

Question:
${question}

Answer in a clear way.
`;

  console.log("\nCalling Groq LLM...\n");

  const response = await client.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  });

  console.log("🧠 Answer:\n");

  return response.choices[0].message.content;
}

