# Security policy

Thank you for helping improve KairoMesh. We welcome good-faith reports that let us reproduce and fix a security issue without putting other people or systems at risk.

## Demonstration warning

KairoMesh `0.1.x` is a portfolio/research demonstration, not a production GPU marketplace.

It currently has no user authentication, tenant isolation, persistent database, object storage, node agent, container sandbox, remote host, hardware attestation, signed node receipt, or payment integration. Inventory, telemetry, failures, evidence tiers, and credits shown in Mission Control are synthetic. Do not use it for untrusted workloads, real customer data, credentials, private model weights, or money.

The receipt endpoint produces a SHA-256 event hash chain. It is tamper-evident after the root is known; it is not digitally signed and is not proof that arbitrary computation occurred or is correct.

A future Isolated consumer-GPU node would protect the provider host from a workload. It would **not** keep requester inputs, models, memory/VRAM, or outputs confidential from a provider with root access. Sensitive jobs require a separately reviewed confidential-computing design on supported hardware.

## Supported versions

| Version | Security support | Intended use |
|---|---|---|
| Current `main` / `0.1.x` | Best-effort fixes | Demonstration only |
| Older commits, forks, modified deployments | Not supported | Maintainer of that deployment is responsible |

There is no production-supported release yet.

## Report a vulnerability privately

Preferred channel:

1. Open the repository's **Security** tab.
2. Choose **Advisories** → **Report a vulnerability** to create a private GitHub Security Advisory draft.

If private vulnerability reporting is not enabled, open a minimal public issue titled **Security contact requested** with no exploit, secret, affected endpoint, or sensitive detail. A maintainer should establish a private channel. Do not paste vulnerability details into a public issue, discussion, pull request, screenshot, chat room, or social-media post.

Do not send reports to guessed personal addresses or unrelated OpenAI/hosting-provider security teams.

### Include

- A concise impact statement and affected commit/version/route.
- Preconditions and a minimal reproducible proof using your own account/data/environment.
- Exact steps, relevant request/response fragments with secrets removed, and expected versus actual behavior.
- Whether you believe exploitation occurred in the wild.
- Suggested mitigation if you have one.
- How and when you would like attribution, or that you prefer anonymity.

Never include private keys, authentication tokens, signed object URLs, payment data, real customer/provider data, harmful payloads beyond the minimum, or credentials that are not yours. Replace them with labeled placeholders.

## Response process

These are best-effort objectives, not contractual SLAs:

- Acknowledge a complete private report within 3 business days.
- Provide an initial severity/scope assessment within 7 business days.
- Share material status changes and coordinate disclosure timing.
- Prioritize active exploitation and critical confidentiality/integrity issues immediately.

We may ask for clarification or a safer reproducer. After validation, maintainers will track remediation privately, add a regression test where feasible, review similar code paths, decide whether credentials/releases must be revoked, and publish an advisory when users have a practical mitigation.

We will not promise a fix date before the scope and safe release path are understood.

## High-priority report examples

- Remote code execution, arbitrary file read/write, command/path injection, or dependency/build compromise.
- Cross-site scripting that bypasses the configured policy or exposes sensitive data.
- Server-side request forgery, private-network/metadata access, or unsafe redirect/DNS handling after fetch features exist.
- Authentication, authorization, or tenant-isolation bypass after those controls exist.
- Receipt-chain verification accepting modified data.
- State-version/fencing bypass that lets a stale attempt win.
- Ledger imbalance, idempotency bypass, double settlement/refund, or unsafe integer handling.
- Secret, token, signed URL, private provider location, or customer-data exposure.
- Node identity/signature/attestation replay, downgrade, or revocation failure after those features exist.
- Sandbox escape, host namespace/mount/runtime-socket exposure, or egress-policy bypass after real execution exists.
- Security-header or deployment behavior materially different from documented policy.

## Usually not vulnerabilities by themselves

- Synthetic demo offers, prices, telemetry, evidence tiers, carbon values, or presenter outcomes not matching a real market.
- A provider-root confidentiality risk that is already disclosed for non-confidential future tiers, unless you found an additional unauthorized exposure or a false product claim.
- Missing production features explicitly listed as not implemented.
- Cosmetic UI defects with no security impact.
- Automated scanner output without a reproducible vulnerable path and impact.
- Version banners or public information without an exploit.
- Volumetric denial-of-service tests or rate-limit observations performed without prior authorization.
- Social engineering, physical attacks, or attacks against third-party services/accounts.

You may still report a misleading security claim or unsafe default privately; accurate trust language is part of this project's security posture.

## Safe research rules

Good-faith research must:

- Use your own local deployment, accounts, synthetic data, and infrastructure.
- Stop when you access data, credentials, hosts, or accounts you do not own.
- Avoid persistence, lateral movement, phishing, malware, destructive payloads, data exfiltration, privacy invasion, physical harm, and service degradation.
- Avoid automated traffic that affects availability or costs.
- Minimize collection and delete retained test data after remediation/disclosure unless law requires otherwise.
- Give maintainers a reasonable opportunity to remediate before public disclosure.
- Follow applicable law.

When these rules are followed, maintainers intend not to pursue action solely for bypassing a control to demonstrate the reported issue. This is not a promise on behalf of third parties and is not permission to violate law, contracts, privacy, or another person's systems.

## Secrets and accidental exposure

If you find a secret in the repository or a deployed response:

1. Do not test it against a third-party service or enumerate its permissions.
2. Report the file/commit/response location privately.
3. Treat it as compromised even if the file is later deleted; history and caches may retain it.

Maintainers should revoke/rotate first, inspect authorized logs for abuse, remove the value from current code/history where appropriate, and prevent recurrence with secret scanning. Never publish the secret in an advisory.

## Dependency reports

Include the dependency, installed and fixed version, reachable vulnerable code path, and project-specific impact. A CVE affecting an unused optional feature may not be exploitable here; a dependency without a CVE may still be critical if its vulnerable path is reachable.

## Disclosure and credit

Coordinate a disclosure date based on exploitability, active abuse, patch availability, and downstream update needs. Advisories should describe impact, affected versions, mitigation, fixed version/commit, and credit without exposing customer/provider data or a weaponized payload.

We will credit reporters who request it and may keep reports anonymous on request. There is currently no bug-bounty or guaranteed monetary reward.

## Security design references

- [Architecture and implemented/future boundary](docs/ARCHITECTURE.md)
- [Threat model and residual risks](docs/THREAT_MODEL.md)
- [Future node-agent security contract](docs/NODE_AGENT.md)
- [Operations and incident response](docs/RUNBOOK.md)
