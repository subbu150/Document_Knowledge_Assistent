import express from "express";
import path from "path";
import { fileURLToPath } from 'url'; // Required for __dirname
import uploadRoute from "./routes/upload.js";
import jobRoute from "./routes/job.js";
import { processJobs } from "./workers/jobWorker.js";
import { runQuery } from "./scripts/query.js";
import {jobs} from "./jobs/jobStore.js"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { marked } from "marked";
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true })); 

app.use(express.json());

app.use("/upload", uploadRoute);
app.use("/job", jobRoute);
app.get("/", (req, res) => {
  res.redirect("/upload");
});
// 🔥 Worker loop
setInterval(() => {
  processJobs();
}, 5000);

app.get("/query", (req, res) => {
  const { jobId } = req.query;

  res.render("query", { jobId });
});

app.post("/ask", async (req, res) => {
  const { query, jobId } = req.body;

  const job = jobs.find(j => j.id === jobId);

  if (!job) {
    return res.send("Invalid job");
  }

  const answer = await runQuery(query, job.filePath);
  const formattedAnswer = marked(answer);
res.send(`
  <div style="font-family:sans-serif; padding:20px;">
    <h3>Q: ${query}</h3>
    <div>${formattedAnswer}</div>
    <a href="/query?jobId=${jobId}">Ask again</a>
  </div>
`);
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});