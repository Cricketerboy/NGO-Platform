import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SubmitReport from "./pages/SubmitReport";

import Navbar from "./components/Navbar";
import UploadCSV from "./pages/UploadCsv";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/submit" element={<SubmitReport />} />
        <Route path="/upload" element={<UploadCSV/>} />
      </Routes>
    </BrowserRouter>
  );
}
