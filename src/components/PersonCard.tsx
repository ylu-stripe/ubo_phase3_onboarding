import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Person } from "../store/types";

interface PersonCardProps {
  person: Person;
}

export const PersonCard: React.FC<PersonCardProps> = ({ person }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleProvideDetails = () => {
    navigate(`/${person.role}s/${person.id}?returnTo=list`);
  };

  const handleResendEmail = () => {
    navigate(`/${person.role}s/${person.id}/email?returnTo=list`);
    setShowMenu(false);
  };

  const getButtonText = () => {
    return "Start";
  };

  const getMenuActionText = () => {
    if (person.status === "complete") {
      return "Update information";
    }
    return "Provide information";
  };

  const renderStatusBadge = () => {
    if (person.status === "complete") {
      return <span className="status-badge status-complete">Complete</span>;
    }
    if (person.status === "pending_email") {
      return <span className="status-badge" style={{ backgroundColor: "#fef3c7", color: "#92400e" }}>In progress</span>;
    }
    return null;
  };

  return (
    <div className="card" style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center",
      padding: "1em 1.25em"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75em" }}>
        <span className="person-name" style={{ margin: 0, fontWeight: 500 }}>
          {person.name}
        </span>
        {renderStatusBadge()}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
        {person.status !== "missing" && (
          <div style={{ position: "relative" }}>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="btn"
              style={{ 
                padding: "0.5em",
                fontSize: "1.2em",
                minWidth: "auto",
                backgroundColor: "transparent",
                border: "none",
                color: "#6b7280"
              }}
            >
              •••
            </button>
            {showMenu && (
              <div style={{
                position: "absolute",
                right: 0,
                top: "100%",
                marginTop: "0.25em",
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                minWidth: "200px",
                zIndex: 10
              }}>
                {person.status === "pending_email" && (
                  <button
                    onClick={handleResendEmail}
                    style={{
                      width: "100%",
                      padding: "0.75em 1em",
                      textAlign: "left",
                      border: "none",
                      backgroundColor: "transparent",
                      cursor: "pointer",
                      fontSize: "0.95em"
                    }}
                  >
                    Resend email link
                  </button>
                )}
                <button
                  onClick={() => {
                    handleProvideDetails();
                    setShowMenu(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "0.75em 1em",
                    textAlign: "left",
                    border: "none",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    fontSize: "0.95em"
                  }}
                >
                  {getMenuActionText()}
                </button>
              </div>
            )}
          </div>
        )}
        {person.status === "missing" && (
          <button onClick={handleProvideDetails} className="btn btn-primary" style={{ padding: "0.5em 1.5em" }}>
            {getButtonText()}
          </button>
        )}
      </div>
    </div>
  );
};

export default PersonCard;

