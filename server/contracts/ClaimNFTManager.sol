// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./GenerateWallets.sol";
import "./ClaimNFT.sol";

contract ClaimNFTManager {
    GenerateWallets private generateWallets;
    ClaimNFT private claimNFT;
    address private minter;

    constructor(address generateWalletsAddress, address claimNFTAddress) {
        generateWallets = GenerateWallets(generateWalletsAddress);
        claimNFT = ClaimNFT(claimNFTAddress);
        minter = msg.sender;
    }

    modifier onlyMinter() {
        require(msg.sender == minter, "Only the minter can change the minter address.");
        _;
    }

    function generateAndMint(uint256 numWallets) public {
        require(numWallets > 0, "Number of wallets to generate must be greater than 0.");
        generateWallets.generateWallets(numWallets);
        (, address[] memory publicKeys) = generateWallets.getWallets();

        for (uint256 i = 0; i < publicKeys.length; i++) {
            // Use a constant string as the tokenURI for each minted NFT
            bool success = claimNFT.mintClaimNFT(publicKeys[i], "Claimable Land");
            require(success, "Minting NFT failed for the given public key.");
        }
    }

}
