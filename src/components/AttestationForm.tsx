import React, { useState } from "react";

interface AttestationFormProps {
  onSubmit: (signerName: string) => void;
  onCancel: () => void;
}

export const AttestationForm: React.FC<AttestationFormProps> = ({ onSubmit, onCancel }) => {
  const [signerName, setSignerName] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signerName || !confirmed) {
      alert("Please provide your name and confirm the attestation");
      return;
    }
    onSubmit(signerName);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "2em" }}>
      <div>
        <label>
          Your Full Name:
          <input
            type="text"
            value={signerName}
            onChange={(e) => setSignerName(e.target.value)}
            placeholder="Enter your full name"
            required
            style={{ width: "100%", maxWidth: "500px" }}
          />
        </label>
      </div>
      <div style={{ marginTop: "1em" }}>
        <label style={{ display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            required
            style={{ marginRight: "0.5em" }}
          />
          I attest that the information provided is accurate and complete to the best of my knowledge.
        </label>
      </div>
      <div style={{ marginTop: "1.5em" }}>
        <button type="submit" disabled={!signerName || !confirmed} style={{ marginRight: "1em" }}>
          Confirm Attestation
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AttestationForm;


