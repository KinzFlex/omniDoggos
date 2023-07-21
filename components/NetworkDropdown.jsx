import React, { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import images from '../assets';
import { NFTContext } from '../context/NFTContext';
const CHAIN_ID = require("../constants/chainIds.json");

const SwitchNetworkLogos = ({ tokenId_, networkId_ }) => {
  const { onftSend } = useContext(NFTContext);

  const handleSendNft = async (networkId, tokenId) => {
    console.log(CHAIN_ID["arbitrum-goerli"])
    await onftSend(tokenId, networkId);
    setShowNetworkPopup(false);
  };


  switch (networkId_) {
    
    case 5:
      return (
        <div className="relative w-full h-20 sm:h-36 xs:h-56  minmd:h-60 minlg:h-300 rounded-2xl overflow-hidden">
          <div className="button-container">
            <button onClick={() => handleSendNft(CHAIN_ID["arbitrum-goerli"], tokenId_)} className="network-button">
              Send to Arbitrum
            </button>
          </div>

          <div className="button-container">
            <button onClick={() => handleSendNft(CHAIN_ID["bsc-testnet"], tokenId_)} className="network-button">
              Send to BSC
            </button>
          </div>

          <div className="button-container">
            <button onClick={() => handleSendNft(CHAIN_ID["optimism-goerli"], tokenId_)} className="network-button">
              Send to OP
            </button>
          </div>
        </div>
      );
    case 420:
      return [images.Arb, images.Bsc, images.Eth];
    case 421613:
      return [images.Eth, images.Bsc, images.Op];
    case 97:
      return [images.Arb, images.Eth, images.Op];
    default:
      return (
        <div className="items-center justify-center flex-1 min-w-215 max-w-max xs:max-w-none sm:w-full sm:min-w-155 minmd:min-w-256 minlg:min-w-327 dark:bg-nft-black-3 bg-white rounded-2xl p-4 m-4 minlg:m-8 sm:my-2 sm:mx-2 cursor-pointer shadow-md">
          <div className="relative w-ful h-full sm:h-36 xs:h-56  minmd:h-60 minlg:h-300 rounded-2xl overflow-hidden">
            <div className="button-container">
              <button onClick={() => handleSendNft("Arbitrum")} className="network-button">
                Send to Arbitrum
              </button>
            </div>

            <div className="button-container">
              <button onClick={() => handleSendNft("BSC")} className="network-button">
                Send to BSC
              </button>
            </div>

            <div className="button-container">
              <button onClick={() => handleSendNft("OP")} className="network-button">
                Send to OP
              </button>
            </div>
          </div>
        </div>
      );
  }
};

const NetworkDropdown = ({ onClick_, networkId, tokenId }) => {
  const { setShowNetworkPopup } = useContext(NFTContext);

  return (
    <div className="relative flex-1 min-w-215 max-w-max xs:max-w-none sm:w-full sm:min-w-155 minmd:min-w-256 minlg:min-w-327 dark:bg-nft-black-3 bg-white rounded-2xl p-4 m-4 minlg:m-8 sm:my-2 sm:mx-2 cursor-pointer shadow-md">
      <div className="w-full h-full sm:h-36 xs:h-56  minmd:h-60 minlg:h-300 rounded-2xl overflow-hidden">
        <SwitchNetworkLogos
          tokenId_={tokenId}
          networkId_={networkId}
        />
      </div>

      <div className="mt-3 flex flex-col">
        <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl">{name}</p>
      </div>
    </div>
  );
};

export default NetworkDropdown;



// import React, {useContext} from 'react';
// import Image from 'next/image';
// import Link from 'next/link';

// import images from '../assets';
// import { NFTContext } from '../context/NFTContext';
// const CHAIN_ID = require("../constants/chainIds.json")


// const handleSendNft = async (networkId, tokenId) => {
//     const {
//         onftSend
//       } = useContext(NFTContext);

      
//     await onftSend(tokenId, networkId);
//     setShowNetworkPopup(false);
//   };

// const SwitchNetworkLogos = ({ tokenId_, networkId_ }) => {
//     switch (networkId_) {
//       case 5:
//         return(
//                 <div className="relative w-full h-20 sm:h-36 xs:h-56  minmd:h-60 minlg:h-300 rounded-2xl overflow-hidden">
//                     <div className="button-container">
//                     <button onClick={() => handleSendNft(CHAIN_ID["abritrum-goerli"], tokenId_)} className="network-button">
//                         Send to Arbitrum
//                     </button>
//                     </div>

//                     <div className="button-container">
//                     <button onClick={() => handleSendNft(CHAIN_ID["bsc-testnet"], tokenId_)} className="network-button">
//                         Send to BSC
//                     </button>
//                     </div>

//                     <div className="button-container">
//                     <button onClick={() => handleSendNft(CHAIN_ID["optimism-goerli"], tokenId_)} className="network-button">
//                         Send to OP
//                     </button>
//                     </div>
//                 </div>

//         )
//       case 420:
//         return [images.Arb, images.Bsc, images.Eth];
//       case 421613:
//         return [images.Eth, images.Bsc, images.Op]
//       case 97:
//         return [images.Arb, images.Eth, images.Op];
//       default:
//         return(
//             <div className="items-center justify-center flex-1 min-w-215 max-w-max xs:max-w-none sm:w-full sm:min-w-155 minmd:min-w-256 minlg:min-w-327 dark:bg-nft-black-3 bg-white rounded-2xl p-4 m-4 minlg:m-8 sm:my-2 sm:mx-2 cursor-pointer shadow-md">
//             <div className="relative w-ful h-full sm:h-36 xs:h-56  minmd:h-60 minlg:h-300 rounded-2xl overflow-hidden">
//                 <div className="button-container">
//                 <button onClick={() => handleNetworkSelection("Arbitrum")} className="network-button">
//                     Send to Arbitrum
//                 </button>
//                 </div>

//                 <div className="button-container">
//                 <button onClick={() => handleNetworkSelection("BSC")} className="network-button">
//                     Send to BSC
//                 </button>
//                 </div>

//                 <div className="button-container">
//                 <button onClick={() => handleNetworkSelection("OP")} className="network-button">
//                     Send to OP
//                 </button>
//                 </div>
//             </div>
//             </div>
//         )
//     }
//   };

// const NetworkDropdown = ({ onClick_, networkId, tokenId }) => (
//     <div className="relative flex-1 min-w-215 max-w-max xs:max-w-none sm:w-full sm:min-w-155 minmd:min-w-256 minlg:min-w-327 dark:bg-nft-black-3 bg-white rounded-2xl p-4 m-4 minlg:m-8 sm:my-2 sm:mx-2 cursor-pointer shadow-md">
//       <div className="w-full h-full sm:h-36 xs:h-56  minmd:h-60 minlg:h-300 rounded-2xl overflow-hidden">
//         <SwitchNetworkLogos 
//             tokenId_={tokenId}
//             networkId_={networkId}
//         />

//       </div>

//       <div className="mt-3 flex flex-col">
//         <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl">{name}</p>
//       </div>
//     </div>

//   //</Link>
// );
// export default NetworkDropdown;
