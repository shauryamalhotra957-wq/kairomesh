# KairoMesh Market Research

**Research date:** 17 July 2026
**Scope:** Peer-to-peer, community, decentralized, and adjacent GPU-compute providers
**Decision horizon:** Initial 90-day startup wedge
**Evidence policy:** Product capabilities and prices are drawn from linked official documentation unless a source is explicitly described as anecdotal. Prices are snapshots or advertised starting points, not guaranteed future rates.

## Executive verdict

The underlying demand is real, but **“people rent their idle GPUs to other people” is already a crowded category**. Vast.ai, RunPod Community Cloud, SaladCloud, io.net, Akash, and TensorDock all aggregate third-party compute in some form. Salad’s documentation explicitly describes a network of privately owned, primarily gaming PCs and calls the model “AirBnB for compute.”

KairoMesh should therefore not launch as another searchable list of GPU-hour offers. Its strongest initial position is one abstraction above infrastructure:

> **KairoMesh sells a completed, deadline-backed batch job. Buyers submit a supported workflow, deadline, and budget; KairoMesh handles placement, checkpointing, retries, verification, and host payout.**

The recommended first customer is a small AI video or image company with bursty, parallel batch work. The recommended first supply is Linux machines with RTX 3090, 4090, or 5090-class GPUs. Real-time cloud gaming, unrestricted containers, confidential datasets, and frontier-model training are deliberately excluded from the first production release.

### Opportunity score

| Dimension | Assessment |
| --- | --- |
| Proven demand | 9/10 |
| Novelty of a raw P2P GPU marketplace | 2/10 |
| Technical and operational difficulty | 9/10 |
| Potential of the output-SLA wedge | 8/10 |
| Defensibility of a price-only strategy | 1/10 |

## Assumptions

This strategy assumes:

- The founder is a technical builder who can use AI coding tools, GitHub, and modern web infrastructure.
- The 90-day objective is a safe invite-only beta with the first ten paying design partners, not global scale.
- Initial jobs use public or non-sensitive assets and a small set of platform-approved workflows.
- KairoMesh does not issue a crypto token or operate its own stored-value wallet in the MVP.
- The current KairoMesh website is a product demonstration unless and until real workers, scheduling, execution, metering, and payouts are connected and independently verified.
- Legal and tax advice will be obtained before public onboarding or real-money settlement in any jurisdiction.

## Competitive landscape

