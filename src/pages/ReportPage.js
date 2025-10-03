import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

const AllReportsPage = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    //fetch("http://206.189.156.71:5000/api/documents/results/")
    fetch("http://128.199.2.245:5000/api/documents/results/")
      .then((res) => res.json())
      .then((data) => {
        setReports(data);
      })
      .catch((err) => console.error(err));
  }, []);

const generatePDF = (report) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Medical Lab Report Analysis", 10, 10);

  let parsedData = null;

  try {
    parsedData = JSON.parse(
      report.data.raw_response.replace(/```json|```/g, "")
    );
  } catch (e) {
    console.error("Invalid JSON in report:", report.id, e);
  }

  if (parsedData && parsedData.patient_details) {
    const patient = parsedData.patient_details;
    doc.setFontSize(12);
    doc.text("Patient Details:", 10, 20);
    doc.text(`Name: ${patient.name}`, 10, 30);
    doc.text(`Age: ${patient.age}`, 10, 37);
    doc.text(`Gender: ${patient.gender}`, 10, 44);
    doc.text(`Patient ID: ${patient.patient_id}`, 10, 51);
    doc.text(`DOB: ${patient.dob}`, 10, 58);
    doc.text(`Nationality: ${patient.nationality}`, 10, 65);
  } else {
    doc.setFontSize(12);
    doc.text("No valid JSON data available for this report.", 10, 20);
  }

  doc.save(`report_${report.id}.pdf`);
};


  return (
    <div style={{ padding: "20px" }}>
      <h1>All Medical Lab Reports</h1>
      {reports.length === 0 && <p>No reports found.</p>}
      <ul>
        {reports.map((report) => (
          <li key={report.id} style={{ marginBottom: "10px" }}>
            Report ID: {report.id} | Processed At:{" "}
            {new Date(report.processed_at).toLocaleString()}{" "}
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => generatePDF(report)}
            >
              Generate PDF
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllReportsPage;
