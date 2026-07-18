# KairoMesh demo guide

**Audience:** technical demo, portfolio review, startup pitch, or classroom presentation
**Runtime:** 3-5 minutes
**Mode:** deterministic presenter using synthetic inventory and credits

## Before the room joins

1. Install dependencies with `npm ci`.
2. Run `npm run check` once before the presentation.
3. Start the app with `npm run dev` and open `http://localhost:3000/console`.
4. Confirm the page says **Synthetic network** and the status says **Ready**.
5. Leave the default isolated evidence tier and balanced routing profile selected for the most reliable script.
6. Reset after any rehearsal so the event rail starts from `DEMO_READY`.

No internet connection, account, payment method, or GPU is needed after dependencies are installed.

## The four-minute talk track

### 0:00 - State the problem

> Peer GPU supply can be cheap and geographically diverse, but individual hosts are unreliable and provider-controlled. Renting a machine is not the same as receiving a trustworthy result.

Open the landing page briefly, then enter **Mission Control**.

### 0:30 - Define the contract

Point to the workload, evidence floor, and routing profile.

> KairoMesh narrows the problem to bounded, checkpointable catalog jobs. This prototype chooses eligible capacity against an explicit policy and explains the score. The hosts and prices here are synthetic; the scheduling code is real.

Change the routing profile once if you want to show the quote being recalculated through `POST /api/quote`, then return to **Balanced**.

### 1:00 - Start a run

Select **Launch demo run**. Wait until the event rail reaches `CHECKPOINT_18`; the presenter actions stay disabled until a recoverable checkpoint exists.

> The controller reserves demo credits, accepts a digest-pinned template, checks the requested evidence tier, and leases three synthetic shards with fence 01.

Do not say that a container, GPU, signature, attestation, or encryption operation is actually running. Those events are presenter state.

### 1:35 - Break the host

Select **Disconnect host**.

Call out the event sequence:

1. `HEARTBEAT_LOST` marks the current host unavailable.
2. The real failover selector excludes the failed node from seeded offers.
3. `FENCE_INCREMENTED` changes `01` to `02`, illustrating why a late result cannot win.
4. `CHECKPOINT_RESTORED` resumes the presenter run on a standby.
5. The output policy passes and the demo ledger settles.

> The key product idea is continuity with a visible trust record, not remote desktop access to somebody else's computer.

### 2:30 - Verify the receipt

When the receipt explorer appears, select **Verify chain in browser**.

> The browser independently recomputes all nine SHA-256 links and compares the result with the displayed root hash. That detects mutation after the root is known. It does not prove who ran the job or that arbitrary computation was correct.

This distinction is a feature of the presentation, not a disclaimer to rush past.

### 3:05 - Show the adversarial branch

Select **Reset**, launch again, wait for the presenter actions, and select **Corrupt output**.

> A claimed artifact disagrees with an independent sample. The presenter quarantines the node, returns the held demo credits, records zero provider payout, and withholds the success receipt. A marketplace should fail closed when its evidence policy fails.

Close on the architecture or provider page depending on the audience.

## Alternate clean path

For a shorter demo, choose **Continue clean** after launch. The run goes directly through output-policy verification, receipt creation and browser integrity checking, then illustrated settlement. This proves the happy path without the recovery sequence.

## What is real and what is staged

### Implemented

- Next.js product and Mission Control interfaces.
- Validated quote and receipt API routes.
- Deterministic multi-factor scheduler and failover selection.
- Browser Web Crypto receipt verification.
- Tested state-transition, fencing, idempotency, and balanced-ledger domain libraries.
- Responsive, keyboard, reduced-motion, and automated accessibility coverage.

### Staged or synthetic

- Hosts, GPU inventory, prices, reliability, carbon, location, and availability.
- Heartbeats, leases, shards, checkpoints, output samples, quarantine, and telemetry.
- Compute Passport evidence tiers and any claim of isolation or attestation.
- Credit holds, settlement, provider earnings, and platform fees in the interface.

### Not present

- Authentication, tenants, persistent storage, queues, object storage, or remote agents.
- Container execution, GPU isolation, image signature verification, or network enforcement.
- Node signatures, hardware attestation, independent re-execution, or a verification CLI.
- Billing, payout, escrow, tax, dispute, or compliance systems.

## Claims guide

| Say | Do not say |
|---|---|
| "Tamper-evident SHA-256 event chain" | "Cryptographic proof the GPU did the work" |
| "Synthetic evidence tier" | "The consumer GPU is remotely attested" |
| "Demo-credit hold" | "Escrow" or "customer funds" |
| "Presenter failover using the real selector" | "A live host failed" |
| "Tested state and ledger libraries" | "A distributed control plane is running" |
| "Policy-bound catalog-job thesis" | "Safe arbitrary shell on strangers' computers" |
| "Provider root can inspect non-confidential workloads" | "Your model is private on community nodes" |

## Likely questions

**How is this different from an ordinary GPU marketplace?**
The wedge is an outcome contract for checkpointable batch work: policy-based placement, explicit failover fencing, output validation, and a receipt. It is not another remote machine catalog.

**Can a community provider read the requester's data?**
Assume yes. Isolation protects the provider host from the workload; it does not protect a workload from a provider with root. Confidential jobs require a separately reviewed design on supported attested hardware.

**Does the receipt prove the result is correct?**
No. The implemented chain detects changes to an ordered event record after its root is known. Production correctness needs task-specific validators, independent re-execution, or both. Signatures would add attribution, not generic correctness.

**Is the settlement real?**
No. The interface uses synthetic demo credits. The tested ledger module demonstrates exact integer accounting and invariants but is not connected to the UI or a payment system.

**What would block a real pilot?**
Authentication and tenancy, durable transactions, a reviewed outbound-only agent, enforced sandbox and egress policy, safe storage capabilities, real validation, abuse operations, and payment/legal review. The complete list is in [ARCHITECTURE.md](ARCHITECTURE.md#12-deployment-gates).

## Recovery if something goes wrong

- If a quote says no capacity, return to **Isolated**, choose **Balanced**, and use the default workload.
- If an action is disabled, wait until the run reaches `CHECKPOINT_18`.
- If a receipt does not appear, select **Reset** and replay the clean path.
- If the page state is stale after a code rebuild, refresh; all presenter state is intentionally browser-local.
- If the API is unavailable, check `GET /api/health` and the development-server console.

For operational and security incidents beyond the deterministic presenter, use [RUNBOOK.md](RUNBOOK.md). For implementation boundaries, read [ARCHITECTURE.md](ARCHITECTURE.md).
