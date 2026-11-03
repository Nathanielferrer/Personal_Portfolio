import logoGrc from '../assets/Images/Logo_GRC.png';
import profilePic from '../assets/Images/Profile.jpg';

// Helper to load image
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => resolve(null); // fallback gracefully if image fails
    img.src = src;
  });
};

/**
 * Generates the front face of the GRC Student ID Card
 */
export async function createIdCardFront() {
  if (typeof document !== 'undefined' && document.fonts) {
    try {
      await document.fonts.ready;
    } catch (e) {
      // ignore
    }
  }

  const width = 1024;
  const height = 1440;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const [logo, portrait] = await Promise.all([
    loadImage(logoGrc),
    loadImage(profilePic)
  ]);

  // 1. Background - Premium clean ID white with subtle gradient & pattern
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#ffffff');
  bgGrad.addColorStop(0.5, '#f8fafc');
  bgGrad.addColorStop(1, '#f1f5f9');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle diagonal security pattern
  ctx.save();
  ctx.strokeStyle = 'rgba(153, 27, 27, 0.03)';
  ctx.lineWidth = 1.5;
  for (let i = -height; i < width + height; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + height, height);
    ctx.stroke();
  }
  ctx.restore();

  // 2. Header: Deep Red GRC Official Color with Gold Accent
  const headerHeight = 260;
  const redGrad = ctx.createLinearGradient(0, 0, width, headerHeight);
  redGrad.addColorStop(0, '#7f1d1d');
  redGrad.addColorStop(0.5, '#991b1b');
  redGrad.addColorStop(1, '#b91c1c');
  ctx.fillStyle = redGrad;
  ctx.fillRect(0, 0, width, headerHeight);

  // Gold accent stripe
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(0, headerHeight - 8, width, 8);

  // GRC Logo in header
  const logoSize = 130;
  const logoX = 70;
  const logoY = 90;
  if (logo) {
    // White circular glow backdrop for logo
    ctx.save();
    ctx.beginPath();
    ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2 + 6, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
    ctx.restore();
  }

  // Header Typography
  ctx.save();
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 38px "ADLaM Display", "Arial Black", sans-serif';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 4;
  ctx.fillText('GLOBAL RECIPROCAL COLLEGES', 225, 142);

  ctx.font = '700 21px "Advent Pro", sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.shadowBlur = 0;
  ctx.letterSpacing = '3px';
  ctx.fillText('TOUCHING HEARTS, TRANSFORMING LIVES', 228, 178);

  ctx.font = '600 17px system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.letterSpacing = '1px';
  ctx.fillText('COLLEGE OF COMPUTER STUDIES', 228, 208);
  ctx.restore();

  // 3. ID Badge Slot Space (leave clear top center for the punch hole)
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.beginPath();
  ctx.roundRect(width / 2 - 120, 25, 240, 24, 12);
  ctx.fill();
  ctx.restore();

  // 4. Portrait Photo Frame
  const photoW = 440;
  const photoH = 490;
  const photoX = (width - photoW) / 2;
  const photoY = 320;

  // Frame outer shadow & border
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.16)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(photoX - 8, photoY - 8, photoW + 16, photoH + 16, 28);
  ctx.fill();
  ctx.restore();

  // Photo border line
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(photoX - 8, photoY - 8, photoW + 16, photoH + 16, 28);
  ctx.stroke();

  // Clip and draw portrait photo
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(photoX, photoY, photoW, photoH, 20);
  ctx.clip();

  if (portrait) {
    // Fill photo with cover fit
    const pAspect = portrait.width / portrait.height;
    const fAspect = photoW / photoH;
    let sW, sH, sX, sY;
    if (pAspect > fAspect) {
      sH = portrait.height;
      sW = sH * fAspect;
      sX = (portrait.width - sW) / 2;
      sY = 0;
    } else {
      sW = portrait.width;
      sH = sW / fAspect;
      sX = 0;
      sY = (portrait.height - sH) / 2;
    }
    ctx.drawImage(portrait, sX, sY, sW, sH, photoX, photoY, photoW, photoH);
  } else {
    // Fallback if image not loaded
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(photoX, photoY, photoW, photoH);
  }
  ctx.restore();

  // 5. Official Ribbon Badge under photo
  const badgeY = photoY + photoH + 45;
  ctx.save();
  ctx.fillStyle = '#991b1b';
  ctx.beginPath();
  ctx.roundRect(width / 2 - 140, badgeY - 32, 280, 42, 21);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 20px "ADLaM Display", sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '2px';
  ctx.fillText('STUDENT', width / 2, badgeY - 5);
  ctx.restore();

  // 6. Student Information
  ctx.save();
  ctx.textAlign = 'center';

  // Full Name
  ctx.fillStyle = '#0f172a';
  ctx.font = '900 48px "ADLaM Display", sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('NATHANIEL D. FERRER', width / 2, badgeY + 68);

  // Underline accent
  ctx.strokeStyle = '#991b1b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 180, badgeY + 84);
  ctx.lineTo(width / 2 + 180, badgeY + 84);
  ctx.stroke();

  // Course / Degree
  ctx.fillStyle = '#1e293b';
  ctx.font = '800 28px "Advent Pro", sans-serif';
  ctx.letterSpacing = '1.5px';
  ctx.fillText('BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY', width / 2, badgeY + 130);

  // Year level and Student ID
  ctx.fillStyle = '#64748b';
  ctx.font = '700 22px "Advent Pro", sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('4TH YEAR  •  ID NO: 2022-0489', width / 2, badgeY + 168);

  ctx.restore();

  // 7. Bottom Barcode & Security Strip
  const footerY = 1180;

  // Security holographic band
  const holoGrad = ctx.createLinearGradient(0, footerY, width, footerY + 50);
  holoGrad.addColorStop(0, '#f1f5f9');
  holoGrad.addColorStop(0.2, '#fed7aa');
  holoGrad.addColorStop(0.5, '#e0e7ff');
  holoGrad.addColorStop(0.8, '#bbf7d0');
  holoGrad.addColorStop(1, '#f1f5f9');
  ctx.fillStyle = holoGrad;
  ctx.fillRect(80, footerY, width - 160, 4);

  // Barcode simulation
  const bcX = 140;
  const bcY = footerY + 28;
  const bcW = width - 280;
  const bcH = 75;

  ctx.fillStyle = '#0f172a';
  const barPattern = [
    3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 4, 2, 2, 1, 3, 4, 1, 2, 3, 1, 2, 4,
    1, 3, 2, 1, 4, 1, 2, 3, 4, 1, 2, 1, 3, 2, 4, 1, 3, 2, 1, 2, 4, 1, 3, 2, 1,
    4, 2, 1, 3, 1, 4, 2, 2, 1, 3, 4, 1, 2, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1
  ];
  let curX = bcX;
  const totalWeight = barPattern.reduce((a, b) => a + b, 0);
  const unit = bcW / totalWeight;

  for (let i = 0; i < barPattern.length; i++) {
    const w = barPattern[i] * unit;
    if (i % 2 === 0) {
      ctx.fillRect(curX, bcY, w * 0.85, bcH);
    }
    curX += w;
  }

  // Barcode text
  ctx.save();
  ctx.font = '600 18px monospace';
  ctx.fillStyle = '#475569';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '5px';
  ctx.fillText('* GRC-2022-0489-BSIT *', width / 2, bcY + bcH + 28);
  ctx.restore();

  // Bottom Footer colored bar
  ctx.fillStyle = '#991b1b';
  ctx.fillRect(0, height - 32, width, 32);

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 15px "Advent Pro", sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '2px';
  ctx.fillText('GLOBAL RECIPROCAL COLLEGES  •  OFFICIAL IDENTIFICATION CARD', width / 2, height - 12);

  return canvas.toDataURL('image/png');
}

