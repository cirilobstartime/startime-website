# Handoff manifest — October 7, 2026

Company review branch: `codex/handoff-20261007`. Internal source reference: `60946db1a600424ecfa53ccdebd3307badcbd48b`. The company source tree intentionally excludes internal instructions/working notes and has streamlined operational scripts/documentation. Production main and the live server are not changed by this handoff.

## Contents

Current Next.js/Payload application and migrations, public source assets, CMS design/routing/editorial/jobs capabilities, portfolio/card/slider refinements, operational runbooks, backup utility and sanitized content bootstrap. The snapshot holds 8 pages, 240 media records and 601 referenced public media files across 65 allowlisted content tables. It is current local editor state, not exact live production data.

No credentials, accounts, sessions, visitor data, submissions, private attachments, raw DBs or exact recovery archives are included. Those belong in approved encrypted private storage.

## Checks completed locally

- Locked dependency installation, Payload type generation, production build, lint and TypeScript checks passed.
- Six security regression tests passed (CSP, request size limits, CSV escaping, role access and atomic form rate-limit scope).
- Empty-local content import passed relational/integrity checks with no accounts/submissions/private upload records.
- Backup format-2 test passed archive checksums; actual production config capture remains an operator task with verified paths.
- Production-mode local checkout at localhost:3103 rendered English/Arabic Investment at 1366 and 390 px, meaningful content, no framework overlay or application runtime errors. Swiping changed content while retaining the background node/source.
- A fresh local test administrator authenticated successfully. This account is in the ignored disposable local DB, not the published snapshot.
- Tracked-file credential/private-path check and manual path review passed. Largest tracked file is under 20 MB. Scan is basic, not exhaustive security certification.

See [known issues](KNOWN-ISSUES.md) for unresolved dependency advisories. Production SMTP/inbox, third-party conversion receipt, live D&B, current DNS/TLS/server behavior and live CMS parity were not re-certified. Do not merge/promote to production without dependency review and the release acceptance procedure.
