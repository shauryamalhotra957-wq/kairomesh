export type Microcredits = bigint;

export type LedgerAccountPurpose =
  | "requester_available"
  | "requester_held"
  | "provider_pending"
  | "platform_revenue"
  | "platform_clearing";

const LEDGER_ACCOUNT_PURPOSES: readonly LedgerAccountPurpose[] = [
  "requester_available",
  "requester_held",
  "provider_pending",
  "platform_revenue",
  "platform_clearing",
];

export interface LedgerAccount {
  readonly id: string;
  readonly ownerId: string;
  readonly purpose: LedgerAccountPurpose;
}

export interface LedgerEntry {
  readonly accountId: string;
  /** Positive values credit an account; negative values debit it. */
  readonly amount: Microcredits;
}

export type LedgerTransactionKind = "OPENING_BALANCE" | "RESERVE" | "SETTLE" | "REFUND";

export interface LedgerTransaction {
  readonly id: string;
  readonly idempotencyKey: string;
  readonly idempotencyFingerprint: string;
  readonly kind: LedgerTransactionKind;
  readonly jobId?: string;
  readonly entries: readonly LedgerEntry[];
}

export type JobFundsStatus = "RESERVED" | "SETTLED" | "REFUNDED";

export interface JobFundsRecord {
  readonly jobId: string;
  readonly status: JobFundsStatus;
  readonly reservedAmount: Microcredits;
  readonly requesterAvailableAccountId: string;
  readonly requesterHeldAccountId: string;
  readonly reserveTransactionId: string;
  readonly finalTransactionId?: string;
  readonly grossAmount?: Microcredits;
  readonly providerAmount?: Microcredits;
  readonly platformFee?: Microcredits;
  readonly releasedAmount?: Microcredits;
}

export interface DemoLedger {
  readonly currency: string;
  readonly accounts: readonly LedgerAccount[];
  readonly transactions: readonly LedgerTransaction[];
  readonly jobFunds: readonly JobFundsRecord[];
}

export type LedgerErrorCode =
  | "INVALID_AMOUNT"
  | "INVALID_CONFIGURATION"
  | "INSUFFICIENT_FUNDS"
  | "IDEMPOTENCY_CONFLICT"
  | "DUPLICATE_TRANSACTION"
  | "JOB_FUNDS_STATE"
  | "LEDGER_INVARIANT";

export class LedgerError extends Error {
  readonly code: LedgerErrorCode;

  constructor(code: LedgerErrorCode, message: string) {
    super(message);
    this.name = "LedgerError";
    this.code = code;
  }
}

export class InvalidMicrocreditAmountError extends LedgerError {
  constructor(message: string) {
    super("INVALID_AMOUNT", message);
    this.name = "InvalidMicrocreditAmountError";
  }
}

export class AccountConfigurationError extends LedgerError {
  constructor(message: string) {
    super("INVALID_CONFIGURATION", message);
    this.name = "AccountConfigurationError";
  }
}

export class InsufficientFundsError extends LedgerError {
  readonly available: Microcredits;
  readonly requested: Microcredits;

  constructor(available: Microcredits, requested: Microcredits) {
    super(
      "INSUFFICIENT_FUNDS",
      `Insufficient demo credits: ${available.toString()} available, ${requested.toString()} requested.`,
    );
    this.name = "InsufficientFundsError";
    this.available = available;
    this.requested = requested;
  }
}

export class IdempotencyConflictError extends LedgerError {
  readonly idempotencyKey: string;

  constructor(idempotencyKey: string) {
    super(
      "IDEMPOTENCY_CONFLICT",
      `Idempotency key ${idempotencyKey} was already used for a different command.`,
    );
    this.name = "IdempotencyConflictError";
    this.idempotencyKey = idempotencyKey;
  }
}

export class DuplicateTransactionError extends LedgerError {
  readonly transactionId: string;

  constructor(transactionId: string) {
    super("DUPLICATE_TRANSACTION", `Transaction ${transactionId} already exists.`);
    this.name = "DuplicateTransactionError";
    this.transactionId = transactionId;
  }
}

export class JobFundsStateError extends LedgerError {
  readonly jobId: string;
  readonly actualState: JobFundsStatus | "UNRESERVED";

  constructor(jobId: string, expectedState: string, actualState: JobFundsStatus | "UNRESERVED") {
    super(
      "JOB_FUNDS_STATE",
      `Job ${jobId} funds must be ${expectedState}; current state is ${actualState}.`,
    );
    this.name = "JobFundsStateError";
    this.jobId = jobId;
    this.actualState = actualState;
  }
}

