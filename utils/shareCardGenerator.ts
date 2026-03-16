const CARD_WIDTH = 1200;
const CARD_HEIGHT = 630;

interface ShareCardData {
  userName: string;
  rosariesPrayed: number;
  prayerStreak: number;
  levelName: string;
  motivatingMessage: string;
  siteUrl: string;
}

/** Draw a subtle radial glow at (cx, cy) */
function drawGlow(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  color: string,
) {
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
}

/** Draw a simple rosary bead chain arc */
function drawRosaryBeads(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  beadCount: number,
) {
  ctx.save();
  for (let i = 0; i < beadCount; i++) {
    const angle = (Math.PI / (beadCount - 1)) * i - Math.PI;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);

    // Gold bead
    const beadGradient = ctx.createRadialGradient(x - 1, y - 1, 0, x, y, 5);
    beadGradient.addColorStop(0, '#ffd700');
    beadGradient.addColorStop(1, '#b8860b');
    ctx.fillStyle = beadGradient;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/** Draw a glowing cross shape */
function drawCross(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
) {
  // Outer glow
  drawGlow(ctx, cx, cy, size * 3, 'rgba(255, 215, 0, 0.15)');

  const arm = size / 5;
  ctx.save();
  ctx.fillStyle = '#ffd700';
  ctx.shadowColor = '#ffd700';
  ctx.shadowBlur = 20;

  // Vertical bar
  ctx.fillRect(cx - arm, cy - size / 2, arm * 2, size);
  // Horizontal bar
  ctx.fillRect(cx - size / 3, cy - size / 4, (size * 2) / 3, arm * 2);

  ctx.restore();
}

/** Generate a shareable prayer stats card on an OffscreenCanvas or regular Canvas */
export function generateShareCard(
  canvas: HTMLCanvasElement,
  data: ShareCardData,
): void {
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // --- Background gradient: deep navy to dark blue ---
  const bgGradient = ctx.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT);
  bgGradient.addColorStop(0, '#0a0e27');
  bgGradient.addColorStop(0.5, '#0d1442');
  bgGradient.addColorStop(1, '#060919');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  // --- Starfield dots ---
  ctx.save();
  const starPositions = [
    [80, 50],
    [200, 120],
    [350, 30],
    [500, 80],
    [700, 45],
    [900, 100],
    [1050, 60],
    [1150, 130],
    [150, 300],
    [950, 280],
    [60, 500],
    [300, 550],
    [750, 520],
    [1100, 480],
    [400, 180],
    [620, 560],
    [850, 580],
    [1000, 350],
  ];
  for (const [x, y] of starPositions) {
    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.5})`;
    ctx.beginPath();
    ctx.arc(x, y, 1 + Math.random() * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // --- Glowing cross top right ---
  drawCross(ctx, 1050, 120, 80);

  // --- Rosary beads arc left side ---
  drawRosaryBeads(ctx, 100, 315, 200, 15);

  // --- Gold border accent ---
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, CARD_WIDTH - 40, CARD_HEIGHT - 40);
  // Corner accents
  const cornerSize = 30;
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 3;
  // Top-left
  ctx.beginPath();
  ctx.moveTo(20, 20 + cornerSize);
  ctx.lineTo(20, 20);
  ctx.lineTo(20 + cornerSize, 20);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.moveTo(CARD_WIDTH - 20 - cornerSize, 20);
  ctx.lineTo(CARD_WIDTH - 20, 20);
  ctx.lineTo(CARD_WIDTH - 20, 20 + cornerSize);
  ctx.stroke();
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(20, CARD_HEIGHT - 20 - cornerSize);
  ctx.lineTo(20, CARD_HEIGHT - 20);
  ctx.lineTo(20 + cornerSize, CARD_HEIGHT - 20);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(CARD_WIDTH - 20 - cornerSize, CARD_HEIGHT - 20);
  ctx.lineTo(CARD_WIDTH - 20, CARD_HEIGHT - 20);
  ctx.lineTo(CARD_WIDTH - 20, CARD_HEIGHT - 20 - cornerSize);
  ctx.stroke();
  ctx.restore();

  // --- Subtle center glow ---
  drawGlow(
    ctx,
    CARD_WIDTH / 2,
    CARD_HEIGHT / 2 - 40,
    300,
    'rgba(30, 60, 150, 0.15)',
  );

  // --- Content text ---
  const textX = 320;

  // App branding
  ctx.save();
  ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
  ctx.font = '600 16px "Segoe UI", Arial, sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('DOIT4JESUS', textX, 70);
  ctx.restore();

  // User name
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 42px "Segoe UI", Arial, sans-serif';
  ctx.fillText(data.userName, textX, 140);
  ctx.restore();

  // Divider line
  ctx.save();
  const divGradient = ctx.createLinearGradient(textX, 0, textX + 500, 0);
  divGradient.addColorStop(0, '#ffd700');
  divGradient.addColorStop(1, 'transparent');
  ctx.fillStyle = divGradient;
  ctx.fillRect(textX, 158, 500, 2);
  ctx.restore();

  // Stats row
  const statsY = 230;
  const statsSpacing = 240;

  // Rosaries Prayed
  ctx.save();
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 64px "Segoe UI", Arial, sans-serif';
  ctx.fillText(String(data.rosariesPrayed), textX, statsY);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '400 18px "Segoe UI", Arial, sans-serif';
  ctx.fillText('Rosaries Prayed', textX, statsY + 30);
  ctx.restore();

  // Prayer Streak
  ctx.save();
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 64px "Segoe UI", Arial, sans-serif';
  ctx.fillText(String(data.prayerStreak), textX + statsSpacing, statsY);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '400 18px "Segoe UI", Arial, sans-serif';
  ctx.fillText('Day Streak 🔥', textX + statsSpacing, statsY + 30);
  ctx.restore();

  // Level
  ctx.save();
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
  ctx.fillText(data.levelName, textX + statsSpacing * 2, statsY);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '400 18px "Segoe UI", Arial, sans-serif';
  ctx.fillText('Level', textX + statsSpacing * 2, statsY + 30);
  ctx.restore();

  // --- Motivating message ---
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'italic bold 32px "Georgia", serif';
  ctx.fillText(`"${data.motivatingMessage}"`, textX, 370);
  ctx.restore();

  // --- CTA line ---
  ctx.save();
  ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
  ctx.font = '600 20px "Segoe UI", Arial, sans-serif';
  ctx.fillText('Join thousands praying worldwide.', textX, 440);
  ctx.restore();

  // --- Site URL ---
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '400 16px "Segoe UI", Arial, sans-serif';
  ctx.fillText(data.siteUrl, textX, CARD_HEIGHT - 40);
  ctx.restore();

  // --- Bottom gold accent line ---
  ctx.save();
  const bottomGradient = ctx.createLinearGradient(0, 0, CARD_WIDTH, 0);
  bottomGradient.addColorStop(0, 'transparent');
  bottomGradient.addColorStop(0.3, '#ffd700');
  bottomGradient.addColorStop(0.7, '#ffd700');
  bottomGradient.addColorStop(1, 'transparent');
  ctx.fillStyle = bottomGradient;
  ctx.fillRect(0, CARD_HEIGHT - 4, CARD_WIDTH, 4);
  ctx.restore();
}

/** Convert canvas to a downloadable Blob */
export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}

export type { ShareCardData };
