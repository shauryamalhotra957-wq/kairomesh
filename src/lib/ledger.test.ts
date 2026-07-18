import { describe, expect, it } from "vitest";
import {
  AccountConfigurationError,
  assertLedgerBalanced,
  createDemoLedger,
  DuplicateTransactionError,
  getAccountBalance,
  getJobFundsRecord,
  IdempotencyConflictError,
  InsufficientFundsError,
  InvalidMicrocreditAmountError,
  isTransactionBalanced,
  JobFundsStateError,
  LedgerInvariantError,
  microcredits,
  refundDemoCredits,
  reserveDemoCredits,
  settleDemoCredits,
  transactionNet,
  type DemoLedger,
  type LedgerAccount,
  type ReserveDemoCreditsCommand,
  type SettleDemoCreditsCommand,
} from "./ledger";

const ZERO = BigInt(0);
const OPENING_BALANCE = BigInt(1_000_000);

const accountIds = {
  requesterAvailable: "acct:requester:available",
  requesterHeld: "acct:requester:held",
  secondRequesterAvailable: "acct:requester-2:available",
  secondRequesterHeld: "acct:requester-2:held",
  providerPending: "acct:provider:pending",
  platformRevenue: "acct:platform:revenue",
  platformClearing: "acct:platform:clearing",
} as const;

const accounts: readonly LedgerAccount[] = [
  { id: accountIds.requesterAvailable, ownerId: "requester-1", purpose: "requester_available" },
  { id: accountIds.requesterHeld, ownerId: "requester-1", purpose: "requester_held" },
  {
    id: accountIds.secondRequesterAvailable,
    ownerId: "requester-2",
    purpose: "requester_available",
  },
  { id: accountIds.secondRequesterHeld, ownerId: "requester-2", purpose: "requester_held" },
  { id: accountIds.providerPending, ownerId: "provider-1", purpose: "provider_pending" },
  { id: accountIds.platformRevenue, ownerId: "platform", purpose: "platform_revenue" },
  { id: accountIds.platformClearing, ownerId: "platform", purpose: "platform_clearing" },
];

const createLedger = (): DemoLedger =>
  createDemoLedger({
    currency: "KMC",
    accounts,
    openingBalance: {
      transactionId: "tx-opening",
      idempotencyKey: "idem-opening",
      requesterAvailableAccountId: accountIds.requesterAvailable,
      platformClearingAccountId: accountIds.platformClearing,
      amount: OPENING_BALANCE,
    },
  });

const reserveCommand = (overrides: Partial<ReserveDemoCreditsCommand> = {}): ReserveDemoCreditsCommand => ({
  transactionId: "tx-reserve-job-1",
  idempotencyKey: "idem-reserve-job-1",
  jobId: "job-1",
  requesterAvailableAccountId: accountIds.requesterAvailable,
  requesterHeldAccountId: accountIds.requesterHeld,
  amount: BigInt(600_000),
  ...overrides,
});

const settleCommand = (overrides: Partial<SettleDemoCreditsCommand> = {}): SettleDemoCreditsCommand => ({
  transactionId: "tx-settle-job-1",
  idempotencyKey: "idem-settle-job-1",
  jobId: "job-1",
  providerPendingAccountId: accountIds.providerPending,
  platformRevenueAccountId: accountIds.platformRevenue,
  grossAmount: BigInt(480_000),
  platformFee: BigInt(48_000),
  ...overrides,
});

