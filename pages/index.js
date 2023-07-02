import { useEffect, useState, useRef, useContext } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Banner, CreatorCard, NFTCard, SearchBar } from "../components";

import images from "../assets";
import { makeid } from "../utils/makeId";

const Home = () => {
  // const { fetchNFTs } = useContext(NFTContext);
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hideButtons, setHideButtons] = useState(false);
  const [activeSelect, setActiveSelect] = useState("Recently Added");

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-full minmd:w-4/5">
        <div className="relative max-w-full flex-col p-20">
          <div className="flexCenter flex-col">
              <div>
                <Image
                  src={images.Doggo}
                  width={200}
                  height={200}
                />
              </div>

              <div className="flexCenter font-bold text-5xl font-poppins leading-70 text-black">
                The Omni Doggos story
              </div>
              <div>
                <Image
                  src={images.Arrow_big}
                  width={300}
                  height={300}
                />
              </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
