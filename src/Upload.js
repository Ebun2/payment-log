import React, { useState } from "react";

function Upload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    // Prepare upload data
    const uploadData = {
      fileName: file.name,
      fileType: file.type,
      uploadedBy: "Admin User", // You can make this dynamic later
      status: "Pending",
    };

    try {
      const response = await fetch("http://localhost:5000/api/uploads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(uploadData),
      });

      const result = await response.json();
      setStatus(`✅ Uploaded: ${result.fileName}`);
    } catch (error) {
      console.error("Upload error:", error);
      setStatus("❌ Upload failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload Files</h2>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}

export default Upload;
