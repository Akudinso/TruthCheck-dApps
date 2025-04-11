// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TruthCheckStorage {
    struct FactCheck {
        string result;
        uint256 timestamp;
    }

    mapping(bytes32 => FactCheck) public factChecks;

    event FactChecked(bytes32 indexed contentHash, string result, uint256 timestamp);

    function storeFactCheck(string calldata result, bytes32 contentHash) external {
        require(bytes(result).length > 0, "Result cannot be empty");
        factChecks[contentHash] = FactCheck(result, block.timestamp);
        emit FactChecked(contentHash, result, block.timestamp);
    }

    function getFactCheck(bytes32 contentHash) external view returns (string memory, uint256) {
        FactCheck memory f = factChecks[contentHash];
        return (f.result, f.timestamp);
    }
}
