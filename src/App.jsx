// Import React and the useState hook
import React, { useState } from "react";

// Import all necessary components
import Dashboard from "./components/Dashboard.jsx";
import FileImport from "./components/FileImport.jsx";
import ColumnSection from "./components/ColumnSection.jsx";
import Traitement from "./components/Traitement.jsx"; // ✅ Imported here
import Navbar from "./components/Navbar.jsx";

// Main App component
function App() {
  // State to track which item is selected (e.g. a project or card index)
  const [selected, setSelected] = useState(null);

  // State to control which view/page is being displayed
  const [view, setView] = useState("dashboard");

  // Called when the user clicks "start" in the dashboard
  const handleStart = (index) => {
    setSelected(index);         // Store the selected item index
    setView("fileImport");      // Move to the file import step
  };

  // Called to return to the dashboard from file import
  const handleBack = () => {
    setSelected(null);          // Reset selection
    setView("dashboard");       // Go back to dashboard
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
        <FileImport onBack={handleBack} onNext={handleStepNext} />
      )}

      {/* Show column selection */}
      {view === "columnSection" && (
        <ColumnSection
          onBack={handleBackToFileImport}
          onNext={handleStepToTraitement} // ✅ Called when user proceeds to next step
        />
      )}

      {/* Show traitement step */}
      {view === "traitement" && <Traitement />}
    </div>
  );
}

// Export the App component
export default App;
