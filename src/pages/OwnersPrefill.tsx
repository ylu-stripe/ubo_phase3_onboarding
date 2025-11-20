import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import OnboardingNav from "../components/OnboardingNav";
import OnboardingSidebar from "../components/OnboardingSidebar";

export const OwnersPrefill: React.FC = () => {
  const navigate = useNavigate();
  const owners = useAppStore(state => state.owners);
  const confirmOwners = useAppStore(state => state.confirmOwners);

  const handleConfirm = () => {
    confirmOwners();
    navigate("/owners");
  };

  const handleEdit = () => {
    navigate("/owners/edit");
  };

  return (
    <div className="layout-with-sidebar">
      <OnboardingSidebar currentStep="business-owners" />
      <div className="main-content-with-sidebar">
        <OnboardingNav onBack={() => navigate("/config")} />
        <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Confirm your beneficial owners</h1>
          <p className="page-description">
            These appear to be your beneficial owners, based on public records.{" "}
            <a href="#" style={{ color: "#6366f1", textDecoration: "none" }}>View support article</a>
          </p>
        </div>

        <div className="info-box">
          <h3 className="info-box-title">Who is a beneficial owner?</h3>
          <p className="info-box-text">
            Beneficial owners are individuals who directly or indirectly own more than 25% of the company.
          </p>
        </div>

        <div className="section">
          <p style={{ color: "#6b7280", fontSize: "0.9em", marginBottom: "1em" }}>
            Suggestions based on public records
          </p>
          <div className="card-list">
            {owners.map(owner => (
              <div key={owner.id} className="person-item">
                <span className="person-name">{owner.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="button-group-vertical">
          <button onClick={handleConfirm} className="btn btn-primary btn-large">
            Confirm
          </button>
          <button onClick={handleEdit} className="btn btn-secondary btn-large">
            Edit owners
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default OwnersPrefill;

