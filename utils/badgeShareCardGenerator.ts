const CARD_WIDTH = 1200;
const CARD_HEIGHT = 1400;

export interface BadgeShareCardData {
  appName: string;
  badgeName: string;
  badgeDescription: string;
  verseReference: string;
  verseText: string;
  earnedAtLabel: string;
  userName: string;
  shareMessage: string;
}

const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) => {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  words.forEach((word, index) => {
    const testLine = `${line}${word} `;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && index > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = `${word} `;
      currentY += lineHeight;
      return;
    }
    line = testLine;
  });

  if (line.trim()) {
    ctx.fillText(line.trim(), x, currentY);
  }

  return currentY;
};

export const generateBadgeShareCard = (
  canvas: HTMLCanvasElement,
  data: BadgeShareCardData,
) => {
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const background = ctx.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT);
  background.addColorStop(0, '#081827');
  background.addColorStop(0.5, '#0f3b5f');
  background.addColorStop(1, '#f0c56c');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  const halo = ctx.createRadialGradient(900, 280, 40, 900, 280, 300);
  halo.addColorStop(0, 'rgba(255, 245, 210, 0.9)');
  halo.addColorStop(1, 'rgba(255, 245, 210, 0)');
  ctx.fillStyle = halo;
  ctx.fillRect(600, 0, 600, 600);

  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath();
  ctx.arc(180, 210, 140, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(1040, 1180, 200, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 4;
  ctx.strokeRect(36, 36, CARD_WIDTH - 72, CARD_HEIGHT - 72);

  ctx.fillStyle = '#f6d58b';
  ctx.font = '600 34px "Segoe UI", Arial, sans-serif';
  ctx.fillText(data.appName.toUpperCase(), 100, 120);

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 84px "Segoe UI", Arial, sans-serif';
  wrapText(ctx, data.badgeName, 100, 270, 800, 92);

  ctx.fillStyle = '#fef2cf';
  ctx.font = '500 42px "Segoe UI", Arial, sans-serif';
  wrapText(ctx, data.badgeDescription, 100, 430, 880, 58);

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 38px "Segoe UI", Arial, sans-serif';
  ctx.fillText(`Earned by ${data.userName}`, 100, 620);

  ctx.fillStyle = '#d8e8f4';
  ctx.font = '500 30px "Segoe UI", Arial, sans-serif';
  ctx.fillText(data.earnedAtLabel, 100, 675);

  ctx.fillStyle = 'rgba(8, 24, 39, 0.28)';
  ctx.beginPath();
  ctx.roundRect(88, 760, 1024, 320, 28);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = '600 30px "Segoe UI", Arial, sans-serif';
  ctx.fillText(data.verseReference, 130, 840);

  ctx.font = '500 40px "Georgia", serif';
  wrapText(ctx, `“${data.verseText}”`, 130, 920, 940, 56);

  ctx.fillStyle = '#082033';
  ctx.beginPath();
  ctx.roundRect(88, 1120, 1024, 170, 28);
  ctx.fill();

  ctx.fillStyle = '#f6d58b';
  ctx.font = '600 26px "Segoe UI", Arial, sans-serif';
  ctx.fillText('Share this encouragement', 130, 1186);

  ctx.fillStyle = '#ffffff';
  ctx.font = '500 34px "Segoe UI", Arial, sans-serif';
  wrapText(ctx, data.shareMessage, 130, 1250, 940, 46);
};
