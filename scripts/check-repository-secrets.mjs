#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
const patterns = [
  ['private key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ['AWS access key', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  ['GitHub token', /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/],
  ['provider API key', /\bsk-(?:proj-)?[A-Za-z0-9_-]{32,}\b/],
  ['credential URL', /(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?):\/\/[^\s/:]+:[^\s/@]+@/],
];
let failed = false;
for (const file of files) {
  if (/(^|\/)(?:\.env(?:\..+)?|[^/]+\.db(?:-(?:wal|shm))?|[^/]+\.(?:pem|key)|form-uploads)(?:\/|$)/.test(file) && !file.endsWith('.env.example')) {
    console.error(`Disallowed private path: ${file}`); failed = true;
  }
  const buffer = readFileSync(file);
  if (buffer.includes(0)) continue;
  const text = buffer.toString('utf8');
  for (const [label, pattern] of patterns) if (pattern.test(text)) {
    console.error(`Possible ${label}: ${file}`); failed = true; // Do not print secret values.
  }
}
if (failed) process.exit(1);
console.log(`Tracked-file credential and private-path checks passed (${files.length} files). Review manually too; this is not an exhaustive secret detector.`);
