import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { useStore } from "../hooks/Hook";
import axios from 'axios';

const covalentApi = axios.create({
  baseURL: 'https://api.covalenthq.com/v1',
});
const CHAIN_ID = require("../constants/chainIds.json")

import { MintAddressEth, MintAddressABIArb, MintAddressABIEth, MintAddressArb, MintAddressOp, MintAddressABIOp, MintAddressABIBsc, MintAddressBsc } from "./constants";

const fetchContract = async (signerOrProvider, networkId) => {
  switch (networkId) {
    case 5:
      return new ethers.Contract(MintAddressEth, MintAddressABIEth, signerOrProvider);
    case 420:
      return new ethers.Contract(MintAddressOp, MintAddressABIOp, signerOrProvider);
    case 421613:
      return new ethers.Contract(MintAddressArb, MintAddressABIArb, signerOrProvider);
    case 97:
      return new ethers.Contract(MintAddressBsc, MintAddressABIBsc, signerOrProvider);
    default:
      return new ethers.Contract(MintAddressArb, MintAddressABIArb, signerOrProvider);
  }
}


const fetchNFTs = async (address, network) => {
  try {
    const data = [];
    let headers = new Headers();
    headers.set('Authorization', "Bearer cqt_rQpGTx8gD8HBMbf4PTmGVWtCbdT9")

    await fetch(`https://api.covalenthq.com/v1/${network}/address/${address}/balances_v2/nft=true/`, {method: 'GET', headers: headers})
      .then((resp) => resp.json())
      .then((data) => console.log(data));
    console.log(data)
    return data;
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return [];
  }
}

export const NFTContext = React.createContext();

