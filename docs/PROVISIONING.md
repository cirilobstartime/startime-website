# Fresh server provisioning

Use only for a new server. Existing production changes follow [the release guide](CHANGE-AND-RELEASE-GUIDE.md), not this fresh-install procedure.

1. Assign a stable public IP and update intended DNS records. Allow public 80/443; SSH only from authorized administrator IPs. Keep application 3100 loopback-only. Configure required SMTP egress.
2. Install Nginx, Git, SQLite tools, Certbot, build tools and an approved Node.js release satisfying package.json. Use Node.js 22.13+ when running content-snapshot utilities.
3. Confirm adequate disk, RAM and existing swap before building. Do not create duplicate swap entries.
4. Use a read-only repository deploy key with least privilege. Keep its private key on the server; never commit it.
5. Clone reviewed source into a new release under `/var/www/startime-cms/releases`. Install locked dependencies with `npm ci`, including build-time dev dependencies.
6. Provision production secrets through the approved secure channel into a service-account-owned `.env` with restrictive permissions. Set exact public origin and absolute DB path. Preserve existing signing secrets during recovery.
7. For a real replacement server, restore the matching verified encrypted production package, not the sanitized local company snapshot. For a disposable development server, use the documented empty-local bootstrap and a fresh administrator.
8. Keep writable data in preserved state directories outside release replacement. Link only intended upload state to releases. No public alias for private attachments.
9. Build the reviewed release against isolated data, record revision and verify `.next/BUILD_ID`.
10. Configure `startime-cms.service` with the verified service account, working directory, EnvironmentFile and loopback port 3100. Enable/restart policy must match operational requirements.
11. Configure Nginx TLS/proxy and scoped aliases for immutable build assets, public source assets and public media. CMS/private API responses must not be publicly cached. Verify worker traversal/read permissions without exposing secrets.
12. Run `nginx -t`, activate service, configure certificate issuance/renewal and verify HTTPS redirects. Do not assume a certificate exists before issuance.
13. Complete EN/AR, CMS, media, redirects, forms/inbox, SEO and analytics acceptance checks. Set up monitored private backups and perform an isolated restore rehearsal.

Service/IP/DNS values and backup retention are environment-specific. This handoff does not automatically provision AWS resources, monitoring, backups or certificates. Document actual installed paths and ownership before first release.
