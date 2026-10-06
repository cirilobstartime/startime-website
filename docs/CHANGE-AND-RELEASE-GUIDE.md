# Editing, deployment, patches and recovery

## Scope

This is the primary step-by-step operating guide. Historical notes in other documents are background; discover active paths before using them. Current deployment convention: `startime-cms.service`, loopback `3100`, releases under `/var/www/startime-cms/releases`. The original `20261001-cms` directory historically held persistent state. Do not assume it still does. English uses `/`, Arabic `/ar`; slugs can be changed in CMS.

The October 7 repository handoff includes locally verified changes not yet switched live. A Git push is not a server release. Commands below use Bash and require replacing example paths with verified values. Never print environment secrets.

## 1. Choose CMS or code

| Request | Edit location | Deployment |
| --- | --- | --- |
| Text, media, section visibility/order, colors, padding, SEO, slug | Pages in Content Studio | Publish correct locale; no build |
| Header/footer, redirects, global fonts/colors, icon dimensions | CMS globals/collections | Publish/save as applicable |
| News/Articles, taxonomy, jobs | Dedicated post collections | Publish each intended locale |
| New fields, rendering/CSS/slider logic, dependencies | Source branch | Build and deploy |
| SQL schema change | Reviewed Payload migration | Rehearse on copy before live |
| Content correction with a code patch | Narrow CMS edit or reviewed script | Separately scoped, never whole DB replacement |

## 2. CMS-only editing

1. Sign in at `/content-admin` with your own account.
2. Select English or Arabic **before** editing. Publication is independent per locale.
3. Open the intended Page and section/card/slide. Record its previous settings if substantial.
4. Change only requested fields. Hide with visibility switches rather than deleting needed sections.
5. Drag sections/cards for ordering. Check links, text alignment and RTL.
6. Image labels specify reference screen, rendered frame and recommended source upload. Default is for all devices; device slots are optional alternate compositions, not automatic defaults.
7. Global design settings apply unless a page/section/item override wins. Preserve intentional overrides.
8. Publish the selected locale; a saved draft is not live.
9. Check public page in a private window on phone and desktop. Confirm other locale unchanged.
10. For a slug change test new URL, old redirect, navigation, canonical and sitemap, including encoded Arabic URLs.

Investment hero intentionally exposes scroll-stage copy, not globe/background media. Legacy & Impact uses the first visible background unless a later slide explicitly overrides it. Portfolio image slots can inherit Home or select Investment-specific files. Hidden Projects sections remain available to unhide.

News appears on the News archive and normally Home; Articles appear on Insights and only on Home if selected. Choose corresponding categories/tags. Jobs are managed in Job Postings; Careers controls manual priority or latest-first. Media selection is editable separately by locale.

## 3. Prepare code locally

1. Inspect `git status --short`, branch and recent commits. Preserve unrelated changes.
2. Create a fix/feature branch from the intended base revision.
3. Back up local state before changing CMS data. Use SQLite online backup, not a raw `.db` copy while WAL is active.
4. Use local origin/secrets and an isolated test DB. Disable production SMTP locally.
5. Implement the smallest change; retain CMS editability, locale separation and approved layout.
6. Run:

```bash
npm ci
npm run payload:generate:types
npm run lint
npm run typecheck
npm run build
node scripts/check-repository-secrets.mjs
git diff --check
```

The basic credential scan is not exhaustive; review manually too. For parallel preview/build verification use a separate `STARTIME_NEXT_DIST_DIR` and isolated DB. Do not overwrite the preview's `.next` directory.

7. Test actual browser behavior: EN/AR, phone/laptop/desktop, affected editor publish/reload, hide/show/reorder and image selection. Include Safari for clipping/animation changes.
8. Record evidence and provider-dependent limits. Obtain explicit server-release approval.

Also run `npm audit` and review [known handoff risks](KNOWN-ISSUES.md). Resolve or explicitly assess critical/high dependency findings before a production promotion; do not force dependency upgrades without regression tests.

## 4. Inspect production before deployment

```bash
systemctl show startime-cms.service -p WorkingDirectory -p EnvironmentFiles -p User -p ExecStart
systemctl is-active startime-cms.service
sudo nginx -t
sudo ss -ltnp | rg ':3100'
df -h /
free -h
swapon --show
```

Use grep if rg is unavailable on the server. Privately inspect the active `.env` database path and Nginx site. Record: active/source revision, service account, working directory, env file, absolute DB path, resolved uploads path (`readlink -f`), unit/drop-ins and Nginx aliases. Do not display the environment file. Stop if paths, revisions or overlapping server edits differ unexpectedly.

