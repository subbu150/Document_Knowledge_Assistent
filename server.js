import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
 import { PDFParse } from 'pdf-parse';
import { processDocument } from './scripts/processDocument.js';
import { runQuery } from './scripts/query.js';
// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { marked } from 'marked';
const app = express();
import { jobs } from "./jobs/jobStore.js";
import { v4 as uuidv4 } from "uuid";
const jobId = uuidv4();

// Middleware & View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Setup Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Temporary global variable to store text (In production, use a database or session)
let sessionExtractedText = "";

// --- Routes ---

app.get("/", (req, res) => {
  res.render("upload"); 
});

app.post("/upload", upload.single("document"), async (req, res) => {
  const file = req.file;
  const jobid=uuidv4();
   jobs.push({
    id:jobid,
    filePath: req.file.path,
    status: "PENDING",
    result: null,
    error: null
  });

  console.log("In upload Routes Job Assaigned to Job Route")
  console.log(jobs);
  console.log("Done")
  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    if (file.mimetype === 'application/pdf') {
        const parser = new PDFParse({ url: file.path });
        const result = await parser.getText();
        sessionExtractedText = result.text;
    } else if (file.mimetype === 'text/plain') {
      sessionExtractedText = fs.readFileSync(file.path, "utf-8");
    } else {
      return res.status(400).send("Only PDF and Text files are supported");
    }

    console.log("✅ Extraction Successful");
   
    // Optionally delete file after reading to save space
    fs.unlinkSync(file.path); 
    await processDocument(jobid,sessionExtractedText)
    res.render('query', { textPreview: sessionExtractedText.substring(0, 200) });

  } catch (error) {
    console.error("Processing Error:", error);
    res.status(500).send("Error processing file");
  }
});

app.get("/ask", (req, res) => {
    // We render the view, not redirect to a script
    res.render("query", { textPreview: "Ready to answer questions..." });
});

app.post("/ask", async (req, res) => {
    const userQuery = req.body.query; // Ensure 'name="query"' is in your EJS input
    
    if (!userQuery) {
        return res.status(400).send("No query provided");
    }

    const response = await runQuery(userQuery);
    const formattedAnswer = marked(response);

    // Better to render a result page or send a clean response
    res.send(`
        <div style="font-family:sans-serif; padding:20px;">
            <h3>Q: ${userQuery}</h3>
            <p><strong>A:</strong> ${formattedAnswer}</p>
            <a href="/ask" style="color:blue;">← Ask another question</a>
        </div>
    `);
});

app.get("/:id", (req, res) => {
  const job = jobs.find(j => j.id === req.params.id);

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  res.json({
    status: job.status,
    result: job.result,
    error: job.error
  });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));