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
export const initiateFundTransfer = async (tokenId, userAddress) => {
  try {
    const response = await fetch(`${API_URL}/fundTransfer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tokenId, userAddress }),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error("Error calling fundTransfer API: " + error.message);
  }
};

export const getTokenIdByAddress = async (userAddress) => {
  try {
    const response = await fetch(API_URL + "/get-token-id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userAddress }),
    });

    if (!response.ok) {
      throw new Error("Failed to get token ID");
    }

    const data = await response.json();
    return data.tokenId;
  } catch (error) {
    console.error("Error in getTokenIdByAddress:", error);
    throw error;
  }
};

export async function executeClaim(tokenId, userAddress) {
  try {
    const response = await fetch(`${API_URL}/executeClaim`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tokenId, userAddress }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in executeClaim:", error);
    throw error;
  }
}

export async function mintClaimNFT(userAddress, tokenURI) {
  try {
    const response = await fetch(`${API_URL}/mintClaimNFT`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userAddress, tokenURI }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in mintClaimNFT:", error);
    throw error;
  }
}
export async function burnAllClaimNFTs() {
  try {
    const response = await fetch(`${API_URL}/burnAllClaimNFTs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in burnAllClaimNFTs:", error);
    throw error;
  }
}
export async function burnSpecificClaimNFTs(walletAddresses) {
  try {
    const response = await fetch(`${API_URL}/burnSpecificClaimNFTs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ walletAddresses }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in burnSpecificClaimNFTs:", error);
    throw error;
  }
}

export const saveClaimData = async (walletAddress, timestamp) => {
  console.log("sending claim data to server:", walletAddress, timestamp);
  const response = await fetch(`${API_URL}/claim`, {
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

// Function to reset the database
export async function resetDatabase() {
  try {
    const response = await fetch("http://localhost:5001/resetAll", {
      method: "POST",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error resetting database: ", error);
    throw error;
  }
}

export async function clearStoredClaims() {
  const response = await fetch("http://localhost:5001/resetClaims", {
    method: "POST",
  });
  const data = await response.json();
  return data;
}
export const getInitialWalletsWithCircleData = async () => {
  try {
    const response = await fetch("http://localhost:5001/wallets/initial-data");
    return await response.json();
  } catch (error) {
    console.error("Error fetching initial wallet data:", error);
    throw error;
  }
};

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
