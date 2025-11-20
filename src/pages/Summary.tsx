import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import OnboardingNav from "../components/OnboardingNav";
import OnboardingSidebar from "../components/OnboardingSidebar";

export const Summary: React.FC = () => {
  const navigate = useNavigate();
  const owners = useAppStore(state => state.owners.filter(o => !o.removed));
  const directors = useAppStore(state => state.directors.filter(d => !d.removed));
  const config = useAppStore(state => state.config);
  const ownersConfirmed = useAppStore(state => state.ownersConfirmed);
  const directorsConfirmed = useAppStore(state => state.directorsConfirmed);
  const attestation = useAppStore(state => state.attestation);

  const handleSubmit = () => {
    alert("Verification submitted successfully!");
    navigate("/config");
  };

  const handleEditPerson = (person: typeof owners[0]) => {
    // Navigate directly to the person's details page
    if (person.role === "owner") {
      navigate(`/owners/${person.id}?returnTo=list`);
    } else {
      navigate(`/directors/${person.id}?returnTo=list`);
    }
  };

  const handleConfirmBusinessOwnership = () => {
    // If attestation is incomplete OR there are removed prefilled people, go to verification method
    if (attestationIncomplete || removedOwners.length > 0 || removedDirectors.length > 0) {
      navigate("/verification-method");
    }
    // For directors-only path, go to directors flow
    else if (config.directorsFound && !config.ownersFound) {
      if (config.directorsFound) {
        navigate("/directors/prefill");
      } else {
        navigate("/directors/edit");
      }
    }
    // Otherwise start with owners flow
    else if (config.ownersFound) {
      navigate("/owners/prefill");
    } else {
      navigate("/owners/edit");
    }
  };

  const handleConfirmDirectors = () => {
    if (config.directorsFound) {
      navigate("/directors/prefill");
    } else {
      navigate("/directors/edit");
    }
  };

  // Show business ownership incomplete if:
  // For directors-only path: directors haven't been confirmed OR attestation incomplete OR removed directors
  // For owners path: owners haven't been confirmed OR attestation incomplete OR removed owners
  const attestationIncomplete = attestation?.required && !attestation?.signerName;
  const removedOwners = useAppStore(state => state.owners.filter(o => o.removed && o.origin === "prefill"));
  const removedDirectors = useAppStore(state => state.directors.filter(d => d.removed && d.origin === "prefill"));
  
  const showBusinessOwnershipIncomplete = config.directorsFound && !config.ownersFound
    ? (!directorsConfirmed || attestationIncomplete || removedDirectors.length > 0)
    : (!ownersConfirmed || attestationIncomplete || removedOwners.length > 0);
  
  // Directors requirement only shows if:
  // 1. There are NO active beneficial owners (all removed or none found), AND
  // 2. Directors haven't been confirmed yet
  // This covers: directors-only path OR transition from owners to directors after removing all owners
  const hasActiveOwners = owners.length > 0 && ownersConfirmed;
  const showDirectorsIncomplete = !hasActiveOwners && !directorsConfirmed && directors.length > 0;

  // Show all people if confirmed, or empty if not
  const confirmedOwners = ownersConfirmed ? owners : [];
  const confirmedDirectors = directorsConfirmed ? directors : [];
  const allPeople = [...confirmedOwners, ...confirmedDirectors];
  
  // Check if any people have missing information
  const peopleWithMissingInfo = allPeople.filter(p => p.status === "missing");

  return (
    <div className="layout-with-sidebar">
      <OnboardingSidebar currentStep="summary" />
      <div className="main-content-with-sidebar">
        <OnboardingNav />
        <div className="page-content">
          <div className="page-header">
            <h1 className="page-title">Review and submit</h1>
          </div>

          {/* Placeholder sections */}
          <div style={{ marginBottom: "2em" }}>
            <h3 style={{ fontSize: "1em", fontWeight: 600, marginBottom: "1em", color: "#1f2937" }}>
              Section
            </h3>
            <div style={{
              backgroundColor: "#f9fafb",
              padding: "1.5em",
              borderRadius: "8px",
              border: "1px solid #e5e7eb"
            }}>
              <div style={{ height: "1em", backgroundColor: "#e5e7eb", borderRadius: "4px", marginBottom: "0.75em", width: "70%" }}></div>
              <div style={{ height: "1em", backgroundColor: "#e5e7eb", borderRadius: "4px", width: "50%" }}></div>
            </div>
          </div>

          <div style={{ marginBottom: "2em" }}>
            <h3 style={{ fontSize: "1em", fontWeight: 600, marginBottom: "1em", color: "#1f2937" }}>
              Section
            </h3>
            <div style={{
              backgroundColor: "#f9fafb",
              padding: "1.5em",
              borderRadius: "8px",
              border: "1px solid #e5e7eb"
            }}>
              <div style={{ height: "1em", backgroundColor: "#e5e7eb", borderRadius: "4px", marginBottom: "0.75em", width: "70%" }}></div>
              <div style={{ height: "1em", backgroundColor: "#e5e7eb", borderRadius: "4px", width: "50%" }}></div>
            </div>
          </div>

          {/* Management and Ownership */}
          <div style={{ marginBottom: "2em" }}>
            <h3 style={{ fontSize: "1em", fontWeight: 600, marginBottom: "1em", color: "#1f2937" }}>
              Management and Ownership
            </h3>
            
            {/* Incomplete requirement for business ownership */}
            {showBusinessOwnershipIncomplete && (
              <div style={{
                backgroundColor: "#fff7ed",
                padding: "1.25em",
                borderRadius: "8px",
                border: "1px solid #fed7aa",
                marginBottom: "1em",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75em" }}>
                  <span style={{ fontWeight: 500, fontSize: "1em" }}>Business ownership</span>
                  <span style={{
                    backgroundColor: "#fef3c7",
                    color: "#92400e",
                    padding: "0.25em 0.75em",
                    borderRadius: "4px",
                    fontSize: "0.85em",
                    fontWeight: 500
                  }}>
                    Incomplete
                  </span>
                </div>
                <button 
                  onClick={handleConfirmBusinessOwnership}
                  className="btn btn-primary"
                  style={{ padding: "0.5em 1.25em" }}
                >
                  Complete
                </button>
              </div>
            )}
            
            {/* Incomplete requirement for directors (only if explicitly in directors flow) */}
            {showDirectorsIncomplete && (
              <div style={{
                backgroundColor: "#fff7ed",
                padding: "1.25em",
                borderRadius: "8px",
                border: "1px solid #fed7aa",
                marginBottom: "1em",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75em" }}>
                  <span style={{ fontWeight: 500, fontSize: "1em" }}>Directors</span>
                  <span style={{
                    backgroundColor: "#fef3c7",
                    color: "#92400e",
                    padding: "0.25em 0.75em",
                    borderRadius: "4px",
                    fontSize: "0.85em",
                    fontWeight: 500
                  }}>
                    Incomplete
                  </span>
                </div>
                <button 
                  onClick={handleConfirmDirectors}
                  className="btn btn-primary"
                  style={{ padding: "0.5em 1.25em" }}
                >
                  Complete
                </button>
              </div>
            )}
            
            {/* Confirmed people */}
            {allPeople.map(person => (
              <div key={person.id} style={{
                backgroundColor: person.status === "missing" ? "#fff7ed" : "#f9fafb",
                padding: "1.25em",
                borderRadius: "8px",
                border: person.status === "missing" ? "1px solid #fed7aa" : "1px solid #e5e7eb",
                marginBottom: "1em",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start"
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75em", marginBottom: "0.75em" }}>
                    <div style={{ fontWeight: 600, fontSize: "1em" }}>
                      {person.name}
                    </div>
                    {person.status === "missing" && (
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
                    {person.status === "pending_email" && (
                      <span style={{
                        backgroundColor: "#fef3c7",
                        color: "#92400e",
                        padding: "0.25em 0.75em",
                        borderRadius: "4px",
                        fontSize: "0.85em",
                        fontWeight: 500
                      }}>
                        In progress
                      </span>
                    )}
                    {person.status === "complete" && (
                      <span style={{
                        backgroundColor: "#d1fae5",
                        color: "#065f46",
                        padding: "0.25em 0.75em",
                        borderRadius: "4px",
                        fontSize: "0.85em",
                        fontWeight: 500
                      }}>
                        Complete
                      </span>
                    )}
                  </div>
                  {person.status === "complete" && (
                    <>
                      <div style={{ height: "1em", backgroundColor: "#e5e7eb", borderRadius: "4px", marginBottom: "0.5em", width: "200px" }}></div>
                      <div style={{ height: "1em", backgroundColor: "#e5e7eb", borderRadius: "4px", width: "150px" }}></div>
                    </>
                  )}
                </div>
                <button 
                  onClick={() => handleEditPerson(person)}
                  className="btn btn-secondary btn-small"
                >
                  {person.status === "missing" ? "Complete" : "Edit"}
                </button>
              </div>
            ))}
          </div>

          <div className="button-group-vertical">
            <button onClick={handleSubmit} className="btn btn-primary btn-large">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;

