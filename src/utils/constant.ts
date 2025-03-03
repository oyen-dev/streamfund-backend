import { baseSepolia, arbitrumSepolia, optimismSepolia } from 'viem/chains';

export const STREAMFUND_CONTRACTS = [
  {
    index: 0,
    contract: '0xc1BE0F2261E10a42A95140920A25FdFc88A7D7dF',
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
    contract: '0x11fEB7694e03420032caEeEE4e508d1Ed3983166',
    chain: arbitrumSepolia,
    rpc: `https://arb-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    feeCollector: '0x20047D546F34DC8A58F8DA13fa22143B4fC5404a',
    native: {
      symbol: 'ETH',
      decimals: 18,
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    },
  },
  {
    index: 2,
    contract: '0x2A69c74A20e0960fAa763a9859B10d6766DCDda1',
    chain: optimismSepolia,
    rpc: `https://opt-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    feeCollector: '0x20047D546F34DC8A58F8DA13fa22143B4fC5404a',
    native: {
      symbol: 'ETH',
      decimals: 18,
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    },
  },
];
