# 로그

> 원문: https://docs.langflow.org/next/logging

Langflow는 [structlog](https://www.structlog.org) 라이브러리를 사용하여 개별 플로우와 Langflow 애플리케이션 자체에 대한 로그를 생성합니다.

기본적으로 OSS Langflow는 로그를 stdout에 기록합니다. 로그를 파일에 기록하려면 `LANGFLOW_LOG_FILE`을 원하는 경로로 설정하세요.

## 로그 저장

`LANGFLOW_CONFIG_DIR` 환경 변수는 Langflow가 구성 및 데이터 파일을 저장하는 위치를 제어합니다. 기본 위치는 운영체제에 따라 다릅니다.

- **Langflow Desktop**:

  * **macOS**: `/Users/<username>/Library/Logs/com.LangflowDesktop`
  * **Windows**: `C:\Users\<username>\AppData\Local\com.LangflowDesktop\logs`

- **OSS Langflow** (`uv pip install`, `git clone` 등 모든 설치 방식 포함):

  * **macOS**: `/Users/<username>/Library/Caches/langflow`
  * **Linux**: `/home/<username>/.cache/langflow`
  * **Windows/WSL**: `C:\Users\<username>\AppData\Local\langflow\langflow\Cache`

로그 저장 위치와 동작을 사용자 지정하려면 Langflow `.env` 파일에 다음 [Langflow 환경 변수](https://docs.langflow.org/environment-variables)를 설정한 다음, `uv run langflow run --env-file .env`로 Langflow를 시작하세요.

| 변수 | 형식 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `LANGFLOW_CONFIG_DIR` | String | 다양함 | 파일과 로그가 저장되는 Langflow 구성 디렉터리를 설정합니다. 기본 경로는 앞서 설명한 대로 설치 방식에 따라 다릅니다. |
| `LANGFLOW_ENABLE_LOG_RETRIEVAL` | Boolean | `False` | [Logs 엔드포인트](https://docs.langflow.org/api-logs)를 통해 Langflow 인스턴스의 로그를 조회할 수 있도록 활성화합니다. |
| `LANGFLOW_ENVIRONMENT` | String | 설정 안 됨 | 설정 시 모든 JSON 로그 레코드에 `environment` 필드를 추가합니다(`staging`, `production` 등). 설정하지 않으면 생략됩니다. |
| `LANGFLOW_LOG_ENV` | String | `default` | 주요 로그 형식 제어자입니다. `container` 또는 `container_json`: [`JSONRenderer`](https://www.structlog.org/en/stable/api.html#structlog.processors.JSONRenderer)를 통한 JSON 형식. `container_csv`: 키-값 형식. `default` 또는 설정 안 함: `LANGFLOW_PRETTY_LOGS`로 형식을 결정합니다. [JSON 로그 형식](#json-로그-형식)을 참고하세요. |
| `LANGFLOW_LOG_FILE` | String | 설정 안 됨 | 로그 파일 저장 위치를 설정합니다. 예: `LANGFLOW_LOG_FILE=path/to/logfile.log`. 설정하지 않으면 로그는 stdout에 기록됩니다. |
| `LANGFLOW_LOG_FORMAT` | String | 설정 안 됨 | 키-값 형식은 `key_value`, [`ConsoleRenderer`](https://www.structlog.org/en/stable/console-output.html)는 `console`로 설정합니다. `LANGFLOW_LOG_ENV=default`이고 `LANGFLOW_PRETTY_LOGS=true`일 때만 적용됩니다. |
| `LANGFLOW_LOG_LEVEL` | String | `ERROR` | 전역 로그 레벨입니다. `DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL` 중 하나입니다. |
| `LANGFLOW_LOG_LEVELS` | String | 설정 안 됨 | `name=LEVEL,name=LEVEL` 형태의 로거별 레벨 오버라이드입니다. 전역 기본값을 바꾸지 않고 특정 로거에 대해서만 `LANGFLOW_LOG_LEVEL`을 덮어씁니다. 형식이 잘못되면 시작 시 `UserWarning`이 발생합니다. 예: `sqlalchemy.engine=WARNING,httpx=INFO`. |
| `LANGFLOW_LOG_REDACT_KEYS` | String | 설정 안 됨 | 기본값(`password`, `api_key`, `token`, `authorization`, `cookie` 등)에 더해 JSON 로그 레코드에서 삭제할 추가 키를 쉼표로 구분하여 지정합니다. |
| `LANGFLOW_LOG_RETRIEVER_BUFFER_SIZE` | Integer | `10000` | `LANGFLOW_ENABLE_LOG_RETRIEVAL=True`일 때 로그 조회를 위한 버퍼 크기입니다. `0`보다 커야 합니다. |
| `LANGFLOW_LOG_ROTATION` | String | `1 day` | 시간(`1 day`, `12 hours`, `1 week`) 또는 크기(`10 MB`, `1 GB`) 기준으로 로그 파일 순환을 제어합니다. 순환을 비활성화하려면 `None`으로 설정하세요. |
| `LANGFLOW_LOG_TRACE_LOCALS` | Boolean | `false` | 구조화된 트레이스백에 프레임 로컬 변수를 포함합니다. 로컬 변수에는 비밀 값이 노출될 수 있어 기본적으로 꺼져 있으며, 로컬 디버깅 시에만 활성화하세요. |
| `LANGFLOW_NATIVE_TRACING` | Boolean | `true` | 트레이서가 Trace View에서 사용할 실행 트레이스를 Langflow 데이터베이스에 기록하도록 활성화합니다. 비활성화하려면 `false`로 설정하세요. |
| `LANGFLOW_PRETTY_LOGS` | Boolean | `True` | `LANGFLOW_LOG_ENV=default` 또는 설정하지 않았을 때의 출력 형식을 제어합니다. `true`: [`ConsoleRenderer`](https://www.structlog.org/en/stable/console-output.html)(사람이 읽기 쉬운 형식). `false`: JSON 형식. |
| `LANGFLOW_SERVICE_NAME` | String | `langflow` | 모든 JSON 로그 레코드의 `service` 필드 값입니다. 로그 수집기에서 레이블로 사용됩니다. [Grafana와 Loki](https://docs.langflow.org/next/observability-grafana-loki)를 참고하세요. |
| `LANGFLOW_VERSION` | String | 설정 안 됨 | 설정 시 모든 JSON 로그 레코드에 `version` 필드를 추가합니다. 설정하지 않으면 생략됩니다. |

## 실시간 로그 확인

기본적으로 OSS Langflow는 로그를 stdout에 기록합니다. tail로 확인할 수 있는 파일에 로그를 기록하려면 다음 절차를 따르세요.

1. `.env` 파일에서 `LANGFLOW_LOG_FILE`을 파일 경로로 설정합니다.

```text
LANGFLOW_LOG_FILE=/path/to/langflow.log
```

2. `.env` 파일을 사용하여 Langflow를 시작합니다.

```bash
uv run langflow run --env-file .env
```

3. `LANGFLOW_LOG_FILE`을 설정한 디렉터리로 이동합니다.

  - macOS
  - Windows

```bash
cd /Users/**USERNAME**/Library/Caches/langflow
```

- 로그 파일을 tail로 확인합니다.

  - macOS
  - Windows

```bash
tail -f langflow.log
```

새 로그 항목이 보이지 않으면 Langflow가 실행 중인지 확인하고, 로그 이벤트를 발생시킬 만한 작업을 수행해 보세요. Langflow를 시작한 터미널에서 로그가 출력되고 있는지도 확인할 수 있습니다.

## 플로우 및 컴포넌트 로그

플로우를 실행한 후에는 각 컴포넌트와 플로우 실행에 대한 로그를 확인할 수 있습니다.
예를 들어 [입력 및 출력 컴포넌트](https://docs.langflow.org/chat-input-and-output)가 수집하고 생성하는 `Message` 객체를 확인할 수 있습니다.

### 플로우 로그 보기

비주얼 에디터에서 **Logs**를 클릭하면 전체 플로우에 대한 로그를 볼 수 있습니다.

![Logs pane](https://docs.langflow.org/assets/images/logs-cc30f076e63a5e443cf04855559703a3.png)

그런 다음 **inputs**와 **outputs** 열의 셀을 클릭해 `Message` 객체를 확인합니다.
예를 들어 다음 `Message` 데이터는 **Chat Input** 컴포넌트의 출력일 수 있습니다.

```text
"messages": [
{
    "message": "What's the recommended way to install Docker on Mac M1?",
    "sender": "User",
    "sender_name": "User",
    "session_id": "Session Apr 21, 17:37:04",
    "stream_url": null,
    "component_id": "ChatInput-4WKag",
    "files": [],
    "type": "text"
}
],
```

입력/출력 컴포넌트의 경우, 원본 입력이 `Message` 객체 형태로 구조화되지 않았을 수도 있습니다.
예를 들어 언어 모델 컴포넌트는 원시 텍스트 응답을 **Chat Output** 컴포넌트로 전달하고, 이 컴포넌트가 이를 `Message` 객체로 변환할 수 있습니다.

플로우에 대한 `.log` 파일은 Langflow 설치의 로그 저장 위치에서 찾을 수 있습니다.
파일 경로는 [로그 저장](#로그-저장)을 참고하세요.

### 채팅 로그 보기

**Playground**에서 각 채팅 세션의 채팅 기록을 확인할 수 있습니다.
자세한 내용은 [채팅 기록 보기](https://docs.langflow.org/concepts-playground#view-chat-history)를 참고하세요.

### 단일 컴포넌트의 출력 보기

플로우 출력의 형식이나 내용에 문제가 있을 때, 각 컴포넌트의 출력을 확인하면 데이터가 어디에서 손실되거나 잘못 변형되는지 파악하는 데 도움이 됩니다.

가장 최근 실행에서 단일 컴포넌트가 생성한 출력을 보려면, 비주얼 에디터에서 해당 컴포넌트의 **Inspect output**을 클릭하세요.

## Langflow Desktop 로그 접근

Langflow Desktop에서 문제가 발생하면 디버깅을 위해 시작 로그에 접근해야 할 수 있습니다.
운영체제에 맞는 절차를 따르세요.

- macOS
- Windows

1. 터미널을 열고 다음을 실행합니다.

```bash
cd ~/Library/Logs/com.LangflowDesktop
```

2. 폴더를 열어 로그 파일을 확인하려면 다음 명령을 실행합니다.

```bash
open .
```

3. `langflow.log` 파일을 찾습니다.

- 폴더를 열어 로그 파일을 확인합니다.

```cmd
start .
```

- `langflow.log` 파일을 찾습니다.

로그 파일을 사용해 직접 문제를 조사하거나, [GitHub Issue](https://docs.langflow.org/contributing-github-issues)에 맥락을 추가하거나, 디버깅 지원을 위해 [지원팀](https://docs.langflow.org/luna-for-langflow)에 보낼 수 있습니다.

로그 파일은 Langflow Desktop이 실행될 때만 생성됩니다. 로그 파일이 보이지 않으면 먼저 Langflow Desktop을 시작한 후 로그 파일을 다시 확인해 보세요.

## 로그 형식

기본적으로 structlog는 [`ConsoleRenderer`](https://www.structlog.org/en/stable/api.html#structlog.dev.ConsoleRenderer)를 사용하여 다음과 같은 구조의 사람이 읽기 쉬운 출력을 생성합니다.

예:

```text
2026-05-17T18:18:29Z [info     ] incoming request    logger=langflow.api.run flow_id=flow-718 user_id=user-4823
```

### JSON 로그 형식

`LANGFLOW_LOG_ENV=container`로 설정하면 structlog의 터미널 프로세서가 [`JSONRenderer`](https://www.structlog.org/en/stable/api.html#structlog.processors.JSONRenderer)로 전환되어, stdout에 기록되는 모든 줄이 이벤트 메시지, 레벨, 타임스탬프, 로거 이름, 예외 구조, 서비스 메타데이터를 포함하는 JSON 객체가 됩니다.

JSON 모드에서의 일반적인 레코드는 다음과 같습니다.

```json
{
  "event": "incoming request",
  "level": "info",
  "logger": "langflow.api.run",
  "timestamp": "2026-05-17T18:18:29.100798Z",
  "service": "langflow",
  "version": "1.10.0",
  "environment": "production",
  "user_id": "user-4823",
  "flow_id": "flow-718",
  "authorization": "***",
  "cookie": "***",
  "request_body": {
    "input": "Tell me a joke",
    "api_key": "***",
    "session_id": "Session Apr 21, 17:37:04"
  }
}
```

로그 레코드에 예외가 포함된 경우, `exception` 필드에는 일반 문자열 대신 구조화된 트레이스백이 담깁니다.

```json
{
  "event": "flow run failed",
  "level": "error",
  "logger": "langflow.api.run",
  "timestamp": "2026-05-17T18:18:32.412Z",
  "service": "langflow",
  "exception": [
    {
      "exc_type": "ConnectionError",
      "exc_value": "upstream returned 503",
      "frames": [
        {"filename": "/app/.../runner.py", "lineno": 142, "name": "run_flow"}
      ]
    }
  ]
}
```

각 스택 프레임의 로컬 변수인 프레임 로컬은 API 키, 요청 본문, 환경 값을 노출할 수 있으므로 기본적으로 제외됩니다. 로컬 디버깅을 위해 이를 포함하려면 `LANGFLOW_LOG_TRACE_LOCALS=true`로 설정하세요.

#### 표준 라이브러리 로거

Python 표준 logging 모듈을 사용하는 서드파티 라이브러리(`uvicorn`, `sqlalchemy`, `httpx`, `langchain`, `asyncio`)는 컨테이너 모드에서 동일한 JSON 스트림을 통해 라우팅됩니다. 원래 로거 이름은 `logger` 필드에 그대로 유지되므로, 애플리케이션 로거에 적용되는 로그 쿼리는 라이브러리 출력에도 동일하게 적용됩니다.

#### OpenTelemetry 트레이스 상관관계

`opentelemetry-api`가 설치되어 있고 활성 스팬이 존재하면, 모든 로그 레코드는 자동으로 `trace_id`와 `span_id`를 포함하게 됩니다. OpenTelemetry는 필수 의존성이 아니며, 설치되어 있지 않으면 이 프로세서는 아무 동작도 하지 않고 다른 부분에는 영향이 없습니다.

## 참고 자료

- [Grafana와 Loki](https://docs.langflow.org/next/observability-grafana-loki)
- [Logs 엔드포인트](https://docs.langflow.org/api-logs)
- [메모리 관리 옵션](https://docs.langflow.org/memory)
- [외부 PostgreSQL 데이터베이스 구성](https://docs.langflow.org/configuration-custom-database)