export class LedgerInvariantError extends LedgerError {
  constructor(message: string) {
    super("LEDGER_INVARIANT", message);
    this.name = "LedgerInvariantError";
  }
}

export interface CreateDemoLedgerCommand {
  readonly currency: string;
  readonly accounts: readonly LedgerAccount[];
  readonly openingBalance: {
    readonly transactionId: string;
    readonly idempotencyKey: string;
    readonly requesterAvailableAccountId: string;
    readonly platformClearingAccountId: string;
    readonly amount: Microcredits;
  };
}

export interface ReserveDemoCreditsCommand {
  readonly transactionId: string;
  readonly idempotencyKey: string;
  readonly jobId: string;
  readonly requesterAvailableAccountId: string;
  readonly requesterHeldAccountId: string;
  readonly amount: Microcredits;
}

export interface SettleDemoCreditsCommand {
  readonly transactionId: string;
  readonly idempotencyKey: string;
  readonly jobId: string;
  readonly providerPendingAccountId: string;
  readonly platformRevenueAccountId: string;
  readonly grossAmount: Microcredits;
  readonly platformFee: Microcredits;
}

export interface RefundDemoCreditsCommand {
  readonly transactionId: string;
  readonly idempotencyKey: string;
  readonly jobId: string;
}

const ZERO = BigInt(0);

/** Converts only lossless whole values. Decimal and unsafe Number inputs fail closed. */
export function microcredits(value: bigint | number | string): Microcredits {
  if (typeof value === "bigint") return value;
  if (typeof value === "number") {
    if (!Number.isSafeInteger(value)) {
      throw new InvalidMicrocreditAmountError("Microcredits must be a safe integer.");
    }
    return BigInt(value);
  }
  if (!/^-?(0|[1-9]\d*)$/.test(value)) {
    throw new InvalidMicrocreditAmountError("Microcredits must be a base-10 integer string.");
  }
  return BigInt(value);
}

function assertIdentifier(value: string, field: string): void {
  if (value.trim().length === 0) {
    throw new AccountConfigurationError(`${field} must not be empty.`);
  }
}

function assertMicrocredits(value: Microcredits, field: string): void {
  if (typeof value !== "bigint") {
    throw new InvalidMicrocreditAmountError(`${field} must be represented as bigint microcredits.`);
  }
}

function assertPositive(value: Microcredits, field: string): void {
  assertMicrocredits(value, field);
  if (value <= ZERO) {
    throw new InvalidMicrocreditAmountError(`${field} must be greater than zero.`);
  }
}

function assertNonNegative(value: Microcredits, field: string): void {
  assertMicrocredits(value, field);
  if (value < ZERO) {
    throw new InvalidMicrocreditAmountError(`${field} must not be negative.`);
  }
}

function fingerprint(parts: readonly (string | Microcredits)[]): string {
  return JSON.stringify(parts.map((part) => (typeof part === "bigint" ? part.toString() : part)));
}

function freezeEntry(entry: LedgerEntry): LedgerEntry {
  return Object.freeze({ ...entry });
}

function freezeTransaction(transaction: LedgerTransaction): LedgerTransaction {
  return Object.freeze({
    ...transaction,
    entries: Object.freeze(transaction.entries.map(freezeEntry)),
  });
}

function freezeJobFunds(record: JobFundsRecord): JobFundsRecord {
  return Object.freeze({ ...record });
}

function freezeLedger(ledger: DemoLedger): DemoLedger {
  return Object.freeze({
    ...ledger,
    accounts: Object.freeze(ledger.accounts),
    transactions: Object.freeze(ledger.transactions),
    jobFunds: Object.freeze(ledger.jobFunds),
  });
}

function getAccount(ledger: DemoLedger, accountId: string): LedgerAccount {
  const account = ledger.accounts.find((candidate) => candidate.id === accountId);
  if (!account) {
    throw new AccountConfigurationError(`Unknown ledger account ${accountId}.`);
  }
  return account;
}

function assertPurpose(
  ledger: DemoLedger,
  accountId: string,
  expectedPurpose: LedgerAccountPurpose,
): void {
  const account = getAccount(ledger, accountId);
  if (account.purpose !== expectedPurpose) {
    throw new AccountConfigurationError(
      `Account ${accountId} must have purpose ${expectedPurpose}; found ${account.purpose}.`,
    );
  }
}

