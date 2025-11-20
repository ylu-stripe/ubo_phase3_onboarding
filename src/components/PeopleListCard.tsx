import React from "react";

interface PeopleListCardProps {
  title: string;
  people: string[];
}

export const PeopleListCard: React.FC<PeopleListCardProps> = ({ title, people }) => {
  if (!people || people.length === 0) {
    return null;
  }

  return (
    <div className="section">
      <div style={{
        backgroundColor: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "0 1em" 
      }}>
        <h3 style={{ fontSize: "1em", fontWeight: 600, marginBottom: "1em", color: "#1f2937" }}>
          {title}
        </h3>
        <div style={{ marginBottom: "0" }}>
          <ul style={{ 
            margin: 0,
            listStyleType: "none",
            paddingLeft: 0
          }}>
            {people.map((name, idx) => (
              <li key={idx} style={{ 
                fontSize: "0.95em", 
                color: "#6b7280",
                marginBottom: "0.5em"
              }}>
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PeopleListCard;