describe("demo-credit ledger", () => {
  it("opens with an audited, balanced source transaction", () => {
    const ledger = createLedger();

    expect(getAccountBalance(ledger, accountIds.requesterAvailable)).toBe(OPENING_BALANCE);
    expect(getAccountBalance(ledger, accountIds.platformClearing)).toBe(-OPENING_BALANCE);
    expect(ledger.transactions).toHaveLength(1);
    expect(isTransactionBalanced(ledger.transactions[0])).toBe(true);
    expect(transactionNet(ledger.transactions[0])).toBe(ZERO);
    expect(() => assertLedgerBalanced(ledger)).not.toThrow();
    expect(Object.isFrozen(ledger)).toBe(true);
    expect(Object.isFrozen(ledger.transactions[0].entries)).toBe(true);
  });

  it("reserves integer microcredits with a balanced two-entry transfer", () => {
    const original = createLedger();
    const reserved = reserveDemoCredits(original, reserveCommand());

    expect(getAccountBalance(original, accountIds.requesterAvailable)).toBe(OPENING_BALANCE);
    expect(getAccountBalance(reserved, accountIds.requesterAvailable)).toBe(BigInt(400_000));
    expect(getAccountBalance(reserved, accountIds.requesterHeld)).toBe(BigInt(600_000));
    expect(reserved.transactions).toHaveLength(2);
    expect(reserved.transactions.at(-1)?.kind).toBe("RESERVE");
    expect(isTransactionBalanced(reserved.transactions.at(-1)!)).toBe(true);
    expect(getJobFundsRecord(reserved, "job-1")).toMatchObject({
      status: "RESERVED",
      reservedAmount: BigInt(600_000),
      reserveTransactionId: "tx-reserve-job-1",
    });
    expect(() => assertLedgerBalanced(reserved)).not.toThrow();
  });

  it("settles actual usage, provider earnings, platform fee, and unused hold atomically", () => {
    const reserved = reserveDemoCredits(createLedger(), reserveCommand());
    const settled = settleDemoCredits(reserved, settleCommand());

    expect(getAccountBalance(settled, accountIds.requesterHeld)).toBe(ZERO);
    expect(getAccountBalance(settled, accountIds.requesterAvailable)).toBe(BigInt(520_000));
    expect(getAccountBalance(settled, accountIds.providerPending)).toBe(BigInt(432_000));
    expect(getAccountBalance(settled, accountIds.platformRevenue)).toBe(BigInt(48_000));
    expect(settled.transactions.at(-1)?.entries).toHaveLength(4);
    expect(isTransactionBalanced(settled.transactions.at(-1)!)).toBe(true);
    expect(getJobFundsRecord(settled, "job-1")).toEqual({
      jobId: "job-1",
      status: "SETTLED",
      reservedAmount: BigInt(600_000),
      requesterAvailableAccountId: accountIds.requesterAvailable,
      requesterHeldAccountId: accountIds.requesterHeld,
      reserveTransactionId: "tx-reserve-job-1",
      finalTransactionId: "tx-settle-job-1",
      grossAmount: BigInt(480_000),
      providerAmount: BigInt(432_000),
      platformFee: BigInt(48_000),
      releasedAmount: BigInt(120_000),
    });
    expect(() => assertLedgerBalanced(settled)).not.toThrow();
  });

  it("supports zero-fee and full-reserve settlement without zero-value entries", () => {
    const reserved = reserveDemoCredits(createLedger(), reserveCommand());
    const settled = settleDemoCredits(
      reserved,
      settleCommand({ grossAmount: BigInt(600_000), platformFee: ZERO }),
    );

    expect(settled.transactions.at(-1)?.entries).toEqual([
      { accountId: accountIds.requesterHeld, amount: BigInt(-600_000) },
      { accountId: accountIds.providerPending, amount: BigInt(600_000) },
    ]);
    expect(() => assertLedgerBalanced(settled)).not.toThrow();
  });

  it("returns an exact idempotent replay without duplicating economic effects", () => {
    const firstReserve = reserveDemoCredits(createLedger(), reserveCommand());
    const replayedReserve = reserveDemoCredits(firstReserve, reserveCommand());
    expect(replayedReserve).toBe(firstReserve);
    expect(replayedReserve.transactions).toHaveLength(2);

    const firstSettlement = settleDemoCredits(replayedReserve, settleCommand());
    const replayedSettlement = settleDemoCredits(firstSettlement, settleCommand());
    expect(replayedSettlement).toBe(firstSettlement);
    expect(replayedSettlement.transactions).toHaveLength(3);
    expect(getAccountBalance(replayedSettlement, accountIds.providerPending)).toBe(BigInt(432_000));
  });

  it("rejects reuse of an idempotency key for a changed command", () => {
    const reserved = reserveDemoCredits(createLedger(), reserveCommand());
    expect(() =>
      reserveDemoCredits(
        reserved,
        reserveCommand({ transactionId: "tx-other", amount: BigInt(599_999) }),
      ),
    ).toThrow(IdempotencyConflictError);

    const settled = settleDemoCredits(reserved, settleCommand());
    expect(() =>
      settleDemoCredits(
        settled,
        settleCommand({ transactionId: "tx-other-settle", platformFee: BigInt(1) }),
      ),
    ).toThrow(IdempotencyConflictError);
  });

  it("rejects a second settlement even when it uses a fresh transaction and idempotency key", () => {
    const settled = settleDemoCredits(
      reserveDemoCredits(createLedger(), reserveCommand()),
      settleCommand(),
    );

    expect(() =>
      settleDemoCredits(
        settled,
        settleCommand({
          transactionId: "tx-settle-again",
          idempotencyKey: "idem-settle-again",
        }),
      ),
    ).toThrow(JobFundsStateError);
  });

  it("refunds the complete hold and prevents later refund or settlement", () => {
    const reserved = reserveDemoCredits(createLedger(), reserveCommand());
    const refundCommand = {
      transactionId: "tx-refund-job-1",
      idempotencyKey: "idem-refund-job-1",
      jobId: "job-1",
    };
    const refunded = refundDemoCredits(reserved, refundCommand);

    expect(getAccountBalance(refunded, accountIds.requesterAvailable)).toBe(OPENING_BALANCE);
    expect(getAccountBalance(refunded, accountIds.requesterHeld)).toBe(ZERO);
    expect(getJobFundsRecord(refunded, "job-1")).toMatchObject({
      status: "REFUNDED",
      finalTransactionId: "tx-refund-job-1",
      releasedAmount: BigInt(600_000),
    });
    expect(refundDemoCredits(refunded, refundCommand)).toBe(refunded);
    expect(() =>
      refundDemoCredits(refunded, {
        ...refundCommand,
        transactionId: "tx-refund-again",
        idempotencyKey: "idem-refund-again",
      }),
    ).toThrow(JobFundsStateError);
    expect(() =>
      settleDemoCredits(
        refunded,
        settleCommand({ transactionId: "tx-after-refund", idempotencyKey: "idem-after-refund" }),
      ),
    ).toThrow(JobFundsStateError);
  });

  it("prevents overdrafts and duplicate job holds", () => {
    expect(() =>
      reserveDemoCredits(createLedger(), reserveCommand({ amount: BigInt(1_000_001) })),
    ).toThrow(InsufficientFundsError);

    const reserved = reserveDemoCredits(createLedger(), reserveCommand());
    expect(() =>
      reserveDemoCredits(
        reserved,
        reserveCommand({ transactionId: "tx-reserve-2", idempotencyKey: "idem-reserve-2" }),
      ),
    ).toThrow(JobFundsStateError);
  });

  it("rejects duplicate transaction identifiers independently of idempotency", () => {
    const reserved = reserveDemoCredits(createLedger(), reserveCommand());
    expect(() =>
      reserveDemoCredits(
        reserved,
        reserveCommand({
          transactionId: "tx-opening",
          idempotencyKey: "idem-new-command",
          jobId: "job-2",
        }),
      ),
    ).toThrow(DuplicateTransactionError);
  });

  it("rejects over-settlement, negative/excess fees, and non-positive money movement", () => {
    const reserved = reserveDemoCredits(createLedger(), reserveCommand());
    expect(() => settleDemoCredits(reserved, settleCommand({ grossAmount: BigInt(600_001) }))).toThrow(
      InvalidMicrocreditAmountError,
    );
    expect(() =>
      settleDemoCredits(
        reserved,
        settleCommand({ grossAmount: BigInt(100), platformFee: BigInt(101) }),
      ),
    ).toThrow(InvalidMicrocreditAmountError);
    expect(() => settleDemoCredits(reserved, settleCommand({ platformFee: BigInt(-1) }))).toThrow(
      InvalidMicrocreditAmountError,
    );
    expect(() => reserveDemoCredits(createLedger(), reserveCommand({ amount: ZERO }))).toThrow(
      InvalidMicrocreditAmountError,
    );
  });

  it("validates lossless integer conversion at the domain boundary", () => {
    expect(microcredits("90071992547409931234567890")).toBe(
      BigInt("90071992547409931234567890"),
    );
    expect(microcredits(42)).toBe(BigInt(42));
    expect(microcredits(BigInt(-7))).toBe(BigInt(-7));
    for (const invalid of [1.2, Number.MAX_SAFE_INTEGER + 1]) {
      expect(() => microcredits(invalid)).toThrow(InvalidMicrocreditAmountError);
    }
    for (const invalid of ["1.0", "1e3", "01", "", "+2"]) {
      expect(() => microcredits(invalid)).toThrow(InvalidMicrocreditAmountError);
    }
  });

  it("enforces account existence, uniqueness, and purpose", () => {
    expect(() =>
      createDemoLedger({
        currency: "KMC",
        accounts: [...accounts, accounts[0]],
        openingBalance: {
          transactionId: "tx-opening",
          idempotencyKey: "idem-opening",
          requesterAvailableAccountId: accountIds.requesterAvailable,
          platformClearingAccountId: accountIds.platformClearing,
          amount: OPENING_BALANCE,
        },
      }),
    ).toThrow(AccountConfigurationError);

    expect(() =>
      reserveDemoCredits(
        createLedger(),
        reserveCommand({ requesterHeldAccountId: accountIds.providerPending }),
      ),
    ).toThrow(AccountConfigurationError);
    expect(() =>
      reserveDemoCredits(
        createLedger(),
        reserveCommand({ requesterHeldAccountId: accountIds.secondRequesterHeld }),
      ),
    ).toThrow(/same owner/);
    expect(() => getAccountBalance(createLedger(), "acct:unknown")).toThrow(
      AccountConfigurationError,
    );
  });

  it("audits job liabilities as well as transaction arithmetic", () => {
    const reserved = reserveDemoCredits(createLedger(), reserveCommand());
    const tampered: DemoLedger = {
      ...reserved,
      jobFunds: [
        {
          ...reserved.jobFunds[0],
          reservedAmount: BigInt(599_999),
        },
      ],
    };

    expect(() => assertLedgerBalanced(tampered)).toThrow(LedgerInvariantError);
  });
});
