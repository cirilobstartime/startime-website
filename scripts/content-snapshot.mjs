#!/usr/bin/env node
// Portable content handoff. Never export accounts, submissions, sessions or history.
import { DatabaseSync } from 'node:sqlite';
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const roots = ['pages', 'projects', 'media', 'forms', 'insight_categories', 'insight_tags',
  'insights_posts', 'job_categories', 'job_tags', 'jobs', 'redirects', 'external_link_rules',
  'header_settings', 'footer_settings', 'global_seo', 'site_settings', 'maintenance_settings',
  'marketing_settings', 'icon_settings', 'design_settings'];
const permitted = name => roots.some(root => name === root || name.startsWith(`${root}_`));
const quoted = name => `"${name.replaceAll('"', '""')}"`;
const checksum = file => createHash('sha256').update(readFileSync(file)).digest('hex');
const [mode, databaseArg, directoryArg] = process.argv.slice(2);
if (!['export', 'import'].includes(mode) || !databaseArg || !directoryArg) {
  throw new Error('Usage: node scripts/content-snapshot.mjs export|import DATABASE SNAPSHOT_DIRECTORY');
}
const database = path.resolve(databaseArg);
const directory = path.resolve(directoryArg);
const snapshotFile = path.join(directory, 'content.json');
const mediaRoot = path.resolve('uploads/media');

if (mode === 'export') {
  if (!existsSync(database)) throw new Error('Source database does not exist');
  if (existsSync(snapshotFile)) throw new Error('Snapshot already exists; choose a new directory');
  const db = new DatabaseSync(database, { readOnly: true });
  db.exec('BEGIN'); // A consistent read transaction, including WAL changes.
  const schema = db.prepare("SELECT type,name,sql FROM sqlite_master WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%' ORDER BY CASE type WHEN 'table' THEN 0 ELSE 1 END,name").all();
  const tables = {};
  for (const entry of schema.filter(entry => entry.type === 'table' && permitted(entry.name))) {
    tables[entry.name] = db.prepare(`SELECT * FROM ${quoted(entry.name)}`).all();
  }
  // Internal asset sourcing notes are not needed by the company handoff.
  for (const media of tables.media || []) {
    media.usage_notes = null;
    for (const key of Object.keys(media).filter(key => key === 'url' || key.endsWith('_url') || key === 'thumbnail_u_r_l')) {
      if (typeof media[key] === 'string') media[key] = media[key].replace(/^https?:\/\/[^/]+(?=\/api\/media\/file\/)/, '');
    }
  }
  const filenames = [...new Set((tables.media || []).flatMap(row =>
    Object.entries(row).filter(([key, value]) => (key === 'filename' || key.endsWith('_filename')) && value).map(([, value]) => value)))].sort();
  const files = filenames.map(filename => {
    if (path.basename(filename) !== filename) throw new Error(`Unsafe media filename: ${filename}`);
    const source = path.join(mediaRoot, filename);
    if (!existsSync(source) || !realpathSync(source).startsWith(`${realpathSync(mediaRoot)}${path.sep}`)) throw new Error(`Missing or unsafe public media: ${filename}`);
    return { filename, sha256: checksum(source) };
  });
  db.exec('COMMIT');
  db.close();
  mkdirSync(path.join(directory, 'media'), { recursive: true });
  for (const file of files) copyFileSync(path.join(mediaRoot, file.filename), path.join(directory, 'media', file.filename));
  const snapshot = { format: 1, capturedAt: new Date().toISOString(), scope: 'Current local CMS content and public media; not a production backup. No version history, users, submissions, private uploads or credentials.', schema, tables, files };
  writeFileSync(snapshotFile, `${JSON.stringify(snapshot, null, 2)}\n`);
  writeFileSync(path.join(directory, 'content.sha256'), `${checksum(snapshotFile)}  content.json\n`);
  console.log(`Exported ${Object.keys(tables).length} content tables and ${files.length} public media files to ${directory}`);
} else {
  if (process.env.CONTENT_BOOTSTRAP_CONFIRM !== 'empty-local-only' || process.env.NODE_ENV === 'production') throw new Error('Import is only allowed for an empty local development database');
  if (existsSync(database)) throw new Error('Refusing to overwrite an existing database');
  const expected = readFileSync(path.join(directory, 'content.sha256'), 'utf8').split(/\s/)[0];
  if (checksum(snapshotFile) !== expected) throw new Error('Content checksum mismatch');
  const snapshot = JSON.parse(readFileSync(snapshotFile, 'utf8'));
  if (snapshot.format !== 1 || Object.keys(snapshot.tables).some(name => !permitted(name))) throw new Error('Unsupported or private snapshot data');
  for (const file of snapshot.files) {
    if (path.basename(file.filename) !== file.filename || checksum(path.join(directory, 'media', file.filename)) !== file.sha256) throw new Error(`Media checksum mismatch: ${file.filename}`);
    if (existsSync(path.join(mediaRoot, file.filename)) && checksum(path.join(mediaRoot, file.filename)) !== file.sha256) throw new Error(`Existing upload differs: ${file.filename}`);
  }
  mkdirSync(path.dirname(database), { recursive: true });
  const db = new DatabaseSync(database);
  db.exec('PRAGMA foreign_keys=OFF; BEGIN');
  try {
    // Schema includes empty private tables so Payload can start without copying private records.
    for (const entry of snapshot.schema) db.exec(entry.sql);
    for (const [name, rows] of Object.entries(snapshot.tables)) {
      for (const row of rows) {
        const keys = Object.keys(row);
        db.prepare(`INSERT INTO ${quoted(name)} (${keys.map(quoted).join(',')}) VALUES (${keys.map(() => '?').join(',')})`).run(...keys.map(key => row[key]));
      }
    }
    const violations = db.prepare('PRAGMA foreign_key_check').all();
    if (violations.length) throw new Error(`Foreign key validation failed: ${JSON.stringify(violations)}`);
    db.exec('COMMIT');
    if (db.prepare('PRAGMA integrity_check').get().integrity_check !== 'ok') throw new Error('Database integrity check failed');
  } catch (error) {
    try { db.exec('ROLLBACK'); } catch { /* Transaction may already be committed. */ }
    throw error;
  } finally { db.close(); }
  mkdirSync(mediaRoot, { recursive: true });
  for (const file of snapshot.files) copyFileSync(path.join(directory, 'media', file.filename), path.join(mediaRoot, file.filename));
  console.log(`Bootstrapped ${database}. Create a new local administrator. SMTP is not enabled by this import.`);
}
