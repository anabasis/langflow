import fs from 'node:fs';
import path from 'node:path';

const [urlPagePath, upstreamDocsPath, outputPath, sourceSha] = process.argv.slice(2);

if (!urlPagePath || !upstreamDocsPath || !outputPath || !sourceSha) {
  console.error('사용법: node tools/generate-korean-manuals.mjs <URL_PAGE.md> <docs/docs> <output> <source-sha>');
  process.exit(1);
}

const topDirectories = new Map([
  ['BUILD', 'build'],
  ['Develop & Deploy', 'develop-deploy'],
  ['Reference', 'reference'],
  ['Community', 'community'],
]);

const sectionDirectories = new Map([
  ['Get started', 'get-started'],
  ['Tutorials', 'tutorials'],
  ['Flows', 'flows'],
  ['Agents', 'agents'],
  ['Model Context Protocol (MCP)', 'mcp'],
  ['Develop', 'develop'],
  ['Deploy', 'deploy'],
  ['LFX', 'lfx'],
  ['Components reference', 'components'],
  ['API reference', 'api'],
  ['Contribute', 'contribute'],
  ['Support', 'support'],
]);

const titleTranslations = new Map([
  ['About Langflow', 'Langflow 소개'], ['Install Langflow', 'Langflow 설치'], ['Quickstart', '빠른 시작'],
  ['Create a vector RAG chatbot', '벡터 RAG 챗봇 만들기'], ['Create a chatbot that can ingest files', '파일을 수집하는 챗봇 만들기'],
  ['Connect applications to agents', '애플리케이션을 에이전트에 연결하기'], ['Connect to MCP servers from your application', '애플리케이션에서 MCP 서버에 연결하기'],
  ['Use the visual editor', '비주얼 편집기 사용'], ['Build flows', '플로 빌드'], ['Trigger flows with the Langflow API', 'Langflow API로 플로 실행'],
  ['Trigger flows with webhooks', '웹훅으로 플로 실행'], ['Human-in-the-Loop', 'Human-in-the-Loop'], ['Test flows', '플로 테스트'],
  ['Import and export flows', '플로 가져오기 및 내보내기'], ['Build flows and components with Langflow Assistant', 'Langflow Assistant로 플로와 컴포넌트 빌드'],
  ['Use Langflow agents', 'Langflow 에이전트 사용'], ['Configure tools for agents', '에이전트 도구 구성'], ['Use Langflow as an A2A server', 'Langflow를 A2A 서버로 사용'],
  ['Use Langflow as an MCP client', 'Langflow를 MCP 클라이언트로 사용'], ['Use Langflow as an MCP server', 'Langflow를 MCP 서버로 사용'],
  ['Langflow MCP Client for coding agents', '코딩 에이전트용 Langflow MCP Client'], ['Connect an Astra DB MCP server to Langflow', 'Astra DB MCP 서버를 Langflow에 연결'],
  ['Authentication and authorization overview', '인증과 권한 부여 개요'], ['API keys and authentication', 'API 키와 인증'], ['External authentication', '외부 인증'],
  ['Authorization', '권한 부여'], ['Install custom dependencies', '사용자 정의 의존성 설치'], ['Global variables', '전역 변수'], ['Environment variables', '환경 변수'],
  ['Manage files', '파일 관리'], ['Manage memory', '메모리 관리'], ['Use Session IDs', '세션 ID 사용'], ['Configure an external PostgreSQL database', '외부 PostgreSQL 데이터베이스 구성'],
  ['Database guide for enterprise administrators', '엔터프라이즈 관리자를 위한 데이터베이스 가이드'], ['Manage vector data', '벡터 데이터 관리'], ['Manage memory bases', '메모리 베이스 관리'],
  ['Logs', '로그'], ['Grafana and Loki', 'Grafana와 Loki'], ['Traces', '트레이스'], ['Telemetry', '텔레메트리'], ['Use Langflow data types', 'Langflow 데이터 타입 사용'],
  ['Use voice mode', '음성 모드 사용'], ['Use the Langflow CLI', 'Langflow CLI 사용'], ['Langflow deployment overview', 'Langflow 배포 개요'],
  ['Deploy a public Langflow server', '공개 Langflow 서버 배포'], ['Deploy Langflow with Nginx and SSL', 'Nginx와 SSL로 Langflow 배포'],
  ['Deploy flows on watsonx Orchestrate', 'watsonx Orchestrate에 플로 배포'], ['Containerize a Langflow application', 'Langflow 애플리케이션 컨테이너화'],
  ['Langflow Docker images', 'Langflow Docker 이미지'], ['Deploy Langflow on a remote server', '원격 서버에 Langflow 배포'], ['Deployment architecture', '배포 아키텍처'],
  ['Best practices', '모범 사례'], ['Deploy in development', '개발 환경 배포'], ['Deploy in production', '운영 환경 배포'], ['Google Cloud Platform', 'Google Cloud Platform 배포'],
  ['Hugging Face Spaces', 'Hugging Face Spaces 배포'], ['Railway', 'Railway 배포'], ['Render', 'Render 배포'], ['Deploy Langflow with multiple workers', '다중 워커로 Langflow 배포'],
  ['Block custom components', '사용자 정의 컴포넌트 차단'], ['Security', '보안'], ['About LFX', 'LFX 소개'], ['Install LFX', 'LFX 설치'], ['Run flows with LFX', 'LFX로 플로 실행'],
  ['Serve flows with LFX', 'LFX로 플로 서비스'], ['Pre-warm LFX', 'LFX 사전 준비'], ['Build flows with the LFX MCP server', 'LFX MCP 서버로 플로 빌드'],
  ['Flow DevOps Toolkit SDK', 'Flow DevOps Toolkit SDK'], ['LFX and Langflow version compatibility', 'LFX와 Langflow 버전 호환성'],
  ['Components overview', '컴포넌트 개요'], ['Create custom Python components', '사용자 정의 Python 컴포넌트 만들기'], ['Get started with the Langflow API', 'Langflow API 시작하기'],
  ['Use the TypeScript client', 'TypeScript 클라이언트 사용'], ['Flow trigger endpoints', '플로 실행 엔드포인트'], ['OpenAI Responses API', 'OpenAI Responses API'],
  ['Flow management endpoints', '플로 관리 엔드포인트'], ['Files endpoints', '파일 엔드포인트'], ['Projects endpoints', '프로젝트 엔드포인트'],
  ['Logs endpoints', '로그 엔드포인트'], ['Monitor endpoints', '모니터 엔드포인트'], ['Build endpoints', '빌드 엔드포인트'], ['Users endpoints', '사용자 엔드포인트'],
  ['Join the Langflow community', 'Langflow 커뮤니티 참여'], ['Contribute to Langflow', 'Langflow 기여'], ['Contribute components', '컴포넌트 기여'],
  ['Contribute component bundles', '컴포넌트 번들 기여'], ['Contribute component tests', '컴포넌트 테스트 기여'], ['Contribute templates', '템플릿 기여'],
  ['Troubleshoot', '문제 해결'], ['macOS support', 'macOS 지원'], ['Get help and request enhancements', '도움 요청과 개선 제안'],
  ['IBM Elite Support for Langflow', 'Langflow용 IBM Elite Support'], ['Release notes', '릴리스 노트'],
]);

