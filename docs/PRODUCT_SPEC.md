# KairoMesh Product Specification

**Status:** Working product direction
**Product:** KairoMesh
**Category:** Receipt-carrying, resilient peer GPU compute research
**Primary wedge:** Batch ML, rendering, simulation, and other checkpointable GPU jobs
**One-line positioning:** KairoMesh schedules GPU jobs across independent providers, survives node failure, and returns an inspectable receipt chain for the outcome.

## 1. Product thesis

Peer GPU supply is not the novel part. The hard, valuable part is making heterogeneous, independently operated hardware dependable enough to trust with real work.

KairoMesh should therefore be presented as an **outcome cloud**, not merely a cheaper GPU directory:

- A renter declares the workload, budget, recovery needs, and trust policy.
- The scheduler chooses a diverse set of eligible nodes and explains the trade-offs.
- Checkpoints limit lost work and enable recovery onto a replacement node.
- Evidence events form a tamper-evident receipt chain.
- Settlement is conceptually tied to an accepted outcome, not to a host merely claiming that time elapsed.

### Product promise

> **The job is the outcome, not the machine.**

Supporting copy:

> KairoMesh turns independent GPUs into resilient compute. Set the policy, see why each node was chosen, recover across failures, and inspect the evidence behind every completed run.

Primary CTA: **Plan a verified run**
Secondary CTA: **Inspect a receipt**
Host CTA: **List a GPU**

### What KairoMesh is not

- Not an “Airbnb for GPUs” clone whose only differentiator is price.
- Not a promise that arbitrary machine-learning results are mathematically proven.
- Not a blockchain or token product by default.
- Not a low-latency gaming cloud in the first release.
- Not an AI scheduler unless a learned model is genuinely introduced; the current scheduler is a deterministic weighted heuristic.

## 2. Target users and jobs

### Renters

- Student and independent ML researchers who need short bursts of affordable GPU capacity.
- Creative teams rendering image, video, or Blender batches.
- Engineers running deterministic simulations or evaluation jobs.
- Small AI teams that value resumability and transparent scheduling more than a hyperscaler brand.

Their core job: **“Finish this GPU workload within my cost, trust, and recovery constraints without babysitting individual machines.”**

### Hosts

- Owners of capable personal workstations.
- Small studios, campus labs, gaming cafes, and boutique GPU operators with idle capacity.

Their core job: **“Earn from idle hardware without surrendering control of my machine, schedule, thermals, network, or privacy.”**

### Initial use-case boundary

Lead with checkpointable batch work: image batches, generative-video frames, LoRA fine-tunes, Blender frames, and deterministic simulations. Defer cloud gaming until there is sufficient regional density, video-streaming infrastructure, anti-cheat isolation, predictable latency, and interruption handling.

## 3. Product principles

1. **Evidence over badges.** A user must be able to inspect why a node or run earned a trust state.
2. **Failures should be boring.** A node loss is an event in a recoverable workflow, not a destroyed job.
3. **Explain every automated decision.** Show eligibility filters, factor weights, selected nodes, and failure-domain diversity.
4. **Trust is a policy.** Different workloads warrant different guarantees and prices.
5. **Do not overclaim.** Label simulations, synthetic inventory, estimated carbon, and unimplemented guarantees.
6. **Two-sided control.** Renters control outcome requirements; hosts control availability and acceptable use.
7. **Useful without crypto.** Standard signatures, hashes, escrow, and audit logs are sufficient for the core product.

## 4. Core product model

| Object | Meaning |
|---|---|
| Node | A physical or logically isolated host machine offering GPU capacity. |
| Passport | Time-bounded evidence about node identity, configuration, health, benchmarks, and trust capabilities. |
| Offer | A node's price, resources, region, availability, and operating terms. |
| Job request | Workload requirements, duration, budget, trust policy, recovery interval, and priority weights. |
| Schedule plan | Selected nodes, factor scores, expected cost/start time, diversity, and an explanation. |
| Run | The live execution of one job request. |
| Checkpoint | Recoverable intermediate state committed during a run. |
| Receipt event | An ordered fact about acceptance, attestation, work, recovery, output, or settlement. |
| Receipt chain | A tamper-evident ordered history whose hashes change if an earlier event is modified. |
| Payout | Host compensation associated with accepted work and settlement policy. |

