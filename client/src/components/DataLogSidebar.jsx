import React, { useState, useEffect, useCallback } from "react";
import {
  fetchGlobalVars,
  updateActiveTokenCountInDatabase,
} from "../client-api";

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

const DataLogSidebar = ({ web3, contract, account, styles, messages }) => {
  const messagesContainerRef = React.useRef();

  const [displayedMessages, setDisplayedMessages] = useState([
    "Logged messages will appear here: ",
  ]);

  const [messageQueue, setMessageQueue] = useState(messages);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [globalVars, setGlobalVars] = useState({
    ActiveNFTCount: "",
    ActiveWalletCount: "",
    ClaimedNFTCount: "",
  });

  const getActiveTokenCountFromContract = useCallback(async () =>{
    if (contract) {
      try {
        const activeTokenCount = await contract.methods.totalSupply().call();
        return activeTokenCount;
      } catch (error) {
        console.error(
          "Error fetching active token count from contract:",
          error
        );
      }
    }
    return 0;
  });

  useEffect(() => {
    setMessageQueue((prevQueue) => [
      ...prevQueue,
      ...messages.slice(prevQueue.length),
    ]);
  }, [messages]);
  useEffect(() => {
    const updateTokenCountInDatabase = async () => {
      // Get the active token count from the smart contract
      const activeTokenCount = await getActiveTokenCountFromContract();

      // Update the active token count in the database
      await updateActiveTokenCountInDatabase(activeTokenCount);
    };

    updateTokenCountInDatabase();
  }, [contract, getActiveTokenCountFromContract]);


  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [displayedMessages]);

  useEffect(() => {
    const fetchAndSetGlobalVars = async () => {
      const fetchedGlobalVars = await fetchGlobalVars();
      if (fetchedGlobalVars) {
        setGlobalVars(fetchedGlobalVars);
      }
    };

    const intervalId = setInterval(() => {
      fetchAndSetGlobalVars();
    }, 7000); // Update the global variables every 7 seconds

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Keep the dependency array empty

  useInterval(() => {
    if (currentMessageIndex < messageQueue.length) {
      const originalMessage = messageQueue[currentMessageIndex];
      const displayedMessage = displayedMessages[currentMessageIndex] || "";

      if (displayedMessage.length < originalMessage.length) {
        setDisplayedMessages((prevDisplayedMessages) => {
          const newDisplayedMessages = [...prevDisplayedMessages];
          newDisplayedMessages[currentMessageIndex] =
            displayedMessage + originalMessage[displayedMessage.length];
          return newDisplayedMessages;
        });
      } else {
        setCurrentMessageIndex((prevIndex) => prevIndex + 1);
      }
    }
  }, 50); // Adjust the typing speed by changing this value (milliseconds)

  return (
    <>
      {/* Add a box to display the global variables */}
      <div
        style={{
          ...styles.variableContainer,
        }}
      >
        <p>
          <strong>Active NFT Count: {globalVars.ActiveNFTCount}</strong>
        </p>
        <p>
          <strong>Active Wallet Count: {globalVars.ActiveWalletCount}</strong>
        </p>
        <p>
          <strong>Claimed NFT Count: {globalVars.ClaimedNFTCount}</strong>
        </p>
      </div>
      <div
        style={{
          ...styles.sidebar,
        }}
      >
        <div
          ref={messagesContainerRef}
          style={{
            // Adjust the height value as needed
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          {displayedMessages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
      </div>
    </>
  );
};

export default DataLogSidebar;
