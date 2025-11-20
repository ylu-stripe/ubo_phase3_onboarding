import React from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import PersonForm from "../components/PersonForm";
import InvitePersonCard from "../components/InvitePersonCard";
import OnboardingNav from "../components/OnboardingNav";
import OnboardingSidebar from "../components/OnboardingSidebar";

export const OwnerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "list";
  
  const owners = useAppStore(state => state.owners);
  const updatePerson = useAppStore(state => state.updatePerson);
  const deletePerson = useAppStore(state => state.deletePerson);

  const owner = owners.find(o => o.id === id);

  if (!owner) {
    return <div>Owner not found</div>;
  }

  const getReturnPath = () => {
    return returnTo === "edit" ? "/owners/edit" : "/owners";
  };

  const handleSave = (address: string, dateOfBirth: string, name?: string) => {
    updatePerson(id!, { 
      ...(name && { name }), // Only update name if provided (user-added)
      address, 
      dateOfBirth, 
      status: (address && dateOfBirth) ? "complete" : "missing" 
    });
    navigate(getReturnPath());
  };

  const handleCancel = () => {
    // If this is a new person with no data, delete them completely from the store
    if (owner.origin === "user_added" && !owner.name && !owner.address && !owner.dateOfBirth) {
      deletePerson(id!, "owner");
    }
    navigate(getReturnPath());
  };

  const handleSendEmail = () => {
    navigate(`/owners/${id}/email?returnTo=${returnTo}`);
  };

  return (
    <div className="layout-with-sidebar">
      <OnboardingSidebar currentStep="business-owners" />
      <div className="main-content-with-sidebar">
        <OnboardingNav onBack={() => navigate(getReturnPath())} />
        <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">
            {owner.origin === "user_added" && !owner.address && !owner.dateOfBirth 
              ? "Add owner details" 
              : "Edit owner details"}
          </h1>
          <p className="page-description">
            Please provide the address and date of birth for this beneficial owner.
          </p>
        </div>

        <PersonForm 
          person={owner} 
          onSave={handleSave}
          onCancel={handleCancel}
        />

        {/* Only show invite card when editing, not when adding new */}
        {!(owner.origin === "user_added" && !owner.address && !owner.dateOfBirth) && (
          <InvitePersonCard 
            personName={owner.name}
            onSendEmail={handleSendEmail}
          />
        )}
      </div>
    </div>
    </div>
  );
};

export default OwnerDetails;

