# Fresh Server Provisioning

This guide provisions a new Ubuntu server for the Startime application. It does not contain credentials. Obtain production secrets through the approved secure channel.

## 1. Prepare DNS and network access

Before issuing SSL certificates:

- Point the domain A records to the server's static public IP.
- Allow inbound TCP 22 from approved administrator IPs only.
- Allow inbound TCP 80 and 443 publicly.
- Keep port 3000 private; Nginx proxies to it locally.
- Allow outbound TCP 587 when SMTP notifications are enabled.

## 2. Install system packages

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y git nginx sqlite3 certbot python3-certbot-nginx build-essential curl
```

Install Node.js 22 LTS using the organization's approved package source. Confirm versions before continuing:

```bash
node --version
npm --version
```

Node.js must satisfy the version range in `package.json`.

## 3. Configure swap when required

Small instances should have swap available for production builds:

```bash
free -h
swapon --show
```

If no swap exists, create a 2 GB swap file:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

Run `swapon --show` again and confirm there is exactly one intended entry.

## 4. Grant repository access

Use a read-only GitHub deploy key for the production server whenever possible. Generate it on the server and add only the public key to the repository:

```bash
ssh-keygen -t ed25519 -C 'startime-production-deploy' -f ~/.ssh/startime_deploy
cat ~/.ssh/startime_deploy.pub
```

Do not copy or email the private key. Configure an SSH host entry that selects the deploy key:

```text
Host github-startime
  HostName github.com
  User git
  IdentityFile ~/.ssh/startime_deploy
  IdentitiesOnly yes
```

Test access, then clone the approved repository:

```bash
ssh -T git@github-startime
sudo mkdir -p /var/www/startime
sudo chown "$USER":www-data /var/www/startime
git clone git@github-startime:cirilobstartime/startime-website.git /var/www/startime
cd /var/www/startime
npm ci
```

## 5. Configure production environment

```bash
cp .env.example .env
chmod 600 .env
```

Generate independent random secrets; do not reuse the examples:

```bash
openssl rand -base64 48
```

Required production values include:

- `PAYLOAD_SECRET`
- `FORM_SECURITY_SECRET`
- `ATTRIBUTION_SECURITY_SECRET`
- `DATABASE_URL=file:./startime.db`
- `NEXT_PUBLIC_APP_URL=https://startime.sa`
- SMTP values when notifications are enabled

The attribution secret must match only across approved Startime domains that participate in cross-domain attribution. Restrict `.env` to the service account.

## 6. Restore content for a reproducible environment

Choose one supported path:

1. For a clean development environment, complete the first build and run `npm run seed:bilingual`. This installs the approved source-controlled English and Arabic baseline without production users, sessions, submissions, or private uploads.
2. For an exact production environment, obtain the latest verified database-and-uploads recovery archive through Startime's approved private encrypted channel and follow [Database and recovery](DATABASE.md).

Never commit a raw production database or uploads archive to Git. Only authorized administrators should handle an exact recovery archive.

## 7. Build the first release

```bash
npm run lint
npm run typecheck
npm run build
mkdir -p uploads/media uploads/form-uploads
```

Do not run `npm run seed` or `npm run seed:bilingual` against an existing production database. Seeding is only for a new, empty development installation. Exact production restoration uses the recovery procedure instead.

## 8. Install the systemd service

Create `/etc/systemd/system/startime.service`:

```ini
[Unit]
Description=Startime Next.js and Payload application
After=network.target

[Service]
Type=simple
User=ubuntu
Group=www-data
WorkingDirectory=/var/www/startime
Environment=NODE_ENV=production
EnvironmentFile=/var/www/startime/.env
ExecStart=/usr/bin/npm run start
Restart=on-failure
RestartSec=5
TimeoutStopSec=30
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

Use the actual deployment account if it is not `ubuntu`. Ensure that account can read `.env` and write the database and upload directories.

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now startime
sudo systemctl status startime --no-pager
curl -I http://127.0.0.1:3000/
```

## 9. Configure Nginx

Create `/etc/nginx/sites-available/startime.sa`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name startime.sa www.startime.sa;

    client_max_body_size 25m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 120s;
    }
}
```

Enable and validate it:

```bash
sudo ln -s /etc/nginx/sites-available/startime.sa /etc/nginx/sites-enabled/startime.sa
sudo nginx -t
sudo systemctl reload nginx
```

Remove the default Nginx site only after the Startime configuration passes validation.

## 10. Issue SSL certificates

```bash
sudo certbot --nginx -d startime.sa -d www.startime.sa
sudo certbot renew --dry-run
```

Confirm HTTPS and HTTP/2:

```bash
curl -sS -o /dev/null -w '%{http_code} HTTP/%{http_version}\n' https://startime.sa/
```

The expected result is `200 HTTP/2`.

## 11. Create the first CMS administrator

Run the administrator creation command interactively and use credentials supplied through the approved secure channel:

```bash
npm run create-admin
```

Never place administrator credentials in source files, shell scripts, documentation, tickets, or Git commits.

## 12. Final verification

- English and Arabic pages return HTTP 200.
- `/content-admin` loads and authenticates.
- Uploaded images can be read back.
- The database and uploads are writable by the service account.
- Nginx and application services restart successfully.
- Certbot's renewal timer is enabled.
- A first database/upload backup has been created and tested.
- Port 3000 is not publicly reachable.
