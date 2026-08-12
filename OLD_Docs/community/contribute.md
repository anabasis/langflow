# Langflow에 기여하기

이 가이드는 Langflow에 기여를 시작하는 데 도움을 드리기 위한 것입니다. 빠르게 발전하는 분야의 오픈 소스 코드베이스로서 Langflow는 새로운 기능, 향상된 인프라, 더 나은 문서화 등 다양한 형태의 기여를 환영합니다.

---

## Langflow 서비스 개요

Langflow는 두 가지 주요 서비스로 구성됩니다:

- **프론트엔드**: 사용자 인터페이스를 제공하는 React/TypeScript 애플리케이션
- **백엔드**: API 요청을 처리하는 Python/FastAPI 서비스

개발 중 프론트엔드와 백엔드 서비스는 다른 포트에서 별도로 실행됩니다:
- 프론트엔드 개발 서버: `http://localhost:3000` (핫 리로드 포함)
- 백엔드 API 서버: `http://localhost:7860`

---

## 소스에서 Langflow 설치

### 사전 요구사항

- Python 3.10 ~ 3.14
- uv 버전 0.4 이상
- Node.js
- Make (Linux 및 macOS만 해당)

### Langflow 저장소 클론

1. [Langflow GitHub 저장소](https://github.com/langflow-ai/langflow)를 포크합니다.

2. 새 원격을 로컬 저장소에 추가합니다:

```bash
git remote add FORK_NAME https://github.com/GIT_USERNAME/langflow.git
```

### 소스에서 Langflow 실행 (macOS/Linux)

저장소 루트에서:

```bash
make run_cli
```

이 명령은 다음을 수행합니다:
- 프론트엔드 및 백엔드 의존성 설치
- 프론트엔드 정적 파일 빌드
- 기본 설정으로 애플리케이션 시작

### 개발 환경 설정

핫 리로드로 코드 변경을 개발하고 테스트하려는 기여자를 위한 설정:

1. Langflow 개발 환경 설정:

```bash
make init
```

2. 별도 터미널에서 백엔드와 프론트엔드를 실행합니다:

```bash
# 백엔드 실행 (핫 리로드 포함)
make backend

# 다른 터미널에서 프론트엔드 실행 (핫 리로드 포함)
make frontend
```

---

## 문서 기여

문서는 [Docusaurus](https://docusaurus.io/)로 구축되고 Markdown으로 작성됩니다.

1. [Langflow GitHub 저장소](https://github.com/langflow-ai/langflow)를 포크합니다.

2. `/docs` 디렉토리로 이동합니다:

```bash
cd docs
```

3. 의존성을 설치하고 핫 리로드가 있는 로컬 Docusaurus 정적 사이트를 시작합니다:

```bash
npm install
npm run start
```

문서는 `http://localhost:3000`에서 제공됩니다.

4. `langflow/docs/docs` 디렉토리의 `.mdx` 파일을 편집하여 콘텐츠를 만듭니다.

---

## 풀 리퀘스트 열기

1. 활성 `release-X.Y.Z` 릴리스 후보 브랜치에 대해 GitHub 풀 리퀘스트를 엽니다. `main`을 대상으로 하지 마세요.

2. PR 제목이 시맨틱 커밋 규칙을 따르도록 합니다. 예: 기능의 경우 `feat: 새 기능 추가`, 수정의 경우 `fix: X 문제 수정`.

3. PR 설명에 문제와 해결책을 명확히 기술합니다. PR이 이슈를 수정하는 경우 `Fixes #1234`로 이슈를 링크합니다.

4. Langflow 유지 관리자가 풀 리퀘스트를 검토하고 변경을 요청할 수 있습니다.

---

## 추가 기여 가이드

- [번들 기여](https://docs.langflow.org/next/contributing-bundles)
- [컴포넌트 기여](https://docs.langflow.org/next/contributing-components)
- [테스트 기여](https://docs.langflow.org/next/contributing-component-tests)
- [템플릿 기여](https://docs.langflow.org/next/contributing-templates)

---

*원문: https://docs.langflow.org/next/contributing-how-to-contribute*
