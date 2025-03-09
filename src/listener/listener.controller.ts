import { Controller, Logger } from '@nestjs/common';
import { ListenerService } from './listener.service';
import { TokenService } from 'src/token/token.service';
import { StreamerService } from 'src/streamer/streamer.service';
import { FeeCollectorService } from 'src/feecollector/feecollector.service';
import { ViewerService } from 'src/streamer/viewer.service';
import { SupportService } from 'src/support/support.service';
import { CoingeckoService } from 'src/coingecko/coingecko.service';
import { TopSupportService } from 'src/top/topsupport.service';
import { TopSupporterService } from 'src/top/topsupporter.service';
import { STREAMFUND_CONTRACTS } from 'src/utils/constant';
import { Address, createPublicClient, http, parseAbiItem } from 'viem';
import {
  FeeCollectorChangedData,
  RemoveTokenData,
  SupportReceivedData,
} from './dto/listener.dto';
import { Chain, FeeCollector, Token } from '@prisma/client';
import { CreateTokenDTO } from 'src/token/dto/token.dto';
import { ChainService } from 'src/chain/chain.service';

@Controller('listener')
export class ListenerController {
  constructor(
    private readonly listenerService: ListenerService,
    private readonly tokenService: TokenService,
    private readonly streamerService: StreamerService,
    private readonly feeCollectorService: FeeCollectorService,
    private readonly viewerService: ViewerService,
    private readonly supportService: SupportService,
    private readonly coinGeckoService: CoingeckoService,
    private readonly topSupportService: TopSupportService,
    private readonly topSupporterService: TopSupporterService,
    private readonly chainService: ChainService,
  ) {}

  private readonly logger = new Logger(ListenerController.name);
  private readonly clients = STREAMFUND_CONTRACTS.map((contract) =>
    createPublicClient({
      chain: contract.chain,
      transport: http(contract.rpc),
    }),
  );

