// Importing the React library to use JSX and create a component
import React from "react";

// Importing the CSS file for styling the Dashboard component
import "../css/Dashboard.css";

// Importing SVG icons used in the cards
import icon from "../assets/icon 3.svg";
import iconSecond from "../assets/icon 2.svg";
import iconOne from "../assets/icon 1.svg";

// Defining an array of objects that represent the cards to be displayed on the dashboard
const cards = [
  {
    // Title of the first card
    title: "Vérifier l’existence de données dans un autre fichier",
    // Description of the first card
    description: "Vérifiez si une colonne de votre fichier correspond à une base de données",
    // Icon for the first card (image component using imported SVG)
    icon: <img src={iconOne} alt="icon" />,
  },
  {
    // Title of the second card
    title: "Copier une colonne d’un fichier vers un autre fichier",
    // Description of the second card
    description: "Copiez une colonne depuis un fichier de référence en fonction d’une correspondance",
    // Icon for the second card
    icon: <img src={iconSecond} alt="icon" />,
  },
  {
    // Title of the third card
    title: "Ajouter une colonne avec des règles personnalisées",
    // Description of the third card
    description: "Vérifiez si une colonne de votre fichier correspond à une base de données",
    // Icon for the third card
    icon: <img src={icon} alt="icon" />,
  },
];

// Defining the Dashboard functional component, which receives the `onStart` function as a prop
function Dashboard({ onStart }) {
  return (
    // Main container of the dashboard
    <div className="dashboard-container">
      {/* Inner wrapper for layout/styling */}
      <div className="dashboard-inner">
        {/* Main heading of the dashboard */}
        <h2 className="dashboard-title">
          Comment pouvons-nous <br /> vous aider aujourd’hui ?
        </h2>

        {/* Wrapper for the cards */}
        <div className="card-wrapper">
          {/* Mapping over the cards array to generate each card dynamically */}
          {cards.map((card, idx) => (
            // Each card has a unique key based on its index
            <div key={idx} className="card">
              {/* Centered content of the card (icon, title, description) */}
              <div className="card-center">
                {/* Display the card icon */}
                <div className="card-icon">{card.icon}</div>
                {/* Display the card title */}
                <h3 className="card-title">{card.title}</h3>
                {/* Display the card description */}
                <p className="card-description">{card.description}</p>
              </div>
              {/* Button to start an action; triggers `onStart` with the card index */}
              <button className="card-button" onClick={() => onStart(idx)}>
                Commencer
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Exporting the Dashboard component so it can be used in other files
export default Dashboard;
