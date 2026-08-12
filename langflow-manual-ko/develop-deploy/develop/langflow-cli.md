# Langflow CLI
> 원문: https://docs.langflow.org/next/configuration-cli

Langflow 명령줄 인터페이스(CLI)는 Langflow 서버를 관리하고 실행하기 위한 주요 인터페이스입니다.

Langflow CLI는 [Langflow 패키지를 설치](https://docs.langflow.org/get-started-installation)할 때 자동으로 함께 설치됩니다.
Langflow Desktop에서는 사용할 수 없습니다.

## CLI 사용 방법[​](#how-to-use-the-cli "CLI 사용 방법으로 바로 가기")

Langflow CLI는 설치 방법과 환경에 따라 여러 방식으로 실행할 수 있습니다.

권장되는 방법은 Langflow가 설치된 가상 환경 내에서 `uv run`으로 CLI를 실행하는 것입니다.

예를 들어 기본 포트에서 Langflow를 시작하려면 다음 명령을 실행하세요.

```
uv run langflow run
```

Langflow가 전역으로 설치되어 있거나 PATH에 추가되어 있다면 `langflow`로 직접 CLI를 실행할 수 있습니다.

```
langflow run
```

## 우선순위[​](#precedence "우선순위로 바로 가기")

Langflow CLI 옵션은 터미널이나 기본 `.env` 파일에 설정된 [환경 변수](https://docs.langflow.org/environment-variables) 값보다 우선합니다.

예를 들어 환경 변수로 `LANGFLOW_PORT=7860`이 정의되어 있는 상태에서 `--port 7880` 옵션과 함께 CLI를 실행하면, CLI 옵션이 환경 변수보다 우선하므로 Langflow는 포트를 `7880`으로 설정합니다.

이는 불리언(Boolean) 환경 변수에도 동일하게 적용됩니다.
예를 들어 `.env` 파일에 `LANGFLOW_REMOVE_API_KEYS=True`를 설정했더라도, `--no-remove-api-keys`와 함께 CLI를 실행하면 런타임에 `False`로 변경할 수 있습니다.

## Langflow CLI 옵션[​](#langflow-cli-options "Langflow CLI 옵션으로 바로 가기")

모든 Langflow CLI 명령은 명령의 동작을 수정하거나 환경 변수를 설정하는 옵션을 지원합니다.

옵션 값을 설정할 때는 다음 두 가지 구문 스타일 중 하나를 사용할 수 있습니다.

- `--option value`
- `--option=value`

공백이 포함된 값은 따옴표로 감싸야 합니다.

- `--option 'Value with Spaces'`
- `--option="Value with Spaces"`

### 불리언 옵션[​](#boolean-options "불리언 옵션으로 바로 가기")

불리언 옵션은 설정을 활성화하거나 비활성화합니다.
참(활성화)과 거짓(비활성화) 형태가 있습니다.

- 활성화(true): `--option`
- 비활성화(false): `--no-option`

다음 예시는 `REMOVE_API_KEYS`에 대한 불리언 옵션 형태를 비교합니다.

- True
- False

`--remove-api-keys`는 `.env`에서 `LANGFLOW_REMOVE_API_KEYS=True`를 설정하는 것과 동일합니다.

```
uv run langflow run --remove-api-keys
```

이후 명령 레퍼런스에서 불리언의 기본값은 "`--option`(true)"이나 "`--no-option`(false)"처럼 CLI 플래그와 이에 대응하는 불리언 값을 함께 표기합니다.

### 공통 옵션[​](#universal-options "공통 옵션으로 바로 가기")

다음 옵션은 모든 Langflow CLI 명령에서 사용할 수 있습니다.

- `--version`, `-v`: 버전을 표시하고 종료합니다.
- `--install-completion`: 현재 셸에 자동 완성을 설치합니다.
- `--show-completion`: 설치된 경우 자동 완성 설정 파일의 위치를 표시합니다.
- `--help`: 명령 사용법, 옵션, 인자에 대한 정보를 출력합니다.

## CLI 명령[​](#cli-commands "CLI 명령으로 바로 가기")

다음 섹션에서는 사용 가능한 CLI 명령과 각 명령에 사용할 수 있는 [공통 옵션](#universal-options) 외의 추가 옵션을 설명합니다.

### langflow[​](#langflow "langflow로 바로 가기")

인자 없이 CLI를 실행하면 사용 가능한 옵션과 명령의 목록이 출력됩니다.

- uv(권장)
- 직접 실행

```
uv run langflow
```

### langflow api-key[​](#langflow-api-key "langflow api-key로 바로 가기")

Langflow API 키를 생성합니다.

CLI로 API 키를 생성하려면 슈퍼유저 권한이 있어야 합니다.
자세한 내용은 [Langflow API 키](https://docs.langflow.org/api-keys-and-authentication#langflow-api-keys)를 참조하세요.

- uv(권장)
- 직접 실행

```
uv run langflow api-key
```

#### 옵션[​](#options "옵션으로 바로 가기")

| 옵션 | 기본값 | 타입 | 설명 |
| ------------- | ------- | ------ | ----------------------------------------------------------------------------- |
| `--log-level` | `error` | String | 로그 레벨. `debug`, `info`, `warning`, `error`, `critical` 중 하나입니다. |

### langflow copy-db[​](#langflow-copy-db "langflow copy-db로 바로 가기")

캐시 디렉터리에 있는 Langflow 데이터베이스 파일을 현재 Langflow 설치 디렉터리(즉, `__main__.py`가 있는 디렉터리)로 복사합니다.
복사 대상 디렉터리는 `which langflow`를 실행하여 확인할 수 있습니다.

캐시 디렉터리에 다음 파일이 존재하는 경우 복사됩니다.

- `langflow.db`: 사용자 캐시 디렉터리에 저장된 기본 Langflow 데이터베이스
- `langflow-pre.db`: 프리릴리스 데이터베이스(존재하는 경우)

- uv(권장)
- 직접 실행

```
uv run langflow copy-db
```

### langflow migration[​](#langflow-migration "langflow migration으로 바로 가기")

[Alembic](https://alembic.sqlalchemy.org/en/latest/)(SQLAlchemy용 데이터베이스 마이그레이션 도구)을 사용해 Langflow 데이터베이스 스키마 변경을 관리합니다.

`migration` 명령에는 두 가지 모드가 있습니다.

- **테스트 모드(기본값)**: 실제로 마이그레이션을 실행하지 않고 마이그레이션을 안전하게 적용할 수 있는지 확인합니다.
마이그레이션을 진행하기 전에 데이터베이스 스키마에 적용될 변경 사항을 미리 확인할 때 이 모드를 사용하세요.

- **Fix 모드**: 마이그레이션을 적용해 데이터베이스 스키마를 업데이트합니다.

  경고
      `langflow migration --fix`는 데이터를 삭제할 수 있는 파괴적인 작업입니다.
반드시 먼저 `langflow migration`을 실행하여 변경 사항을 미리 확인하세요.

- uv(권장)
- 전역 설치

1. 테스트 모드를 실행합니다.

```
uv run langflow migration
```

2. 테스트에서 반환된 변경 사항을 검토하여 마이그레이션을 진행해도 안전한지 확인합니다.

3. Fix 모드를 실행해 변경 사항을 적용합니다.

```
uv run langflow migration --fix
```

2. 테스트에서 반환된 변경 사항을 검토하여 마이그레이션을 진행해도 안전한지 확인합니다.

3. Fix 모드를 실행해 변경 사항을 적용합니다.

```
langflow migration --fix
```

### langflow run[​](#langflow-run "langflow run으로 바로 가기")

Langflow 서버를 시작합니다.

- uv(권장)
- 직접 실행

```
uv run langflow run [OPTIONS]
```

#### 옵션[​](#options-1 "옵션으로 바로 가기")

이 명령은 Langflow 서버에 대한 일부 일반적이고 민감하지 않은 구성 옵션을 지원합니다.
그 외의 옵션은 `.env` 파일이나 터미널에서 설정해야 합니다.
Langflow 구성 옵션에 대한 자세한 내용은 [Langflow 환경 변수](https://docs.langflow.org/environment-variables)를 참조하세요.

| 옵션 | 기본값 | 타입 | 설명 |
| ---------------------------- | ------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--auto-saving` | `--auto-saving`(true) | Boolean | 비주얼 에디터에서 플로우 자동 저장을 활성화할지 여부입니다. `--no-auto-saving`으로 자동 저장을 비활성화할 수 있습니다. |
| `--auto-saving-interval` | `1000` | Integer | 플로우 자동 저장 간격(밀리초)입니다. |
| `--backend-only` | `--no-backend-only`(false) | Boolean | Langflow의 백엔드 서비스만 실행할지 여부입니다(프론트엔드 없음). 생략하거나 `--no-backend-only`를 사용하면 프론트엔드와 백엔드가 모두 시작됩니다. [헤드리스 모드로 Langflow 시작](#start-langflow-in-headless-mode)을 참조하세요. |
| `--cache` | `async` | String | 사용할 [캐시 저장소](https://docs.langflow.org/memory) 타입입니다. `async`, `redis`, `memory`, `disk` 중 하나입니다. |
| `--components-path` | 설정 안 함 | String | 커스텀 컴포넌트가 있는 디렉터리 경로입니다. |
| `--dev` | `--no-dev`(false) | Boolean | 개발 모드로 실행할지 여부입니다(버그가 있을 수 있음). |
| `--env-file` | 설정 안 함 | String | Langflow 환경 변수가 담긴 `.env` 파일 경로입니다. [특정 .env 파일로 Langflow 시작](#start-langflow-with-a-specific-env-file)을 참조하세요. |
| `--frontend-path` | 설정 안 함 | String | 빌드 파일이 있는 프론트엔드 디렉터리 경로입니다. 이는 [Langflow 코드베이스에 기여](https://docs.langflow.org/contributing-how-to-contribute)하거나 커스텀 프론트엔드 코드를 포함하는 커스텀 Langflow 이미지를 개발할 때만 사용됩니다. |
| `--health-check-max-retries` | `5` | Integer | Langflow 서버 헬스 체크의 최대 재시도 횟수입니다. |
| `--host` | `localhost` | String | Langflow 서버가 실행될 호스트입니다. |
| `--log-file` | `logs/langflow.log` | String | Langflow 로그 파일 경로입니다. |
| `--log-level` | `critical` | String | 로그 레벨. `debug`, `info`, `warning`, `error`, `critical` 중 하나입니다. |
| `--log-rotation` | 설정 안 함 | String | 로그 순환(rotation) 주기로, 시간 간격이나 파일 크기로 지정합니다. |
| `--max-file-size-upload` | `1024` | Integer | 파일 업로드의 최대 크기(메가바이트)입니다. |
| `--open-browser` | `--no-open-browser`(false) | Boolean | 시작 시 시스템 웹 브라우저를 열지 여부입니다. `--open-browser`를 사용하면 Langflow 시작 시 시스템의 기본 웹 브라우저가 열립니다. |
| `--port` | `7860` | Integer | Langflow 서버가 실행될 포트입니다. 지정한 포트가 사용 중이면 서버가 자동으로 사용 가능한 포트를 선택합니다. |
| `--remove-api-keys` | `--no-remove-api-keys`(false) | Boolean | Langflow 데이터베이스에 저장된 플로우에서 API 키와 토큰을 제거할지 여부입니다. |
| `--ssl-cert-file-path` | 설정 안 함 | String | SSL 암호화 연결을 위한 로컬 시스템의 SSL 인증서 파일 경로입니다. |
| `--ssl-key-file-path` | 설정 안 함 | String | SSL 암호화 연결을 위한 로컬 시스템의 SSL 키 파일 경로입니다. |
| `--worker-timeout` | `300` | Integer | Langflow 서버 워커의 타임아웃(초)입니다. |
| `--workers` | `1` | Integer | Langflow 서버 워커 프로세스 개수입니다. |

#### 특정 .env 파일로 Langflow 시작하기[​](#start-langflow-with-a-specific-env-file "특정 .env 파일로 Langflow 시작하기로 바로 가기")

`--env-file` 옵션은 지정된 `.env` 파일에 정의된 구성으로 Langflow를 시작합니다.
이 명령에 추가로 덧붙인 옵션은 중복되는 값이 있을 경우 `.env` 파일의 값보다 우선합니다.

`--env-file`을 생략하거나 필요한 모든 변수를 포함하지 않는 경우, Langflow는 해당 변수에 대해 기본값을 사용합니다.

- uv(권장)
- 직접 실행

```
uv run langflow run --env-file PATH/TO/LANGFLOW/.env
```

#### 헤드리스 모드로 Langflow 시작하기[​](#start-langflow-in-headless-mode "헤드리스 모드로 Langflow 시작하기로 바로 가기")

`--backend-only` 옵션은 Langflow의 백엔드 서비스만 시작합니다.
이 헤드리스 모드에는 프론트엔드(비주얼 에디터)가 없으며, Langflow API와 CLI를 통해서만 프로그래밍 방식으로 서버에 접근할 수 있습니다.

- uv(권장)
- 직접 실행

```
uv run langflow run --backend-only
```

### langflow superuser[​](#langflow-superuser "langflow superuser로 바로 가기")

지정한 사용자명과 비밀번호로 슈퍼유저 계정을 생성합니다.

- uv(권장)
- 직접 실행

```
uv run langflow superuser --username [NAME] --password [PASSWORD] [OPTIONS]
```

#### 옵션[​](#options-2 "옵션으로 바로 가기")

| 옵션 | 기본값 | 타입 | 설명 |
| ------------- | ------- | ------ | ----------------------------------------------------------------------------- |
| `--log-level` | `error` | String | 로그 레벨. `debug`, `info`, `warning`, `error`, `critical` 중 하나입니다. |

이 명령에서 `--username`과 `--password`는 선택 사항이 아니며 기본값도 없습니다.
이 인자들을 제공하지 않으면 명령이 실패합니다.
자세한 내용은 [`LANGFLOW_SUPERUSER` 및 `LANGFLOW_SUPERUSER_PASSWORD`](https://docs.langflow.org/api-keys-and-authentication#langflow-superuser)를 참조하세요.

#### CLI 슈퍼유저 생성 비활성화하기[​](#disable-cli-superuser-creation "CLI 슈퍼유저 생성 비활성화하기로 바로 가기")

`langflow superuser` 명령은 [`LANGFLOW_ENABLE_SUPERUSER_CLI`](https://docs.langflow.org/api-keys-and-authentication#langflow-enable-superuser-cli) 환경 변수로 제어됩니다.

- **`LANGFLOW_ENABLE_SUPERUSER_CLI=True`(기본값)**: `langflow superuser` 명령을 사용할 수 있으며, 슈퍼유저 생성에 제한이 없습니다.
- **`LANGFLOW_ENABLE_SUPERUSER_CLI=False`(권장)**: `langflow superuser` 명령을 비활성화합니다.
보안상의 이유로, 특히 프로덕션 환경에서는 무단 슈퍼유저 생성을 방지하기 위해 이 설정을 권장합니다.

`langflow superuser` 명령을 비활성화하려면 Langflow `.env` 파일에 `LANGFLOW_ENABLE_SUPERUSER_CLI=False`를 설정한 다음, [해당 `.env` 파일로 Langflow를 시작](#start-langflow-with-a-specific-env-file)해야 합니다.
