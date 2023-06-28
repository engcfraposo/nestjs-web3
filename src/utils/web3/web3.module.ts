import { Module } from '@nestjs/common';
import { Web3Service } from './web3.service';
import Web3 from 'web3';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'Web3',
      useFactory: (configService: ConfigService) => {
        return new Web3(configService.get('INFURA_URL'));
      },
      inject: [ConfigService],
    },
    {
      provide: 'Config',
      useFactory: (configService: ConfigService) => {
        return {
          wallet: configService.get('WALLET'),
          privateKey: configService.get('PRIVATE_KEY'),
        };
      },
      inject: [ConfigService],
    },
    Web3Service,
  ],
  exports: [Web3Service],
})
export class Web3Module {}
