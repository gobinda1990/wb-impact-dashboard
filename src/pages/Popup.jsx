import React from "react";
import  "./PopUp.css";

export default function Popup({ closePopup }) {
  return (
    <div className="popup-overlay">
      <div className="popup-box">

        <h3>Simple Popup</h3>
        <p>This is coming from another component.</p>

        <button className="close-btn" onClick={closePopup}>
          Close
        </button>

      </div>
    </div>
  );
}
