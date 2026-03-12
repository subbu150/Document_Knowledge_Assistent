import fs from "fs";
import { chunkText } from "../utils/chunkText.js";
import { generateEmbedding } from "../services/embeddingClient.js";
import { processWithLimit } from "../services/Concurrency.js";
import { retryWithBackoff } from "../services/retry.js";

console.log("FS module verified");

export async function processDocument(text) {

  console.log("STEP 1: Reading document");

  /* -------- LIMIT DOCUMENT SIZE (≈100 pages) -------- */

  const MAX_CHARS = 100000; // approx 100 pages

  if (text.length > MAX_CHARS) {

    console.log("Document too large. Limiting to first 100 pages equivalent.");

    text = text.slice(0, MAX_CHARS);

  }

  /* ----------------------------------------------- */

  console.log("STEP 2: Chunking document");

  const chunks = chunkText(text, 200, 50);

  console.log("Total chunks created:", chunks.length);

  async function embedChunk(chunk, index) {

    console.log(`Embedding chunk ${index + 1}`);

    const embedding = await retryWithBackoff(
      () => generateEmbedding(chunk)
    );

    console.log("Embedding length:", embedding.length);

    return {
      text: chunk,
      embedding
    };
  }

  console.log("STEP 3: Generating embeddings with concurrency limit");

  const results = await processWithLimit(
    chunks,
    3,
    async (chunk, index) => embedChunk(chunk, index)
  );

  console.log("STEP 4: Saving embeddings");

  fs.writeFileSync(
    "vectors.json",
    JSON.stringify(results, null, 2)
  );

  console.log("PROCESS COMPLETE");
  console.log("Embeddings saved to vectors.json");
}