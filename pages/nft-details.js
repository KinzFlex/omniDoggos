import { useState, useMemo, useCallback, useContext, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { NFTContext } from "../context/NFTContext";
import { Button, OwnerNfts } from "../components";

import images from "../assets";

function NFTDetails({ id }) {
  const {
    payToMint,
    getUri,
    getUriImage,
    getAmtMinted,
    getContract,
    getTokensOfOwner,
    currentContract,
    isWallectConnected,
    connectWallet,
  } = useContext(NFTContext);
  const { theme } = useTheme();
  const uri = "";

  const showNft = async (id) => {
    console.log(id);
    const uri = await getUri(id);
    console.log(uri);
    return uri;
  };

  useEffect(async () => {
    const tokenURI = await showNft(id);
  }, []);

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-3/5 md:w-full">
        <h1 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl">
          Your Squeeze NFTs
        </h1>
      </div>
      <div className="relative flex-1 max-w-full flex mt-3">
        <Image
          className="w-4 h-4 rounded-full mr-4"
          src="https://ipfs.io/ipfs/QmWBns1qkyoBU6VBPDdJ3roKYDmQemJ5BjMrc1Bs4o4A2Q"
          layout="fill"
          objectFit="contain"
          alt="left_arrow"
          className={theme === "light" ? "filter invert" : undefined}
        />
      </div>
      <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
        {/* <OwnerNfts name={`SQ ${1}`} image={uri} /> */}
      </div>
    </div>
  );
}
export default NFTDetails;
