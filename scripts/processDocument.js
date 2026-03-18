import { QdrantClient } from "@qdrant/js-client-rest";
import { chunkText } from "../utils/chunkText.js";
import { generateEmbedding } from "../services/embeddingClient.js";
import { processWithLimit } from "../services/Concurrency.js";
import { retryWithBackoff } from "../services/retry.js";
import { v4 as uuidv4 } from "uuid";
import { jobs } from "../jobs/jobStore.js";

const client = new QdrantClient({
  url: "http://127.0.0.1:6333" ,
  checkCompatibility: false// Change from localhost to this
});

async function initializeCollection() {
  const collections = await client.getCollections();
  const exists = collections.collections.some(c => c.name === "documents");

  if (!exists) {
    await client.createCollection("documents", {
      vectors: {
        size: 3072,
        distance: "Cosine"
      }
    });
  }
}

export async function processDocument(text,jobid, fileName = "source.pdf") {
  await initializeCollection();

  const MAX_CHARS = 100000; 
  if (text.length > MAX_CHARS) {
    text = text.slice(0, MAX_CHARS);
  }

  const chunks = chunkText(text, 200, 50);

  async function embedChunk(chunk, index) {
    const embedding = await retryWithBackoff(
      () => generateEmbedding(chunk)
    );
    
    return {
      text: chunk,
      embedding: embedding
    };
  }

  const results = await processWithLimit(
    chunks,
    3, 
    (chunk, index) => embedChunk(chunk, index)
  );

  const points = results.map((item, index) => ({
    id: uuidv4(), 
    vector: item.embedding,
    payload: {
      text: item.text,
      document: fileName,
      chunk_index: index,
      uploaded_at: new Date().toISOString()
    }
  }));

  await client.upsert("documents", { 
    wait: true,
    points 
  });
  const job = jobs.find(j => j.id === jobid);
if (job) job.status = "COMPLETED";
  console.log("PROCESS COMPLETE");
  const pts = await client.scroll("documents", {
  limit: 5,
  with_payload: true,
  with_vector: true
});

console.log(pts);
}