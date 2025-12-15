import { Router } from "express";
import multer from "multer";
import { Worker } from "worker_threads";
import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";

const router = Router();
const prisma = new PrismaClient();

/* ===============================
   Ensure uploads directory exists
   =============================== */
const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/* ===============================
   Multer configuration
   =============================== */
const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB (important for Render)
  }
});

router.post("/upload", (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      // Multer-specific errors
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).json({
            error: "Unexpected file field. Use field name 'file'."
          });
        }

        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            error: "File too large. Max size is 5MB."
          });
        }

        return res.status(400).json({ error: err.message });
      }

      // Unknown error
      return res.status(500).json({ error: "File upload failed" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "CSV file is required" });
    }

    try {
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

      // Respond immediately
      res.json({ job_id: jobId });

      const workerPath =
        process.env.NODE_ENV === "production"
          ? path.join(__dirname, "../worker.js")
          : path.join(__dirname, "../worker.ts");

      setImmediate(() => {
        new Worker(workerPath, {
          workerData: {
            jobId,
            filePath: req.file!.path
          }
        });
      });

    } catch (error) {
      console.error("Upload failed:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  });
});


export default router;
