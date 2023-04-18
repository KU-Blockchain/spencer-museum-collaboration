import React, { useState, useEffect } from "react";

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

  useEffect(() => {
    setMessageQueue((prevQueue) => [...prevQueue, ...messages.slice(prevQueue.length)]);
  }, [messages]);

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
        width: "100%",
        height: "100%",
      }}
    >
      {displayedMessages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
    </div>
  );
};

export default DataLogSidebar;