## 5. Back up DB, media and configuration

Set actual absolute paths from inspection, from the active release directory:

Use the reviewed format-2 backup script from this handoff. Older active releases may still contain an older script: copy the reviewed script into a private operator directory and invoke it from the active release, with the same explicit `PROJECT_DIR` and data paths, before proceeding. Confirm BACKUP_FORMAT is 2.

```bash
export PROJECT_DIR=/var/www/startime-cms/releases/ACTIVE_RELEASE
export DATABASE_PATH=/absolute/path/to/live/startime.db
export UPLOADS_PATH=/absolute/path/to/live/uploads
export ENV_PATH=/absolute/path/to/active/.env
export NGINX_PATH=/etc/nginx/sites-available/VERIFIED_SITE
export SYSTEMD_UNIT_PATH=/etc/systemd/system/startime-cms.service
bash scripts/create-recovery-archive.sh /var/backups/startime
```

Use a brief editor/upload write freeze to capture database and uploads coherently. SQLite backup is transactional, but copying media is not part of its transaction. Include systemd drop-ins/additional Nginx includes separately in the restricted package and update checksums. Set `SOURCE_REVISION` if the deployed directory has no Git metadata.

Verify checksums, DB integrity, archive listing and these files: `startime.db.gz`, `uploads.tar.gz`, `environment.private`, `nginx-site.conf`, `systemd-unit.service`, `SOURCE_COMMIT`, `BACKUP_FORMAT`. Script format **2** archives upload contents directly, following symlinks; older archives may wrap an `uploads/` directory. Never assume formats are interchangeable.

Backups are owner-only. Copy to approved encrypted off-server storage (private versioned S3, blocked public access, least-privilege access, retention and encryption). This guide does not automatically provision backup schedules or buckets. Do not commit exact backups to either Git repository.

## 6. Package a full source release

Use an immutable approved commit:

```bash
git archive --format=tar.gz --output=/tmp/startime-source.tar.gz APPROVED_REVISION
shasum -a 256 /tmp/startime-source.tar.gz
```

Transfer through SSH or the established authorized AWS CloudShell/private-S3 path. Verify matching hash on Linux with `sha256sum` before extraction. Do not use public objects or send credentials. Create a **new** unique release directory under a normal `022` umask; never extract over the running release:

```bash
task_release=/var/www/startime-cms/releases/NEW_UNIQUE_RELEASE
umask 022
mkdir "$task_release"
tar -xzf /secure/transfer/startime-source.tar.gz -C "$task_release"
```

Record approved revision in the release manifest. A company content snapshot may be present in source but must **not** be imported into production. Exclude it from release packaging when practical.

## 7. Deploy a small patch instead

Record exact base and target commits. Generate a binary-safe code patch:

```bash
git diff --binary BASE_REVISION APPROVED_REVISION -- . ':!database/content-snapshot' > /tmp/startime-code.patch
shasum -a 256 /tmp/startime-code.patch
```

Make a new source directory from the **exact base** archive, transfer/verify the patch, then:

```bash
cd "$task_release"
git apply --check /secure/transfer/startime-code.patch
git apply /secure/transfer/startime-code.patch
```

If preflight fails, stop. Wrong base, missing files or overlapping edits must be resolved locally. Do not force it on the active server. A full source archive is often safer. Every patch still requires a full Next.js build; copying source into an old build does nothing. Changed lockfile requires locked dependency installation.

## 8. Connect preserved state and build

Privately copy the live env file to the new release, restrict it, and ensure `DATABASE_URL` is the **absolute existing live DB**. The runtime origin stays `https://startime.sa`. Link `uploads` to existing live uploads. Never replace these with local content.

```bash
cp "$ENV_PATH" "$task_release/.env"
chmod 600 "$task_release/.env"
ln -s "$UPLOADS_PATH" "$task_release/uploads"
cd "$task_release"
npm ci
```

Use a real release-local `node_modules`, not an outside symlink (Turbopack can reject it). Include dev dependencies for TypeScript/build tools.

Uncompress the verified database backup into a separate private build-only DB. Build against that copy, not live state:

```bash
NODE_ENV=production DATABASE_URL=file:/absolute/path/to/build-only.db node --env-file=.env --import tsx node_modules/payload/bin.js generate:types
NODE_ENV=production DATABASE_URL=file:/absolute/path/to/build-only.db node --env-file=.env node_modules/next/dist/bin/next build
test -s .next/BUILD_ID
```

Environment override must win over `.env`; runtime `.env` remains live DB. Do not put `--env-file` into `NODE_OPTIONS`: build workers may reject it. Verify exit status and BUILD_ID. Do not seed to fix a build.

