# 환경 변수

일반적으로 `LANGFLOW_PORT`나 `LANGFLOW_LOG_LEVEL`과 같은 환경 변수는 Langflow가 실행되는 방식을 구성합니다. 이는 전체 Langflow 배포에 적용되는 광범위한 설정입니다.

대조적으로 전역 변수는 `OPENAI_API_KEY`와 같이 플로우에 사용하기 위해 Langflow 데이터베이스에 저장된 사용자 정의 값입니다. Langflow는 환경 변수에서 전역 변수를 가져올 수도 있습니다. 자세한 내용은 [Langflow 전역 변수](./global-variables.md)를 참조하세요.

---

## Langflow OSS에 대한 환경 변수 구성

Langflow는 다음 소스에서 지원되는 환경 변수를 인식합니다:
- 터미널에서 설정한 환경 변수
- Langflow 시작 시 `.env` 파일에서 가져온 환경 변수
- `--env-file` 옵션과 `--port`와 같은 직접 옵션을 포함한 Langflow CLI로 설정한 환경 변수

### 우선순위

동일한 환경 변수가 여러 위치에 설정된 경우 다음 계층이 적용됩니다:
1. Langflow CLI 옵션은 다른 모든 소스를 재정의합니다.
2. `.env` 파일은 시스템 환경 변수를 재정의합니다.
3. 시스템 환경 변수는 다른 곳에 설정되지 않은 경우에만 사용됩니다.

**예:**
- 시스템 환경에 `LANGFLOW_PORT=8080`을 설정하고 `.env`에 `LANGFLOW_PORT=7860`을 설정하면 Langflow는 `.env`의 `7860`을 사용합니다.
- `langflow run --env-file .env --port 9000`을 실행하고 `.env`에 `LANGFLOW_PORT=7860`이 설정된 경우 CLI 옵션의 `9000`을 사용합니다.

### 터미널에서 환경 변수 설정

```bash
# Linux 또는 macOS
export VARIABLE_NAME='VALUE'
```

### .env 파일에서 환경 변수 가져오기

1. `.env` 파일을 만들고 편집기에서 엽니다.
2. Langflow 환경 변수를 정의합니다:

```
DO_NOT_TRACK=True
LANGFLOW_AUTO_LOGIN=False
LANGFLOW_AUTO_SAVING=True
LANGFLOW_AUTO_SAVING_INTERVAL=1000
LANGFLOW_BACKEND_ONLY=False
LANGFLOW_CACHE_TYPE=async
LANGFLOW_DATABASE_URL=postgresql://user:password@localhost:5432/langflow
LANGFLOW_HOST=localhost
LANGFLOW_LOG_LEVEL=error
LANGFLOW_PORT=7860
LANGFLOW_SECRET_KEY=somesecretkey
LANGFLOW_SUPERUSER=adminuser
LANGFLOW_SUPERUSER_PASSWORD=adminpass
LANGFLOW_WORKERS=3
```

3. Langflow를 `.env` 파일로 시작합니다:

```bash
uv run langflow run --env-file .env
```

### Langflow Desktop에 환경 변수 설정

터미널에서 설정한 환경 변수는 GUI에서 실행할 때 Langflow Desktop에 자동으로 사용할 수 없습니다.

Langflow Desktop의 환경 변수를 수정하려면 Desktop `.env` 파일에 환경 변수를 설정하고 앱을 재시작합니다:

**macOS:** `~/.langflow/data/.env` 파일을 만들거나 편집합니다:

```
LANGFLOW_LOG_LEVEL=info
LANGFLOW_DOCLING=true
```

---

## 지원되는 환경 변수

### 서버 설정

