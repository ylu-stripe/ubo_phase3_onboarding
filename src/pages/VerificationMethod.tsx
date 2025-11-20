import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import OnboardingNav from "../components/OnboardingNav";
import OnboardingSidebar from "../components/OnboardingSidebar";
import PeopleListCard from "../components/PeopleListCard";

export const VerificationMethod: React.FC = () => {
  const navigate = useNavigate();
  const attestation = useAppStore(state => state.attestation);
  const owners = useAppStore(state => state.owners.filter(o => !o.removed));
  const directors = useAppStore(state => state.directors.filter(d => !d.removed));
  const config = useAppStore(state => state.config);
  const [selectedMethod, setSelectedMethod] = useState<"attestation" | "documents" | null>(null);

  const handleContinue = () => {
    if (!selectedMethod) {
      alert("Please select a verification method");
      return;
    }

    if (selectedMethod === "attestation") {
      navigate("/attestation");
    } else {
      navigate("/document-upload");
    }
  };

  // Determine the context-specific text
  // If no attestation context, infer from config
  const context = attestation?.context || 
    (config.directorsFound && !config.ownersFound ? "directors" : "owners");
  
  // Get the list of people to display
  // Use attestation.finalList if available, otherwise use current active people
  const displayList = attestation?.finalList || 
    (context === "directors" ? directors.map(d => d.name) :
     context === "both" ? [...owners.map(o => o.name), ...directors.map(d => d.name)] :
     owners.map(o => o.name));
  const getTitle = () => {
    if (context === "directors") return "Verify changes to directors";
    if (context === "both") return "Verify changes to ownership";
    return "Verify changes to ownership";
  };

  const getDescription = () => {
    if (context === "directors") return "The list of directors has changed from what was initially found. Please choose how you'd like to verify these changes.";
    if (context === "both") return "The list of beneficial owners and directors has changed from what was initially found. Please choose how you'd like to verify these changes.";
    return "The list of beneficial owners has changed from what was initially found. Please choose how you'd like to verify these changes.";
  };

  const getListTitle = () => {
    if (context === "directors") return "Directors";
    if (context === "both") return "Beneficial owners & Directors";
    return "Beneficial owners";
  };

  const getDocumentDescription = () => {
    if (context === "directors") return "Provide official documentation that supports the changes to directors (e.g., board resolutions, appointment letters).";
    return "Provide official documentation that supports the changes to beneficial ownership (e.g., share certificates, board resolutions).";
  };

  return (
    <div className="layout-with-sidebar">
      <OnboardingSidebar currentStep="business-owners" />
      <div className="main-content-with-sidebar">
        <OnboardingNav onBack={() => navigate("/owners")} />
        <div className="page-content">
          <div className="page-header">
            <h1 className="page-title">{getTitle()}</h1>
            <p className="page-description">
              {getDescription()}
            </p>
          </div>

          {/* Changes Summary */}
          <PeopleListCard title={getListTitle()} people={displayList} />

          <div className="section">
            <h3 style={{ fontSize: "1em", fontWeight: 600, marginBottom: "1em", color: "#1f2937" }}>
              Verification method
            </h3>

            {/* Attestation Option */}
            <label
              style={{
                display: "block",
                cursor: "pointer",
                padding: "1.25em",
                border: `2px solid ${selectedMethod === "attestation" ? "#6366f1" : "#e5e7eb"}`,
                borderRadius: "8px",
                marginBottom: "1em",
                backgroundColor: selectedMethod === "attestation" ? "#f0f9ff" : "white",
                transition: "all 0.2s"
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1em" }}>
                <input
                  type="radio"
                  name="verification-method"
                  value="attestation"
                  checked={selectedMethod === "attestation"}
                  onChange={() => setSelectedMethod("attestation")}
                  style={{
                    width: "1.25em",
                    height: "1.25em",
                    marginTop: "0.125em",
                    flexShrink: 0,
                    accentColor: "#6366f1"
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: "0.5em", color: "#1f2937" }}>
                    Sign an attestation
                  </div>
                  <p style={{ margin: 0, fontSize: "0.95em", color: "#6b7280", lineHeight: 1.6 }}>
                    Confirm the changes by providing your name and attesting that the information is accurate.
                  </p>
                </div>
              </div>
            </label>

            {/* Document Upload Option */}
            <label
              style={{
                display: "block",
                cursor: "pointer",
                padding: "1.25em",
                border: `2px solid ${selectedMethod === "documents" ? "#6366f1" : "#e5e7eb"}`,
                borderRadius: "8px",
                backgroundColor: selectedMethod === "documents" ? "#f0f9ff" : "white",
                transition: "all 0.2s"
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1em" }}>
                <input
                  type="radio"
                  name="verification-method"
                  value="documents"
                  checked={selectedMethod === "documents"}
                  onChange={() => setSelectedMethod("documents")}
                  style={{
                    width: "1.25em",
                    height: "1.25em",
                    marginTop: "0.125em",
                    flexShrink: 0,
                    accentColor: "#6366f1"
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: "0.5em", color: "#1f2937" }}>
                    Upload supporting documents
                  </div>
                  <p style={{ margin: 0, fontSize: "0.95em", color: "#6b7280", lineHeight: 1.6 }}>
                    {getDocumentDescription()}
                  </p>
                </div>
              </div>
            </label>
          </div>

          <div className="button-group-vertical">
            <button
              onClick={handleContinue}
              disabled={!selectedMethod}
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

export default VerificationMethod;

