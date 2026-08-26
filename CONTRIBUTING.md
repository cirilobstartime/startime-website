# Contributing

## Branches

Create a short-lived branch from the latest approved production branch. Use clear names such as `feature/cms-field`, `fix/mobile-menu`, or `chore/dependencies`.

## Before opening a pull request

```bash
npm ci
npm run lint
npm run typecheck
npm run build
```

Confirm that:

- English and Arabic routes render correctly.
- CMS-managed content remains editable in both locales.
- Existing database content and uploads are not replaced by seed scripts.
- Forms, redirects, SEO metadata, analytics hooks, and consent behavior still work.
- No `.env`, database, upload, credential, key, backup, or local test artifact is staged.

Inspect the final change set before committing:

```bash
git status --short
git diff --check
git diff --cached
```

## Release rule

Only approved changes that are ready for production belong on the company repository's production branch. Local experiments and unapproved previews must stay on local or internal branches.

## Content synchronization scripts

Scripts under `scripts/` can intentionally modify CMS data. Do not run `seed` or any `sync:*` command on production unless the release specifically requires that data change and a current database backup exists.
