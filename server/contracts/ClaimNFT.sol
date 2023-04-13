// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ClaimNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Mapping to track if an address already has an NFT
    mapping(address => bool) private _addressHasNFT;

    // Event to be emitted when land is claimed
    event LandClaimed(address indexed claimer, uint256 indexed tokenId);

    constructor() ERC721("ClaimNFT", "CLNFT") {}

    // Function to mint a new ClaimNFT with a ClaimableLand property
    function mintClaimNFT(address to, string memory tokenURI) public onlyOwner {
        require(!_addressHasNFT[to], "This address already has a ClaimNFT.");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        _addressHasNFT[to] = true;
    }

    // Function to get the details (ClaimableLand) of a specific token
    function getDetails(uint256 tokenId) public view returns (string memory) {
        return tokenURI(tokenId);
    }

    // Function to claim land and burn the NFT
    function claimLand(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Only the owner can claim the land.");
        
        emit LandClaimed(msg.sender, tokenId);

        _burn(tokenId);
        _addressHasNFT[msg.sender] = false;
    }
}

/*
Contract description: 

Importing necessary OpenZeppelin contracts: ERC721URIStorage, Counters, and Ownable.
The contract ClaimNFT inherits from ERC721URIStorage and Ownable.
The _tokenIds counter is used to keep track of token IDs.
The _addressHasNFT mapping is used to track if an address already has an NFT.
The LandClaimed event is emitted when land is claimed.
The constructor sets the name and symbol for the ERC721 token.
The mintClaimNFT function mints a new ClaimNFT with a ClaimableLand property. It can only be called by the contract owner and checks if the recipient address already has an NFT.
The getDetails function returns the details (ClaimableLand) of a specific token.
The claimLand function allows the NFT owner to claim land and burns the NFT. It also emits the LandClaimed event.
*/