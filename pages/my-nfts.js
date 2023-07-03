import { useState, useMemo, useCallback, useContext, useEffect } from "react";
import { useTheme } from "next-themes";
import { NFTContext } from "../context/NFTContext";
import { Button } from "../components";
import { OwnerNfts, OwnerNftsVideo } from "../components";
import Image from "next/image";
import images from "../assets";

const MyNFTs = () => {
  const {
    payToMint,
    getUri,
    getUriImage,
    getAmtMinted,
    getContract,
    getTokensOfOwner,
    currentAccount,
    currentContract,
    isWallectConnected,
    connectWallet,
  } = useContext(NFTContext);
  const [amtMinted, setAmtMinted] = useState(0);
  const ImageURIs = [];
  const VideoURIs = [];
  const [ImageUri, setImageUri] = useState([]);
  const [VideoUri, setVideoUri] = useState([]);
  const [tokenId, setTokenId] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const togglePopup = (index) => {
    setTokenId(index);
    setIsOpen(!isOpen);
  };

  const saveTokenId = (id) => {
    setTokenId(id);
  };

  const showOwnerNftImages = async () => {
    if (currentAccount && currentContract) {
      const tokens = await getTokensOfOwner();
      for (let i = 1; i <= tokens; i++) {
        const uri = await getUriImage(i);
        ImageURIs.push(uri);
      }
    }
  };

  const showOwnerNftVideos = async () => {
    if (currentAccount && currentContract) {
      const tokens = await getTokensOfOwner();
      for (let i = 1; i <= tokens; i++) {
        const uri = await getUri(i);
        VideoURIs.push(uri);
      }
    }
  };

  useEffect(async () => {
    await showOwnerNftImages();
    setImageUri(ImageURIs);
    await showOwnerNftVideos();
    setVideoUri(VideoURIs);
    //console.log(VideoURIs);
  }, []);

  const reportError = (error) => {
    console.error(error.message);
    throw new Error("No ethereum object.");
  };

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="mt-3 w-full flex flex-wrap justify-center md:justify-center">
        {ImageUri?.map(
          (uri, i) => (
            <OwnerNfts
              name={`SQ ${i + 1}`}
              image={uri}
              onClick_={() => togglePopup(i)}
              key={i}
            />
          )

          // <div
          //   className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"

          // ></div>
        )}

        {isOpen && (
          <div className="fixed inset-0 z-10 flex justify-center items-center">
            <div
              className="absolute inset-0 bg-gray-900 opacity-50"
              onClick={togglePopup}
            ></div>
            <OwnerNftsVideo
              name={`SQ ${tokenId + 1}`}
              video={VideoUri[tokenId]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyNFTs;
