// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ClaimNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Mapping to track if an address already has an NFT
    mapping(address => bool) private _addressHasNFT;
    mapping(uint256 => uint256) private _activeTokenIdIndex;
    mapping(uint256 => bool) private _isTokenClaimed;
    mapping(address => uint256) private _addressToTokenId;

    uint256 private _activeTokenCount;

    // Event to be emitted when land is claimed
    event LandClaimed(address indexed claimer, uint256 indexed tokenId);

    constructor() ERC721("ClaimNFT", "CLNFT") {}

    function mintClaimNFT(
        address to,
        string memory tokenURI
    ) public returns (bool) {
        require(!_addressHasNFT[to], "This address already has a ClaimNFT.");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        _addressHasNFT[to] = true;
        _addressToTokenId[to] = newTokenId; // Store the token ID associated with the address

        // Add the new token ID to the active tokens mapping and increment the active token count
        _activeTokenIdIndex[_activeTokenCount] = newTokenId;
        _activeTokenCount += 1;

        return true;
    }

    // Function to get the details (ClaimableLand) of a specific token
    function getDetails(uint256 tokenId) public view returns (string memory) {
        return tokenURI(tokenId);
    }

    function claimLand(uint256 tokenId, address sender) public {
        require(
            ownerOf(tokenId) == sender,
            "Only the owner can claim the land."
        );
        require(
            !_isTokenClaimed[tokenId],
            "This token has already been claimed."
        );

        emit LandClaimed(sender, tokenId);

        _isTokenClaimed[tokenId] = true;
    }

    function isTokenClaimed(uint256 tokenId) public view returns (bool) {
        return _isTokenClaimed[tokenId];
    }

    function activeTokenIdByIndex(uint256 index) public view returns (uint256) {
        require(index < _activeTokenCount, "Index out of range.");
        return _activeTokenIdIndex[index];
    }

    function activeTokenCount() public view returns (uint256) {
        return _activeTokenCount;
    }

    function addressToTokenId(address account) public view returns (uint256) {
        return _addressToTokenId[account];
    }

    // Function to burn all NFTs and reset the total number of instances of this contract to 0
    function BurnReset() public {
        for (uint256 tokenId = 1; tokenId <= _tokenIds.current(); tokenId++) {
            if (_exists(tokenId)) {
                address tokenOwner = ownerOf(tokenId);
                _burn(tokenId);
                _addressHasNFT[tokenOwner] = false;
                _isTokenClaimed[tokenId] = false; // Reset the claimed status of the token
            }
        }
        _tokenIds.reset();
    }

    function burnSpecificNFTs(address[] memory walletAddresses) public {
        for (uint256 i = 0; i < walletAddresses.length; i++) {
            address walletAddress = walletAddresses[i];
            if (_addressHasNFT[walletAddress]) {
                uint256 tokenId = _addressToTokenId[walletAddress]; // Get the token ID associated with the address
                _burn(tokenId);
                _addressHasNFT[walletAddress] = false;
                _isTokenClaimed[tokenId] = false;
            }
        }
    }

    // Function to get the total number of instances of this contract/NFT
    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }
}
