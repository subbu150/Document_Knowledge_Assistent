import fs from "fs";
import { PDFParse } from "pdf-parse"; 
import { jobs } from "../jobs/jobStore.js";
import { processDocument } from "../scripts/processDocument.js";

async function extractText(filePath, mimeType) {
  if (mimeType === "application/pdf") {
    const buffer = fs.readFileSync(filePath);
    const data = await pdf(buffer);
    return data.text;

  } else {
    return fs.readFileSync(filePath, "utf-8");
  }
}

export async function processJobs() {
  for (let job of jobs) {
    if (job.status === "PENDING") {
      job.status = "PROCESSING";

      try {
        console.log("Processing:", job.id);

        const parser = new PDFParse({ url: job.filePath});

	    const result = await parser.getText();
        console.log(typeof(result.text))
        await processDocument(result.text, job.id, job.filePath);

        job.status = "COMPLETED";

      } catch (err) {
        console.error("Job Failed:", err);
        job.status = "FAILED";
        job.error = err.message;
      }
    }
  }
}