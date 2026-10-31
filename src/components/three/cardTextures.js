// Draws the ID card (front and back) and the lanyard strap onto 2D canvases,
// which the 3D scene then uses as textures. Same design as the flat card in components/ui/IdCard.js.

import * as THREE from "three";
import { profile } from "@/data/profile";

const CARD_PX = { w: 1000, h: 1400 };

// Lanyard hole at the top centre of the card, in texture pixels. Lanyard.js cuts the real hole
// at the same spot (100 px of 1400 = 0.2 of the 2.8-unit card height; radius 45 px = 0.09 units).
export const CARD_HOLE = { fromTop: 100, radius: 45 };

// Decorative QR pattern (1 = dark cell). A real, scannable QR can replace it later.
const QR = ["1110111", "1010101", "1110111", "0000000", "1110101", "1010010", "1110101"];

function cssFont(variable, fallback) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return value || fallback;
}

function setSpacing(ctx, value) {
  if ("letterSpacing" in ctx) ctx.letterSpacing = value;
}

function toTexture(canvas) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// Metal eyelet around the hole
function drawEyelet(ctx) {
  const x = CARD_PX.w / 2;
  ctx.strokeStyle = "#b9c3d6";
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.arc(x, CARD_HOLE.fromTop, CARD_HOLE.radius + 9, 0, Math.PI * 2);
  ctx.stroke();
}

function fitFont(ctx, text, weight, size, family, maxWidth) {
  let current = size;
  ctx.font = `${weight} ${current}px ${family}`;
  while (ctx.measureText(text).width > maxWidth && current > 20) {
    current -= 2;
    ctx.font = `${weight} ${current}px ${family}`;
  }
}

function drawFront(display, mono, photo) {
  const { w: W, h: H } = CARD_PX;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, W, H, 60);
  ctx.clip();

  // Body and blue header
  ctx.fillStyle = "#0b1224";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#2563eb";
  ctx.fillRect(0, 0, W, 150);
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "middle";
  ctx.font = `500 40px ${mono}`;
  setSpacing(ctx, "6px");
  ctx.fillText("EMPLOYEE ID", 60, 77);
  ctx.fillStyle = "#0b1224";
  ctx.beginPath();
  ctx.roundRect(W - 260, 62, 180, 28, 14);
  ctx.fill();

  // Photo, cropped like CSS object-cover anchored to the top
  const px = 60;
  const py = 210;
  const pw = W - 120;
  const ph = 760;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(px, py, pw, ph, 32);
  ctx.clip();
  if (photo) {
    const scale = Math.max(pw / photo.naturalWidth, ph / photo.naturalHeight);
    const dw = photo.naturalWidth * scale;
    const dh = photo.naturalHeight * scale;
    ctx.drawImage(photo, px + (pw - dw) / 2, py, dw, dh);
  } else {
    ctx.fillStyle = "#16213a";
    ctx.fillRect(px, py, pw, ph);
  }
  ctx.restore();

  // Name and role
  ctx.textBaseline = "alphabetic";
  setSpacing(ctx, "0px");
  ctx.fillStyle = "#f2f5fb";
  fitFont(ctx, profile.name, 700, 72, display, pw);
  ctx.fillText(profile.name, 60, 1075);
  ctx.fillStyle = "#7fa8f5";
  ctx.font = `500 38px ${mono}`;
  setSpacing(ctx, "4px");
  ctx.fillText(profile.role.toUpperCase(), 60, 1135);

  // Dashed divider, department and QR
  ctx.strokeStyle = "#2a3b63";
  ctx.lineWidth = 3;
  ctx.setLineDash([14, 10]);
  ctx.beginPath();
  ctx.moveTo(60, 1185);
  ctx.lineTo(W - 60, 1185);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#7c8aa8";
  ctx.font = `500 28px ${mono}`;
  setSpacing(ctx, "4px");
  ctx.fillText("DEPT", 60, 1262);
  ctx.fillStyle = "#c9d3e6";
  ctx.font = `500 36px ${mono}`;
  setSpacing(ctx, "2px");
  ctx.fillText(profile.department.toUpperCase(), 60, 1318);

  const qrSize = 150;
  const qx = W - 60 - qrSize;
  const qy = 1210;
  ctx.fillStyle = "#e8edf7";
  ctx.beginPath();
  ctx.roundRect(qx, qy, qrSize, qrSize, 12);
  ctx.fill();
  const cell = (qrSize - 24) / 7;
  ctx.fillStyle = "#0b1224";
  QR.forEach((row, r) =>
    row.split("").forEach((bit, c) => {
      if (bit === "1") ctx.fillRect(qx + 12 + c * cell, qy + 12 + r * cell, cell + 0.5, cell + 0.5);
    })
  );
  drawEyelet(ctx);
  ctx.restore();

  // Outer border
  ctx.strokeStyle = "#2a3b63";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(3, 3, W - 6, H - 6, 58);
  ctx.stroke();

  return canvas;
}

