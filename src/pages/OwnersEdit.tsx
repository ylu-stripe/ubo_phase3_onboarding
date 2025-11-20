import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { v4 as uuidv4 } from "uuid";
import type { Person } from "../store/types";
import OnboardingNav from "../components/OnboardingNav";
import OnboardingSidebar from "../components/OnboardingSidebar";

export const OwnersEdit: React.FC = () => {
  const navigate = useNavigate();
  const owners = useAppStore(state => state.owners);
  const addPerson = useAppStore(state => state.addPerson);
  const removePerson = useAppStore(state => state.removePerson);
  const deletePerson = useAppStore(state => state.deletePerson);
  const undoRemovePerson = useAppStore(state => state.undoRemovePerson);
  const confirmOwners = useAppStore(state => state.confirmOwners);

  const activeOwners = owners.filter(o => !o.removed);
  const removedOwners = owners.filter(o => o.removed);

  const handleAddOwner = () => {
    // Create a new owner with temporary data and navigate to the form
    const newOwner: Person = {
      id: uuidv4(),
      role: "owner",
      name: "",
      status: "missing",
      origin: "user_added",
    };
    addPerson(newOwner);
    navigate(`/owners/${newOwner.id}?returnTo=edit`);
  };

  const handleRemove = (id: string, origin: "prefill" | "user_added") => {
    // User-added people should be completely deleted, not just marked as removed
    if (origin === "user_added") {
      deletePerson(id, "owner");
    } else {
      removePerson(id, "owner");
    }
  };

  const handleUndo = (id: string) => {
    undoRemovePerson(id, "owner");
  };

  const handleContinue = () => {
    // Mark owners as confirmed
    confirmOwners();
    
    // If no active owners, go to transition page
    if (activeOwners.length === 0) {
      navigate("/transition-to-directors");
      return;
    }
    
    // Check if all owners already have complete information
    const allComplete = activeOwners.every(o => o.status === "complete" || o.status === "pending_email");
    
    if (allComplete) {
      // Skip OwnersList page and check if attestation is needed
      const config = useAppStore.getState().config;
      const setAttestation = useAppStore.getState().setAttestation;
      
      const currentIds = activeOwners.map(o => o.id);
      
      const removed = config.prefillOwners
        .filter(o => !currentIds.includes(o.id))
        .map(o => o.name);
      
      const hasChanges = removed.length > 0;
      
      if (hasChanges) {
        // Store the diff for later use (only removed owners matter)
        const finalOwnersList = activeOwners.map(o => o.name);
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
    } else {
      // Some owners need information, go to OwnersList
      navigate("/owners");
    }
  };

  return (
    <div className="layout-with-sidebar">
      <OnboardingSidebar currentStep="business-owners" />
      <div className="main-content-with-sidebar">
        <OnboardingNav onBack={() => navigate("/owners/prefill")} />
        <div className="page-content">
          <div className="page-header">
            <h1 className="page-title">Edit beneficial owners</h1>
            <p className="page-description">
            Update this list to include all individuals with more than 25% ownership or control of a business, directly or indirectly. 
            </p>
          </div>

          {/* Active Owners List */}
          <div className="section">
            <h3 style={{ fontSize: "1.1em", fontWeight: 600, marginBottom: "1em", color: "#1f2937" }}>
              Beneficial owners {activeOwners.length > 0 && `(${activeOwners.length})`}
            </h3>
            
            <div style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "20px",
            //   backgroundColor: "#fafafa"           // commented out to remove background color
            }}>
              {activeOwners.length === 0 ? (
                <p style={{ 
                  color: "#6b7280", 
                  fontSize: "0.95em",
                  margin: "0 0 0.5em 0",
                  textAlign: "center",
                  padding: "2em 1em",
                  lineHeight: 1.6
                }}>
                  There are no beneficial owners. Confirm that this is correct or add new owners.
                </p>
              ) : (
                <div style={{ marginBottom: "1em" }}>
                  {activeOwners.map((owner, index) => (
                    <div key={owner.id} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px",
                      fontSize: "14px",
                      backgroundColor: "white",
                      borderRadius: "6px",
                      marginBottom: index < activeOwners.length - 1 ? "0.5em" : 0,
                      border: "1px solid #e5e7eb"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1em", flex: 1 }}>
                        <span style={{ fontWeight: 500, fontSize: "1em" }}>{owner.name}</span>
                        {owner.status === "missing" && (
                          <span style={{
                            backgroundColor: "#fef3c7",
                            color: "#92400e",
                            padding: "0.25em 6px",
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
                      onClick={() => handleRemove(owner.id, owner.origin)}
                      className="btn btn-secondary btn-small"
                    >
                      Remove
                    </button>
                        <button 
                          onClick={() => navigate(`/owners/${owner.id}?returnTo=edit`)}
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
                onClick={handleAddOwner}
                className="btn btn-secondary btn-small"
                style={{ width: "100%" }}
              >
                Add owner
              </button>
            </div>
          </div>

          {/* Removed Owners */}
          {removedOwners.length > 0 && (
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
                Removing an expected owner requires a signed attestation or other documents confirming the remaining owners.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {removedOwners.map(owner => (
                  <div key={owner.id} style={{
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
                      {owner.name}
                    </span>
                    <button 
                      onClick={() => handleUndo(owner.id)}
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
            >
              Continue
            </button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default OwnersEdit;

