import { baseSepolia, arbitrumSepolia, optimismSepolia } from 'viem/chains';

export const STREAMFUND_CONTRACTS = [
  {
    index: 0,
    contract: '0xf56FC21f3B799086099d74a9F7F505e6EA1f6fec',
    chain: baseSepolia,
    rpc: `https://base-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    feeCollector: '0x5E4194B0A83Ee2f21D67D5c4bF73CFcfCFc5AF61',
    image:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
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
    feeCollector: '0x5E4194B0A83Ee2f21D67D5c4bF73CFcfCFc5AF61',
    image:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
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
    feeCollector: '0x5E4194B0A83Ee2f21D67D5c4bF73CFcfCFc5AF61',
    image:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
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
