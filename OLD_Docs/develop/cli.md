# Langflow CLI

Langflow 커맨드 라인 인터페이스(CLI)는 Langflow 서버를 관리하고 실행하는 주요 인터페이스입니다.

Langflow CLI는 [Langflow 패키지를 설치](../get-started/installation.md)할 때 자동으로 설치됩니다. Langflow Desktop에서는 사용할 수 없습니다.

---

## CLI 사용 방법

Langflow CLI는 Langflow가 설치된 가상 환경 내에서 `uv run`으로 실행하는 것을 권장합니다.

예를 들어 기본 포트에서 Langflow를 시작하려면:

```bash
uv run langflow run
```

Langflow가 전역으로 설치되거나 PATH에 추가된 경우 CLI를 직접 실행할 수 있습니다:

```bash
langflow run
```

---

## 우선순위

Langflow CLI 옵션은 터미널이나 기본 `.env` 파일에 설정된 [환경 변수](./environment-variables.md) 값을 재정의합니다.

예를 들어 `LANGFLOW_PORT=7860`이 환경 변수로 정의되어 있고 CLI를 `--port 7880`으로 실행하면 Langflow는 CLI 옵션이 환경 변수를 재정의하기 때문에 포트를 `7880`으로 설정합니다.

---

## CLI 명령

### langflow run

Langflow 서버를 시작합니다.

```bash
uv run langflow run [OPTIONS]
```

주요 옵션:

| 옵션 | 기본값 | 타입 | 설명 |
|------|--------|------|------|
| `--auto-saving` | true | Boolean | 비주얼 에디터에서 플로우 자동 저장 활성화 여부 |
| `--backend-only` | false | Boolean | 백엔드 서비스만 실행(프론트엔드 없음) |
| `--cache` | `async` | String | 캐시 저장소 유형. `async`, `redis`, `memory`, `disk` 중 하나 |
| `--components-path` | 미설정 | String | 커스텀 컴포넌트가 있는 디렉토리 경로 |
| `--dev` | false | Boolean | 개발 모드로 실행 |
| `--env-file` | 미설정 | String | Langflow 환경 변수가 포함된 `.env` 파일 경로 |
| `--host` | `localhost` | String | Langflow 서버가 실행될 호스트 |
| `--log-file` | `logs/langflow.log` | String | Langflow 로그 파일 경로 |
| `--log-level` | `critical` | String | 로그 레벨: `debug`, `info`, `warning`, `error`, `critical` 중 하나 |
| `--max-file-size-upload` | `1024` | Integer | 파일 업로드 최대 크기(MB) |
| `--open-browser` | false | Boolean | 시작 시 시스템 웹 브라우저 열기 |
| `--port` | `7860` | Integer | Langflow 서버가 실행될 포트 |
| `--remove-api-keys` | false | Boolean | Langflow 데이터베이스에 저장된 플로우에서 API 키 및 토큰 제거 여부 |
| `--ssl-cert-file-path` | 미설정 | String | SSL 암호화 연결을 위한 SSL 인증서 파일 경로 |
| `--ssl-key-file-path` | 미설정 | String | SSL 암호화 연결을 위한 SSL 키 파일 경로 |
| `--worker-timeout` | `300` | Integer | Langflow 서버 워커 타임아웃(초) |
| `--workers` | `1` | Integer | Langflow 서버 워커 프로세스 수 |

#### 특정 .env 파일로 Langflow 시작

```bash
uv run langflow run --env-file PATH/TO/LANGFLOW/.env
```

#### 헤드리스 모드로 Langflow 시작

```bash
uv run langflow run --backend-only
```

### langflow api-key

Langflow API 키를 만듭니다. API 키를 CLI로 만들려면 슈퍼유저여야 합니다.

```bash
uv run langflow api-key
```

### langflow copy-db

캐시 디렉토리에서 현재 Langflow 설치 디렉토리로 Langflow 데이터베이스 파일을 복사합니다.

```bash
uv run langflow copy-db
```

### langflow migration

Alembic을 사용하여 Langflow 데이터베이스 스키마 변경을 관리합니다.

`migration` 명령에는 두 가지 모드가 있습니다:
- **테스트 모드 (기본값)**: 마이그레이션을 실제로 실행하지 않고 안전하게 적용할 수 있는지 확인합니다.
- **수정 모드**: 마이그레이션을 적용하여 데이터베이스 스키마를 업데이트합니다.

> **경고**: `langflow migration --fix`는 데이터를 삭제할 수 있는 파괴적인 작업입니다. 항상 먼저 `langflow migration`을 실행하여 변경 사항을 미리 확인하세요.

```bash
# 테스트 모드 실행
uv run langflow migration

# 수정 모드 실행
uv run langflow migration --fix
```

### langflow superuser

주어진 사용자 이름과 비밀번호로 슈퍼유저 계정을 만듭니다.

```bash
uv run langflow superuser --username [NAME] --password [PASSWORD]
```

#### CLI 슈퍼유저 생성 비활성화

`langflow superuser` 명령은 `LANGFLOW_ENABLE_SUPERUSER_CLI` 환경 변수로 제어됩니다:
- **`LANGFLOW_ENABLE_SUPERUSER_CLI=True` (기본값)**: 명령을 사용할 수 있습니다.
- **`LANGFLOW_ENABLE_SUPERUSER_CLI=False` (권장)**: 특히 프로덕션 환경에서 무단 슈퍼유저 생성을 방지하기 위해 명령을 비활성화합니다.

---

*원문: https://docs.langflow.org/next/configuration-cli*
