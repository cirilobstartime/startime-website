import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`insight_tags\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`internal_title\` text,
  	\`content_type\` text DEFAULT 'news',
  	\`slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`insight_tags_slug_idx\` ON \`insight_tags\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`insight_tags_updated_at_idx\` ON \`insight_tags\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`insight_tags_created_at_idx\` ON \`insight_tags\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`insight_tags_locales\` (
  	\`title\` text,
  	\`visible\` integer DEFAULT true,
  	\`_status\` text DEFAULT 'draft',
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`insight_tags\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`insight_tags__status_idx\` ON \`insight_tags_locales\` (\`_status\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`insight_tags_locales_locale_parent_id_unique\` ON \`insight_tags_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_insight_tags_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_internal_title\` text,
  	\`version_content_type\` text DEFAULT 'news',
  	\`version_slug\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`insight_tags\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_insight_tags_v_parent_idx\` ON \`_insight_tags_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_insight_tags_v_version_version_slug_idx\` ON \`_insight_tags_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_insight_tags_v_version_version_updated_at_idx\` ON \`_insight_tags_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_insight_tags_v_version_version_created_at_idx\` ON \`_insight_tags_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_insight_tags_v_created_at_idx\` ON \`_insight_tags_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_insight_tags_v_updated_at_idx\` ON \`_insight_tags_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_insight_tags_v_snapshot_idx\` ON \`_insight_tags_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_insight_tags_v_published_locale_idx\` ON \`_insight_tags_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_insight_tags_v_latest_idx\` ON \`_insight_tags_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_insight_tags_v_autosave_idx\` ON \`_insight_tags_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_insight_tags_v_locales\` (
  	\`version_title\` text,
  	\`version_visible\` integer DEFAULT true,
  	\`version__status\` text DEFAULT 'draft',
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_insight_tags_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_insight_tags_v_version_version__status_idx\` ON \`_insight_tags_v_locales\` (\`version__status\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`_insight_tags_v_locales_locale_parent_id_unique\` ON \`_insight_tags_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`insights_posts_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`insight_tags_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`insights_posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`insight_tags_id\`) REFERENCES \`insight_tags\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`insights_posts_rels_order_idx\` ON \`insights_posts_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`insights_posts_rels_parent_idx\` ON \`insights_posts_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`insights_posts_rels_path_idx\` ON \`insights_posts_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`insights_posts_rels_insight_tags_id_idx\` ON \`insights_posts_rels\` (\`insight_tags_id\`);`)
  await db.run(sql`CREATE TABLE \`_insights_posts_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`insight_tags_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_insights_posts_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`insight_tags_id\`) REFERENCES \`insight_tags\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_insights_posts_v_rels_order_idx\` ON \`_insights_posts_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_insights_posts_v_rels_parent_idx\` ON \`_insights_posts_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_insights_posts_v_rels_path_idx\` ON \`_insights_posts_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_insights_posts_v_rels_insight_tags_id_idx\` ON \`_insights_posts_v_rels\` (\`insight_tags_id\`);`)
  await db.run(sql`ALTER TABLE \`insight_categories\` ADD \`content_type\` text DEFAULT 'news';`)
  await db.run(sql`ALTER TABLE \`_insight_categories_v\` ADD \`version_content_type\` text DEFAULT 'news';`)
  // Preserve existing article classifications before the new type-filtered editors go live.
  await db.run(sql`UPDATE \`insight_categories\` SET \`content_type\` = 'article' WHERE \`id\` IN (SELECT \`category_id\` FROM \`insights_posts\` WHERE \`post_type\` IN ('article', 'insight'));`)
  await db.run(sql`UPDATE \`_insight_categories_v\` SET \`version_content_type\` = 'article' WHERE \`parent_id\` IN (SELECT \`id\` FROM \`insight_categories\` WHERE \`content_type\` = 'article');`)
  await db.run(sql`UPDATE \`insights_posts\` SET \`post_type\` = 'news' WHERE \`post_type\` = 'update';`)
  await db.run(sql`UPDATE \`insights_posts\` SET \`post_type\` = 'article' WHERE \`post_type\` = 'insight';`)
  await db.run(sql`UPDATE \`_insights_posts_v\` SET \`version_post_type\` = 'news' WHERE \`version_post_type\` = 'update';`)
  await db.run(sql`UPDATE \`_insights_posts_v\` SET \`version_post_type\` = 'article' WHERE \`version_post_type\` = 'insight';`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`insight_tags_id\` integer REFERENCES insight_tags(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_insight_tags_id_idx\` ON \`payload_locked_documents_rels\` (\`insight_tags_id\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`insights_posts_rels\`;`)
  await db.run(sql`DROP TABLE \`_insights_posts_v_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`cms_users_id\` integer,
  	\`pages_id\` integer,
  	\`projects_id\` integer,
  	\`media_id\` integer,
  	\`forms_id\` integer,
  	\`form_submissions_id\` integer,
  	\`form_uploads_id\` integer,
  	\`form_attempts_id\` integer,
  	\`insight_categories_id\` integer,
  	\`insights_posts_id\` integer,
  	\`job_categories_id\` integer,
  	\`job_tags_id\` integer,
  	\`jobs_id\` integer,
  	\`redirects_id\` integer,
  	\`external_link_rules_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`cms_users_id\`) REFERENCES \`cms_users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`projects_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`forms_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`form_submissions_id\`) REFERENCES \`form_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`form_uploads_id\`) REFERENCES \`form_uploads\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`form_attempts_id\`) REFERENCES \`form_attempts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`insight_categories_id\`) REFERENCES \`insight_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`insights_posts_id\`) REFERENCES \`insights_posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`job_categories_id\`) REFERENCES \`job_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`job_tags_id\`) REFERENCES \`job_tags\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`jobs_id\`) REFERENCES \`jobs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`redirects_id\`) REFERENCES \`redirects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`external_link_rules_id\`) REFERENCES \`external_link_rules\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "cms_users_id", "pages_id", "projects_id", "media_id", "forms_id", "form_submissions_id", "form_uploads_id", "form_attempts_id", "insight_categories_id", "insights_posts_id", "job_categories_id", "job_tags_id", "jobs_id", "redirects_id", "external_link_rules_id") SELECT "id", "order", "parent_id", "path", "cms_users_id", "pages_id", "projects_id", "media_id", "forms_id", "form_submissions_id", "form_uploads_id", "form_attempts_id", "insight_categories_id", "insights_posts_id", "job_categories_id", "job_tags_id", "jobs_id", "redirects_id", "external_link_rules_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_cms_users_id_idx\` ON \`payload_locked_documents_rels\` (\`cms_users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_projects_id_idx\` ON \`payload_locked_documents_rels\` (\`projects_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_forms_id_idx\` ON \`payload_locked_documents_rels\` (\`forms_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_form_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`form_submissions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_form_uploads_id_idx\` ON \`payload_locked_documents_rels\` (\`form_uploads_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_form_attempts_id_idx\` ON \`payload_locked_documents_rels\` (\`form_attempts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_insight_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`insight_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_insights_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`insights_posts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_job_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`job_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_job_tags_id_idx\` ON \`payload_locked_documents_rels\` (\`job_tags_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_jobs_id_idx\` ON \`payload_locked_documents_rels\` (\`jobs_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_redirects_id_idx\` ON \`payload_locked_documents_rels\` (\`redirects_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_external_link_rules_id_idx\` ON \`payload_locked_documents_rels\` (\`external_link_rules_id\`);`)
  await db.run(sql`ALTER TABLE \`insight_categories\` DROP COLUMN \`content_type\`;`)
  await db.run(sql`ALTER TABLE \`_insight_categories_v\` DROP COLUMN \`version_content_type\`;`)
  await db.run(sql`DROP TABLE \`insight_tags_locales\`;`)
  await db.run(sql`DROP TABLE \`_insight_tags_v_locales\`;`)
  await db.run(sql`DROP TABLE \`_insight_tags_v\`;`)
  await db.run(sql`DROP TABLE \`insight_tags\`;`)
}
