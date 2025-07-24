// Importing React library
import React from "react";

// Importing the CSS file for FileImport component styling
import "../css/FileImport.css";

// Defining the functional component FileImport, receiving onBack and onNext as props
function FileImport({ onBack, onNext }) {
  return (
    // Main container for the import section
    <div className="import-container">
      
      {/* Stepper section to show progress steps */}
      <div className="stepper">
        {/* Bar that shows step progress */}
        <div className="step-bar">
          {/* Current progress line (usually styled with CSS width) */}
          <div className="step-progress" />
        </div>

        {/* Labels for each step in the import process */}
        <div className="step-labels">
          {/* Active step: file import */}
          <label className="active">
            <input type="radio" checked readOnly /> Importation des fichiers
          </label>

          {/* Next steps: disabled */}
          <label>
            <input type="radio" disabled readOnly /> Sélection des colonnes
          </label>
          <label>
            <input type="radio" disabled readOnly /> Traitement
          </label>
          <label>
            <input type="radio" disabled readOnly /> Téléchargement
          </label>
        </div>
      </div>

      {/* File upload section */}
      <div className="upload-sections">
        
        {/* Section for uploading the main file */}
        <div className="upload-card">
          <h2>Fichier principal</h2>
          {/* Description of the main file */}
          <p className="pfichiersR">
            C’est le fichier que vous souhaitez analyser ou modifier.
          </p>

          {/* Drop zone for uploading the file */}
          <div className="drop-zone">
            <i className="upload-icon" />
            <p>
              Uniquement des fichiers <span>Excel</span> ou <span>CSV</span>
            </p>
          </div>

          {/* Button to upload the main file */}
          <button className="btn-upload">Ajouter</button>

          {/* Section that displays uploaded main file */}
          <div className="uploaded">
            <h4>Uploaded Files</h4>
            <div className="file">
              <i className="file-icon" />
              <span className="file-name">main_file.xlsx</span>
              <span className="file-size">100 kb</span>
              {/* Button to delete the uploaded file */}
              <button className="btn-delete">×</button>
            </div>
          </div>
        </div>

        {/* Section for uploading reference files */}
        <div className="upload-card">
          <h2>Fichiers de référence</h2>
          {/* Question about number of reference files */}
          <p>Combien de fichiers de référence voulez-vous utiliser ?</p>

          {/* Buttons to choose how many reference files (1 to 5) */}
          <div className="ref-count">
            {[1, 2, 3, 4, 5].map((n) => (
              // Mark the first button as selected by default
              <button key={n} className={`ref-btn ${n === 1 ? "selected" : ""}`}>
                {n}
              </button>
            ))}
          </div>

          {/* Drop zone for uploading reference files */}
          <div className="drop-zone">
            <i className="upload-icon" />
            <p>
              Uniquement des fichiers <span>Excel</span> ou <span>CSV</span>
            </p>
          </div>

          {/* Button to add reference files */}
          <button className="btn-upload">Ajouter</button>

          {/* Section that displays uploaded reference file */}
          <div className="uploaded">
            <h4>Uploaded Files</h4>
            <div className="file">
              <i className="file-icon" />
              <span className="file-name">ref_file1.xlsx</span>
              <span className="file-size">85 kb</span>
              {/* Button to delete the uploaded file */}
              <button className="btn-delete">×</button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation buttons at the bottom */}
      <div className="footer-buttons">
        {/* Button to cancel the action and go back */}
        <button className="btn-secondary" onClick={onBack}>
          Annuler l’action
        </button>

        {/* Button to go to the next step */}
        <button className="btn-primary" onClick={onNext}>
          Étape Suivante
        </button>
      </div>
    </div>
  );
}

// Exporting the component so it can be used elsewhere
export default FileImport;