## 5. Trust model

KairoMesh must avoid one ambiguous `Verified` label. The UI exposes a capability-based tier and the checks included in it.

### Tier 1 — Observed

- Fresh nonce-bound capability challenge.
- Signed agent identity when host signing is implemented.
- GPU model, VRAM, driver, benchmark, bandwidth, thermal, and uptime observations.
- Continuous health heartbeat during a run.

Appropriate for public-data batch work where price matters more than secrecy.

### Tier 2 — Isolated

- Everything in Observed.
- Measured OCI image digest.
- Hardened container or microVM boundary.
- Restricted filesystem, process privileges, and network egress.
- Ephemeral secrets and storage cleanup policy.

Appropriate for private code or data that does not require hardware confidential computing.

### Tier 3 — Attested

- Everything in Isolated.
- Hardware-backed CPU/GPU attestation on supported configurations.
- Policy-gated secret release only after fresh evidence passes.
- Evidence bound to a nonce to prevent replay.

This tier must only be shown for genuinely supported confidential-compute hardware and software. Consumer RTX inventory must not be described as hardware-attested merely because it passed a benchmark or secure-boot check.

### Result confidence

Attestation establishes facts about an execution environment; it does not prove the semantic correctness of arbitrary output. KairoMesh may increase confidence for deterministic or shardable jobs through:

- Deterministic seeds and content hashes.
- Duplicate sampling of a small percentage of shards.
- Frame or artifact checksums.
- Checkpoint-chain validation.
- Re-execution of disputed shards.

The interface should say **“Output policy passed”** or **“Receipt chain valid”**, not **“Result mathematically proven.”**

## 6. Information architecture

### Public product

- **Home** — positioning, live product narrative, trust, resilience, featured workloads, host CTA.
- **Exchange** — searchable offers and transparent comparison.
- **Trust** — tiers, threat model, receipt anatomy, limitations.
- **Host** — economics, requirements, controls, onboarding.
- **Developers** — API, manifests, CLI, webhooks, receipt verification.
- **Network status** — operational status and incident history.
- **Open console** — authenticated product entry.

### Console

| Destination | User question answered | Primary action |
|---|---|---|
| Control Room | What is running, at risk, or awaiting action? | Deploy workload |
| Exchange | Which eligible GPUs best fit my policy? | Select capacity |
| Deploy Studio | What am I running and under which guarantees? | Start run |
| Runs | What is active or completed? | Open run |
| Run Room | Is the job healthy, recoverable, and within budget? | Stop or extend |
| Receipts | Can I independently inspect this outcome history? | Verify receipt |
| Host Console | Are my nodes healthy, available, and profitable? | Add node |
| Node Passport | What evidence supports this node's capabilities? | Run self-test |
| Earnings / Billing | What did I earn or spend, and why? | Manage payout |
| Policies | Which reusable trust and recovery rules do I use? | Create policy |
| Developers | How do I automate KairoMesh? | Create API key |

Use a renter/host mode switch within one account rather than two disconnected applications.

### Responsive navigation

- Desktop: persistent sidebar with the current destination clearly marked.
- Tablet: compact icon-and-label rail.
- Mobile: at most five top-level items — Home, Exchange, Runs, Nodes, More.
- Preserve filters, scroll position, and draft requests when navigating back.
- Every significant view and receipt is deep-linkable.

## 7. Key flows

### A. Plan and deploy a run

1. Choose a workload preset or OCI image.
2. Set GPU count, minimum VRAM, duration, and price ceiling.
3. Select a trust tier and checkpoint interval.
4. Adjust priorities for cost, reliability, carbon, latency, and trust.
5. Request a quote.
6. Review eligible-node count, selected nodes, score factors, failure domains, forecast cost, and start time.
7. Confirm the plan and enter the Run Room.

