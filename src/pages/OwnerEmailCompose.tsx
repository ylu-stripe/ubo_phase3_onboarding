import React, { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import OnboardingNav from "../components/OnboardingNav";
import OnboardingSidebar from "../components/OnboardingSidebar";
import Toast from "../components/Toast";

export const OwnerEmailCompose: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "list";
  
  const owners = useAppStore(state => state.owners);
  const sendEmailInvite = useAppStore(state => state.sendEmailInvite);

  const owner = owners.find(o => o.id === id);
  const [email, setEmail] = useState("");
  const [showToast, setShowToast] = useState(false);

  if (!owner) {
    return <div>Owner not found</div>;
  }

  const getReturnPath = () => {
    return returnTo === "edit" ? "/owners/edit" : "/owners";
  };

  const handleSend = () => {
    const emailToSend = email || `${owner.name.toLowerCase().replace(/\s+/g, '.')}@example.com`;
    sendEmailInvite(id!, emailToSend, "Please complete your information.");
    setShowToast(true);
    
    // Navigate after showing toast for a moment
    setTimeout(() => {
      navigate(getReturnPath());
    }, 1500);
  };

  return (
    <div className="layout-with-sidebar">
      <OnboardingSidebar currentStep="business-owners" />
      <div className="main-content-with-sidebar">
        <OnboardingNav onBack={() => navigate(`/owners/${id}?returnTo=${returnTo}`)} />
        <div className="page-content">
          <button 
            onClick={() => navigate(`/owners/${id}?returnTo=${returnTo}`)}
            style={{
              background: "none",
              border: "none",
              color: "#6366f1",
              cursor: "pointer",
              padding: "0",
              marginBottom: "1em",
              fontSize: "1em",
              display: "flex",
              alignItems: "center",
              gap: "0.25em"
            }}
          >
            ← Back
          </button>

          <div className="page-header">
            <h1 className="page-title">Send a verification link to owner</h1>
            <p className="page-description">
              Confirm the email addresses to send a verification link to.
            </p>
          </div>

          <div style={{
            backgroundColor: "#f9fafb",
            padding: "1em 1.25em",
            borderRadius: "8px",
            marginBottom: "1.5em"
          }}>
            <div style={{ fontWeight: 600, fontSize: "1em", marginBottom: "0.25em" }}>
              {owner.name}
            </div>
            <div style={{ color: "#6b7280", fontSize: "0.9em" }}>
              Beneficial owner
            </div>
          </div>

          <div style={{ marginBottom: "1.5em" }}>
            <h3 style={{ fontSize: "1em", fontWeight: 600, marginBottom: "0.5em" }}>
              What to expect
            </h3>
            <p style={{ color: "#6b7280", fontSize: "0.95em", lineHeight: 1.6, margin: 0 }}>
              The owner will receive a link via their email address to verify their identity by capturing a photo ID and selfie. Verification could take up to 2-3 days.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-input"
              placeholder="abc@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "2em" }}>
            <h3 style={{ fontSize: "1em", fontWeight: 600, marginBottom: "0.75em" }}>
              Email preview
            </h3>
            <div style={{
              backgroundColor: "#f9fafb",
              padding: "1.5em",
              borderRadius: "8px",
              border: "1px solid #e5e7eb"
            }}>
              <div style={{
                backgroundColor: "white",
                padding: "2em",
                borderRadius: "6px"
              }}>
                <div style={{ 
                  color: "#6366f1", 
                  fontWeight: 700, 
                  fontSize: "1.5em",
                  marginBottom: "1.5em"
                }}>
                  stripe
                </div>
                
                <div style={{ marginBottom: "1.5em" }}>
                  <div style={{ fontWeight: 600, marginBottom: "1em" }}>
                    Complete identity verification for {owner.name}
                  </div>
                  <div style={{ fontSize: "0.95em", color: "#4b5563", lineHeight: 1.6 }}>
                    To verify {owner.name}'s identity, you'll need to provide a photo of their ID.{" "}
                    <a href="#" style={{ color: "#6366f1" }}>View our docs</a> to see which ID types we accept.
                  </div>
                </div>

                <div style={{ fontSize: "0.95em", color: "#4b5563", marginBottom: "1.5em", lineHeight: 1.6 }}>
                  Stripe verifies the identity of people connected to Stripe accounts to fight fraud and satisfy regulatory requirements.
                </div>

                <button className="btn btn-primary" style={{ marginBottom: "1em" }}>
                  Start verification
                </button>

                <div style={{ fontSize: "0.85em", color: "#6b7280", lineHeight: 1.5 }}>
                  Note that this is a one-time link that expires in 7 days. If you need a new link, please ask your administrator ([email address]) to send you a new one.
                </div>
              </div>
            </div>
          </div>

          <div className="button-group-vertical">
            <button onClick={handleSend} className="btn btn-primary btn-large">
              Send email
            </button>
          </div>
        </div>
      </div>
      
      {showToast && (
        <Toast 
          message="Email sent successfully!"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default OwnerEmailCompose;

