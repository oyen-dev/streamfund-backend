export class DecodedAddTokenEventData {
  tokenAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  tokenId: string;
  uri: string;
}

export class DecodedSupportReceivedEventData {
  username: string;
  message: string;
}

export class FeeCollectorChangedData {
  chain: number;
  newCollector: string;
  prevCollector: string;
}

export class SupportReceivedData {
  amount: number;
  chain: number;
  from: string;
  streamer: string;
  token: string;
  data: string;
  hash: string;
}

export class RemoveTokenData {
  address: string;
  chain: number;
}