export function transactionNet(transaction: LedgerTransaction): Microcredits {
  return transaction.entries.reduce((total, entry) => total + entry.amount, ZERO);
}

export function isTransactionBalanced(transaction: LedgerTransaction): boolean {
  return transactionNet(transaction) === ZERO;
}

export function getAccountBalance(ledger: DemoLedger, accountId: string): Microcredits {
  getAccount(ledger, accountId);
  return ledger.transactions.reduce(
    (balance, transaction) =>
      balance +
      transaction.entries.reduce(
        (transactionBalance, entry) =>
          transactionBalance + (entry.accountId === accountId ? entry.amount : ZERO),
        ZERO,
      ),
    ZERO,
  );
}

export function getJobFundsRecord(ledger: DemoLedger, jobId: string): JobFundsRecord | undefined {
  return ledger.jobFunds.find((record) => record.jobId === jobId);
}

function validateTransaction(ledger: DemoLedger, transaction: LedgerTransaction): void {
  assertIdentifier(transaction.id, "transactionId");
  assertIdentifier(transaction.idempotencyKey, "idempotencyKey");
  assertIdentifier(transaction.idempotencyFingerprint, "idempotencyFingerprint");
  if (transaction.entries.length < 2) {
    throw new LedgerInvariantError(`Transaction ${transaction.id} must contain at least two entries.`);
  }

  const accountIds = new Set<string>();
  for (const entry of transaction.entries) {
    getAccount(ledger, entry.accountId);
    assertMicrocredits(entry.amount, "entry.amount");
    if (entry.amount === ZERO) {
      throw new LedgerInvariantError(`Transaction ${transaction.id} contains a zero-value entry.`);
    }
    if (accountIds.has(entry.accountId)) {
      throw new LedgerInvariantError(
        `Transaction ${transaction.id} contains duplicate entries for ${entry.accountId}.`,
      );
    }
    accountIds.add(entry.accountId);
  }

  if (!isTransactionBalanced(transaction)) {
    throw new LedgerInvariantError(`Transaction ${transaction.id} is not balanced.`);
  }
}

function assertNoNegativeProtectedBalances(ledger: DemoLedger): void {
  for (const account of ledger.accounts) {
    if (account.purpose !== "platform_clearing" && getAccountBalance(ledger, account.id) < ZERO) {
      throw new LedgerInvariantError(`Account ${account.id} would have a negative balance.`);
    }
  }
}

function appendTransaction(ledger: DemoLedger, transaction: LedgerTransaction): DemoLedger {
  validateTransaction(ledger, transaction);
  if (ledger.transactions.some((candidate) => candidate.id === transaction.id)) {
    throw new DuplicateTransactionError(transaction.id);
  }
  if (
    ledger.transactions.some(
      (candidate) => candidate.idempotencyKey === transaction.idempotencyKey,
    )
  ) {
    throw new IdempotencyConflictError(transaction.idempotencyKey);
  }

  const next = freezeLedger({
    ...ledger,
    transactions: [...ledger.transactions, freezeTransaction(transaction)],
  });
  assertNoNegativeProtectedBalances(next);
  return next;
}

function isIdempotentReplay(
  ledger: DemoLedger,
  idempotencyKey: string,
  idempotencyFingerprint: string,
): boolean {
  const existing = ledger.transactions.find(
    (transaction) => transaction.idempotencyKey === idempotencyKey,
  );
  if (!existing) return false;
  if (existing.idempotencyFingerprint !== idempotencyFingerprint) {
    throw new IdempotencyConflictError(idempotencyKey);
  }
  return true;
}

function assertUnusedTransactionId(ledger: DemoLedger, transactionId: string): void {
  if (ledger.transactions.some((transaction) => transaction.id === transactionId)) {
    throw new DuplicateTransactionError(transactionId);
  }
}

