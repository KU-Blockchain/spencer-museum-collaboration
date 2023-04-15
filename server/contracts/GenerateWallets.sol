// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GenerateWallets {
    using Address for address;
    using SafeMath for uint256;
    using ECDSA for bytes32;
    using Strings for uint256;

    event WalletGenerated(
        address indexed owner,
        bytes32 indexed privateKey,
        address indexed publicKey
    );

    struct Wallet {
        bytes32 privateKey;
        address publicKey;
    }

    mapping(address => Wallet[]) private wallets;

    function generateWallets(uint256 numWallets) public {
        for (uint256 i = 0; i < numWallets; i++) {
            bytes32 privateKey = keccak256(
                abi.encodePacked(msg.sender, i, block.number, block.timestamp)
            );

            address publicKey = address(uint160(uint256(privateKey)));

            wallets[msg.sender].push(
                Wallet({privateKey: privateKey, publicKey: publicKey})
            );

            emit WalletGenerated(msg.sender, privateKey, publicKey);
        }
    }

    function getWallets()
        public
        view
        returns (bytes32[] memory, address[] memory)
    {
        uint256 numWallets = wallets[msg.sender].length;
        bytes32[] memory privateKeys = new bytes32[](numWallets);
        address[] memory publicKeys = new address[](numWallets);

        for (uint256 i = 0; i < numWallets; i++) {
            Wallet storage wallet = wallets[msg.sender][i];

            privateKeys[i] = wallet.privateKey;
            publicKeys[i] = wallet.publicKey;
        }

        return (privateKeys, publicKeys);
    }
}
