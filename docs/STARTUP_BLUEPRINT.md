# KairoMesh Startup Blueprint

**Prepared:** 17 July 2026
**Planning horizon:** First 90 days to invite-only paid beta, then 3–12 months to scale
**North-star metric:** Verified useful GPU work delivered by deadline

## Strategic premise

KairoMesh should not compete as another catalog of cheap GPU-hour listings. Its initial product is an **output-SLA batch cloud for generative-media teams**:

> A buyer submits a supported workflow, inputs, deadline, and maximum budget. KairoMesh places restartable work on verified idle GPUs, checkpoints it, retries failures, verifies the artifact manifest, and charges for accepted results.

This plan assumes a technical founder and a 90-day objective of:

- 10 paying design partners;
- 25 verified real GPU nodes;
- 1,000 completed test and pilot jobs;
- at least 95% final completion after automatic retries;
- P95 queue-to-start below 120 seconds when matching capacity exists;
- at least $2,000 monthly gross marketplace volume;
- no open critical security vulnerability or unresolved unsafe use case.

The current web experience must be described as an **interactive product demonstration** wherever it relies on seed data, mock workers, simulated scheduling, estimated earnings, or animated jobs. It becomes a production marketplace only after real agents, execution, metering, payouts, legal terms, monitoring, and measured service levels are operating.

---

## Phase 1 — Ideation

### Mission

Reduce a broad, crowded “P2P GPU marketplace” concept to one painful customer job, one clear promise, and one safely deliverable scope.

### Expected duration

**3–4 days**

### Step-by-step actions

1. **Choose the initial ideal customer profile.** Target 2–20-person AI video and image teams spending at least $500 per month on burst GPU capacity and currently babysitting local, Vast, or RunPod jobs.
2. **Write the job-to-be-done in the customer’s language.** Use: “Finish this render or generation batch by a deadline without managing flaky machines.”
3. **Freeze the first workload.** Support one signed, restartable workflow family that can be divided by frame, scene, seed, or asset. Avoid adding transcription, training, gaming, and arbitrary containers in the same release.
4. **Define explicit anti-goals.** No real-time gaming, confidential data, unrestricted shell, inbound public ports, crypto token, frontier-model training, or global open onboarding.
5. **Build the competitor and substitute matrix.** Compare KairoMesh with local hardware, Vast, RunPod, Salad, io.net, Akash, and TensorDock using successful-output cost, completion time, and operator effort—not advertised hourly price alone.
6. **Model unit economics.** Include host rate, host electricity, model download, retry reserve, object storage, transfer, payment fees, refunds, fraud loss, support, and the platform fee.
7. **Define the trust model.** Label community workers Public/Non-sensitive, define what the host and buyer can attack, and document which proposed controls are not yet implemented.
8. **Draft the one-page product brief and landing page.** Include the deadline promise, supported workload, sample price, exclusions, buyer application, and host application.

### Tools and platforms

- ChatGPT for synthesis, interview scripts, risk checklists, and scenario analysis
- Notion or Linear for the product brief and assumptions log
- Google Sheets for unit economics
- Figma for buyer and host journey prototypes
- Tally and Cal.com for applications and interviews
- Framer or the KairoMesh Next.js site for the landing page
- Akash Signal and official competitor documentation for live market checks

### KPIs and exit gate

- One ICP and one supported workflow approved.
- 25 qualified buyer prospects and 25 plausible hosts listed.
- A falsifiable product promise with a deadline, price mechanism, and refund rule.
- Base-case model shows at least 20% contribution margin.
- Host payout comfortably exceeds estimated local electricity and wear.
- No unresolved critical threat inside the restricted scope.
- At least five discovery meetings booked.

### Bonus founder insight

**A marketplace’s visible supply is a vanity metric until paid demand clears it.** Recruit the painful workload first; supply joins when there is credible utilization and payout.

---

## Phase 2 — Validation

### Mission

Prove that buyers will submit real workloads and pay, and that qualified hosts will provide usable capacity, before building a generalized distributed cloud.

