// src/components/StatusPage.jsx

import React, { useState, useEffect } from "react";
import Stepper from "./Stepper";
import "../css/StatusPage.css"; // We will create this file next

function StatusPage({ sessionId }) {
  // State to store the job status and results from the API
  const [jobStatus, setJobStatus] = useState("processing");
  const [results, setResults] = useState(null);

  useEffect(() => {
    // This timer will call the API every 3 seconds
    const intervalId = setInterval(() => {
      const checkStatus = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/status/${sessionId}`);
          if (!response.ok) throw new Error("Could not fetch status.");
          
          const data = await response.json();

          // When the job is done, update the state and stop the timer
          if (data.status === "completed") {
            setJobStatus("completed");
            setResults(data.results);
            clearInterval(intervalId); // Stop checking
          }
        } catch (error) {
          console.error(error);
          clearInterval(intervalId); // Stop checking on error
        }
      };

      checkStatus();
    }, 3000); // Check every 3 seconds

    // Cleanup function to stop the timer if the user navigates away
    return () => clearInterval(intervalId);
  }, [sessionId]); // Rerun if sessionId changes

  return (
    <div className="status-container">
      <Stepper currentStep={4} />
      
      <div className="status-card">
        {jobStatus === "processing" ? (
          <>
            <h2>Traitement en cours...</h2>
            <p>Your files are being processed. This might take a few moments.</p>
            <div className="loader"></div> {/* Simple loading spinner */}
          </>
        ) : (
          <>
            <h2>Traitement terminé !</h2>
            <p>Your files are ready for download.</p>
            <div className="download-links">
              {/* Link to download the full output file */}
              <a 
                href={`http://127.0.0.1:8000/download/${sessionId}/${results.full_output}`}
                className="download-button"
              >
                Télécharger le fichier complet
              </a>
              {/* Link to download the summary report */}
              <a 
                href={`http://127.0.0.1:8000/download/${sessionId}/${results.summary_report}`}
                className="download-button summary"
              >
                Télécharger le résumé des changements
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StatusPage;