# 환경 변수

> 원문: https://docs.langflow.org/next/environment-variables

일반적으로 `LANGFLOW_PORT`나 `LANGFLOW_LOG_LEVEL`과 같은 환경 변수는 Langflow가 실행되는 방식을 구성합니다.
이는 전체 Langflow 배포에 적용되는 광범위한 설정입니다.

이와 대조적으로, 전역 변수는 `OPENAI_API_KEY`처럼 플로우에서 사용하기 위해 Langflow 데이터베이스에 저장되는 사용자 정의 값입니다.
Langflow는 환경 변수로부터 전역 변수를 가져올 수도 있습니다.
자세한 내용은 [Langflow 전역 변수](https://docs.langflow.org/configuration-global-variables)를 참조하세요.

## Langflow OSS용 환경 변수 구성[​](#configure-environment-variables-for-langflow-oss "Direct link to Configure environment variables for Langflow OSS")

Langflow는 다음 소스로부터 [지원되는 환경 변수](#supported-variables)를 인식합니다.

- 터미널에서 설정한 환경 변수.
- Langflow 시작 시 `.env` 파일에서 가져온 환경 변수.
- `--env-file` 옵션과 `--port`와 같은 직접 옵션을 포함하여 [Langflow CLI](https://docs.langflow.org/next/configuration-cli)로 설정한 환경 변수.

이러한 소스 중 하나 이상을 사용할 수 있습니다.

### 우선순위[​](#precedence "Direct link to Precedence")

동일한 환경 변수가 여러 곳에서 설정된 경우, 다음 우선순위가 적용됩니다.

1. Langflow CLI 옵션이 다른 모든 소스보다 우선합니다.
2. `.env` 파일이 시스템 환경 변수보다 우선합니다.
3. 시스템 환경 변수는 다른 곳에서 설정되지 않은 경우에만 사용됩니다.
   Langflow Docker 이미지를 실행할 때는 `-e` 플래그로 추가 시스템 환경 변수를 설정할 수 있습니다.

예시:

- 시스템 환경에 `LANGFLOW_PORT=8080`을, `.env`에 `LANGFLOW_PORT=7860`을 설정한 경우, Langflow는 `.env`의 `7860`을 사용합니다.
- Langflow CLI로 `langflow run --env-file .env --port 9000`을 실행하고 `.env`에 `LANGFLOW_PORT=7860`을 설정한 경우, Langflow는 CLI 옵션의 `9000`을 사용합니다.

### 터미널에서 환경 변수 설정[​](#configure-variables-terminal "Direct link to Set environment variables in your terminal")

현재 터미널 세션에 환경 변수를 설정하려면 다음 명령을 실행하세요.

- Linux 또는 macOS
- Windows
- Docker

```
export VARIABLE_NAME='VALUE'
```

Docker의 경우:

```
-p 7860:7860 \
-e VARIABLE_NAME='VALUE' \
langflowai/langflow:latest
```

Langflow를 시작하면, 터미널에서 설정한 환경 변수를 찾습니다.
지원되는 환경 변수를 감지하면, [우선순위 규칙](#precedence)에 따라 지정된 값을 자동으로 채택합니다.

### .env 파일에서 환경 변수 가져오기[​](#configure-variables-env-file "Direct link to Import environment variables from a .env file")

1. Langflow가 실행 중이면 종료합니다.

2. `.env` 파일을 생성한 다음 원하는 편집기에서 엽니다.

3. `.env` 파일에 [Langflow 환경 변수](#supported-variables)를 정의합니다.

**예시: .env**

```
DO_NOT_TRACK=True
LANGFLOW_AUTO_LOGIN=False
LANGFLOW_AUTO_SAVING=True
LANGFLOW_AUTO_SAVING_INTERVAL=1000
LANGFLOW_BACKEND_ONLY=False
LANGFLOW_BUNDLE_URLS=["https://github.com/user/repo/commit/hash"]
LANGFLOW_CACHE_TYPE=async
LANGFLOW_COMPONENTS_PATH=/path/to/components/
LANGFLOW_COMPONENTS_INDEX_PATH=/path/to/component_index.json
LANGFLOW_CONFIG_DIR=/path/to/config/
LANGFLOW_DATABASE_URL=postgresql://user:password@localhost:5432/langflow
LANGFLOW_DEV=False
LANGFLOW_FALLBACK_TO_ENV_VAR=False
LANGFLOW_HEALTH_CHECK_MAX_RETRIES=5
LANGFLOW_HOST=localhost
LANGFLOW_LANGCHAIN_CACHE=InMemoryCache
LANGFLOW_MAX_FILE_SIZE_UPLOAD=10000
LANGFLOW_MAX_ITEMS_LENGTH=100
LANGFLOW_MAX_TEXT_LENGTH=1000
LANGFLOW_LOG_LEVEL=error
LANGFLOW_OPEN_BROWSER=False
LANGFLOW_PORT=7860
LANGFLOW_REMOVE_API_KEYS=False
LANGFLOW_SAVE_DB_IN_CONFIG_DIR=True
LANGFLOW_SECRET_KEY=somesecretkey
LANGFLOW_STORE_ENVIRONMENT_VARIABLES=True
LANGFLOW_SUPERUSER=adminuser
LANGFLOW_SUPERUSER_PASSWORD=adminpass
LANGFLOW_WORKER_TIMEOUT=300
LANGFLOW_WORKERS=3
```
    추가 예시는 Langflow 저장소의 [`.env.example`](https://github.com/langflow-ai/langflow/blob/main/.env.example)을 참조하세요.

4. `.env`를 저장하고 닫습니다.

5. `.env` 파일로 Langflow를 시작합니다.

  - 로컬
  - Docker

  ```
  uv run langflow run --env-file .env
  ```

  Docker의 경우:

  ```
  -p 7860:7860 \
  --env-file .env \
  langflowai/langflow:latest
  ```

`.env` 파일이 동일한 디렉터리에 없다면, `.env` 파일의 경로를 지정하세요.

시작 시 Langflow는 `.env` 파일과 터미널에서 설정한 다른 환경 변수를 가져와 지정된 값을 채택합니다.

### 개발 환경을 위한 환경 변수 구성[​](#configure-environment-variables-for-development "Direct link to Configure environment variables for development")

다음 예시는 서로 다른 개발 시나리오에서 환경 변수를 사용해 Langflow를 구성하는 방법을 보여줍니다.

- .env 파일
- Systemd 서비스
- VSCode tasks.json

`.env` 파일은 환경 변수의 키-값 쌍을 담은 텍스트 파일입니다.

애플리케이션 또는 Langflow 환경의 루트 디렉터리에 `.env` 파일을 생성하거나 편집한 다음, 구성 변수를 파일에 추가하세요.

**예시: .env**

```
DO_NOT_TRACK=True
LANGFLOW_AUTO_LOGIN=False
LANGFLOW_AUTO_SAVING=True
LANGFLOW_AUTO_SAVING_INTERVAL=1000
LANGFLOW_BACKEND_ONLY=False
LANGFLOW_BUNDLE_URLS=["https://github.com/user/repo/commit/hash"]
LANGFLOW_CACHE_TYPE=async
LANGFLOW_COMPONENTS_PATH=/path/to/components/
LANGFLOW_COMPONENTS_INDEX_PATH=/path/to/component_index.json
LANGFLOW_CONFIG_DIR=/path/to/config/
LANGFLOW_DATABASE_URL=postgresql://user:password@localhost:5432/langflow
LANGFLOW_DEV=False
LANGFLOW_FALLBACK_TO_ENV_VAR=False
LANGFLOW_HEALTH_CHECK_MAX_RETRIES=5
LANGFLOW_HOST=localhost
LANGFLOW_LANGCHAIN_CACHE=InMemoryCache
LANGFLOW_MAX_FILE_SIZE_UPLOAD=10000
LANGFLOW_MAX_ITEMS_LENGTH=100
LANGFLOW_MAX_TEXT_LENGTH=1000
LANGFLOW_LOG_LEVEL=error
LANGFLOW_OPEN_BROWSER=False
LANGFLOW_PORT=7860
LANGFLOW_REMOVE_API_KEYS=False
LANGFLOW_SAVE_DB_IN_CONFIG_DIR=True
LANGFLOW_SECRET_KEY=somesecretkey
LANGFLOW_STORE_ENVIRONMENT_VARIABLES=True
LANGFLOW_SUPERUSER=adminuser
LANGFLOW_SUPERUSER_PASSWORD=adminpass
LANGFLOW_WORKER_TIMEOUT=300
LANGFLOW_WORKERS=3
```

Systemd 서비스의 경우, 유닛 파일에 다음과 같이 `Environment=` 항목을 추가합니다.

```
Environment="DO_NOT_TRACK=true"
Environment="LANGFLOW_AUTO_LOGIN=false"
Environment="LANGFLOW_AUTO_SAVING=true"
Environment="LANGFLOW_AUTO_SAVING_INTERVAL=1000"
Environment="LANGFLOW_BACKEND_ONLY=false"
Environment="LANGFLOW_BUNDLE_URLS=[\"https://github.com/user/repo/commit/hash\"]"
Environment="LANGFLOW_CACHE_TYPE=async"
Environment="LANGFLOW_COMPONENTS_PATH=/path/to/components/"
Environment="LANGFLOW_COMPONENTS_INDEX_PATH=/path/to/component_index.json"
Environment="LANGFLOW_CONFIG_DIR=/path/to/config"
Environment="LANGFLOW_DATABASE_URL=postgresql://user:password@localhost:5432/langflow"
Environment="LANGFLOW_DEV=false"
Environment="LANGFLOW_FALLBACK_TO_ENV_VAR=false"
Environment="LANGFLOW_HEALTH_CHECK_MAX_RETRIES=5"
Environment="LANGFLOW_HOST=localhost"
Environment="LANGFLOW_LANGCHAIN_CACHE=InMemoryCache"
Environment="LANGFLOW_MAX_FILE_SIZE_UPLOAD=10000"
Environment="LANGFLOW_MAX_ITEMS_LENGTH=100"
Environment="LANGFLOW_MAX_TEXT_LENGTH=1000"
Environment="LANGFLOW_LOG_ENV=container_json"
Environment="LANGFLOW_LOG_FILE=logs/langflow.log"
Environment="LANGFLOW_LOG_LEVEL=error"
Environment="LANGFLOW_OPEN_BROWSER=false"
Environment="LANGFLOW_PORT=7860"
Environment="LANGFLOW_REMOVE_API_KEYS=false"
Environment="LANGFLOW_SAVE_DB_IN_CONFIG_DIR=true"
Environment="LANGFLOW_SECRET_KEY=somesecretkey"
Environment="LANGFLOW_STORE_ENVIRONMENT_VARIABLES=true"
Environment="LANGFLOW_SUPERUSER=adminuser"
Environment="LANGFLOW_SUPERUSER_PASSWORD=adminpass"
Environment="LANGFLOW_WORKER_TIMEOUT=300"
Environment="LANGFLOW_WORKERS=3"
```

systemd에 대한 자세한 내용은 [Red Hat 문서](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/using_systemd_unit_files_to_customize_and_optimize_your_system/assembly_working-with-systemd-unit-files_working-with-systemd)를 참조하세요.

VSCode `tasks.json`의 경우:

```
"version": "2.0.0",
"options": {
"env": {
"DO_NOT_TRACK": "true",
"LANGFLOW_AUTO_LOGIN": "false",
"LANGFLOW_AUTO_SAVING": "true",
"LANGFLOW_AUTO_SAVING_INTERVAL": "1000",
"LANGFLOW_BACKEND_ONLY": "false",
"LANGFLOW_BUNDLE_URLS": "[\"https://github.com/user/repo/commit/hash\"]",
"LANGFLOW_CACHE_TYPE": "async",
"LANGFLOW_COMPONENTS_PATH": "D:/path/to/components/",
"LANGFLOW_COMPONENTS_INDEX_PATH": "D:/path/to/component_index.json",
"LANGFLOW_CONFIG_DIR": "D:/path/to/config/",
"LANGFLOW_DATABASE_URL": "postgresql://postgres:password@localhost:5432/langflow",
"LANGFLOW_DEV": "false",
"LANGFLOW_FALLBACK_TO_ENV_VAR": "false",
"LANGFLOW_HEALTH_CHECK_MAX_RETRIES": "5",
"LANGFLOW_HOST": "localhost",
"LANGFLOW_LANGCHAIN_CACHE": "InMemoryCache",
"LANGFLOW_MAX_FILE_SIZE_UPLOAD": "10000",
"LANGFLOW_MAX_ITEMS_LENGTH": "100",
"LANGFLOW_MAX_TEXT_LENGTH": "1000",
"LANGFLOW_LOG_ENV": "container_csv",
"LANGFLOW_LOG_FILE": "langflow.log",
"LANGFLOW_LOG_LEVEL": "error",
"LANGFLOW_OPEN_BROWSER": "false",
"LANGFLOW_PORT": "7860",
"LANGFLOW_REMOVE_API_KEYS": "true",
"LANGFLOW_SAVE_DB_IN_CONFIG_DIR": "false",
"LANGFLOW_SECRET_KEY": "somesecretkey",
"LANGFLOW_STORE_ENVIRONMENT_VARIABLES": "true",
"LANGFLOW_SUPERUSER": "adminuser",
"LANGFLOW_SUPERUSER_PASSWORD": "adminpass",
"LANGFLOW_WORKER_TIMEOUT": "300",
"LANGFLOW_WORKERS": "3"
}
},
"tasks": [
{
"label": "langflow backend",
"type": "shell",
"command": ". ./langflownightly/Scripts/activate && langflow run",
"isBackground": true,
"problemMatcher": []
}
]
}
```

위의 VSCode `tasks.json` 파일을 사용하여 Langflow를 실행하려면, VSCode 명령 팔레트에서 **Tasks: Run Task** > **langflow backend**를 선택하세요.

## Langflow Desktop용 환경 변수 설정[​](#set-environment-variables-for-langflow-desktop "Direct link to Set environment variables for Langflow Desktop")

터미널에서 설정한 환경 변수는 Windows나 macOS GUI에서 실행하는 Langflow Desktop과 같은 GUI 기반 애플리케이션에 자동으로 적용되지 않습니다.

Langflow Desktop의 환경 변수를 수정하려면, Desktop `.env` 파일에 환경 변수를 설정한 다음 앱을 재시작하세요.

- macOS
- Windows .env 파일
- Windows 사용자 환경 변수

macOS `.env` 파일을 수정하려면 다음을 수행하세요.

1. `~/.langflow/data/.env`를 생성하거나 편집합니다.

2. Langflow 환경 변수를 추가합니다. 예:

  ```
  LANGFLOW_LOG_LEVEL=info
  LANGFLOW_DOCLING=true
  ```

3. 파일을 저장합니다.

4. Langflow Desktop을 재시작합니다.

Windows `.env` 파일의 경우도 비슷하게, `LANGFLOW_DOCLING=true`와 같은 값을 추가한 다음 파일을 저장하고 Langflow Desktop을 재시작합니다.

## 지원되는 환경 변수[​](#supported-variables "Direct link to Supported environment variables")

다음 섹션에서는 특정 Langflow 환경 변수에 대한 정보를 제공합니다.

### 인증과 보안[​](#authentication-and-security "Direct link to Authentication and security")

[API 키와 인증](https://docs.langflow.org/api-keys-and-authentication)을 참조하세요.

### 전역 변수[​](#global-variables "Direct link to Global variables")

Langflow 전역 변수와 환경 변수의 관계, 그리고 전역 변수 처리를 제어하는 환경 변수에 대한 정보는 [전역 변수](https://docs.langflow.org/configuration-global-variables)를 참조하세요.

### 로그[​](#logging "Direct link to Logs")

[로그 옵션 구성](https://docs.langflow.org/logging#log-storage)을 참조하세요.

### MCP 서버[​](#mcp "Direct link to MCP servers")

[Langflow를 MCP 서버로 사용하기](https://docs.langflow.org/mcp-server)를 참조하세요.

### 다중 워커 배포[​](#multi-worker-deployments "Direct link to Multi-worker deployments")

Redis 작업 큐와 Gunicorn 워커 설정을 포함한 다중 워커 튜닝에 대해서는 [다중 워커로 Langflow 배포하기](https://docs.langflow.org/next/deployment-multi-worker)를 참조하세요.

### 모니터링과 메트릭[​](#monitoring-and-metrics "Direct link to Monitoring and metrics")

특정 모니터링 서비스 제공자를 위한 환경 변수는 [Langfuse](https://docs.langflow.org/integrations-langfuse)와 [Kubernetes에서 Langflow 모범 사례](https://docs.langflow.org/deployment-prod-best-practices)와 같은 Langflow 모니터링 통합 가이드를 참조하세요.

### 서버[​](#server "Direct link to Server")

다음 환경 변수는 서버가 호스팅되는 위치, SSL 암호화에 필요한 파일, 배포 유형(프런트엔드와 백엔드, 백엔드 전용, 개발 모드)과 같은 기본 Langflow 서버 구성을 설정합니다.

| 변수 | 형식 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `LANGFLOW_​HOST` | String | `localhost` | Langflow 서버가 실행될 호스트. |
| `LANGFLOW_​PORT` | Integer | `7860` | Langflow 서버가 실행되는 포트. 지정된 포트가 사용 중이면 서버가 자동으로 사용 가능한 포트를 선택합니다. |
| `LANGFLOW_​BACKEND_​ONLY` | Boolean | `False` | Langflow 백엔드 서비스만 실행합니다(프런트엔드 없음). |
| `LANGFLOW_​DEV` | Boolean | `False` | Langflow를 개발 모드로 실행할지 여부(버그가 있을 수 있음). |
| `LANGFLOW_​OPEN_​BROWSER` | Boolean | `False` | 시작 시 시스템 웹 브라우저를 엽니다. |
| `LANGFLOW_​HEALTH_​CHECK_​MAX_​RETRIES` | Integer | `5` | Langflow 서버 상태 확인의 최대 재시도 횟수를 설정합니다. |
| `LANGFLOW_​WORKERS` | Integer | `1` | 워커 프로세스 수. [다중 워커로 Langflow 배포하기](https://docs.langflow.org/next/deployment-multi-worker#recommended-gunicorn-settings)를 참조하세요. |
| `LANGFLOW_​WORKER_​TIMEOUT` | Integer | `300` | 워커 타임아웃(초). [다중 워커로 Langflow 배포하기](https://docs.langflow.org/next/deployment-multi-worker#recommended-gunicorn-settings)를 참조하세요. |
| `LANGFLOW_​GUNICORN_​PRELOAD` | Boolean | `False` | Gunicorn `preload_​app`을 활성화합니다. Windows에서는 지원되지 않습니다. [다중 워커로 Langflow 배포하기](https://docs.langflow.org/next/deployment-multi-worker#recommended-gunicorn-settings)를 참조하세요. |
| `LANGFLOW_​JOB_​QUEUE_​TYPE` | String | `asyncio` | 작업 큐 백엔드. 다중 워커 배포에는 `redis`를 사용하세요. [다중 워커로 Langflow 배포하기](https://docs.langflow.org/next/deployment-multi-worker#configuration-reference)를 참조하세요. |
| `LANGFLOW_​SSL_​CERT_​FILE` | String | 설정되지 않음 | Langflow 웹 서버에서 HTTPS를 활성화하기 위한 SSL 인증서 파일 경로. [데이터베이스 SSL 연결](https://docs.langflow.org/configuration-custom-database#connect-langflow-to-a-local-postgresql-database)과는 별개입니다. |
| `LANGFLOW_​SSL_​KEY_​FILE` | String | 설정되지 않음 | Langflow 웹 서버에서 HTTPS를 활성화하기 위한 SSL 키 파일 경로. [데이터베이스 SSL 연결](https://docs.langflow.org/configuration-custom-database#connect-langflow-to-a-local-postgresql-database)과는 별개입니다. |
| `LANGFLOW_​DEACTIVATE_​TRACING` | Boolean | `False` | 트레이싱 기능을 비활성화합니다. |
| `LANGFLOW_​CELERY_​ENABLED` | Boolean | `False` | 분산 작업 처리를 위한 Celery를 활성화합니다. |
| `LANGFLOW_​ALEMBIC_​LOG_​TO_​STDOUT` | Boolean | `False` | Alembic 데이터베이스 마이그레이션 출력을 로그 파일 대신 stdout으로 기록할지 여부. `true`인 경우 Alembic은 `stdout`으로 로그를 남기고 기본 로그 파일은 무시됩니다. |

### 저장소[​](#storage "Direct link to Storage")

파일 저장소 환경 변수는 [파일 저장소 환경 변수](https://docs.langflow.org/concepts-file-management#file-storage-environment-variables)를 참조하세요.

PostgreSQL 구성을 포함한 데이터베이스 환경 변수는 [메모리 관리 옵션](https://docs.langflow.org/memory#configure-external-memory)을 참조하세요.

### 텔레메트리[​](#telemetry "Direct link to Telemetry")

[텔레메트리](https://docs.langflow.org/contributing-telemetry)를 참조하세요.

### 시각적 편집기와 Playground 동작[​](#visual-editor-and-playground-behavior "Direct link to Visual editor and Playground behavior")

| 변수 | 형식 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `LANGFLOW_​AUTO_​SAVING` | Boolean | `True` | 현재 플로우 초안을 자동으로 저장할지 여부. 자동 저장은 실시간 초안만 업데이트하며, [저장된 플로우 버전](https://docs.langflow.org/concepts-flows#save-and-restore-flow-versions)을 생성하지는 않습니다. |
| `LANGFLOW_​AUTO_​SAVING_​INTERVAL` | Integer | `1000` | `LANGFLOW_​AUTO_​SAVING=True`인 경우 자동 저장 간격(밀리초)을 설정합니다. |
| `LANGFLOW_​BUNDLE_​URLS` | List[String] | `[]` | 사용자 정의 번들을 로드할 URL 목록. GitHub URL을 지원합니다. `LANGFLOW_​AUTO_​LOGIN=True`인 경우, 이러한 번들의 플로우가 데이터베이스에 로드됩니다. |
| `LANGFLOW_​COMPONENTS_​PATH` | String | 설정되지 않음 | 사용자 정의 컴포넌트가 포함된 디렉터리 경로. 일반적으로 로컬 사용자 정의 컴포넌트가 있거나 사용자 정의 컴포넌트를 포함한 Docker 이미지를 빌드할 때 사용됩니다. |
| `LANGFLOW_​COMPONENTS_​INDEX_​PATH` | String | 설정되지 않음 | 시각적 편집기에서 내장 컴포넌트를 채우는 데 사용되는 미리 빌드된 컴포넌트 인덱스 JSON 파일의 파일 경로 또는 URL(`http://` 또는 `https://`). 설정되지 않으면 Langflow는 포함된 인덱스를 사용합니다. 예를 들어 에어갭 배포에서 선별된 컴포넌트 인덱스를 제공하는 데 유용합니다. 자세한 내용은 [사용자 정의 컴포넌트 차단](https://docs.langflow.org/next/deployment-block-custom-components)을 참조하세요. |
| `LANGFLOW_​ALLOW_​CUSTOM_​COMPONENTS` | Boolean | `True` | `false`이면 사용자 정의 컴포넌트와 편집기 내 컴포넌트 코드 편집을 비활성화합니다. 이 기능은 베타입니다. 자세한 내용은 [사용자 정의 컴포넌트 차단](https://docs.langflow.org/next/deployment-block-custom-components)을 참조하세요. |
| `LANGFLOW_​ALLOW_​COMPONENTS_​PATHS_​OVERRIDE` | Boolean | `True` | `LANGFLOW_​ALLOW_​CUSTOM_​COMPONENTS=false`와 함께 `false`이면, `LANGFLOW_​COMPONENTS_​PATH`와 `LANGFLOW_​COMPONENTS_​INDEX_​PATH`가 제공하는 컴포넌트가 더 이상 차단을 우회하지 않습니다. `LANGFLOW_​ALLOW_​CUSTOM_​COMPONENTS=true`인 경우에는 영향이 없습니다. 자세한 내용은 [사용자 정의 컴포넌트 차단](https://docs.langflow.org/next/deployment-block-custom-components)을 참조하세요. |
| `LANGFLOW_​LOAD_​FLOWS_​PATH` | String | 설정되지 않음 | 시작 시 로드할 플로우 JSON 파일이 포함된 디렉터리 경로. 일반적으로 사전 패키징된 플로우와 함께 Docker 이미지를 생성할 때 사용됩니다. `LANGFLOW_​AUTO_​LOGIN=True`가 필요합니다. |
| `LANGFLOW_​LOAD_​FLOWS_​OVERWRITE_​ON_​NAME_​MATCH` | Boolean | `False` | `LANGFLOW_​LOAD_​FLOWS_​PATH`의 플로우 파일이 기존 DB 행과 이름은 같지만 `id`가 다른 경우, 기존 행을 덮어쓸지 여부를 제어합니다. `False`(기본값)는 경고와 함께 건너뛰어, 파일 UUID가 재생성될 때 재시작 시 UI 편집 내용이 보존되도록 합니다. 사전 패키징된 플로우를 신뢰할 수 있는 소스로 삼는 동작(주로 CI/CD 파이프라인용)을 원한다면 `True`로 설정하세요. |
| `LANGFLOW_​CREATE_​STARTER_​PROJECTS` | Boolean | `True` | 초기화 중 템플릿을 생성할지 여부. `false`이면 Langflow는 템플릿을 생성하지 않으며, `LANGFLOW_​UPDATE_​STARTER_​PROJECTS`는 `false`로 취급됩니다. |
| `LANGFLOW_​UPDATE_​STARTER_​PROJECTS` | Boolean | `True` | 업그레이드 후 초기화할 때 템플릿을 최신 컴포넌트 버전으로 업데이트할지 여부. |
| `LANGFLOW_​LAZY_​LOAD_​COMPONENTS` | Boolean | `False` | `true`이면, Langflow는 시작 시 컴포넌트를 부분적으로만 로드하고 필요할 때 완전히 로드합니다. 이는 시작 시간을 크게 단축하지만 컴포넌트를 처음 사용할 때 약간의 지연을 유발할 수 있습니다. |
| `LANGFLOW_​EVENT_​DELIVERY` | String | `streaming` | 프런트엔드로 빌드 이벤트를 전달하는 방식: `polling`, `streaming`, 또는 `direct`. |
| `LANGFLOW_​FRONTEND_​PATH` | String | `./frontend` | 빌드 파일이 포함된 프런트엔드 디렉터리 경로. 특정 프런트엔드 코드를 제공해야 하는 개발 목적으로만 사용됩니다. |
| `LANGFLOW_​FS_​TOOL_​BASE_​DIR` | String | `~/.langflow/fs_​tool/fs_​sandbox` | [**File System** 컴포넌트](https://docs.langflow.org/next/file-system) 샌드박스의 기본 디렉터리. 모든 에이전트 파일 작업은 이 디렉터리 안으로 제한됩니다. |
| `LANGFLOW_​MAX_​ITEMS_​LENGTH` | Integer | `100` | 시각적 편집기에 저장하고 표시할 최대 항목 수. 이보다 긴 목록은 시각적 편집기에 표시될 때 잘립니다. 출력이나 컴포넌트 간에 전달되는 데이터에는 영향을 주지 않습니다. |
| `LANGFLOW_​MAX_​TEXT_​LENGTH` | Integer | `1000` | 시각적 편집기에 저장하고 표시할 최대 문자 수. 이보다 긴 응답은 시각적 편집기에 표시될 때 잘립니다. 컴포넌트 간에 전달되는 출력이나 응답을 자르지는 않습니다. |
| `LANGFLOW_​MAX_​TRANSACTIONS_​TO_​KEEP` | Integer | `3000` | 데이터베이스에 보관할 최대 플로우 트랜잭션 이벤트 수. |
| `LANGFLOW_​MAX_​VERTEX_​BUILDS_​TO_​KEEP` | Integer | `3000` | 데이터베이스에 보관할 최대 버텍스 빌드 수. [Playground](https://docs.langflow.org/concepts-playground) 기능과 관련됩니다. |
| `LANGFLOW_​MAX_​VERTEX_​BUILDS_​PER_​VERTEX` | Integer | `2` | 버텍스당 보관할 최대 빌드 수. 오래된 빌드는 삭제됩니다. [Playground](https://docs.langflow.org/concepts-playground) 기능과 관련됩니다. |
| `LANGFLOW_​PUBLIC_​FLOW_​CLEANUP_​INTERVAL` | Integer | `3600` | [공유 Playground](https://docs.langflow.org/concepts-playground#share-a-flows-playground) 플로우의 데이터를 정리하는 간격(초). 기본값: 3600초(1시간). 최소값: 600초(10분). |
| `LANGFLOW_​PUBLIC_​FLOW_​EXPIRATION` | Integer | `86400` | [공유 Playground](https://docs.langflow.org/concepts-playground#share-a-flows-playground) 플로우가 만료되어 정리 대상이 되기까지의 시간(초). 기본값: 86400초(24시간). 최소값: 600초(10분). |

### 임베디드 모드로 UI 요소 숨기기[​](#embedded-mode "Direct link to Hide UI elements with embedded mode")

호스트 포털의 iframe과 같이 다른 애플리케이션에 Langflow 시각적 편집기를 임베드할 때, 일반적으로 시각적 편집기에 표시되는 UI 요소를 숨길 수 있습니다.

임베디드 모드 환경 변수는 시각적 편집기에 표시되는 UI 요소를 제어합니다.
임베디드 모드는 UI 가시성만 제어하며, API 엔드포인트를 차단하거나 Langflow를 배포하지는 않습니다.

임베디드 모드는 웹사이트에 단일 플로우의 채팅 UI를 임베드하는 [임베디드 채팅 위젯](https://docs.langflow.org/concepts-publish#embedded-chat-widget)과는 다릅니다.

`LANGFLOW_EMBEDDED_MODE=true`인 경우, Langflow는 UI에서 다음 버튼을 숨깁니다.

- **Logout**
- **New project**
- **New flow**
- **Starter projects**

우산 격 플래그를 활성화하지 않고도 개별 요소를 숨길 수 있습니다.

| 변수 | 형식 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `LANGFLOW_​EMBEDDED_​MODE` | Boolean | `False` | 임베디드 또는 iframe 배포를 위한 우산 격 플래그. `true`이면 로그아웃, 새 프로젝트, 새 플로우, 스타터 프로젝트와 같은 독립형 UI 요소를 숨깁니다. 이 플래그를 활성화하지 않고도 개별 숨김 플래그를 설정할 수 있습니다. |
| `LANGFLOW_​HIDE_​LOGOUT_​BUTTON` | Boolean | `False` | `true`이면 계정 메뉴의 로그아웃 버튼을 숨깁니다. `LANGFLOW_​EMBEDDED_​MODE=true`일 때 자동으로 활성화됩니다. |
| `LANGFLOW_​HIDE_​NEW_​PROJECT_​BUTTON` | Boolean | `False` | `true`이면 사이드바의 새 프로젝트/폴더 버튼을 숨깁니다. `LANGFLOW_​EMBEDDED_​MODE=true`일 때 자동으로 활성화됩니다. |
| `LANGFLOW_​HIDE_​NEW_​FLOW_​BUTTON` | Boolean | `False` | `true`이면 헤더의 새 플로우 버튼을 숨깁니다. `LANGFLOW_​EMBEDDED_​MODE=true`일 때 자동으로 활성화됩니다. |
| `LANGFLOW_​HIDE_​STARTER_​PROJECTS` | Boolean | `False` | `true`이면 템플릿 모달의 스타터 프로젝트 탭을 숨깁니다. 스타터 프로젝트의 데이터베이스 시딩에는 영향을 주지 않습니다. `LANGFLOW_​EMBEDDED_​MODE=true`일 때 자동으로 활성화됩니다. |
| `LANGFLOW_​HIDE_​GETTING_​STARTED_​PROGRESS` | Boolean | `False` | `true`이면 시작하기 온보딩 진행 UI를 숨깁니다. `LANGFLOW_​EMBEDDED_​MODE=true`일 때 자동으로 활성화되지 않습니다. |
