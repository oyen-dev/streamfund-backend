import { Injectable, Logger } from '@nestjs/common';
import { AbiCoder } from 'ethers';
import {
  DecodedAddTokenEventData,
  DecodedSupportReceivedEventData,
} from './dto/listener.dto';

@Injectable()
export class ListenerService {
  private readonly logger = new Logger(ListenerService.name);
  private readonly abiCoder = new AbiCoder();

  decodeAddTokenEventData(data: `0x${string}`): DecodedAddTokenEventData {
    try {
      const decoded = this.abiCoder
        .decode(['address', 'string', 'string', 'uint8', 'string'], data)
        .toString();

      const [token_address, name, symbol, decimals, token_id, uri] =
        decoded.split(',');

      return {
        token_address,
        name,
        symbol,
        decimals: Number(decimals),
        token_id,
        uri,
      };
    } catch (error) {
      this.logger.error('Error in decodeAddTokenEventData', error);
      throw error;
    }
  }

  decodeSupportReceivedEventData(
    data: `0x${string}`,
  ): DecodedSupportReceivedEventData {
    try {
      const decoded = this.abiCoder.decode(['string'], data).toString();

      const [username, message] = decoded.split(',');
      return {
        username,
        message,
      };
    } catch (error) {
      this.logger.error('Error in decodeSupportReceivedEventData', error);
      throw error;
    }
  }
}
