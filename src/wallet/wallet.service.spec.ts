import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { Web3Service } from '../utils/web3/web3.service';

describe('WalletService', () => {
  let service: WalletService;
  let mockWeb3Service: jest.Mocked<Web3Service>;

  beforeEach(async () => {
    mockWeb3Service = {
      balance: jest.fn(),
      transfer: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        { provide: Web3Service, useValue: mockWeb3Service },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBalance', () => {
    it('should return balance', async () => {
      const mockBalance = '1000';
      mockWeb3Service.balance.mockResolvedValue(mockBalance);

      expect(await service.getBalance()).toBe(mockBalance);
      expect(mockWeb3Service.balance).toHaveBeenCalled();
    });
  });

  describe('setTransfer', () => {
    it('should return transaction hash', async () => {
      const mockTransactionHash = 'tx1234';
      mockWeb3Service.transfer.mockResolvedValue(mockTransactionHash);

      expect(await service.setTransfer('toWallet', 1000)).toBe(
        mockTransactionHash,
      );
      expect(mockWeb3Service.transfer).toHaveBeenCalledWith('toWallet', 1000);
    });
  });
});
