import React, { useState } from "react";
import type { Person } from "../store/types";

interface PersonFormProps {
  person: Person;
  onSave: (address: string, dateOfBirth: string, name?: string) => void;
  onCancel: () => void;
}

export const PersonForm: React.FC<PersonFormProps> = ({ person, onSave, onCancel }) => {
  const [name, setName] = useState(person.name || "");
  const [address, setAddress] = useState(person.address || "");
  const [dateOfBirth, setDateOfBirth] = useState(person.dateOfBirth || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(address, dateOfBirth, person.origin === "user_added" ? name : undefined);
  };

  const isValid = address.trim() !== "" && dateOfBirth.trim() !== "" && (person.origin === "prefill" || name.trim() !== "");

  const isPrefilled = person.origin === "prefill";

  return (
    <form onSubmit={handleSubmit}>
      {/* Name field - readonly for prefilled, editable for user-added */}
      <div className="form-group">
        <label className="form-label">
          Full name
        </label>
        {isPrefilled ? (
          <>
            <div style={{
              padding: "0.75em",
              fontSize: "1em",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              backgroundColor: "#f9fafb",
              color: "#6b7280",
              maxWidth: "500px"
            }}>
              {person.name}
            </div>
            <p style={{
              fontSize: "0.875em",
              color: "#6b7280",
              marginTop: "0.5em",
              lineHeight: 1.5
            }}>
              We found this name in public records. If it's incorrect, please remove this owner from the list and add a new one. 
            </p>
          </>
        ) : (
          <input
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter full name"
            required
          />
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          Address
        </label>
        <input
          type="text"
          className="form-input"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address"
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">
          Date of birth
        </label>
        <input
          type="date"
          className="form-input"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          required
        />
      </div>
      <div className="button-group-vertical" style={{ marginTop: "2em" }}>
        <button type="submit" className="btn btn-primary btn-large" disabled={!isValid}>
          Save
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary btn-large">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PersonForm;