The quote response must explain exclusions and selection. Example:

> “Three nodes selected from seven eligible offers across two failure domains. Checkpoints every eight minutes cap expected lost work. Requiring Attested would reduce eligible supply to one node.”

### B. Recover from node loss

1. A heartbeat expires or the presenter injects a clearly labelled demo failure.
2. The affected node becomes `lost` or `quarantined` with cause and timestamp.
3. The most recent committed checkpoint remains visibly fixed.
4. The scheduler selects an eligible replacement excluding active nodes.
5. The UI explains the replacement score and cost delta.
6. The shard resumes from the checkpoint.
7. `NODE_LOST` and `SHARD_RECOVERED` events enter the receipt chain.

The main progress indicator must not reset to zero. Failure motion should communicate rerouting, not catastrophe.

### C. Verify a receipt

1. Open a receipt by ID, URL, or pasted JSON.
2. Recompute the hash chain locally.
3. Show the exact event or link that fails if data is modified.
4. When digital signatures exist, verify the signer and key status separately from chain integrity.
5. Offer JSON export and a copyable CLI verification command.

### D. Onboard a host

1. Install the host agent.
2. Inspect requested permissions before enrollment.
3. Detect GPU, driver, VRAM, network, storage, and isolation capabilities.
4. Run challenge, thermal, and bandwidth tests.
5. Choose availability, price floor, temperature ceiling, bandwidth cap, and allowed workload types.
6. Preview expected gross earnings and user-entered electricity cost.
7. Publish the offer with its actual trust capability.

## 8. Screen specifications

### Home / network command view

- Hero headline, short proof-oriented subhead, and one primary CTA.
- Interactive workload composer is the central product proof, not a decorative illustration.
- Live/synthetic network state is explicitly labelled.
- Bento summary: online GPUs, eligible regions, median queue, active run, current proof coverage.
- “How an outcome earns trust” rail: Request → Schedule → Checkpoint → Recover → Receipt.

### Exchange

- Search-first layout with workload-aware filters.
- Offer cards show GPU, VRAM, all-in price, region, available window, p50/p95 latency, observed throughput, reliability, trust tier, and checkpoint support.
- Never expose a private host address; city/region is the maximum public granularity.
- Provide Cheapest, Fastest, Most trusted, Lower-carbon, and Balanced presets.
- “Why this match?” expands factor values and weights; avoid a mysterious score alone.

### Deploy Studio

Four progressive steps:

1. Workload
2. Resources
3. Trust policy
4. Recovery and review

Changes show their consequence immediately: eligible-node count, cost, start time, and risk. Preserve a generated machine-readable manifest for advanced users.

### Run Room

- Outcome progress and predicted completion.
- Trust rail: Accepted → Policy checked → Running → Checkpointed → Output checked → Settled.
- Per-node status, throughput, thermals, and cost.
- Checkpoint freshness and standby state.
- Streaming event timeline and logs.
- Cost forecast, current spend, and budget ceiling.
- Artifacts and receipt preview.
- One primary action; destructive stop is separated and confirmed.

### Receipt Explorer

- Status must distinguish **chain valid**, **signature valid**, **policy passed**, and **output checks passed**.
- Show genesis, ordered events, previous/current hashes, node, checkpoint, timestamp, and event details.
- A tamper demonstration may alter a copied receipt and show verification failure without mutating canonical data.
- Charts or visual chains must have a readable table alternative.

### Host Console

- Node readiness and active workload.
- Availability schedule and emergency stop.
- Gross earnings, estimated electricity cost, and net estimate.
- Utilization, thermals, connectivity, and reliability trend.
- Privacy and acceptable-use controls.
- Clear recovery guidance for every degraded state.

## 9. Visual system

### Brand posture

