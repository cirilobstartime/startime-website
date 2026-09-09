import type {
  MigrateDownArgs,
  MigrateUpArgs,
} from "@payloadcms/db-sqlite";
import { sql } from "@payloadcms/db-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`maintenance_settings\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`enabled\` integer DEFAULT false,
    \`show_contact_link\` integer DEFAULT true,
    \`logo_id\` integer,
    \`background_media_id\` integer,
    \`mobile_background_media_id\` integer,
    \`overlay_opacity\` numeric DEFAULT 72,
    \`updated_at\` text,
    \`created_at\` text,
    FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`background_media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`mobile_background_media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );`);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`maintenance_settings_logo_idx\` ON \`maintenance_settings\` (\`logo_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`maintenance_settings_background_media_idx\` ON \`maintenance_settings\` (\`background_media_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`maintenance_settings_mobile_background_media_idx\` ON \`maintenance_settings\` (\`mobile_background_media_id\`);`,
  );
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`maintenance_settings_locales\` (
    \`eyebrow\` text DEFAULT 'Under development',
    \`heading\` text DEFAULT 'We’re preparing something exceptional.' NOT NULL,
    \`message\` text DEFAULT 'Our website is receiving a carefully planned update. We’ll be back shortly with an improved Startime experience.' NOT NULL,
    \`status_label\` text DEFAULT 'A new experience is taking shape',
    \`contact_label\` text DEFAULT 'Contact Startime',
    \`contact_href\` text DEFAULT 'mailto:info@startime.sa',
    \`meta_title\` text DEFAULT 'Website under development | Startime',
    \`meta_description\` text DEFAULT 'Startime is preparing an improved digital experience. Please check back shortly.',
    \`id\` integer PRIMARY KEY NOT NULL,
    \`_locale\` text NOT NULL,
    \`_parent_id\` integer NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`maintenance_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(
    sql`CREATE UNIQUE INDEX IF NOT EXISTS \`maintenance_settings_locales_locale_parent_id_unique\` ON \`maintenance_settings_locales\` (\`_locale\`, \`_parent_id\`);`,
  );
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`maintenance_settings_locales\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`maintenance_settings\`;`);
}