Review pending migrations, rehearse exact migrations on a disposable backup, inspect counts/locale status, then apply only approved pending migrations to live with a fresh backup. No development schema push on production. JSON section additions often need no SQL migration; new collections/globals do. Any content update must target exact records and preserve unrelated fields/locale drafts.

Test candidate on a separate loopback port using isolated DB and matching candidate origin. Never run a second candidate writer against the live SQLite DB.

## 9. Permissions, switch and health

Nginx must traverse/read `.next/static`, `public/assets`, and public `uploads/media`. Build umask is `022`, backup umask `077`. Fix permissions only for intended public paths; no recursive `chmod 777`, no world-readable `.env`, databases or form uploads, no `/uploads` blanket alias.

Preserve old unit/drop-ins/Nginx config. Update **both** systemd `WorkingDirectory` and `EnvironmentFile`, and **all** Nginx static aliases to the new release. Keep media pointing at preserved data.

```bash
sudo nginx -t
sudo systemctl daemon-reload
sudo systemctl restart startime-cms.service
systemctl is-active startime-cms.service
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3100/
sudo systemctl reload nginx
```

A restart may cause a brief interruption; this is not a zero-downtime claim. If activation fails, roll back promptly.

## 10. Acceptance checklist

- Service active and actual working directory correct.
- All main EN/AR pages, current News slug, admin, robots and sitemap answer correctly.
- Nonexistent URL produces actual 404; old/Arabic/encoded slugs redirect to related pages and preserve query parameters.
- News detail uses `/news/<slug>`; Articles `/insights/<slug>`; Arabic `/ar` prefixed. Canonical/sitemap agree.
- Hashed CSS/JS, public asset, CMS photo and video range load (200 or correct 206). HTML 200 alone is insufficient.
- CMS login authenticated: `/me` must return a real user, not just HTTP 200. Page editors/globals load; representative content/counts match backup.
- Affected desktop/mobile/RTL/Safari layouts and sliders work; application console has no errors.
- Authorized labeled form test stores correct submission/attribution/attachment and goes to intended recipient (jobs: configured careers recipient). Verify inbox receipt separately; use isolated tests for rate limits/honeypots.
- GTM configuration `GTM-5QZVMGXV` remains where intended, no duplicate container; Tag Assistant/dataLayer and provider receipt checked. A loaded script is not conversion proof.
- EN/AR SEO title/description, hreflang, schemas, canonical, robots and sitemap coherent.
- D&B seal configured and provider response inspected. Preserve approved footer visibility; provider outage is not a code deployment requirement.

Record exact results, revision and limitations. Do not claim SMTP/provider delivery from code inspection. Do not delete content, overwrite DB or expose private files to pass a check.

## 11. Code/config rollback

Restore previous unit/drop-ins and Nginx paths/aliases, `nginx -t`, daemon-reload, restart app, reload Nginx. Check loopback/public pages, hashed assets and authenticated CMS. Keep latest DB/uploads/submissions untouched.

Migration compatibility must be evaluated; do not blindly migration-down or restore DB. Data restore is a separate approved operation with a declared recovery point/loss window. Keep the previous release until retention policy permits removal.

## 12. Data disaster recovery

1. Stop and agree on exact recovery package, revision, loss window and responsible operator.
2. Take a fresh rescue backup of current state, then pause writes/stop service.
3. Verify `SHA256SUMS`, `BACKUP_FORMAT`, source revision and archive listing before extraction.
4. Restore to **new** private recovery DB and upload directories, not over originals. For format 2:

```bash
mkdir /secure/recovery/restored-uploads
gzip -dc /secure/recovery/PACKAGE/startime.db.gz > /secure/recovery/restored.db
sqlite3 /secure/recovery/restored.db 'PRAGMA integrity_check;'
tar -xzf /secure/recovery/PACKAGE/uploads.tar.gz -C /secure/recovery/restored-uploads
```

5. Confirm integrity `ok`, records/locales and media completeness. Reconcile post-backup edits/submissions before deciding to activate.
6. Restore matching approved code and required secrets privately. Switch env/database/upload paths to recovered state, correct service-account permissions and Nginx media alias. Do not regenerate production signing secrets or copy old WAL files over restored DB.
7. Start service, run full acceptance checks and document recovery point. Keep original state recoverable until sign-off.

## 13. Maintenance

Before each release: verified DB/media/env/config backup and previous revision. Daily: scheduled private backup and monitoring, configured by operations. Weekly: disk/backup availability review. Periodically: restore into an isolated environment and verify CMS/EN/AR/media, then expire test data securely. A backup that has never been restored is not sufficient recovery evidence.
