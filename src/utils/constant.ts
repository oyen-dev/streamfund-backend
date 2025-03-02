import { baseSepolia, sepolia } from 'viem/chains';

export const STREAMFUND_CONTRACTS = [
  {
    index: 0,
    contract: '0xEE26C79953845a0ff233c6e1610E47E6b5a07F53',
    chain: baseSepolia,
    rpc: `https://base-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    feeCollector: '0x20047D546F34DC8A58F8DA13fa22143B4fC5404a',
    native: {
      symbol: 'ETH',
      decimals: 18,
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    },
  },
  {
    index: 1,
    contract: '0xb0E728ad08Dc621bD383A111116C5C3BA5A5cA2F',
    chain: sepolia,
    rpc: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    feeCollector: '0x20047D546F34DC8A58F8DA13fa22143B4fC5404a',
    native: {
      symbol: 'ETH',
      decimals: 18,
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    },
  },
];