/**
 * Generates the back face of the GRC Student ID Card
 */
export async function createIdCardBack() {
  if (typeof document !== 'undefined' && document.fonts) {
    try {
      await document.fonts.ready;
    } catch (e) {
      // ignore
    }
  }

  const width = 1024;
  const height = 1440;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const logo = await loadImage(logoGrc);

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Subtle watermark in center
  if (logo) {
    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.drawImage(logo, width / 2 - 250, height / 2 - 250, 500, 500);
    ctx.restore();
  }

  // Magnetic Stripe
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 80, width, 140);

  // Terms and Info Box
  const boxX = 80;
  const boxY = 270;
  const boxW = width - 160;

  ctx.save();
  ctx.fillStyle = '#0f172a';
  ctx.font = '800 28px "ADLaM Display", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TERMS AND CONDITIONS', width / 2, boxY);

  ctx.textAlign = 'left';
  ctx.font = '600 20px "Advent Pro", sans-serif';
  ctx.fillStyle = '#334155';
  ctx.letterSpacing = '0.5px';

  const terms = [
    '1. This card is non-transferable and must be worn inside the campus at all times.',
    '2. Any unauthorized use or alteration of this card will be subject to disciplinary action.',
    '3. In case of loss, report immediately to the Office of Student Affairs & Registrar.',
    '4. Valid for Academic Year 2025 - 2026. Surrender upon transfer or graduation.'
  ];

  let lineY = boxY + 45;
  terms.forEach(t => {
    ctx.fillText(t, boxX, lineY);
    lineY += 36;
  });

  // Emergency Contact Section
  lineY += 20;
  ctx.fillStyle = '#991b1b';
  ctx.font = '800 24px "ADLaM Display", sans-serif';
  ctx.fillText('EMERGENCY CONTACT', boxX, lineY);

  lineY += 38;
  ctx.fillStyle = '#1e293b';
  ctx.font = '600 21px "Advent Pro", sans-serif';
  ctx.fillText('GLOBAL RECIPROCAL COLLEGES', boxX, lineY);
  lineY += 30;
  ctx.font = '500 19px "Advent Pro", sans-serif';
  ctx.fillStyle = '#475569';
  ctx.fillText('954 Gov. Pascual Ave, Malabon, Metro Manila, Philippines', boxX, lineY);
  lineY += 28;
  ctx.fillText('Telephone: (02) 8282-3838  |  Email: info@grc.edu.ph', boxX, lineY);

  // Signatures
  lineY += 80;
  const sigW = 340;
  // Student Signature
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(boxX, lineY + 70);
  ctx.lineTo(boxX + sigW, lineY + 70);
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.font = '700 18px "Advent Pro", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('STUDENT SIGNATURE', boxX + sigW / 2, lineY + 98);

  // College President Signature
  const rightSigX = width - boxX - sigW;
  ctx.beginPath();
  ctx.moveTo(rightSigX, lineY + 70);
  ctx.lineTo(rightSigX + sigW, lineY + 70);
  ctx.stroke();

  ctx.fillText('COLLEGE REGISTRAR / PRESIDENT', rightSigX + sigW / 2, lineY + 98);

  // QR Code placeholder / info stamp
  const stampY = lineY + 160;
  ctx.save();
  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(width / 2 - 90, stampY, 180, 180, 16);
  ctx.fill();
  ctx.stroke();

  // Draw GRC logo inside stamp
  if (logo) {
    ctx.drawImage(logo, width / 2 - 60, stampY + 30, 120, 120);
  }
  ctx.restore();

  // Bottom footer
  ctx.fillStyle = '#991b1b';
  ctx.fillRect(0, height - 32, width, 32);

  return canvas.toDataURL('image/png');
}

