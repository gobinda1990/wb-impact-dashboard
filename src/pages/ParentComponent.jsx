import React, { useState } from "react";
import ChildComponent from "./ChildComponent";
import Popup from "./PopUp";

export default function ParentComponent() {

  const [showPopup, setShowPopup] = useState(false);

  const openPopup = () => setShowPopup(true);
  const closePopup = () => setShowPopup(false);

  return (
    <>
      <h2>Parent Component</h2>

      {/* Child triggers popup */}
      <ChildComponent openPopup={openPopup} />

      {/* Popup */}
      {showPopup && <Popup closePopup={closePopup} />}
    </>
  );
}
