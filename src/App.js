import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Home';
import Home from './pages/Home';
import ReportPage from "./pages/ReportPage";
import AllReportsPage from "./pages/ReportPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/reports" element={<AllReportsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
