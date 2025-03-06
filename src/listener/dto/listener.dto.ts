export class DecodedAddTokenEventData {
  tokenAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  tokenId: string;
  uri: string;
}

export class FeeCollectorChangedData {
  chain: number;
  newCollector: string;
  prevCollector: string;
}
