# Operations and failure diagnosis

Read-only checks for the current convention:

```bash
systemctl show startime-cms.service -p WorkingDirectory -p EnvironmentFiles -p User -p ExecStart
systemctl is-active startime-cms.service
sudo journalctl -u startime-cms.service -n 100 --no-pager
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3100/
sudo nginx -t
df -h /
free -h
```

Review logs privately; redact secrets and personal data before sharing.

| Failure | First action |
| --- | --- |
| Patch preflight fails | Stop; exact base mismatch or overlapping edit. Repackage locally. |
| Build killed | Check disk, memory, swap and OOM logs; keep existing site running. |
| Turbopack dependency error | Install real node_modules in candidate release. |
| 502 | Check app service, loopback port and environment; roll back code if needed. |
| HTML fine, no CSS/JS | Verify hashed URLs and active Nginx static aliases/permissions. |
| Media missing | Check resolved uploads, filename and public-only alias/permissions. |
| CMS login/403 | Origin/cookies, authenticated user response, DB path and reviewed schema. |
| CMS unexpectedly empty | Stop new writes; wrong relative DATABASE_URL may create an empty DB. Do not seed. |
| SQLite locked | Identify duplicate writers; do not remove live WAL/SHM. |
| Form stored, no email | Inspect recipients/SMTP/egress privately; confirm inbox separately. Preserve submission. |
| Redirect incorrect | Test exact locale/encoded path, current slug, precedence and query preservation. |
| D&B seal unavailable | Inspect provider response and issued-host/referrer configuration; contact D&B if needed. |
| Works only through VPN | Compare DNS resolver, TLS and network path before changing server. |

For safe recovery, follow [the release guide](CHANGE-AND-RELEASE-GUIDE.md). Never use blanket permission changes, delete current data to free space, or restore backups without approval. Retain previous release and latest verified private backups until retention policy permits cleanup.
