import React, { useState, useEffect } from "react";
import Stepper from "./Stepper";
import "../css/CreateColumnPage.css";
import DeletIcon from "../assets/delete_icon.svg";

// The typo was here. I've corrected "mainFilekey" to "mainFileKey".
function CreateColumnPage({
  onBack,
  onNext,
  sessionId,
  mainFileKey,
  refFileKeys,
}) {
  const [columnsData, setColumnsData] = useState(null);
  const [newColumns, setNewColumns] = useState([]);
  const [currentColumnConfig, setCurrentColumnConfig] = useState({
    new_column_name: "",
    prefix: "",
    source_columns: [],
    suffix: "",
  });
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const response = await fetch(
          `https://literate-parakeet-rxxw79vgj94hw7p-8000.app.github.dev/columns/${sessionId}`
        );
        if (!response.ok) throw new Error("Failed to fetch columns.");
        const data = await response.json();
        setColumnsData(data);
      } catch (error) {
        alert("Error fetching column data.");
      }
    };
    fetchColumns();
  }, [sessionId]);

  const handleConfigChange = (field, value) => {
    setCurrentColumnConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (columnName) => {
    setCurrentColumnConfig((prev) => {
      const newSourceColumns = prev.source_columns.includes(columnName) // Changed from sourceColumns
        ? prev.source_columns.filter((col) => col !== columnName) // Changed from sourceColumns
        : [...prev.source_columns, columnName]; // Changed from sourceColumns
      return { ...prev, source_columns: newSourceColumns }; // Changed from sourceColumns
    });
  };

  const handleAddColumn = () => {
    if (!currentColumnConfig.new_column_name) {
      alert("Please enter a name for the new column.");
      return;
    }
    if (currentColumnConfig.source_columns.length === 0) {
      // Changed from sourceColumns
      alert("Please select at least one reference column.");
      return;
    }
    setNewColumns((prev) => [...prev, currentColumnConfig]);

    setCurrentColumnConfig({
      new_column_name: "",
      prefix: "",
      source_columns: [], // Changed from sourceColumns
      suffix: "",
    });
  };

  const handleDeleteColumn = (indexToDelete) => {
    setNewColumns((prev) => prev.filter((_, index) => index !== indexToDelete));
  };

  const handleCreateColumnsAndProceed = async () => {
    if (newColumns.length === 0) {
      alert("Please add at least one new column configuration.");
      return;
    }

    // This payload now contains the entire list of new columns
    const payload = {
      session_id: sessionId,
      main_file_key: mainFileKey,
      reference_file_key: Object.values(refFileKeys)[0],
      new_columns: newColumns, // Send the whole array
    };

    console.log("Sending this payload:", JSON.stringify(payload, null, 2));

    try {
      // Send the single, consolidated request
      const response = await fetch(
        "https://literate-parakeet-rxxw79vgj94hw7p-8000.app.github.dev/services/create-column",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to process the new columns.`);
      }

      // If the request is successful, navigate to the status page
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
        <div className="page-header">
          <h2>
            Dites-nous ce que vous voulez <br /> faire avec vos données
          </h2>
          <p className="instruction">
            Générez une nouvelle colonne à partir des valeurs <br /> présentes
            dans votre fichier de référence.
          </p>
          <div className="formula-builder">
            <div className="formula-part">
              <label>la nouvelle colonne</label>
              <input
                type="text"
                placeholder="e.g., Combined_Description"
                value={currentColumnConfig.new_column_name} // Changed from "name"
                onChange={(e) =>
                  handleConfigChange("new_column_name", e.target.value)
                } // Changed from "name"
              />
            </div>

            <div className="formula-part">
              <label>Préfixe (optionnel)</label>
              <input
                type="text"
                placeholder="ex. : SH 04 "
                value={currentColumnConfig.prefix}
                onChange={(e) => handleConfigChange("prefix", e.target.value)}
              />
            </div>

            {/* Reference Columns Checklist */}
            <div className="formula-part checklist">
              <label>Reference Columns</label>
              <div
                className="checklist-toggle"
                onClick={() => setIsChecklistOpen(!isChecklistOpen)}
              >
                {currentColumnConfig.source_columns.length > 0
                  ? `${currentColumnConfig.source_columns.length} selected`
                  : "Select columns..."}
                <span className="arrow"></span>
              </div>

              {/* This check now safely handles cases with no reference files */}
              {isChecklistOpen &&
                columnsData?.reference_files_columns &&
                Object.keys(columnsData.reference_files_columns).length > 0 && (
                  <div className="checklist-box">
                    {Object.values(columnsData.reference_files_columns)[0].map(
                      (col) => (
                        <label key={col} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={currentColumnConfig.source_columns.includes(
                              col
                            )}
                            onChange={() => handleCheckboxChange(col)}
                          />
                          {col}
                        </label>
                      )
                    )}
                  </div>
                )}
            </div>

            <div className="formula-part">
              <label>Suffix (Optional)</label>
              <input
                type="text"
                placeholder="termine par"
                value={currentColumnConfig.suffix}
                onChange={(e) => handleConfigChange("suffix", e.target.value)}
              />
            </div>

            <div className="add-column-section">
              <button className="add-btn" onClick={handleAddColumn}>
                Add Column
              </button>
            </div>
          </div>
        </div>

        <div className="live-preview">
          <strong>Aperçu instantané :</strong>
          <p>
            {currentColumnConfig.prefix}
            {currentColumnConfig.source_columns.join(" ")}
            {currentColumnConfig.suffix}
          </p>
        </div>
        {newColumns.length > 0 && (
          <div className="rules-list">
            {newColumns.map((colConfig, index) => (
              <div className="rule-item" key={index}>
                <span className="new-col-name">
                  {colConfig.new_column_name} =
                </span>
                <div className="formula-display">
                  {colConfig.prefix && (
                    <span className="highlight prefix">
                      "{colConfig.prefix}"
                    </span>
                  )}
                  {/* --- THIS IS THE CORRECTED LINE --- */}
                  {colConfig.source_columns.map((sc) => (
                    <span key={sc} className="highlight">
                      {sc}
                    </span>
                  ))}
                  {colConfig.suffix && (
                    <span className="highlight suffix">
                      "{colConfig.suffix}"
                    </span>
                  )}
                </div>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteColumn(index)}
                >
                  <img src={DeletIcon} alt="Delete" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="footer-buttons"> 
        <button className="btn-secondary" onClick={onBack}>
          Annuler L'action
        </button>
        <button className="btn-primary" onClick={handleCreateColumnsAndProceed}>
          Étape Suivante
        </button>
      </div>
    </div>
  );
}

export default CreateColumnPage;
