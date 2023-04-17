import React, { useState } from "react";

const DataLogSidebar = ({ styles, messages }) => {
  return (
    <div style={{ width: '100%' }}>
      {messages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
    </div>
  );
};


export default DataLogSidebar;


/*
Here, we define a functional component called Sidebar that takes in the styles prop from the parent component. We also use the useState hook to manage the text state, initializing it with the string "Sidebar filler text".

Inside the Sidebar component, we render a div element with a paragraph element that displays the current text state.

To allow for updating the text from the backend, we also define a function called updateText that takes in new data and updates the text state with it. */
