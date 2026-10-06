import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-sqlite";
import { sql } from "@payloadcms/db-sqlite";

// Additive Careers schema only; never recreate existing site tables.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`job_categories\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`internal_title\` text,
  	\`slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`job_categories_slug_idx\` ON \`job_categories\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`job_categories_updated_at_idx\` ON \`job_categories\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`job_categories_created_at_idx\` ON \`job_categories\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`job_categories_locales\` (
  	\`title\` text,
  	\`visible\` integer DEFAULT true,
  	\`_status\` text DEFAULT 'draft',
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`job_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`job_categories__status_idx\` ON \`job_categories_locales\` (\`_status\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`job_categories_locales_locale_parent_id_unique\` ON \`job_categories_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_job_categories_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_internal_title\` text,
  	\`version_slug\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`job_categories\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_job_categories_v_parent_idx\` ON \`_job_categories_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_job_categories_v_version_version_slug_idx\` ON \`_job_categories_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_job_categories_v_version_version_updated_at_idx\` ON \`_job_categories_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_job_categories_v_version_version_created_at_idx\` ON \`_job_categories_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_job_categories_v_created_at_idx\` ON \`_job_categories_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_job_categories_v_updated_at_idx\` ON \`_job_categories_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_job_categories_v_snapshot_idx\` ON \`_job_categories_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_job_categories_v_published_locale_idx\` ON \`_job_categories_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_job_categories_v_latest_idx\` ON \`_job_categories_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_job_categories_v_autosave_idx\` ON \`_job_categories_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_job_categories_v_locales\` (
  	\`version_title\` text,
  	\`version_visible\` integer DEFAULT true,
  	\`version__status\` text DEFAULT 'draft',
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_job_categories_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_job_categories_v_version_version__status_idx\` ON \`_job_categories_v_locales\` (\`version__status\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`_job_categories_v_locales_locale_parent_id_unique\` ON \`_job_categories_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`job_tags\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`internal_title\` text,
  	\`slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`job_tags_slug_idx\` ON \`job_tags\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`job_tags_updated_at_idx\` ON \`job_tags\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`job_tags_created_at_idx\` ON \`job_tags\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`job_tags_locales\` (
  	\`title\` text,
  	\`visible\` integer DEFAULT true,
  	\`_status\` text DEFAULT 'draft',
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`job_tags\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`job_tags__status_idx\` ON \`job_tags_locales\` (\`_status\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`job_tags_locales_locale_parent_id_unique\` ON \`job_tags_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_job_tags_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_internal_title\` text,
  	\`version_slug\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`job_tags\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_job_tags_v_parent_idx\` ON \`_job_tags_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_job_tags_v_version_version_slug_idx\` ON \`_job_tags_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_job_tags_v_version_version_updated_at_idx\` ON \`_job_tags_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_job_tags_v_version_version_created_at_idx\` ON \`_job_tags_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_job_tags_v_created_at_idx\` ON \`_job_tags_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_job_tags_v_updated_at_idx\` ON \`_job_tags_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_job_tags_v_snapshot_idx\` ON \`_job_tags_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_job_tags_v_published_locale_idx\` ON \`_job_tags_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_job_tags_v_latest_idx\` ON \`_job_tags_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_job_tags_v_autosave_idx\` ON \`_job_tags_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_job_tags_v_locales\` (
  	\`version_title\` text,
  	\`version_visible\` integer DEFAULT true,
  	\`version__status\` text DEFAULT 'draft',
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_job_tags_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_job_tags_v_version_version__status_idx\` ON \`_job_tags_v_locales\` (\`version__status\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`_job_tags_v_locales_locale_parent_id_unique\` ON \`_job_tags_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`jobs_responsibilities\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`jobs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`jobs_responsibilities_order_idx\` ON \`jobs_responsibilities\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`jobs_responsibilities_parent_id_idx\` ON \`jobs_responsibilities\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`jobs_responsibilities_locale_idx\` ON \`jobs_responsibilities\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`jobs_requirements\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`jobs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`jobs_requirements_order_idx\` ON \`jobs_requirements\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`jobs_requirements_parent_id_idx\` ON \`jobs_requirements\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`jobs_requirements_locale_idx\` ON \`jobs_requirements\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`jobs\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`internal_title\` text,
  	\`slug\` text,
  	\`job_type\` text DEFAULT 'full-time',
  	\`category_id\` integer,
  	\`published_at\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`category_id\`) REFERENCES \`job_categories\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`jobs_slug_idx\` ON \`jobs\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`jobs_category_idx\` ON \`jobs\` (\`category_id\`);`)
  await db.run(sql`CREATE INDEX \`jobs_updated_at_idx\` ON \`jobs\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`jobs_created_at_idx\` ON \`jobs\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`jobs_locales\` (
  	\`title\` text,
  	\`detail_title\` text,
  	\`summary\` text,
  	\`overview\` text,
  	\`location\` text,
  	\`job_type_label\` text,
  	\`open\` integer DEFAULT true,
  	\`visible\` integer DEFAULT true,
  	\`_status\` text DEFAULT 'draft',
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`jobs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`jobs__status_idx\` ON \`jobs_locales\` (\`_status\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`jobs_locales_locale_parent_id_unique\` ON \`jobs_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`jobs_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`job_tags_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`jobs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`job_tags_id\`) REFERENCES \`job_tags\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`jobs_rels_order_idx\` ON \`jobs_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`jobs_rels_parent_idx\` ON \`jobs_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`jobs_rels_path_idx\` ON \`jobs_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`jobs_rels_job_tags_id_idx\` ON \`jobs_rels\` (\`job_tags_id\`);`)
  await db.run(sql`CREATE TABLE \`_jobs_v_version_responsibilities\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_jobs_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_jobs_v_version_responsibilities_order_idx\` ON \`_jobs_v_version_responsibilities\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_jobs_v_version_responsibilities_parent_id_idx\` ON \`_jobs_v_version_responsibilities\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_jobs_v_version_responsibilities_locale_idx\` ON \`_jobs_v_version_responsibilities\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_jobs_v_version_requirements\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_jobs_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_jobs_v_version_requirements_order_idx\` ON \`_jobs_v_version_requirements\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_jobs_v_version_requirements_parent_id_idx\` ON \`_jobs_v_version_requirements\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_jobs_v_version_requirements_locale_idx\` ON \`_jobs_v_version_requirements\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_jobs_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_internal_title\` text,
  	\`version_slug\` text,
  	\`version_job_type\` text DEFAULT 'full-time',
  	\`version_category_id\` integer,
  	\`version_published_at\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`jobs\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_category_id\`) REFERENCES \`job_categories\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_jobs_v_parent_idx\` ON \`_jobs_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_jobs_v_version_version_slug_idx\` ON \`_jobs_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_jobs_v_version_version_category_idx\` ON \`_jobs_v\` (\`version_category_id\`);`)
  await db.run(sql`CREATE INDEX \`_jobs_v_version_version_updated_at_idx\` ON \`_jobs_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_jobs_v_version_version_created_at_idx\` ON \`_jobs_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_jobs_v_created_at_idx\` ON \`_jobs_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_jobs_v_updated_at_idx\` ON \`_jobs_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_jobs_v_snapshot_idx\` ON \`_jobs_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_jobs_v_published_locale_idx\` ON \`_jobs_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_jobs_v_latest_idx\` ON \`_jobs_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_jobs_v_autosave_idx\` ON \`_jobs_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_jobs_v_locales\` (
  	\`version_title\` text,
  	\`version_detail_title\` text,
  	\`version_summary\` text,
  	\`version_overview\` text,
  	\`version_location\` text,
  	\`version_job_type_label\` text,
  	\`version_open\` integer DEFAULT true,
  	\`version_visible\` integer DEFAULT true,
  	\`version__status\` text DEFAULT 'draft',
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_jobs_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_jobs_v_version_version__status_idx\` ON \`_jobs_v_locales\` (\`version__status\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`_jobs_v_locales_locale_parent_id_unique\` ON \`_jobs_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_jobs_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`job_tags_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_jobs_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`job_tags_id\`) REFERENCES \`job_tags\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_jobs_v_rels_order_idx\` ON \`_jobs_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_jobs_v_rels_parent_idx\` ON \`_jobs_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_jobs_v_rels_path_idx\` ON \`_jobs_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_jobs_v_rels_job_tags_id_idx\` ON \`_jobs_v_rels\` (\`job_tags_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`job_categories_id\` integer REFERENCES job_categories(id);`);
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`job_tags_id\` integer REFERENCES job_tags(id);`);
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`jobs_id\` integer REFERENCES jobs(id);`);
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_job_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`job_categories_id\`);`);
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_job_tags_id_idx\` ON \`payload_locked_documents_rels\` (\`job_tags_id\`);`);
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_jobs_id_idx\` ON \`payload_locked_documents_rels\` (\`jobs_id\`);`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Shared locked-document columns remain on rollback to avoid rebuilding live data.
  for (const name of ["_jobs_v_rels", "_jobs_v_locales", "_jobs_v_version_requirements", "_jobs_v_version_responsibilities", "_jobs_v", "jobs_rels", "jobs_locales", "jobs_requirements", "jobs_responsibilities", "jobs", "_job_tags_v_locales", "_job_tags_v", "job_tags_locales", "job_tags", "_job_categories_v_locales", "_job_categories_v", "job_categories_locales", "job_categories"]) {
    await db.run(sql.raw(`DROP TABLE IF EXISTS ${name}`));
  }
}
