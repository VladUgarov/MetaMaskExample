type Network = {
  rpc: string;
  chainId: number;
  name: string;
  symbol: string;
  explorerURL: string;
};

export const networks: Record<number, Network> = {
  42: {
    rpc: "https://kovan.infura.io/v3/",
    chainId: 42,
    name: "Kovan Test Network",
    symbol: "ETH",
    explorerURL: "https://kovan.etherscan.io",
  },
};
