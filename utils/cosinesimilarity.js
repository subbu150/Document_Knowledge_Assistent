export  function cosineSimilarity(vecA, vecB) {

  let dotProduct = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < vecA.length; i++) {

    dotProduct += vecA[i] * vecB[i];

    magA += vecA[i] * vecA[i];

    magB += vecB[i] * vecB[i];
  }

  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);

  return dotProduct / (magA * magB);
}