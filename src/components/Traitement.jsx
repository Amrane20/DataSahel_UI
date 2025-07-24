// Import React and useState hook
import React, { useState } from "react";
// Import external CSS for styling
import "../css/Traitement.css";

// Define the Traitement component, receiving onBack and onNext as props
function Traitement({ onBack, onNext }) {
  // State to store the main file selected by the user
  const [mainFile, setMainFile] = useState(null);
  // State to store the reference file selected by the user
  const [referenceFile, setReferenceFile] = useState(null);

  // Function triggered when the user selects the main file
  const handleMainFileChange = (e) => {
    setMainFile(e.target.files[0]); // Update mainFile state with selected file
  };

  // Function triggered when the user selects the reference file
  const handleReferenceFileChange = (e) => {
    setReferenceFile(e.target.files[0]); // Update referenceFile state with selected file
  };

  // Component render
  return (
    <div className="traitement-container"> {/* Main container */}
      
      <div className="stepper"> {/* Stepper section for progress tracking */}
        <div className="step-bar"> {/* Progress bar container */}
          <div className="step-progress" style={{ width: "66%" }} /> {/* Progress bar filled 66% */}
        </div>

        <div className="step-labels"> {/* Labels for steps */}
          <label className="active"> {/* Step 1: active */}
            <input type="radio" checked readOnly /> {/* Checked radio input */}
            Importation des fichiers {/* Step label text */}
          </label>
          <label className="active"> {/* Step 2: active */}
            <input type="radio" checked readOnly />
            Sélection des colonnes
          </label>
          <label> {/* Step 3: not active */}
            <input type="radio" disabled readOnly /> {/* Disabled radio input */}
            Traitement
          </label>
          <label> {/* Step 4: not active */}
            <input type="radio" disabled readOnly />
            Téléchargement
          </label>
        </div>
      </div>

      <div className="file-upload-section"> {/* Section for uploading files and rule configuration */}
        <h2>Dites-nous ce que vous voulez <br /> faire avec vos données</h2> {/* Section title */}
        
        <p className="instruction"> {/* Instruction text */}
          Plus de formules compliquées ou de copier-coller pendant des heures. <br />
          Avec DataShel, vous appliquez vos règles simples en quelques clics.
        </p>

        <div className="file-inputs"> {/* Container for file and rule inputs */}
          <div className="file-group"> {/* Group of file selectors and actions */}
            <label>Main_File.xlsx</label> {/* Label for main file */}
            
            {/* Dropdown for main file selection (example option) */}
            <select
              value={mainFile ? mainFile.name : "Pipe_id_Rif_..."}
              onChange={handleMainFileChange}
            >
              <option value="Pipe_id_Rif_...">Pipe_id_Rif_...</option>
            </select>

            {/* Another dropdown for selecting a column from main file */}
            <select
              value={mainFile ? mainFile.name : "Est Vide"}
              onChange={handleMainFileChange}
            >
              <option value="Pipe_id_Rif_...">Est Vide</option>
            </select>

            {/* Empty option (but not inside select!) – likely misplaced */}
            <option value="">Est Vide</option>

            {/* Reference file label */}
            <label htmlFor="">Reference_one.xlsx</label>

            {/* Dropdown for selecting column from reference file */}
            <select
              value={referenceFile ? referenceFile.name : "Pipe_id_Rif_..."}
              onChange={handleReferenceFileChange}
            >
              <option value="Pipe_id_Rif_...">Pipe_id_Rif_...</option>
            </select>

            {/* Action buttons */}
            <button className="keep-btn">Garder la valeur</button> {/* Keep value button */}
            <button className="add-btn">Ajouter</button> {/* Add rule button */}
          </div>

          <hr className="ligne" /> {/* Horizontal line separator */}

          <div className="condition-rules"> {/* Section to show rule examples */}
            <p>
              Si la valeur de <span className="highlight">pipe_id</span> est vide dans{" "}
              <span className="highlight">main.xlsx</span> et qu'elle existe dans{" "}
              <span className="highlight">Reference_one.xlsx</span>, alors mettez-la à jour.
            </p>
            <p>
              Si la valeur de <span className="highlight">pipe_id</span> est vide dans{" "}
              <span className="highlight">main.xlsx</span> et qu'elle existe dans{" "}
              <span className="highlight">Reference_one.xlsx</span>, alors mettez-la à jour.
            </p>
          </div>
        </div>
      </div>

      <div className="footer-buttons"> {/* Footer with navigation buttons */}
        <button className="btn-secondary" onClick={onBack}>Annulr l’action</button> {/* Cancel button */}
        <button className="btn-primary" onClick={onNext}>Étape Suivante</button> {/* Next step button */}
      </div>
    </div>
  );
}

// Export the component for use in other files
export default Traitement;
