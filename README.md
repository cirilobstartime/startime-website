# Startime Corporate Website

The Startime corporate website is a bilingual Next.js application with an integrated Payload CMS. The public website, content studio, form processing, media management, redirects, SEO controls, and marketing configuration run from one deployable application.

## Platform

- Next.js App Router with TypeScript
- Payload CMS
- SQLite with WAL mode
- React, Motion, GSAP, and Phosphor Icons
- Sharp for image processing and WebP derivatives
- Nginx and systemd in production

## Requirements

- Node.js 20.9 or newer (Node.js 22 LTS recommended)
- npm 10 or newer
- Linux, macOS, or WSL for local development

## Local setup

```bash
git clone <repository-url> startime
cd startime
cp .env.example .env
npm ci
npm run dev
```

Set `NEXT_PUBLIC_APP_URL=http://localhost:3100` locally, then run `npm run dev -- --port 3100`. English is `/`, Arabic `/ar`; Content Studio is `/content-admin`. The browser origin must match the configured origin exactly.

Create secure, unique values for every secret in `.env`. Never commit `.env`, database files, uploaded media, credentials, or private keys.

## Quality checks

Run these before a release:

```bash
npm run lint
npm run typecheck
npm run build
```

The production process is started with:

```bash
npm run start
```

## Content model

The current frontend uses independently editable English and Arabic main pages, section blocks, media and global design controls. Repository publication does not imply that the latest local changes have been activated on production. See the release guide for verification and activation requirements.

- English and Arabic page sections are stored independently.
- Editing one locale does not overwrite the other locale.
- Pages, sections, media, forms, redirects, insights, global navigation, footer content, SEO, and marketing settings are managed in Payload.
- Administrator and editor roles can manage website content. User and role administration remains restricted to administrators.
- Public media is cacheable; CMS and private API surfaces use no-store policies.

## Documentation

- [Start here: editing, deployment, patches and rollback](docs/CHANGE-AND-RELEASE-GUIDE.md)
- [Repository and public-content handoff](docs/REPOSITORY-HANDOFF.md)
- [Known handoff risks](docs/KNOWN-ISSUES.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Database setup and recovery](docs/DATABASE.md)
- [Fresh server provisioning](docs/PROVISIONING.md)
- [Manual deployment and rollback](docs/DEPLOYMENT.md)
- [Operations and troubleshooting](docs/OPERATIONS.md)
- [Contributing and release workflow](CONTRIBUTING.md)
- [Security policy](SECURITY.md)

## Security

- Use separate secrets for Payload, forms, and attribution signing.
- Use an SMTP app password rather than an account password.
- Keep production secrets only in the server environment.
- Back up the SQLite database, uploads, and environment file before every deployment.
- Report security issues privately to the Startime technical team rather than opening a public issue.

Raw production databases and private uploads are never committed to Git. Use the sanitized content bootstrap for a clean development environment, or obtain an exact recovery archive through Startime's approved private encrypted channel. See [Database and recovery](docs/DATABASE.md).

## Company content snapshot

The handoff branch includes `database/content-snapshot` with current local CMS content and referenced public media, without accounts, sessions, submissions, private attachments or history. It is not a production backup. Use Node.js **22.13+** for this utility, and import only into a new empty local database:

```bash
CONTENT_BOOTSTRAP_CONFIRM=empty-local-only node scripts/content-snapshot.mjs import ./startime.db ./database/content-snapshot
```

Then create your own local administrator: set `ADMIN_EMAIL` and `ADMIN_PASSWORD` privately and run `node --env-file=.env --import tsx scripts/create-admin.ts`; unset both variables afterward. The current create-admin script reads environment variables; it is not an interactive prompt. Keep SMTP disabled locally unless intentionally testing notifications. Never import this snapshot over live state.
