import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import OnboardingNav from "../components/OnboardingNav";
import OnboardingSidebar from "../components/OnboardingSidebar";
import PeopleListCard from "../components/PeopleListCard";

export const Attestation: React.FC = () => {
  const navigate = useNavigate();
  const setAttestation = useAppStore(state => state.setAttestation);
  const attestation = useAppStore(state => state.attestation);
  const owners = useAppStore(state => state.owners.filter(o => !o.removed));
  const directors = useAppStore(state => state.directors.filter(d => !d.removed));
  const config = useAppStore(state => state.config);
  const [signerName, setSignerName] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signerName || !confirmed) {
      alert("Please provide your name and confirm the attestation");
      return;
    }
    setAttestation({
      required: true,
      signerName,
      timestamp: Date.now(),
      diff: attestation?.diff || { removed: [], added: [], edited: [] },
      context: attestation?.context,
      finalList: attestation?.finalList
    });
    navigate("/summary");
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
    if (context === "directors") return "Review and electronically sign";
    if (context === "both") return "Review and electronically sign";
    return "Review and electronically sign";
  };

  const getDescription = () => {
    if (context === "directors") return "The list of directors has changed from what was initially found. Please review and confirm these changes.";
    if (context === "both") return "The list of beneficial owners and directors has changed from what was initially found. Please review and confirm these changes.";
    return "The list of beneficial owners has changed from what was initially found. Please review and confirm these changes.";
  };

  const getListTitle = () => {
    if (context === "directors") return "Directors";
    if (context === "both") return "Beneficial owners & Directors";
    return "Beneficial owners";
  };

  const getConfirmationText = () => {
    if (context === "directors") return "I confirm that the director information provided is accurate and complete to the best of my knowledge.";
    if (context === "both") return "I confirm that the beneficial ownership and director information provided is accurate and complete to the best of my knowledge.";
    return "I confirm that the beneficial ownership information provided is accurate and complete to the best of my knowledge.";
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


          {/* Document Preview */}
          <div className="section">
            <h3 style={{ fontSize: "1em", fontWeight: 600, marginBottom: "1em", color: "#1f2937" }}>
              Document
            </h3>
            <div style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "1.5em",
              backgroundColor: "#fafafa",
              minHeight: "300px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1em"
            }}>
              <div style={{
                width: "64px",
                height: "64px",
                backgroundColor: "#e5e7eb",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 600, fontSize: "1em", color: "#1f2937", marginBottom: "0.25em" }}>
                  Ultimate Beneficial Owner attestation
                </div>
                <div style={{ fontSize: "0.875em", color: "#6b7280" }}>
                  Document preview
                </div>
              </div>
            </div>
          </div>

          {/* Attestation Form */}
          <form onSubmit={handleSubmit} className="section">
            

            <div className="form-group">
              <label className="form-label">Your full name</label>
              <input
                type="text"
                className="form-input"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

           

            <div className="button-group-vertical">
              <button 
                type="submit" 
                disabled={!signerName || !confirmed}
                className="btn btn-primary btn-large"
              >
                Confirm and continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Attestation;

