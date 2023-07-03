import { useState, useEffect } from "react";

let globalState = {
  showLoadingAnimation: false,
  showConfirmationMintedNFT: false,
};

let listeners = [];

let actions = {
  setShowLoadingAnimation: (oGlobalState, bShowLoadingAnimation) => {
    oGlobalState.showLoadingAnimation = bShowLoadingAnimation;
    return oGlobalState;
  },

  setShowConfirmationMintedNFT: (oGlobalState, bShowConfirmationMintedNFT) => {
    oGlobalState.showConfirmationMintedNFT = bShowConfirmationMintedNFT;
    return oGlobalState;
  },
};

export const useStore = () => {
  const setState = useState(globalState)[1];

  const dispatch = (actionIdentifier, payload) => {
    const newState = actions[actionIdentifier](globalState, payload);
    globalState = { ...globalState, ...newState };

    for (const listener of listeners) {
      listener(globalState);
    }
  };

  useEffect(() => {
    listeners.push(setState);

    return () => {
      listeners = listeners.filter((li) => li !== setState);
    };
  }, [setState]);

  return [globalState, dispatch];
};

export const initStore = (userActions, initialState) => {
  if (initialState) {
    globalState = { ...globalState, ...initialState };
  }
  actions = { ...actions, ...userActions };
};
