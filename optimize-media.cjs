// Run after: npm.cmd install --no-save --package-lock=false sharp ffmpeg-static
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const sharp = require('sharp');
const ffmpeg = require('ffmpeg-static');
const output = 'images/optimized';
fs.mkdirSync(output, { recursive: true });
const manifest = {};
let originalBytes = 0, optimizedBytes = 0;
async function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const src = `${dir}/${entry.name}`;
    if (entry.isDirectory()) { await walk(src); continue; }
    const ext = path.extname(src).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.gif', '.mp4'].includes(ext)) continue;
    const base = `${output}/${Object.keys(manifest).length + 1}`;
    originalBytes += fs.statSync(src).size;
    if (ext === '.gif' || ext === '.mp4') {
      const dest = `${base}.mp4`, poster = `${base}.webp`;
      execFileSync(ffmpeg, ['-y', '-i', src, '-vf', 'scale=960:-2', '-c:v', 'libx264', '-preset', 'medium', '-crf', '26', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-c:a', 'aac', '-b:a', '96k', dest], { stdio: ['ignore', 'ignore', 'inherit'] });
      execFileSync(ffmpeg, ['-y', '-i', dest, '-frames:v', '1', poster], { stdio: 'ignore' });
      manifest[src] = { src: dest, poster, type: 'video', animated: ext === '.gif' };
      optimizedBytes += fs.statSync(dest).size + fs.statSync(poster).size;
    } else {
      const dest = `${base}.webp`, small = `${base}-small.webp`;
      await sharp(src).rotate().resize({ width: 1280, height: 1280, fit: 'inside', withoutEnlargement: true }).webp({ quality: 78 }).toFile(dest);
      await sharp(src).rotate().resize({ width: 640, height: 640, fit: 'inside', withoutEnlargement: true }).webp({ quality: 75 }).toFile(small);
      manifest[src] = { src: dest, small };
      optimizedBytes += fs.statSync(dest).size + fs.statSync(small).size;
    }
    console.log(src);
  }
}
walk('images/Proyectos').then(() => {
  fs.writeFileSync('media-manifest.js', `const optimizedMedia = ${JSON.stringify(manifest, null, 2)};\n`);
  console.log(JSON.stringify({ originalBytes, optimizedBytes }));
}).catch(error => { console.error(error); process.exitCode = 1; });
