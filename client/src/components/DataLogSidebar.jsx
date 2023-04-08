import React, { useState } from "react";

const DataLogSidebar = ({ styles }) => {
  const [text, setText] = useState("Sidebar filler text Sidebar filler textSidebar filler textSidebar filler textSidebar filler text"); // initial text state
  // function to update text based on data from backend
  const updateText = (data) => {
    setText(data);
  };

  return (
    <div style={{ width: '100%'}}>
      <p>{text}</p>
    </div>
  );
};

export default DataLogSidebar;


/*
Here, we define a functional component called Sidebar that takes in the styles prop from the parent component. We also use the useState hook to manage the text state, initializing it with the string "Sidebar filler text".

Inside the Sidebar component, we render a div element with a paragraph element that displays the current text state.

To allow for updating the text from the backend, we also define a function called updateText that takes in new data and updates the text state with it. */
