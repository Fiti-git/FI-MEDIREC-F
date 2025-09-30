import React from 'react';
import './FileTable.css';

const files = [
  { name: "wp2495937.jpeg", uploader: "MEDIRC Admin", date: "Sep 08, 2025", size: "162 kB", sharing: "Private" },
  { name: "mahi", uploader: "MEDIRC Admin", date: "Sep 04, 2025", size: "0 B", sharing: "Private" },
  { name: "bullseye.svg", uploader: "MEDIRC Admin", date: "Aug 27, 2025", size: "24.4 kB", sharing: "Shared" },
  // Add more rows here
];

function FileTable() {
  return (
    <div className="table-wrapper">
      <div className="table-header">
        <h2>Files</h2>
        <div className="table-actions">
          <button className="btn">Manage Tags</button>
          <button className="btn primary">+ Add New</button>
        </div>
      </div>

      <div className="search-filter">
        <input type="text" placeholder="Search files" />
        <button className="btn">Filter</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Uploaded By</th>
            <th>Modified</th>
            <th>File Size</th>
            <th>Sharing</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, i) => (
            <tr key={i}>
              <td>{file.name}</td>
              <td>{file.uploader}</td>
              <td>{file.date}</td>
              <td>{file.size}</td>
              <td>{file.sharing}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FileTable;
