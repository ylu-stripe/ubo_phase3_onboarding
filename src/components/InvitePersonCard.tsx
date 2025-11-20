import React from "react";

interface InvitePersonCardProps {
  personName: string;
  onSendEmail: () => void;
}

export const InvitePersonCard: React.FC<InvitePersonCardProps> = ({ personName, onSendEmail }) => {
  return (
    <div style={{ 
      backgroundColor: "#f3f4f6", 
      padding: "1.5em", 
      borderRadius: "8px",
      marginTop: "2em"
    }}>
      <h3 style={{ 
        fontSize: "1em", 
        fontWeight: 600, 
        margin: "0 0 0.5em 0",
        color: "#1f2937"
      }}>
        Invite {personName} to submit details
      </h3>
      <p style={{ 
        fontSize: "0.95em", 
        color: "#6b7280", 
        margin: "0 0 1em 0",
        lineHeight: 1.5
      }}>
        Send a link so they can complete and submit the information themselves.
      </p>
      <button 
        onClick={onSendEmail} 
        className="btn btn-secondary"
        style={{ width: "100%" }}
      >
        Send email invite
      </button>
    </div>
  );
};

export default InvitePersonCard;

