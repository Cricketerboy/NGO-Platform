-- CreateTable
CREATE TABLE "Report" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ngoId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "peopleHelped" INTEGER NOT NULL,
    "eventsConducted" INTEGER NOT NULL,
    "fundsUtilized" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "totalRows" INTEGER NOT NULL,
    "processedRows" INTEGER NOT NULL,
    "failedRows" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Report_ngoId_month_key" ON "Report"("ngoId", "month");
