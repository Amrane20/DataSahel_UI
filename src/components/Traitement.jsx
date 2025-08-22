// src/components/Traitement.jsx

import React, { useState, useEffect } from "react";
import "../css/Traitement.css";
import Stepper from "./Stepper";
import DeletIcon from "../assets/delete_icon.svg";
import { API_URL } from "../apiConfig"; 

// We receive onBack and onNext from the parent component
function Traitement({ onBack, onNext, sessionId }) {
  const [columnsData, setColumnsData] = useState(null);
  // State for the list of rules the user has added
  const [rulesList, setRulesList] = useState([]);
  // State for the single rule currently being built in the dropdowns
  const [currentRule, setCurrentRule] = useState({
    main_column: "",
    primary_condition: "IS_EMPTY",
    comparison_operator: "DIFFERENT", // Add this line with a default
    reference_column: "",
    action: "REPLACE",
  });

  // This one constant replaces the two old ones.
  const combinedConditions = [
    { label: "Est Vide", value: "IS_EMPTY" },
    {
      label: "N'est Pas Vide et est Différente de",
      value: "IS_NOT_EMPTY__DIFFERENT",
    },
    { label: "N'est Pas Vide et est Égale à", value: "IS_NOT_EMPTY__MATCH" },
  ];

  const actions = [
    { label: "Remplacer la valeur", value: "REPLACE" },
    { label: "Garder la valeur", value: "KEEP" },
  ];

  // Add this new function inside your Traitement component.
  const handleConditionChange = (value) => {
    const newRule = { ...currentRule };

    // Check if the value contains our separator "__"
    if (value.includes("__")) {
      const parts = value.split("__");
      newRule.primary_condition = parts[0]; // e.g., "IS_NOT_EMPTY"
      newRule.comparison_operator = parts[1]; // e.g., "DIFFERENT"
    } else {
      // This handles the simple "IS_EMPTY" case
      newRule.primary_condition = value;
      delete newRule.comparison_operator; // Remove the operator if it's not needed
    }

    setCurrentRule(newRule);
  };

  const handleSimpleChange = (field, value) => {
    setCurrentRule((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const response = await fetch(
          `${API_URL}/columns/${sessionId}`
        );
        if (!response.ok) throw new Error("Failed to fetch columns.");
        const data = await response.json();
        setColumnsData(data);
        console.log("Fetched Columns for Rule Builder:", data);
      } catch (error) {
        alert("Error fetching column data.");
      }
    };
    fetchColumns();
  }, [sessionId]);

  // Add this function inside your Traitement component

  const handleAddRule = () => {
    // Basic validation to make sure columns are selected
    if (!currentRule.main_column || !currentRule.reference_column) {
      alert("Please select a column for both the main and reference file.");
      return;
    }
    // Add the current rule to our list of rules
    setRulesList((prevList) => [...prevList, currentRule]);

    // Optional: Reset the current rule builder for the next rule
    setCurrentRule({
      main_column: "",
      primary_condition: "IS_EMPTY",
      reference_column: "",
      action: "REPLACE",
    });
  };

  const handleDeleteRule = (indexToDelete) => {
    setRulesList(prevList => prevList.filter((_, index) => index !== indexToDelete));
  };


  // Replace your old handleConfigureRules function with this one

  const handleSaveAndExecute = async () => {
    if (rulesList.length === 0) {
      alert("Please add at least one rule before proceeding.");
      return;
    }

    const rulesConfig = {
      session_id: sessionId,
      rules: rulesList,
    };

    try {
      // --- Step 1: Save the rules ---
      const rulesResponse = await fetch(
        "${API_URL}/configure/rules",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rulesConfig),
        }
      );

      if (!rulesResponse.ok) throw new Error("Failed to save the rules.");
      console.log("Rules saved successfully.");

      // --- Step 2: Start the execution ---
      const executeResponse = await fetch(
        `${API_URL}/execute-comparison/${sessionId}`,
        {
          method: "POST",
        }
      );

      if (!executeResponse.ok)
        throw new Error("Failed to start the execution.");
      console.log("Execution started successfully.");

      // --- Step 3: Go to the next page ---
      onNext();
    } catch (error) {
      alert(error.message);
    }
  };

  if (!columnsData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="traitement-container">
      <Stepper currentStep={3} />

      <div className="file-upload-section">
        {/* Main Title and Subtitle */}
        <div className="page-header">
          <h2>
            Dites-nous ce que vous voulez <br /> faire avec vos données
          </h2>
          <p className="instruction">
            Plus besoin de formules compliquées ou de copier-coller pendant des
            heures. <br />
            Avec DataSahel, vous appliquez vos règles simplement, en quelques
            clics.
          </p>

          <div className="rule-builder">
            <div className="rule-part">
              <label>Fichier Principal</label>
              <select
                value={currentRule.main_column}
                onChange={(e) =>
                  handleSimpleChange("main_column", e.target.value)
                }
              >
                <option value="" disabled>
                  -- Colonne principale --
                </option>
                {columnsData.main_file_columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            <div className="rule-part">
              <label>Condition</label>
              <select
                // This creates the combined value for the state to read
                value={`${currentRule.primary_condition}${
                  currentRule.comparison_operator
                    ? "__" + currentRule.comparison_operator
                    : ""
                }`}
                onChange={(e) => handleConditionChange(e.target.value)}
              >
                {combinedConditions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="rule-part">
              <label>Fichier de référence</label>
              <select
                value={currentRule.reference_column}
                onChange={(e) =>
                  handleSimpleChange("reference_column", e.target.value)
                }
              >
                <option value="" disabled>
                  -- Colonne de référence --
                </option>
                {Object.values(columnsData.reference_files_columns)[0].map(
                  (col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="rule-part">
              <label>Action</label>
              <select
                value={currentRule.action}
                onChange={(e) => handleSimpleChange("action", e.target.value)}
              >
                {actions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <button className="add-btn" onClick={handleAddRule}>
              Ajouter
            </button>
          </div>
        </div>

        <div className="rules-list">
  {rulesList.map((rule, index) => (
    <div className="rule-item" key={index}>
      {/* --- This is the sentence part (no changes needed) --- */}
      <div className="display"> {/* Added a wrapper for better layout */}
        <span>Si la valeur de</span>
        <span className="highlight">"{rule.main_column}"</span>
        <span>
          {(
            combinedConditions.find(
              (c) =>
                c.value ===
                `${rule.primary_condition}${
                  rule.comparison_operator
                    ? "__" + rule.comparison_operator
                    : ""
                }`
            ) || {}
          ).label}
        </span>
        <span>dans</span>
        <span className="highlight">"{columnsData.main_file_name}"</span>
        <span>et qu'elle existe dans</span>
        <span className="highlight">
          "{Object.keys(columnsData.reference_files_columns)[0]}"
        </span>
        <span>, alors</span>
        <span className="highlight">
          {(actions.find((a) => a.value === rule.action) || {}).label}
        </span>
      </div>

      {/* --- ADD THIS BUTTON --- */}
      <button className="btn-delete" onClick={() => handleDeleteRule(index)}>
        <img src={DeletIcon} alt="Delete Rule" />
      </button>
    </div>
  ))}
</div>



      </div>

      {/* Footer Buttons */}
      <div className="footer-buttons">
        <button className="btn-secondary" onClick={onBack}>
          Annuler L'action
        </button>
        <button className="btn-primary" onClick={handleSaveAndExecute}>
          Étape Suivante
        </button>
      </div>
    </div>
  );
}

export default Traitement;
