import React, { useState } from "react";

const DataLogSidebar = ({ styles, messages }) => {
  return (
    <div  style={{...styles,
      width: "100%", height: "100%" }}>
      {messages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
    </div>
  );
};


export default DataLogSidebar;
