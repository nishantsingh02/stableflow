import { http, createConfig } from "wagmi";
import { mainnet, polygon, arbitrum, base, optimism } from "wagmi/chains";
import { injected, metaMask, coinbaseWallet, walletConnect } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

export const config = createConfig({
  chains: [mainnet, polygon, arbitrum, base, optimism],
  connectors: [
    injected(),
    metaMask(),
    coinbaseWallet({ appName: "StableFlow" }),
    walletConnect({ projectId }),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
  },
});

export const SUPPORTED_STABLECOINS = {
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    addresses: {
      [mainnet.id]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      [polygon.id]: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      [arbitrum.id]: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
      [base.id]: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      [optimism.id]: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
    },
  },
  USDT: {
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    addresses: {
      [mainnet.id]: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      [polygon.id]: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      [arbitrum.id]: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
      [base.id]: "0x",
      [optimism.id]: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
    },
  },
  DAI: {
    symbol: "DAI",
    name: "Dai Stablecoin",
    decimals: 18,
    addresses: {
      [mainnet.id]: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      [polygon.id]: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      [arbitrum.id]: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      [base.id]: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
      [optimism.id]: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    },
  },
} as const;

export const CHAIN_NAMES: Record<number, string> = {
  [mainnet.id]: "Ethereum",
  [polygon.id]: "Polygon",
  [arbitrum.id]: "Arbitrum",
  [base.id]: "Base",
  [optimism.id]: "Optimism",
};

export type SupportedStablecoin = keyof typeof SUPPORTED_STABLECOINS;