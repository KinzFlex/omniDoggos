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

function MintNFT() {
  const {
    payToMint,
    getUri,
    getAmtMinted,
    getContract,
    getMintRate,
    getStage,
    getTokensOfOwner,
    currentContract,
    currentAccount,
    isWalletConnected,
    connectWallet,
    onftSend
  } = useContext(NFTContext);
  const [amtMinted, setAmtMinted] = useState(0);
  const [mintRate, setMintRate] = useState(0.1);
  const [stage, setStage] = useState("locked");
  const [amountToMint, setAmountToMint] = useState(1);
  const { theme } = useTheme();
  const [hideButtons, setHideButtons] = useState(false);

  const state = useStore()[0];

  const scrollRef = useRef(null);
  const parentRef = useRef(null);

  const onMintNFT = async () => {
    await payToMint();
  };

  const onSendNFT = async () => {
    await onftSend();
  };

  const updateMint = async () => {
    if (currentAccount && currentContract) {
      const amtMinted_ = await getAmtMinted();
      setAmtMinted(amtMinted_.toString());
      const rate = await getMintRate();
      setMintRate(rate.toString());
    }
  };

  function handleTokenInput(event) {
    setAmountToMint(event.target.value);
  }

  // check if scrollRef container is overfilling its parentRef container
  const isScrollable = () => {
    const { current } = scrollRef;
    const { current: parent } = parentRef;
    if (current?.scrollWidth >= parent?.offsetWidth)
      return setHideButtons(false);
    return setHideButtons(true);
  };

  useEffect(async () => {
    await updateMint();
    isScrollable();
    window.addEventListener("resize", isScrollable);
    return () => {
      window.removeEventListener("resize", isScrollable);
    };
  }, []);

  const handleScroll = (direction) => {
    const { current } = scrollRef;

    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;

    if (direction === "left") {
      current.scrollLeft -= scrollAmount;
    } else {
      current.scrollLeft += scrollAmount;
    }
  };

  const reportError = (error) => {
    console.log(error.message);
    throw new Error("No ethereum object.");
  };

  //const tokenURIs = showOwnerNfts();
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
                  minted={amtMinted}
                  mintRate={mintRate}
                />
              </div>

              <Button
                btnName="Mint"
                btnType="primary"
                classStyles="rounded-xl"
                handleClick={onMintNFT}
              />
              <Button
                btnName="Send"
                btnType="primary"
                classStyles="rounded-xl"
                handleClick={onSendNFT}
              />
            </div>

            {/* <div className="p-20">
              <div className="absolute top-1000 right-40 left-10">
                <Image
                  src={images.Schrei}
                  width={130}
                  height={200}
                  layout="fixed"
                  className="rounded-full mr-4"
                />
              </div>
              <h2 className="text-center text-4xl font-bold text-gray-100">
                Take a look!
              </h2>
            </div>

            <div className="relative max-w-full flex">
              <div
                className="items-center relative max-w-full flex py-20 rounded-xl nft-gradient2"
                ref={parentRef}
              >
                <div
                  className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none"
                  ref={scrollRef}
                >
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      className="overflow-hidden flex-shrink-0"
                      key={i}
                      style={{
                        width: "50vw",
                        maxWidth: "800px",
                        height: "30vh",
                        maxHeight: "600px",
                      }}
                    >
                      <div className="flex-1 min-w-215 max-w-max xs:max-w-none sm:w-full sm:min-w-155 minmd:min-w-256 minlg:min-w-327 dark:bg-nft-black-3 bg-white rounded-2xl p-4 m-4 minlg:m-8 sm:my-2 sm:mx-2 cursor-pointer shadow-md">
                        <div className="relative w-full h-60 overflow-hidden">
                          <ReactPlayer
                            url={`https://ipfs.io/ipfs/QmPJhWibtmRYzmSZu1kxti7cUqH1TdXmKB5MGNoRv7s5ur/${i}.mp4`}
                            loop={true}
                            playing={true}
                            width="100%"
                            height="100%"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {!hideButtons && (
                    <>
                      <div
                        onClick={() => handleScroll("left")}
                        className="absolute w-16 h-16 minlg:w-12 minlg:h-12 top-45 cursor-pointer left-0"
                      >
                        <Image
                          src={images.left}
                          layout="fill"
                          objectFit="contain"
                          alt="left_arrow"
                          className={
                            theme === "light" ? "filter invert" : undefined
                          }
                        />
                      </div>
                      <div
                        onClick={() => handleScroll("right")}
                        className="absolute w-16 h-16 minlg:w-12 minlg:h-12 top-45 cursor-pointer right-0"
                      >
                        <Image
                          src={images.right}
                          layout="fill"
                          objectFit="contain"
                          alt="left_arrow"
                          className={
                            theme === "light" ? "filter invert" : undefined
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MintNFT;