  async watchEvents() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    this.logger.log("Watching StreamFund's contracts for events");
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
        ],
        onLogs: (logs) => {
          try {
            logs.forEach((log) => {
              switch (log.eventName) {
                case 'SupportReceived': {
                  this.logger.log('SupportReceived');
                  const { amount, chain, from, streamer, token, data } =
                    log.args;

                  void this.handleSupportReceived({
                    amount: Number(amount),
                    chain: Number(chain),
                    from: from as Address,
                    streamer: streamer as Address,
                    token: token as Address,
                    data: data as `0x${string}`,
                    hash: log.transactionHash,
                  });
                  break;
                }

                case 'FeeCollectorChanged': {
                  const { chain, newCollector, prevCollector } = log.args;
                  void this.handleFeeCollectorChange({
                    chain: Number(chain),
                    prev_collector: prevCollector as Address,
                    new_collector: newCollector as Address,
                  });
                  break;
                }

                case 'TokenAdded': {
                  const { data, chain, decimals, tokenAddress } = log.args;
                  const decoded = this.listenerService.decodeAddTokenEventData(
                    data as `0x${string}`,
                  );
                  void this.handleAddToken({
                    address: tokenAddress as Address,
                    chain: Number(chain),
                    decimal: Number(decimals),
                    name: decoded.name,
                    symbol: decoded.symbol,
                    coin_gecko_id: decoded.token_id,
                    image: decoded.uri,
                  });
                  break;
                }

                case 'TokenRemoved': {
                  const { chain, tokenAddress } = log.args;
                  void this.handleRemoveToken({
                    address: tokenAddress as Address,
                    chain: Number(chain),
                  });
                  break;
                }

                default:
                  this.logger.log('Unknown event');
                  break;
              }
            });
          } catch (error) {
            this.logger.error('Error while handling event', error);
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
        const { chain, native, feeCollector, image } = contract;
        let chainData = await this.chainService.get({
          chain_id: chain.id,
        });

        if (chainData === null) {
          this.logger.log(`Creating new chain ${chain.id}`);
          chainData = await this.chainService.create({
            chain_id: chain.id,
            name: chain.name,
            block_explorer_url: chain.blockExplorers.default.url,
            image,
          });
          this.logger.log(`Chain ${chain.id} created successfully`);
        } else if (chainData.deleted_at !== null) {
          this.logger.log(`Re-adding chain ${chain.id}`);
          chainData = await this.chainService.update(chainData.id, {
            deleted_at: null,
          });
          this.logger.log(`Chain ${chain.id} re-added successfully`);
        } else {
          this.logger.log(`Chain ${chain.id} already exists`);
        }

        const [token, collector] = await Promise.all([
          await this.tokenService.get({
            chain_id: chainData.id,
            address: native.address,
          }),
          this.feeCollectorService.get({
            address: feeCollector,
            chain_id: chainData.id,
          }),
        ]);

        if (token === null || token === undefined) {
          this.logger.log(
            `Adding native coin ${native.symbol} on chain ${chain.id}`,
          );
          await this.tokenService.create({
            address: native.address,
            chain: {
              connect: {
                id: chainData.id,
              },
            },
            decimal: native.decimals,
            name: native.symbol,
            symbol: native.symbol,
            coin_gecko_id: native.coinGeckoId,
            image: native.image,
          });
          this.logger.log(
            `Native coin ${native.symbol} on chain ${chain.id} added successfully`,
          );
        } else if (token.deleted_at !== null) {
          this.logger.log(
            `Re-adding native coin ${native.symbol} on chain ${chain.id}`,
          );
          await this.tokenService.update(token.id, {
            deleted_at: null,
          });
          this.logger.log(
            `Native coin ${native.symbol} on chain ${chain.id} re-added successfully`,
          );
        } else {
          this.logger.log(
            `Native coin ${native.symbol} on chain ${chain.id} already exists`,
          );
        }

        if (collector === null) {
          this.logger.log(
            `Creating new collector account for ${feeCollector} on chain ${chain.id}`,
          );
          await this.feeCollectorService.create({
            address: feeCollector,
            chain: {
              connect: {
                id: chainData.id,
              },
            },
            usd_total: 0,
          });
          this.logger.log(
            `New collector account for ${feeCollector} on chain ${chain.id} created successfully`,
          );
        } else if (collector.deleted_at !== null) {
          this.logger.log(
            `Re-adding collector account for ${feeCollector} on chain ${chain.id}`,
          );
          await this.feeCollectorService.update(collector.id, {
            deleted_at: null,
          });
          this.logger.log(
            `Collector account for ${feeCollector} on chain ${chain.id} re-added successfully`,
          );
        } else {
          this.logger.log(
            `Collector account for ${feeCollector} on chain ${chain.id} already exists`,
          );
        }
      }
    } catch (error) {
      this.logger.error('Error in initNativeCoin', error);
      throw error;
    }
  }

  private async handleSupportReceived({
    amount,
    chain,
    from,
    streamer,
    token,
    data,
    hash,
  }: SupportReceivedData): Promise<void> {
    try {
      let chainData = await this.chainService.get({
        chain_id: chain,
      });
      chainData = chainData as Chain;

      let [
        streamerData,
        viewerData,
        tokenData,
        collectorData,
        tstData,
        tsrData,
      ] = await Promise.all([
        this.streamerService.get({ address: streamer, deleted_at: null }),
        this.viewerService.get({ address: from, deleted_at: null }),
        this.tokenService.get({
          address: token,
          chain_id: chainData.id,
          deleted_at: null,
        }),
        this.feeCollectorService.get({
          chain_id: chainData.id,
          deleted_at: null,
        }),
        this.topSupportService.get({
          streamer: {
            address: streamer,
          },
          viewer: {
            address: from,
          },
          deleted_at: null,
        }),
        this.topSupporterService.get({
          streamer: {
            address: streamer,
          },
          viewer: {
            address: from,
          },
          deleted_at: null,
        }),
      ]);

      tokenData = tokenData as Token;
      collectorData = collectorData as FeeCollector;

      if (streamerData === null) {
        streamerData = await this.streamerService.create({
          address: streamer,
          usd_total_support: 0,
        });
      }

      if (viewerData === null) {
        viewerData = await this.viewerService.create({
          address: from,
          usd_total_support: 0,
        });
      }

      if (tstData === null) {
        tstData = await this.topSupportService.create({
          count: 0,
          value: 0,
          streamer: {
            connect: {
              id: streamerData.id,
            },
          },
          viewer: {
            connect: {
              id: viewerData.id,
            },
          },
        });
      }

      if (tsrData === null) {
        tsrData = await this.topSupporterService.create({
          count: 0,
          value: 0,
          streamer: {
            connect: {
              id: streamerData.id,
            },
          },
          viewer: {
            connect: {
              id: viewerData.id,
            },
          },
        });
      }

      const tokenPrice = await this.coinGeckoService.getCoinPrice(
        tokenData.coin_gecko_id,
      );
      const usdAmount = (amount / 10 ** tokenData.decimal) * tokenPrice;
      const { message, username } =
        this.listenerService.decodeSupportReceivedEventData(
          data as `0x${string}`,
        );
      await this.supportService.submitSupport({
        data: `${username},${message}`,
        hash,
        usd_amount: usdAmount,
        token_amount: amount,
        collector_id: collectorData.id,
        viewer_id: viewerData.id,
        streamer_id: streamerData.id,
        token_id: tokenData.id,
        top_support_id: tstData.id,
        top_supporter_id: tsrData.id,
      });

      this.logger.log(
        `Support received from ${username} to ${streamer} with message ${message}`,
      );
    } catch (error) {
      this.logger.error('Error in handleSupportReceived', error);
      throw error;
    }
  }

  private async handleFeeCollectorChange({
    chain,
    prev_collector,
    new_collector,
  }: FeeCollectorChangedData): Promise<void> {
    try {
      let chainData = await this.chainService.get({
        chain_id: chain,
      });
      chainData = chainData as Chain;

      const [prevCol, newCol] = await Promise.all([
        this.feeCollectorService.get({
          address: prev_collector,
          chain: {
            chain_id: chain,
          },
        }),
        this.feeCollectorService.get({
          address: new_collector,
          chain: {
            chain_id: chain,
          },
        }),
      ]);

      if (newCol === null) {
        this.logger.log(
          `Creating new collector account for ${new_collector} on chain ${chain}`,
        );
        await this.feeCollectorService.create({
          address: new_collector,
          chain: {
            connect: {
              id: chainData.id,
            },
          },
          usd_total: 0,
        });
        this.logger.log(
          `New collector account for ${new_collector} on chain ${chain} created successfully`,
        );
      } else if (newCol.deleted_at !== null) {
        this.logger.log(
          `Re-adding collector account for ${new_collector} on chain ${chain}`,
        );
        await this.feeCollectorService.update(newCol.id, {
          deleted_at: null,
        });
        this.logger.log(
          `Collector account for ${new_collector} on chain ${chain} re-added successfully`,
        );
      } else {
        this.logger.log(
          `Collector account for ${new_collector} on chain ${chain} already exists`,
        );
      }

      if (prevCol === null) {
        this.logger.log(
          `Collector account for ${prev_collector} on chain ${chain} does not exist`,
        );
        return;
      } else if (prevCol.deleted_at !== null) {
        this.logger.log(
          `Collector account for ${prev_collector} on chain ${chain} already removed`,
        );
        return;
      } else {
        this.logger.log(
          `Removing collector account for ${prev_collector} on chain ${chain}`,
        );
        await this.feeCollectorService.delete(prevCol.id);
        this.logger.log(
          `Collector account for ${prev_collector} on chain ${chain} removed successfully`,
        );
      }
    } catch (error) {
      this.logger.error('Error in handleCollectorChange', error);
      throw error;
    }
  }

  private async handleAddToken(payload: CreateTokenDTO): Promise<void> {
    try {
      const { address, chain, decimal, name, symbol, coin_gecko_id, image } =
        payload;
      let chainData = await this.chainService.get({
        chain_id: chain,
      });
      chainData = chainData as Chain;

      const token = await this.tokenService.get({
        chain_id: chainData.id,
        address,
      });
      if (token === null) {
        this.logger.log(`Adding token ${symbol} on chain ${chain}`);
        await this.tokenService.create({
          address,
          chain: {
            connect: {
              id: chainData.id,
            },
          },
          decimal,
          name,
          symbol,
          coin_gecko_id,
          image,
        });
        this.logger.log(`Token ${symbol} on chain ${chain} added successfully`);
      } else if (token.deleted_at !== null) {
        this.logger.log(`Re-adding token ${symbol} on chain ${chain}`);
        await this.tokenService.update(token.id, {
          deleted_at: null,
        });
        this.logger.log(
          `Token ${symbol} on chain ${chain} re-added successfully`,
        );
      } else {
        this.logger.log(
          `Token ${symbol} on chain ${chain} already exists, updating token`,
        );
        await this.tokenService.update(token.id, {
          created_at: new Date(),
        });
      }
    } catch (error) {
      this.logger.error('Error in addToken', error);
      throw error;
    }
  }

  private async handleRemoveToken({
    address,
    chain,
  }: RemoveTokenData): Promise<void> {
    try {
      let chainData = await this.chainService.get({
        chain_id: chain,
      });
      chainData = chainData as Chain;

      const token = await this.tokenService.get({
        address,
        chain_id: chainData.id,
      });
      if (token === null) {
        this.logger.log(`Token ${address} on chain ${chain} does not exist`);
        return;
      } else if (token.deleted_at !== null) {
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
}
