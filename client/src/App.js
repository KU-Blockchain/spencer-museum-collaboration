import ClaimComponent from "./pages/ClaimComponent";
import MovingCircles from "./components/MovingCircles";
import DataLogSidebar from "./components/DataLogSidebar";
import GenerateComponent from "./pages/GenerateComponent";
import About from "./pages/About";
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

const App = () => {
  const [consoleLogMessages, setConsoleLogMessages] = useState([]);

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
                    />
                  }
                />
                <Route
                  path="/claim"
                  element={
                    <ClaimComponent
                      styles={appStyles}
                      logMessage={logMessage}
                    />
                  }
                />
              </Routes>
            </div>
          </div>
          <div style={appStyles.rightSection}>
            <MovingCircles styles={appStyles} />
            <DataLogSidebar styles={appStyles} messages={consoleLogMessages} />
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
  },
  rightSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "50%",
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
    position: "relative",
    width: "25%",
    backgroundColor: "#e6f9ff", /* lighter shade of blue */
    padding: "20px",
    fontFamily: "Courier New, monospace", /* font used in programming */
    outline: "2px solid #000000",
}

};

export default App;
