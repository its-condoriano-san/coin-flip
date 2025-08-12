import { WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";
import { VITE_NETWORK_TYPE } from "./env";

export const walletAdapterNetwork = VITE_NETWORK_TYPE == 'mainnet'
    ? WalletAdapterNetwork.MainnetBeta
    : WalletAdapterNetwork.TestnetBeta