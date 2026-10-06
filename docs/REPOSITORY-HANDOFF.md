# Repository handoff

## Two publication targets

Internal: `git@github.com:inam1224/startime.git` retains project history, internal instructions and working documentation. Company: `git@github.com:cirilobstartime/startime-website.git` receives a clean developer-facing tree and concise release history. Do not rewrite authorship, forge a developer identity or make claims about authorship. Documentation describes the software, not the tools used to develop it.

The October 7 handoff uses review branches, not a live deployment or an automatic promotion to production main. The company branch includes the newest local work and sanitized content; review/merge and server activation remain separate operations.

## Included in the company tree

- Application source, dependency lockfile, migrations, source assets and required configuration examples.
- README, CONTRIBUTING, SECURITY, architecture, CMS operating instructions and deployment/recovery runbooks.
- Operational scripts for backup, local administrator creation, sanitized content export/import and reviewed migrations.
- `database/content-snapshot/content.json`, checksum and referenced public uploaded media under `database/content-snapshot/media`.

The snapshot preserves relational IDs and locale content from the local database. It includes current content/editor state, including unpublished current values, but not full draft/version history. It is not an assertion that this snapshot equals current live CMS content. Media URLs are portable relative paths. Internal media sourcing notes are stripped. Only files named by public Media records are copied, not orphaned or private uploads.

## Excluded from both Git targets

Credentials, `.env`, private keys, accounts/password hashes/sessions/reset tokens, raw SQLite databases/WAL files, submissions, visitor attribution records, private uploaded attachments and exact recovery packages. Store full recovery state in authorized encrypted private storage. A private Git repository still clones sensitive values permanently; it is not a secret store.

Company additionally excludes internal working instructions, research/plans, old QA output, design exploration, local fixtures, recovery archives and implementation working notes. Keep functional source, migrations and regression tests intact.

## Local snapshot setup

Use Node.js 22.13+ and source at the same handoff revision. Install dependencies, create local `.env` with unique secrets, correct local origin and disabled SMTP. Then:

```bash
CONTENT_BOOTSTRAP_CONFIRM=empty-local-only node scripts/content-snapshot.mjs import ./startime.db ./database/content-snapshot
```

The utility verifies JSON/media checksums and relational integrity, refuses existing DB replacement and refuses overwriting differing existing media. It creates empty private tables so Payload can start without copying private data. Create a fresh local administrator with `scripts/create-admin.ts`; obtain any required production credentials only through the approved secret channel. Never run snapshot import on an existing production database.

## Updating the handoff

Export from a verified local/read-only source:

```bash
node scripts/content-snapshot.mjs export ./new-site-cms.db /tmp/NEW_CONTENT_SNAPSHOT
```

Review public content, filenames and private-data exclusions before publication. Copy the resulting snapshot into the handoff tree only after review. Do not replace it with an exact DB backup. Generate a manifest recording source revision, snapshot capture time, scope and tests. Run lint/typecheck/build, affected browser checks, tracked-secret checks and manual review before pushing.

## Git publication procedure

1. Inspect remote URLs and `git ls-remote` heads; fetch exact intended base.
2. Commit reviewed source/internal docs to the internal feature branch. Never force-push an unrelated production branch.
3. Create a separate company checkout from company main; overlay an explicit clean allowlist of source/docs and sanitized snapshot. Remove stale tracked files intentionally, not unrelated company history.
4. Keep required scripts/migrations and any scripts referenced by package.json. Remove internal-only scripts and update package commands if removed.
5. Scan the whole resulting company tree, check no private or internal-only files, and verify largest Git file under hosting limits. Public media is duplicated as a handoff artifact; production retains its own live uploads.
6. Commit with truthful summary and publish a new review branch. Record remote commit IDs and check remote heads.
7. Merge only after approval of the intended production source. Back up live data and follow the release guide for server activation. Git publication never imports content automatically.

Full internal history remains internal. A cleaned company tree should not inherit commits containing internal instructions or secrets merely to share the same hash.
