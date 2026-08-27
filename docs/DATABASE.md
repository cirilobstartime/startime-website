# Database Setup and Recovery

Startime supports two reproducible setup paths:

1. A clean development environment from the source-controlled bilingual seed.
2. An exact production environment from a verified SQLite database-and-uploads recovery archive.

## Why production data is not stored in GitHub

The production SQLite database and uploads are operational data, not source code. They can contain CMS accounts, password hashes, salts, sessions, reset tokens, contact and career submissions, attribution records, personal contact details, and private form uploads.

Committing these files would permanently copy sensitive data into Git history, every clone, developer workstations, and third-party repository backups. Removing them in a later commit would not remove them from history.

Therefore:

- Never commit `startime.db`, SQLite WAL/SHM files, production uploads, recovery archives, `.env`, secrets, or credentials.
- Store production recovery archives only in Startime's approved private encrypted backup location.
- Transfer recovery archives only through an authenticated encrypted channel approved by Startime IT.
- Never attach a production archive to a public GitHub release, issue, pull request, chat, email, or unauthenticated file-sharing service.

## Path 1: clean development environment

This path creates a clean environment with the approved source-controlled English and Arabic baseline. It does not copy production CMS users, sessions, submissions, attribution records, or private uploads.

Configure the application first:

```bash
cp .env.example .env
npm ci
npm run build
```

At minimum, set these values in `.env`:

```dotenv
DATABASE_URL=file:./startime.db
PAYLOAD_SECRET=<independent-random-secret-at-least-32-characters>
FORM_SECURITY_SECRET=<independent-random-secret>
ATTRIBUTION_SECURITY_SECRET=<independent-random-secret>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Seed both languages:

```bash
npm run seed:bilingual
```

Create a local CMS administrator interactively. Never place its credentials in Git or shell scripts:

```bash
npm run create-admin
```

Start and verify the application:

```bash
npm run dev
```

Open `/`, `/ar`, and `/content-admin`. The seed is the approved source baseline; it is not a copy of later production CMS edits.

Do not run a seed command against an existing production database. It is intended only for a new, empty development environment.

## Path 2: exact production recovery

An exact recovery requires the database and uploads captured together from one verified recovery directory.

Recovery archives are generated on the production server under:

```text
/var/backups/startime/recovery-YYYYMMDD-HHMMSS/
```

The latest archive verified during this repository update is:

```text
/var/backups/startime/recovery-20260827-090636/
```

It was created from source commit:

```text
f6a58a26ef75202f7007c475e97f7825f114b9f1
```

The SQLite integrity check passed and the package checksums were verified. This path is on the production server, not in GitHub and not publicly downloadable.

### Obtaining the archive

An authorized Startime IT administrator should copy the complete recovery directory to the approved private encrypted backup location. The recommended long-term location is a private versioned S3 bucket with SSE-KMS encryption, blocked public access, least-privilege IAM permissions, access logging, and a defined retention policy.

Authorized recovery personnel obtain the archive from that private location through the approved authenticated channel. The database and uploads must come from the same recovery directory.

Each package contains:

- `startime.db.gz`
- `uploads.tar.gz`
- `SHA256SUMS`
- `SOURCE_COMMIT`

### Required environment configuration

The restored application requires a server `.env` containing at least:

```dotenv
NODE_ENV=production
DATABASE_URL=file:./startime.db
NEXT_PUBLIC_APP_URL=https://startime.sa
PAYLOAD_SECRET=<existing-production-secret-from-approved-secret-store>
FORM_SECURITY_SECRET=<existing-production-secret-from-approved-secret-store>
ATTRIBUTION_SECURITY_SECRET=<existing-production-secret-from-approved-secret-store>
```

Configure the documented SMTP and analytics values where those services are enabled. Obtain every secret from the approved secret manager or encrypted handover; never infer, regenerate, or commit an existing production secret during recovery.

### Restore procedure

Install the approved source release that corresponds to the recovery package, then stop the application before replacing state. The verified archive above is paired with the `recovery-2026-08-27` release tag; `SOURCE_COMMIT` provides the original deployment audit reference:

```bash
cd /var/www/startime
git fetch --tags origin
git checkout recovery-2026-08-27
npm ci
sudo systemctl stop startime
```

Verify the package before extracting anything:

```bash
cd /secure/recovery
sha256sum -c SHA256SUMS
```

Both entries must report `OK`. Stop if validation fails.

Preserve any current state before restoring:

```bash
cd /var/www/startime
npm run backup:recovery
```

Restore the matching database and uploads:

```bash
cd /var/www/startime
gzip -dc /secure/recovery/startime.db.gz > startime.db.restore
rm -f startime.db.restore-wal startime.db.restore-shm
rm -f startime.db-wal startime.db-shm
mv startime.db.restore startime.db
if [[ -d uploads ]]; then
  mv uploads "uploads.before-recovery-$(date +%Y%m%d-%H%M%S)"
fi
tar -xzf /secure/recovery/uploads.tar.gz -C /var/www/startime
sudo chown ubuntu:www-data startime.db
sudo chown -R ubuntu:www-data uploads
sudo chmod 640 startime.db
```

Use the actual systemd service account when it is not `ubuntu`. The service account must be able to write the database directory and upload directories.

Build, start, and verify:

```bash
cd /var/www/startime
npm run build
sudo systemctl start startime
sudo systemctl status startime --no-pager
sudo journalctl -u startime -n 100 --no-pager
curl -sS -o /dev/null -w 'HOME=%{http_code} HTTP=%{http_version}\n' https://startime.sa/
curl -sS -o /dev/null -w 'AR=%{http_code} HTTP=%{http_version}\n' https://startime.sa/ar
curl -sS -o /dev/null -w 'ADMIN=%{http_code} HTTP=%{http_version}\n' https://startime.sa/content-admin
```

Confirm CMS login, English and Arabic content, media, and a read-only submissions check. Do not submit test forms in production unless explicitly approved.

## Creating a new verified recovery archive

Run this from the production application directory:

```bash
cd /var/www/startime
sudo mkdir -p /var/backups/startime
sudo chown "$USER" /var/backups/startime
npm run backup:recovery
```

The script:

- Creates a transactionally consistent SQLite copy using the application's installed SQLite driver.
- Runs `PRAGMA integrity_check` on the copy.
- Compresses the database.
- Archives the complete uploads directory from the same environment.
- Records the current Git commit.
- Generates and verifies SHA-256 checksums.
- Applies owner-only permissions to the recovery directory and files.

The command is non-destructive: it does not edit the live database or uploads. Treat its output as highly sensitive production data and move it to approved encrypted private storage.
