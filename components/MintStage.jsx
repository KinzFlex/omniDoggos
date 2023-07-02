import React from 'react';


const MintStage = ({ parentStyles, stage, minted, mintRate}) => (
    <div className={`relative w-full flex items-center z-0 overflow-hidden nft-gradient ${parentStyles}`}>
      <div className="absolute flex justify-between w-full px-10" style={{ top: '+40px' , right: '10px'}}>
        <div className={`w-48 h-48 sm:w-32 sm:h-32 rounded-full ${stage == 'Phase One' ? 'black-bg' : 'white-bg'}`} >
          <div className="text-center font-bold text-2xl mt-12">
            Phase 1
          </div>
          <div className="text-center text-l">
            {minted}/1
          </div>
          <div className="text-center text-l">
            0.1E
          </div>
        </div>
        <div className={`w-48 h-48 sm:w-32 sm:h-32 rounded-full ${stage == 'Phase Two' ? 'black-bg' : 'white-bg'}`} >
          <div className="text-center font-bold text-2xl mt-12">
            Phase 2
          </div>
          <div className="text-center text-l">
            {minted}/2
          </div>
          <div className="text-center text-l">
            0.15E
          </div>
        </div>
        <div className={`w-48 h-48 sm:w-32 sm:h-32 rounded-full ${stage == 'Phase Three' ? 'black-bg' : 'white-bg'}`} >
          <div className="text-center font-bold text-2xl mt-12">
            Phase 3
          </div>
          <div className="text-center text-l">
            {minted}/4
          </div>
          <div className="text-center text-l">
            0.2E
          </div>
        </div>
        <div className={`w-48 h-48 sm:w-32 sm:h-32 rounded-full ${stage == 'Phase Four' ? 'black-bg' : 'white-bg'}`} >
          <div className="text-center font-bold text-2xl mt-12">
            Phase 4
          </div>
          <div className="text-center text-l">
            {minted}/6
          </div>
          <div className="text-center text-l">
            0.25E
          </div>
        </div>
      </div>
      {/* <div className="absolute w-48 h-48 sm:w-32 sm:h-32 rounded-full white-bg -top-18 -left-20 -z-5" />
      <div className="absolute w-48 h-48 sm:w-32 sm:h-32 rounded-full white-bg -top-18 -left-50 -z-5" />
      <div className="absolute w-48 h-48 sm:w-32 sm:h-32 rounded-full white-bg -top-18 -right-48 -z-5" />
      <div className="absolute w-48 h-48 sm:w-32 sm:h-32 rounded-full white-bg -top-18 -right-96 -z-5" /> */}
    </div>
);

export default MintStage;
