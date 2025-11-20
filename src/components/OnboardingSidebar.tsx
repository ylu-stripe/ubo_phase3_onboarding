import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

interface OnboardingSidebarProps {
  currentStep?: "business-owners" | "summary";
}

export const OnboardingSidebar: React.FC<OnboardingSidebarProps> = ({ currentStep = "business-owners" }) => {
  const navigate = useNavigate();
  const config = useAppStore(state => state.config);
  const ownersConfirmed = useAppStore(state => state.ownersConfirmed);
  const directorsConfirmed = useAppStore(state => state.directorsConfirmed);
  const directors = useAppStore(state => state.directors.filter(d => !d.removed));
  
  const handleBusinessOwnersClick = () => {
    // Navigate based on whether we're in directors-only path or owners path
    if (config.directorsFound && !config.ownersFound) {
      // Directors-only path
      if (directorsConfirmed) {
        navigate("/directors/edit");
      } else {
        navigate("/directors/prefill");
      }
    } else {
      // Owners path (or both owners and directors)
      if (ownersConfirmed) {
        navigate("/owners/edit");
      } else if (config.ownersFound) {
        navigate("/owners/prefill");
      } else {
        navigate("/owners/edit");
      }
    }
  };
  
  return (
    <div className="onboarding-sidebar">
      <div className="sidebar-step-wrapper">
        <div className="sidebar-step active">
          <div className="step-indicator">
            <div className="step-number">1</div>
          </div>
          <div className="step-content">
            <div className="step-title">Verify your business</div>
            <div className="step-substeps">
              <div className="substep">Business type</div>
              <div className="substep">Business details</div>
              <div className="substep">Business representative</div>
              <div 
                className={`substep ${currentStep === "business-owners" ? "active" : ""}`}
                onClick={handleBusinessOwnersClick}
                style={{ cursor: "pointer" }}
              >
                Business owners
              </div>
              <div className="substep">Public details</div>
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar-step-wrapper">
        <div className="sidebar-step">
          <div className="step-indicator">
            <div className="step-number">2</div>
          </div>
          <div className="step-content">
            <div className="step-title">Add your bank</div>
          </div>
        </div>
      </div>

      <div className="sidebar-step-wrapper">
        <div className="sidebar-step">
          <div className="step-indicator">
            <div className="step-number">3</div>
          </div>
          <div className="step-content">
            <div className="step-title">Secure your account</div>
          </div>
        </div>
      </div>

      <div className="sidebar-step-wrapper">
        <div className="sidebar-step">
          <div className="step-indicator">
            <div className="step-number">4</div>
          </div>
          <div className="step-content">
            <div className="step-title">Add extras</div>
          </div>
        </div>
      </div>

      <div className="sidebar-step-wrapper">
        <div 
          className={`sidebar-step ${currentStep === "summary" ? "active" : ""}`}
          onClick={() => navigate("/summary")}
          style={{ cursor: "pointer" }}
        >
          <div className="step-indicator">
            <div className="step-number">5</div>
          </div>
          <div className="step-content">
            <div className="step-title">Review and finish</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSidebar;

