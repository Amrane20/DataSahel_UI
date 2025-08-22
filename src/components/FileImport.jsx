
// Importing React library
import React, { useState, useRef, useEffect } from "react";

// Importing the CSS file for FileImport component styling
import "../css/FileImport.css";
import DeletIcon from "../assets/delete_icon.svg";
import Stepper from "./Stepper"; 
// import { API_URL } from "./apiConfig"; 

// Defining the functional component FileImport, receiving onBack and onNext as props
function FileImport({ onBack, onNext, sessionId }) {
  const [mainFileInfo, setMainFileInfo] = useState(null);
  const mainFileInputRef = useRef(null);
  const [refCount, setRefCount] = useState(0);
  const [refFilesInfo, setRefFilesInfo] = useState([]);
  const refFileInputRef = useRef(null);
  const [isNextEnabled, setIsNextEnabled] = useState(false);

  const handleUploadMainFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("file", file);

    try {
      const response = await fetch(`https://datasahel-api.onrender.com/upload-main-file`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      setMainFileInfo(data);
    } catch (error) {
      alert("Error uploading main file.");
    } finally {
      mainFileInputRef.current.value = null;
    }
  };

  const handleSetRefCount = async (count) => {
    // 1. Update the state so the UI changes instantly
    setRefCount(count);

    // 2. Prepare data and call the API
    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("reference_count", count);

    try {
      const response = await fetch(
        `https://datasahel-api.onrender.com/set-reference-count`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) throw new Error("API call failed");
      console.log(`Reference count set to: ${count}`);
    } catch (error) {
      alert("Error setting reference count.");
    }
  };

  const handleUploadRefFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Prevent uploading more files than the selected count
    if (refFilesInfo.length >= refCount) {
      alert(`You can only upload ${refCount} reference file(s).`);
      return;
    }

    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("file", file);

    try {
      const response = await fetch(
        `https://datasahel-api.onrender.com/upload-reference-file`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) throw new Error("API call failed");

      const data = await response.json();
      // Add the new file's info to our list (array) of files
      setRefFilesInfo([...refFilesInfo, data]);
    } catch (error) {
      alert("Error uploading reference file.");
    } finally {
      refFileInputRef.current.value = null;
    }
  };

  // Add these two functions inside your FileImport component

  const handleDeleteMainFile = async () => {
    if (!mainFileInfo) return;

    try {
      const response = await fetch(
        `https://datasahel-api.onrender.com/delete-main-file/${sessionId}/${mainFileInfo.filename}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete the file.");

      // Clear the file info from state to reset the UI
      setMainFileInfo(null);
    } catch (error) {
      alert("Error: Could not delete the main file.");
    } finally {
      mainFileInputRef.current.value = null;
    }
  };

  const handleDeleteRefFile = async (fileToDelete) => {
    try {
      const response = await fetch(
        `https://datasahel-api.onrender.com/delete-ref-file/${sessionId}/${fileToDelete.filename}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete the ref file.");

      // Remove the specific file from our array in state
      setRefFilesInfo(
        refFilesInfo.filter((f) => f.filename !== fileToDelete.filename)
      );
    } catch (error) {
      alert("Error: Could not delete the reference file.");
    } finally {
      refFileInputRef.current.value = null;
    }
  };

  useEffect(() => {
    const conditionsMet =
      mainFileInfo !== null && refCount > 0 && refFilesInfo.length === refCount;

    setIsNextEnabled(conditionsMet);
  }, [mainFileInfo, refCount, refFilesInfo]); // This runs whenever these states change

  return (
    // Main container for the import section
    <div className="import-container">
      {/* Stepper section to show progress steps */}
      <Stepper currentStep={1} />

      {/* File upload section */}
      <div className="upload-sections">
        {/* Section for uploading the main file */}
        <div className="upload-card">
          <h2 className="card-title">Fichier principal</h2>
          <p className="pfichiersR">
            C’est le fichier que vous souhaitez analyser ou modifier.
          </p>

          <input
            type="file"
            ref={mainFileInputRef}
            onChange={handleUploadMainFile}
            style={{ display: "none" }}
            accept=".csv, .xlsx, .xls"
          />

          {/* Drop zone for uploading the file */}
          <div className={`drop-zone ${mainFileInfo ? "disabled" : ""}`}>
            <i className="upload-icon" />
            <p className="drop-zone-txt">
              Uniquement des fichiers <span>Excel</span> ou <span>CSV</span>
            </p>
          </div>

          <button
            className="btn-upload"
            disabled={!!mainFileInfo}
            onClick={() => mainFileInputRef.current.click()}
          >
            Ajouter
          </button>

          {/* Section that displays uploaded main file */}
          {mainFileInfo && (
            <div className="uploaded">
              <h4>Uploaded Files</h4>
              <div className="file">
                <i className="file-icon" />
                <div className="file-details">
                  <span className="file-name">{mainFileInfo.filename}</span>
                  <span className="file-size">{mainFileInfo.size_kb} kb</span>
                </div>
                {/* We will make this button work in a later step */}

                <button className="btn-delete" onClick={handleDeleteMainFile}>
                  <img src={DeletIcon} alt="Delete" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Section for uploading reference files */}
        <div className="upload-card">
          <h2 className="card-title">Fichiers de référence</h2>
          {/* Question about number of reference files */}
          <p className="pfichiersR"> Combien de fichiers de référence voulez-vous utiliser ?</p>

          {/* Buttons to choose how many reference files (1 to 5) */}
          <div className="ref-count">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                className={`ref-btn ${refCount === n ? "selected" : ""}`}
                onClick={() => handleSetRefCount(n)}
              >
                {n}
              </button>
            ))}
          </div>

          <input
            type="file"
            ref={refFileInputRef}
            onChange={handleUploadRefFile}
            style={{ display: "none" }}
            accept=".csv, .xlsx, .xls"
          />

          {/* Drop zone for uploading reference files */}
          <div className="drop-zone">
            <i className="upload-icon" />
            <p className="drop-zone-txt">
              Uniquement des fichiers <span>Excel</span> ou <span>CSV</span>
            </p>
          </div>

          {/* Button to add reference files */}
          <button
            className="btn-upload"
            disabled={refCount === 0 || refFilesInfo.length >= refCount}
            onClick={() => refFileInputRef.current.click()}
          >
            Ajouter
          </button>

          {/* Section that displays uploaded reference file */}
          {refFilesInfo.length > 0 && (
            <div className="uploaded">
              <h4>
                Uploaded Files ({refFilesInfo.length}/{refCount})
              </h4>
              {refFilesInfo.map((fileInfo, index) => (
                <div className="file" key={index}>
                  <i className="file-icon" />
                  <div className="file-details">
                    <span className="file-name">{fileInfo.filename}</span>
                    <span className="file-size">{fileInfo.size_kb} kb</span>
                  </div>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteRefFile(fileInfo)}
                  >
                    <img src={DeletIcon} alt="Delete" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation buttons at the bottom */}
      <div className="footer-buttons">
        {/* Button to cancel the action and go back */}
        <button className="btn-secondary" onClick={onBack}>
          Annuler l’action
        </button>

        {/* Button to go to the next step */}
        <button
          className="btn-primary"
          disabled={!isNextEnabled}
          onClick={onNext}
        >
          Étape Suivante
        </button>
      </div>
    </div>
  );
}

// Exporting the component so it can be used elsewhere
export default FileImport;
