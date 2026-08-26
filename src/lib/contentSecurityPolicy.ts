export function buildContentSecurityPolicy(
  nonce: string,
  isDevelopment = process.env.NODE_ENV !== "production",
): string {
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: http:${
      isDevelopment ? " 'unsafe-eval'" : ""
    }`,
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline' https:",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https:",
    "connect-src 'self' https: wss:",
    "media-src 'self' blob: https:",
    "frame-src 'self' https://www.googletagmanager.com https://www.youtube-nocookie.com https://www.google.com https://maps.google.com",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ];

  if (!isDevelopment) directives.push("upgrade-insecure-requests");
  return directives.join("; ");
}
