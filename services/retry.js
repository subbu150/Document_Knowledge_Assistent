export async function retryWithBackoff(fn, retries = 3, delay = 1000) {

  try {
    return await fn();
  } catch (error) {

    if (retries === 0) {
      throw error;
    }

    console.log("Request failed. Retrying in", delay, "ms");

    await new Promise(resolve => setTimeout(resolve, delay));

    return retryWithBackoff(fn, retries - 1, delay * 2);
  }
}