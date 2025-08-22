// App.jsx (Updated for Multiple Services)

import React, { useState } from "react";
import Dashboard from "./components/Dashboard.jsx";
import FileImport from "./components/FileImport.jsx";
import ColumnSection from "./components/ColumnSection.jsx";
import Traitement from "./components/Traitement.jsx";
import StatusPage from "./components/StatusPage.jsx";
import CreateColumnPage from "./components/CreateColumnPage.jsx"; // 1. Import the new component
import Navbar from "./components/Navbar.jsx";
import { API_URL } from "../apiConfig"; 

function App() {
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("dashboard");
  const [selectedService, setSelectedService] = useState(null);

  const [mainKey, setMainKey] = useState(null);
  const [refKeys, setRefKeys] = useState(null);

  // 3. Update handleStart to accept and store the service ID
  const handleStart = async (serviceId) => {
    setSelectedService(serviceId);
    
    try {
      const response = await fetch(`${API_URL}/start-session`);
      if (!response.ok) throw new Error("Failed to start session.");
      const data = await response.json();
      setSelected(data.session_id);
      setView("fileImport");
    } catch (error) {
      alert("Could not start a new session.");
    }
  };

  const handleBack = () => {
    setSelected(null);
    setSelectedService(null);
    setMainKey(null); 
    setRefKeys(null); 
    setView("dashboard");
  };

  const handleStepNext = () => setView("columnSection");
  const handleBackToFileImport = () => setView("fileImport");

  // 4. This new function intelligently navigates to the correct page
  const handleColumnSelectionNext = (mainFileKey, refFileKeys) => {
    setMainKey(mainFileKey); 
    setRefKeys(refFileKeys); 
    if (selectedService === 'ruleBuilder') {
      setView("traitement");
    } else if (selectedService === 'createColumn') {
      setView("createColumnPage");
    }
  };
  
  const handleGoToStatus = () => setView("statusPage");

  return (
    <div>
      <Navbar onNavigate={(target) => setView(target)} />

      {view === "dashboard" && (
        <Dashboard onStart={handleStart} />
      )}
      
      {view === "fileImport" && (
        <FileImport
          onBack={handleBack}
          onNext={handleStepNext}
          sessionId={selected}
        />
      )}
      
      {view === "columnSection" && (
        <ColumnSection
          onBack={handleBackToFileImport}
          onNext={handleColumnSelectionNext} 
          sessionId={selected}
        />
      )}
      
      {view === "traitement" && (
        <Traitement
          sessionId={selected}
          onNext={handleGoToStatus}
          onBack={() => setView("columnSection")}
        />
      )}

      {view === "createColumnPage" && (
        <CreateColumnPage
          sessionId={selected}
          mainFileKey={mainKey}
          refFileKeys={refKeys}
          onNext={handleGoToStatus}
          onBack={() => setView("columnSection")}
        />
      )}

      {view === "statusPage" && <StatusPage sessionId={selected} />}
    </div>
  );
}

export default App;