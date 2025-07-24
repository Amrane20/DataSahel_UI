// Importing React to define the component
import React from "react";

// Importing the CSS file that styles the ColumnSection component
import "../css/ColumnSection.css";

// Functional component definition, taking onBack and onNext as props
function ColumnSection({ onBack, onNext }) {
  return (
    // Main container for the column selection section
    <div className="column-section-container">

      {/* Stepper showing the progress bar and current step */}
      <div className="stepper">
        <div className="step-bar">
          {/* Progress line (styled with width in CSS) */}
          <div className="step-progress" />
        </div>

        {/* Labels for each step in the process */}
        <div className="step-labels">
          <label className="active">
            <input type="radio" checked readOnly /> Importation des fichiers
          </label>
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

      {/* Section containing the upload-related cards */}
      <div className="upload-sections">

        {/* Card for selecting a column to match from the main file */}
        <div className="upload-cardP">
          <h2>
            Sélectionnez une colonne à faire <br /> correspondre
          </h2>
          <p className="pfichiersR">
            La colonne contient les identifiants que vous voulez <br />
            vérifier ou utiliser pour retrouver des données
          </p>

          {/* Information about the uploaded file */}
          <div className="file-info">
            <div className="file-name">
              {/* File title */}
              <span className="file-title">Reference_one.xlsx</span>

              {/* Currently selected column */}
              <span className="selected-col">
                Sélectionnée: <span className="highlight">“Pipe_Id”</span>
              </span>
            </div>

            {/* Dropdown for selecting a column */}
            <div className="columns-list">
              <select name="" id="">
                <option value="">column: “Pipe_Id”, “Rir”, ...</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card for selecting corresponding columns in each reference file */}
        <div className="upload-cardP">
          <h2>
            Sélectionnez la colonne correspondante <br /> dans chaque fichier
          </h2>
          <p className="upload-description">
            La colonne contient les identifiants à comparer <br />
            avec ceux de votre fichier principal.
          </p>

          {/* First reference file */}
          <div className="file-info2">
            <div className="file-name2">
              <span className="file-title2">Reference_one.xlsx</span>
              <span className="selected-col2">
                Sélectionnée: <span className="highlight2">“Pipe_Id”</span>
              </span>
            </div>

            {/* Dropdown for selecting column */}
            <div className="columns-list2">
              <select>
                <option>column: “Pipe_Id”, “Rir”, ...</option>
              </select>
            </div>
          </div>

          {/* Horizontal line separating the files */}
          <hr className="file-separator" />

          {/* Second reference file */}
          <div className="file-info2">
            <div className="file-name2">
              <span className="file-title2">Reference_one.xlsx</span>
              <span className="selected-col2">
                Sélectionnée: <span className="highlight2">“Pipe_Id”</span>
              </span>
            </div>

            {/* Dropdown for selecting column */}
            <div className="columns-list2">
              <select>
                <option>column: “Pipe_Id”, “Rir”, ...</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Footer buttons to navigate back or proceed */}
      <div className="footer-buttons">
        {/* Cancel or go back button */}
        <button className="btn-secondary" onClick={onBack}>
          Annulr l’action
        </button>

        {/* Button to go to the next step */}
        <button className="btn-primary" onClick={onNext}>
          Étape Suivante
        </button>
      </div>
    </div>
  );
}

// Exporting the component so it can be used in other files
export default ColumnSection;
