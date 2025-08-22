// src/components/StatusPage.jsx

import React, { useState, useEffect } from "react";
import Stepper from "./Stepper";
import "../css/StatusPage.css";
// import { API_URL } from "./apiConfig"; 

function StatusPage({ sessionId }) {
  const [jobStatus, setJobStatus] = useState("processing");
  const [results, setResults] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const checkStatus = async () => {
        try {
          const response = await fetch(`https://datasahel-api.onrender.com/status/${sessionId}`);
          if (!response.ok) throw new Error("Could not fetch status.");
          
          const data = await response.json();

          if (data.status === "completed") {
            setJobStatus("completed");
            setResults(data.results);
            clearInterval(intervalId);
          }
        } catch (error) {
          console.error(error);
          clearInterval(intervalId);
        }
      };
      checkStatus();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [sessionId]);

  return (
    <div className="status-container">
      <Stepper currentStep={4} />
      
      <div className="status-card">
        {jobStatus === "processing" ? (
          <>
            <h2>Traitement en cours...</h2>
            <p>Your files are being processed. This might take a few moments.</p>
            <div className="loader"></div>
          </>
        ) : (
          <>
            <h2>Traitement terminé !</h2>
            <p>Your files are ready for download.</p>
            <div className="download-links">
              {/* --- NEW: Smart Download Links --- */}
              {/* This checks for the results of the FIRST service */}
              {results?.full_output && (
                <a 
                  href={`https://datasahel-api.onrender.com/download/${sessionId}/${results.full_output}`}
                  className="download-button"
                >
                  Télécharger le fichier complet
                </a>
              )}
              {results?.summary_report && (
                <a 
                  href={`https://datasahel-api.onrender.com/download/${sessionId}/${results.summary_report}`}
                  className="download-button summary"
                >
                  Télécharger le résumé des changements
                </a>
              )}

              {/* This checks for the result of the NEW service */}
              {results?.output_file && (
                <a 
                  href={`https://datasahel-api.onrender.com/download/${sessionId}/${results.output_file}`}
                  className="download-button"
                >
                  Télécharger le fichier de sortie
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StatusPage;