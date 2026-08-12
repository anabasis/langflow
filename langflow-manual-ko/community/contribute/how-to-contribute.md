# Langflow에 기여하기

> 원문: https://docs.langflow.org/next/contributing-how-to-contribute

이 가이드는 여러분이 Langflow에 기여를 시작하는 데 도움을 주기 위해 작성되었습니다.
빠르게 발전하는 분야의 오픈소스 코드베이스로서, Langflow는 새로운 기능, 인프라 개선, 문서 개선 등 어떤 형태로든 기여를 환영합니다.

Langflow에 코드나 문서를 기여하려면 [풀 리퀘스트 가이드](#open-a-pull-request)를 따라주세요.

## Langflow 서비스 개요[​](#langflow-services-overview "Direct link to Langflow services overview")

이 개요는 개발 환경을 설정하는 방법을 이해하는 데 도움이 됩니다.

Langflow는 두 가지 주요 서비스로 구성됩니다.

- 프런트엔드: 사용자 인터페이스를 제공하는 React/TypeScript 애플리케이션.
- 백엔드: API 요청을 처리하는 Python/FastAPI 서비스.

개발 중에는 프런트엔드와 백엔드 서비스가 서로 다른 포트에서 별도로 실행됩니다.

- 프런트엔드 개발 서버: `http://localhost:3000` (핫 리로드 포함).
- 백엔드 API 서버: `http://localhost:7860`.

일반 사용자로서 Langflow를 설치하면, 백엔드가 내부적으로 프런트엔드를 서비스하여 두 서비스 모두 단일 포트(기본값 `7860`)에서 사용할 수 있게 됩니다.

## 소스에서 Langflow 설치하기[​](#install-langflow-from-source "Direct link to Install Langflow from source")

저장소를 포크하고 개발 환경을 설정하여 소스에서 Langflow를 설치합니다.

### 사전 요구 사항[​](#prerequisites "Direct link to Prerequisites")

- [Python](https://www.python.org/downloads/) 3.10 ~ 3.14
- [uv](https://docs.astral.sh/uv/getting-started/installation/) 0.4 버전 이상
- [Node.js](https://nodejs.org/en/download/package-manager)
- [Make](https://www.gnu.org/software/make/#documentation) (Linux 및 macOS 전용)

### Langflow 저장소 클론하기[​](#clone-the-langflow-repository "Direct link to Clone the Langflow repository")

1. [Langflow GitHub 저장소](https://github.com/langflow-ai/langflow)를 포크합니다.

2. 로컬 머신에 있는 로컬 저장소에 새 remote를 추가합니다.

```
git remote add FORK_NAME https://github.com/GIT_USERNAME/langflow.git
```

다음 항목을 대체하세요.

- `FORK_NAME`: 여러분의 저장소 포크에 대한 이름
- `GIT_USERNAME`: 여러분의 Git 사용자 이름

### 소스에서 Langflow 실행하기[​](#run-langflow-from-source "Direct link to Run Langflow from source")

저장소를 클론한 후에는 코드베이스에 기여하지 않더라도 소스에서 Langflow를 실행할 수 있습니다.
이 방법은 프런트엔드를 빌드하고 백엔드를 통해 포트 `7860`에서 서비스합니다.

아래 안내는 소스에서 Langflow를 실행하는 방법에 대한 것입니다. 핫 리로드를 사용한 개발은 [개발 환경 설정하기](#set-up-your-langflow-development-environment)를 참고하세요.

**macOS/Linux에서 소스로 실행하기**

터미널에서 Langflow 디렉터리의 루트로 이동한 다음 `make run_cli`를 실행합니다.

이 명령은 다음을 수행합니다.

- 프런트엔드 및 백엔드 종속성 설치
- 프런트엔드 정적 파일 빌드
- 기본 설정으로 애플리케이션 시작

Langflow 프런트엔드는 `http://localhost:7860`에서 서비스됩니다.

**Windows CMD로 소스에서 실행하기**

Windows에서 소스로 Langflow를 실행하려면 Langflow 저장소에 포함된 스크립트를 사용하거나 터미널에서 직접 명령을 실행할 수 있습니다.

다음 중 하나를 수행하세요.

- 포함된 Windows Batch 파일로 Langflow를 설치하고 실행하려면 `scripts/windows` 디렉터리로 이동한 다음 `build_and_run.bat` 파일을 실행합니다.

- Windows 명령줄에서 Langflow를 실행하려면 다음을 수행합니다.

  1. 프런트엔드 정적 파일을 빌드합니다.

```
cd src/frontend
npm install
npm run build
```

  2. 빌드된 `src/frontend/build` 디렉터리의 내용을 `src/backend/base/langflow/frontend`로 복사합니다.

  3. Langflow를 시작합니다.

```
uv run langflow run
```

Langflow 프런트엔드는 `http://localhost:7860`에서 서비스됩니다.

**PowerShell로 소스에서 실행하기**

Windows에서 소스로 Langflow를 실행하려면 Langflow 저장소에 포함된 스크립트를 사용하거나 터미널에서 직접 명령을 실행할 수 있습니다.

다음 중 하나를 수행하세요.

- 포함된 스크립트로 Langflow를 설치하고 실행하려면 `scripts/windows` 디렉터리로 이동한 다음 `build_and_run.ps1` 파일을 실행합니다.

- PowerShell 터미널에서 Langflow를 실행하려면 다음을 수행합니다.

  1. 프런트엔드 정적 파일을 빌드합니다.

```
cd src/frontend
npm install
npm run build
```

  2. 빌드된 `src/frontend/build` 디렉터리의 내용을 `src/backend/base/langflow/frontend`로 복사합니다.

  3. Langflow를 시작합니다.

```
uv run langflow run
```

Langflow 프런트엔드는 `http://localhost:7860`에서 서비스됩니다.

### Langflow 개발 환경 설정하기[​](#set-up-your-langflow-development-environment "Direct link to Set up your Langflow development environment")

팁

사용 가능한 모든 make 명령을 표시하려면 `make help`를 실행하세요.

이 섹션은 핫 리로드를 활성화한 상태로 코드 변경 사항을 개발하고 테스트하려는 기여자를 위한 것입니다.

코드를 변경하지 않고 로컬에서 Langflow를 실행하려는 경우에는 [소스에서 Langflow 실행하기](#run-langflow-from-source)를 참고하세요.

- Linux 또는 macOS
- Windows

1. Langflow 개발 환경을 설정합니다.

```
make init
```
    이 명령은 다음을 수행하여 개발 환경을 설정합니다.

  - uv와 npm 확인
  - 백엔드 및 프런트엔드 종속성 설치
  - pre-commit 훅 설치

2. 백엔드와 프런트엔드를 별도의 터미널에서 개발 모드로 실행합니다.

```
# 개발 모드로 백엔드 실행 (핫 리로드 포함)
make backend
```

```
# 다른 터미널에서, 개발 모드로 프런트엔드 실행 (핫 리로드 포함)
make frontend
```
    `make backend`와 `make frontend` 명령은 종속성을 자동으로 설치하므로, 설치 명령을 별도로 실행할 필요가 없습니다.

    프런트엔드는 `http://localhost:3000`에서, 백엔드는 `http://localhost:7860`에서 서비스됩니다.

3. 선택 사항: 변경 사항을 깔끔하고 잘 정돈된 상태로 유지하는 데 도움이 되는 pre-commit 훅을 설치합니다.

    pre-commit 훅을 설치하면, `git commit`을 직접 사용하는 대신 `uv run git commit`을 사용해야 합니다.

    `make init`은 pre-commit 훅을 자동으로 설치하며, 다음 명령으로 수동으로 설치할 수도 있습니다.

```
uv sync
uv run pre-commit install
```

4. 커밋을 푸시하기 전에 변경 사항을 테스트하려면, `make lint`, `make format`, `make unit_tests`를 실행하세요.
커버리지, 유닛, 통합 테스트를 포함한 모든 테스트를 실행하려면 `make tests`를 실행하세요.

```
npm install
npm run start
```

- 별도의 터미널에서, 다음 명령을 실행하여 백엔드를 실행합니다.

```
uv run langflow run --backend-only
```

프런트엔드는 `http://localhost:3000`에서, 백엔드는 `http://localhost:7860`에서 서비스됩니다. 이 설정은 프런트엔드 개발용 핫 리로드를 유지하므로, 편집할 때마다 빌드 파일을 복사할 필요가 없습니다.

### 프런트엔드 빌드 문제 해결하기[​](#troubleshoot-frontend-build-issues "Direct link to Troubleshoot frontend build issues")

프런트엔드 빌드 문제가 발생하거나 이전 버전의 Langflow에서 업그레이드하는 경우, `make run_clic`을 한 번 실행하세요.

```
make run_clic
```

이 명령은 빌드 캐시를 정리하고 모든 것을 처음부터 다시 빌드하여, 버전 간 전환 시 발생하는 대부분의 프런트엔드 관련 문제를 해결합니다.

### 디버그[​](#debug "Direct link to Debug")

저장소에는 VSCode에서 백엔드를 디버깅하기 위한 `.vscode/launch.json` 파일이 포함되어 있으며, 이는 Docker Compose로 디버깅하는 것보다 빠릅니다.

자세한 내용은 [VSCode 문서](https://code.visualstudio.com/docs/debugtest/debugging#_start-a-debugging-session)를 참고하세요.

### 추가 기여 가이드[​](#additional-contribution-guides "Direct link to Additional contribution guides")

- [번들 기여하기](https://docs.langflow.org/next/contributing-bundles)
- [컴포넌트 기여하기](https://docs.langflow.org/next/contributing-components)
- [테스트 기여하기](https://docs.langflow.org/next/contributing-component-tests)
- [템플릿 기여하기](https://docs.langflow.org/next/contributing-templates)

## 문서 기여하기[​](#contribute-documentation "Direct link to Contribute documentation")

문서는 [Docusaurus](https://docusaurus.io/)로 빌드되며 [Markdown](https://docusaurus.io/docs/markdown-features)으로 작성됩니다.
스타일 가이드에 대해서는 [Google Developer Documentation Style Guide](https://developers.google.com/style)를 참고하세요.

1. [Node.js](https://nodejs.org/en/download/package-manager)를 설치합니다.

2. [Langflow GitHub 저장소](https://github.com/langflow-ai/langflow)를 포크합니다.

3. 로컬 머신에 있는 로컬 저장소에 새 remote를 추가합니다.

```
git remote add FORK_NAME https://github.com/GIT_USERNAME/langflow.git
```
    다음 항목을 대체하세요.

  - `FORK_NAME`: 여러분의 저장소 포크에 대한 이름
  - `GIT_USERNAME`: 여러분의 Git 사용자 이름

4. 로컬 Langflow 포크의 루트에서 `/docs` 디렉터리로 이동합니다.

```
cd docs
```
    dev container를 사용 중이라면, 문서 빌드는 컨테이너 워크스페이스 내부가 아니라 호스트 터미널에서 컨테이너 외부에서 실행하세요.
dev container 내부에서 실행하면 문서 빌드가 제대로 작동하지 않을 수 있습니다.

5. 종속성을 설치하고 핫 리로드가 포함된 로컬 Docusaurus 정적 사이트를 시작합니다.

```
npm install
npm run start
```
    문서는 `http://localhost:3000`에서 서비스됩니다.

6. 콘텐츠를 편집하거나 만들려면 `langflow/docs/docs` 디렉터리의 `.mdx` 파일을 작업하세요.

    새 파일은 `.mdx` 형식으로 만드세요.

    내비게이션은 `langflow/docs/sidebars.js`에 정의되어 있습니다.

    대부분의 페이지는 전체 경로나 상대 디렉터리 경로 대신 축약형 상호 참조를 위한 `slug`를 사용합니다.
예를 들어, 어떤 페이지의 `slug`가 `/cool-page`라면, 다른 `/docs` 페이지에서 `[Cool page](/cool-page)`로 링크할 수 있습니다.

7. 권장 사항: 변경 사항을 적용한 후에는 `npm run build`를 실행하여 더 견고한 로깅과 함께 사이트를 로컬에서 빌드해 보세요.
이는 PR을 만들기 전에 깨진 링크를 찾는 데 도움이 됩니다.

## 풀 리퀘스트 열기[​](#open-a-pull-request "Direct link to Open a pull request")

풀 리퀘스트를 제출하려면 다음을 수행하세요.

1. `main`이 아니라 활성화된 `release-X.Y.Z` 릴리스 후보 브랜치에 대해 GitHub 풀 리퀘스트를 엽니다.
예를 들어 최신 릴리스된 버전이 `1.8.0`이라면, 여러분의 풀 리퀘스트는 `release-1.9.0` 브랜치를 대상으로 해야 합니다.
명확한 제목과 설명을 포함하세요.

2. PR 제목이 시맨틱 커밋 규칙을 따르는지 확인하세요. 예를 들어, 기능 추가는 `feat: add new feature`, 버그 수정은 `fix: correct issue with X`와 같은 형태입니다.

풀 리퀘스트 제목에 대한 몇 가지 추가 지침:

- PR이 해결하는 문제와 해결 방법을 명확하게 설명하는 풀 리퀘스트 설명을 작성하세요. PR이 이슈를 수정하는 경우, PR 설명에 `Fixes #1234`와 같이 수정된 이슈에 대한 링크를 포함하세요.
- 풀 리퀘스트 제목은 Langflow의 릴리스 노트에 표시되므로, PR이 하는 일을 최대한 명시적으로 설명해야 합니다.
- 풀 리퀘스트는 **한 가지만** 수정하도록 노력해야 하며, 무엇을 수정하는지에 대한 좋은 설명을 포함해야 합니다.

3. Langflow 메인테이너가 여러분의 풀 리퀘스트를 검토하고 변경을 요청할 수 있으므로, PR에 관심을 기울여 주세요. 기여해 주셔서 감사합니다!

자세한 내용은 [Python Developer's Guide](https://devguide.python.org/getting-started/pull-request-lifecycle/index.html#making-good-commits)를 참고하세요.
