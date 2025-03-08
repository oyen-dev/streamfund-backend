import { Injectable, Logger } from '@nestjs/common';
import { RevenueService } from '../revenue/revenue.service';
import { StreamerService } from '../streamer/streamer.service';
import { CreateTokenDTO } from '../token/dto/token.dto';
import { TokenService } from '../token/token.service';
import { STREAMFUND_CONTRACTS } from '../utils/constant';
import { Address, createPublicClient, http, parseAbiItem } from 'viem';
import { AbiCoder } from 'ethers';
import {
  DecodedAddTokenEventData,
  FeeCollectorChangedData,
} from './dto/listener.dto';

@Injectable()
export class ListenerService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly streamerService: StreamerService,
    private readonly revenueService: RevenueService,
  ) {}

  private readonly logger = new Logger(ListenerService.name);
  private readonly abiCoder = new AbiCoder();
  private readonly clients = STREAMFUND_CONTRACTS.map((contract) =>
    createPublicClient({
      chain: contract.chain,
      transport: http(contract.rpc),
    }),
  );

  async watchContracts() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    this.logger.log('Watching StreamFund contracts');
    await this.handleInit();

    this.clients.forEach((client, idx) => {
      client.watchEvent({
        address: STREAMFUND_CONTRACTS[idx].contract as Address,
        events: [
          parseAbiItem(
            'event SupportReceived(address indexed streamer, address indexed from, address indexed token, uint256 chain, uint256 amount, bytes data)',
          ),
          parseAbiItem(
            'event FeeCollectorChanged(address indexed prevCollector, address indexed newCollector, uint256 chain)',
          ),
          parseAbiItem(
            'event TokenAdded(address indexed tokenAddress, uint256 chain, uint8 decimals, bytes data)',
          ),
          parseAbiItem(
            'event TokenRemoved(address indexed tokenAddress, uint256 chain)',
          ),
          parseAbiItem('event StreamerAdded(address indexed streamer)'),
        ],
        onLogs: (logs) => {
          try {
            logs.forEach((log) => {
              switch (log.eventName) {
                case 'SupportReceived': {
                  this.logger.log('SupportReceived');
                  console.log('SupportReceived', log.args);
                  break;
                }

                case 'FeeCollectorChanged': {
                  const { chain, newCollector, prevCollector } = log.args;
                  void this.handleFeeCollectorChange({
                    chain: Number(chain),
                    newCollector: newCollector as Address,
                    prevCollector: prevCollector as Address,
                  });
                  break;
                }

                case 'TokenAdded': {
                  const { data, chain, decimals, tokenAddress } = log.args;
                  const decoded = this.decodeAddTokenEventData(
                    data as `0x${string}`,
                  );
                  void this.handleAddToken({
                    address: tokenAddress as Address,
                    chain: Number(chain),
                    decimal: Number(decimals),
                    name: decoded.name,
                    symbol: decoded.symbol,
                    coinGeckoId: decoded.tokenId,
                    image: decoded.uri,
                  });
                  break;
                }

                case 'TokenRemoved': {
                  void this.handleRemoveToken(
                    log.args.tokenAddress as Address,
                    Number(log.args.chain),
                  );
                  break;
                }

                case 'StreamerAdded': {
                  void this.handleAddStreamer(log.args.streamer as Address);
                  break;
                }

                default:
                  this.logger.log('Unknown event');
                  break;
              }
            });
          } catch (error) {
            this.logger.error('Error while processing logs', error);
            throw error;
          }
        },
      });
    });
  }

  private async handleInit(): Promise<void> {
    try {
      this.logger.log('Initializing...');
      for (const contract of STREAMFUND_CONTRACTS) {
        const { chain, native, feeCollector } = contract;
        const [token, revenue] = await Promise.all([
          await this.tokenService.get({
            chain: chain.id,
            address: native.address,
          }),
          this.revenueService.get({
            address: feeCollector,
            chain: chain.id,
          }),
        ]);

        if (token === null || token === undefined) {
          this.logger.log(
            `Adding native coin ${native.symbol} on chain ${chain.id}`,
          );
          await this.tokenService.create({
            address: native.address,
            chain: chain.id,
            decimal: native.decimals,
            name: native.symbol,
            symbol: native.symbol,
          });
          this.logger.log(
            `Native coin ${native.symbol} on chain ${chain.id} added successfully`,
          );
        } else if (token.deletedAt !== null) {
          this.logger.log(
            `Re-adding native coin ${native.symbol} on chain ${chain.id}`,
          );
          await this.tokenService.update(token.id, {
            deletedAt: null,
          });
          this.logger.log(
            `Native coin ${native.symbol} on chain ${chain.id} re-added successfully`,
          );
        } else {
          this.logger.log(
            `Native coin ${native.symbol} on chain ${chain.id} already exists`,
          );
        }

        if (revenue === null || revenue === undefined) {
          this.logger.log(
            `Creating new revenue account for ${feeCollector} on chain ${chain.id}`,
          );
          await this.revenueService.create({
            address: feeCollector,
            chain: chain.id,
            usd_total: 0,
          });
          this.logger.log(
            `New revenue account for ${feeCollector} on chain ${chain.id} created successfully`,
          );
        } else if (revenue.deletedAt !== null) {
          this.logger.log(
            `Re-adding revenue account for ${feeCollector} on chain ${chain.id}`,
          );
          await this.revenueService.update(revenue.id, {
            deletedAt: null,
          });
          this.logger.log(
            `Revenue account for ${feeCollector} on chain ${chain.id} re-added successfully`,
          );
        } else {
          this.logger.log(
            `Revenue account for ${feeCollector} on chain ${chain.id} already exists`,
          );
        }
      }
    } catch (error) {
      this.logger.error('Error in initNativeCoin', error);
      throw error;
    }
  }

  private async handleAddToken(payload: CreateTokenDTO): Promise<void> {
    try {
      const { address, chain, decimal, name, symbol, coinGeckoId, image } =
        payload;
      const token = await this.tokenService.get({
        chain,
        address,
      });
      if (token === null || token === undefined) {
        this.logger.log(`Adding token ${symbol} on chain ${chain}`);
        await this.tokenService.create({
          address,
          chain,
          decimal,
          name,
          symbol,
          coin_gecko_id: coinGeckoId,
          image,
        });
        this.logger.log(`Token ${symbol} on chain ${chain} added successfully`);
      } else if (token.deletedAt !== null) {
        this.logger.log(`Re-adding token ${symbol} on chain ${chain}`);
        await this.tokenService.update(token.id, {
          deletedAt: null,
        });
        this.logger.log(
          `Token ${symbol} on chain ${chain} re-added successfully`,
        );
      } else {
        this.logger.log(
          `Token ${symbol} on chain ${chain} already exists, updating token`,
        );
        await this.tokenService.update(token.id, {
          createdAt: new Date(),
        });
      }
    } catch (error) {
      this.logger.error('Error in addToken', error);
      throw error;
    }
  }

  private async handleRemoveToken(
    address: string,
    chain: number,
  ): Promise<void> {
    try {
      const token = await this.tokenService.get({ address, chain });
      if (token === null || token === undefined) {
        this.logger.log(`Token ${address} on chain ${chain} does not exist`);
        return;
      } else if (token.deletedAt !== null) {
        this.logger.log(
          `Token ${token.symbol} on chain ${chain} already removed`,
        );
        return;
      }

      this.logger.log(`Removing token ${token.symbol} on chain ${chain}`);
      await this.tokenService.delete(token.id);
      this.logger.log(
        `Token ${token.symbol} on chain ${chain} removed successfully`,
      );
    } catch (error) {
      this.logger.error('Error in removeToken', error);
      throw error;
    }
  }

  private async handleAddStreamer(address: string): Promise<void> {
    try {
      this.logger.log(`Adding streamer ${address}`);
      const streamer = await this.streamerService.get({
        address,
      });
      if (streamer === null || streamer === undefined) {
        this.logger.log(`Adding streamer ${address}`);
        await this.streamerService.create({
          address,
          usd_total_support: 0,
        });
        this.logger.log(`Streamer ${address} added successfully`);
      } else {
        this.logger.log(`Streamer ${address} already exists`);
      }
    } catch (error) {
      this.logger.error('Error in addStreamer', error);
      throw error;
    }
  }

  private async handleFeeCollectorChange({
    chain,
    newCollector,
    prevCollector,
  }: FeeCollectorChangedData): Promise<void> {
    try {
      const prevCol = await this.revenueService.get({
        address: prevCollector,
        chain,
      });
      const newCol = await this.revenueService.get({
        address: newCollector,
        chain,
      });
      if (newCol === null || newCol === undefined) {
        this.logger.log(
          `Creating new revenue account for ${newCollector} on chain ${chain}`,
        );
        await this.revenueService.create({
          address: newCollector,
          chain,
          usd_total: 0,
        });
        this.logger.log(
          `New revenue account for ${newCollector} on chain ${chain} created successfully`,
        );
      } else if (newCol.deletedAt !== null) {
        this.logger.log(
          `Re-adding revenue account for ${newCollector} on chain ${chain}`,
        );
        await this.revenueService.update(newCol.id, {
          deletedAt: null,
        });
        this.logger.log(
          `Revenue account for ${newCollector} on chain ${chain} re-added successfully`,
        );
      } else {
        this.logger.log(
          `Revenue account for ${newCollector} on chain ${chain} already exists`,
        );
      }

      if (prevCol === null || prevCol === undefined) {
        this.logger.log(
          `Revenue account for ${prevCollector} on chain ${chain} does not exist`,
        );
        return;
      } else if (prevCol.deletedAt !== null) {
        this.logger.log(
          `Revenue account for ${prevCollector} on chain ${chain} already removed`,
        );
        return;
      } else {
        this.logger.log(
          `Removing revenue account for ${prevCollector} on chain ${chain}`,
        );
        await this.revenueService.delete(prevCol.id);
        this.logger.log(
          `Revenue account for ${prevCollector} on chain ${chain} removed successfully`,
        );
      }
    } catch (error) {
      this.logger.error('Error in handleCollectorChange', error);
      throw error;
    }
  }

  decodeAddTokenEventData(data: `0x${string}`): DecodedAddTokenEventData {
    if (!data.startsWith('0x')) {
      data = '0x' + data;
    }
    const decoded = this.abiCoder
      .decode(['address', 'string', 'string', 'uint8', 'string'], data)
      .toString();

    const [tokenAddress, name, symbol, decimals, tokenId, uri] =
      decoded.split(',');

    return {
      tokenAddress,
      name,
      symbol,
      decimals: Number(decimals),
      tokenId,
      uri,
    };
  }
}
