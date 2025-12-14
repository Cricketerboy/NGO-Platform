"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const worker_threads_1 = require("worker_threads");
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const upload = (0, multer_1.default)({ dest: "uploads/" });
const __filename = (0, url_1.fileURLToPath)(import.meta.url);
const __dirname = path_1.default.dirname(__filename);
router.post("/upload", upload.single("file"), async (req, res) => {
    const jobId = (0, uuid_1.v4)();
    await prisma.job.create({
        data: {
            id: jobId,
            status: "processing",
            totalRows: 0,
            processedRows: 0,
            failedRows: 0
        }
    });
    const workerPath = process.env.NODE_ENV === "production"
        ? path_1.default.join(__dirname, "../worker.js")
        : path_1.default.join(__dirname, "../worker.ts");
    new worker_threads_1.Worker(workerPath, {
        workerData: {
            jobId,
            filePath: req.file.path
        }
    });
    res.json({ job_id: jobId });
});
exports.default = router;
