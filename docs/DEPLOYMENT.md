# Deployment

Follow [the complete release guide](CHANGE-AND-RELEASE-GUIDE.md) in order. It covers full-source releases, binary-safe patches, migrations, configuration/DB/upload backups, activation, acceptance tests and rollback.

Production convention: `startime-cms.service`, loopback port 3100, Nginx and `/var/www/startime-cms/releases`. Discover actual paths rather than assuming historical release names. English is `/`, Arabic `/ar`; current page URLs can vary through CMS slug settings.

Deploy only reviewed immutable revisions into a new directory. Preserve the absolute live DB and upload paths, production environment and signing secrets. Build against an isolated DB backup. Do not import the company content snapshot on production. Switch both systemd paths and Nginx static aliases together; HTML 200 does not prove CSS/JS loads.

Rollback should restore code/configuration while retaining latest CMS edits and submissions. Database restoration requires a separate approved loss window and recovery plan.

The October 7 handoff branch contains pending locally verified work. Its publication does not constitute server deployment or release approval.
