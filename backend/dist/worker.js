"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const { jobId, filePath } = worker_threads_1.workerData;
let total = 0;
let processed = 0;
let failed = 0;
fs_1.default.createReadStream(filePath)
    .pipe((0, csv_parser_1.default)())
    .on("data", async (row) => {
    total++;
    try {
        await prisma.report.upsert({
            where: {
                ngoId_month: {
                    ngoId: row.ngoId,
                    month: row.month
                }
            },
            update: {
                peopleHelped: Number(row.peopleHelped),
                eventsConducted: Number(row.eventsConducted),
                fundsUtilized: Number(row.fundsUtilized)
            },
            create: {
                ngoId: row.ngoId,
                month: row.month,
                peopleHelped: Number(row.peopleHelped),
                eventsConducted: Number(row.eventsConducted),
                fundsUtilized: Number(row.fundsUtilized)
            }
        });
        processed++;
    }
    catch {
        failed++;
    }
    await prisma.job.update({
        where: { id: jobId },
        data: {
            totalRows: total,
            processedRows: processed,
            failedRows: failed
        }
    });
})
    .on("end", async () => {
    await prisma.job.update({
        where: { id: jobId },
        data: { status: "completed" }
    });
});