| Provider | Model and current strengths | Gap KairoMesh can exploit | Evidence |
| --- | --- | --- | --- |
| **Vast.ai** | Direct GPU marketplace whose hosts range from a single gaming PC to Tier-4 data centers. Hosts set compute, storage, and bandwidth rates; buyers filter offers by hardware, DLPerf, and reliability. Vast also offers a serverless layer. | Buyers still reason about machines, host quality, transfer cost, and storage lifecycle. Vast states that provider security varies significantly and recommends Secure Cloud for sensitive workloads. | [Concepts](https://docs.vast.ai/guides/concepts), [pricing](https://docs.vast.ai/guides/instances/pricing), [security FAQ](https://docs.vast.ai/guides/reference/faq/security) |
| **RunPod** | Hybrid product with P2P Community Cloud and Secure Cloud, plus Pods, Serverless, and Clusters. It offers polished developer tooling and per-second billing. | RunPod’s terms give no specific uptime warranty for Community Cloud. Its network-volume documentation says attachment to a data center can constrain GPU availability and failover. | [Terms](https://www.runpod.io/legal/terms-of-service), [pricing](https://www.runpod.io/pricing), [network volumes](https://docs.runpod.io/storage/network-volumes) |
| **SaladCloud** | The most direct competitor. Managed containers run on a distributed network of privately owned devices, primarily gaming PCs. Salad handles node reallocation and queue-based autoscaling and advertises over 60,000 GPUs. | Salad says an individual node normally has 90–95% reliability, recommends multiple replicas, and documents checkpointing for long jobs. There remains room to sell an accepted output and deadline rather than expose compute replicas. | [Documentation](https://docs.salad.com/), [pricing](https://salad.com/pricing), [FAQ](https://docs.salad.com/container-engine/explanation/core-concepts/faqs), [long-running jobs](https://docs.salad.com/container-engine/how-to-guides/job-processing/sqs) |
| **io.net** | DePIN network using Ray, a mesh VPN, Proof-of-Work hardware validation, and suppliers on Windows, Linux, macOS, and HiveOS. | Staking, token rewards, onboarding delay, and demanding network recommendations create supplier friction. The official onboarding guide recommends over 500 Mbps download, 250 Mbps upload, and sub-30 ms ping for a better chance of being hired. | [FAQ](https://io.net/docs/guides/faq), [network architecture](https://io.net/docs/guides/architecture/io-network), [worker onboarding](https://io.net/docs/guides/workers/device-onboarding) |
| **Akash** | Permissionless provider marketplace using Kubernetes, competitive bidding, and ACT compute credits. It has a strong open and sovereign-cloud position. | It is more natural for infrastructure operators than casual PC owners. Provider setup and upkeep are material, and Akash documentation tells buyers how to handle unresponsive providers through redeployment and multi-provider operation. | [Provider overview](https://akash.network/providers/), [provider guide](https://akash.network/docs/providers/getting-started/should-i-run-a-provider/), [providers and leases](https://akash.network/docs/learn/core-concepts/providers-leases/) |
| **TensorDock** | Curated independent-host marketplace offering KVM virtual machines, broad geographic coverage, Windows support, and no ingress or egress fees. It advertises a 99.99% uptime standard for vetted hosts. | It is curated rather than frictionless consumer P2P. Its FAQ says standard storage is local and not replicated and tells users to checkpoint and back up off site. | [Marketplace](https://marketplace.tensordock.com/), [FAQ](https://console.tensordock.com/faq), [downtime policy](https://docs.tensordock.com/legal-information/downtime-compensation) |
| **FluidStack** | Adjacent enterprise AI cloud with dedicated, single-tenant data-center infrastructure, managed Kubernetes/Slurm, and documented SOC 2, ISO 27001, and GDPR controls. | It is not a casual consumer-GPU marketplace. It is a future reliability and security benchmark for KairoMesh’s Trusted tier rather than the first price competitor. | [Platform documentation](https://docs.fluidstack.io/), [security](https://www.fluidstack.io/resources/security) |

## Price and supply signal

Price competition is already severe:

- Salad currently advertises GPU instances from $0.02 per hour and an RTX 5090 configuration at $0.25 per hour. [Salad pricing](https://salad.com/pricing)
- TensorDock advertises consumer GPUs from $0.12 per hour and RTX 4090 instances from $0.35 per hour. [TensorDock marketplace](https://marketplace.tensordock.com/)
- Vast uses real-time, host-set marketplace pricing, including separate storage and bandwidth charges. [Vast pricing](https://docs.vast.ai/guides/instances/pricing)
- Akash’s live Signal page tracks large price spreads across venues and GPU models, illustrating that any fixed comparison ages quickly. [Akash Signal](https://signal.akash.network/)

These are advertised rates, not completed-job total cost. They exclude some combination of operator time, retries, model transfer, storage, failed starts, and deadline risk. That distinction is KairoMesh’s opening: compare **cost per accepted output delivered by deadline**, not the cheapest displayed GPU-hour.

## Current customer pain points

### 1. Reliability is pushed onto the buyer

Community compute is intentionally heterogeneous. Salad documents 90–95% reliability at the individual-node level. TensorDock says standard-host downtime should eventually be expected. RunPod disclaims a specific Community Cloud uptime warranty. Buyers compensate with replicas, retries, checkpoints, and off-site backups.

### 2. Capacity and storage locality conflict

A GPU can exist without being available in the region or data center where a customer’s model volume lives. RunPod explicitly notes that a network volume can reduce failover options. Local-only storage also makes host replacement slow or risky.

### 3. Headline rate is not total cost

Host-varying storage, transfer, CPU/RAM pairing, failed starts, model download time, and engineering attention can outweigh a small hourly-rate difference.

### 4. Security language often outruns the actual trust boundary

Transport and disk encryption do not protect data while an ordinary consumer GPU processes it. A privileged machine owner can be within the threat model. Vast warns that security varies by provider. Hardware-protected confidential execution is available only on supported data-center configurations, such as H100-or-later-class GPUs with compatible confidential VMs and attestation. [NVIDIA attestation requirements](https://docs.nvidia.com/attestation/attestation-client-tools-sdk/latest/gpu_and_switch_attestation.html)

### 5. Host onboarding is operationally demanding

Hosts face drivers, CUDA versions, open ports, uptime, cooling, electricity, ISP rules, payment identity, and device wear. Vast makes hosts responsible for setup and troubleshooting; Akash describes ongoing provider maintenance; io.net adds connectivity checks, Proof-of-Work, and staking.

### 6. Open compute attracts abuse

Arbitrary containers or shell access can turn a residential IP into a source of scanning, credential attacks, spam, malware, mining, or prohibited content. A young marketplace cannot safely launch unrestricted execution and solve moderation later.

## Recommended initial wedge

### Target customer

A 2–20-person AI video or image company that:

- spends at least $500 per month on burst GPU capacity;
- runs batches that can be divided by frame, scene, seed, or asset;
- can use public or non-sensitive inputs during the pilot;
- currently babysits jobs across local machines, Vast, or RunPod;
- values a deadline and accepted artifact more than direct root access.

### Product promise

> **Submit a supported workflow, deadline, and maximum budget. KairoMesh returns verified artifacts by the deadline or does not charge for failed work.**

This is a job-completion service-level objective, not a promise that every host will remain online.

### Initial product flow

1. The buyer submits a signed, supported workflow, object references, deadline, and budget.
2. KairoMesh quotes an expected price and completion window.
3. The scheduler selects verified hosts using measured throughput, reliability, model-cache state, thermal stability, region, and network quality.
4. The workload is sharded into restartable units and checkpoints to independent object storage.
5. A missing or unhealthy host is replaced automatically within the retry budget.
6. Outputs are checked for the expected manifest, count, dimensions, frame count, decodability, workflow/model identity, and provenance metadata.
7. The buyer pays for accepted results. Hosts are paid for useful completed work, with a reliability multiplier.

### MVP exclusions

- No arbitrary customer images, containers, or shell access.
- No inbound public ports and no unrestricted outbound network.
- No real-time cloud gaming.
- No regulated, confidential, or proprietary training data.
- No multi-node frontier-model training.
- No crypto token.
- No unrestricted worldwide host onboarding.

### Why gaming waits

Real-time cloud gaming adds strict latency, regional density, Windows driver and anti-cheat compatibility, game-publisher licensing, persistent sessions, account fraud, and high support expectations. Batch media work tolerates residential latency and node churn and can be checkpointed. Gaming can become a later product only after KairoMesh has dedicated regional Windows supply and verified legal and anti-cheat compatibility.

## Defensible differentiation

1. **Outcome abstraction:** Sell an accepted artifact and deadline, not a machine lease.
2. **Reliability orchestration:** Checkpointing, retries, sharding, and fallback make host churn invisible.
3. **Useful-work economics:** Meter and pay for completed work rather than online time or unverifiable capacity.
4. **Honest trust tiers:** Public/Non-sensitive Community jobs first; audited Confidential/Trusted nodes later.
5. **Fiat-first experience:** Clear buyer invoices and host bank payouts without staking or tokens.
6. **Host safety:** Signed workloads, a thermal guard, a physical kill switch, declared schedules, bandwidth caps, and earnings-after-electricity estimates.
7. **Workflow telemetry:** Over time, model-cache placement, real throughput, failure modes, and completion history create a data moat.

## North-star metric and economics

The north-star metric is:

> **Verified useful GPU work delivered by deadline.**

Supporting metrics:

- Buyer: final completion rate, P95 queue-to-start, successful-output cost, quote accuracy, repeat rate.
- Host: declared-window utilization, payout per useful hour, payout-to-electricity ratio, successful-job rate.
- Marketplace: fill rate, retry amplification, contribution margin, refunds, fraud loss.

A pricing model should include:

`buyer price = predicted useful compute + retry reserve + storage/transfer + payment cost + platform fee`

Targets before a broad launch:

- At least 30% lower effective TCO than the buyer’s current process, including failed work and operator time.
- At least 20% contribution margin after retry, storage, payment, and support costs.
- Host payout that comfortably exceeds local electricity and wear costs.
- Quote-to-final price variance within ±10% for supported workflows.

## Demo versus production truth

The KairoMesh interface can demonstrate the product vision before the distributed system exists, but the distinction must remain explicit.

| Capability | Safe claim for a simulated demo | Evidence required before a production claim |
| --- | --- | --- |
| GPU supply map | “Illustrative network and sample node data” | Authenticated heartbeats from real host agents plus timestamped inventory |
| Job lifecycle | “Interactive simulation of scheduling and execution” | A real control plane dispatching a signed workload to a real remote GPU |
| Pricing and earnings | “Illustrative estimate based on assumptions” | Reconciled metering, invoices, payment-provider records, and host payouts |
| Reliability score | “Demonstration scoring model” | Documented formula applied to measured uptime, benchmark, and job outcomes |
| Output verification | “Prototype verification flow” | Artifact checks, tamper-evident manifests, retry tests, and customer acceptance |
| Security | “Proposed security architecture” | Implemented controls, threat model, dependency/image scans, penetration test, and incident drills |
| Confidential computing | “Future Trusted-tier design” | Supported CPU/GPU TEE, successful remote attestation, policy-bound key release, and independent validation |
| Production readiness | “Product concept / technical preview” | Real workers, scheduler, runtime isolation, payments, support, legal terms, monitoring, backups, and measured SLOs |

The website must never present seeded host counts, simulated revenue, mock jobs, sample uptime, or calculated carbon figures as live operational facts.

## Legal, safety, and compliance constraints

This section is a product checklist, not legal advice.

### Data and confidentiality

- Classify Community capacity as public/non-sensitive until data-in-use protection is proven.
- Offer region selection, retention settings, deletion evidence, a DPA, and a subprocessor list.
- Use GDPR transfer safeguards such as SCCs where required. [EDPB SCC guidance](https://www.edpb.europa.eu/topics/international-transfers-and-international-cooperation/standard-contractual-clauses_en)
- Address India’s final Digital Personal Data Protection Rules in consent, security, breach, and deletion processes. [DPDP Rules 2025](https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa?pageTitle=Digital-Personal-Data-Protection-Rules-2025)

### Synthetic media and intermediary duties

If KairoMesh displays, publishes, or distributes generated media rather than only computing private jobs, assess India’s 2026 synthetically generated information rules and EU Digital Services Act notice-and-action duties. Applicability depends on the exact service and jurisdiction. [MeitY 2026 FAQ](https://www.meity.gov.in/static/uploads/2025/10/065b6deb585441b5ccdf8be42502a49c.pdf), [EU DSA](https://eur-lex.europa.eu/eli/reg/2022/2065/oj)

### KYC, sanctions, and export controls

- Screen buyers, hosts, beneficial owners, and payout accounts.
- Collect end-use attestations and investigate red flags for controlled high-end compute.
- BIS guidance specifically discusses foreign Infrastructure-as-a-Service providers and advanced-compute diversion risks. [BIS guidance](https://www.bis.gov/media/documents/ai-counter-diversion-industry-guidance-may-13-2025.pdf)
- OFAC expects risk-based due diligence from cloud and software providers. [OFAC FAQ 1088](https://ofac.treasury.gov/faqs/1088)

### Payments and tax

- Use a licensed marketplace payment and payout provider instead of holding an internal cash balance.
- Determine GST registration, invoicing, Tax Collection at Source, refunds, chargebacks, host reporting, and cross-border payout treatment with qualified advisers.
- India’s CBIC guidance describes registration and TCS obligations that can apply to e-commerce operators collecting consideration. [CBIC sector FAQ](https://cbic-gst.gov.in/sectoral-faq.html)

### Acceptable use and incident response

Prohibit malware, botnets, credential theft, password cracking, DDoS, spam, crypto mining, CSAM, non-consensual imagery, unlawful surveillance, sanctions/export evasion, and attacks on third parties. Provide a kill switch, abuse contact, evidence-retention rules, account suspension, customer appeal, and law-enforcement request process.

### Minimum technical safeguards for the restricted MVP

- Platform-built and Cosign-signed workload images only.
- Rootless runtime, seccomp/AppArmor, read-only root, dropped Linux capabilities, and strict CPU/RAM/GPU/disk quotas.
- No privileged mode, host mounts, Docker socket, host networking, or inbound access.
- Outbound allowlist limited to the control plane and object storage.
- Short-lived scoped credentials released only to an eligible node.
- Image scanning, SBOM generation, dependency review, immutable audit logs, rate limits, and emergency workload termination.
- Automatic temporary-storage wipe and key revocation after each job.
- Chaos tests for host loss, corrupt output, duplicate execution, expired credentials, partial upload, and payout retry.

## Research limitations

- Marketplace prices and availability change continuously.
- Vendor documentation contains vendor claims; certifications and SLAs should be independently verified during procurement.
- Recent user reports can reveal pain but are not statistically representative. Directional May–July 2026 discussions include a [RunPod availability thread](https://www.reddit.com/r/RunPod/comments/1ttfe7h/gpu_supply_and_availability_megathread_with/) and a [July GPU-cloud reliability discussion](https://www.reddit.com/r/deeplearning/comments/1uqtnb5/best_gpu_rental_alternative_to_vast_and_runpod/).
- Regulatory applicability depends on entity structure, service design, host/buyer locations, data, hardware, end use, and payment flow.
