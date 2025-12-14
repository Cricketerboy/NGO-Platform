"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const report_routes_js_1 = __importDefault(require("./routes/report.routes.js"));
const upload_routes_js_1 = __importDefault(require("./routes/upload.routes.js"));
const dashboard_routes_js_1 = __importDefault(require("./routes/dashboard.routes.js"));
const job_routes_js_1 = __importDefault(require("./routes/job.routes.js"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/report", report_routes_js_1.default);
app.use("/reports", upload_routes_js_1.default);
app.use("/dashboard", dashboard_routes_js_1.default);
app.use("/job-status", job_routes_js_1.default);
exports.default = app;
