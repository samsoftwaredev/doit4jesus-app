import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * API route that generates an Open Graph image for shared prayer stats.
 * In production, this would use @vercel/og or canvas-based rendering.
 * For now, it returns a simple SVG-based image.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userName, rosaries, streak, level } = req.query;

  const displayName =
    typeof userName === 'string' ? userName : 'Prayer Warrior';
  const displayRosaries = typeof rosaries === 'string' ? rosaries : '0';
  const displayStreak = typeof streak === 'string' ? streak : '0';
  const displayLevel = typeof level === 'string' ? level : 'Beginner';

  // Generate SVG image
  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0a0e27;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#0d1442;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#060919;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="gold-line" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:transparent" />
          <stop offset="30%" style="stop-color:#ffd700" />
          <stop offset="70%" style="stop-color:#ffd700" />
          <stop offset="100%" style="stop-color:transparent" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="1200" height="630" fill="url(#bg)" />

      <!-- Gold border -->
      <rect x="20" y="20" width="1160" height="590" fill="none" stroke="rgba(255,215,0,0.3)" stroke-width="2" />

      <!-- Cross glow -->
      <circle cx="1050" cy="120" r="80" fill="rgba(255,215,0,0.08)" />
      <rect x="1046" y="80" width="8" height="80" fill="#ffd700" rx="2" />
      <rect x="1024" y="100" width="52" height="8" fill="#ffd700" rx="2" />

      <!-- Branding -->
      <text x="320" y="70" fill="rgba(255,215,0,0.8)" font-family="Arial,sans-serif" font-size="16" font-weight="600" letter-spacing="4">DOIT4JESUS</text>

      <!-- User name -->
      <text x="320" y="140" fill="#ffffff" font-family="Arial,sans-serif" font-size="42" font-weight="bold">${escapeXml(displayName)}</text>

      <!-- Divider -->
      <rect x="320" y="158" width="500" height="2" fill="url(#gold-line)" />

      <!-- Stats -->
      <text x="320" y="230" fill="#ffd700" font-family="Arial,sans-serif" font-size="64" font-weight="bold">${escapeXml(displayRosaries)}</text>
      <text x="320" y="260" fill="rgba(255,255,255,0.7)" font-family="Arial,sans-serif" font-size="18">Rosaries Prayed</text>

      <text x="560" y="230" fill="#ffd700" font-family="Arial,sans-serif" font-size="64" font-weight="bold">${escapeXml(displayStreak)}</text>
      <text x="560" y="260" fill="rgba(255,255,255,0.7)" font-family="Arial,sans-serif" font-size="18">Day Streak 🔥</text>

      <text x="800" y="230" fill="#ffd700" font-family="Arial,sans-serif" font-size="36" font-weight="bold">${escapeXml(displayLevel)}</text>
      <text x="800" y="260" fill="rgba(255,255,255,0.7)" font-family="Arial,sans-serif" font-size="18">Level</text>

      <!-- Motivating message -->
      <text x="320" y="370" fill="#ffffff" font-family="Arial,sans-serif" font-size="32" font-style="italic" font-weight="bold">"Join the battle."</text>

      <!-- CTA -->
      <text x="320" y="440" fill="rgba(255,215,0,0.9)" font-family="Arial,sans-serif" font-size="20" font-weight="600">Join thousands praying worldwide.</text>

      <!-- Bottom accent -->
      <rect x="0" y="626" width="1200" height="4" fill="url(#gold-line)" />
    </svg>
  `;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.status(200).send(svg);
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
