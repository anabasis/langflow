# Langflow 한국어 매뉴얼 소스 조사 및 URL 매핑

조사일: 2026-08-08  
대상: [`URL_PAGE.md`](../../URL_PAGE.md)에 수록된 `docs.langflow.org` URL과 Langflow 공식 저장소 `main` 브랜치

## 결론

- 원문 콘텐츠의 기준 위치는 공식 저장소의 [`docs/docs`](https://github.com/langflow-ai/langflow/tree/main/docs/docs)이며, 현재 최상위 콘텐츠 디렉터리는 `Get-Started`, `Tutorials`, `Flows`, `Agents`, `Develop`, `Deployment`, `Lfx`, `Components`, `API-Reference`, `Contributing`, `Support` 구조임.
- `https://docs.langflow.org/next/<slug>`의 `next`는 저장소 디렉터리가 아니며, 실제 원문은 대체로 `docs/docs/<영역>/<slug>.mdx`에 대응함. 따라서 한국어 산출물에서는 URL의 `next`를 디렉터리로 만들지 않고 `URL_PAGE.md`의 상위 메뉴를 서브디렉터리로 사용하는 편이 적합함.
- URL 항목 142개(고유 URL 141개) 중 대부분은 파일명으로 직접 대응하며, 파일명이 다른 예외 7개와 `docs/docs` 밖에서 처리해야 할 API 명세 1개가 존재함.
- Langflow 문서는 단순 Markdown이 아니라 Docusaurus MDX이므로 본문만 번역하고 front matter, import/export, JSX 컴포넌트, 코드, 변수, 링크 대상, 이미지 경로, admonition 구문은 구조 보존이 필요함.

## 권장 한국어 디렉터리 구조

사용자가 지정한 상위 메뉴를 그대로 디렉터리 경계로 사용하고, 그 아래에서 공식 소스 영역을 반영하는 구조가 가장 추적하기 쉬운 구성임.

```text
codex/
├── build/
│   ├── get-started/
│   ├── tutorials/
│   ├── flows/
│   ├── agents/
│   └── mcp/
├── develop-deploy/
│   ├── develop/
│   ├── deploy/
│   └── lfx/
├── reference/
│   ├── components/
│   └── api/
└── community/
    ├── contribute/
    └── support/
```

한국어 파일명보다 원문 슬러그를 유지하는 방식을 권장함. 예: `build/get-started/get-started-installation.md`. URL 역추적, 링크 검사, 원문 갱신 비교가 쉬워지는 장점임.

## URL에서 공식 소스로의 기본 매핑

아래 표의 `슬러그 목록`은 각 URL의 마지막 경로 요소임. 별도 표에 명시한 예외를 제외하면 `<공식 디렉터리>/<슬러그>.mdx`가 원문임.

| URL_PAGE 상위/하위 메뉴 | 공식 원문 디렉터리 | 슬러그 목록 |
|---|---|---|
| BUILD / Get started | [`docs/docs/Get-Started`](https://github.com/langflow-ai/langflow/tree/main/docs/docs/Get-Started) | `get-started-installation`, `get-started-quickstart` |
| BUILD / Tutorials | [`docs/docs/Tutorials`](https://github.com/langflow-ai/langflow/tree/main/docs/docs/Tutorials) | `chat-with-rag`, `chat-with-files`, `mcp-tutorial` |
| BUILD / Flows | [`docs/docs/Flows`](https://github.com/langflow-ai/langflow/tree/main/docs/docs/Flows) | `concepts-overview`, `concepts-flows`, `concepts-publish`, `webhook`, `human-in-the-loop`, `concepts-playground`, `concepts-flows-import`, `langflow-assistant` |
| BUILD / Agents | [`docs/docs/Agents`](https://github.com/langflow-ai/langflow/tree/main/docs/docs/Agents) | `agents`, `agents-tools`, `a2a-server` |
| BUILD / MCP | [`docs/docs/Agents`](https://github.com/langflow-ai/langflow/tree/main/docs/docs/Agents) | `mcp-client`, `mcp-server`, `langflow-mcp-client`, `mcp-component-astra` |
| Develop & Deploy / 인증·개발 | [`docs/docs/Develop`](https://github.com/langflow-ai/langflow/tree/main/docs/docs/Develop) | `authentication-overview`, `api-keys-and-authentication`, `external-authentication`, `authorization`, `install-custom-dependencies`, `configuration-global-variables`, `environment-variables` |
| Develop & Deploy / 저장소·메모리 | [`docs/docs/Develop`](https://github.com/langflow-ai/langflow/tree/main/docs/docs/Develop) | `concepts-file-management`, `memory`, `session-id`, `configuration-custom-database`, `enterprise-database-guide`, `knowledge`, `memory-bases` |
| Develop & Deploy / 관측성 | [`docs/docs/Develop`](https://github.com/langflow-ai/langflow/tree/main/docs/docs/Develop) | `logging`, `observability-grafana-loki`, `traces`, `integrations-arize`, `integrations-langfuse`, `integrations-langsmith`, `integrations-langwatch`, `integrations-openlayer`, `integrations-opik`, `integrations-instana-traceloop`, `contributing-telemetry` |
| Develop & Deploy / 기타 개발 | [`docs/docs/Develop`](https://github.com/langflow-ai/langflow/tree/main/docs/docs/Develop) | `data-types`, `concepts-voice-mode`, `configuration-cli` |
| Develop & Deploy / Deploy | [`docs/docs/Deployment`](https://github.com/langflow-ai/langflow/tree/main/docs/docs/Deployment) | `deployment-overview`, `deployment-public-server`, `deployment-nginx-ssl`, `deployment-wxo`, `develop-application`, `deployment-docker`, `deployment-caddyfile`, `deployment-architecture`, `deployment-prod-best-practices`, `deployment-kubernetes-dev`, `deployment-kubernetes-prod`, `deployment-gcp`, `deployment-hugging-face-spaces`, `deployment-railway`, `deployment-render`, `deployment-multi-worker`, `deployment-block-custom-components`, `security` |
| Develop & Deploy / LFX | [`docs/docs/Lfx`](https://github.com/langflow-ai/langflow/tree/main/docs/docs/Lfx) | `lfx-overview`, `lfx-install`, `lfx-run`, `lfx-serve`, `lfx-prewarm`, `lfx-mcp`, `lfx-compatibility` |
| Reference / Components 개요 | [`docs/docs/Components`](https://github.com/langflow-ai/langflow/tree/main/docs/docs/Components) | `concepts-components`, `chat-input-and-output` |
| Reference / Processing·Data Source | [`docs/docs/Components`](https://github.com/langflow-ai/langflow/tree/main/docs/docs/Components) | `operations`, `dynamic-create-data`, `parser`, `split-text`, `type-convert`, `api-request`, `mock-data`, `url`, `web-search` |
| Reference / Files·Flow Controls | [`docs/docs/Components`](https://github.com/langflow-ai/langflow/tree/main/docs/docs/Components) | `file-system`, `knowledge-base`, `memory-base`, `read-file`, `write-file`, `if-else`, `human-input`, `loop`, `notify-and-listen`, `run-flow` |
| Reference / LLM Operations | [`docs/docs/Components`](https://github.com/langflow-ai/langflow/tree/main/docs/docs/Components) | `batch-run`, `guardrails`, `policies`, `llm-selector`, `smart-router`, `smart-transform`, `structured-output` |
| Reference / Models·Agents | [`docs/docs/Components`](https://github.com/langflow-ai/langflow/tree/main/docs/docs/Components) | `components-models`, `components-prompts`, `components-agents`, `mcp-tools`, `components-embedding-models`, `message-history` |
| Reference / Utilities·Custom | [`docs/docs/Components`](https://github.com/langflow-ai/langflow/tree/main/docs/docs/Components) | `calculator`, `current-date`, `python-interpreter`, `sql-database`, `legacy-core-components`, `components-custom-components` |
| Reference / API | [`docs/docs/API-Reference`](https://github.com/langflow-ai/langflow/tree/main/docs/docs/API-Reference) | `api-reference-api-examples`, `typescript-client`, `api-flows-run`, `api-openai-responses`, `api-flows`, `api-files`, `api-projects`, `api-logs`, `api-monitor`, `api-build`, `api-users` |
| Community / Contribute | [`docs/docs/Contributing`](https://github.com/langflow-ai/langflow/tree/main/docs/docs/Contributing) | `contributing-community`, `contributing-how-to-contribute`, `contributing-components`, `contributing-bundles`, `contributing-component-tests`, `contributing-templates` |
| Community / Support | [`docs/docs/Support`](https://github.com/langflow-ai/langflow/tree/main/docs/docs/Support) | `contributing-github-issues`, `luna-for-langflow`, `release-notes` |

## 파일명이 다른 예외와 특수 페이지

| 공개 URL | 현재 공식 소스 | 처리 지침 |
|---|---|---|
| `/` | [`Get-Started/about-langflow.mdx`](https://github.com/langflow-ai/langflow/blob/main/docs/docs/Get-Started/about-langflow.mdx) | 한국어 `about-langflow.md`로 생성 |
| `/agent-tutorial` | [`Tutorials/agent.mdx`](https://github.com/langflow-ai/langflow/blob/main/docs/docs/Tutorials/agent.mdx) | 공개 슬러그와 파일명 불일치 보존 |
| `/next/component-webhook` | [`Components/webhook.mdx`](https://github.com/langflow-ai/langflow/blob/main/docs/docs/Components/webhook.mdx) | `Flows/webhook.mdx`와 혼동 금지 |
| `/next/flow-devops-sdk` | [`Lfx/lfx-devops-sdk.mdx`](https://github.com/langflow-ai/langflow/blob/main/docs/docs/Lfx/lfx-devops-sdk.mdx) | 공개 슬러그 기준 산출 파일명 권장 |
| `/next/a2a-agent-component` | [`Components/a2a-agent.mdx`](https://github.com/langflow-ai/langflow/blob/main/docs/docs/Components/a2a-agent.mdx) | 공개 슬러그 기준 산출 파일명 권장 |
| `/next/troubleshoot` | [`Support/troubleshooting.mdx`](https://github.com/langflow-ai/langflow/blob/main/docs/docs/Support/troubleshooting.mdx) | 단수 URL과 동명 파일 부재 확인 |
| `/next/macos-support` | [`Support/macos-support-matrix.mdx`](https://github.com/langflow-ai/langflow/blob/main/docs/docs/Support/macos-support-matrix.mdx) | [`Deployment/deployment-macos-support.mdx`](https://github.com/langflow-ai/langflow/blob/main/docs/docs/Deployment/deployment-macos-support.mdx)와 구분 |
| `/api` | [공개 Langflow API specification](https://docs.langflow.org/api) | 일반 MDX 페이지와 별도 취급, API 명세 UI 전체 복제 대상에서 제외 권장 |

`URL_PAGE.md`의 `Authentication and authorization`, `Bundles`, `Extensions`, `Developer API (Beta)`는 URL이 비어 있는 메뉴 그룹이므로 독립 번역 파일이 아니라 하위 페이지용 목차로 처리하는 편이 적합함. `Grafana and Loki` URL은 목록에 두 번 등장하지만 원문은 동일한 `Develop/observability-grafana-loki.mdx` 한 파일임.

## 번역 시 반드시 보존할 MDX 요소

Docusaurus는 Markdown과 `.mdx`를 MDX 컴파일러로 React 컴포넌트로 변환하며, front matter는 문서 최상단의 YAML 메타데이터임. 따라서 일반 자연어 문장만 번역 대상으로 삼는 정책이 필요함. 근거는 Docusaurus 공식 [Markdown Features](https://docusaurus.io/docs/markdown-features)와 [MDX and React](https://docusaurus.io/docs/markdown-features/react) 문서임.

| 요소 | 보존·번역 정책 | 이유 |
|---|---|---|
| YAML front matter `--- ... ---` | 키, `id`, `slug`, `sidebar_*`, pagination, custom 필드 보존. `title`, `description`, 키워드 값만 선별 번역 | 라우팅·탐색·SEO 메타데이터 유지 |
| `import` / `export` | 문장 포함 문자열이 아닌 한 원문 그대로 보존 | MDX 컴포넌트와 partial 로딩 유지 |
| JSX 태그·속성 | 태그명, 속성명, `{}` 표현식, 경로 보존. 화면에 표시되는 문자열만 번역 | MDX가 실제 React 컴포넌트로 컴파일되는 구조 |
| fenced code block·인라인 코드 | 코드, 명령, API 경로, 환경 변수, JSON 키, 모델명 미번역. 코드 블록 전후 설명만 번역 | 실행 가능성과 복사 정확성 유지 |
| admonition | `:::note`, `:::tip`, `:::info`, `:::warning`, `:::danger` 식별자와 여닫는 `:::` 보존, 제목·본문만 번역 | Docusaurus [Admonitions](https://docusaurus.io/docs/markdown-features/admonitions) 구문 유지 |
| Tabs·Steps·Cards 등 컴포넌트 | import와 컴포넌트 구조 보존, 사람이 읽는 label·본문만 번역 | 탭·단계형 UI 렌더링 유지 |
| 이미지·정적 자산 | 상대 경로, `/img/...`, import 변수 보존. alt text와 caption만 번역 | Docusaurus 자산 변환과 빌드 해시 유지. 공식 [Assets](https://docusaurus.io/docs/markdown-features/assets) 참고 |
| 링크 | 대상 URL·앵커 보존, 링크 표시문만 번역. 내부 링크는 한국어 산출물 상대 경로로 후처리 | 끊어진 링크 방지 |
| HTML·MDX 특수문자 | `{`, `<`, JSX 주석, escape를 임의 변경하지 않음 | MDX의 엄격한 파싱 규칙 유지 |
| partial 파일 | `_partial-*.mdx` import를 발견하면 해당 partial도 함께 확보·번역하거나 import를 펼친 독립 Markdown으로 변환 | 누락된 본문과 빌드 오류 방지 |

## 구현 권고

1. 원문 기준 SHA 또는 조사일을 각 한국어 파일에 주석으로 기록하는 방식 권장.
2. 원문 `.mdx`를 내려받아 front matter와 MDX 토큰을 보호한 뒤 prose 영역만 번역하는 방식 권장.
3. 공개 URL별 한국어 파일 하나를 생성하고, 중복 URL은 한 파일로 통합하는 방식 권장.
4. 빌드 목적이 아니라 GitHub에서 읽는 매뉴얼 목적이라면 복잡한 JSX 컴포넌트는 표준 Markdown으로 평탄화하되 코드·명령·자산 링크는 보존하는 방식 권장.
5. 생성 후 URL 개수 대비 파일 개수, 코드 펜스 균형, front matter 균형, 로컬 링크, 이미지 링크를 자동 검사하는 검증 필요.

## 조사 범위와 한계

- 공식 1차 출처만 사용한 조사임: Langflow 공식 GitHub 저장소, Langflow 공식 문서 사이트, Docusaurus 공식 문서.
- 매핑은 2026-08-08의 `main` 트리 기준이며, `URL_PAGE.md`의 공개 URL이 `main`보다 앞서거나 뒤서는 시점에는 front matter의 `slug` 또는 리다이렉트로 파일명이 달라질 가능성 존재.
- `Bundles`와 `Extensions`는 `URL_PAGE.md`에 개별 URL이 없지만 현재 공식 트리에는 `Components/bundles-*.mdx`, `Components/components-bundles.mdx`, `Lfx/extensions-*.mdx`가 존재하므로, 요청 범위를 URL 목록으로 엄격히 제한할지 전체 공식 문서까지 확장할지 별도 결정 필요.

## 공식 출처

- [Langflow 공식 문서 소스 루트](https://github.com/langflow-ai/langflow/tree/main/docs/docs)
- [Langflow 공식 문서 사이트](https://docs.langflow.org/)
- [Langflow Docusaurus 설정](https://github.com/langflow-ai/langflow/blob/main/docs/docusaurus.config.js)
- [Langflow 사이드바 설정](https://github.com/langflow-ai/langflow/blob/main/docs/sidebars.js)
- [Docusaurus Markdown 및 front matter](https://docusaurus.io/docs/markdown-features)
- [Docusaurus MDX와 React import](https://docusaurus.io/docs/markdown-features/react)
- [Docusaurus admonition](https://docusaurus.io/docs/markdown-features/admonitions)
- [Docusaurus assets](https://docusaurus.io/docs/markdown-features/assets)
