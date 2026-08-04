const sharp = require('sharp');
const path = require('path');

const SRC = process.argv[2] || 'public/chamcham-logo.png';
const OUT = process.argv[3] || 'public/chamcham-logo-transparent.png';
const THRESHOLD = Number(process.argv[4] || 28); // color distance tolerance

async function main() {
  const { data, info } = await sharp(SRC)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info; // channels should be 4
  const idx = (x, y) => (y * width + x) * channels;

  // Sample the four corners to determine background color
  const corners = [
    [0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1],
  ].map(([x, y]) => {
    const i = idx(x, y);
    return [data[i], data[i + 1], data[i + 2]];
  });
  const bg = corners[0];
  console.log('Corner samples:', corners);

  function dist(i) {
    const dr = data[i] - bg[0];
    const dg = data[i + 1] - bg[1];
    const db = data[i + 2] - bg[2];
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  // BFS flood fill from all border pixels
  const visited = new Uint8Array(width * height);
  const queue = [];

  function tryEnqueue(x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const p = y * width + x;
    if (visited[p]) return;
    const i = p * channels;
    if (dist(i) <= THRESHOLD) {
      visited[p] = 1;
      queue.push(p);
    }
  }

  for (let x = 0; x < width; x++) {
    tryEnqueue(x, 0);
    tryEnqueue(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    tryEnqueue(0, y);
    tryEnqueue(width - 1, y);
  }

  let head = 0;
  while (head < queue.length) {
    const p = queue[head++];
    const x = p % width;
    const y = (p / width) | 0;
    tryEnqueue(x + 1, y);
    tryEnqueue(x - 1, y);
    tryEnqueue(x, y + 1);
    tryEnqueue(x, y - 1);
  }

  // Soft edge pass FIRST: only for foreground pixels directly touching the
  // flood-filled region (true boundary), not just any pixel with a similar
  // color. This avoids punching noise-holes in interior light-gray areas
  // that happen to be color-close to the background sample but are not
  // actually connected to it.
  const SOFT = 10;
  function isVisited(x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height) return true; // treat OOB as bg
    return visited[y * width + x] === 1;
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = y * width + x;
      if (visited[p]) continue;
      const touchesBg = isVisited(x + 1, y) || isVisited(x - 1, y) || isVisited(x, y + 1) || isVisited(x, y - 1);
      if (!touchesBg) continue;
      const i = p * channels;
      const d = dist(i);
      if (d <= THRESHOLD + SOFT) {
        const t = Math.max(0, (d - THRESHOLD) / SOFT);
        data[i + 3] = Math.round(255 * Math.min(1, t));
      }
    }
  }

  // Now apply full transparency to the flood-filled background region.
  for (let p = 0; p < width * height; p++) {
    if (!visited[p]) continue;
    const i = p * channels;
    data[i + 3] = 0;
  }

  let removed = 0;
  for (let p = 0; p < width * height; p++) if (visited[p]) removed++;
  console.log(`Removed ${removed} / ${width * height} pixels (${(100 * removed / (width * height)).toFixed(1)}%)`);

  await sharp(data, { raw: { width, height, channels } })
    .png()
    .toFile(OUT);

  console.log('Wrote', OUT);
}

main().catch((e) => { console.error(e); process.exit(1); });
