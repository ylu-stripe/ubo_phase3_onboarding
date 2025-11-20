import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import PersonCard from "../components/PersonCard";
import OnboardingNav from "../components/OnboardingNav";
import OnboardingSidebar from "../components/OnboardingSidebar";

export const OwnersList: React.FC = () => {
  const navigate = useNavigate();
  const owners = useAppStore(state => state.owners.filter(o => !o.removed));
  const confirmOwners = useAppStore(state => state.confirmOwners);

  const allComplete = owners.every(o => o.status === "complete" || o.status === "pending_email");

  const handleContinue = () => {
    // Mark owners as confirmed
    confirmOwners();
    
    // Check if attestation needed - only if owners were removed from prefill
    const config = useAppStore.getState().config;
    const setAttestation = useAppStore.getState().setAttestation;
    
    const currentIds = owners.map(o => o.id);
    
    const removed = config.prefillOwners
      .filter(o => !currentIds.includes(o.id))
      .map(o => o.name);
    
    const hasChanges = removed.length > 0;
    
    if (hasChanges) {
      // Store the diff for later use (only removed owners matter)
      const finalOwnersList = owners.map(o => o.name);
      setAttestation({
        required: true,
        diff: { removed, added: [], edited: [] },
        context: "owners",
        finalList: finalOwnersList
      });
      // Go to verification method selection page
      navigate("/verification-method");
    } else {
      navigate("/summary");
    }
  };

  return (
    <div className="layout-with-sidebar">
      <OnboardingSidebar currentStep="business-owners" />
      <div className="main-content-with-sidebar">
        <OnboardingNav />
        <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Provide additional information</h1>
          <p className="page-description">
            We need some additional information. Add each beneficial owner's address and date of birth.
          </p>
        </div>

        <div className="section">
          <h3 style={{ fontSize: "1em", fontWeight: 600, marginBottom: "1em", color: "#1f2937" }}>
            Beneficial owners
          </h3>
          {owners.map(owner => (
            <PersonCard key={owner.id} person={owner} />
          ))}
        </div>

        <div className="button-group-vertical">
          <button 
            onClick={handleContinue} 
            disabled={!allComplete}
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

export default OwnersList;