### Expected duration

**10–14 days**

### Step-by-step actions

1. **Interview 20 prospective buyers.** Ask for actual cloud bills, failure logs, queue patterns, model sizes, current workarounds, missed deadlines, security restrictions, and the last time the problem occurred.
2. **Interview 20 prospective hosts.** Record hardware, OS, available schedule, electricity rate, connection, cooling, ISP restrictions, minimum payout, and tolerance for a platform-controlled runtime.
3. **Test willingness to pay on the landing page.** Show a realistic starting price and request a paid pilot, refundable deposit, or procurement conversation rather than a generic waitlist signup.
4. **Run a concierge marketplace.** Manually verify 3–5 GPUs, dispatch a fixed workflow, checkpoint to independent object storage, collect outputs, and calculate host payout.
5. **Keep an emergency cloud fallback.** Use an existing provider only to complete a committed pilot after community capacity fails; log the cost so the fallback cannot silently destroy margin.
6. **Benchmark substitutes.** Run the same representative job locally and on at least Vast and RunPod. Measure queue time, transfer, compute, retries, operator minutes, artifact success, and final cost.
7. **Ask for repeat work immediately.** A second paid job within two weeks is the strongest early signal that this is a recurring infrastructure need rather than a novelty demo.
8. **Make a written go, revise, or stop decision.** Do not reinterpret weak demand as a need for more features. Change the customer or workload only when interview and paid-pilot evidence supports it.

### Tools and platforms

- Tally, Cal.com, and HubSpot or Notion CRM
- Stripe Payment Links or invoices for a legally reviewed pilot flow
- Cloudflare R2 or S3-compatible object storage
- A fixed ComfyUI or equivalent signed runner
- PostHog for funnel and product-event analysis
- OpenTelemetry, Grafana, and structured logs for job metrics
- Loom for pilot walkthroughs and customer evidence

### KPIs and exit gate

- 20 completed buyer interviews and 20 host interviews.
- Five paid, deposit-backed, or purchase-order-backed pilot commitments.
- Ten qualified hosts willing to install the restricted agent.
- Three customers submit a second job.
- At least 95% final completion after manual retry.
- At least 30% lower effective TCO or 50% lower operator time than the customer’s current method.
- Host earnings remain positive after estimated electricity.
- Zero security, abuse, data-loss, or payment incidents.

### Bonus founder insight

**“I would use it” is courtesy. A real job, permission to process it, and payment are evidence.** Optimize the validation phase for uncomfortable truth, not a large waitlist.

---

## Phase 3 — MVP

### Mission

Automate one complete, safe marketplace loop: quote → submit → place → execute → checkpoint → verify → deliver → charge → pay host.

### Expected duration

**4–6 weeks**

### Step-by-step actions

1. **Build the buyer control surface.** Provide authentication, quote, submit, cancel, job status, sanitized logs, artifact download, spend limit, invoice, and data-deletion controls through a dashboard and API.
2. **Build a Linux-only host agent.** Include one-command enrollment, device identity, signed updates, GPU/CPU/RAM/disk/network benchmark, heartbeat, declared schedule, thermal ceiling, bandwidth cap, earnings estimate, and kill switch.
3. **Implement eligibility and scheduling.** Match jobs by GPU/VRAM, measured throughput, workflow compatibility, model-cache state, region, recent reliability, thermals, network, deadline, and retry budget.
4. **Make every work unit restartable.** Split jobs into idempotent shards, persist checkpoints and artifact manifests outside the host, and automatically requeue after heartbeat expiry or health failure.
5. **Restrict the runtime.** Execute platform-built and Cosign-signed images only. Use a rootless runtime, read-only root filesystem, seccomp/AppArmor, dropped capabilities, strict quotas, no host mounts, no Docker socket, and no privileged mode.
6. **Constrain networking and secrets.** Allow no inbound public access; restrict egress to the KairoMesh control plane and object storage; issue short-lived scoped credentials only after node eligibility checks; revoke them after the job.
7. **Verify useful output.** Check the artifact manifest, expected count, dimensions, frame count, decodability, workflow/model checksum, provenance, and upload completion. Use sampled recomputation for fraud detection where economically justified.
8. **Implement auditable money movement.** Create idempotent metering, buyer authorization, retry reserve, accepted-output charging, refunds, host payout, platform fee, payment reconciliation, and an immutable ledger of state transitions.
9. **Create trust and safety operations.** Add an AUP, account screening, workload allowlist, abuse contact, automated suspension, incident kill switch, appeal path, and evidence-retention schedule.
10. **Test failure as a normal state.** Add unit, integration, contract, end-to-end, security, load, chaos, backup-restore, and payment-reconciliation tests in CI.

