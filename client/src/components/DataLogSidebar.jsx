import React, { useState, useEffect } from "react";
import { fetchGlobalVars } from "../api";
// Custom useInterval hook for setting an interval
function useInterval(callback, delay) {
  const savedCallback = React.useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const DataLogSidebar = ({ styles, messages }) => {
  const [displayedMessages, setDisplayedMessages] = useState(["Logged messages will appear here: "]);
  const [messageQueue, setMessageQueue] = useState(messages);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [globalVars, setGlobalVars] = useState({
    ActiveNFTCount: 0,
    ActiveWalletCount: 0,
    ClaimedNFTCount: 0,
  });

  useEffect(() => {
    setMessageQueue((prevQueue) => [...prevQueue, ...messages.slice(prevQueue.length)]);
  }, [messages]);
 // Fetch global variables and update the state
  useEffect(() => {
    const fetchAndSetGlobalVars = async () => {
      const fetchedGlobalVars = await fetchGlobalVars();
      if (fetchedGlobalVars) {
        setGlobalVars(fetchedGlobalVars);
      }
    };

    fetchAndSetGlobalVars();
  }, []); // Add any dependencies here if needed

  useInterval(() => {
    if (currentMessageIndex < messageQueue.length) {
      const originalMessage = messageQueue[currentMessageIndex];
      const displayedMessage = displayedMessages[currentMessageIndex] || "";

      if (displayedMessage.length < originalMessage.length) {
        setDisplayedMessages((prevDisplayedMessages) => {
          const newDisplayedMessages = [...prevDisplayedMessages];
          newDisplayedMessages[currentMessageIndex] = displayedMessage + originalMessage[displayedMessage.length];
          return newDisplayedMessages;
        });
      } else {
        setCurrentMessageIndex((prevIndex) => prevIndex + 1);
      }
    }
  }, 50); // Adjust the typing speed by changing this value (milliseconds)

  return (
    <div
      style={{
        ...styles.sidebar,
        /*position: "fixed",*/
        width: "90%",
        height: "20%",
        overflow: "scroll",
        resize: "none",
      }}
    >
      {/* Add a box to display the global variables */}
      <div style={{ border: "1px solid black", padding: "1rem", marginBottom: "1rem" }}>
        <p>Active NFT Count: {globalVars.ActiveNFTCount}</p>
        <p>Active Wallet Count: {globalVars.ActiveWalletCount}</p>
        <p>Claimed NFT Count: {globalVars.ClaimedNFTCount}</p>
      </div>
      {displayedMessages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
    </div>
  );
};

export default DataLogSidebar;
