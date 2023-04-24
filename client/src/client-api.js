//for client side api code
const API_URL = "http://localhost:5001";

// Function to create a new wallet
export async function createWallet(walletData) {
    console.log("createWallet called with data:", walletData); // Add this console log
    const response = await fetch(`${API_URL}/wallets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(walletData),
    });
  
    if (!response.ok) {
      throw new Error(`Error creating wallet: ${response.statusText}`);
    }
  
    const data = await response.json();
    return data;
  }
  // client-api.js

export const saveClaimData = async (walletAddress, timestamp) => {
    console.log("sending claim data to server:", walletAddress, timestamp);
    const response = await fetch("/claim", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ walletAddress, timestamp }),
    });
  
    if (!response.ok) {
      console.error("Error saving claim data:", response.statusText);
      throw new Error(response.statusText);
    }
  
    const data = await response.json();
    return data;
  };
  
  
// Function to update ActiveNFTs and ClaimCount
export async function updateData() {
  const response = await fetch("http://localhost:5001/update", {
    method: "PUT",
  });
  const data = await response.json();
  return data;
}

// Function to reset the database
export async function resetDatabase() {
  const response = await fetch("http://localhost:5001/reset", {
    method: "POST",
  });
  const data = await response.json();
  return data;
}

// Function to reset global variables
export async function resetGlobalVars() {
  const response = await fetch("http://localhost:5001/globalVars", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ActiveNFTCount: 0,
      ActiveWalletCount: 0,
      ClaimedNFTCount: 0,
    }),
  });
  const updatedGlobalVars = await response.json();
  return updatedGlobalVars;
}

export const fetchGlobalVars = async () => {
  try {
    const response = await fetch(`${API_URL}/globalVars`);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching global variables:", error);
    return null;
  }
};

export async function updateActiveTokenCountInDatabase(activeTokenCount) {
  const response = await fetch(`${API_URL}/updateActiveTokenCount`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ activeTokenCount }),
  });

  if (!response.ok) {
    throw new Error("Error updating active token count in database");
  }

  const data = await response.json();
  return data;
}

export async function updateGlobalVars(globalVars) {
  const response = await fetch("http://localhost:5001/globalVars", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(globalVars),
  });
  const updatedGlobalVars = await response.json();
  return updatedGlobalVars;
}

export const incrementActiveWalletCount = async () => {
  const response = await fetch(
    `${API_URL}/globalVars/incrementActiveWalletCount`,
    {
      method: "PATCH",
    }
  );
  return response.json();
};
