// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ClaimNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Mapping to track if an address already has an NFT
    mapping(address => bool) private _addressHasNFT;

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
        return true;
    }

    // Function to get the details (ClaimableLand) of a specific token
    function getDetails(uint256 tokenId) public view returns (string memory) {
        return tokenURI(tokenId);
    }

    // Add the `address sender` parameter to the claimLand function
    function claimLand(uint256 tokenId, address sender) public {
        // Check if the sender is the NFT owner
        require(
            ownerOf(tokenId) == sender,
            "Only the owner can claim the land."
        );

        emit LandClaimed(sender, tokenId);

        _burn(tokenId);
        _addressHasNFT[sender] = false;
    }

    // Function to burn all NFTs and reset the total number of instances of this contract to 0
    function BurnReset() public {
        for (uint256 tokenId = 1; tokenId <= _tokenIds.current(); tokenId++) {
            if (_exists(tokenId)) {
                address tokenOwner = ownerOf(tokenId);
                _burn(tokenId);
                _addressHasNFT[tokenOwner] = false;
            }
        }
        _tokenIds.reset();
    }

    // Function to get the total number of instances of this contract/NFT
    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }
}
