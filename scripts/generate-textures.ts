import { PNG } from 'pngjs';
import * as fs from 'fs';
import * as path from 'path';

function hash(x: number, y: number, seed: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 113.5) * 43758.5453;
  return n - Math.floor(n);
}

function smoothNoise(px: number, py: number, scale: number, seed: number): number {
  const sx = px / scale;
  const sy = py / scale;
  const x0 = Math.floor(sx);
  const y0 = Math.floor(sy);
  const fx = sx - x0;
  const fy = sy - y0;
  const n00 = hash(x0, y0, seed);
  const n10 = hash(x0 + 1, y0, seed);
  const n01 = hash(x0, y0 + 1, seed);
  const n11 = hash(x0 + 1, y0 + 1, seed);
  const nx0 = n00 + fx * (n10 - n00);
  const nx1 = n01 + fx * (n11 - n01);
  return nx0 + fy * (nx1 - nx0);
}

function fbm(x: number, y: number, seed: number): number {
  let value = 0;
  let amplitude = 1;
  let total = 0;
  const octaves = [64, 32, 16, 8, 4];
  for (const scale of octaves) {
    value += smoothNoise(x, y, scale, seed) * amplitude;
    total += amplitude;
    amplitude *= 0.5;
  }
  return value / total;
}

function generatePaperGrain(width: number, height: number): PNG {
  const png = new PNG({ width, height });
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const base = fbm(x, y, 1);
      const speckle = hash(x, y, 42);
      const combined = base * 0.7 + speckle * 0.3;
      if (combined > 0.5) {
        png.data[idx] = 255;
        png.data[idx + 1] = 252;
        png.data[idx + 2] = 245;
        png.data[idx + 3] = Math.floor((combined - 0.5) * 2 * 25);
      } else {
        png.data[idx] = 80;
        png.data[idx + 1] = 70;
        png.data[idx + 2] = 55;
        png.data[idx + 3] = Math.floor((0.5 - combined) * 2 * 20);
      }
    }
  }
  return png;
}

function generateBrassNoise(width: number, height: number): PNG {
  const png = new PNG({ width, height });
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const streak = smoothNoise(x, y, 3, 7) * 0.6 + smoothNoise(x, y, 8, 13) * 0.4;
      const directional = smoothNoise(x * 0.3, y, 6, 19);
      const combined = streak * 0.5 + directional * 0.5;
      png.data[idx] = 180;
      png.data[idx + 1] = 155;
      png.data[idx + 2] = 110;
      png.data[idx + 3] = Math.floor(combined * 30);
    }
  }
  return png;
}

const outDir = path.join(__dirname, '..', 'public', 'textures');
fs.mkdirSync(outDir, { recursive: true });

const paperPng = generatePaperGrain(512, 512);
const paperBuffer = PNG.sync.write(paperPng);
fs.writeFileSync(path.join(outDir, 'paper-grain.png'), paperBuffer);
console.log('Created public/textures/paper-grain.png (512x512)');

const brassPng = generateBrassNoise(256, 256);
const brassBuffer = PNG.sync.write(brassPng);
fs.writeFileSync(path.join(outDir, 'brass-noise.png'), brassBuffer);
console.log('Created public/textures/brass-noise.png (256x256)');
