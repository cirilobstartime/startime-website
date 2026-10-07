#!/usr/bin/env bash
set -euo pipefail

project_dir="${PROJECT_DIR:-$(pwd)}"
backup_root="${1:-/var/backups/startime}"
database_path="${DATABASE_PATH:-$project_dir/startime.db}"
uploads_path="${UPLOADS_PATH:-$project_dir/uploads}"
environment_path="${ENV_PATH:-$project_dir/.env}"
nginx_path="${NGINX_PATH:-}"
unit_path="${SYSTEMD_UNIT_PATH:-}"
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

# Follow the release's uploads symlink; archiving only the link loses the files.
uploads_path=$(node -e 'process.stdout.write(require("node:fs").realpathSync(process.argv[1]))' "$uploads_path")
for config_path in "$nginx_path" "$unit_path"; do
  if [[ -n "$config_path" && ! -f "$config_path" ]]; then
    echo "Requested configuration file is missing: $config_path" >&2
    exit 1
  fi
done

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
tar -czf "$recovery_dir/uploads.tar.gz" -C "$uploads_path" .
if [[ -f "$environment_path" ]]; then cp "$environment_path" "$recovery_dir/environment.private"; fi
if [[ -n "$nginx_path" ]]; then cp "$nginx_path" "$recovery_dir/nginx-site.conf"; fi
if [[ -n "$unit_path" ]]; then cp "$unit_path" "$recovery_dir/systemd-unit.service"; fi

if [[ -n "${SOURCE_REVISION:-}" ]]; then
  printf '%s\n' "$SOURCE_REVISION" > "$recovery_dir/SOURCE_COMMIT"
elif git -C "$project_dir" rev-parse HEAD > "$recovery_dir/SOURCE_COMMIT" 2>/dev/null; then
  :
else
  printf 'unknown: record the active release revision before deployment\n' > "$recovery_dir/SOURCE_COMMIT"
fi
printf '2\n' > "$recovery_dir/BACKUP_FORMAT"
(
  cd "$recovery_dir"
  node --input-type=module - <<'NODE'
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
const files = readdirSync('.').filter(name => name !== 'SHA256SUMS').sort();
writeFileSync('SHA256SUMS', files.map(name => `${createHash('sha256').update(readFileSync(name)).digest('hex')}  ${name}\n`).join(''));
NODE
  if command -v sha256sum >/dev/null; then sha256sum -c SHA256SUMS; else shasum -a 256 -c SHA256SUMS; fi
)

chmod 600 "$recovery_dir"/*
echo "Verified production recovery archive: $recovery_dir"
