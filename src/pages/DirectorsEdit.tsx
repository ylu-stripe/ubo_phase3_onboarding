import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { v4 as uuidv4 } from "uuid";
import type { Person } from "../store/types";
import OnboardingNav from "../components/OnboardingNav";
import OnboardingSidebar from "../components/OnboardingSidebar";

export const DirectorsEdit: React.FC = () => {
  const navigate = useNavigate();
  const directors = useAppStore(state => state.directors);
  const addPerson = useAppStore(state => state.addPerson);
  const removePerson = useAppStore(state => state.removePerson);
  const deletePerson = useAppStore(state => state.deletePerson);
  const undoRemovePerson = useAppStore(state => state.undoRemovePerson);
  const confirmDirectors = useAppStore(state => state.confirmDirectors);

  const activeDirectors = directors.filter(d => !d.removed);
  const removedDirectors = directors.filter(d => d.removed);

  const handleAddDirector = () => {
    // Create a new director with temporary data and navigate to the form
    const newDirector: Person = {
      id: uuidv4(),
      role: "director",
      name: "",
      status: "missing",
      origin: "user_added",
    };
    addPerson(newDirector);
    navigate(`/directors/${newDirector.id}?returnTo=edit`);
  };

  const handleRemove = (id: string, origin: "prefill" | "user_added") => {
    // User-added people should be completely deleted, not just marked as removed
    if (origin === "user_added") {
      deletePerson(id, "director");
    } else {
      removePerson(id, "director");
    }
  };

  const handleUndo = (id: string) => {
    undoRemovePerson(id, "director");
  };

  const handleContinue = () => {
    if (activeDirectors.length === 0) {
      alert("You must have at least one director.");
      return;
    }
    
    // Mark directors as confirmed
    confirmDirectors();
    
    // Check if all directors already have complete information
    const allComplete = activeDirectors.every(d => d.status === "complete" || d.status === "pending_email");
    
    if (allComplete) {
      // Skip DirectorsList page and check if attestation is needed
      const config = useAppStore.getState().config;
      const setAttestation = useAppStore.getState().setAttestation;
      const attestation = useAppStore.getState().attestation;
      
      const currentDirectorIds = activeDirectors.map(d => d.id);
      
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
        const finalDirectorsList = activeDirectors.map(d => d.name);
        
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
        navigate("/summary");
      }
    } else {
      // Some directors need information, go to DirectorsList
      navigate("/directors");
    }
  };

  return (
    <div className="layout-with-sidebar">
      <OnboardingSidebar currentStep="business-owners" />
      <div className="main-content-with-sidebar">
        <OnboardingNav onBack={() => navigate("/directors/prefill")} />
        <div className="page-content">
          <div className="page-header">
            <h1 className="page-title">Edit directors</h1>
            <p className="page-description">
            Update this list to include all senior directors or executives who significantly influence your organization. 
            </p>
          </div>

          {/* Active Directors List */}
          <div className="section">
            <h3 style={{ fontSize: "1.1em", fontWeight: 600, marginBottom: "1em", color: "#1f2937" }}>
              Directors {activeDirectors.length > 0 && `(${activeDirectors.length})`}
            </h3>
            
            <div style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "20px",
            //   backgroundColor: "#fafafa"           // commented out to remove background color
            }}>
              {activeDirectors.length === 0 ? (
                <p style={{ 
                  color: "#6b7280", 
                  fontSize: "0.95em",
                  margin: "0 0 1.5em 0",
                  textAlign: "center",
                  padding: "2em 1em",
                  lineHeight: 1.6
                }}>
                  There are no directors. Add at least one director to continue.
                </p>
              ) : (
                <div style={{ marginBottom: "1.5em" }}>
                  {activeDirectors.map((director, index) => (
                    <div key={director.id} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px",
                      fontSize: "14px",
                      backgroundColor: "white",
                      borderRadius: "6px",
                      marginBottom: index < activeDirectors.length - 1 ? "0.75em" : 0,
                      border: "1px solid #e5e7eb"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1em", flex: 1 }}>
                        <span style={{ fontWeight: 500, fontSize: "1em" }}>{director.name}</span>
                        {director.status === "missing" && (
                          <span style={{
                            backgroundColor: "#fef3c7",
                            color: "#92400e",
                            padding: "0.25em 0.75em",
                            borderRadius: "4px",
                            fontSize: "0.85em",
                            fontWeight: 500
                          }}>
                            Needs information
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: "0.5em" }}>
                    <button 
                      onClick={() => handleRemove(director.id, director.origin)}
                      className="btn btn-secondary btn-small"
                    >
                      Remove
                    </button>
                        <button 
                          onClick={() => navigate(`/directors/${director.id}?returnTo=edit`)}
                          className="btn btn-secondary btn-small"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button 
                onClick={handleAddDirector}
                className="btn btn-secondary btn-small"
                style={{ width: "100%" }}
              >
                Add director
              </button>
            </div>
          </div>

          {/* Removed Directors */}
          {removedDirectors.length > 0 && (
            <div className="section" style={{ marginTop: "2em" }}>
              <h3 style={{ fontSize: "1em", fontWeight: 600, marginBottom: "0.5em", color: "#6b7280" }}>
                Removed
              </h3>
              <p style={{ 
                fontSize: "0.875em", 
                color: "#6b7280", 
                marginBottom: "1em",
                lineHeight: 1.5
              }}>
                Removing an expected director requires a signed attestation or other documents confirming the remaining directors.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {removedDirectors.map(director => (
                  <div key={director.id} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    backgroundColor: "#f9fafb",
                    borderRadius: "6px",
                    border: "1px solid #e5e7eb"
                  }}>
                    <span style={{ 
                      fontSize: "14px",
                      color: "#6b7280"
                    }}>
                      {director.name}
                    </span>
                    <button 
                      onClick={() => handleUndo(director.id)}
                      className="btn btn-secondary btn-small"
                    >
                      Undo
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="button-group-vertical" style={{ marginTop: "2em" }}>
            <button 
              onClick={handleContinue} 
              className="btn btn-primary btn-large"
              disabled={activeDirectors.length === 0}
              title={activeDirectors.length === 0 ? "You must have at least one director" : ""}
            >
              Continue
            </button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default DirectorsEdit;

