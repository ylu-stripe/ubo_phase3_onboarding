import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import PersonCard from "../components/PersonCard";
import OnboardingNav from "../components/OnboardingNav";
import OnboardingSidebar from "../components/OnboardingSidebar";

export const DirectorsList: React.FC = () => {
  const navigate = useNavigate();
  const directors = useAppStore(state => state.directors.filter(d => !d.removed));
  const confirmDirectors = useAppStore(state => state.confirmDirectors);

  const allComplete = directors.every(d => d.status === "complete" || d.status === "pending_email");

  const handleContinue = () => {
    // Mark directors as confirmed
    confirmDirectors();
    
    // Check if attestation needed - only if directors were removed from prefill
    const config = useAppStore.getState().config;
    const setAttestation = useAppStore.getState().setAttestation;
    const attestation = useAppStore.getState().attestation;
    
    const currentDirectorIds = directors.map(d => d.id);
    
    const removedDirectors = config.prefillDirectors
      .filter(d => !currentDirectorIds.includes(d.id))
      .map(d => d.name);
    
    // If directors were removed, add them to the existing attestation
    if (removedDirectors.length > 0) {
      const existingRemoved = attestation?.diff?.removed || [];
      const allRemoved = [...existingRemoved, ...removedDirectors];
      
      // Get final lists
      const owners = useAppStore.getState().owners.filter(o => !o.removed);
      const finalOwnersList = owners.map(o => o.name);
      const finalDirectorsList = directors.map(d => d.name);
      
      // Determine context
      const hasOwnerChanges = existingRemoved.length > 0;
      const context = hasOwnerChanges ? "both" : "directors";
      const finalList = hasOwnerChanges ? [...finalOwnersList, ...finalDirectorsList] : finalDirectorsList;
      
      setAttestation({
        required: true,
        diff: { removed: allRemoved, added: [], edited: [] },
        context,
        finalList
      });
      // Go to verification method selection page
      navigate("/verification-method");
    } else {
      // No directors removed, go to summary
      // (attestation for owners would have already been handled in the owners flow)
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
            We need some additional information. Add each director's address and date of birth.
          </p>
        </div>

        <div className="section">
          <h3 style={{ fontSize: "1em", fontWeight: 600, marginBottom: "1em", color: "#1f2937" }}>
            Directors
          </h3>
          {directors.map(director => (
            <PersonCard key={director.id} person={director} />
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

export default DirectorsList;

