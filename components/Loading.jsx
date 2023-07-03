import { NFTContext } from '../context/NFTContext';
import Image from "next/image";
import {
     useState, useMemo, useCallback, useContext,
   } from 'react';
   import Logogif from "../assets/SqueezeLogoAE.gif";


 const Loading = () => {
   const { loading } = useContext(NFTContext);

   return (
     <div
       className={`fixed top-0 left-0 w-screen h-screen
       flex items-center justify-center bg-black 
       bg-opacity-50 transform transition-transform
       duration-300 overlay__background`}
     >
       <div
         className="flex flex-col justify-center
         items-center bg-[#151c25] shadow-xl
         shadow-[#961c0c] rounded-xl
         min-w-min px-10 pb-2"
       >
         <div className="flex flex-row justify-center items-center">
           <div className="lds-dual-ring scale-50" />
           <Image
          src={Logogif}
          height={400}
          width={400}
          alt={`A cute gif!`}
          unoptimized={true}
        />
         </div>
       </div>
     </div>
   );
 };

 export default Loading;
