import React from 'react';
import ParticipantCircleDisplay from './components/ParticipantCircleDisplay';
import MintDisplay from './components/MintDisplay';
import ClaimDisplay from './components/ClaimDisplay';
import MovingCircles from './components/MovingCircles';

const App = () => {
  return (
    <div style={appStyles.container}>
   
      <header style={appStyles.header}>From the University of Kansas Blockchain Institute in collaboration with the Spencer Museum of Art</header>
      
      <div style={{...appStyles.section,  marginBottom: '10px', borderBottom: '1px solid black'}}>
        <MovingCircles styles={appStyles} />
      </div>
      <div style={{...appStyles.section, marginBottom: '10px', borderBottom: '1px solid black'}}>
        <MintDisplay styles={appStyles}/>
      </div>
      <div style={{...appStyles.section, borderBottom: 'none'}}>
        <ClaimDisplay styles={appStyles}/>
      </div>
    </div>
  );
};

const appStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    margin: '0 0 10px 0',
    width: '100%',
    height: '100px',
    backgroundColor: '#E5E5E5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    outline: '1px solid #000000',
    
  },
  section: {
    width: '100%',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  circleContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '10px',
  },
  circle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#F9C2FF',
    margin: '0 10px',
    outline: '2px solid #000000',
  },
  rectangle: {
    width: '200px',
    height: '50px',
    backgroundColor: '#BFEFFF',
    outline: '2px solid #000000',
  },
  title: {
    margin: '0 0 10px 0',
    fontWeight: 'bold',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#FFD1A4',
    borderRadius: '20px',
    border: 'none',
    fontWeight: 'bold',
    outline: '2px solid #000000',
  },
};

export default App;