export function createDemoLedger(command: CreateDemoLedgerCommand): DemoLedger {
  assertIdentifier(command.currency, "currency");
  if (command.accounts.length === 0) {
    throw new AccountConfigurationError("At least one ledger account is required.");
  }

  const seen = new Set<string>();
  const accounts = command.accounts.map((account) => {
    assertIdentifier(account.id, "account.id");
    assertIdentifier(account.ownerId, "account.ownerId");
    if (seen.has(account.id)) {
      throw new AccountConfigurationError(`Duplicate ledger account ${account.id}.`);
    }
    if (!LEDGER_ACCOUNT_PURPOSES.includes(account.purpose)) {
      throw new AccountConfigurationError(`Unknown account purpose ${String(account.purpose)}.`);
    }
    seen.add(account.id);
    return Object.freeze({ ...account });
  });

  const empty = freezeLedger({
    currency: command.currency,
    accounts,
    transactions: [],
    jobFunds: [],
  });
  assertPurpose(
    empty,
    command.openingBalance.requesterAvailableAccountId,
    "requester_available",
  );
  assertPurpose(empty, command.openingBalance.platformClearingAccountId, "platform_clearing");
  assertPositive(command.openingBalance.amount, "openingBalance.amount");
  const openingFingerprint = fingerprint([
    "OPENING_BALANCE",
    command.openingBalance.transactionId,
    command.openingBalance.requesterAvailableAccountId,
    command.openingBalance.platformClearingAccountId,
    command.openingBalance.amount,
  ]);

  return appendTransaction(empty, {
    id: command.openingBalance.transactionId,
    idempotencyKey: command.openingBalance.idempotencyKey,
    idempotencyFingerprint: openingFingerprint,
    kind: "OPENING_BALANCE",
    entries: [
      {
        accountId: command.openingBalance.platformClearingAccountId,
        amount: -command.openingBalance.amount,
      },
      {
        accountId: command.openingBalance.requesterAvailableAccountId,
        amount: command.openingBalance.amount,
      },
    ],
  });
}

export function reserveDemoCredits(
  ledger: DemoLedger,
  command: ReserveDemoCreditsCommand,
): DemoLedger {
  assertIdentifier(command.transactionId, "transactionId");
  assertIdentifier(command.idempotencyKey, "idempotencyKey");
  assertIdentifier(command.jobId, "jobId");
  assertPositive(command.amount, "amount");
  const commandFingerprint = fingerprint([
    "RESERVE",
    command.transactionId,
    command.jobId,
    command.requesterAvailableAccountId,
    command.requesterHeldAccountId,
    command.amount,
  ]);
  if (isIdempotentReplay(ledger, command.idempotencyKey, commandFingerprint)) return ledger;
  assertUnusedTransactionId(ledger, command.transactionId);

  const existing = getJobFundsRecord(ledger, command.jobId);
  if (existing) {
    throw new JobFundsStateError(command.jobId, "UNRESERVED", existing.status);
  }
  assertPurpose(ledger, command.requesterAvailableAccountId, "requester_available");
  assertPurpose(ledger, command.requesterHeldAccountId, "requester_held");
  const availableAccount = getAccount(ledger, command.requesterAvailableAccountId);
  const heldAccount = getAccount(ledger, command.requesterHeldAccountId);
  if (availableAccount.ownerId !== heldAccount.ownerId) {
    throw new AccountConfigurationError(
      "Requester available and held accounts must belong to the same owner.",
    );
  }

  const available = getAccountBalance(ledger, command.requesterAvailableAccountId);
  if (available < command.amount) {
    throw new InsufficientFundsError(available, command.amount);
  }

  const posted = appendTransaction(ledger, {
    id: command.transactionId,
    idempotencyKey: command.idempotencyKey,
    idempotencyFingerprint: commandFingerprint,
    kind: "RESERVE",
    jobId: command.jobId,
    entries: [
      { accountId: command.requesterAvailableAccountId, amount: -command.amount },
      { accountId: command.requesterHeldAccountId, amount: command.amount },
    ],
  });

  return freezeLedger({
    ...posted,
    jobFunds: [
      ...posted.jobFunds,
      freezeJobFunds({
        jobId: command.jobId,
        status: "RESERVED",
        reservedAmount: command.amount,
        requesterAvailableAccountId: command.requesterAvailableAccountId,
        requesterHeldAccountId: command.requesterHeldAccountId,
        reserveTransactionId: command.transactionId,
      }),
    ],
  });
}