**Industrial editorial, precise, and calm under failure.** KairoMesh should feel like credible infrastructure, not a crypto casino or a generic neon AI landing page.

The visual metaphor combines:

- **Kairos:** the right moment, represented by a precise time marker or checkpoint.
- **Mesh:** independent nodes connected by an active route.
- **Outcome:** fragmented evidence resolving into one inspectable receipt.

Avoid spinning globes, random particles, heavy glass blur, decorative terminal text, and motion on every card.

### Color roles

Use the project design-system tokens as the implementation source of truth, augmented by semantic data colors:

- Graphite / slate: infrastructure surfaces and primary text.
- Off-white: primary light surface.
- Action red: decisive CTA and destructive emphasis only; do not flood the interface with it.
- Proof green: passed evidence and recovered state.
- Signal blue: active compute and selected routes.
- Amber: checkpoint age, degraded state, or pending evidence.
- Coral/red: failed check or destructive action.

Color never acts alone: every state also has an icon, label, or line pattern. Body text meets 4.5:1 contrast and data marks meet at least 3:1 against their surface.

### Typography and density

- Use Inter/Geist-style neutral sans for interface copy and a single monospaced face for hashes, prices, timers, and logs.
- Use tabular figures so streaming values do not shift.
- Minimum mobile body size is 16px; labels should not become unreadably small to create artificial density.
- Follow a 4/8px spacing system and consistent 12–16px radii.
- Prefer borders and tonal surface changes over oversized shadows.

### Data visualization

- Streaming area/line chart for utilization, throughput, cost, and checkpoint cadence.
- Bullet charts for cost/reliability/trust against policy thresholds.
- Horizontal bars for comparing candidate score factors.
- Event timeline for receipt history.
- Every live chart has pause, textual current value, keyboard-accessible details, and a table/export fallback.

## 10. Motion system

Motion communicates cause and state; it does not decorate empty space.

### Signature moments

- **Mesh route:** selected nodes connect to the job after quote acceptance.
- **Checkpoint commit:** a pulse travels from the running shard into a fixed checkpoint marker.
- **Failover:** the route detaches from the lost node and reconnects to standby while progress stays anchored.
- **Receipt assembly:** completed evidence rows compact into the final chain summary.
- **Explainable reorder:** marketplace results use a FLIP-style transition when weights or filters change.

### Timing tokens

- Press feedback: 90–120ms.
- Hover/focus/micro state: 150–200ms.
- Panel and list transitions: 220–300ms.
- Complex failover or receipt sequence: no more than 400ms per state change.
- Exit motion runs at roughly 60–70% of enter duration.
- Enter with ease-out; exit with ease-in. Animate transform and opacity, not layout dimensions.

### Guardrails

- Animate only one or two focal elements per view.
- Motion never blocks input and is interruptible.
- Buttons reserve width during loading and cannot double-submit.
- `prefers-reduced-motion` replaces routes and pulses with immediate state updates plus a short crossfade.
- Live charts freeze or step rather than sweep in reduced-motion mode.
- All functionality remains available without hover.

## 11. Responsive and accessibility requirements

- Test at 320, 375, 414, 768, 1024, and 1440px plus phone landscape.
- No page-level horizontal scrolling. Wide comparison tables become cards or deliberate, labelled scroll regions.
- Minimum interactive target: 44×44px; keep at least 8px between adjacent controls.
- Visible keyboard focus is mandatory.
- Use real labels, helper text, inline validation, and focus the first invalid field on submit.
- Status announcements use polite live regions; alerts state cause and recovery action.
- Skeletons reserve final layout space to keep CLS below 0.1.
- Real-time lists over 50 rows should be virtualized or paginated.
- Route changes focus the main heading and preserve back-navigation state.
- Charts provide legends, units, exact values, and non-color distinctions.

## 12. Canonical live demo

The demo should tell one complete story in five to seven minutes.

