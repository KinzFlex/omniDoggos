import React, {
  useState,
  useRef,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useStore } from "../hooks/Hook";
import { useTheme } from "next-themes";
import ReactPlayer from "react-player";

import { NFTContext } from "../context/NFTContext";
import { Button, MintDetails, MintStage } from "../components";
import { OwnerNfts } from "../components";
import Image from "next/image";
import images from "../assets";
import LoadingAnimation from "../components/Loading";
import ConfirmationMintedNFT from "../components/ConfirmationMintedNFT";
import NetworkDropdown from "../components/NetworkDropdown";

function MintNFT() {
  const {
    payToMint,
    onftSend,
    getAmtMinted,
    getMintRate,
    getTokensOfOwner,
    currentAccount,
    currentContract,
    getContract,
    getMintedTokenOfOwner,
    getUriImage, 
    currentNetwork,
    isWalletConnected,
    getTokenId
  } = useContext(NFTContext);

  const ImageURIs = [];
  const [ImageUri, setImageUri] = useState([]);
  const [amtMinted, setAmtMinted] = useState(0);
  const [mintRate, setMintRate] = useState(0.1);
  const [showNetworkPopup, setShowNetworkPopup] = useState(false);
  const [networksToSend, setNetworksToSend] = useState([]);
  const [token, setTokenId] = useState(0);
  const tokenIdArray_ = [];
  const [tokenIdArray, setTokenIdArray] = useState([]);

  const state = useStore()[0];

  const onMintNFT = async () => {
    await payToMint();
  };
 
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleSendButtonClick = (tokenId_) => {
    console.log(tokenId_)
    setTokenId(tokenId_);
    if(showNetworkPopup == false) {
      setShowNetworkPopup(true);
    }
    else {
      setShowNetworkPopup(false);
    }
      
  };
  
  const showOwnerNftImages = async () => {
    const tokens = await getTokensOfOwner();
    console.log(tokens)
    if (tokens > 0) {
      // console.log(tokens)
      const tokenArray = await getMintedTokenOfOwner();
      for (let i = 1; i <= tokens; i++) {
        const uri_ = await getUriImage(i);
        const id = await getTokenId(i)
        ImageURIs.push(uri_);
        tokenIdArray_.push(id)
      }
      setImageUri(ImageURIs);
      setTokenIdArray(tokenIdArray_);
    }

  };

  const updateMint = async () => {
    const amtMinted_ = await getAmtMinted();
    setAmtMinted(amtMinted_);
    const rate = await getMintRate();
    setMintRate(rate.toString()); 
  };

  useEffect(() => {
    isWalletConnected()
      .then(() => {
        updateMint();
        showOwnerNftImages();
    })
    
  }, []);

  const reportError = (error) => {
    console.log(error.message);
    throw new Error("No ethereum object.");
  };

  return (
    <div className="flex-col flex justify-center px-20 sm:px-2 p-8">
      {state.showLoadingAnimation && <LoadingAnimation />}
      {state.showConfirmationMintedNFT && <ConfirmationMintedNFT />}

      <div className="relative max-w-full flex-col p-20">
        <div className="relative max-w-full flex-col px-20">
          <div className="relative max-w-full flex-col rounded-2xl">
            <div className="flex-col py-20 p-20 md:w-full">
              <div className="relative">
                <MintDetails
                  minted={amtMinted.toString()}
                  mintRate={mintRate}
                />
              </div>

              <Button
                btnName="Mint"
                btnType="primary"
                classStyles="rounded-xl"
                handleClick={onMintNFT}
              />

            </div>
            <div className="mt-3 w-full flex flex-wrap justify-center md:justify-center">
              {ImageUri?.map(
                (uri, i) => (
                  <div className="flex-col py-20 p-20 md:w-full">
                    <OwnerNfts
                      name={`OD# ${tokenIdArray[i]}`}
                      image={uri}
                      onClick_={() => togglePopup()}
                      key={i}
                    />

                    <Button
                      btnName="Send"
                      btnType="primary"
                      classStyles="rounded-xl"
                      handleClick={() => handleSendButtonClick(tokenIdArray[i])}
                      //handleClick={onSendNFT}
                    />
                  </div>
                )

                // <div
                //   className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"

                // ></div>
              )}
            </div>

          </div>
        </div>
      </div>
      {showNetworkPopup && (
        <div className={`top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 transform transition-transformduration-300 overlay__background`}>
          <NetworkDropdown
            tokenId={token} 
            networkId={currentNetwork}
          />
          
        </div>
      )}
    </div>
  );
}

export default MintNFT;
