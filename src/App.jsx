// Import React and the useState hook
import React, { useState } from "react";

// Import all necessary components
import Dashboard from "./components/Dashboard.jsx";
import FileImport from "./components/FileImport.jsx";
import ColumnSection from "./components/ColumnSection.jsx";
import Traitement from "./components/Traitement.jsx"; // ✅ Imported here
import Navbar from "./components/Navbar.jsx";
import StatusPage from "./components/StatusPage.jsx";

// Main App component
function App() {
  // State to track which item is selected (e.g. a project or card index)
  const [selected, setSelected] = useState(null);

  // State to control which view/page is being displayed
  const [view, setView] = useState("dashboard");

  // Called when the user clicks "Commencer-btn" in the dashboard
  const handleStart = async () => {
    console.log("sarting a new session...");

    try {
      const response = await fetch("http://127.0.0.1:8000/start-session");

      if (!response.ok) {
        throw new Error("Failed to start session on the server.");
      }

      const data = await response.json();
      const newSessionId = data.session_id;
      console.log("session started successfully! Session_Id:", newSessionId);

      setSelected(newSessionId);
      setView("fileImport");
    } catch (error) {
      console.log("Error Starting session:", error);
      alert("Could not Start a new session. please try again later.");
    }
  };

  // Called to return to the dashboard from file import
  const handleBack = () => {
    setSelected(null); // Reset selection
    setView("dashboard"); // Go back to dashboard
  };

  // Called to move from file import to column selection
  const handleStepNext = () => {
    setView("columnSection");
  };

  // Called to go back from column section to file import
  const handleBackToFileImport = () => {
    setView("fileImport");
  };

  // Called to move from column section to traitement
  const handleStepToTraitement = () => {
    setView("traitement");
  };

  const handleGoToStatus = () => {
    setView("statusPage");
  };

  // Render different components depending on the current view
  return (
    <div>
      {/* Top navigation bar */}
      <Navbar onNavigate={(target) => setView(target)} />

      {/* Show dashboard if nothing is selected */}
      {view === "dashboard" && selected === null && (
        <Dashboard onStart={handleStart} />
      )}

      {/* Show file import if something is selected */}
      {view === "fileImport" && selected !== null && (
        <FileImport
          onBack={handleBack}
          onNext={handleStepNext}
          sessionId={selected}
        />
      )}

      {/* Show column selection */}
      {view === "columnSection" && (
        <ColumnSection
          onBack={handleBackToFileImport}
          onNext={handleStepToTraitement} // ✅ Called when user proceeds to next step
          sessionId={selected}
        />
      )}

      {/* Show traitement step */}
      {view === "traitement" && (
        <Traitement
          sessionId={selected}
          onNext={handleGoToStatus}
          onBack={() => setView("columnSection")} // It's good to add the back button logic too
        />
      )}

      {view === "statusPage" && <StatusPage sessionId={selected} />}
    </div>
  );
}

// Export the App component
export default App;
