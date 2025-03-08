import { baseSepolia, arbitrumSepolia, optimismSepolia } from 'viem/chains';

export const STREAMFUND_CONTRACTS = [
  {
    index: 0,
    contract: '0x859E173F5220A7d5F09a095b89E8D5Cb69a5D8b4',
    chain: baseSepolia,
    rpc: `https://base-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    feeCollector: '0x20047D546F34DC8A58F8DA13fa22143B4fC5404a',
    native: {
      symbol: 'ETH',
      decimals: 18,
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      coinGeckoId: 'ethereum',
      image:
        'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    },
  },
  {
    index: 1,
    contract: '0x4f346f17c50270E7A3Bfc859671D24eFAab0B1aF',
    chain: arbitrumSepolia,
    rpc: `https://arb-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    feeCollector: '0x20047D546F34DC8A58F8DA13fa22143B4fC5404a',
    native: {
      symbol: 'ETH',
      decimals: 18,
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      coinGeckoId: 'ethereum',
      image:
        'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    },
  },
  {
    index: 2,
    contract: '0x82EE3B66B125C0DED18035eC05fC2D2D3acAcAdB',
    chain: optimismSepolia,
    rpc: `https://opt-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    feeCollector: '0x20047D546F34DC8A58F8DA13fa22143B4fC5404a',
    native: {
      symbol: 'ETH',
      decimals: 18,
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      coinGeckoId: 'ethereum',
      image:
        'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    },
  },
];

export const STREAMFUND_FEES = 250;
