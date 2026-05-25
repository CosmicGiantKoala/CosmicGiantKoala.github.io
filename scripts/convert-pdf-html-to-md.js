const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const targets = process.argv.slice(2);

if (targets.length === 0) {
  console.error('Usage: node scripts/convert-pdf-html-to-md.js <content-md> [...]');
  process.exit(1);
}

function parseFrontMatter(text) {
  const match = text.match(/^`*\+\+\+\r?\n([\s\S]*?)\r?\n\+\+\+/);
  if (!match) throw new Error('Missing TOML front matter');

  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const item = line.match(/^([A-Za-z0-9_]+)\s*=\s*"([^"]*)"\s*$/);
    if (item) data[item[1]] = item[2];
  }
  return data;
}

function extractBody(html) {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!match) throw new Error('Missing body');
  return match[1];
}

function splitPages(body) {
  const pages = [];
  const sectionPattern = /<section class="page">([\s\S]*?)<\/section>/g;
  let match;
  while ((match = sectionPattern.exec(body))) {
    const raw = match[1];
    const footerMatch = raw.match(/<div class="footer">([\s\S]*?)<\/div>/);
    const number = footerMatch ? footerMatch[1].trim() : `${pages.length + 1}`;
    const withoutFooter = raw.replace(/<div class="footer">[\s\S]*?<\/div>/, '').trim();
    pages.push({ number, html: withoutFooter });
  }
  return pages;
}

function decodeEntities(text) {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function htmlToMarkdown(html) {
  const codeBlocks = [];
  let text = html.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (_match, code) => {
    const token = `@@CODE_BLOCK_${codeBlocks.length}@@`;
    codeBlocks.push(`\n\`\`\`csharp\n${decodeEntities(code).trim()}\n\`\`\`\n`);
    return token;
  });

  const tables = [];
  text = text.replace(/<table[\s\S]*?<\/table>/g, (table) => {
    const token = `@@TABLE_${tables.length}@@`;
    tables.push(`\n${table.trim()}\n`);
    return token;
  });

  text = text
    .replace(/<br\s*\/?>/gi, '<br>')
    .replace(/<div class="eyebrow">([\s\S]*?)<\/div>/g, '\n<div class="eyebrow">$1</div>\n')
    .replace(/<p class="subtitle">([\s\S]*?)<\/p>/g, '\n<p class="subtitle">$1</p>\n')
    .replace(/<p class="lead">([\s\S]*?)<\/p>/g, '\n<p class="lead">$1</p>\n')
    .replace(/<h1>([\s\S]*?)<\/h1>/g, (_m, title) => `\n# ${title.trim()}\n`)
    .replace(/<h2>([\s\S]*?)<\/h2>/g, (_m, title) => `\n## ${title.trim()}\n`)
    .replace(/<h3>([\s\S]*?)<\/h3>/g, (_m, title) => `\n### ${title.trim()}\n`)
    .replace(/<p>([\s\S]*?)<\/p>/g, (_m, paragraph) => `\n${paragraph.trim()}\n`)
    .replace(/<li>([\s\S]*?)<\/li>/g, (_m, item) => `\n- ${item.trim()}`)
    .replace(/<\/?ul>/g, '\n')
    .replace(/<strong>([\s\S]*?)<\/strong>/g, '**$1**')
    .replace(/<span class="pill">([\s\S]*?)<\/span>/g, '`$1`')
    .replace(/<\/?div[^>]*>/g, '\n')
    .replace(/<\/?span[^>]*>/g, '')
    .replace(/<\/?code>/g, '`')
    .replace(/<[^>]+>/g, '')
    .replace(/\r\n/g, '\n');

  for (let i = 0; i < codeBlocks.length; i++) {
    text = text.replace(`@@CODE_BLOCK_${i}@@`, codeBlocks[i]);
  }
  for (let i = 0; i < tables.length; i++) {
    text = text.replace(`@@TABLE_${i}@@`, tables[i]);
  }

  return decodeEntities(text)
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function frontMatter(data) {
  return [
    '+++',
    `title = "${data.title}"`,
    'layout = "pdf"',
    `url = "${data.url}"`,
    `pdfFile = "${data.pdfFile}"`,
    '+++',
    '',
  ].join('\n');
}

function convertFile(relativeMdPath) {
  const mdPath = path.resolve(root, relativeMdPath);
  const original = fs.readFileSync(mdPath, 'utf8');
  const data = parseFrontMatter(original);

  if (!data.sourceHtml) {
    console.log(`Skipping ${relativeMdPath}: sourceHtml already removed`);
    return;
  }

  const htmlPath = path.resolve(root, data.sourceHtml);
  const html = fs.readFileSync(htmlPath, 'utf8');
  const pages = splitPages(extractBody(html));

  const markdownPages = pages.map((page) => {
    const content = htmlToMarkdown(page.html);
    return `{{% pdf-page number="${page.number}" %}}\n${content}\n{{% /pdf-page %}}`;
  });

  fs.writeFileSync(mdPath, `${frontMatter(data)}${markdownPages.join('\n\n')}\n`, 'utf8');
  console.log(`Converted ${relativeMdPath}: ${pages.length} pages`);
}

for (const target of targets) {
  convertFile(target);
}
