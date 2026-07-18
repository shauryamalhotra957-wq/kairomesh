import { describe, expect, it } from "vitest";
import {
  ATTEMPT_STATES,
  advanceJobFence,
  canTransitionAttempt,
  canTransitionJob,
  createAttemptSnapshot,
  createJobSnapshot,
  FencingTokenConflictError,
  IllegalTransitionError,
  isTerminalAttemptState,
  isTerminalJobState,
  JOB_STATES,
  requeueLostRunningAttempt,
  StateMachineError,
  StateVersionConflictError,
  transitionAttempt,
  transitionJob,
  type AttemptSnapshot,
  type AttemptState,
  type JobSnapshot,
  type JobState,
} from "./state-machine";

const jobSnapshot = (state: JobState, stateVersion = 7, fencingToken = 3): JobSnapshot => ({
  jobId: "job-001",
  state,
  stateVersion,
  fencingToken,
});

const attemptSnapshot = (state: AttemptState, stateVersion = 7): AttemptSnapshot => ({
  attemptId: "attempt-001",
  jobId: "job-001",
  state,
  stateVersion,
  fencingToken: 3,
});

const expectedJobTransitions: Readonly<Record<JobState, readonly JobState[]>> = {
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

const expectedAttemptTransitions: Readonly<Record<AttemptState, readonly AttemptState[]>> = {
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

describe("job state machine", () => {
  it("runs the funded, fenced, executed, verified, and settled happy path immutably", () => {
    const draft = createJobSnapshot("job-001");
    const funded = transitionJob(draft, {
      to: "FUNDS_HELD",
      expectedStateVersion: 0,
      fencingToken: 0,
    });
    const queued = transitionJob(funded, {
      to: "QUEUED",
      expectedStateVersion: 1,
      fencingToken: 0,
    });
    const fenced = advanceJobFence(queued, 2);
    const leased = transitionJob(fenced, {
      to: "LEASED",
      expectedStateVersion: 3,
      fencingToken: 1,
    });
    const running = transitionJob(leased, {
      to: "RUNNING",
      expectedStateVersion: 4,
      fencingToken: 1,
    });
    const verifying = transitionJob(running, {
      to: "VERIFYING",
      expectedStateVersion: 5,
      fencingToken: 1,
    });
    const settled = transitionJob(verifying, {
      to: "SETTLED",
      expectedStateVersion: 6,
      fencingToken: 1,
    });

    expect(draft).toEqual({ jobId: "job-001", state: "DRAFT", stateVersion: 0, fencingToken: 0 });
    expect(Object.isFrozen(draft)).toBe(true);
    expect(settled).toEqual({
      jobId: "job-001",
      state: "SETTLED",
      stateVersion: 7,
      fencingToken: 1,
    });
    expect(isTerminalJobState(settled.state)).toBe(true);
  });

  it("exhaustively accepts only the declared transition graph", () => {
    for (const from of JOB_STATES) {
      for (const to of JOB_STATES) {
        const allowed = expectedJobTransitions[from].includes(to);
        expect(canTransitionJob(from, to), `${from} -> ${to}`).toBe(allowed);

        const apply = () =>
          transitionJob(jobSnapshot(from), {
            to,
            expectedStateVersion: 7,
            fencingToken: 3,
          });
        if (allowed) {
          expect(apply().state, `${from} -> ${to}`).toBe(to);
        } else {
          expect(apply, `${from} -> ${to}`).toThrow(IllegalTransitionError);
        }
      }
    }
  });

  it("rejects stale and speculative state versions", () => {
    const current = jobSnapshot("RUNNING", 5, 2);
    for (const expectedStateVersion of [4, 6]) {
      expect(() =>
        transitionJob(current, { to: "VERIFYING", expectedStateVersion, fencingToken: 2 }),
      ).toThrow(StateVersionConflictError);
    }
  });

  it("rejects stale and unissued fencing tokens", () => {
    const current = jobSnapshot("RUNNING", 5, 4);
    for (const fencingToken of [3, 5]) {
      expect(() =>
        transitionJob(current, { to: "VERIFYING", expectedStateVersion: 5, fencingToken }),
      ).toThrow(FencingTokenConflictError);
    }
  });

  it("increments the fence only while queued and with the current version", () => {
    const queued = jobSnapshot("QUEUED", 8, 12);
    expect(advanceJobFence(queued, 8)).toEqual({
      ...queued,
      stateVersion: 9,
      fencingToken: 13,
    });
    expect(() => advanceJobFence(queued, 7)).toThrow(StateVersionConflictError);

    try {
      advanceJobFence(jobSnapshot("RUNNING", 8, 12), 8);
      throw new Error("Expected fence advance to fail.");
    } catch (error) {
      expect(error).toBeInstanceOf(StateMachineError);
      expect((error as StateMachineError).code).toBe("ILLEGAL_FENCE_ADVANCE");
    }
  });

  it("rejects a completion event from a lease superseded by failover", () => {
    const firstLease = jobSnapshot("LEASED", 4, 1);
    const requeued = transitionJob(firstLease, {
      to: "QUEUED",
      expectedStateVersion: 4,
      fencingToken: 1,
    });
    const replacement = advanceJobFence(requeued, 5);

    expect(() =>
      transitionJob(replacement, {
        to: "LEASED",
        expectedStateVersion: 6,
        fencingToken: 1,
      }),
    ).toThrow(FencingTokenConflictError);
    expect(replacement.fencingToken).toBe(2);
  });

  it("requeues a lost running attempt and issues a replacement fence", () => {
    const runningJob = jobSnapshot("RUNNING", 5, 1);
    const runningAttempt: AttemptSnapshot = {
      attemptId: "attempt-live",
      jobId: runningJob.jobId,
      state: "RUNNING",
      stateVersion: 3,
      fencingToken: 1,
    };

    const recovered = requeueLostRunningAttempt(runningJob, runningAttempt, 5, 3);
    expect(recovered.lostAttempt).toMatchObject({ state: "LOST", stateVersion: 4, fencingToken: 1 });
    expect(recovered.job).toEqual({ ...runningJob, state: "QUEUED", stateVersion: 7, fencingToken: 2 });
    expect(() =>
      transitionJob(recovered.job, { to: "LEASED", expectedStateVersion: 7, fencingToken: 1 }),
    ).toThrow(FencingTokenConflictError);
  });

  it("keeps terminal states terminal", () => {
    expect(JOB_STATES.filter(isTerminalJobState)).toEqual([
      "SETTLED",
      "REFUNDED",
      "CANCELLED",
      "FAILED",
    ]);
    for (const terminal of JOB_STATES.filter(isTerminalJobState)) {
      expect(expectedJobTransitions[terminal]).toHaveLength(0);
    }
  });

  it("validates identifiers and counter bounds", () => {
    expect(() => createJobSnapshot("  ")).toThrow(/jobId/);
    expect(() => advanceJobFence(jobSnapshot("QUEUED", 1, Number.MAX_SAFE_INTEGER), 1)).toThrow(
      /MAX_SAFE_INTEGER/,
    );
    expect(() =>
      transitionJob(jobSnapshot("RUNNING", Number.MAX_SAFE_INTEGER, 1), {
        to: "VERIFYING",
        expectedStateVersion: Number.MAX_SAFE_INTEGER,
        fencingToken: 1,
      }),
    ).toThrow(/MAX_SAFE_INTEGER/);
    expect(() =>
      transitionJob(
        { ...jobSnapshot("RUNNING"), state: "UNKNOWN" as JobState },
        { to: "VERIFYING", expectedStateVersion: 7, fencingToken: 3 },
      ),
    ).toThrow(/Unknown job state/);
  });
});

describe("attempt state machine", () => {
  it("runs the offered-to-completed path and preserves the issued fence", () => {
    const offered = createAttemptSnapshot("attempt-001", "job-001", 9);
    const accepted = transitionAttempt(offered, {
      to: "ACCEPTED",
      expectedStateVersion: 0,
      fencingToken: 9,
    });
    const preparing = transitionAttempt(accepted, {
      to: "PREPARING",
      expectedStateVersion: 1,
      fencingToken: 9,
    });
    const running = transitionAttempt(preparing, {
      to: "RUNNING",
      expectedStateVersion: 2,
      fencingToken: 9,
    });
    const uploading = transitionAttempt(running, {
      to: "UPLOADING",
      expectedStateVersion: 3,
      fencingToken: 9,
    });
    const completed = transitionAttempt(uploading, {
      to: "COMPLETED",
      expectedStateVersion: 4,
      fencingToken: 9,
    });

    expect(completed).toEqual({
      attemptId: "attempt-001",
      jobId: "job-001",
      state: "COMPLETED",
      stateVersion: 5,
      fencingToken: 9,
    });
    expect(offered.state).toBe("OFFERED");
    expect(isTerminalAttemptState(completed.state)).toBe(true);
  });

  it("exhaustively accepts only the declared transition graph", () => {
    for (const from of ATTEMPT_STATES) {
      for (const to of ATTEMPT_STATES) {
        const allowed = expectedAttemptTransitions[from].includes(to);
        expect(canTransitionAttempt(from, to), `${from} -> ${to}`).toBe(allowed);

        const apply = () =>
          transitionAttempt(attemptSnapshot(from), {
            to,
            expectedStateVersion: 7,
            fencingToken: 3,
          });
        if (allowed) {
          expect(apply().state, `${from} -> ${to}`).toBe(to);
        } else {
          expect(apply, `${from} -> ${to}`).toThrow(IllegalTransitionError);
        }
      }
    }
  });

  it("rejects duplicate, stale, and future attempt events", () => {
    const running = attemptSnapshot("RUNNING", 3);
    const uploaded = transitionAttempt(running, {
      to: "UPLOADING",
      expectedStateVersion: 3,
      fencingToken: 3,
    });

    expect(() =>
      transitionAttempt(uploaded, {
        to: "COMPLETED",
        expectedStateVersion: 3,
        fencingToken: 3,
      }),
    ).toThrow(StateVersionConflictError);
    expect(() =>
      transitionAttempt(uploaded, {
        to: "COMPLETED",
        expectedStateVersion: 4,
        fencingToken: 2,
      }),
    ).toThrow(FencingTokenConflictError);
    expect(() =>
      transitionAttempt(uploaded, {
        to: "COMPLETED",
        expectedStateVersion: 4,
        fencingToken: 4,
      }),
    ).toThrow(FencingTokenConflictError);
  });

  it("supports rejection, failure, loss, cancellation, and supersession terminal paths", () => {
    expect(ATTEMPT_STATES.filter(isTerminalAttemptState)).toEqual([
      "COMPLETED",
      "REJECTED",
      "FAILED",
      "LOST",
      "CANCELLED",
      "SUPERSEDED",
    ]);
    for (const terminal of ATTEMPT_STATES.filter(isTerminalAttemptState)) {
      expect(expectedAttemptTransitions[terminal]).toHaveLength(0);
    }
  });

  it("requires a valid non-zero job-issued fence", () => {
    expect(() => createAttemptSnapshot("", "job-001", 1)).toThrow(/attemptId/);
    expect(() => createAttemptSnapshot("attempt-001", "", 1)).toThrow(/jobId/);
    expect(() => createAttemptSnapshot("attempt-001", "job-001", 0)).toThrow(/non-zero/);
    expect(() => createAttemptSnapshot("attempt-001", "job-001", -1)).toThrow(/non-negative/);
  });
});
