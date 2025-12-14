import express from "express";
import cors from "cors";

import reportRoutes from "./routes/report.routes";
import uploadRoutes from "./routes/upload.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import jobRoutes from "./routes/job.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/report", reportRoutes);
app.use("/reports", uploadRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/job-status", jobRoutes);

export default app;
