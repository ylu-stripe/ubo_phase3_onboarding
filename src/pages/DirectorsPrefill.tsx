import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import OnboardingNav from "../components/OnboardingNav";
import OnboardingSidebar from "../components/OnboardingSidebar";

export const DirectorsPrefill: React.FC = () => {
  const navigate = useNavigate();
  const directors = useAppStore(state => state.directors);
  const confirmDirectors = useAppStore(state => state.confirmDirectors);

  const handleConfirm = () => {
    confirmDirectors();
    navigate("/directors");
  };

  const handleEdit = () => {
    navigate("/directors/edit");
  };

  return (
    <div className="layout-with-sidebar">
      <OnboardingSidebar currentStep="business-owners" />
      <div className="main-content-with-sidebar">
        <OnboardingNav onBack={() => navigate("/config")} />
        <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Confirm your directors</h1>
          <p className="page-description">
            These appear to be your directors, based on public records.{" "}
            <a href="#" style={{ color: "#6366f1", textDecoration: "none" }}>View support article</a>
          </p>
        </div>

        <div className="info-box">
          <h3 className="info-box-title">Who is a director?</h3>
          <p className="info-box-text">
            Directors are individuals who manage the company's business and affairs.
          </p>
        </div>

        <div className="section">
          <p style={{ color: "#6b7280", fontSize: "0.9em", marginBottom: "1em" }}>
            Suggestions based on public records
          </p>
          <div className="card-list">
            {directors.map(director => (
              <div key={director.id} className="person-item">
                <span className="person-name">{director.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "2em" }}>
          <p style={{ 
            fontSize: "0.95em", 
            color: "#1f2937", 
            marginBottom: "0.75em",
            lineHeight: 1.6
          }}>
            To ensure compliance with AML laws, by confirming you are attesting that directors listed are accurate and your business has no <span style={{ textDecoration: "underline" }}>beneficial owners</span>.
          </p>
          <p style={{ 
            fontSize: "0.95em", 
            color: "#6b7280",
            lineHeight: 1.6
          }}>
            If this is incorrect,{" "}
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                navigate("/owners/edit");
              }}
              style={{ color: "#6366f1", textDecoration: "none" }}
            >
              add beneficial owners instead
            </a>.
          </p>
        </div>

        <div className="button-group-vertical">
          <button onClick={handleConfirm} className="btn btn-primary btn-large">
            Confirm
          </button>
          <button onClick={handleEdit} className="btn btn-secondary btn-large">
            No, edit directors
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default DirectorsPrefill;

