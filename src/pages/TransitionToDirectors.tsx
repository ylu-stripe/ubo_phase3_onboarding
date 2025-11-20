import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import OnboardingNav from "../components/OnboardingNav";
import OnboardingSidebar from "../components/OnboardingSidebar";

export const TransitionToDirectors: React.FC = () => {
  const navigate = useNavigate();
  const config = useAppStore(state => state.config);

  const handleContinue = () => {
    // If we found directors in prefill, go to prefill page, otherwise go to edit
    if (config.directorsFound && config.prefillDirectors.length > 0) {
      navigate("/directors/prefill");
    } else {
      navigate("/directors/edit");
    }
  };

  const handleBack = () => {
    navigate("/owners/edit");
  };

  return (
    <div className="layout-with-sidebar">
      <OnboardingSidebar currentStep="business-owners" />
      <div className="main-content-with-sidebar">
        <OnboardingNav onBack={handleBack} />
        <div className="page-content">
          <div className="page-header">
            <h1 className="page-title">We'll verify your directors instead</h1>
            <p className="page-description">
              Since you have no beneficial owners with more than 25% ownership, we'll need information about your directors and officers instead.
            </p>
          </div>

          <div style={{ 
            backgroundColor: "#f9fafb", 
            border: "1px solid #e5e7eb",
            padding: "1.5em", 
            borderRadius: "8px",
            marginBottom: "2em"
          }}>
            <div style={{ fontWeight: 600, marginBottom: "0.75em", fontSize: "0.95em", color: "#1f2937" }}>
              Who is a director or executive?
            </div>
            <p style={{ margin: "0 0 1em 0", fontSize: "0.95em", lineHeight: 1.6, color: "#4b5563" }}>
              Directors and executives are senior individuals who significantly influence your organization's operations and decision-making. This includes:
            </p>
            <ul style={{ 
              margin: 0, 
              paddingLeft: "1.5em", 
              fontSize: "0.95em", 
              lineHeight: 1.8,
              color: "#4b5563" 
            }}>
              <li>Board members and directors</li>
              <li>Executive officers (CEO, CFO, COO, etc.)</li>
              <li>Other senior management with significant authority</li>
            </ul>
          </div>

          <div className="button-group-vertical">
            <button onClick={handleContinue} className="btn btn-primary btn-large">
              Continue
            </button>
            <button onClick={handleBack} className="btn btn-secondary btn-large">
              Add owners instead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransitionToDirectors;

