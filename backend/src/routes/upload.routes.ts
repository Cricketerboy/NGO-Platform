import { Router } from "express";
import multer from "multer";
import { Worker } from "worker_threads";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";

const router = Router();
const prisma = new PrismaClient();

// Multer setup
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "CSV file is required" });
  }

  const jobId = uuid();

  await prisma.job.create({
    data: {
      id: jobId,
      status: "processing",
      totalRows: 0,
      processedRows: 0,
      failedRows: 0
    }
  });

  // ✅ CommonJS-safe worker path
  const workerPath =
    process.env.NODE_ENV === "production"
      ? path.join(__dirname, "../worker.js")
      : path.join(__dirname, "../worker.ts");

  new Worker(workerPath, {
    workerData: {
      jobId,
      filePath: req.file.path
    }
  });

  res.json({ job_id: jobId });
});

export default router;