const phraseTranslations = [
  [/^Overview$/i, '개요'], [/^Prerequisites?$/i, '사전 요구 사항'], [/^Installation$/i, '설치'], [/^Quickstart$/i, '빠른 시작'],
  [/^Configuration$/i, '구성'], [/^Usage$/i, '사용 방법'], [/^Examples?$/i, '예제'], [/^API reference$/i, 'API 참조'],
  [/^Troubleshooting$/i, '문제 해결'], [/^Next steps?$/i, '다음 단계'], [/^Limitations$/i, '제한 사항'], [/^Best practices$/i, '모범 사례'],
  [/^Environment variables$/i, '환경 변수'], [/^Authentication$/i, '인증'], [/^Authorization$/i, '권한 부여'], [/^Security$/i, '보안'],
  [/^Deploy(ment)?$/i, '배포'], [/^Create (.+)$/i, '$1 만들기'], [/^Configure (.+)$/i, '$1 구성'], [/^Use (.+)$/i, '$1 사용'],
  [/^Run (.+)$/i, '$1 실행'], [/^Manage (.+)$/i, '$1 관리'], [/^Install (.+)$/i, '$1 설치'], [/^Test (.+)$/i, '$1 테스트'],
];

const sourceExceptions = new Map([
  ['', 'Get-Started/about-langflow.mdx'],
  ['agent-tutorial', 'Tutorials/agent.mdx'],
  ['component-webhook', 'Components/webhook.mdx'],
  ['flow-devops-sdk', 'Lfx/lfx-devops-sdk.mdx'],
  ['a2a-agent-component', 'Components/a2a-agent.mdx'],
  ['troubleshoot', 'Support/troubleshooting.mdx'],
  ['macos-support', 'Support/macos-support-matrix.mdx'],
]);

