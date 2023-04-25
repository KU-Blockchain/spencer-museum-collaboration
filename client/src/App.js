import ClaimComponent from "./pages/ClaimComponent";
import MovingCircles from "./components/MovingCircles";
import DataLogSidebar from "./components/DataLogSidebar";
import GenerateComponent from "./pages/GenerateComponent";
import Timer from "./components/Timer";
import About from "./pages/About";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Web3 from "web3";
import ClaimNFTABI from "./ABI/ClaimNFT.json";
import io from 'socket.io-client';
const socket = io('http://localhost:5001', {
  withCredentials: true,
  extraHeaders: {
    'my-custom-header': 'abcd'
  }
});

const App = () => {
  const [consoleLogMessages, setConsoleLogMessages] = useState([]);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [data, setData] = useState(0);

  useEffect(() => {
    const connectMetamask = async () => {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        console.log("MetaMask is not installed.");
        return;
      }

      // Connect MetaMask and enable accounts
      const web3Instance = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWeb3(web3Instance);
      setAccount(accounts[0]);

      // Set up the contract
      const contractInstance = new web3Instance.eth.Contract(
        ClaimNFTABI.abi,
        "0x5104c25aa45c48774ea1f540913c8fdefe386606"
      );
      setContract(contractInstance);
    };
    connectMetamask();
  }, []);

  const generateToApp = (childdata) => {
    setData(childdata);
  };

  const logMessage = (message) => {
    console.log(message);
    setConsoleLogMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <Router>
      <div style={appStyles.container}>
        <header style={appStyles.header}>
          From the University of Kansas Blockchain Institute in collaboration
          with the Spencer Museum of Art
        </header>

        <div style={appStyles.contentContainer}>
          <div style={appStyles.leftSection}>
            <div style={appStyles.navContainer}>
              <Link to="/" style={appStyles.navLink}>
                About
              </Link>
              <Link to="/generate" style={appStyles.navLink}>
                Generate
              </Link>
              <Link to="/claim" style={appStyles.navLink}>
                Claim
              </Link>
            </div>
            <div style={appStyles.content}>
              <Routes>
                <Route path="/" element={<About styles={appStyles} />} />
                <Route
                  path="/generate"
                  element={
                    <GenerateComponent
                      styles={appStyles}
                      logMessage={logMessage}
                      sendtoApp={generateToApp}
                      web3={web3}
                      contract={contract}
                      account={account}
                    />
                  }
                />
                <Route
                  path="/claim"
                  element={
                    web3 ? (
                      <ClaimComponent
                        styles={appStyles}
                        logMessage={logMessage}
                        web3={web3}
                        contract={contract}
                        account={account}
                      />
                    ) : (
                      <p>Loading...</p>
                    )
                  }
                />
              </Routes>
            </div>
          </div>
          <div style={appStyles.rightSection}>
          <Timer contract={contract} />
            <MovingCircles styles={appStyles} numcircles={data} />
            <DataLogSidebar
              styles={appStyles}
              messages={consoleLogMessages}
              web3={web3}
              contract={contract}
              account={account}
            />
          </div>
        </div>
      </div>
    </Router>
  );
};

const appStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    margin: "0 0 10px 0",
    width: "100%",
    height: "100px",
    backgroundColor: "#E5E5E5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    outline: "1px solid #000000",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  leftSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "50%",
    maxHeight: "calc(100vh - 100px)", 
  },
  rightSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "50%",
    maxHeight: "calc(100vh - 100px)", 
  },
  navContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "10px 0",
  },
  navLink: {
    textDecoration: "none",
    color: "#000",
    padding: "10px 20px",
    margin: "0 10px",
    backgroundColor: "#BFEFFF",
    borderRadius: "5px",
    fontWeight: "bold",
    outline: "2px solid #000000",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  circleContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "10px",
  },
  circle: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#F9C2FF",
    margin: "0 10px",
    outline: "2px solid #000000",
  },
  rectangle: {
    width: "200px",
    height: "50px",
    backgroundColor: "#BFEFFF",
    outline: "2px solid #000000",
  },
  title: {
    margin: "0 0 10px 0",
    fontWeight: "bold",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#FFD1A4",
    borderRadius: "20px",
    border: "none",
    fontWeight: "bold",
    outline: "2px solid #000000",
  },
  sidebar: {
    maxHeight: "45vh",
    position: "relative",
    backgroundColor: "#e6f9ff",
    padding: "20px",
    fontFamily: "Courier New, monospace",
    outline: "2px solid #000000",
    width: "90%",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1, // This will make the sidebar take up the remaining space
    overflowY: "scroll", // Make the messages container scrollable
  },
};

export default App;
