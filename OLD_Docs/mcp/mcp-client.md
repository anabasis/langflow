# Langflow를 MCP 클라이언트로 사용

Langflow는 MCP 서버와 MCP 클라이언트 모두로서 [모델 컨텍스트 프로토콜(MCP)](https://modelcontextprotocol.io/introduction)과 통합됩니다.

이 페이지에서는 [**MCP Tools** 컴포넌트](#mcp-tools-컴포넌트-사용)와 연결된 [MCP 서버](#연결된-mcp-서버-관리)를 통해 Langflow를 MCP 클라이언트로 사용하는 방법을 설명합니다.

Langflow를 MCP 서버로 사용하는 방법에 대한 자세한 내용은 [Langflow를 MCP 서버로 사용](./mcp-server.md)을 참조하세요.

---

## MCP Tools 컴포넌트 사용

**MCP Tools** 컴포넌트는 MCP 서버에 연결하여 [Langflow 에이전트](../agents/use-agents.md)가 사용자 쿼리에 응답할 때 서버의 도구를 사용할 수 있게 합니다.

MCP 서버를 등록한 후 **MCP** 사이드바에서 **MCP Tools**를 추가하세요.

이 컴포넌트는 접근하려는 서버 유형에 따라 두 가지 모드가 있습니다:

- [비-Langflow MCP 서버에 연결](#비-langflow-mcp-서버에-연결) — JSON 구성 파일, 서버 시작 명령어, 또는 HTTP/SSE URL로 외부 비-Langflow MCP 서버에서 제공하는 도구에 접근
- [Langflow MCP 서버에 연결](#langflow-mcp-서버-연결) — [Langflow 프로젝트](../flows/build-flows.md)의 플로우를 MCP 도구로 사용

---

### 비-Langflow MCP 서버에 연결

> **팁**: `uvx`는 Langflow 패키지의 `uv`에 포함되어 있습니다.
>
> `npx` 서버 명령어를 사용하려면 먼저 [Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) LTS 릴리스를 설치해야 합니다.

1. MCP 서버를 등록합니다.
   **Settings** → **MCP Servers**를 열고 **Add MCP Server**를 클릭하거나, 플로우 편집기의 왼쪽 사이드바에서 **MCP**를 클릭한 후 **Add MCP Server**를 클릭합니다.

2. 서버를 구성하고 저장합니다.
   연결 세부 정보를 입력하고 **Save**를 클릭합니다.

3. **MCP** 사이드바에서 새 서버를 캔버스로 드래그합니다.
   해당 서버의 **MCP Tools** 컴포넌트가 캔버스에 추가됩니다.

4. **MCP Tools** 컴포넌트의 **MCP Server** 필드에서 등록한 서버를 선택합니다.

   새 서버는 다음 연결 유형 중 하나를 사용하여 **Settings** > **MCP Servers** 또는 **MCP** 사이드바 > **Add MCP Server**에서 등록됩니다:

   - **JSON**: 서버의 JSON 구성 객체를 필드에 붙여넣고 **Add Server**를 클릭합니다.
   - **STDIO**: 서버 **이름**, **명령어**, **인수**, **환경 변수**를 입력하고 **Add Server**를 클릭합니다.
     예를 들어 [Fetch](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) 서버를 시작하려면 **Command**는 `uvx mcp-server-fetch`입니다.
   - **HTTP/SSE**: 서버 **이름**, **URL**, **헤더**, **환경 변수**를 입력하고 **Add Server**를 클릭합니다.
     Langflow MCP 서버의 기본 **URL**은 `http://localhost:7860/api/v1/mcp/project/PROJECT_ID/streamable` 또는 `http://localhost:7860/api/v1/mcp/streamable`입니다.

5. MCP 서버의 헤더를 구성하려면 각 헤더를 키-값 쌍으로 **Headers** 필드에 입력합니다.
   헤더 값에 [전역 변수](../develop/global-variables.md)를 사용할 수 있습니다.

6. 서버 명령어에 환경 변수를 사용하려면 각 변수를 **Env** 필드에 키-값 쌍으로 입력합니다.

7. **Tool** 필드에서 이 컴포넌트가 사용할 도구를 선택하거나, MCP 서버가 제공하는 모든 도구에 접근할 수 있도록 필드를 비워둡니다.

8. 컴포넌트의 헤더 메뉴에서 **Tool mode**를 활성화하여 에이전트와 함께 사용할 수 있게 합니다.

9. **MCP Tools** 컴포넌트의 **Toolset** 포트를 **Agent** 컴포넌트의 **Tools** 포트에 연결합니다.

10. 플로우를 테스트하여 MCP 서버가 연결되고 선택한 도구가 에이전트에 의해 사용되는지 확인합니다.

---

### Langflow MCP 서버 연결

모든 Langflow 프로젝트는 프로젝트의 플로우를 MCP 도구로 노출하는 별도의 MCP 서버를 실행합니다.

Langflow MCP 서버는 **streamable HTTP** 전송 및 폴백으로 **Server-Sent Events(SSE)**를 지원합니다.

1. Langflow MCP 서버를 등록합니다.
   **Settings** > **MCP Servers** 또는 플로우 사이드바의 **MCP** 섹션을 열고 **Add MCP Server**를 클릭한 후 **HTTP/SSE** 모드를 선택합니다.

2. **MCP URL** 필드에 Langflow 서버의 MCP 엔드포인트를 입력합니다:
   - 프로젝트별 서버: `http://localhost:7860/api/v1/mcp/project/PROJECT_ID/streamable`
   - 전역 MCP 서버: `http://localhost:7860/api/v1/mcp/streamable`
   - Langflow Desktop 기본값: `http://localhost:7868/`

3. 서버를 저장합니다. 연결이 성공하면 서버가 저장되고 **MCP** 사이드바에 타일로 표시됩니다.

4. 플로우에 **MCP Tools** 컴포넌트를 추가합니다.

5. 컴포넌트의 헤더 메뉴에서 **Tool Mode**를 활성화합니다.

6. **MCP Tools** 컴포넌트의 **Toolset** 포트를 **Agent** 컴포넌트의 **Tools** 포트에 연결합니다.

7. 플로우를 테스트합니다.

---

## MCP Tools 파라미터

| 이름 | 유형 | 설명 |
|------|------|------|
| `mcp_server` | String | 입력 파라미터. 연결할 MCP 서버. |
| `tool` | String | 입력 파라미터. 연결된 MCP 서버에서 실행할 특정 도구. 모든 도구에 접근하려면 비워둡니다. |
| `use_cache` | Boolean | 입력 파라미터. 성능 향상을 위한 MCP 서버 및 도구 캐싱 활성화. 기본값: `false`. |
| `verify_ssl` | Boolean | 입력 파라미터. HTTPS 연결에 대한 SSL 인증서 검증 활성화. 기본값: `true`. |
| `response` | Table | 출력 파라미터. 실행된 도구의 응답을 포함하는 `Table`. |

---

## 연결된 MCP 서버 관리

플로우에서 사용할 MCP 서버 연결을 관리하려면 비주얼 에디터의 **MCP** 섹션을 열고 **Manage Servers**를 클릭하거나, 프로필 아이콘을 클릭하고 **Settings**, **MCP Servers**를 선택합니다.

새 MCP 서버를 추가하려면 **Add MCP Server**를 클릭하고, 서버를 등록한 후 [비-Langflow MCP 서버에 연결](#비-langflow-mcp-서버에-연결)에 설명된 대로 **MCP Tools** 컴포넌트에서 서버를 선택합니다.

---

## API로 MCP 서버 환경 변수 수정

[Langflow API](../api-reference/api-examples.md)를 통해 플로우를 실행할 때 **MCP Tools** 컴포넌트를 tweaking하여 런타임에 MCP 서버 환경 변수를 수정할 수 있습니다.

**Python 예제:**

```python
import requests
import os

LANGFLOW_SERVER_ADDRESS = "http://localhost:7860"
FLOW_ID = "your-flow-id"
LANGFLOW_API_KEY = os.getenv("LANGFLOW_API_KEY")
MCP_TOOLS_COMPONENT_ID = "MCPTools-Bzahc"

url = f"{LANGFLOW_SERVER_ADDRESS}/api/v1/run/{FLOW_ID}?stream=false"
headers = {
    "Content-Type": "application/json",
    "x-api-key": LANGFLOW_API_KEY
}
payload = {
    "output_type": "chat",
    "input_type": "chat",
    "input_value": "What sales data is available to me?",
    "tweaks": {
        MCP_TOOLS_COMPONENT_ID: {
            "mcp_server": {
                "env": {
                    "API_URL": "https://api.example.com",
                    "API_KEY": "your-mcp-server-api-key",
                    "ENVIRONMENT": "production"
                }
            }
        }
    }
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())
```

---

## MCP 서버 헤더에 전역 변수 사용

API 키, 인증 토큰 등 민감한 값을 안전하게 저장하고 참조하기 위해 MCP 서버 헤더 값에 [전역 변수](../develop/global-variables.md)를 사용할 수 있습니다.

헤더 값으로 전역 변수 이름을 입력하면 Langflow가 MCP 서버에 요청을 보내기 전에 전역 변수 이름을 실제 값으로 확인합니다.

---

## 중첩된 MCP 서버에 `x-api-key` 전파

Langflow가 MCP 서버로 실행되고 플로우에 외부 서버를 호출하는 **MCP Tools** 컴포넌트가 포함되어 있는 경우, 외부 클라이언트의 `x-api-key` 또는 `Authorization` 헤더를 런타임에 전달할 수 있습니다.

중첩 서버의 **Headers** 구성에서 키와 값을 동일한 헤더 이름(예: `x-api-key` 및 `x-api-key`)으로 설정합니다.
Langflow는 수신 요청에서 일치하는 헤더를 읽고 중첩 서버를 호출하기 전에 대체합니다.

---

## 참고 항목

- [Langflow MCP 클라이언트](./langflow-mcp-client.md)
- [Langflow를 MCP 서버로 사용](./mcp-server.md)
- [DataStax Astra DB MCP 서버를 MCP Tools 컴포넌트와 함께 사용](./mcp-component-astra.md)

---

*원문: https://docs.langflow.org/next/mcp-client*
