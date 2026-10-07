import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-sqlite";
import { sql } from "@payloadcms/db-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`footer_settings\` ADD COLUMN \`duns_seal_u_r_l\` text DEFAULT 'https://dunsregistered.dnb.com/SealAuthentication.aspx?Cid=1';`);
  await db.run(sql`ALTER TABLE \`_footer_settings_v\` ADD COLUMN \`version_duns_seal_u_r_l\` text DEFAULT 'https://dunsregistered.dnb.com/SealAuthentication.aspx?Cid=1';`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`_footer_settings_v\` DROP COLUMN \`version_duns_seal_u_r_l\`;`);
  await db.run(sql`ALTER TABLE \`footer_settings\` DROP COLUMN \`duns_seal_u_r_l\`;`);
}
