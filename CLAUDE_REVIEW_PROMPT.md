# Prompt For Claude Review

Point Claude at:

```text
C:\Users\chand\million-dollar-business-30days\_work\saas-clone-br-calendly-commit-worktree
```

Then paste:

```text
Review and land the AgendaFacil handoff from Codex.

Context:
- Base commit: ff86709 on master.
- Local handoff commit: 5fab9f0 feat: complete medium launch surfaces.
- Target real repo: C:\Users\chand\projects\saas-clone-br-calendly.
- GitHub repo: github.com/chandananvithahr/agendafacil-br.
- Codex could not write directly to the target repo because the target path was outside its writable sandbox.
- Codex could not push because Git HTTPS failed with SEC_E_NO_CREDENTIALS.

Read these files first:
- CLAUDE_ISSUE_LOG.md
- CLAUDE_REVIEW_ISSUE_LOG.md
- REVIEW-FINDINGS.md
- MVP_PHASE_STATUS.md

Your job:
1. Review only the handoff commit scope. Do not re-audit the whole product.
2. Check the 8 completed tasks:
   - customer-side timezone labels on public booking slots
   - Vercel KV rate limiter with local in-memory fallback
   - Booking.amount snapshot and migration SQL
   - Tailwind Typography for legal pages
   - Stripe Billing Portal route and dashboard button
   - dashboard bookings list with soft cancellation, cancellation email, and refund attempt
   - multiple availability windows per weekday
   - Playwright public smoke tests for landing, demo, and 9 SEO routes
3. Verify acceptance criteria listed in CLAUDE_REVIEW_ISSUE_LOG.md.
4. Land the changes into C:\Users\chand\projects\saas-clone-br-calendly if they are safe.
5. Run verification from the real repo:

   npm.cmd install
   npm.cmd run lint
   npx.cmd --no-install tsc --noEmit
   $env:DATABASE_URL='<real dev database>'
   $env:DIRECT_URL='<real direct database>'
   npx.cmd --no-install prisma validate
   npx.cmd --no-install prisma migrate dev --name add_booking_amount
   npm.cmd run build
   npm.cmd run test:e2e

6. If the migration already exists or Prisma creates a different timestamp, avoid duplicate Booking.amount columns.
7. Commit and push to origin master if credentials are available.

Known blockers from Codex, not code defects:
- push from Codex failed with SEC_E_NO_CREDENTIALS
- next build compiled successfully, then failed with sandbox spawn EPERM
- npm run test:e2e failed in sandbox with spawn EPERM when Playwright tried to spawn the web server
- prisma migrate dev was not run against a live database in Codex; manual SQL migration exists at prisma/migrations/20260502090000_add_booking_amount/migration.sql

Return:
Verdict: PASS / PASS WITH FIXES / BLOCKED

Findings:
- Severity, file path, exact line, issue, impact, fix.

Known blockers confirmed:
- Push credential state
- Build/test runtime state
- Migration real DB state

Landing recommendation:
- Exact command sequence used or required to merge/push.
```
