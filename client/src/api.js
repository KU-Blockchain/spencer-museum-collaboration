// Function to create a new wallet
export async function createWallet(walletData) {
    try {
      console.log('walletData', walletData);
      const response = await fetch('http://localhost:5001/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(walletData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('data: ', data);
      return data;
    } catch (error) {
      console.error('Error in createWallet:', error);
      throw error;
    }
  }
  
  
  // Function to update ActiveNFTs and ClaimCount
export async function updateData() {
    const response = await fetch('http://localhost:5001/update', {
      method: 'PUT',
    });
    const data = await response.json();
    return data;
  }
  
  // Function to reset the database
export async function resetDatabase() {
    const response = await fetch('http://localhost:5001/reset', {
      method: 'POST',
    });
    const data = await response.json();
    return data;
  }


export async function fetchGlobalVars() {
    const response = await fetch('http://localhost:5001/globalVars');
    const globalVars = await response.json();
    return globalVars;
  }
  
export async function updateGlobalVars(globalVars) {
    const response = await fetch('http://localhost:5001/globalVars', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(globalVars),
    });
    const updatedGlobalVars = await response.json();
    return updatedGlobalVars;
  }
  
  