const sourceDirectoryBySection = new Map([
  ['Get started', 'Get-Started'], ['Tutorials', 'Tutorials'], ['Flows', 'Flows'], ['Agents', 'Agents'], ['Model Context Protocol (MCP)', 'Agents'],
  ['Develop', 'Develop'], ['Deploy', 'Deployment'], ['LFX', 'Lfx'], ['Components reference', 'Components'], ['API reference', 'API-Reference'],
  ['Contribute', 'Contributing'], ['Support', 'Support'],
]);

function koreanTitle(title) {
  if (titleTranslations.has(title)) return titleTranslations.get(title);
  const direct = {
    Webhook: '웹훅', Parser: '파서', 'Split Text': '텍스트 분할', 'Type Convert': '타입 변환', 'API Request': 'API 요청',
    'Mock Data': '모의 데이터', URL: 'URL', 'Web Search': '웹 검색', 'File System': '파일 시스템', 'Knowledge Base': '지식 베이스',
    'Memory Base': '메모리 베이스', 'Read File': '파일 읽기', 'Write File': '파일 쓰기', 'If-Else': '조건 분기', 'Human Input': '사용자 입력',
    Loop: '반복', 'Notify and Listen': '알림과 수신', 'Run Flow': '플로 실행', 'Batch Run': '일괄 실행', Guardrails: '가드레일',
    Policies: '정책', 'Policies (Beta)': '정책(베타)', 'LLM Selector': 'LLM 선택기', 'Smart Router': '스마트 라우터', 'Smart Transform': '스마트 변환',
    'Structured Output': '구조화 출력', 'Language Model': '언어 모델', 'Prompt Template': '프롬프트 템플릿', Agents: '에이전트',
    'A2A Agent': 'A2A 에이전트', 'MCP Tools': 'MCP 도구', 'Embedding Model': '임베딩 모델', 'Message History': '메시지 기록',
    Calculator: '계산기', 'Current Date': '현재 날짜', 'Python Interpreter': 'Python 인터프리터', 'SQL Database': 'SQL 데이터베이스',
    'Legacy core components': '레거시 코어 컴포넌트', 'Chat Input and Output': '채팅 입력과 출력', 'Data Operations': '데이터 연산',
    'Dynamic Create Data': '동적 데이터 생성', Arize: 'Arize 연동', Langfuse: 'Langfuse 연동', LangSmith: 'LangSmith 연동',
    LangWatch: 'LangWatch 연동', Openlayer: 'Openlayer 연동', Opik: 'Opik 연동', Traceloop: 'Traceloop 연동',
  };
  return direct[title] ?? title;
}