### Tools and platforms

- Next.js and TypeScript for the buyer and host web experience
- FastAPI or Go for control-plane APIs and the host agent
- PostgreSQL for durable marketplace and ledger state
- Redis plus Temporal, or another durable workflow engine, for orchestration
- Cloudflare R2 or S3-compatible object storage for inputs, checkpoints, and outputs
- WireGuard or Tailscale for authenticated control-plane connectivity
- Stripe Connect or an appropriate licensed marketplace payout provider
- OpenTelemetry, Grafana, Sentry, and structured audit logs
- Trivy for image/dependency scanning, Syft for SBOMs, and Cosign for image signatures
- GitHub Actions for reproducible CI and security gates

### KPIs and exit gate

- 25 real, verified GPUs complete the eligibility benchmark.
- 1,000 successful test, chaos, and pilot jobs.
- At least 95% final completion after automatic retries.
- P95 queue-to-start below 120 seconds when eligible supply exists.
- Quote-to-final price variance within ±10% for supported jobs.
- Host onboarding median below 15 minutes.
- Duplicate charge and duplicate payout rate of zero in reconciliation tests.
- Successful host-loss, corrupt-checkpoint, partial-upload, database-restore, and payment-timeout drills.
- Zero open critical vulnerabilities and a documented decision for every high-severity finding.
- The demo UI labels any remaining seed, sample, or simulated data.

### Bonus founder insight

**Residential nodes do not need hyperscaler uptime. KairoMesh’s orchestration must make their failure boring.** The customer buys final completion, while the platform prices and absorbs churn.

---

## Phase 4 — Launch

### Mission

Win a dense, invite-only workload niche with transparent evidence before opening supply or demand broadly.

### Expected duration

**4 weeks, overlapping approximately weeks 7–12 of the initial 90 days**

### Step-by-step actions

1. **Limit launch density.** Operate in no more than three supply regions, one consumer-GPU family, and one workflow class.
2. **Publish honest product status.** Mark the service Preview or Beta, show whether inventory and jobs are live or simulated, disclose the Public/Non-sensitive data tier, and state measured rather than aspirational SLOs.
3. **Publish transparent economics.** Explain quote composition, accepted-output billing, retry reserve, refund conditions, host payout, fees, and storage/transfer treatment.
4. **Personally onboard the five validation customers.** Observe every step, record confusion, and fix the highest-friction failure within one release cycle.
5. **Turn pilot evidence into two case studies.** Show workload, baseline, queue time, retries, successful-output cost, deadline result, operator-time reduction, and limitations.
6. **Recruit supply where the workload exists.** Target university labs, rendering studios, creator communities, idle workstation owners, and small GPU farms instead of buying broad consumer ads.
7. **Launch developer education.** Run weekly workflow demos, publish an API quickstart, explain checkpointing, and show a live host-loss recovery without pretending it is a production SLA.
8. **Operate support and incidents.** Define severity levels, staffed response hours, status communications, refunds, post-incident review, abuse escalation, and customer appeal.
9. **Review marketplace health weekly.** Segment failures into no supply, host loss, workflow error, artifact error, control-plane error, buyer cancellation, fraud, and payment failure.

### Tools and platforms