function drawBack(display, mono) {
  const { w: W, h: H } = CARD_PX;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, W, H, 60);
  ctx.clip();
  ctx.fillStyle = "#0b1224";
  ctx.fillRect(0, 0, W, H);

  // Blueprint grid
  ctx.strokeStyle = "rgba(110, 140, 200, 0.12)";
  ctx.lineWidth = 2;
  for (let x = 0; x <= W; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += 60) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#f2f5fb";
  ctx.font = `700 200px ${display}`;
  ctx.fillText("PMI", W / 2 - 30, H / 2 - 80);
  ctx.fillStyle = "#3b82f6";
  ctx.fillText(".", W / 2 + 175, H / 2 - 80);
  ctx.fillStyle = "#7fa8f5";
  ctx.font = `600 54px ${display}`;
  ctx.fillText(profile.slogan, W / 2, H / 2 + 80);
  ctx.fillStyle = "#7c8aa8";
  ctx.font = `500 32px ${mono}`;
  setSpacing(ctx, "4px");
  ctx.fillText("PANJIMAULANA.WEB.APP", W / 2, H - 120);
  drawEyelet(ctx);
  ctx.restore();

  ctx.strokeStyle = "#2a3b63";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(3, 3, W - 6, H - 6, 58);
  ctx.stroke();
  return canvas;
}

// Strap print (option C): dark band with red and yellow edge stripes, the Mechanical Engineering
// association logo, and "MECHANICAL ENGINEERING" in the mono font, logo and text in one line,
// repeated along the strap. 2048 x 192 px (the 1024:96 proportion Lanyard.js tiles by),
// two logo + text units per tile.
const STRAP_PX = { w: 2048, h: 192 };

function drawStrap(logo, mono) {
  const { w: W, h: H } = STRAP_PX;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#141414";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#c81e1e";
  ctx.fillRect(0, 8, W, 8);
  ctx.fillRect(0, H - 16, W, 8);
  ctx.fillStyle = "#f5d10a";
  ctx.fillRect(0, 20, W, 3);
  ctx.fillRect(0, H - 23, W, 3);

  const unit = W / 2;
  const logoH = 124;
  const logoW = logo ? (logoH * logo.naturalWidth) / logo.naturalHeight : 0;
  const text = "MECHANICAL ENGINEERING";
  ctx.font = `600 52px ${mono}`;
  setSpacing(ctx, "4px");
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#f5d10a";

  for (let i = 0; i < 2; i++) {
    const x0 = i * unit;
    if (logo) ctx.drawImage(logo, x0 + 50, (H - logoH) / 2, logoW, logoH);
    const start = x0 + 50 + logoW;
    const space = unit - 50 - logoW;
    const width = ctx.measureText(text).width;
    ctx.fillText(text, start + (space - width) / 2, H / 2 + 3);
  }
  return canvas;
}

export async function createCardTextures() {
  await document.fonts.ready;
  const display = cssFont("--font-space-grotesk", "sans-serif");
  const mono = cssFont("--font-jetbrains-mono", "monospace");
  const [photo, logo] = await Promise.all([
    loadImage("/images/profile/id-card.jpg"),
    loadImage("/images/lanyard/strap-logo.jpg"),
  ]);

  const strap = toTexture(drawStrap(logo, mono));
  strap.wrapS = THREE.RepeatWrapping;
  strap.wrapT = THREE.RepeatWrapping;

  return {
    front: toTexture(drawFront(display, mono, photo)),
    back: toTexture(drawBack(display, mono)),
    strap,
  };
}
