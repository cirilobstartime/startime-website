# Handoff risks and follow-up

## Dependency advisories — October 7, 2026

The locked dependency installation passed, but `npm audit` reported **34 advisories: 13 moderate, 19 high and 2 critical**. The critical package entries include Next.js and Payload. These are dependency-range findings, not proof that each exploit is reachable in this application's configuration.

The audit suggests upgrades to Next.js 16.4.0 and the coordinated Payload 3.90.2 packages. Do not apply `npm audit fix --force` blindly. Review official advisories, update related packages consistently on a separate branch, rehearse migrations on a backup copy, then repeat build, browser, CMS/authentication, forms, redirects and data-preservation tests before production activation. Audit results are time-sensitive; rerun `npm audit` before the next release.

Relevant advisory examples: [Next.js image optimization](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4), [Payload SQL injection](https://github.com/advisories/GHSA-v49j-62m6-pgrr). Review the complete current audit, not only these examples.

No dependency versions were changed during this documentation/source handoff. The live server was not accessed or deployed. Do not interpret passed lint/build or the source publication as an all-clear security assessment.

## Local content bootstrap

The snapshot includes current local CMS/editor content and current SQL schema, not live production accounts or full historical versions/migration records. Do not blindly run historical migrations against the bootstrapped schema; inspect migration status and rehearse any future schema change on a copy. Never use this local snapshot as a production replacement or exact recovery package.

## Acceptance not performed in this handoff

Production email inbox receipt, third-party conversion receipt, live D&B availability, DNS/TLS/server health and live CMS parity were not re-certified. They require actual production acceptance at server activation. Existing local browser checks do not establish them.