export function settleDemoCredits(
  ledger: DemoLedger,
  command: SettleDemoCreditsCommand,
): DemoLedger {
  assertIdentifier(command.transactionId, "transactionId");
  assertIdentifier(command.idempotencyKey, "idempotencyKey");
  assertIdentifier(command.jobId, "jobId");
  assertPositive(command.grossAmount, "grossAmount");
  assertNonNegative(command.platformFee, "platformFee");
  const commandFingerprint = fingerprint([
    "SETTLE",
    command.transactionId,
    command.jobId,
    command.providerPendingAccountId,
    command.platformRevenueAccountId,
    command.grossAmount,
    command.platformFee,
  ]);
  if (isIdempotentReplay(ledger, command.idempotencyKey, commandFingerprint)) return ledger;
  assertUnusedTransactionId(ledger, command.transactionId);

  const funds = getJobFundsRecord(ledger, command.jobId);
  if (!funds || funds.status !== "RESERVED") {
    throw new JobFundsStateError(command.jobId, "RESERVED", funds?.status ?? "UNRESERVED");
  }
  if (command.grossAmount > funds.reservedAmount) {
    throw new InvalidMicrocreditAmountError("grossAmount cannot exceed the reserved amount.");
  }
  if (command.platformFee > command.grossAmount) {
    throw new InvalidMicrocreditAmountError("platformFee cannot exceed grossAmount.");
  }
  assertPurpose(ledger, funds.requesterAvailableAccountId, "requester_available");
  assertPurpose(ledger, funds.requesterHeldAccountId, "requester_held");
  assertPurpose(ledger, command.providerPendingAccountId, "provider_pending");
  assertPurpose(ledger, command.platformRevenueAccountId, "platform_revenue");

  const providerAmount = command.grossAmount - command.platformFee;
  const releasedAmount = funds.reservedAmount - command.grossAmount;
  const entries: LedgerEntry[] = [
    { accountId: funds.requesterHeldAccountId, amount: -funds.reservedAmount },
  ];
  if (releasedAmount > ZERO) {
    entries.push({ accountId: funds.requesterAvailableAccountId, amount: releasedAmount });
  }
  if (providerAmount > ZERO) {
    entries.push({ accountId: command.providerPendingAccountId, amount: providerAmount });
  }
  if (command.platformFee > ZERO) {
    entries.push({ accountId: command.platformRevenueAccountId, amount: command.platformFee });
  }

  const posted = appendTransaction(ledger, {
    id: command.transactionId,
    idempotencyKey: command.idempotencyKey,
    idempotencyFingerprint: commandFingerprint,
    kind: "SETTLE",
    jobId: command.jobId,
    entries,
  });
  const finalized = freezeJobFunds({
    ...funds,
    status: "SETTLED",
    finalTransactionId: command.transactionId,
    grossAmount: command.grossAmount,
    providerAmount,
    platformFee: command.platformFee,
    releasedAmount,
  });

  return freezeLedger({
    ...posted,
    jobFunds: posted.jobFunds.map((record) => (record.jobId === command.jobId ? finalized : record)),
  });
}

export function refundDemoCredits(
  ledger: DemoLedger,
  command: RefundDemoCreditsCommand,
): DemoLedger {
  assertIdentifier(command.transactionId, "transactionId");
  assertIdentifier(command.idempotencyKey, "idempotencyKey");
  assertIdentifier(command.jobId, "jobId");
  const commandFingerprint = fingerprint(["REFUND", command.transactionId, command.jobId]);
  if (isIdempotentReplay(ledger, command.idempotencyKey, commandFingerprint)) return ledger;
  assertUnusedTransactionId(ledger, command.transactionId);

  const funds = getJobFundsRecord(ledger, command.jobId);
  if (!funds || funds.status !== "RESERVED") {
    throw new JobFundsStateError(command.jobId, "RESERVED", funds?.status ?? "UNRESERVED");
  }
  assertPurpose(ledger, funds.requesterAvailableAccountId, "requester_available");
  assertPurpose(ledger, funds.requesterHeldAccountId, "requester_held");

  const posted = appendTransaction(ledger, {
    id: command.transactionId,
    idempotencyKey: command.idempotencyKey,
    idempotencyFingerprint: commandFingerprint,
    kind: "REFUND",
    jobId: command.jobId,
    entries: [
      { accountId: funds.requesterHeldAccountId, amount: -funds.reservedAmount },
      { accountId: funds.requesterAvailableAccountId, amount: funds.reservedAmount },
    ],
  });
  const finalized = freezeJobFunds({
    ...funds,
    status: "REFUNDED",
    finalTransactionId: command.transactionId,
    releasedAmount: funds.reservedAmount,
  });

  return freezeLedger({
    ...posted,
    jobFunds: posted.jobFunds.map((record) => (record.jobId === command.jobId ? finalized : record)),
  });
}

