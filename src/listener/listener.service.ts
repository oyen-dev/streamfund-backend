import { Injectable, Logger } from '@nestjs/common';
import { RevenueService } from 'src/revenue/revenue.service';
import { StreamerService } from 'src/streamer/streamer.service';
import { CreateTokenDTO } from 'src/token/dto/token.dto';
import { TokenService } from 'src/token/token.service';
import { STREAMFUND_CONTRACTS } from 'src/utils/constant';
import { Address, createPublicClient, http, parseAbiItem } from 'viem';

@Injectable()
export class ListenerService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly streamerService: StreamerService,
    private readonly revenueService: RevenueService,
  ) {}

  private readonly logger = new Logger(ListenerService.name);
  private readonly clients = STREAMFUND_CONTRACTS.map((contract) =>
    createPublicClient({
      chain: contract.chain,
      transport: http(contract.rpc),
    }),
  );

  async watchContracts() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    this.logger.log('Watching StreamFund contracts');
    await this.handleInitNativeCoin();

    this.clients.forEach((client, idx) => {
      client.watchEvent({
        address: STREAMFUND_CONTRACTS[idx].contract as Address,
        events: [
          parseAbiItem(
            'event SupportReceived(address indexed streamer, address indexed from, address indexed token, uint256 amount, uint256 chain, bytes data)',
          ),
          parseAbiItem(
            'event FeeCollectorChanged(address indexed newCollector, uint256 chain)',
          ),
          parseAbiItem(
            'event TokenAdded(address indexed tokenAddress, uint8 decimals, uint256 chain, string symbol, string name)',
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
                case 'SupportReceived':
                  this.logger.log('SupportReceived');
                  break;
                case 'FeeCollectorChanged':
                  void this.handleFeeCollectorChange(
                    log.args.newCollector as Address,
                    Number(log.args.chain),
                  );
                  break;
                case 'TokenAdded':
                  void this.handleAddToken({
                    address: log.args.tokenAddress as Address,
                    chain: Number(log.args.chain),
                    decimal: Number(log.args.decimals),
                    name: log.args.name as string,
                    symbol: log.args.symbol as string,
                  });

                  break;
                case 'TokenRemoved':
                  void this.handleRemoveToken(
                    log.args.tokenAddress as Address,
                    Number(log.args.chain),
                  );
                  break;
                case 'StreamerAdded':
                  void this.handleAddStreamer(log.args.streamer as Address);
                  break;
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

  private async handleInitNativeCoin(): Promise<void> {
    try {
      this.logger.log('Initializing native coin');
      for (const contract of STREAMFUND_CONTRACTS) {
        const { chain, native } = contract;
        const token = await this.tokenService.getTokenByAddressAndChain(
          native.address,
          chain.id,
        );
        if (token === null || token === undefined) {
          this.logger.log(
            `Adding native coin ${native.symbol} on chain ${chain.id}`,
          );
          await this.tokenService.createToken({
            address: native.address,
            chain: chain.id,
            decimal: native.decimals,
            name: native.symbol,
            symbol: native.symbol,
          });
          this.logger.log(
            `Native coin ${native.symbol} on chain ${chain.id} added successfully`,
          );
        } else {
          this.logger.log(
            `Native coin ${native.symbol} on chain ${chain.id} already exists`,
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
      const token = await this.tokenService.getTokenByAddressAndChain(
        address,
        chain,
      );
      if (token === null || token === undefined) {
        this.logger.log(`Token ${symbol} on chain ${chain} already exists`);
        return;
      }

      this.logger.log(`Adding token ${symbol} on chain ${chain}`);
      await this.tokenService.createToken({
        address,
        chain,
        decimal,
        name,
        symbol,
      });
      this.logger.log(`Token ${symbol} on chain ${chain} added successfully`);
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
      const token = await this.tokenService.getTokenByAddressAndChain(
        address,
        chain,
      );
      if (token === null || token === undefined) {
        this.logger.log(`Token ${address} on chain ${chain} does not exist`);
        return;
      }

      this.logger.log(`Removing token ${token.symbol} on chain ${chain}`);
      await this.tokenService.deleteToken(address, chain);
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
      const account = await this.revenueService.getRevenueAccount(
        address,
        chain,
      );
      if (account === null || account === undefined) {
        this.logger.log(
          `Creating new revenue account for ${address} on chain ${chain}`,
        );
        await this.revenueService.createNewRevenueAccount(address, chain);
        this.logger.log(
          `New revenue account for ${address} on chain ${chain} created successfully`,
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
}
