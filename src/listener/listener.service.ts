import { Injectable, Logger } from '@nestjs/common';
import { RevenueService } from '../revenue/revenue.service';
import { StreamerService } from '../streamer/streamer.service';
import { CreateTokenDTO } from '../token/dto/token.dto';
import { TokenService } from '../token/token.service';
import { STREAMFUND_CONTRACTS } from '../utils/constant';
import { Address, createPublicClient, http, parseAbiItem } from 'viem';
import { AbiCoder } from 'ethers';

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
            'event FeeCollectorChanged(address indexed newCollector, uint256 chain)',
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
                  void this.handleFeeCollectorChange(
                    log.args.newCollector as Address,
                    Number(log.args.chain),
                  );
                  break;
                }

                case 'TokenAdded': {
                  const { data, chain, decimals, tokenAddress } = log.args;
                  // 0xaBE8Be8F97DeC3475eb761e8B120d0F6dCeFdf89,USDT,6,tether,https://assets.coingecko.com/coins/images/325/large/tether.png
                  const decoded = this.decodeData(data as string);
                  const [, symbol, , name, image] = decoded.split(',');
                  void this.handleAddToken({
                    address: tokenAddress as Address,
                    chain: Number(chain),
                    decimal: Number(decimals),
                    name: name,
                    symbol: symbol,
                    image: image ?? null,
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
      const { address, chain, decimal, name, symbol } = payload;
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
      await this.tokenService.delete(token.id, {
        address: token.address,
        chain: token.chain,
      });
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
      const streamer = await this.streamerService.getStreamerByAddress(address);
      if (streamer === null || streamer === undefined) {
        this.logger.log(`Adding streamer ${address}`);
        await this.streamerService.addStreamer(address);
        this.logger.log(`Streamer ${address} added successfully`);
      } else {
        this.logger.log(`Streamer ${address} already exists`);
      }
    } catch (error) {
      this.logger.error('Error in addStreamer', error);
      throw error;
    }
  }

  private async handleFeeCollectorChange(
    address: string,
    chain: number,
  ): Promise<void> {
    try {
      const account = await this.revenueService.get({ address, chain });
      if (account === null || account === undefined) {
        this.logger.log(
          `Creating new revenue account for ${address} on chain ${chain}`,
        );
        await this.revenueService.create({
          address,
          chain,
          usd_total: 0,
        });
        this.logger.log(
          `New revenue account for ${address} on chain ${chain} created successfully`,
        );
      } else if (account.deletedAt !== null) {
        this.logger.log(
          `Re-adding revenue account for ${address} on chain ${chain}`,
        );
        await this.revenueService.update(account.id, {
          deletedAt: null,
        });
        this.logger.log(
          `Revenue account for ${address} on chain ${chain} re-added successfully`,
        );
      } else {
        this.logger.log(
          `Revenue account for ${address} on chain ${chain} already exists`,
        );
      }
    } catch (error) {
      this.logger.error('Error in handleCollectorChange', error);
      throw error;
    }
  }

  private decodeData(data: string): string {
    return this.abiCoder.decode(['string'], data)[0] as string;
  }
}
