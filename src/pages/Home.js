import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import './Dashboard.css'; // Make sure this path is correct

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileTitle, setFileTitle] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [currentJsonData, setCurrentJsonData] = useState(null);
  const navigate = useNavigate();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Display 10 records per page

  // const BASE_URL = 'http://206.189.156.71:5000'; // Your backend base URL
  const BASE_URL = 'http://128.199.2.245:5000'; // Your backend base URL

  // Function to fetch files from the backend
  const fetchFiles = async () => {
    try {
      const response = await fetch(`${BASE_URL}/documents/hierarchy/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUploadedFiles(data);
    } catch (error) {
      console.error("Error fetching files:", error);
      alert("Failed to load files. Please try again later.");
    }
  };

  useEffect(() => {
    fetchFiles(); // Fetch files on component mount
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    setFileTitle(''); // Clear title on modal close
  };

  const closeJsonModal = () => {
    setShowJsonModal(false);
    setCurrentJsonData(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const fileName = file.name;
      const titleWithoutExtension = fileName.split('.').slice(0, -1).join('.');
      setFileTitle(titleWithoutExtension);
    }
  };

  const handleTitleChange = (e) => {
    setFileTitle(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a file!');
      return;
    }
    if (!fileTitle.trim()) {
      alert('Please provide a title for the file!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', fileTitle);

    try {
      const response = await fetch(`${BASE_URL}/api/documents/uploads/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Upload failed: ${JSON.stringify(errorData)}`);
      }

      await response.json();
      alert('File uploaded successfully!');
      closeModal();
      fetchFiles(); // Refresh the list of files
      setCurrentPage(1); // Reset to first page after upload
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(`Error uploading file: ${error.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const getFileNameFromUrl = (url) => {
    if (!url) return 'N/A';
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  const getFileTypeFromUrl = (url) => {
    if (!url) return 'Unknown';
    if (url.endsWith('.pdf')) return 'application/pdf';
    if (url.endsWith('.txt')) return 'text/plain';
    if (url.endsWith('.json')) return 'application/json';
    return 'Document';
  };

  const handleViewPdf = (fileUrl) => {
    window.open(`${BASE_URL}${fileUrl}`, '_blank');
  };

  const handleViewText = (textUrl) => {
    window.open(`${BASE_URL}${textUrl}`, '_blank');
  };

  // --- START OF MODIFIED FUNCTION ---
  const handleViewJson = (jsonData) => {
    const rawResponse = jsonData.data.raw_response;

    try {
      // First, we still attempt to clean and parse the string
      let jsonString = rawResponse;

      if (typeof jsonString !== 'string') {
        // If it's already an object, stringify it for display
        const dataToDisplay = JSON.stringify(rawResponse, null, 2);
        setCurrentJsonData(dataToDisplay);
        setShowJsonModal(true);
        return;
      }

      // Clean markdown fences if they exist
      if (jsonString.startsWith('```json') && jsonString.endsWith('```')) {
        jsonString = jsonString.substring(jsonString.indexOf('\n') + 1, jsonString.length - 3).trim();
      } else if (jsonString.startsWith('```') && jsonString.endsWith('```')) {
        jsonString = jsonString.substring(3, jsonString.length - 3).trim();
      }
      jsonString = jsonString.trim();

      if (!jsonString) {
        throw new Error("The raw_response string is empty after trimming.");
      }

      // This is the line that will fail for the truncated response
      const parsedData = JSON.parse(jsonString); 
      
      // If successful, show the pretty-printed JSON
      const dataToDisplay = JSON.stringify(parsedData, null, 2);
      setCurrentJsonData(dataToDisplay);

    } catch (error) {
      // --- GRACEFUL FAILURE LOGIC ---
      // If JSON.parse() fails, we fall back to displaying the raw text
      console.error("Failed to parse JSON. This is likely due to truncated or malformed data from the backend.", error);
      console.error("Problematic raw_response:", rawResponse);

      const warningMessage = 
`/*
WARNING: The data could not be parsed as valid JSON. 
It appears to be incomplete or malformed. 
Displaying the raw text received from the server below.
*/\n\n`;
      
      // Set the modal content to the warning + the broken string
      setCurrentJsonData(warningMessage + rawResponse);
    }
    
    // Show the modal regardless of success or failure
    setShowJsonModal(true); 
  };
  // --- END OF MODIFIED FUNCTION ---

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = uploadedFiles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(uploadedFiles.length / itemsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Files</h2>
        <div className="header-buttons">
          <button className="btn btn-primary" onClick={openModal}>+ Add New</button>
          <button
            className="btn btn-logout"
            onClick={handleLogout}
            title="Logout"
          >
            <FiLogOut size={24} />
          </button>
        </div>
      </header>

      <div className="manage-files-text">Manage Files</div>

      <table className="file-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>File Type</th>
            <th>Uploaded At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length === 0 ? (
            <tr><td colSpan="4">No files uploaded yet.</td></tr>
          ) : (
            currentItems.map((item) => (
              <tr key={item.document.id}>
                <td>{item.document.title || getFileNameFromUrl(item.document.file)}</td>
                <td>{getFileTypeFromUrl(item.document.file)}</td>
                <td>{new Date(item.document.uploaded_at).toLocaleString()}</td>
                <td className="actions-cell">
                  {item.document.file && (
                    <button onClick={() => handleViewPdf(item.document.file)} className="btn btn-sm">View PDF</button>
                  )}
                  {item.extracted_text && item.extracted_text.text_file && (
                    <button onClick={() => handleViewText(item.extracted_text.text_file)} className="btn btn-sm">View Text File</button>
                  )}
                  {item.processed_result && item.processed_result.data && item.processed_result.data.raw_response && (
                    <button onClick={() => handleViewJson(item.processed_result)} className="btn btn-sm">View JSON</button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {uploadedFiles.length > itemsPerPage && (
        <div className="pagination-controls">
          <button onClick={goToPrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={goToNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add New File</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="file-input">Select File:</label>
                <input
                  id="file-input"
                  type="file"
                  onChange={handleFileChange}
                  className="file-input"
                  accept=".pdf"
                  required
                />
              </div>
              {selectedFile && <p>Selected: {selectedFile.name}</p>}
              <div className="form-group">
                <label htmlFor="file-title">File Title:</label>
                <input
                  id="file-title"
                  type="text"
                  value={fileTitle}
                  onChange={handleTitleChange}
                  className="text-input"
                  placeholder="Enter file title (e.g., Blood Report)"
                  required
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn btn-primary">Add File</button>
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showJsonModal && (
        <div className="modal-overlay" onClick={closeJsonModal}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Processed JSON Result</h3>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: '70vh', overflowY: 'auto', backgroundColor: '#eee', padding: '10px', borderRadius: '5px' }}>
              {currentJsonData}
            </pre>
            <div className="modal-buttons">
              <button type="button" className="btn btn-primary" onClick={closeJsonModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;