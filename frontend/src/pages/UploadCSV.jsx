import { useState } from "react";
import api from "../api/api";

export default function UploadCSV() {
  const [file, setFile] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);

  const upload = async () => {
    if (!file) {
      alert("Please select a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
   //uploading
    const res = await api.post("/reports/upload", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
    setJobId(res.data.job_id);
    setStatus({ status: "processing", processedRows: 0, totalRows: 0, failedRows: 0 });
  };

  const refreshStatus = async () => {
    const res = await api.get(`/job-status/${jobId}`);
    setStatus(res.data);
  };

  const progress =
    status && status.totalRows
      ? Math.round((status.processedRows / status.totalRows) * 100)
      : 0;

  return (
    <div className="upload-page">
      <div className="upload-card">
        <h2>Bulk CSV Upload</h2>
        <p>Upload NGO monthly reports in CSV format</p>

        {/* Upload */}
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={upload}>Upload</button>

        {/* Status */}
        {jobId && status && (
          <div className="status-box">
            <div className="status-row">
              <span>Status</span>
              <span
                className={`status-badge ${
                  status.status === "completed"
                    ? "completed"
                    : status.status === "failed"
                    ? "failed"
                    : "processing"
                }`}
              >
                {status.status}
              </span>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="status-row">
              <span>Processed</span>
              <span>
                {status.processedRows}/{status.totalRows}
              </span>
            </div>

            <div className="status-row">
              <span>Failed Rows</span>
              <span>{status.failedRows}</span>
            </div>

            {status.status !== "completed" && (
              <button
                style={{ marginTop: "10px" }}
                onClick={refreshStatus}
              >
                Refresh Status
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
