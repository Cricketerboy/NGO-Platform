import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="navbar">
      <h2>NGO Impact Platform</h2>
      <div>
        <Link to="/">Dashboard</Link>
        <Link to="/submit">Submit Report</Link>
        <Link to="/upload">Upload CSV</Link>
      </div>
    </div>
  );
}
