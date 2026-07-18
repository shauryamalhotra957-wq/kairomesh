export const JOB_STATES = [
  "DRAFT",
  "FUNDS_HELD",
  "QUEUED",
  "LEASED",
  "RUNNING",
  "CANCELLING",
  "VERIFYING",
  "DISPUTED",
  "SETTLED",
  "REFUNDED",
  "CANCELLED",
  "FAILED",
] as const;

export type JobState = (typeof JOB_STATES)[number];

export const ATTEMPT_STATES = [
  "OFFERED",
  "ACCEPTED",
  "PREPARING",
  "RUNNING",
  "UPLOADING",
  "COMPLETED",
  "REJECTED",
  "FAILED",
  "LOST",
  "CANCELLED",
  "SUPERSEDED",
] as const;

export type AttemptState = (typeof ATTEMPT_STATES)[number];

export type StateMachineErrorCode =
  | "INVALID_SNAPSHOT"
  | "ILLEGAL_TRANSITION"
  | "STATE_VERSION_CONFLICT"
  | "FENCING_TOKEN_CONFLICT"
  | "ILLEGAL_FENCE_ADVANCE";

export class StateMachineError extends Error {
  readonly code: StateMachineErrorCode;

  constructor(code: StateMachineErrorCode, message: string) {
    super(message);
    this.name = "StateMachineError";
    this.code = code;
  }
}

export class InvalidSnapshotError extends StateMachineError {
  constructor(message: string) {
    super("INVALID_SNAPSHOT", message);
    this.name = "InvalidSnapshotError";
  }
}

export class IllegalTransitionError extends StateMachineError {
  readonly from: JobState | AttemptState;
  readonly to: JobState | AttemptState;

  constructor(entity: "job" | "attempt", from: JobState | AttemptState, to: JobState | AttemptState) {
    super("ILLEGAL_TRANSITION", `Illegal ${entity} transition: ${from} -> ${to}.`);
    this.name = "IllegalTransitionError";
    this.from = from;
    this.to = to;
  }
}

export class StateVersionConflictError extends StateMachineError {
  readonly expected: number;
  readonly actual: number;

  constructor(expected: number, actual: number) {
    super(
      "STATE_VERSION_CONFLICT",
      `Stale state version: command expected ${expected}, current version is ${actual}.`,
    );
    this.name = "StateVersionConflictError";
    this.expected = expected;
    this.actual = actual;
  }
}

export class FencingTokenConflictError extends StateMachineError {
  readonly supplied: number;
  readonly current: number;

  constructor(supplied: number, current: number) {
    super(
      "FENCING_TOKEN_CONFLICT",
      `Rejected event with fencing token ${supplied}; current token is ${current}.`,
    );
    this.name = "FencingTokenConflictError";
    this.supplied = supplied;
    this.current = current;
  }
}

export interface JobSnapshot {
  readonly jobId: string;
  readonly state: JobState;
  readonly stateVersion: number;
  readonly fencingToken: number;
}

export interface AttemptSnapshot {
  readonly attemptId: string;
  readonly jobId: string;
  readonly state: AttemptState;
  readonly stateVersion: number;
  readonly fencingToken: number;
}

export interface TransitionCommand<State extends string> {
  readonly to: State;
  readonly expectedStateVersion: number;
  readonly fencingToken: number;
}

const JOB_TRANSITIONS: Readonly<Record<JobState, readonly JobState[]>> = {
  DRAFT: ["FUNDS_HELD", "CANCELLED"],
  FUNDS_HELD: ["QUEUED", "REFUNDED", "CANCELLED", "FAILED"],
  QUEUED: ["LEASED", "REFUNDED", "CANCELLED", "FAILED"],
  LEASED: ["RUNNING", "QUEUED", "CANCELLING", "CANCELLED", "FAILED"],
  RUNNING: ["QUEUED", "VERIFYING", "CANCELLING", "FAILED"],
  CANCELLING: ["CANCELLED", "FAILED"],
  VERIFYING: ["SETTLED", "DISPUTED", "REFUNDED", "FAILED"],
  DISPUTED: ["SETTLED", "REFUNDED"],
  SETTLED: [],
  REFUNDED: [],
  CANCELLED: [],
  FAILED: [],
};

