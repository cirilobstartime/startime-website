import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-sqlite";
import { sql } from "@payloadcms/db-sqlite";

/** Localized archive ordering; all other homepage controls live inside the localized sections JSON. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`pages_locales\` ADD COLUMN \`archive_sort_mode\` text DEFAULT 'latest';`);
  await db.run(sql`ALTER TABLE \`_pages_v_locales\` ADD COLUMN \`version_archive_sort_mode\` text DEFAULT 'latest';`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`_pages_v_locales\` DROP COLUMN \`version_archive_sort_mode\`;`);
  await db.run(sql`ALTER TABLE \`pages_locales\` DROP COLUMN \`archive_sort_mode\`;`);
}