export function NFTProvider({ children }) {
  const [currentAccount, setCurrentAccount] = useState("");
  const [currentContract, setContract] = useState("");
  const [currentNetwork, setNetwork] = useState(0);


  const dispatch = useStore()[1];
  const Web3 = require("web3");

  const setShowLoadingAnimation = (bShowLoadingAnimation) => {
    dispatch("setShowLoadingAnimation", bShowLoadingAnimation);
  };

  const setShowConfirmationMintedNFT = (bShowConfirmationMintedNFT) => {
    dispatch("setShowConfirmationMintedNFT", bShowConfirmationMintedNFT);
  };

  const isWalletConnected = async () => {
    if (!window.ethereum) return alert("Please install MetaMask.");

    const accounts = await window.ethereum.request({ method: "eth_accounts" });

    if (accounts.length) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log("No accounts found");
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install MetaMask.');

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    setCurrentAccount(accounts[0]);
    window.location.reload();
  };

  const getContract = async () => {
    try {
      if (!window.ethereum) return alert("Please install Metamask");
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const networkId = await web3.eth.net.getId();
      const contract = await fetchContract(signer, networkId);
      setContract(contract);
      console.log(currentContract);
      return contract;
    } catch (error) {
      reportError('Error connecting to wallet or accessing network.');
      console.error(error);
    }
  };

  const getNetworkID = async () => {
    try {
      // Check if the web3 provider (wallet) is available
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);

        // Request user's permission to access their wallet
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Get the current network ID
        const networkId = await web3.eth.net.getId();

        setNetwork(networkId);
      } else {
        reportError('Web3 not available. Make sure you have a compatible wallet installed.');
      }
    } catch (error) {
      reportError('Error connecting to wallet or accessing network.');
      console.error(error);
    }
  };



  const payToMint = async () => {
    try {
      setShowLoadingAnimation(true);
      if (!window.ethereum) return alert("Please install Metamask");
      const web3 = new Web3(Web3.givenProvider);
      const amtToMint = 1;
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = await fetchContract(signer, currentNetwork);
      const mintRate = 0;
      console.log(contract)
      console.log(currentAccount)

      const totalAmountToPay = mintRate * amtToMint;

      let nftTxn = await contract.safeMint( currentAccount );
      await nftTxn.wait();
      setShowLoadingAnimation(false), setShowConfirmationMintedNFT(true);

      // The event object contains the verbatim log data, the
      // EventFragment and functions to fetch the block,
      // transaction and receipt and event functions
    } catch (error) {
      setShowLoadingAnimation(false);
      reportError(error);
    }
  };

  const onftSend = async (tokenId_, networkId_) => {
    try {
      setShowLoadingAnimation(true);
      if (!window.ethereum) return alert("Please install Metamask");
      const web3 = new Web3(Web3.givenProvider);
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = await fetchContract(signer, currentNetwork);
      const owner = currentAccount;
      const toAddress = owner;
      const tokenId = tokenId_;

      // get remote chain id
      const remoteChainId = networkId_;

      console.log(tokenId)
      console.log(remoteChainId)

      // quote fee with default adapterParams
      const adapterParams = ethers.utils.solidityPack(["uint16", "uint256"], [1, 200000]) // default adapterParams example

      const fees = await contract.estimateSendFee(remoteChainId, toAddress, tokenId, false, adapterParams)
      const nativeFee = fees[0]
      console.log(`native fees (wei): ${nativeFee}`)

      const tx = await contract.sendFrom(
          owner,                  // 'from' address to send tokens
          remoteChainId,                  // remote LayerZero chainId
          toAddress,                      // 'to' address to send tokens
          tokenId,                        // tokenId to send
          owner,                  // refund address (if too much message fee is sent, it gets refunded)
          ethers.constants.AddressZero,   // address(0x0) if not paying in ZRO (LayerZero Token)
          adapterParams,                  // flexible bytes array to indicate messaging adapter services
          { value: nativeFee.mul(5).div(4) }
      )
      setShowLoadingAnimation(false), setShowConfirmationMintedNFT(true);

      // The event object contains the verbatim log data, the
      // EventFragment and functions to fetch the block,
      // transaction and receipt and event functions
    } catch (error) {
      setShowLoadingAnimation(false);
      reportError(error);
    }
  };

  const getNFTsOfOwnerByNetwork = async (network) => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      //const nfts = await fetchNFTs(currentAccount, network);
      console.log('NFTs:', nfts);
      return nfts;
    } catch (error) {
      reportError(error);
    }
  };



  const getAmtMinted = async () => {
    try {
      if (!window.ethereum) return alert("Please install Metamask");
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const networkId = await web3.eth.net.getId();
      const contract = await fetchContract(signer, networkId);
      const minted = await contract.nextMintId();
      console.log(minted.toString());
      return minted.toString();
    } catch (error) {
      reportError(error);
    }
  };

  const getMintRate = async () => {
    try {
      if (!window.ethereum) return alert("Please install Metamask");
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const networkId = await web3.eth.net.getId();
      const contract = await fetchContract(signer, networkId);
      const mintRate = await contract.getMintRate();
      return ethers.utils.formatEther(mintRate.toString());
    } catch (error) {
      reportError(error);
    }
  };

  const getTokensOfOwner = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const networkId = await web3.eth.net.getId();
      const contract = await fetchContract(signer, networkId);
      await isWalletConnected();
      console.log(contract)
      const tokens = await contract.balanceOf(currentAccount);
      console.log(tokens)
      return tokens.toString();
    } catch (error) {
      reportError(error);
    }
  };


  const getMintedTokenOfOwner = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const networkId = await web3.eth.net.getId();
      const contract = await fetchContract(signer, networkId);
      await isWalletConnected();
      console.log(currentAccount.toString())
      const tokenIds = await contract.getTokenIdsOfOwner(currentAccount.toString());

      return tokenIds;
    } catch (error) {
      reportError(error);
    }
  };


  const getTokenId = async (tokenId) => {
    try {
      if (!window.ethereum) return alert("Please install Metamask");
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = await fetchContract(signer, currentNetwork);
      const uri = await contract.tokenURI(tokenId);
      const response = await fetch(uri);
      const json = await response.json();
      const id = json.tokenId;
      return id;
    } catch (error) {
      reportError(error);
    }
  };

  const getUriImage = async (tokenId) => {
    try {
      if (!window.ethereum) return alert("Please install Metamask");
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const contract = await fetchContract(signer, currentNetwork);
      const uri = await contract.tokenURI(tokenId);
      const response = await fetch(uri);
      const json = await response.json();
      const image = json.image;
      return image;
    } catch (error) {
      reportError(error);
    }
  };

  
  const getListOfNFTsWithOwners = async () => {
    try {
      if (!window.ethereum) return alert("Please install Metamask");
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const contract = await fetchContract(signer, currentNetwork);
      const listOfOwners = await contract.getListOfNFTsWithOwners();
      console.log(listOfOwners)
      return listOfOwners;
    } catch (error) {
      reportError(error);
    }
  };


 

  useEffect(() => {
    isWalletConnected().then(() => console.log("Blockchain Loaded"));
    getNetworkID();
    getContract();
    
  }, []);

  const reportError = (error) => {
    console.error(error.message);
    throw new Error("No ethereum object.");
  };

  return (
    <NFTContext.Provider
      value={{
        isWalletConnected,
        payToMint,
        setCurrentAccount,
        getAmtMinted,
        getTokensOfOwner,
        currentAccount,
        currentContract,
        currentNetwork,
        getNetworkID,
        onftSend,
        getMintRate,
        getContract,
        getMintedTokenOfOwner,
        getUriImage,
        getTokenId
      }}
    >
      {children}
    </NFTContext.Provider>
  );
}
