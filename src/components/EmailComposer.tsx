import React, { useState } from "react";

interface EmailComposerProps {
  personName: string;
  onSend: (email: string, message: string) => void;
  onCancel: () => void;
}

export const EmailComposer: React.FC<EmailComposerProps> = ({ personName, onSend, onCancel }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    `Dear ${personName},\n\nWe need to collect some additional information from you for verification purposes. Please provide your address and phone number.\n\nThank you.`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter an email address");
      return;
    }
    onSend(email, message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Email Address:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            required
            style={{ width: "100%", maxWidth: "500px" }}
          />
        </label>
      </div>
      <div>
        <label>
          Message:
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={8}
            style={{ width: "100%", maxWidth: "500px" }}
          />
        </label>
      </div>
      <div style={{ marginTop: "1.5em" }}>
        <button type="submit" style={{ marginRight: "1em" }}>
          Send Email
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EmailComposer;