1. **State the problem:** “Cheap peer GPUs exist; dependable outcomes are the missing product.”
2. **Choose a workload:** select a checkpointable render or deterministic simulation preset.
3. **Declare policy:** set GPU/VRAM, price ceiling, Isolated tier, checkpoint interval, and Balanced priorities.
4. **Generate the plan:** show eligible inventory, selected nodes, expected cost, savings against the user's ceiling, and factor explanation.
5. **Start the run:** show the trust rail, node metrics, event stream, and first committed checkpoint.
6. **Inject a labelled demo failure:** disconnect one selected node through Presenter Mode.
7. **Recover:** show quarantine, replacement-node reasoning, cost delta, and resume from checkpoint without resetting overall progress.
8. **Finish:** show output policy checks and settlement event.
9. **Verify:** open the receipt, recompute its chain in the browser, then tamper with a copy and show the exact broken link.
10. **Close the loop:** switch to Host Console and show the earnings generated by the same run.

Presenter Mode must be deterministic and available offline. It should display **Demo network / synthetic inventory** persistently. The verification algorithm should still be real.

## 13. Honest-claims contract

The following language is mandatory until the corresponding production capability exists:

| Current capability | Allowed claim | Disallowed claim |
|---|---|---|
| SHA-256 event hash chain | “Tamper-evident receipt chain verified.” | “Cryptographically signed receipt” unless signatures are implemented. |
| Seeded node inventory | “Demo network” or “Synthetic inventory.” | “Live global GPU network.” |
| `attested` demo field | “Scenario attestation status” in presenter data. | Hardware-attested RTX nodes without supported evidence. |
| Weighted scheduler | “Deterministic, explainable multi-factor scheduler.” | “AI-powered scheduler.” |
| Injected node loss | “Simulated failure event.” | “A real remote host failed.” |
| Hash/check policy | “Output policy passed” or “Artifact digest matched.” | “The ML result is correct/proven.” |
| Carbon intensity input | “Estimated carbon intensity, with source/time.” | “Emissions avoided” without a documented baseline. |
| `savingsPercent` | “Savings against your configured ceiling.” | “Cheaper than AWS/GCP” without a current comparable benchmark. |
| Price/electricity forecast | “Estimate.” | Guaranteed earnings or savings. |

Production trust milestones include digital signatures, key rotation/revocation, nonce freshness, independent verifier evidence, authenticated hosts, policy-gated secrets, audit retention, and a documented dispute process.

## 14. Security and privacy product requirements

- Protect renters from fake capacity, host snooping, output tampering, replayed evidence, and silent degradation.
- Protect hosts from malicious images, privilege escalation, lateral movement, network abuse, cryptomining policy violations, and resource exhaustion.
- Use least privilege, read-only roots where possible, explicit egress policy, resource quotas, image-digest pinning, and ephemeral credentials.
- Keep precise host addresses private; expose only the location granularity needed for scheduling.
- Separate chain integrity from signer identity and signer authorization in both implementation and UI.
- Fail closed when a required trust check is missing or stale.
- Every rejection or quarantine state must explain the cause, evidence, and recovery path.
- Never place secrets, personal data, prompts, model weights, or artifact contents inside public receipts; store commitments/hashes instead.

## 15. Success metrics

### User value

- Time to first valid quote.
- Quote-to-run conversion.
- Successful outcome rate.
- p50/p95 job start time.
- Percentage of failed shards recovered from checkpoint.
- Work lost per interruption.
- Receipt verification success and verification latency.

### Marketplace health

- Eligible supply by GPU, region, and trust tier.
- Host utilization and net earnings estimate.
- Repeat renter and host retention.
- Price dispersion and time-to-match.
- Correlated failure rate across selected nodes.

### Trust quality

- Fresh-evidence coverage.
- Replay/tamper detections.
- Quarantine false-positive and false-negative review rate.
- Percentage of runs meeting every declared policy check.

Do not lead with raw registered-user or listed-GPU counts when those resources are inactive or unverified.

## 16. Five-phase roadmap

### Phase 1 — Ideation / demonstrable thesis

