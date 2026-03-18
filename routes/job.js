import express from "express";
import { jobs } from "../jobs/jobStore.js";

const router = express.Router();

router.get("/:id", (req, res) => {
  const job = jobs.find(j => j.id === req.params.id);

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  res.json({
    status: job.status,
    error: job.error
  });
});

export default router;