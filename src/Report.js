import React, { useEffect, useState } from "react";

function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/reports")
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch((err) => console.error("Error fetching reports:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Reports</h2>
      {reports.length === 0 ? (
        <p>No reports available.</p>
        
      ) : (
        <ul>
          {reports.map((report) => (
            <li key={report._id}>
              <strong>{report.title}</strong> - {report.summary} <br />
              <small>{new Date(report.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Reports;