- PostHog for acquisition, activation, repeat use, and job funnels
- HubSpot and Loops or Resend for design-partner CRM
- Discord and GitHub Discussions for technical community support
- Better Uptime or Statuspage for transparent service health
- LinkedIn, Hacker News, AI-video and ComfyUI communities for targeted distribution
- Loom and the KairoMesh site for evidence-backed case studies
- A shared incident channel, on-call schedule, and postmortem template

### KPIs and exit gate

- Ten paying teams.
- At least $2,000 in monthly gross marketplace volume.
- At least 30% weekly paying-customer repeat rate.
- At least 98% final completion after retries for supported production jobs.
- Customer satisfaction of at least 4.5/5.
- Refunds below 3% of gross marketplace volume.
- At least 35% utilization during host-declared availability windows.
- Support first response within the published target.
- Zero unlabeled simulated metrics or misleading production claims.

### Bonus founder insight

**Launch workload-by-workload and region-by-region.** An apparently global network with empty liquidity is worse than a small market that consistently fills jobs.

---

## Phase 5 — Scale

### Mission

Convert retention, workflow integrations, host-performance history, and reliability telemetry into a durable compute network.

### Expected duration

**3–12 months after the launch gate**

### Step-by-step actions

1. **Expand only from retained demand.** Add adjacent checkpointable workloads such as transcription, embeddings, evaluation, and LoRA training one at a time, each with its own benchmark and verification contract.
2. **Add multi-region resilience.** Replicate critical storage, make checkpoints portable, and use automated fallback to vetted partner clouds when a paid deadline is at risk.
3. **Introduce market products.** Add reserved capacity, low-priority queues, deadline tiers, buyer budget policies, and host committed-availability windows.
4. **Create a genuinely separate Trusted tier.** Use audited data-center hosts and supported confidential-computing CPU/GPU combinations with remote attestation and policy-bound key release.
5. **Build compliance evidence.** Pursue SOC 2 readiness, independent penetration testing, formal DPAs, vendor risk management, incident exercises, access reviews, and retention audits.
6. **Industrialize host acquisition.** Create campus and studio programs, a preconfigured Linux image, hardware qualification kits, electricity/thermal guidance, and regional host ambassadors.
7. **Deepen integrations.** Provide workflow-native SDKs and an API that makes KairoMesh a portable execution target rather than a proprietary editor.
8. **Improve scheduling with measured data.** Forecast demand, pre-position model caches, price retries, detect degradation, and route by successful-output cost rather than theoretical FLOPS.
9. **Add enterprise controls.** Support teams, roles, spend policies, audit export, regional pinning, support SLAs, reserved pools, and procurement documents.
10. **Evaluate gaming as a separate business line.** Proceed only after regional dedicated Windows supply, publisher/licensing review, anti-cheat compatibility, session persistence, abuse protection, and latency SLOs have been proven.

### Tools and platforms

- Temporal, Kubernetes or Nomad, and Terraform for mature orchestration and infrastructure
- ClickHouse for high-volume job and performance telemetry
- OpenTelemetry for cross-service traces and SLOs
- Vanta or Drata for compliance evidence management
- NVIDIA Attestation SDK and supported confidential-computing infrastructure
- Enterprise sanctions/KYC tooling and a licensed global payout provider
- Data warehouse and cohort analysis for retention, margin, and capacity forecasting

### KPIs

- At least 40% eight-week paying-customer cohort retention.
- 500 active verified GPUs.
- At least 35% useful utilization across declared host windows.
- $100,000 monthly gross marketplace volume within 12 months.
- At least 20% contribution margin after retries, storage, payment, support, and fraud.
- At least 98% final completion for supported jobs.
- 99.9% control-plane uptime.
- Fraud and chargeback loss below 0.5% of gross marketplace volume.
- No cross-tier data-classification incident.
- A measured reliability and margin gate before every new workload or region.

### Bonus founder insight

