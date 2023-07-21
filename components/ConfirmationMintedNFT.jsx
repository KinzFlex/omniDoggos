import React, {useContext, useState, useEffect} from 'react';
import Image from 'next/image';
import { NFTContext } from "../context/NFTContext";
import { useStore } from "../hooks/Hook";
import { OwnerNfts } from '.';

const ConfirmationMintedNFT = ({ onClick_, image,}) => {
    const {
        getMintedTokenOfOwner,
        getUriImage
      } = useContext(NFTContext);
    const ImageURIs = [];
  const [ImageUri, setImageUri] = useState([]);
  const [TokenNumber, setTokenNumber] = useState(0);
  const dispatch = useStore()[1];

  const setShowConfirmationMintedNFT = (bShowConfirmationMintedNFT) => {
    dispatch("setShowConfirmationMintedNFT", bShowConfirmationMintedNFT);
  };

  const togglePopup = () => {
    setShowConfirmationMintedNFT(false);
  };

  const showOwnerNftImage = async () => {
    const tokens = await getMintedTokenOfOwner();
    console.log(tokens)
    setTokenNumber(tokens);
    const uri = await getUriImage(tokens);
    ImageURIs.push(uri);
  };

  useEffect(async () => {
    await showOwnerNftImage();
    setImageUri(ImageURIs);
  }, []);

  return(<div
    className={`fixed top-0 left-0 w-screen h-screen
    flex items-center justify-center bg-black 
    bg-opacity-50 transform transition-transform
    duration-300 overlay__background`} onClick={togglePopup}
  >
    <div
      className="flex flex-col justify-center
      items-center bg-[#151c25] shadow-xl
      shadow-[#961c0c] rounded-xl
      min-w-min px-10 pb-2"
    >
        
      <div className="flex flex-row justify-center items-center">
        
        <div className="fixed inset-0 z-10 flex justify-center items-center" />
        {ImageUri?.map((uri, i) => (
                    <div className="flex-col py-20 p-20 md:w-full">
                      <OwnerNfts
                        name={`OD# ${amtMinted + i + 1}`}
                        image={uri}
                        onClick_={() => togglePopup(i)}
                        key={i}
                      />
                    </div>
        ))
        }
      </div>
    </div>
  </div>)
};
export default ConfirmationMintedNFT;
