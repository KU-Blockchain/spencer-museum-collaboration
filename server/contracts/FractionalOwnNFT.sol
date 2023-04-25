// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract FractionalOwnNFT is ERC20 {
    address private _owner;
    IERC721 public nft;
    uint256 public nftTokenId;

    constructor(address nftAddress, uint256 _nftTokenId, uint256 initialSupply) ERC20("FractionalizedNFT", "FNFT") {
        _owner = msg.sender;
        nft = IERC721(nftAddress);
        nftTokenId = _nftTokenId;

        // Transfer the NFT to this contract
        nft.transferFrom(_owner, address(this), nftTokenId);

        // Mint the initial ERC-20 tokens representing fractional ownership
        _mint(_owner, initialSupply);
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        require(msg.sender == _owner, "FractionalizedNFT: Only owner can transfer tokens");
        return super.transfer(recipient, amount);
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        require(sender == _owner, "FractionalizedNFT: Only owner can transfer tokens");
        return super.transferFrom(sender, recipient, amount);
    }

    function redeem() public {
        require(msg.sender == _owner, "FractionalizedNFT: Only owner can redeem the NFT");
        require(balanceOf(_owner) == totalSupply(), "FractionalizedNFT: Owner must hold all tokens to redeem the NFT");

        // Transfer the NFT back to the owner
        nft.transferFrom(address(this), _owner, nftTokenId);
    }
}
