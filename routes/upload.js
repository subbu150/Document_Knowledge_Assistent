import express from "express";
import multer from "multer";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { jobs } from "../jobs/jobStore.js";

const router = express.Router();
console.log("Reached here")
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post("/", upload.single("document"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  const jobId = uuidv4();

  jobs.push({
    id: jobId,
    filePath: req.file.path,
    mimeType: req.file.mimetype,
    status: "PENDING",
    error: null
  });

  console.log("Job Created:", jobId);

  res.render("processing", { jobId });
});
router.get("/", (req, res) => {
  res.send(`
    <form action="/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="document" />
      <button type="submit">Upload</button>
    </form>
  `);
});
export default router;