# Security Policy

## Reporting a vulnerability

Report suspected vulnerabilities privately to the Startime IT team. Do not open a public issue, publish proof-of-concept code, or test against production data without written authorization.

Include:

- Affected route, component, or dependency.
- Reproduction steps that avoid destructive actions.
- Expected and observed behavior.
- Potential impact.
- Relevant logs or screenshots with credentials and personal data removed.

## Handling requirements

- Never commit secrets, credentials, private keys, database files, uploaded form documents, or production backups.
- Rotate a credential immediately if it may have been exposed, then remove it from Git history using the approved incident process.
- Keep Payload, Next.js, Node.js, Nginx, and operating-system security updates under regular review.
- Test dependency upgrades on a non-production environment before release.
- Preserve audit logs and backups during incident response.

## Supported version

Security fixes are applied to the production branch and the currently deployed release. Older snapshots and unmaintained branches are not supported.
