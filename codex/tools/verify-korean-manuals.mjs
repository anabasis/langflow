import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2] ?? 'manuals-ko';

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => (
    entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]
  ));
}

const files = walk(root);
const manuals = files.filter((file) => file.endsWith('.md') && !file.endsWith('README.md'));
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
const failures = [];

for (const file of manuals) {
  const content = fs.readFileSync(file, 'utf8');
  if (!content.startsWith('---\n')) failures.push(`${file}: frontmatter 누락`);
  if (!content.includes('source_url: "https://docs.langflow.org')) failures.push(`${file}: 공식 URL 누락`);
  if (!/[가-힣]/.test(content)) failures.push(`${file}: 한국어 본문 누락`);
  if ((content.match(/```/g) ?? []).length % 2 !== 0) failures.push(`${file}: 코드 펜스 불균형`);
}

for (const file of files.filter((item) => item.endsWith('.md'))) {
  const content = fs.readFileSync(file, 'utf8');
  for (const match of content.matchAll(/\]\((\.\.?\/[^)#]+\.md)\)/g)) {
    const target = path.resolve(path.dirname(file), match[1]);
    if (!fs.existsSync(target)) failures.push(`${file}: 깨진 링크 ${match[1]}`);
  }
}

const urls = manifest.entries.map((entry) => entry.url);
const report = {
  allFiles: files.length,
  manuals: manuals.length,
  manifestEntries: manifest.entries.length,
  uniqueUrls: new Set(urls).size,
  unresolved: manifest.unresolved.length,
  failures,
};

console.log(JSON.stringify(report, null, 2));

if (
  failures.length > 0
  || manuals.length !== 141
  || manifest.entries.length !== 141
  || new Set(urls).size !== 141
  || manifest.unresolved.length !== 0
) {
  process.exit(1);
}
