export async function processWithLimit(items, limit, asyncFn) {
  const results = [];
  for (let i = 0; i < items.length; i += limit) {
    const batch = items.slice(i, i + limit);
    console.log("Processing batch:", i / limit + 1);
    const promises = batch.map((item, index) =>
      asyncFn(item, i + index) // pass correct global index
    );
    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
  }

  return results;
}