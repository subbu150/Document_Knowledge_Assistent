import fs from "fs";
import { cosineSimilarity } from "../utils/cosinesimilarity.js";

export function retrieveChunks(queryEmbedding, topK = 3) {

  const data = JSON.parse(fs.readFileSync("vectors.json"));

  const scored = data.map(chunk => {

    const score = cosineSimilarity(queryEmbedding, chunk.embedding);

    return {
      text: chunk.text,
      score
    };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK);
}