const ATTEMPT_TRANSITIONS: Readonly<Record<AttemptState, readonly AttemptState[]>> = {
  OFFERED: ["ACCEPTED", "REJECTED", "LOST", "CANCELLED", "SUPERSEDED"],
  ACCEPTED: ["PREPARING", "FAILED", "LOST", "CANCELLED", "SUPERSEDED"],
  PREPARING: ["RUNNING", "FAILED", "LOST", "CANCELLED", "SUPERSEDED"],
  RUNNING: ["UPLOADING", "FAILED", "LOST", "CANCELLED", "SUPERSEDED"],
  UPLOADING: ["COMPLETED", "FAILED", "LOST", "CANCELLED", "SUPERSEDED"],
  COMPLETED: [],
  REJECTED: [],
  FAILED: [],
  LOST: [],
  CANCELLED: [],
  SUPERSEDED: [],
};

const JOB_TERMINAL_STATES = new Set<JobState>(["SETTLED", "REFUNDED", "CANCELLED", "FAILED"]);
const ATTEMPT_TERMINAL_STATES = new Set<AttemptState>([
  "COMPLETED",
  "REJECTED",
  "FAILED",
  "LOST",
  "CANCELLED",
  "SUPERSEDED",
]);

function assertNonEmptyId(value: string, field: string): void {
  if (value.trim().length === 0) {
    throw new InvalidSnapshotError(`${field} must not be empty.`);
  }
}

function assertCounter(value: number, field: string): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new InvalidSnapshotError(`${field} must be a non-negative safe integer.`);
  }
}

function assertIncrementableCounter(value: number, field: string): void {
  assertCounter(value, field);
  if (value === Number.MAX_SAFE_INTEGER) {
    throw new InvalidSnapshotError(`${field} cannot be advanced beyond Number.MAX_SAFE_INTEGER.`);
  }
}

function assertJobState(state: JobState): void {
  if (!JOB_STATES.includes(state)) {
    throw new InvalidSnapshotError(`Unknown job state: ${String(state)}.`);
  }
}

function assertAttemptState(state: AttemptState): void {
  if (!ATTEMPT_STATES.includes(state)) {
    throw new InvalidSnapshotError(`Unknown attempt state: ${String(state)}.`);
  }
}

function assertTransitionMetadata(
  currentVersion: number,
  currentFence: number,
  command: TransitionCommand<string>,
): void {
  assertCounter(command.expectedStateVersion, "expectedStateVersion");
  assertCounter(command.fencingToken, "fencingToken");

  if (command.expectedStateVersion !== currentVersion) {
    throw new StateVersionConflictError(command.expectedStateVersion, currentVersion);
  }
  if (command.fencingToken !== currentFence) {
    throw new FencingTokenConflictError(command.fencingToken, currentFence);
  }
}

export function createJobSnapshot(jobId: string): JobSnapshot {
  assertNonEmptyId(jobId, "jobId");
  return Object.freeze({ jobId, state: "DRAFT", stateVersion: 0, fencingToken: 0 });
}

export function createAttemptSnapshot(
  attemptId: string,
  jobId: string,
  fencingToken: number,
): AttemptSnapshot {
  assertNonEmptyId(attemptId, "attemptId");
  assertNonEmptyId(jobId, "jobId");
  assertCounter(fencingToken, "fencingToken");
  if (fencingToken === 0) {
    throw new InvalidSnapshotError("An attempt requires a non-zero fencing token issued by the job.");
  }

  return Object.freeze({
    attemptId,
    jobId,
    state: "OFFERED",
    stateVersion: 0,
    fencingToken,
  });
}

export function canTransitionJob(from: JobState, to: JobState): boolean {
  return JOB_TRANSITIONS[from].includes(to);
}

export function canTransitionAttempt(from: AttemptState, to: AttemptState): boolean {
  return ATTEMPT_TRANSITIONS[from].includes(to);
}

export function isTerminalJobState(state: JobState): boolean {
  return JOB_TERMINAL_STATES.has(state);
}

export function isTerminalAttemptState(state: AttemptState): boolean {
  return ATTEMPT_TERMINAL_STATES.has(state);
}

