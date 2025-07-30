// src/components/Stepper.jsx

import React from "react";
import "../css/Stepper.css"; 

function Stepper({ currentStep }) {
  const steps = [
    "Importation des fichiers",
    "Sélection des colonnes",
    "Traitement",
    "Téléchargement",
  ];

  // Calculate the width of the progress bar based on the current step
  const progressWidth = `${(currentStep - 1) * 33.3}%`;

  return (
    <div className="stepper">
      <div className="step-bar">
        <div className="step-progress" style={{ width: progressWidth }} />
      </div>
      <div className="step-labels">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= currentStep;
          return (
            <label key={stepNumber} className={isActive ? "active" : ""}>
              {/* This span will be our custom icon */}
              <span className="step-icon"></span>
              {label}
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default Stepper;