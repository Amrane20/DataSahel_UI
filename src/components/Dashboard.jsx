// src/components/Dashboard.jsx

import React from "react";
import "../css/Dashboard.css";
import icon from "../assets/icon 3.svg";
import iconSecond from "../assets/icon 2.svg";
import iconOne from "../assets/icon 1.svg";

// 1. Add a unique 'id' for each service
const cards = [
  {
    id: "ruleBuilder", // This is the service we already built
    title: "Vérifier l’existence de données dans un autre fichier",
    description: "Vérifiez si une colonne de votre fichier correspond à une base de données",
    icon: <img src={iconOne} alt="icon" />,
  },
  {
    id: "createColumn", // This will be our new service
    title: "Copier une colonne d’un fichier vers un autre fichier",
    description: "Copiez une colonne depuis un fichier de référence en fonction d’une correspondance",
    icon: <img src={iconSecond} alt="icon" />,
  },
  {
    id: "addColumnWithRules", // Placeholder for the third service
    title: "Ajouter une colonne avec des règles personnalisées",
    description: "Créer une nouvelle colonne avec vos propres règles",
    icon: <img src={icon} alt="icon" />,
  },
];

function Dashboard({ onStart }) {
  return (
    <div className="dashboard-container">
      <div className="dashboard-inner">
        <h2 className="dashboard-title">
          Comment pouvons-nous <br /> vous aider aujourd’hui ?
        </h2>
        <div className="card-wrapper">
          {cards.map((card) => ( // Changed 'idx' to 'card.id' for a stable key
            <div key={card.id} className="card">
              <div className="card-center">
                <div className="card-icon">{card.icon}</div>
                <h3 className="card-title">{card.title}</h3>
                <p className="card-description">{card.description}</p>
              </div>
              {/* 2. Pass the card's unique 'id' to the onStart function */}
              <button className="card-button" onClick={() => onStart(card.id)}>
                Commencer
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;