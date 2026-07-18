# Contributing to KairoMesh

KairoMesh welcomes focused contributions that make the demonstration more correct, legible, secure, or honest. Version `0.1.x` is a research vertical slice, not a production GPU marketplace. A change must not blur that boundary.

## Local setup

Use Node.js 20.9 or newer; Node.js 24 matches CI.

```bash
npm ci
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000). No external service or secret is needed.

## Before opening a pull request

```bash
npm audit --audit-level=moderate
npm run lint
npm run typecheck
npm run test:coverage
npx playwright install chromium
npm run test:e2e
npm run build
```

Keep the change small enough to review, add regression coverage for changed behavior, and explain any trust or failure-mode impact.

## Engineering rules

- Keep domain decisions deterministic and side-effect free where practical.
- Represent credit amounts as integer microcredits or `bigint`; never use floating-point arithmetic for ledger balances.
- Preserve state-version checks, monotonic fencing, idempotency, and balanced-entry invariants.
- Treat all node, requester, artifact, and network input as untrusted in production designs.
- Do not add arbitrary shell, image, URL, host path, runtime flag, device, or egress input to the demo.
- Respect reduced-motion preferences, keyboard navigation, visible focus, semantic HTML, and contrast.
- Keep synthetic values visibly labeled. Never present a fixture as live capacity, telemetry, price, evidence, or earnings.
- Do not describe a hash chain as a signature, attestation, proof of computation, or proof of correctness.
- Do not call a demo-credit hold escrow or imply that money is collected, stored, transferred, or paid out.
- Update the reality ledger in `docs/ARCHITECTURE.md` when a capability crosses from planned to implemented or from library-only to wired.

## Tests

Place focused Vitest coverage beside the library it exercises. Favor invariants and adversarial cases over snapshot volume. Examples include invalid state transitions, replayed idempotency keys, stale fencing tokens, partial capacity, malformed receipt links, and bounded input failures.

Use Playwright for behavior that crosses page, API, timing, responsive, or accessibility boundaries. Presenter tests should use explicit UI states instead of arbitrary sleeps whenever possible.

## Pull request checklist

- [ ] The change has a single clear purpose.
- [ ] New behavior is tested at the appropriate layer.
- [ ] Lint, typecheck, coverage, browser tests, audit, and build pass.
- [ ] UI changes work with keyboard navigation and reduced motion.
- [ ] Synthetic and future-only capabilities remain explicit.
- [ ] Security, privacy, money, and verification claims remain technically exact.
- [ ] Relevant docs and deployment gates are updated.
- [ ] No secret, private data, generated report, build output, or local environment file is committed.

## Security reports

Do not open a public issue containing exploit details. Follow the private reporting process in [SECURITY.md](SECURITY.md). Good-faith local research must use systems and data you own.

## Documentation style

Prefer plain language, short examples, and concrete boundaries. Write what the code does today before describing a future design. Link to a source or design record for claims that could change.

By contributing, you agree that your contribution is licensed under the repository's [MIT License](LICENSE).