/** Audits every transaction and the aggregate ledger without mutating state. */
export function assertLedgerBalanced(ledger: DemoLedger): void {
  const transactionIds = new Set<string>();
  const idempotencyKeys = new Set<string>();
  for (const transaction of ledger.transactions) {
    validateTransaction(ledger, transaction);
    if (transactionIds.has(transaction.id)) {
      throw new LedgerInvariantError(`Duplicate transaction id ${transaction.id}.`);
    }
    if (idempotencyKeys.has(transaction.idempotencyKey)) {
      throw new LedgerInvariantError(
        `Duplicate idempotency key ${transaction.idempotencyKey}.`,
      );
    }
    transactionIds.add(transaction.id);
    idempotencyKeys.add(transaction.idempotencyKey);
  }

  const aggregate = ledger.accounts.reduce(
    (total, account) => total + getAccountBalance(ledger, account.id),
    ZERO,
  );
  if (aggregate !== ZERO) {
    throw new LedgerInvariantError(`Ledger aggregate is out of balance by ${aggregate.toString()}.`);
  }
  assertNoNegativeProtectedBalances(ledger);

  const jobIds = new Set<string>();
  const outstandingByHeldAccount = new Map<string, Microcredits>();
  for (const funds of ledger.jobFunds) {
    assertIdentifier(funds.jobId, "jobFunds.jobId");
    if (jobIds.has(funds.jobId)) {
      throw new LedgerInvariantError(`Duplicate funds record for job ${funds.jobId}.`);
    }
    jobIds.add(funds.jobId);
    assertPositive(funds.reservedAmount, "jobFunds.reservedAmount");
    assertPurpose(ledger, funds.requesterAvailableAccountId, "requester_available");
    assertPurpose(ledger, funds.requesterHeldAccountId, "requester_held");
    if (
      getAccount(ledger, funds.requesterAvailableAccountId).ownerId !==
      getAccount(ledger, funds.requesterHeldAccountId).ownerId
    ) {
      throw new LedgerInvariantError(`Job ${funds.jobId} requester accounts have different owners.`);
    }

    const reserveTransaction = ledger.transactions.find(
      (transaction) => transaction.id === funds.reserveTransactionId,
    );
    if (reserveTransaction?.kind !== "RESERVE" || reserveTransaction.jobId !== funds.jobId) {
      throw new LedgerInvariantError(`Job ${funds.jobId} has no matching reserve transaction.`);
    }

    if (funds.status === "RESERVED") {
      if (funds.finalTransactionId !== undefined) {
        throw new LedgerInvariantError(`Reserved job ${funds.jobId} must not have a final transaction.`);
      }
      outstandingByHeldAccount.set(
        funds.requesterHeldAccountId,
        (outstandingByHeldAccount.get(funds.requesterHeldAccountId) ?? ZERO) + funds.reservedAmount,
      );
      continue;
    }

    const finalTransaction = ledger.transactions.find(
      (transaction) => transaction.id === funds.finalTransactionId,
    );
    const expectedKind: LedgerTransactionKind = funds.status === "SETTLED" ? "SETTLE" : "REFUND";
    if (finalTransaction?.kind !== expectedKind || finalTransaction.jobId !== funds.jobId) {
      throw new LedgerInvariantError(`Job ${funds.jobId} has no matching ${expectedKind} transaction.`);
    }

    if (funds.status === "SETTLED") {
      if (
        funds.grossAmount === undefined ||
        funds.providerAmount === undefined ||
        funds.platformFee === undefined ||
        funds.releasedAmount === undefined ||
        funds.providerAmount + funds.platformFee !== funds.grossAmount ||
        funds.grossAmount + funds.releasedAmount !== funds.reservedAmount
      ) {
        throw new LedgerInvariantError(`Job ${funds.jobId} settlement amounts are inconsistent.`);
      }
    } else if (funds.releasedAmount !== funds.reservedAmount) {
      throw new LedgerInvariantError(`Job ${funds.jobId} refund does not release the full reserve.`);
    }
  }

  for (const account of ledger.accounts.filter((item) => item.purpose === "requester_held")) {
    const expected = outstandingByHeldAccount.get(account.id) ?? ZERO;
    const actual = getAccountBalance(ledger, account.id);
    if (actual !== expected) {
      throw new LedgerInvariantError(
        `Held account ${account.id} balance ${actual.toString()} does not match outstanding reserves ${expected.toString()}.`,
      );
    }
  }
}