| 변수 | 형식 | 기본값 | 설명 |
|------|------|--------|------|
| `LANGFLOW_HOST` | String | `localhost` | Langflow 서버가 실행될 호스트 |
| `LANGFLOW_PORT` | Integer | `7860` | Langflow 서버가 실행될 포트 |
| `LANGFLOW_BACKEND_ONLY` | Boolean | `False` | 백엔드 서비스만 실행(프론트엔드 없음) |
| `LANGFLOW_DEV` | Boolean | `False` | 개발 모드로 실행 |
| `LANGFLOW_OPEN_BROWSER` | Boolean | `False` | 시작 시 시스템 웹 브라우저 열기 |
| `LANGFLOW_HEALTH_CHECK_MAX_RETRIES` | Integer | `5` | 서버 상태 헬스 체크의 최대 재시도 횟수 |
| `LANGFLOW_WORKERS` | Integer | `1` | 워커 프로세스 수 |
| `LANGFLOW_WORKER_TIMEOUT` | Integer | `300` | 워커 타임아웃(초) |
| `LANGFLOW_JOB_QUEUE_TYPE` | String | `asyncio` | 작업 큐 백엔드. 멀티 워커 배포에는 `redis` 사용 |
| `LANGFLOW_SSL_CERT_FILE` | String | 미설정 | HTTPS 활성화를 위한 SSL 인증서 파일 경로 |
| `LANGFLOW_SSL_KEY_FILE` | String | 미설정 | HTTPS 활성화를 위한 SSL 키 파일 경로 |

### 비주얼 에디터 및 플레이그라운드

| 변수 | 형식 | 기본값 | 설명 |
|------|------|--------|------|
| `LANGFLOW_AUTO_SAVING` | Boolean | `True` | 현재 플로우 초안을 자동으로 저장할지 여부 |
| `LANGFLOW_AUTO_SAVING_INTERVAL` | Integer | `1000` | 자동 저장 간격(밀리초) |
| `LANGFLOW_COMPONENTS_PATH` | String | 미설정 | 커스텀 컴포넌트가 포함된 디렉토리 경로 |
| `LANGFLOW_ALLOW_CUSTOM_COMPONENTS` | Boolean | `True` | `false`이면 커스텀 컴포넌트 및 컴포넌트 코드 편집 비활성화 |
| `LANGFLOW_LOAD_FLOWS_PATH` | String | 미설정 | 시작 시 로드할 플로우 JSON 파일이 있는 디렉토리 경로 |
| `LANGFLOW_CREATE_STARTER_PROJECTS` | Boolean | `True` | 초기화 중에 템플릿을 만들지 여부 |
| `LANGFLOW_LAZY_LOAD_COMPONENTS` | Boolean | `False` | `true`이면 시작 시 컴포넌트를 부분적으로만 로드 |
| `LANGFLOW_MAX_FILE_SIZE_UPLOAD` | Integer | `10000` | 업로드 최대 파일 크기(KB) |
| `LANGFLOW_MAX_ITEMS_LENGTH` | Integer | `100` | 비주얼 에디터에 저장 및 표시할 최대 항목 수 |
| `LANGFLOW_MAX_TEXT_LENGTH` | Integer | `1000` | 비주얼 에디터에 저장 및 표시할 최대 문자 수 |

### 임베디드 모드 (UI 요소 숨기기)

다른 애플리케이션(예: iframe)에 Langflow 비주얼 에디터를 임베드할 때 비주얼 에디터에서 일반적으로 표시되는 UI 요소를 숨길 수 있습니다.

| 변수 | 형식 | 기본값 | 설명 |
|------|------|--------|------|
| `LANGFLOW_EMBEDDED_MODE` | Boolean | `False` | 임베디드 모드 활성화. `true`이면 로그아웃, 새 프로젝트, 새 플로우, 스타터 프로젝트 UI 요소를 숨깁니다 |
| `LANGFLOW_HIDE_LOGOUT_BUTTON` | Boolean | `False` | 계정 메뉴에서 로그아웃 버튼 숨기기 |
| `LANGFLOW_HIDE_NEW_PROJECT_BUTTON` | Boolean | `False` | 사이드바에서 새 프로젝트/폴더 버튼 숨기기 |
| `LANGFLOW_HIDE_NEW_FLOW_BUTTON` | Boolean | `False` | 헤더에서 새 플로우 버튼 숨기기 |
| `LANGFLOW_HIDE_STARTER_PROJECTS` | Boolean | `False` | 템플릿 모달에서 스타터 프로젝트 탭 숨기기 |

---

## 참고 항목

- [전역 변수](./global-variables.md)
- [API 키 및 인증](./api-keys-and-authentication.md)
- [파일 저장 및 메모리](./storage-and-memory.md)

---

*원문: https://docs.langflow.org/next/environment-variables*
