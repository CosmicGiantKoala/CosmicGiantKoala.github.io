const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const contentDirs = [
  path.join(root, 'content', 'pdf'),
  path.join(root, 'content', 'job'),
];

function parseFrontMatter(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const match = text.match(/^`*\+\+\+\r?\n([\s\S]*?)\r?\n\+\+\+/);
  if (!match) return null;

  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const item = line.match(/^([A-Za-z0-9_]+)\s*=\s*"([^"]*)"\s*$/);
    if (item) data[item[1]] = item[2];
  }
  return data;
}

function collectPages() {
  return contentDirs
    .filter((dir) => fs.existsSync(dir))
    .flatMap((dir) => fs.readdirSync(dir)
      .filter((name) => name.endsWith('.md') && name !== '_index.md')
      .map((name) => {
        const filePath = path.join(dir, name);
        const frontMatter = parseFrontMatter(filePath);
        return {
          key: path.basename(name, '.md'),
          ...frontMatter,
        };
      }))
    .filter((page) => page.url && page.pdfFile);
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ].filter(Boolean);

  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) {
    throw new Error('Chrome or Edge executable not found. Set CHROME_PATH to a browser executable.');
  }
  return found;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: false,
    ...options,
  });

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed with exit code ${result.status}`);
  }
}

function renderPdf(chrome, page) {
  const publicPath = path.join(root, 'public', page.url.replace(/^\/+|\/+$/g, ''), 'index.html');
  if (!fs.existsSync(publicPath)) {
    throw new Error(`Rendered Hugo page not found: ${publicPath}`);
  }

  const outputPath = path.join(root, page.pdfFile);
  const profilePath = path.join(root, '.chrome-pdf-profile-hugo');
  const fileUrl = `file:///${publicPath.replace(/\\/g, '/')}`;

  const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-extensions',
    '--no-first-run',
    '--no-default-browser-check',
    '--virtual-time-budget=5000',
    '--run-all-compositor-stages-before-draw',
    `--user-data-dir=${profilePath}`,
    `--print-to-pdf=${outputPath}`,
    fileUrl,
  ];

  const result = spawnSync(chrome, args, {
    cwd: root,
    stdio: 'inherit',
    shell: false,
  });

  if (result.status !== 0) {
    throw new Error(`Chrome PDF render failed for ${page.key} with exit code ${result.status}`);
  }

  if (fs.existsSync(profilePath)) {
    fs.rmSync(profilePath, { recursive: true, force: true });
  }
}

function main() {
  const target = process.argv[2] || 'all';
  const pages = collectPages();
  const selected = target === 'all'
    ? pages
    : pages.filter((page) => page.key === target || page.pdfFile === target || page.pdfFile === `${target}.pdf`);

  if (selected.length === 0) {
    console.error(`No PDF page matched "${target}". Available keys:`);
    for (const page of pages) console.error(`- ${page.key}`);
    process.exit(1);
  }

  run('hugo', ['--gc']);

  const chrome = findChrome();
  for (const page of selected) {
    console.log(`Rendering ${page.key} -> ${page.pdfFile}`);
    renderPdf(chrome, page);
  }
}

main();
