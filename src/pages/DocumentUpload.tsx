import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingNav from "../components/OnboardingNav";
import OnboardingSidebar from "../components/OnboardingSidebar";

export const DocumentUpload: React.FC = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleContinue = () => {
    if (files.length === 0) {
      alert("Please upload at least one document");
      return;
    }
    // For prototype, just navigate to summary
    navigate("/summary");
  };

  return (
    <div className="layout-with-sidebar">
      <OnboardingSidebar currentStep="business-owners" />
      <div className="main-content-with-sidebar">
        <OnboardingNav onBack={() => navigate("/verification-method")} />
        <div className="page-content">
          <div className="page-header">
            <h1 className="page-title">Upload supporting documents</h1>
            <p className="page-description">
              Upload official documentation that supports the changes to beneficial ownership.
            </p>
          </div>

          <div className="section">
            <div className="info-box" style={{ marginBottom: "1.5em" }}>
              <p style={{ margin: 0, fontSize: "0.95em", lineHeight: 1.6 }}>
                Acceptable documents include share certificates, board resolutions, or other official records showing ownership changes.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Upload documents</label>
              <div style={{
                border: "2px dashed #d1d5db",
                borderRadius: "8px",
                padding: "2em",
                textAlign: "center",
                backgroundColor: "#fafafa"
              }}>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  id="file-upload"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="file-upload"
                  style={{
                    cursor: "pointer",
                    color: "#6366f1",
                    fontWeight: 500
                  }}
                >
                  Click to upload files
                </label>
                <p style={{ margin: "0.5em 0 0 0", fontSize: "0.9em", color: "#6b7280" }}>
                  PDF, JPG, or PNG files accepted
                </p>
              </div>
            </div>

            {files.length > 0 && (
              <div style={{ marginTop: "1em" }}>
                <div style={{ fontWeight: 600, marginBottom: "0.5em", fontSize: "0.95em" }}>
                  Selected files:
                </div>
                <ul style={{ margin: 0, paddingLeft: "1.5em" }}>
                  {files.map((file, index) => (
                    <li key={index} style={{ fontSize: "0.9em", color: "#6b7280", marginBottom: "0.25em" }}>
                      {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="button-group-vertical">
            <button
              onClick={handleContinue}
              disabled={files.length === 0}
              className="btn btn-primary btn-large"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;


