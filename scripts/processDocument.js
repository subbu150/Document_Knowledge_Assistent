import { QdrantClient } from "@qdrant/js-client-rest";
import { chunkText } from "../utils/chunkText.js";
import { generateEmbedding } from "../services/embeddingClient.js";
import { processWithLimit } from "../services/Concurrency.js";
import { retryWithBackoff } from "../services/retry.js";
import { v4 as uuidv4 } from "uuid";

const client = new QdrantClient({
  url: "http://127.0.0.1:6333"
});
await client.deleteCollection("documents");
async function initializeCollection() {
  const collections = await client.getCollections();
  const exists = collections.collections.some(c => c.name === "documents");

  if (!exists) {
    await client.createCollection("documents", {
      vectors: { size: 3072, distance: "Cosine" }
    });
  }
}

export async function processDocument(text, jobId, fileName) {
  await initializeCollection();

  const chunks = chunkText(text, 200, 50);

  async function embedChunk(chunk) {
    const embedding = await retryWithBackoff(() =>
      generateEmbedding(chunk)
    );

    return {
      text: chunk,
      embedding
    };
  }

  const results = await processWithLimit(chunks, 3, embedChunk);

  const points = results.map((item, index) => ({
    id: uuidv4(),
    vector: item.embedding,
    payload: {
      text: item.text,
      document: fileName,
      chunk_index: index
    }
  }));
  console.log("This is results",results)
  await client.upsert("documents", {
    wait: true,
    points
  });

  console.log("✅ Document processed:", jobId);

}