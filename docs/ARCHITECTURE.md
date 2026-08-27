# Architecture

## Application boundary

The public website and Payload CMS are delivered as one Next.js application:

- Public routes are rendered through the App Router.
- Payload REST endpoints are mounted under `/api`.
- Payload Content Studio is mounted at `/content-admin`.
- Nginx terminates TLS and proxies requests to the local Next.js process.
- systemd keeps the application process running and restarts it after a failure.

## Data and media

- Payload uses SQLite in WAL mode.
- The production database is stateful and must not be replaced during a code deployment.
- User-uploaded media is stateful and must be backed up separately from Git.
- Raw production databases and form uploads are not source artifacts and must not be committed to Git.
- Clean development environments use the source-controlled bilingual seed. Exact production recovery uses a matching database-and-uploads archive held in private encrypted backup storage.
- Source-controlled media in `public/assets` is part of the application release.
- Uploaded raster images are processed through Sharp. SVG source files remain SVG.

## Localization

- English and Arabic content are independently editable and publishable.
- The complete page sections collection is localized, preventing an edit in one language from replacing the other language's section structure.
- Arabic uses RTL layout and locale-specific content queries do not fall back to English.

## Access control

- Public reads are limited to the content surfaces intended for the website.
- Authenticated administrators and editors can manage website content collections and globals.
- CMS user and role management remains administrator-only.
- Form submissions and uploaded form attachments are private CMS records.
- Anonymous create, update, and delete operations are denied on managed content.

## Marketing and attribution

- Marketing identifiers and verification settings are managed in Payload globals.
- Campaign attribution is captured first-party and included with qualified form conversions.
- Data-layer events are emitted by the application; tag execution remains controlled through the configured tag manager.

## Caching

- Next.js immutable build assets use long-lived caching.
- Public media uses a seven-day browser cache with stale-while-revalidate.
- CMS and API responses containing mutable or private data use `private, no-store`.
