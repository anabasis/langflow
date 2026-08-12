# Langflow 문제 해결

이 페이지는 Langflow를 사용하거나 기여할 때 발생할 수 있는 문제에 대한 해결 방법을 제공합니다.

---

## 누락된 컴포넌트

Langflow 개발이 계속됨에 따라 컴포넌트가 자주 재분류되거나 더 나은 정렬이나 새 컴포넌트 준비를 위해 더 이상 사용되지 않습니다.

**Core components** 메뉴에서 컴포넌트가 누락된 것 같으면:

- 컴포넌트를 **검색**해보세요.
- 다른 컴포넌트 카테고리와 **Bundles**를 확인하세요.
- 기본적으로 숨겨진 [레거시 컴포넌트](../components-reference/components-overview.md)를 확인하세요.
- 최신 릴리스의 컴포넌트 변경사항은 [Changelog](https://github.com/langflow-ai/langflow/releases/latest)를 확인하세요.
- 단일 사용 컴포넌트의 경우 플로우에 이미 있는지 확인하세요.

---

## 플레이그라운드에서 입력 없음

**플레이그라운드**에 메시지 입력 필드가 없으면 플로우에 **Language Model** 또는 **Agent** 컴포넌트의 **Input** 포트에 직접 또는 간접적으로 연결된 [**Chat Input** 컴포넌트](../components-reference/chat-input-and-output.md)가 있는지 확인하세요.

---

## 누락된 키, 키를 찾을 수 없음, 또는 유효하지 않은 API 키

플로우를 실행할 때 API 키 오류가 발생하면:

- 자격증명이 필요한 모든 컴포넌트에 유효한 자격증명이 있는지 확인하세요.
- 자격증명을 [Langflow 전역 변수](../develop/global-variables.md)에 저장하는 경우 올바른 전역 변수를 선택했는지, 해당 변수에 유효한 자격증명이 포함되어 있는지 확인하세요.
- 제공된 자격증명이 활성화되어 있고 필요한 권한이 있는지, 해당하는 경우 필요한 작업을 실행하기에 충분한 계정 크레딧이 있는지 확인하세요.

---

## Langflow 설치 문제

### pip 종속성 해결에서 Langflow 설치가 중단됨

`pip install langflow`으로 Langflow OSS를 설치할 때 천천히 실패하는 경우:

```
pip is looking at multiple versions of <<library>> to determine which version is compatible...
```

`pip` 대신 `uv`로 Langflow를 설치하세요:

```bash
uv pip install langflow
```

### Linux 설치에서 필요한 패키지 빌드 실패

Linux에서 Langflow OSS 설치 시 설치가 실패하는 경우, 필요한 빌드 종속성을 설치하고 다시 시도하세요:

```bash
sudo apt-get update
sudo apt-get install build-essential python3-dev
```

`gcc`를 별도로 설치해야 하는 경우:

```bash
sudo apt-get install gcc
```

### `webrtcvad` 패키지로 인한 설치 실패

`webrtcvad` 패키지에서 오류가 발생하면 가상 환경에서 `uv pip install webrtcvad-wheels`를 실행하고 Langflow 설치를 다시 시도하세요.

---

## Langflow Desktop 설치 문제

### Intel Mac에서 Protocol Buffers (protoc) 필요

Intel 기반 Mac에서 Langflow를 설치하는 경우 Protocol Buffers Compiler(`protoc`)가 설치되어 있지 않으면 설치 오류가 발생할 수 있습니다.

이 문제를 해결하려면 `brew install protobuf`를 사용하여 `protoc`를 설치하세요.

### Langflow 설치 실패

Langflow Desktop이 Langflow OSS를 설치했지만 설치를 확인할 수 없는 경우:

1. Langflow Desktop을 닫습니다.
2. Windows: `%LOCALAPPDATA%\com.LangflowDesktop`, macOS: `~/Library/Application Support/com.LangflowDesktop`에서 `venv` 또는 `python_env` 폴더를 삭제합니다.
3. Langflow Desktop을 다시 시작합니다.

### Langflow 시작 실패

포트 `7860`을 사용하는 다른 프로세스가 없는지 확인하세요:
- Windows: `netstat -ano | findstr :7860`
- macOS 또는 Linux: `lsof -i :7860`

### uv 설치 실패 또는 uv를 찾을 수 없음

수동으로 `uv`를 설치하세요:

**Windows (PowerShell):**
```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

**macOS 또는 Linux:**
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

---

## Langflow 제거

### Langflow OSS Python 패키지 제거

Langflow가 설치된 가상 환경에서:

```bash
uv pip uninstall langflow
```

Langflow 데이터 디렉토리 제거:

**macOS / Linux:**
```bash
rm -rf ~/.langflow
```

### Langflow Desktop 제거

**macOS:**
1. `/Applications`에서 `Langflow.app`을 휴지통으로 드래그합니다.
2. 다음 명령어로 데이터 파일을 제거합니다:
```bash
rm -rf ~/.langflow
rm -rf ~/Library/Application\ Support/com.LangflowDesktop
rm -rf ~/Library/Caches/com.LangflowDesktop
rm -rf ~/Library/Logs/com.LangflowDesktop
```

---

## Langflow 시작 문제

### `langflow.__main__` 모듈 없음

`langflow run` 명령어로 Langflow를 실행할 때 오류가 발생하는 경우:

1. 대신 `uv run langflow run`을 실행합니다.
2. 그래도 안 되면 `uv pip install langflow -U`로 최신 Langflow를 재설치합니다.

### 쿼리 또는 헤더로 API 키 전달해야 함

Langflow 로그인 페이지에서 `An API key must be passed as query or header` 오류가 발생하는 경우:

`LANGFLOW_AUTO_LOGIN`이 `false`로 설정되어 있어 슈퍼유저만 비-슈퍼유저 계정을 만들고 활성화할 수 있습니다.

관리자라면 슈퍼유저 계정으로 로그인하거나 `LANGFLOW_AUTO_LOGIN=true`로 Langflow를 재시작하세요.

---

## Langflow 업그레이드 문제

### 모델과 데이터베이스 불일치

Langflow 업그레이드 시 다음 오류가 발생하는 경우:

```
There's a mismatch between the models and the database.
```

마이그레이션 수정 명령어를 실행하세요:

```bash
uv run langflow migration --fix
```

---

## Langflow MCP 문제

### 기본 프로젝트 MCP 서버가 인증 없음일 때만 작동

API 키가 `env` 객체 대신 `args` 배열의 올바른 위치에 추가되었는지 확인하세요:

```json
{
  "mcpServers": {
    "PROJECT_NAME": {
      "command": "uvx",
      "args": [
        "mcp-proxy",
        "--transport",
        "streamablehttp",
        "--headers",
        "x-api-key",
        "YOUR_API_KEY",
        "http://LANGFLOW_SERVER_ADDRESS/api/v1/mcp/project/PROJECT_ID/streamable"
      ]
    }
  }
}
```

### Claude for Desktop이 MCP 서버 도구를 올바르게 사용하지 않음

`claude_desktop_config.json` 파일에서 로컬 `uvx` 또는 `npx` 실행 파일의 경로를 명시적으로 정의해보세요:

1. `uvx` 경로 찾기: `which uvx`
2. 구성 파일에 경로 추가:

```json
{
  "mcpServers": {
    "PROJECT_NAME": {
      "command": "PATH_TO_UVX",
      "args": [
        "mcp-proxy",
        "http://LANGFLOW_SERVER_ADDRESS/api/v1/mcp/project/PROJECT_ID/streamable"
      ]
    }
  }
}
```

### MCP Tools 컴포넌트가 플로우 업그레이드 후 Tool Mode 옵션을 잃어버림

Langflow 버전 1.7.1 이하에서 만든 플로우를 업그레이드한 후 이 문제가 발생하면:

1. 플로우에서 **MCP Tools** 컴포넌트를 선택합니다.
2. **Code**를 클릭하여 컴포넌트 코드 편집기를 엽니다.
3. 입력에서 `tool_mode` 필드를 찾습니다.
4. 필드가 누락된 경우 추가하고 `true`로 설정합니다:

```python
tool_mode = True
```

5. **Check & Save**를 클릭합니다.

---

## Docker 컨테이너에서 문서 처리 오류

Linux 기반 Docker 컨테이너에서 Langflow를 실행하는 경우 Docling에는 기본 Docker 이미지에 포함되지 않은 시스템 라이브러리가 필요합니다. Dockerfile에 다음을 추가하세요:

```dockerfile
RUN apt-get update && apt-get install -y libgl1 libglib2.0-0
```

---

## 멀티 워커 배포

### 워커가 `JobQueueNotFoundError` 보고

로드 밸런서가 폴 또는 스트림 요청을 빌드를 시작한 것과 다른 워커로 라우팅하고 있습니다.

해결 방법:
- 일부가 아닌 **모든** 워커에 `LANGFLOW_JOB_QUEUE_TYPE=redis`가 설정되어 있는지 확인합니다.
- 모든 워커가 동일한 Redis 인스턴스에 도달할 수 있는지 확인합니다.

### Redis 연결 거부 또는 인증 오류

Redis 인스턴스에 비밀번호나 TLS가 필요한 경우 `LANGFLOW_REDIS_QUEUE_URL` (예: `rediss://user:password@host:6380/1`)을 사용해야 합니다.

---

## 참고 항목

- [Langflow GitHub 이슈 및 토론](./github-issues.md)

---

*원문: https://docs.langflow.org/next/troubleshoot*