/**
 * Generates the repeating red GRC lanyard lace texture
 */
export async function createLanyardStrap() {
  if (typeof document !== 'undefined' && document.fonts) {
    try {
      await document.fonts.ready;
    } catch (e) {
      // ignore
    }
  }

  const logo = await loadImage(logoGrc);

  // Width and height of the ribbon repeat segment:
  // Across the strap = 192, along the strap = 768
  const width = 768; // along the length
  const height = 192; // across the width

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Deep rich Red background
  const redGrad = ctx.createLinearGradient(0, 0, 0, height);
  redGrad.addColorStop(0, '#7f1d1d');
  redGrad.addColorStop(0.5, '#991b1b');
  redGrad.addColorStop(1, '#7f1d1d');
  ctx.fillStyle = redGrad;
  ctx.fillRect(0, 0, width, height);

  // Fine edge stitching / borders
  ctx.fillStyle = '#f59e0b'; // gold pin-stripe
  ctx.fillRect(0, 10, width, 5);
  ctx.fillRect(0, height - 15, width, 5);

  ctx.fillStyle = '#ffffff'; // white accent border
  ctx.fillRect(0, 18, width, 3);
  ctx.fillRect(0, height - 21, width, 3);

  // Draw Repeating GRC Logo & Text
  // Section 1: Logo
  const logoSize = 110;
  if (logo) {
    // 1st logo
    ctx.save();
    ctx.beginPath();
    ctx.arc(80, height / 2, logoSize / 2 + 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.drawImage(logo, 80 - logoSize / 2, height / 2 - logoSize / 2, logoSize, logoSize);
    ctx.restore();
  }

  // Section 2: "GLOBAL RECIPROCAL COLLEGES"
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 42px "ADLaM Display", "Arial Black", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 6;
  ctx.fillText('GLOBAL RECIPROCAL COLLEGES', 160, height / 2);

  // Section 3: 2nd GRC Logo
  if (logo) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(690, height / 2, logoSize / 2 + 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.drawImage(logo, 690 - logoSize / 2, height / 2 - logoSize / 2, logoSize, logoSize);
    ctx.restore();
  }
  ctx.restore();

  return canvas.toDataURL('image/png');
}
