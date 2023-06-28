import { Test, TestingModule } from '@nestjs/testing';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

describe('WalletController', () => {
  let controller: WalletController;
  let mockService: jest.Mocked<WalletService>;

  beforeEach(async () => {
    mockService = {
      getBalance: jest.fn(),
      setTransfer: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [{ provide: WalletService, useValue: mockService }],
    }).compile();

    controller = module.get<WalletController>(WalletController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getBalance', () => {
    it('should return balance', async () => {
      const mockBalance = '1000';
      mockService.getBalance.mockResolvedValue(mockBalance);

      expect(await controller.getBalance()).toBe(mockBalance);
      expect(mockService.getBalance).toHaveBeenCalled();
    });
  });

  describe('setTransfer', () => {
    it('should return transaction hash', async () => {
      const mockTransactionHash = 'tx1234';
      mockService.setTransfer.mockResolvedValue(mockTransactionHash);

      expect(await controller.setTransfer('toWallet', 1000)).toBe(
        mockTransactionHash,
      );
      expect(mockService.setTransfer).toHaveBeenCalledWith('toWallet', 1000);
    });
  });
});
