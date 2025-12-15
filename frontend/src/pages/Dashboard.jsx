import { useState } from "react";
import api from "../api/api";

export default function Dashboard() {
  const [month, setMonth] = useState("2025-01");
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const res = await api.get(`/dashboard?month=${month}`);
    setData(res.data);
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>

        <div className="month-selector">
          <input
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            placeholder="YYYY-MM"
          />
          <button onClick={fetchData}>View</button>
        </div>
      </div>

      {/* KPI Cards */}
      {data && (
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-title">Total NGOs Reporting</div>
            <div className="kpi-value">{data.totalNGOs}</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-title">People Helped</div>
            <div className="kpi-value">{data.totalPeopleHelped}</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-title">Events Conducted</div>
            <div className="kpi-value">{data.totalEvents}</div>
          </div>

          <div className="kpi-card funds">
            <div className="kpi-title">Funds Utilized</div>
            <div className="kpi-value">₹ {data.totalFunds}</div>
          </div>
        </div>
      )}
    </div>
  );
}
