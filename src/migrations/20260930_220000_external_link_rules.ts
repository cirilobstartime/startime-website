import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-sqlite";
import { sql } from "@payloadcms/db-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`external_link_rules\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`placement\` text NOT NULL,
    \`href\` text NOT NULL,
    \`page_path\` text NOT NULL,
    \`section\` text NOT NULL,
    \`label\` text,
    \`status\` text DEFAULT 'nofollow' NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );`);
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`external_link_rules_placement_idx\` ON \`external_link_rules\` (\`placement\`);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`external_link_rules_updated_at_idx\` ON \`external_link_rules\` (\`updated_at\`);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`external_link_rules_created_at_idx\` ON \`external_link_rules\` (\`created_at\`);`);
  const columns = await db.all<{ name: string }>(sql`PRAGMA table_info(\`payload_locked_documents_rels\`);`);
  if (!columns.some((column) => column.name === "external_link_rules_id")) {
    await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`external_link_rules_id\` integer REFERENCES external_link_rules(id);`);
  }
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_external_link_rules_id_idx\` ON \`payload_locked_documents_rels\` (\`external_link_rules_id\`);`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`external_link_rules\`;`);
}
