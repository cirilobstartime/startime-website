#!/usr/bin/env bash
set -euo pipefail

project_dir="${PROJECT_DIR:-$(pwd)}"
backup_root="${1:-/var/backups/startime}"
database_path="${DATABASE_PATH:-$project_dir/startime.db}"
uploads_path="${UPLOADS_PATH:-$project_dir/uploads}"
stamp=$(date +%Y%m%d-%H%M%S)
recovery_dir="$backup_root/recovery-$stamp"

if [[ ! -f "$database_path" ]]; then
  echo "Production database not found: $database_path" >&2
  exit 1
fi

if [[ ! -d "$uploads_path" ]]; then
  echo "Uploads directory not found: $uploads_path" >&2
  exit 1
fi

if [[ "$database_path" == *"'"* || "$recovery_dir" == *"'"* ]]; then
  echo "Database and recovery paths cannot contain single quotes." >&2
  exit 1
fi

if [[ ! -d "$project_dir/node_modules/@libsql/client" ]]; then
  echo "The installed @libsql/client runtime is required. Run npm ci first." >&2
  exit 1
fi

umask 077
mkdir -p "$recovery_dir"
chmod 700 "$recovery_dir"

node --input-type=module - "$database_path" "$recovery_dir/startime.db" <<'NODE'
import { createClient } from "@libsql/client";

const [, , sourcePath, outputPath] = process.argv;
const escapedOutput = outputPath.replaceAll("'", "''");
const source = createClient({ url: `file:${sourcePath}` });
await source.execute(`VACUUM INTO '${escapedOutput}'`);
source.close();

const backup = createClient({ url: `file:${outputPath}` });
const result = await backup.execute("PRAGMA integrity_check");
backup.close();

if (result.rows[0]?.integrity_check !== "ok") {
  throw new Error(`Backup integrity check failed: ${JSON.stringify(result.rows)}`);
}
NODE

gzip -9 -c "$recovery_dir/startime.db" > "$recovery_dir/startime.db.gz"
rm "$recovery_dir/startime.db"
tar -czf "$recovery_dir/uploads.tar.gz" -C "$(dirname "$uploads_path")" "$(basename "$uploads_path")"

git -C "$project_dir" rev-parse HEAD > "$recovery_dir/SOURCE_COMMIT"
(
  cd "$recovery_dir"
  sha256sum startime.db.gz uploads.tar.gz > SHA256SUMS
  sha256sum -c SHA256SUMS
)

chmod 600 "$recovery_dir"/*
echo "Verified production recovery archive: $recovery_dir"
