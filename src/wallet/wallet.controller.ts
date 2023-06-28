import { Body, Controller, Get, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}
  @Get()
  getBalance() {
    return this.walletService.getBalance();
  }
  @Post()
  setTransfer(
    @Body('toWallet') toWallet: string,
    @Body('value') value: number,
  ) {
    return this.walletService.setTransfer(toWallet, value);
  }
}
