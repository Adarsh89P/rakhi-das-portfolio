/**
 * Turn the white studio backdrop transparent WITHOUT eating her white shirt.
 *
 * Flood-fills inward from the image border, so only white that is connected to
 * the edge is removed. Interior white (shirt, catchlights, teeth) is enclosed by
 * darker pixels and is never reached by the fill.
 *
 * Near-white pixels at the boundary get partial alpha so the edge stays soft
 * instead of aliasing into a hard cutout line.
 */
const fs = require("fs");
const { PNG } = require("pngjs");

const SRC = process.argv[2];
const DST = process.argv[3];

const SOLID = 251; // >= this on all channels === definitely backdrop
const EDGE = 241; // below this the fill stops; EDGE..SOLID ramps alpha for a soft edge

const png = PNG.sync.read(fs.readFileSync(SRC));
const { width: W, height: H, data } = png;
const idx = (x, y) => (y * W + x) << 2;

const seen = new Uint8Array(W * H);
const stack = [];

// Seed from the top and the two sides only. The bottom hem is a deliberate
// fade-to-white; seeding there lets the fill climb up through it and dissolve
// her shirt from the inside.
for (let x = 0; x < W; x++) {
  stack.push([x, 0]);
}
for (let y = 0; y < H; y++) {
  stack.push([0, y], [W - 1, y]);
}

const luma = (i) => Math.min(data[i], data[i + 1], data[i + 2]);

while (stack.length) {
  const [x, y] = stack.pop();
  if (x < 0 || y < 0 || x >= W || y >= H) continue;
  const p = y * W + x;
  if (seen[p]) continue;
  const i = idx(x, y);
  if (luma(i) < EDGE) continue; // hit the subject, stop
  seen[p] = 1;
  stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
}

let cleared = 0;
let feathered = 0;
for (let p = 0; p < W * H; p++) {
  if (!seen[p]) continue;
  const i = p << 2;
  const v = luma(i);
  if (v >= SOLID) {
    data[i + 3] = 0;
    cleared++;
  } else {
    // Ramp EDGE..SOLID -> alpha 255..0 for a soft boundary.
    const a = Math.round(255 * (1 - (v - EDGE) / (SOLID - EDGE)));
    data[i + 3] = Math.max(0, Math.min(255, a));
    feathered++;
  }
}

fs.writeFileSync(DST, PNG.sync.write(png));

// Report opacity of a few probes so the result can be sanity-checked.
const probe = (x, y, label) => {
  const i = idx(x, y);
  console.log(`  ${label.padEnd(18)} (${x},${y}) alpha=${data[i + 3]} rgb=${data[i]},${data[i + 1]},${data[i + 2]}`);
};
console.log(`${W}x${H}  cleared=${cleared}  feathered=${feathered}`);
probe(3, 3, "corner backdrop");
probe(Math.round(W / 2), 8, "top backdrop");
probe(Math.round(W * 0.5), Math.round(H * 0.28), "face");
probe(Math.round(W * 0.45), Math.round(H * 0.62), "white shirt");
probe(Math.round(W * 0.25), Math.round(H * 0.55), "jacket");