function translateHeading(heading) {
  const cleaned = heading.replace(/\{#[^}]+\}/g, '').trim();
  const exact = koreanTitle(cleaned);
  if (exact !== cleaned) return exact;
  for (const [pattern, replacement] of phraseTranslations) {
    if (pattern.test(cleaned)) return cleaned.replace(pattern, replacement);
  }
  return cleaned;
}

function parseEntries(content) {
  const entries = [];
  let top = '';
  let section = '';
  for (const line of content.split(/\r?\n/)) {
    const topMatch = line.match(/^##\s+(.+)$/);
    if (topMatch) {
      top = topMatch[1].trim();
      section = '';
      continue;
    }
    const sectionMatch = line.match(/^\s*-?\s*(\S[^:]*?)\s*$/);
    if (sectionMatch && sectionDirectories.has(sectionMatch[1].trim())) {
      section = sectionMatch[1].trim();
      continue;
    }
    const linkMatch = line.match(/^\s*-?\s*([^:]+?)\s*:\s*<(https:\/\/docs\.langflow\.org[^>]*)>/);
    const apiMatch = line.match(/^\s*-\s*\(Langflow API specification\)<(https:\/\/docs\.langflow\.org\/api)>/);
    const markdownLinkMatch = line.match(/^\s*-?\s*([^:]+?)\s*:\s*\[(https:\/\/docs\.langflow\.org[^\]]*)\]/);
    const match = linkMatch ?? markdownLinkMatch;
    if (apiMatch) {
      entries.push({ top, section: 'API reference', title: 'Langflow API specification', url: apiMatch[1] });
    } else if (match?.[2]) {
      entries.push({ top, section, title: match[1].replace(/^[-\s]+/, '').trim(), url: match[2].trim() });
    }
  }
  return entries;
}

function slugFromUrl(url) {
  const pathname = new URL(url).pathname.replace(/^\/+|\/+$/g, '');
  return pathname.replace(/^next\//, '');
}

function locateSource(entry) {
  const slug = slugFromUrl(entry.url);
  if (sourceExceptions.has(slug)) return sourceExceptions.get(slug);
  if (slug === 'api') return null;
  const sourceDirectory = sourceDirectoryBySection.get(entry.section);
  const expected = sourceDirectory ? `${sourceDirectory}/${slug}.mdx` : null;
  if (expected && fs.existsSync(path.join(upstreamDocsPath, expected))) return expected;
  const matches = [];
  for (const directory of fs.readdirSync(upstreamDocsPath, { withFileTypes: true }).filter((item) => item.isDirectory())) {
    for (const extension of ['.mdx', '.md']) {
      const candidate = `${directory.name}/${slug}${extension}`;
      if (fs.existsSync(path.join(upstreamDocsPath, candidate))) matches.push(candidate);
    }
  }
  return matches.length === 1 ? matches[0] : null;
}

function extractHeadings(source) {
  if (!source) return [];
  const text = fs.readFileSync(path.join(upstreamDocsPath, source), 'utf8');
  let inFence = false;
  const headings = [];
  for (const line of text.split(/\r?\n/)) {
    if (/^```/.test(line.trim())) inFence = !inFence;
    if (inFence) continue;
    const match = line.match(/^#{2,3}\s+(.+)$/);
    if (match && !match[1].includes('{/*')) headings.push(match[1].replace(/<[^>]+>/g, '').trim());
  }
  return [...new Set(headings)].slice(0, 14);
}

function purposeText(entry, title) {
  if (entry.section === 'Components reference') return `Langflow 비주얼 편집기에서 **${title}** 컴포넌트를 연결하고 설정할 때 필요한 핵심 항목을 안내하는 문서임.`;
  if (entry.section === 'API reference') return `Langflow의 **${title}** 기능을 API 클라이언트에서 호출할 때 확인해야 하는 인증, 요청, 응답 및 실행 흐름을 안내하는 문서임.`;
  if (entry.section === 'Deploy') return `**${title}**을 기준으로 Langflow 실행 환경을 설계·구성·검증하기 위한 배포 안내서임.`;
  if (entry.section === 'Contribute') return `Langflow 프로젝트에 **${title}** 방식으로 참여할 때 필요한 절차와 품질 기준을 안내하는 문서임.`;
  if (entry.section === 'Support') return `Langflow 사용 중 **${title}** 관련 상태를 확인하고 후속 조치를 수행하기 위한 지원 안내서임.`;
  return `Langflow에서 **${title}** 기능을 이해하고 구성·실행·검증하기 위한 한국어 안내서임.`;
}

function operationalNotes(entry) {
  const notes = [
    '명령어, API 경로, JSON 키, 환경 변수명 및 컴포넌트 이름은 원문 표기를 유지할 것.',
    '실행 전 설치 버전과 공식 문서의 지원 범위를 확인할 것.',
  ];
  if (entry.section === 'Deploy' || entry.section === 'Develop') notes.push('운영 환경에서는 인증, 비밀값 관리, 네트워크 노출 및 로그 보존 정책을 별도로 검토할 것.');
  if (entry.section === 'API reference') notes.push('API 키를 소스 코드나 Git 저장소에 직접 기록하지 말고 비밀 관리 수단을 사용할 것.');
  if (entry.section === 'Components reference') notes.push('입력·출력 포트의 데이터 타입과 필수 필드를 연결 전에 확인할 것.');
  return notes;
}

function renderManual(entry, source, duplicateOf = null) {
  const title = koreanTitle(entry.title);
  const headings = extractHeadings(source);
  const sourceUrl = source
    ? `https://github.com/langflow-ai/langflow/blob/${sourceSha}/docs/docs/${source}`
    : 'https://docs.langflow.org/api';
  const lines = [
    '---',
    `title: "${title.replaceAll('"', '\\"')}"`,
    `source_url: "${entry.url}"`,
    `source_commit: "${sourceSha}"`,
    `source_file: "${source ?? 'API 명세 UI'}"`,
    'translation_type: "한국어 요약 번역"',
    '---',
    '',
    `# ${title}`,
    '',
    purposeText(entry, title),
    '',
    '> 이 문서는 공식 Langflow 문서를 바탕으로 작성한 한국어 요약 매뉴얼임. 버전별 옵션과 전체 예제는 아래 공식 원문 확인 필요.',
    '',
    '## 문서 정보',
    '',
    `- 공식 문서: [${entry.url}](${entry.url})`,
    `- 원본 소스: [${source ?? 'Langflow API specification'}](${sourceUrl})`,
    `- 기준 커밋: \`${sourceSha}\``,
  ];
  if (duplicateOf) lines.push(`- 중복 문서 통합 대상: [${duplicateOf}](./${duplicateOf})`);
  lines.push('', '## 주요 내용', '');
  if (headings.length) {
    for (const heading of headings) {
      const translated = translateHeading(heading);
      lines.push(`- ${translated}${translated === heading ? '' : ` (${heading})`}`);
    }
  } else {
    lines.push('- 공개 API 명세에서 엔드포인트, 스키마, 인증 방식 및 응답 코드를 조회하는 방법');
  }
  lines.push('', '## 사용 절차', '');
  if (entry.section === 'Components reference') {
    lines.push('1. 비주얼 편집기에서 해당 컴포넌트를 플로에 추가.', '2. 필수 입력값과 연결 포트의 데이터 타입 확인.', '3. 자격 증명과 실행 옵션 구성.', '4. Playground 또는 API 실행으로 출력 검증.', '5. 오류 발생 시 컴포넌트 출력과 서버 로그를 함께 확인.');
  } else if (entry.section === 'API reference') {
    lines.push('1. Langflow 서버 URL과 API 인증 방식 확인.', '2. 공식 예제에서 엔드포인트와 필수 요청 필드 확인.', '3. 개발 환경에서 최소 요청으로 응답 스키마 검증.', '4. 오류 코드, 재시도 및 타임아웃 처리 추가.', '5. 운영 비밀값과 호출 로그의 노출 여부 점검.');
  } else {
    lines.push('1. 공식 문서의 사전 요구 사항과 지원 버전 확인.', '2. 원문 순서에 따라 설정값과 연결 관계 구성.', '3. 최소 예제로 기능 동작 확인.', '4. 로그와 출력값을 기준으로 오류 여부 검증.', '5. 운영 적용 전 보안·성능·복구 기준 점검.');
  }
  lines.push('', '## 적용 시 주의 사항', '');
  for (const note of operationalNotes(entry)) lines.push(`- ${note}`);
  lines.push('', '## 원문 세부 내용 확인', '', `설정 필드, 전체 코드 예제, 버전별 제한 사항과 화면 이미지는 [공식 문서](${entry.url}) 및 [GitHub 원본](${sourceUrl})에서 확인 가능.`, '');
  return lines.join('\n');
}

const entries = parseEntries(fs.readFileSync(urlPagePath, 'utf8'));
fs.mkdirSync(outputPath, { recursive: true });
const seenUrls = new Map();
const generated = [];
const unresolved = [];

for (const entry of entries) {
  const topDirectory = topDirectories.get(entry.top);
  const sectionDirectory = sectionDirectories.get(entry.section);
  if (!topDirectory || !sectionDirectory) {
    unresolved.push({ ...entry, reason: '메뉴 디렉터리 매핑 실패' });
    continue;
  }
  const slug = slugFromUrl(entry.url) || 'about-langflow';
  const relativeFile = `${topDirectory}/${sectionDirectory}/${slug}.md`;
  if (seenUrls.has(entry.url)) continue;
  const source = locateSource(entry);
  if (!source && slug !== 'api') unresolved.push({ ...entry, reason: '공식 MDX 원본 탐색 실패' });
  const target = path.join(outputPath, relativeFile);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, renderManual(entry, source), 'utf8');
  seenUrls.set(entry.url, relativeFile);
  generated.push({ ...entry, relativeFile, source });
}

for (const [topLabel, topDirectory] of topDirectories) {
  const pages = generated.filter((item) => item.top === topLabel);
  const index = [`# ${topLabel} 한국어 매뉴얼`, '', `총 ${pages.length}개 페이지 요약 번역.`, ''];
  for (const section of [...new Set(pages.map((item) => item.section))]) {
    index.push(`## ${section}`, '');
    for (const page of pages.filter((item) => item.section === section)) {
      index.push(`- [${koreanTitle(page.title)}](./${page.relativeFile.split('/').slice(1).join('/')})`);
    }
    index.push('');
  }
  fs.writeFileSync(path.join(outputPath, topDirectory, 'README.md'), index.join('\n'), 'utf8');
}

const rootReadme = [
  '# Langflow 한국어 매뉴얼', '',
  `공식 Langflow 문서와 \`URL_PAGE.md\`를 기준으로 작성한 페이지별 한국어 요약 번역 모음. 기준 커밋: \`${sourceSha}\`.`, '',
  '## 상위 메뉴', '',
  ...[...topDirectories].map(([label, directory]) => `- [${label}](./${directory}/README.md)`),
  '', '## 범위 및 원칙', '',
  `- 입력 URL ${entries.length}개, 고유 URL ${seenUrls.size}개 기준.`,
  '- 명령어, API 경로, 코드 식별자, 환경 변수명과 제품명은 원문 유지.',
  '- 각 페이지에 공식 문서 URL, GitHub 원본 파일과 기준 커밋 기록.',
  '- 이 자료는 전체 원문의 축약 번역이므로 정확한 버전별 옵션은 공식 원문과 함께 확인 필요.',
  '', '## 검증 결과', '',
  `- 생성된 본문 파일: ${generated.length}개`,
  `- 원본을 찾지 못한 URL: ${unresolved.length}개`,
  '- URL 중복은 하나의 파일로 통합.',
  '', '자세한 소스 매핑과 MDX 보존 기준은 [조사 보고서](../research/langflow-docs-source-map.md) 참고.', '',
];
fs.writeFileSync(path.join(outputPath, 'README.md'), rootReadme.join('\n'), 'utf8');
fs.writeFileSync(path.join(outputPath, 'manifest.json'), `${JSON.stringify({ sourceSha, entries: generated, unresolved }, null, 2)}\n`, 'utf8');

console.log(JSON.stringify({ parsed: entries.length, unique: seenUrls.size, generated: generated.length, unresolved }, null, 2));
