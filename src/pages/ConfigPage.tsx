import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import type { Discovery } from "../store/types";
import { v4 as uuidv4 } from "uuid";

export const ConfigPage: React.FC = () => {
  const init = useAppStore(state => state.initFromConfig);
  const navigate = useNavigate();

  const [ownersFound, setOwnersFound] = useState(true);
  const [directorsFound, setDirectorsFound] = useState(false);
  const [ownersText, setOwnersText] = useState("Alice Example\nBob Example");
  const [directorsText, setDirectorsText] = useState("Carol Director");

  const nothingFound = !ownersFound && !directorsFound;

  const handleStart = () => {
    if (nothingFound) {
      return; // Don't proceed if nothing is selected
    }

    const cfg: Discovery = {
      ownersFound,
      directorsFound,
      prefillOwners: ownersFound ? ownersText.split("\n").filter(Boolean).map(name => ({ id: uuidv4(), name })) : [],
      prefillDirectors: directorsFound ? directorsText.split("\n").filter(Boolean).map(name => ({ id: uuidv4(), name })) : [],
    };
    init(cfg);

    if (ownersFound) navigate("/owners/prefill");
    else if (directorsFound) navigate("/directors/prefill");
    else navigate("/owners/edit");
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#1a1a1a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem"
    }}>
      <div style={{
        maxWidth: "500px",
        width: "100%",
        backgroundColor: "#2a2a2a",
        borderRadius: "12px",
        padding: "2.5rem",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)"
      }}>
        <div className="page-header" style={{ marginBottom: "2em" }}>
          <h1 style={{
            fontSize: "2em",
            fontWeight: 600,
            color: "#f3f4f6",
            margin: "0 0 0.5em 0"
          }}>Prototype Config</h1>
          <p style={{
            color: "#9ca3af",
            fontSize: "1em",
            lineHeight: 1.6
          }}>Configure the discovery scenario for testing</p>
        </div>

        <div className="section">
          <div className="form-group">
            <label style={{ 
              display: "flex", 
              alignItems: "center", 
              cursor: "pointer",
              padding: "1em",
              border: "2px solid #404040",
              borderRadius: "8px",
              transition: "all 0.2s",
              backgroundColor: "#333333"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#6366f1";
              e.currentTarget.style.backgroundColor = "#383838";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#404040";
              e.currentTarget.style.backgroundColor = "#333333";
            }}
            >
              <input 
                type="checkbox" 
                className="form-checkbox"
                checked={ownersFound} 
                onChange={e => setOwnersFound(e.target.checked)}
                style={{ width: "1.5em", height: "1.5em", marginRight: "0.75em" }}
              />
              <span style={{ fontSize: "1.05em", fontWeight: 500, color: "#f3f4f6" }}>Found UBOs</span>
            </label>
          </div>

          <div className="form-group">
            <label style={{ 
              display: "flex", 
              alignItems: "center", 
              cursor: "pointer",
              padding: "1em",
              border: "2px solid #404040",
              borderRadius: "8px",
              transition: "all 0.2s",
              backgroundColor: "#333333"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#6366f1";
              e.currentTarget.style.backgroundColor = "#383838";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#404040";
              e.currentTarget.style.backgroundColor = "#333333";
            }}
            >
              <input 
                type="checkbox" 
                className="form-checkbox"
                checked={directorsFound} 
                onChange={e => setDirectorsFound(e.target.checked)}
                style={{ width: "1.5em", height: "1.5em", marginRight: "0.75em" }}
              />
              <span style={{ fontSize: "1.05em", fontWeight: 500, color: "#f3f4f6" }}>Found Directors</span>
            </label>
          </div>

          <div className="form-group">
            <label style={{
              display: "block",
              marginBottom: "0.5em",
              fontWeight: 500,
              color: "#d1d5db"
            }}>Seed prefill owners (newline-separated)</label>
            <textarea 
              style={{
                width: "100%",
                padding: "0.75em",
                fontSize: "1em",
                border: "1px solid #404040",
                borderRadius: "6px",
                fontFamily: "inherit",
                transition: "border-color 0.2s",
                backgroundColor: "#333333",
                color: "#f3f4f6"
              }}
              value={ownersText} 
              onChange={e => setOwnersText(e.target.value)} 
              rows={4}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#6366f1";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.2)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#404040";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <div className="form-group">
            <label style={{
              display: "block",
              marginBottom: "0.5em",
              fontWeight: 500,
              color: "#d1d5db"
            }}>Seed prefill directors (newline-separated)</label>
            <textarea 
              style={{
                width: "100%",
                padding: "0.75em",
                fontSize: "1em",
                border: "1px solid #404040",
                borderRadius: "6px",
                fontFamily: "inherit",
                transition: "border-color 0.2s",
                backgroundColor: "#333333",
                color: "#f3f4f6"
              }}
              value={directorsText} 
              onChange={e => setDirectorsText(e.target.value)} 
              rows={2}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#6366f1";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.2)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#404040";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {nothingFound && (
            <div style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              padding: "1em",
              marginBottom: "1em"
            }}>
              <div style={{ 
                display: "flex", 
                alignItems: "flex-start", 
                gap: "0.75em" 
              }}>
                <span style={{ color: "#dc2626", fontSize: "1.25em" }}>⚠️</span>
                <div>
                  <div style={{ 
                    fontWeight: 600, 
                    color: "#991b1b", 
                    marginBottom: "0.25em",
                    fontSize: "0.95em"
                  }}>
                    Configuration required
                  </div>
                  <div style={{ color: "#7f1d1d", fontSize: "0.9em", lineHeight: 1.5 }}>
                    This flow is not configured yet. Please select at least one option (UBOs or Directors) to continue.
                  </div>
                </div>
              </div>
            </div>
          )}

          <button 
            onClick={handleStart} 
            className="btn btn-primary btn-large"
            disabled={nothingFound}
            style={{
              opacity: nothingFound ? 0.5 : 1,
              cursor: nothingFound ? "not-allowed" : "pointer"
            }}
          >
            Save & Start flow
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigPage;

