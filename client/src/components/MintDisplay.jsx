
function MintDisplay() {
    return(
      <>
      <div style={{textAlign:"center"}}>
        Email Thing
      </div>
        
        <div style={{
          display:"flex",
          columnGap:"400px",
          marginLeft:"20%"
        }}>
          <div style={{
            display:"inline-block"
          }}>
          <div><input type={Text} className="email-box"></input></div>
  
          <div><input type={Text} className="email-box"></input></div>
  
          <div><input type={Text} className="email-box"></input></div>
  
          <div><input type={Text} className="email-box"></input></div>
  
          <div><input type={Text} className="email-box"></input></div>
  
          </div>
          <div>
            <div style={{
            display:"inline-block",
            justifyContent:"center",
            paddingTop:"60px"
            }}><button className="Mint-Button">Mint</button></div>
          </div>
        </div>
  
        
        
      
      </>
    );
    
  
  }
  
  export default MintDisplay;