**The GPUs are not the moat.** The moat is integration into customer workflows, reliable demand, real host-performance history, warm model placement, completion telemetry, and the operational ability to recover safely.

---

# 30-day action sprint

## Days 1–3 — Freeze the thesis

- Select the exact customer, workflow, host requirements, regions, data tier, and exclusions.
- Finish the threat model and unit-economics sheet.
- Publish separate buyer and host application pages with a real pilot price.
- Build a list of 50 qualified prospects.
- **Deliverable:** One-page product brief, risk register, and interview pipeline.

## Days 4–7 — Collect painful evidence

- Complete ten buyer and ten host interviews.
- Obtain three representative workload samples and current-cost baselines.
- Secure access to 3–5 test GPUs.
- Ask every qualified buyer for a deposit-backed pilot.
- **Gate:** At least one paid commitment and repeated evidence of the same costly problem.

## Days 8–10 — Build the concierge runner

- Create one signed workload image and deterministic job schema.
- Build the node benchmark, heartbeat, checkpoint upload, artifact manifest, and manual dispatcher.
- Run baselines locally, on Vast, and on RunPod.
- **Deliverable:** A measured comparison of queue time, successful-output cost, retries, and operator effort.

## Days 11–14 — Complete paid work

- Run the first paid concierge jobs.
- Measure transfer, queue, compute, retries, accepted artifacts, host earnings, and platform margin.
- Ask for the next batch immediately.
- Revise pricing and restrictions based on evidence.
- **Gate:** At least three successful paid jobs and one repeat customer.

## Days 15–21 — Automate the vertical slice

- Implement login, quote, submit, schedule, execute, checkpoint, verify, deliver, and ledger transitions.
- Add the host schedule, thermal guard, kill switch, short-lived credentials, and network allowlist.
- Label all demo-only data in the UI.
- Add unit, integration, and end-to-end tests in CI.
- **Deliverable:** One real remote GPU job completed end to end without manual state edits.

## Days 22–25 — Try to break it

- Simulate host disappearance during every lifecycle state.
- Test corrupt checkpoints, stale heartbeats, duplicate queue messages, clock skew, partial uploads, expired credentials, and payment-provider timeout.
- Restore the database and reconcile the ledger from backups.
- Scan dependencies, images, and SBOMs; resolve all critical findings.
- **Deliverable:** Chaos-test report, restore evidence, incident runbook, refund runbook, and abuse runbook.

## Days 26–28 — Run the design-partner beta

- Onboard five paying design partners and ten verified hosts.
- Run at least 100 real or representative jobs.
- Fix the three largest sources of failed completion or user confusion.
- Capture permissioned customer quotes and before/after metrics.
- **Gate:** At least 95% final completion after retry and no critical safety incident.

## Days 29–30 — Publish evidence, not hype

- Publish the product demo, architecture, security boundaries, pricing, case study, API quickstart, and service-status page.
- Clearly mark the service Preview and distinguish live metrics from sample UI.
- Open an invite-only beta.
- Review the hard decision gate: repeat use, completion reliability, positive contribution, host economics, and acceptable risk.

---

# High-impact ChatGPT prompts

## 1. Customer discovery synthesis

```text
Act as a skeptical B2B researcher. Given these interview transcripts, invoices, and failure logs, identify repeated costly problems, exact customer language, current workarounds, willingness-to-pay evidence, and contradictions. Do not count compliments or waitlist signups as validation. Produce an evidence table and the three assumptions most likely to kill the company.
```

## 2. Marketplace unit economics

```text
Model this batch-GPU marketplace per accepted job. Include host rate, local electricity, expected runtime, model transfer, retry probability, retry amplification, storage, egress, payment fees, refund rate, fraud reserve, support, and platform fee. Run base, best, and worst cases. Find the break-even price and take rate, and state which variables require real measurement.
```

## 3. Threat model

```text
Threat-model a P2P GPU host agent using STRIDE. Cover malicious buyers, malicious hosts, control-plane compromise, container escape, secret theft, network abuse, forged benchmarks, fake completion, payout fraud, compromised updates, and dependency attacks. Rank risks by likelihood times impact. For each high risk, give a preventive control, detective control, recovery step, and automated test.
```

