import { FraudProcessorService } from '../src/fraud/fraud-processor.service';
import { TransactionInput } from '../src/fraud/fraud.types';

const mockFraudService = {
  saveFlaggedTransaction: jest.fn(),
};

function makeTransaction(
  overrides: Partial<TransactionInput> = {},
): TransactionInput {
  return {
    transactionId: overrides.transactionId ?? `txn_${Math.random()}`,
    userId: overrides.userId ?? 'user_1',
    amount: overrides.amount ?? 100,
    timestamp: overrides.timestamp ?? '2026-05-28T10:00:00.000Z',
    merchant: overrides.merchant ?? 'Test Merchant',
    location: overrides.location ?? 'Lagos',
    geo: overrides.geo,
  };
}

describe('FraudProcessorService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('flags more than 5 transactions under 1 minute', async () => {
    const processor = new FraudProcessorService(mockFraudService as any);
    let result;

    for (let i = 0; i < 6; i++) {
      result = await processor.process(
        makeTransaction({
          transactionId: `txn_fast_${i}`,
          timestamp: `2026-05-28T10:00:${String(i).padStart(2, '0')}.000Z`,
        }),
      );
    }

    expect(result?.flagged).toBe(true);
    expect(result?.reasons).toContain('HIGH_FREQUENCY');
  });

  it('flags daily total above 10000', async () => {
    const processor = new FraudProcessorService(mockFraudService as any);

    await processor.process(
      makeTransaction({ transactionId: 'txn_big_1', amount: 8000 }),
    );

    const result = await processor.process(
      makeTransaction({
        transactionId: 'txn_big_2',
        amount: 2500,
        timestamp: '2026-05-28T11:00:00.000Z',
      }),
    );

    expect(result.flagged).toBe(true);
    expect(result.reasons).toContain('DAILY_AMOUNT_LIMIT');
  });

  it('flags different locations within 2 minutes', async () => {
    const processor = new FraudProcessorService(mockFraudService as any);

    await processor.process(
      makeTransaction({
        transactionId: 'txn_loc_1',
        location: 'Lagos',
        timestamp: '2026-05-28T10:00:00.000Z',
      }),
    );

    const result = await processor.process(
      makeTransaction({
        transactionId: 'txn_loc_2',
        location: 'Abuja',
        timestamp: '2026-05-28T10:01:00.000Z',
      }),
    );

    expect(result.flagged).toBe(true);
    expect(result.reasons).toContain('LOCATION_JUMP');
  });
});
