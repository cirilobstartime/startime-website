# Manual Production Deployment

This runbook describes the current production layout:

- Application directory: `/var/www/startime`
- systemd service: `startime`
- Reverse proxy: Nginx
- Application origin: `127.0.0.1:3000`
- Public domain: `https://startime.sa`

For a new environment that needs the current CMS content, first follow [Database setup and recovery](DATABASE.md). Routine code deployments must preserve the database and uploads already on the server.

Run commands from an account with `sudo` access. Do not paste secrets into terminal history or commit them to Git.

## 1. Pre-deployment checks

Confirm the release commit has been reviewed and approved:

```bash
cd /var/www/startime
git status --short
git branch --show-current
git rev-parse --short HEAD
df -h /
free -h
systemctl is-active startime
sudo nginx -t
```

Stop if the working tree contains unexpected changes. Investigate and preserve them before pulling.

At least 4 GB of free disk space is recommended for dependency installation, build output, and rollback data.

## 2. Back up stateful data

Create a timestamped directory:

```bash
release_stamp=$(date +%Y%m%d-%H%M%S)
backup_dir="/var/backups/startime/$release_stamp"
sudo mkdir -p "$backup_dir"
```

Back up SQLite consistently. Use the SQLite backup command when available:

```bash
sqlite3 startime.db ".backup '$backup_dir/startime.db'"
```

If `sqlite3` is unavailable, briefly stop the service and copy the database plus WAL files together:

```bash
sudo systemctl stop startime
sudo cp -a startime.db startime.db-wal startime.db-shm "$backup_dir/" 2>/dev/null || true
sudo systemctl start startime
```

Back up uploads, environment configuration, and the active Nginx site:

```bash
sudo tar -czf "$backup_dir/uploads.tar.gz" uploads
sudo cp -a .env "$backup_dir/.env"
sudo cp -a /etc/nginx/sites-enabled/startime.sa "$backup_dir/nginx-startime.sa"
sudo chmod -R go-rwx "$backup_dir"
```

Verify the backup is not empty:

```bash
sudo ls -lah "$backup_dir"
```

## 3. Fetch the approved release

```bash
git fetch --prune origin
git checkout main
git pull --ff-only origin main
git rev-parse --short HEAD
```

Never use `git reset --hard` on the production directory. A non-fast-forward error means the server and repository histories differ; investigate before continuing.

## 4. Install and validate

Install exactly the versions in `package-lock.json`:

```bash
npm ci
npm run lint
npm run typecheck
npm run db:migrate:status
```

Do not run `npm audit fix --force` during a deployment. Dependency upgrades require a separate reviewed change.

If the approved release contains new files in `src/migrations/`, apply them only
after the stateful-data backup above has been verified:

```bash
npm run db:migrate
npm run db:migrate:status
```

Migrations update the existing CMS schema in place. They do not seed, replace,
or reset production content. Stop and investigate any unexpected destructive
migration warning before continuing. The maintenance-mode release adds only the
new `maintenance_settings` tables; it does not modify existing pages, media,
users, or submissions.

## 5. Build and restart

The current installation builds in place, so stop the application before replacing `.next`:

```bash
sudo systemctl stop startime
npm run build
sudo systemctl start startime
```

If the build fails, restart the existing service immediately. The previous process can normally continue using the last successful build if `.next` was not removed manually:

```bash
sudo systemctl start startime
sudo systemctl status startime --no-pager
```

## 6. Verify the release

```bash
systemctl is-active startime
sudo nginx -t
curl -sS -o /dev/null -w 'HOME=%{http_code} HTTP=%{http_version}\n' https://startime.sa/
curl -sS -o /dev/null -w 'AR=%{http_code} HTTP=%{http_version}\n' https://startime.sa/ar
curl -sS -o /dev/null -w 'ADMIN=%{http_code} HTTP=%{http_version}\n' https://startime.sa/content-admin
```

Expected results are `200` and HTTP version `2` for all three routes.

Also verify in a browser:

1. Homepage desktop and mobile media.
2. English and Arabic navigation.
3. Content Studio login and one read-only content check.
4. A form validation flow without submitting test data unless approved.
5. Browser console and network requests for unexpected errors.

For a release that changes maintenance mode, verify both states before closing
the maintenance window:

1. In Content Studio, open **Content → Maintenance mode** and enable it.
2. Confirm both a public English URL and an Arabic URL redirect to the same
   `/maintenance` page.
3. Confirm `/content-admin` remains accessible while maintenance mode is on.
4. Disable maintenance mode and confirm normal public routes return.

## Rollback

Record the previously deployed commit before every update. To roll back code, use a reviewed revert commit in Git and deploy that commit. Avoid rewriting shared history.

If database state must be restored:

```bash
sudo systemctl stop startime
sudo cp -a /var/backups/startime/<backup>/startime.db /var/www/startime/startime.db
sudo rm -f /var/www/startime/startime.db-wal /var/www/startime/startime.db-shm
sudo tar -xzf /var/backups/startime/<backup>/uploads.tar.gz -C /var/www/startime
sudo systemctl start startime
```

Restore database or uploads only when the release changed content or schema and the restore has been approved. Restoring an old database removes content added after that backup.

For an exact recovery, follow [Database and recovery](DATABASE.md). Never replace production state without approval, a fresh backup, checksum verification, and a maintenance window.

## SSL renewal

Check the certificate and renewal timer:

```bash
sudo certbot certificates
systemctl status certbot.timer --no-pager
sudo certbot renew --dry-run
```

After any Nginx change:

```bash
sudo nginx -t
sudo systemctl reload nginx
```
