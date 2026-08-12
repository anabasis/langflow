# 로그

Langflow는 [structlog](https://www.structlog.org) 라이브러리를 사용하여 개별 플로우와 Langflow 애플리케이션 자체에 대한 로그를 생성합니다.

기본적으로 OSS Langflow는 stdout에 로그를 씁니다. 파일에 로그를 쓰려면 `LANGFLOW_LOG_FILE`을 원하는 경로로 설정합니다.

---

## 로그 저장소

`LANGFLOW_CONFIG_DIR` 환경 변수는 Langflow가 구성 및 데이터 파일을 저장하는 위치를 제어합니다. 기본 위치는 운영 체제에 따라 다릅니다:

**Langflow Desktop:**
- macOS: `/Users/<username>/Library/Logs/com.LangflowDesktop`
- Windows: `C:\Users\<username>\AppData\Local\com.LangflowDesktop\logs`

**OSS Langflow** (uv pip install 및 git clone 포함 모든 설치 방법):
- macOS: `/Users/<username>/Library/Caches/langflow`
- Linux: `/home/<username>/.cache/langflow`
- Windows/WSL: `C:\Users\<username>\AppData\Local\langflow\langflow\Cache`

로그 저장 위치 및 동작을 사용자 정의하려면 다음 환경 변수를 `.env` 파일에 설정합니다:

| 변수 | 형식 | 기본값 | 설명 |
|------|------|--------|------|
| `LANGFLOW_CONFIG_DIR` | String | 운영 체제에 따라 다름 | 파일 및 로그가 저장되는 Langflow 구성 디렉토리 |
| `LANGFLOW_ENABLE_LOG_RETRIEVAL` | Boolean | `False` | Logs 엔드포인트로 로그 검색 활성화 |
| `LANGFLOW_ENVIRONMENT` | String | 미설정 | JSON 로그 레코드에 `environment` 필드 추가 |
| `LANGFLOW_LOG_ENV` | String | `default` | 로그 형식 제어. `container` 또는 `container_json`: JSON 형식. `container_csv`: 키-값 형식 |
| `LANGFLOW_LOG_FILE` | String | 미설정 | 로그 파일 저장 위치. 미설정 시 stdout에 기록 |
| `LANGFLOW_LOG_LEVEL` | String | `ERROR` | 전역 로그 레벨: `DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL` |
| `LANGFLOW_LOG_LEVELS` | String | 미설정 | 로거별 레벨 재정의. 예: `sqlalchemy.engine=WARNING,httpx=INFO` |
| `LANGFLOW_PRETTY_LOGS` | Boolean | `True` | `true`: 사람이 읽기 쉬운 ConsoleRenderer. `false`: JSON 형식 |
| `LANGFLOW_LOG_ROTATION` | String | `1 day` | 로그 파일 로테이션: 시간(`1 day`, `12 hours`) 또는 크기(`10 MB`) |
| `LANGFLOW_NATIVE_TRACING` | Boolean | `true` | Langflow 데이터베이스에서 실행 추적을 기록하는 트레이서 활성화 |

---

## 실시간 로그 보기

기본적으로 OSS Langflow는 stdout에 로그를 씁니다. 실시간으로 추적할 수 있는 파일에 로그를 쓰려면:

1. `.env` 파일에 `LANGFLOW_LOG_FILE`을 설정합니다:

```
LANGFLOW_LOG_FILE=/path/to/langflow.log
```

2. `.env` 파일로 Langflow를 시작합니다:

```bash
uv run langflow run --env-file .env
```

3. 로그 파일을 추적합니다:

```bash
# macOS/Linux
tail -f /path/to/langflow.log
```

---

## 플로우 및 컴포넌트 로그

플로우를 실행한 후 각 컴포넌트 및 플로우 실행에 대한 로그를 검사할 수 있습니다.

### 플로우 로그 보기

비주얼 에디터에서 **Logs**를 클릭하여 전체 플로우의 로그를 봅니다.

**inputs** 및 **outputs** 열의 셀을 클릭하여 `Message` 객체를 검사합니다.

### 단일 컴포넌트의 출력 보기

플로우 출력의 형식 또는 내용 문제를 디버그할 때 각 컴포넌트의 출력을 검사하는 것이 도움이 됩니다.

비주얼 에디터에서 컴포넌트의 **Inspect output**을 클릭하여 가장 최근 실행 중에 단일 컴포넌트가 생성한 출력을 봅니다.

### 채팅 로그 보기

**플레이그라운드**에서 각 채팅 세션의 채팅 기록을 검사할 수 있습니다.

---

## Langflow Desktop 로그 접근

Langflow Desktop 문제가 발생하면 디버깅을 위해 시작 로그에 접근해야 할 수 있습니다:

**macOS:**

```bash
cd ~/Library/Logs/com.LangflowDesktop
open .
```

`langflow.log` 파일을 찾습니다.

---

## 로그 형식

기본적으로 structlog는 ConsoleRenderer를 사용하여 사람이 읽기 쉬운 출력을 생성합니다:

```
2026-05-17T18:18:29Z [info     ] incoming request    logger=langflow.api.run flow_id=flow-718 user_id=user-4823
```

### JSON 로그 형식

`LANGFLOW_LOG_ENV=container`를 설정하면 structlog가 JSONRenderer로 전환되어 stdout에 쓰이는 모든 줄이 JSON 객체가 됩니다:

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
  "cookie": "***"
}
```

민감한 정보(`api_key`, `token`, `authorization`, `cookie` 등)는 기본적으로 `***`로 마스킹됩니다.

---

## 참고 항목

- [환경 변수](./environment-variables.md)

---

*원문: https://docs.langflow.org/next/logging*
