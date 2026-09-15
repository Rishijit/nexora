import { useEffect, useRef, useState } from "react";
import API_URL from "./api";
function FilesPage() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  const token = localStorage.getItem("nexoraToken");

  async function fetchFiles() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/files`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch files");
      }

      setFiles(data);
    } catch (error) {
      console.error("Fetch files error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFiles();
  }, []);

  function handleFileChange(event) {
    const file = event.target.files[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10 MB.");
      setSelectedFile(null);
      return;
    }

    setError("");
    setMessage("");
    setSelectedFile(file);
  }

  async function handleUpload(event) {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setMessage("");

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(`${API_URL}/api/files`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setMessage("File uploaded successfully.");
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      fetchFiles();
    } catch (error) {
      console.error("Upload file error:", error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDownload(file) {
    try {
      setError("");

      const response = await fetch(
        `${API_URL}/api/files/${file._id}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Download failed");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = file.originalName;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download file error:", error);
      setError(error.message);
    }
  }

  async function handleDelete(fileId) {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this file?"
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
  `${API_URL}/api/files/${fileId}`,
  {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      setMessage("File deleted successfully.");
      setFiles((previousFiles) =>
        previousFiles.filter((file) => file._id !== fileId)
      );
    } catch (error) {
      console.error("Delete file error:", error);
      setError(error.message);
    }
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function formatDate(dateValue) {
    return new Date(dateValue).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function getFileIcon(mimeType) {
    if (mimeType?.startsWith("image/")) {
      return "▧";
    }

    if (mimeType?.includes("pdf")) {
      return "▤";
    }

    if (
      mimeType?.includes("word") ||
      mimeType?.includes("document")
    ) {
      return "▥";
    }

    if (
      mimeType?.includes("sheet") ||
      mimeType?.includes("excel")
    ) {
      return "▦";
    }

    return "□";
  }

  return (
    <section className="files-page">
      <div className="files-page-heading">
        <div>
          <p className="eyebrow">YOUR WORKSPACE</p>
          <h1>My Files</h1>
          <p className="files-page-description">
            Store and manage your important files in one place.
          </p>
        </div>
      </div>

      <form
        className="file-upload-card"
        onSubmit={handleUpload}
      >
        <div className="file-upload-heading">
          <div className="file-upload-icon">↑</div>

          <div>
            <h2>Upload a file</h2>
            <p>Maximum file size: 10 MB</p>
          </div>
        </div>

        <div className="file-upload-controls">
          <label className="file-picker">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
            />

            <span className="file-picker-button">
              Choose File
            </span>

            <span className="file-picker-name">
              {selectedFile
                ? selectedFile.name
                : "No file chosen"}
            </span>
          </label>

          <button
            type="submit"
            className="file-upload-button"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload File"}
          </button>
        </div>

        {message && (
          <p className="file-success-message">{message}</p>
        )}

        {error && (
          <p className="file-error-message">{error}</p>
        )}
      </form>

      <section className="uploaded-files-section">
        <div className="uploaded-files-heading">
          <div>
            <h2>Uploaded Files</h2>
            <p>
              {files.length}{" "}
              {files.length === 1 ? "file" : "files"} stored
            </p>
          </div>
        </div>

        {loading ? (
          <div className="files-status-card">
            Loading your files...
          </div>
        ) : files.length === 0 ? (
          <div className="files-status-card">
            <div className="empty-files-icon">□</div>
            <h3>No files yet</h3>
            <p>Upload your first file to see it here.</p>
          </div>
        ) : (
          <div className="files-grid">
            {files.map((file) => (
              <article className="file-card" key={file._id}>
                <div className="file-card-top">
                  <div className="file-type-icon">
                    {getFileIcon(file.mimeType)}
                  </div>

                  <div className="file-card-actions">
                    <button
                      type="button"
                      className="file-action-button"
                      onClick={() => handleDownload(file)}
                      title="Download file"
                    >
                      ↓
                    </button>

                    <button
                      type="button"
                      className="file-action-button file-delete-button"
                      onClick={() => handleDelete(file._id)}
                      title="Delete file"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <h3 title={file.originalName}>
                  {file.originalName}
                </h3>

                <p className="file-card-meta">
                  {formatFileSize(file.size)}
                  <span>•</span>
                  {formatDate(file.createdAt)}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

export default FilesPage;