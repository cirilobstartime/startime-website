# Editable main-page URLs

The main-page identity remains the existing `internalTitle` (`New Site: latest-news`, etc.). Editors can change the localized **Slug** under Page settings without changing the layout, content, sections or record ID. Publish the edit to move the public URL. Draft/autosave changes do not affect the public route. English stays at the root; Arabic stays under `/ar`. Homepage remains `/` or `/ar`.

- Publishing a rename adds an active permanent redirect to the existing **Redirects** collection. It points to the page relationship, not a frozen destination URL: later renames resolve directly to the latest published URL.
- Redirects remain editable and can be made temporary or disabled. Current published URLs take precedence over retired redirects. Query parameters (including UTMs) are retained.
- The public proxy calls the read-only loopback `/api/page-route` resolver before rendering. It issues actual 308/307 responses and rewrites a current CMS slug to its original Next.js layout internally. Never configure Nginx to serve this resolver from a static/cache snapshot. Keep the application's internal loopback port reachable from the Next.js process, as with the existing English rewrite.
- Header/footer and Next links resolve stable main-page addresses through the published route map. Locale switching and metadata use each language's independently published slug. Insights article paths follow a renamed Insights archive, including redirects from its previous archive prefix.
- Links to renamed runtime routes use full document navigation and disable prefetch to avoid Next's client route-tree cache mixing a catch-all alias with a fixed layout. Unchanged routes retain ordinary Next navigation. Modifier-key/new-tab behavior is preserved.
- Canonical URL is an optional SEO override, not a route setting. Leave blank for automatic current-route canonicals. An intentional custom canonical is preserved.
- Validation rejects invalid path syntax, duplicate current/draft slugs, another main page's fixed layout key, infrastructure paths and design-preview routes.

## Release

Deploy code only after approval, backing up the production database/uploads/environment/Nginx first. Do not import a local database or replace uploads. Run the registered additive `20261005_190000_page_slug_redirects` migration against the live database: it adds **missing** redirects from original layout URLs where slugs were already changed before this feature existed (e.g. `/latest-news` → the published `/news`). Existing redirects, including disabled ones, are left untouched. No page content or saved slug is changed by this migration.

Verify both languages: current URL 200; old URL 308 with preserved query; published content unchanged; locale links; navigation/CTAs; canonical/hreflang/schema; sitemap; hidden page 404; disabled redirect 404; draft-only rename does not move public URL; subsequent publish creates the previous live URL redirect.
