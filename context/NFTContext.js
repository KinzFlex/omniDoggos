import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { useStore } from "../hooks/Hook";
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
    try {
      if (!window.ethereum) return alert("Please install Metamask");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      reportError(error);
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
        console.log(networkId)

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

      let nftTxn = await contract.safeMint( currentAccount, 1);
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

  const onftSend = async () => {
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
      const tokenId = 1;
      console.log(toAddress)

      // get remote chain id
      const remoteChainId = CHAIN_ID["goerli"];

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

  const getAmtMinted = async () => {
    try {
      if (!window.ethereum) return alert("Please install Metamask");
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = await fetchContract(signer, currentNetwork);
      const amtMinted = await contract.getMintedTknsAmt();
      return amtMinted;
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
      const contract = fetchContract(signer, currentNetwork);
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
      const contract = fetchContract(signer, currentNetwork);
      //console.log(currentAccount);
      if (!currentAccount) {
        connectWallet();
      }
      const tokens = await contract.balanceOf(currentAccount);

      //console.log(tokens);
      return tokens.toString();
    } catch (error) {
      reportError(error);
    }
  };

  const getNewMintedTokenOfOwner = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = await fetchContract(signer, currentNetwork);
      //console.log(currentAccount);
      if (!currentAccount) {
        connectWallet();
      }
      const tokens = await contract.balanceOf(currentAccount);
      return tokens;
    } catch (error) {
      reportError(error);
    }
  };

  const getUri = async (tokenId) => {
    try {
      if (!window.ethereum) return alert("Please install Metamask");
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const contract = fetchContract(signer, currentNetwork);
      const uri = await contract.tokenURI(tokenId);
      //console.log(uri);
      return uri;
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
      console.log(tokenId);
      const uri = await contract.getURIPNG(tokenId);
      console.log(uri)
      return uri;
    } catch (error) {
      reportError(error);
    }
  };

  useEffect(() => {
    isWalletConnected().then(() => console.log("Blockchain Loaded"));
    getNetworkID();
  }, []);

  const reportError = (error) => {
    console.error(error.message);
    throw new Error("No ethereum object.");
  };

  return (
    <NFTContext.Provider
      value={{
        connectWallet,
        isWalletConnected,
        payToMint,
        setCurrentAccount,
        getUri,
        getMintRate,
        getAmtMinted,
        getTokensOfOwner,
        getNewMintedTokenOfOwner,
        currentAccount,
        getUriImage,
        getNetworkID,
        currentNetwork,
        onftSend
      }}
    >
      {children}
    </NFTContext.Provider>
  );
}