export function transitionJob(
  snapshot: JobSnapshot,
  command: TransitionCommand<JobState>,
): JobSnapshot {
  assertNonEmptyId(snapshot.jobId, "jobId");
  assertJobState(snapshot.state);
  assertIncrementableCounter(snapshot.stateVersion, "stateVersion");
  assertCounter(snapshot.fencingToken, "fencingToken");
  assertTransitionMetadata(snapshot.stateVersion, snapshot.fencingToken, command);

  if (!canTransitionJob(snapshot.state, command.to)) {
    throw new IllegalTransitionError("job", snapshot.state, command.to);
  }

  return Object.freeze({
    ...snapshot,
    state: command.to,
    stateVersion: snapshot.stateVersion + 1,
  });
}

export function transitionAttempt(
  snapshot: AttemptSnapshot,
  command: TransitionCommand<AttemptState>,
): AttemptSnapshot {
  assertNonEmptyId(snapshot.attemptId, "attemptId");
  assertNonEmptyId(snapshot.jobId, "jobId");
  assertAttemptState(snapshot.state);
  assertIncrementableCounter(snapshot.stateVersion, "stateVersion");
  assertCounter(snapshot.fencingToken, "fencingToken");
  assertTransitionMetadata(snapshot.stateVersion, snapshot.fencingToken, command);

  if (!canTransitionAttempt(snapshot.state, command.to)) {
    throw new IllegalTransitionError("attempt", snapshot.state, command.to);
  }

  return Object.freeze({
    ...snapshot,
    state: command.to,
    stateVersion: snapshot.stateVersion + 1,
  });
}

/**
 * Issues the next lease fence while a job is queued. Keeping this separate from
 * state transitions makes every assignment explicit and prevents a late event
 * from a previous attempt from mutating the current job.
 */
export function advanceJobFence(snapshot: JobSnapshot, expectedStateVersion: number): JobSnapshot {
  assertNonEmptyId(snapshot.jobId, "jobId");
  assertJobState(snapshot.state);
  assertIncrementableCounter(snapshot.stateVersion, "stateVersion");
  assertIncrementableCounter(snapshot.fencingToken, "fencingToken");
  assertCounter(expectedStateVersion, "expectedStateVersion");
  if (expectedStateVersion !== snapshot.stateVersion) {
    throw new StateVersionConflictError(expectedStateVersion, snapshot.stateVersion);
  }
  if (snapshot.state !== "QUEUED") {
    throw new StateMachineError(
      "ILLEGAL_FENCE_ADVANCE",
      `A new fencing token can only be issued while QUEUED; job is ${snapshot.state}.`,
    );
  }
  return Object.freeze({
    ...snapshot,
    stateVersion: snapshot.stateVersion + 1,
    fencingToken: snapshot.fencingToken + 1,
  });
}

export function requeueLostRunningAttempt(
  job: JobSnapshot,
  attempt: AttemptSnapshot,
  expectedJobVersion: number,
  expectedAttemptVersion: number,
): { job: JobSnapshot; lostAttempt: AttemptSnapshot } {
  if (attempt.jobId !== job.jobId) {
    throw new InvalidSnapshotError("Attempt and job identifiers must match for recovery.");
  }
  if (job.state !== "RUNNING" || attempt.state !== "RUNNING") {
    throw new StateMachineError(
      "ILLEGAL_FENCE_ADVANCE",
      `Recovery requires RUNNING job and attempt snapshots; received ${job.state}/${attempt.state}.`,
    );
  }
  if (attempt.fencingToken !== job.fencingToken) {
    throw new FencingTokenConflictError(attempt.fencingToken, job.fencingToken);
  }

  const lostAttempt = transitionAttempt(attempt, {
    to: "LOST",
    expectedStateVersion: expectedAttemptVersion,
    fencingToken: job.fencingToken,
  });
  const queuedJob = transitionJob(job, {
    to: "QUEUED",
    expectedStateVersion: expectedJobVersion,
    fencingToken: job.fencingToken,
  });

  return Object.freeze({
    lostAttempt,
    job: advanceJobFence(queuedJob, queuedJob.stateVersion),
  });
}
