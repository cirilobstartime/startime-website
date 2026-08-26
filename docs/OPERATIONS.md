# Operations and Troubleshooting

## Application does not start

```bash
sudo systemctl status startime --no-pager
sudo journalctl -u startime -n 200 --no-pager
```

Common causes:

- Missing or invalid `.env` values.
- A production secret shorter than the required length.
- Dependencies not matching `package-lock.json`.
- A failed or incomplete Next.js build.
- Port 3000 already occupied by another process.

Confirm the service configuration and port:

```bash
sudo systemctl cat startime
sudo ss -ltnp | grep ':3000'
```

## Nginx returns 502

The application process is usually stopped or not listening on the configured port:

```bash
systemctl is-active startime
curl -I http://127.0.0.1:3000/
sudo nginx -t
sudo tail -n 100 /var/log/nginx/error.log
```

Fix the application first, then reload Nginx only after `nginx -t` succeeds.

## Content Studio login error

```bash
curl -I http://127.0.0.1:3000/content-admin
sudo journalctl -u startime -n 200 --no-pager
ls -lah startime.db*
```

Check database ownership, free disk space, Payload secrets, and whether a stale SQLite lock remains after an unclean shutdown. Never delete the database. Stop the service before manually handling WAL files and take a backup first.

## Build fails with missing types or modules

Install full production and development dependencies before building:

```bash
rm -rf node_modules
npm ci
npm run typecheck
npm run build
```

Do not use `npm ci --omit=dev` before `next build`; TypeScript and build tooling are development dependencies.

## Build is killed or memory is exhausted

Check memory and swap:

```bash
free -h
swapon --show
sudo journalctl -k -n 100 --no-pager | grep -i -E 'oom|killed process'
```

If the server has no swap, create a 2 GB swap file:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

Do not create a second swap entry if one already exists.

## Disk space is low

Inspect before deleting anything:

```bash
df -h /
sudo du -xhd1 /var | sort -h
sudo du -xhd1 /var/www/startime | sort -h
sudo journalctl --disk-usage
```

Safe candidates, after review, can include old application backups, obsolete build directories, npm cache, and aged system logs. Preserve the newest verified database/upload backup and any backup required by retention policy.

```bash
npm cache verify
sudo journalctl --vacuum-time=14d
```

Never delete `startime.db`, `.env`, current uploads, the active `.next` build, or the current release directory to recover space.

## SQLite is locked

First identify duplicate application processes:

```bash
sudo systemctl status startime --no-pager
ps aux | grep '[n]ext start'
lsof startime.db
```

Only one production application instance should write to the SQLite database. Stop duplicate processes cleanly. Do not remove WAL or shared-memory files while the service is running.

## Media does not load

```bash
curl -sS -r 0-1023 -o /dev/null -w '%{http_code} %{content_type} %{size_download}\n' https://startime.sa/api/media/file/<filename>
```

A successful video or large-media range request normally returns `206`. Confirm the file exists, permissions allow the service user to read it, and the database record points to the correct filename.

## Forms are stored but email is not sent

Check SMTP settings without printing the password:

```bash
grep -E '^(SMTP_HOST|SMTP_PORT|SMTP_SECURE|SMTP_USER|SMTP_FROM)=' .env
sudo journalctl -u startime -n 200 --no-pager
```

Confirm the sender uses a valid app password and that outbound TCP port 587 is allowed. A notification failure must not delete the stored CMS submission.

## Health checklist

```bash
systemctl is-active startime
systemctl is-active nginx
curl -sS -o /dev/null -w '%{http_code} %{http_version}\n' https://startime.sa/
curl -sS -o /dev/null -w '%{http_code} %{http_version}\n' https://startime.sa/ar
df -h /
free -h
```
