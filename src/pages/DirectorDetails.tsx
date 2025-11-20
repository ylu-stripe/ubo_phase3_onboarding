import React from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import PersonForm from "../components/PersonForm";
import InvitePersonCard from "../components/InvitePersonCard";
import OnboardingNav from "../components/OnboardingNav";
import OnboardingSidebar from "../components/OnboardingSidebar";

export const DirectorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "list";
  
  const directors = useAppStore(state => state.directors);
  const updatePerson = useAppStore(state => state.updatePerson);
  const deletePerson = useAppStore(state => state.deletePerson);

  const director = directors.find(d => d.id === id);

  if (!director) {
    return <div>Director not found</div>;
  }

  const getReturnPath = () => {
    return returnTo === "edit" ? "/directors/edit" : "/directors";
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
    if (director.origin === "user_added" && !director.name && !director.address && !director.dateOfBirth) {
      deletePerson(id!, "director");
    }
    navigate(getReturnPath());
  };

  const handleSendEmail = () => {
    navigate(`/directors/${id}/email?returnTo=${returnTo}`);
  };

  return (
    <div className="layout-with-sidebar">
      <OnboardingSidebar currentStep="business-owners" />
      <div className="main-content-with-sidebar">
        <OnboardingNav onBack={() => navigate(getReturnPath())} />
        <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">
            {director.origin === "user_added" && !director.address && !director.dateOfBirth 
              ? "Add director details" 
              : "Edit director details"}
          </h1>
          <p className="page-description">
            Please provide the address and date of birth for this director.
          </p>
        </div>

        <PersonForm 
          person={director} 
          onSave={handleSave}
          onCancel={handleCancel}
        />

        {/* Only show invite card when editing, not when adding new */}
        {!(director.origin === "user_added" && !director.address && !director.dateOfBirth) && (
          <InvitePersonCard 
            personName={director.name}
            onSendEmail={handleSendEmail}
          />
        )}
      </div>
    </div>
    </div>
  );
};

export default DirectorDetails;

