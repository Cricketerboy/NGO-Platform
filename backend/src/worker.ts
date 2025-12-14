import fs from "fs";
import csv from "csv-parser";
import { PrismaClient } from "@prisma/client";
import { workerData } from "worker_threads";

const prisma = new PrismaClient();
const { jobId, filePath } = workerData;

async function processCSV() {
  let totalRows = 0;
  let processedRows = 0;
  let failedRows = 0;

  const rows: any[] = [];

  // Read entire CSV into memory (safe for assignment-size files)
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        rows.push(row);
      })
      .on("end", resolve)
      .on("error", reject);
  });

  totalRows = rows.length;

  // Update totalRows ONCE
  await prisma.job.update({
    where: { id: jobId },
    data: { totalRows }
  });

  // Process rows SEQUENTIALLY (IMPORTANT)
  for (const row of rows) {
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

      processedRows++;
    } catch {
      failedRows++;
    }

    // Update progress EVERY 5 rows (prevents DB lock)
    if ((processedRows + failedRows) % 5 === 0) {
      await prisma.job.update({
        where: { id: jobId },
        data: {
          processedRows,
          failedRows
        }
      });
    }
  }

  //Final update
  await prisma.job.update({
    where: { id: jobId },
    data: {
      processedRows,
      failedRows,
      status: "completed"
    }
  });

  await prisma.$disconnect();
}

processCSV().catch(async (err) => {
  console.error(err);
  await prisma.job.update({
    where: { id: jobId },
    data: { status: "failed" }
  });
  await prisma.$disconnect();
});
