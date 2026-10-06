# Content and recovery

SQLite runs in WAL mode. Code, public-content handoff and production recovery state are separate artifacts.

## Local development content

The company branch includes `database/content-snapshot` containing current local CMS content, relational IDs and referenced public media. It excludes accounts, sessions, submissions, private uploads and version history. This is not a copy of current live production state.

Use Node.js 22.13+ and import only into a **new** local database:

```bash
CONTENT_BOOTSTRAP_CONFIRM=empty-local-only node scripts/content-snapshot.mjs import ./startime.db ./database/content-snapshot
```

Checksums, media collisions and relational integrity are checked. Import only trusted reviewed snapshot SQL. Create your own local administrator with `ADMIN_EMAIL`/`ADMIN_PASSWORD` set privately and `node --env-file=.env --import tsx scripts/create-admin.ts`; unset these values afterward.

## Exact production recovery

Production accounts, submissions, private attachments, environment credentials and operational configurations are not in Git. Obtain an exact verified backup through the approved encrypted private channel.

`scripts/create-recovery-archive.sh` uses a consistent SQLite copy, follows upload symlinks and verifies checksums. Provide explicit verified DB, uploads, environment, Nginx and unit paths. Format 2 stores upload directory contents directly. Freeze editor/upload writes briefly to capture DB and files coherently. Back up drop-ins/includes separately when present.

See [steps 5 and 12 of the release guide](CHANGE-AND-RELEASE-GUIDE.md) for commands. Restore to new private paths, validate, reconcile post-backup changes and activate only after approval. Never overwrite live state with a local content snapshot or copy a live WAL-mode DB file alone.
