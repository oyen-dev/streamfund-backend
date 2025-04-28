export class DecodedAddTokenEventData {
  token_address: string;
  name: string;
  symbol: string;
  decimals: number;
  token_id: string;
  uri: string;
}

export class DecodedSupportReceivedEventData {
  username: string;
  message: string;
}

export class FeeCollectorChangedData {
  chain: number;
  new_collector: string;
  prev_collector: string;
}

export class SupportReceivedData {
  amount: bigint;
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