**Mission:** Prove that the product is outcome scheduling plus evidence, not a GPU price list.

- Complete a polished responsive product narrative.
- Ship deterministic multi-factor scheduling and transparent factor explanations.
- Ship a tamper-evident receipt chain and real local verification.
- Ship a deterministic failover simulation tied to checkpoint events.
- Label synthetic inventory and presenter actions.
- Publish architecture, threat model, trust limitations, and demo guide.

Exit criterion: a reviewer can plan, fail, recover, and verify one job without verbal hand-waving.

### Phase 2 — Validation / campus and creator pilot

**Mission:** Validate demand and host willingness in a bounded, supportable network.

- Interview researchers, creative teams, lab administrators, workstation owners, and gaming cafes.
- Run a concierge pilot with one or two workload types.
- Build a host-agent prototype for inventory, heartbeat, and nonce-bound benchmarks.
- Measure price sensitivity, interruption patterns, checkpoint cost, and onboarding friction.
- Validate host safety controls and acceptable-use rules.
- Test payment intent without inventing a token.

Exit criterion: repeated paid or strongly committed jobs from users who value resilience/evidence, not only the lowest price.

### Phase 3 — MVP / real jobs and receipts

**Mission:** Complete a small number of real checkpointable GPU workloads safely.

- Add authentication, tenancy, scoped API keys, authorization, and audit trails.
- Execute pinned OCI workloads in a hardened runtime.
- Add encrypted artifact/checkpoint storage and genuine failover.
- Implement Ed25519 receipt signatures, key rotation, revocation, and offline verification.
- Add host schedules, thermal limits, workload allowlists, earnings, billing, and payment sandbox.
- Add observability, incident handling, abuse reporting, and dispute workflow.

Exit criterion: real pilot workloads complete with a verifiable signed receipt and recover correctly from a real node interruption.

### Phase 4 — Launch / dependable marketplace

**Mission:** Make KairoMesh self-serve for a narrow production audience.

- Launch searchable offers and saved trust policies.
- Publish SDK, CLI, manifests, webhooks, status page, and public receipt verifier.
- Introduce provider reputation based on measured history rather than reviews alone.
- Add explicit service levels, support boundaries, and transparent fees.
- Build supply in a few dense regions before broad geographic expansion.
- Publish reproducible workload benchmarks and security review results.

Exit criterion: healthy repeat usage, measurable successful-outcome advantage, and enough regional supply to meet target start times.

### Phase 5 — Scale / federated verification and supply

**Mission:** Become the trust and recovery control plane for heterogeneous GPU supply.

- Add hardware-backed attestation for supported confidential-compute nodes.
- Federate independent challenge/verifier services.
- Add external supply connectors while preserving one policy and receipt format.
- Add advanced placement for data locality, carbon timing, multi-node topology, and enterprise compliance.
- Expand reproducible spot-checking for deterministic workload classes.
- Add reservations and capacity commitments only after spot-market liquidity is healthy.

Exit criterion: KairoMesh can route across multiple supply domains while preserving consistent, independently inspectable outcome evidence.

## 17. Definition of product-ready

The product is ready to present when:

- Every visible interaction works with pointer and keyboard.
- Every async action has loading, success, failure, timeout, and retry behavior.
- Empty, partial, degraded, and offline states are designed.
- A node-loss demo recovers without page refresh or progress reset.
- Receipt verification detects a modified historical event.
- Claims match the honest-claims contract.
- Motion respects reduced-motion preferences.
- Layout passes 375, 768, 1024, and 1440px checks with no accidental horizontal overflow.
- Tests cover scheduler invariants, insufficient capacity, failover exclusions, receipt mutation, schema validation, authorization boundaries, and rate limiting.
- The repository includes setup, architecture, threat model, demo, API, and deployment documentation.

The experience should leave one precise idea in the reviewer’s mind:

> **KairoMesh does not merely rent a GPU. It engineers a recoverable, inspectable outcome from untrusted supply.**
