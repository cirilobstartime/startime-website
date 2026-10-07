import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-sqlite";
import { sql } from "@payloadcms/db-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`marketing_settings\` ADD COLUMN \`show_consent_notice\` integer DEFAULT false;`);
  await db.run(sql`ALTER TABLE \`_marketing_settings_v\` ADD COLUMN \`version_show_consent_notice\` integer DEFAULT false;`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`_marketing_settings_v\` DROP COLUMN \`version_show_consent_notice\`;`);
  await db.run(sql`ALTER TABLE \`marketing_settings\` DROP COLUMN \`show_consent_notice\`;`);
}
