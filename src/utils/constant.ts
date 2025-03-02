import { baseSepolia, sepolia } from 'viem/chains';

export const STREAMFUND_CONTRACTS = [
  {
    index: 0,
    contract: '0x223850f25213099D05Ab7Aa0fb7095DA9eB26575',
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
    contract: '0x9B1b5Ee402fc96716F8b28001D14056742b14463',
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
