// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract OwnershipNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct LandParcel {
        string location;
        uint256 area;
        string legalDescription;
    }

    mapping(uint256 => LandParcel) private _landParcels;

    constructor() ERC721("OwnershipNFT", "ONFT") {}

    function mint(
        address to,
        string memory location,
        uint256 area,
        string memory legalDescription
    ) public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(to, newTokenId);

        LandParcel memory newLandParcel = LandParcel({
            location: location,
            area: area,
            legalDescription: legalDescription
        });

        _landParcels[newTokenId] = newLandParcel;
        return newTokenId;
    }

    function getLandParcel(uint256 tokenId) public view returns (LandParcel memory) {
        require(_exists(tokenId), "OwnershipNFT: Query for nonexistent token");
        return _landParcels[tokenId];
    }
}
