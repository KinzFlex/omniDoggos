import mint from "./mintContract.json";
import bsc_contract from "../deployments/bsc-testnet/omniDoggos.json";
import arb_contract from "../deployments/arbitrum-goerli/omniDoggos.json";
import op_contract from "../deployments/optimism-goerli/omniDoggos.json";
import eth_contract from "../deployments/goerli/omniDoggos.json";

export const MintAddressArb = arb_contract.address;
export const MintAddressABIArb = arb_contract.abi;
export const MintAddressOp = op_contract.address;
export const MintAddressABIOp = op_contract.abi;
export const MintAddressBsc = bsc_contract.address;
export const MintAddressABIBsc = bsc_contract.abi;
export const MintAddressEth = eth_contract.address;
export const MintAddressABIEth = eth_contract.abi;
