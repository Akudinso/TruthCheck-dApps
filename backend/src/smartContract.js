import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

// Contract ABI (this is generated after you compile your contract)
// You can copy this ABI from the 'artifacts' folder in your Hardhat project after deployment
const contractABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "contentHash",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "result",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "FactChecked",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "factChecks",
      "outputs": [
        {
          "internalType": "string",
          "name": "result",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "contentHash",
          "type": "bytes32"
        }
      ],
      "name": "getFactCheck",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "result",
          "type": "string"
        },
        {
          "internalType": "bytes32",
          "name": "contentHash",
          "type": "bytes32"
        }
      ],
      "name": "storeFactCheck",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

// Set up provider and signer (private key should be in .env)
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Contract address (the one you deployed)
const contractAddress = "0x7423FD99697D884a9630E40eB440A4E60929e006";

const contract = new ethers.Contract(contractAddress, contractABI, signer);

// Function to store fact-check result
export const storeFactCheck = async (content, result) => {
  const contentHash = ethers.keccak256(ethers.toUtf8Bytes(content)); // Hash the content
  const tx = await contract.storeFactCheck(result, contentHash);
  await tx.wait(); // Wait for transaction to be mined
  return tx.hash;
};

// Function to retrieve fact-check result
export const getFactCheck = async (content) => {
  const contentHash = ethers.keccak256(ethers.toUtf8Bytes(content));
  const result = await contract.getFactCheck(contentHash);
  return result;
};
