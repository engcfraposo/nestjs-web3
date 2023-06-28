import { Test, TestingModule } from '@nestjs/testing';
import { Web3Service } from './web3.service';
import Web3 from 'web3';

describe('Web3Service', () => {
  let service: Web3Service;
  let mockWeb3: jest.Mocked<Web3>;

  beforeEach(async () => {
    mockWeb3 = {
      eth: {
        getBalance: jest.fn(),
        getTransactionCount: jest.fn(),
        accounts: {
          signTransaction: jest.fn(),
        },
        sendSignedTransaction: jest.fn(),
      },
      utils: {
        fromWei: jest.fn(),
      },
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Web3Service,
        { provide: 'Web3', useValue: mockWeb3 },
        {
          provide: 'Config',
          useValue: { wallet: 'testWallet', privateKey: 'testPrivateKey' },
        },
      ],
    }).compile();

    service = module.get<Web3Service>(Web3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('balance', () => {
    it('should return balance', async () => {
      (mockWeb3.eth.getBalance as jest.Mock).mockResolvedValue('1000');
      (mockWeb3.utils.fromWei as jest.Mock).mockReturnValue('1000');

      expect(await service.balance()).toBe('1000');
      expect(mockWeb3.eth.getBalance).toHaveBeenCalledWith('testWallet');
      expect(mockWeb3.utils.fromWei).toHaveBeenCalledWith('1000', 'wei');
    });
  });

  describe('transfer', () => {
    it('should return transaction hash', async () => {
      const transactionHash = 'tx1234';
      (mockWeb3.eth.getTransactionCount as jest.Mock).mockResolvedValue(1);
      (mockWeb3.eth.accounts.signTransaction as jest.Mock).mockResolvedValue({
        rawTransaction: 'rawTx',
      });
      (mockWeb3.eth.sendSignedTransaction as jest.Mock).mockResolvedValue({
        transactionHash,
      });

      expect(await service.transfer('toWallet', 1000)).toBe(transactionHash);
      expect(mockWeb3.eth.getTransactionCount).toHaveBeenCalledWith(
        'testWallet',
        'latest',
      );
      expect(mockWeb3.eth.accounts.signTransaction).toHaveBeenCalledWith(
        {
          to: 'toWallet',
          value: 1000,
          gas: 21000,
          nonce: 1,
        },
        'testPrivateKey',
      );
      expect(mockWeb3.eth.sendSignedTransaction).toHaveBeenCalledWith('rawTx');
    });
  });
});
