// Importing React to define the component
import React, { useState, useEffect } from "react";

// Importing the CSS file that styles the ColumnSection component
import "../css/ColumnSection.css";
import Stepper from "./Stepper";

// Functional component definition, taking onBack and onNext as props
function ColumnSection({ onBack, onNext, sessionId }) {
  const [columnsData, setColumnsData] = useState(null);
  const [mainFileKey, setMainFileKey] = useState("");
  const [refFileKeys, setRefFileKeys] = useState({});
  const [isNextEnabled, setIsNextEnabled] = useState(false);

  // Add this hook inside your ColumnSection component

  useEffect(() => {
    // Don't run this check if the column data hasn't loaded yet
    if (!columnsData) return;

    const mainKeyIsSelected = mainFileKey !== "";

    const refFileNames = Object.keys(columnsData.reference_files_columns);
    // This checks if a key column has been selected for EVERY reference file
    const allRefKeysSelected =
      refFileNames.length > 0 &&
      refFileNames.every((name) => refFileKeys[name]);

    // Enable the button only if both conditions are true
    setIsNextEnabled(mainKeyIsSelected && allRefKeysSelected);
  }, [mainFileKey, refFileKeys, columnsData]);

  const handleRefKeyChange = (filename, selectedColumn) => {
    setRefFileKeys((prevKeys) => ({
      ...prevKeys,
      [filename]: selectedColumn,
    }));
  };

  useEffect(() => {
    // Define the function to fetch data
    const fetchColumns = async () => {
      try {
        const response = await fetch(
          `https://literate-parakeet-rxxw79vgj94hw7p-8000.app.github.dev/columns/${sessionId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch columns.");
        }
        const data = await response.json();
        console.log("Fetched Columns Data:", data); // You can see the data in your browser console
        setColumnsData(data); // Save the data to our state
      } catch (error) {
        alert("Error fetching column data.");
      }
    };

    // Call the function
    fetchColumns();
  }, [sessionId]); // The empty array [] means this runs only once on mount

  // Add this function inside your ColumnSection component

  const handleSaveKeysAndProceed = async () => {
    // 1. Prepare the data payload in the correct format
    const keyConfig = {
      session_id: sessionId,
      main_file_key: mainFileKey,
      reference_files_keys: refFileKeys,
    };

    try {
      // 2. Send the data to the /configure/keys endpoint
      const response = await fetch("https://literate-parakeet-rxxw79vgj94hw7p-8000.app.github.dev/configure/keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(keyConfig),
      });

      if (!response.ok) {
        throw new Error("Failed to configure keys on the server.");
      }

      const result = await response.json();
      console.log("Keys configured successfully:", result);

      // 3. If successful, proceed to the next page
      onNext(mainFileKey, refFileKeys);
    } catch (error) {
      console.error("Error saving keys:", error);
      alert("Could not save the key column configuration. Please try again.");
    }
  };

  // Show a loading message until the data arrives
  if (!columnsData) {
    return <div>Loading column data...</div>;
  }

  return (
    // Main container for the column selection section
    <div className="column-section-container">
      {/* Stepper showing the progress bar and current step */}
      <Stepper currentStep={2} />

      {/* Section containing the upload-related cards */}
      <div className="upload-sections">
        {/* Card for selecting a column to match from the main file */}
        <div className="upload-cardP">
          <h2 className="title">
            Sélectionnez une colonne à faire  correspondre
          </h2>
          <p className="pfichiersR">
            La colonne contient les identifiants que vous voulez <br />
            vérifier ou utiliser pour retrouver des données
          </p>

          {/* Information about the uploaded file */}
          <div className="file-info">
            <div className="file-name">
              <span className="file-title">Fichier Principal</span>
              {mainFileKey && (
                <span className="selected-col">
                  Sélectionnée:{" "}
                  <span className="highlight">“{mainFileKey}”</span>
                </span>
              )}
            </div>

            {/* Dropdown for selecting a column */}
            <div className="columns-list">
              <select
                value={mainFileKey}
                onChange={(e) => setMainFileKey(e.target.value)}
              >
                <option value="" disabled>
                  -- Choisir une colonne --
                </option>
                {columnsData.main_file_columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Card for selecting corresponding columns in each reference file */}

        {/* Card for selecting corresponding columns in each reference file */}
        <div className="upload-cardP">
          <h2 className="title">
            Sélectionnez la colonne correspondante <br /> dans chaque fichier
          </h2>
          <p className="pfichiersR">
            La colonne contient les identifiants à comparer <br />
            avec ceux de votre fichier principal.
          </p>

          {/* This part now generates a section for EACH reference file */}
          {Object.keys(columnsData.reference_files_columns).map(
            (filename, index) => (
              <React.Fragment key={filename}>
                <div className="file-info">
                  <div className="file-name2">
                    <span className="file-title">{filename}</span>
                    {refFileKeys[filename] && (
                      <span className="selected-col2">
                        Sélectionnée:{" "}
                        <span className="highlight2">
                          “{refFileKeys[filename]}”
                        </span>
                      </span>
                    )}
                  </div>
                  <div className="columns-list2">
                    <select
                      value={refFileKeys[filename] || ""}
                      onChange={(e) =>
                        handleRefKeyChange(filename, e.target.value)
                      }
                    >
                      <option value="" disabled>
                        -- Choisir une colonne --
                      </option>
                      {columnsData.reference_files_columns[filename].map(
                        (col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
                {/* Add a separator line if it's not the last file */}
                {index <
                  Object.keys(columnsData.reference_files_columns).length -
                    1 && <hr className="file-separator" />}
              </React.Fragment>
            )
          )}
        </div>
      </div>

      {/* Footer buttons to navigate back or proceed */}
      <div className="footer-buttons">
        {/* Cancel or go back button */}
        <button className="btn-secondary" onClick={onBack}>
          Annulr l’action
        </button>

        {/* Button to go to the next step */}
        <button
          className="btn-primary"
          disabled={!isNextEnabled}
          onClick={handleSaveKeysAndProceed} // Use the new function here
        >
          Étape Suivante
        </button>
      </div>
    </div>
  );
}

// Exporting the component so it can be used in other files
export default ColumnSection;