## 4. Distributed-state review

```text
Review this job and payment state machine for at-least-once execution, idempotent retries, checkpoint recovery, host replacement, artifact verification, accepted-output charging, refund, host payout, and ledger reconciliation. Identify every transition where work, money, or an artifact can be duplicated, lost, or left permanently pending. Propose invariants and tests.
```

## 5. Chaos-test generation

```text
Create a deterministic chaos-test suite for a distributed GPU job system. Include host loss at every job stage, corrupt checkpoint, slow or lying host, stale heartbeat, duplicate delivery, clock skew, partial artifact upload, expired credentials, object-store outage, database failover, and payment timeout. Specify setup, injected fault, expected invariant, and cleanup.
```

## 6. Host onboarding review

```text
Rewrite this host onboarding flow so a careful non-expert can complete it in under 15 minutes. Clearly explain ownership permission, Linux requirement, electricity, cooling, ISP rules, security boundary, workload restrictions, payout, tax responsibility, schedule, thermal guard, bandwidth cap, and kill switch. Remove every nonessential decision and add recovery for each likely failure.
```

## 7. Evidence-based positioning

```text
Write landing-page copy for KairoMesh, an output-SLA batch GPU service. Never use decentralized, revolutionary, unlimited, cheapest, military-grade, or secure without a precise qualification. Lead with completed jobs, deadline quotes, automatic retry, accepted-output billing, and the Public/Non-sensitive data boundary. Separate current production facts from roadmap items.
```

## 8. Pilot analytics

```text
Given these job, host, artifact, and ledger logs, calculate fill rate, P50/P95 start time, useful GPU utilization, final completion, retry amplification, successful-output cost, quote error, host earnings, platform contribution, refunds, and failure causes. Segment by GPU model, workflow, host, and region. Recommend only changes supported by the data.
```

## 9. Counsel-preparation checklist

```text
Prepare a counsel-review checklist for an India-founded global compute marketplace. Cover DPDP, GDPR, processor and subprocessor roles, international transfer, intermediary and synthetic-media rules, KYC/AML, sanctions, advanced-compute export controls, GST/TCS, payment aggregation, host terms, acceptable use, incident response, consumer protection, refunds, tax reporting, and gaming licenses. Ask jurisdiction questions and do not invent legal conclusions.
```

## 10. Weekly founder review

```text
Here are this week’s demand, supply, reliability, margin, safety, and support metrics. Identify the single demand bottleneck, single supply bottleneck, largest reliability loss, most dangerous unresolved risk, and weakest assumption. Propose three experiments ranked by expected learning per engineering day. Recommend a stop condition as well as a success condition.
```

---

# Self-check

- ✅ **Logical sequence:** The plan narrows the wedge, validates paid demand, automates the restricted loop, launches densely, and scales only after retention.
- ✅ **Required phase detail:** Every phase includes a mission, at least five concrete actions, tools, duration, KPIs, and a founder insight.
- ✅ **Realistic but ambitious:** The first 90 days target ten paying teams and 25 verified nodes rather than pretending to serve the entire world immediately.
- ✅ **No fluff metrics:** Paid repeat use, final completion, successful-output cost, host economics, contribution margin, refunds, and incidents drive decisions.
- ✅ **Security by scope:** Arbitrary code, sensitive data, inbound ports, tokens, frontier training, and gaming are excluded from the MVP.
- ✅ **Truthful presentation:** Seeded network data, animated jobs, estimated earnings, and mock outcomes must be labeled as simulated until connected to measured production systems.
- ✅ **Permanent fixes over workarounds:** Checkpoint portability, idempotency, reconciliation, restore tests, and explicit trust tiers solve root operational risks.
- ✅ **Phase gates:** No broad launch without paid validation, no expansion without retention, and no Trusted-tier claim without supported attestation and independent evidence.
