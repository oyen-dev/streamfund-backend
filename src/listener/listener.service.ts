import { Injectable, Logger } from '@nestjs/common';
import { CreateTokenDTO } from 'src/token/dto/token.dto';
import { TokenService } from 'src/token/token.service';
import { STREAMFUND_CONTRACTS } from 'src/utils/constant';
import { Address, createPublicClient, http, parseAbiItem } from 'viem';

@Injectable()
export class ListenerService {
  constructor(private readonly tokenService: TokenService) {}

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

    this.clients.forEach((client, idx) => {
      client.watchEvent({
        address: STREAMFUND_CONTRACTS[idx].contract as Address,
        events: [
          parseAbiItem(
            'event SupportReceived(address indexed streamer, address indexed from, address indexed token, uint256 amount, uint256 chain, bytes data)',
          ),
          parseAbiItem(
            'event FeeCollectorChanged(address indexed newCollector)',
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
                  this.logger.log('FeeCollectorChanged');
                  break;
                case 'TokenAdded':
                  void this.addToken({
                    address: log.args.tokenAddress as Address,
                    chain: Number(log.args.chain),
                    decimal: Number(log.args.decimals),
                    name: log.args.name as string,
                    symbol: log.args.symbol as string,
                  });

                  break;
                case 'TokenRemoved':
                  void this.removeToken(
                    log.args.tokenAddress as Address,
                    Number(log.args.chain),
                  );
                  break;
                case 'StreamerAdded':
                  this.logger.log('StreamerAdded');
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

  private async addToken(payload: CreateTokenDTO): Promise<void> {
    try {
      const { address, chain, decimal, name, symbol } = payload;
      const token = await this.tokenService.getTokenByAddressAndChain(
        address,
        chain,
      );
      if (!token) {
        this.logger.log(`Adding token ${symbol} on chain ${chain}`);
        await this.tokenService.createToken({
          address,
          chain,
          decimal,
          name,
          symbol,
        });
        this.logger.log(`Token ${symbol} on chain ${chain} added successfully`);
      }

      this.logger.log(`Token ${symbol} on chain ${chain} already exists`);
    } catch (error) {
      this.logger.error('Error in addToken', error);
      throw error;
    }
  }

  private async removeToken(address: string, chain: number): Promise<void> {
    try {
      const token = await this.tokenService.getTokenByAddressAndChain(
        address,
        chain,
      );
      if (token) {
        this.logger.log(`Removing token ${token.symbol} on chain ${chain}`);
        await this.tokenService.deleteToken(address, chain);
        this.logger.log(
          `Token ${token.symbol} on chain ${chain} removed successfully`,
        );
      }

      this.logger.log(`Token ${address} on chain ${chain} does not exist`);
    } catch (error) {
      this.logger.error('Error in removeToken', error);
      throw error;
    }
  }
}
