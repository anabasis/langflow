# Langflow를 MCP 서버로 사용

Langflow는 MCP 서버와 MCP 클라이언트 모두로서 [모델 컨텍스트 프로토콜(MCP)](https://modelcontextprotocol.io/introduction)과 통합됩니다.

이 페이지에서는 [MCP 클라이언트](https://modelcontextprotocol.io/clients)가 응답을 생성할 때 사용할 수 있는 [도구](https://modelcontextprotocol.io/docs/concepts/tools)로 플로우를 노출하는 MCP 서버로 Langflow를 사용하는 방법을 설명합니다.

Langflow MCP 서버는 **streamable HTTP** 전송과 폴백으로 **Server-Sent Events(SSE)**를 모두 지원합니다.

MCP 클라이언트로 Langflow를 사용하는 방법에 대한 자세한 내용은 [Langflow를 MCP 클라이언트로 사용](./mcp-client.md)을 참조하세요.

---

## 사전 요구사항

- **Chat Output** 컴포넌트가 있는 플로우가 하나 이상 있는 [Langflow 프로젝트](../flows/build-flows.md)
  - **Chat Output** 컴포넌트는 플로우를 MCP 도구로 사용하는 데 필요합니다.
- MCP Inspector를 사용하여 [플로우를 테스트하고 디버그](#mcp-inspector로-플로우-테스트-및-디버그)하려면 [Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) LTS 버전이 설치되어 있어야 합니다.

---

## MCP 도구로 플로우 서빙

[Langflow 프로젝트](../flows/build-flows.md)를 만들면 Langflow는 자동으로 프로젝트를 MCP 서버의 구성에 추가하고 프로젝트의 플로우를 MCP 도구로 사용할 수 있게 만듭니다.

### 플로우 도구 이름 및 설명 편집

도구 이름과 설명은 MCP 클라이언트가 플로우가 제공하는 액션과 해당 액션을 사용할 시기를 결정하는 데 도움을 줍니다.

도구 이름과 설명을 편집하려면:

1. **Projects** 페이지의 **MCP Server** 탭을 클릭하거나, 플로우를 편집할 때 **Share**, **MCP Server**를 클릭합니다.
2. **Edit Tools**를 클릭합니다.
3. 편집할 **Description** 또는 **Tool**을 클릭합니다:
   - **Tool name**: 도구로 사용될 때 플로우가 무엇을 하는지 명확히 하는 이름을 입력합니다.
   - **Tool description**: 플로우가 수행하는 특정 액션을 완전하고 정확하게 설명합니다.
4. **MCP Server Tools** 대화상자를 닫아 변경사항을 저장합니다.

**도구 이름 및 설명의 중요성**

MCP 클라이언트는 도구 이름과 설명을 사용하여 응답 생성 시 어떤 액션을 사용할지 결정합니다.
불명확한 이름과 설명은 에이전트가 도구를 잘못 또는 일관성 없이 선택하게 할 수 있습니다.

예를 들어 플로우의 기본 도구 이름은 `adbbf8c7-0a34-493b-90ea-5e8b42f78b66`과 같은 플로우 ID입니다.
이는 에이전트에게 플로우 유형이나 목적에 대한 정보를 제공하지 않습니다.

---

### 도구 실행 타임아웃 구성

도구 실행 타임아웃을 설정하는 세 가지 방법이 있습니다:

1. **컴포넌트별 타임아웃**: **MCP Tools** 컴포넌트에서 직접 설정합니다. 고급 설정 탭을 열고 **Tool Execution Timeout (seconds)** 필드에 값을 입력합니다. `0` 값은 컴포넌트별 재정의를 비활성화하고 전역 설정으로 폴백합니다.

2. **전역 타임아웃**: `LANGFLOW_MCP_TOOL_EXECUTION_TIMEOUT` 환경 변수로 설정합니다. 기본값은 180초입니다.

3. **기본값**: `LANGFLOW_MCP_TOOL_EXECUTION_TIMEOUT` 또는 `LANGFLOW_MCP_SERVER_TIMEOUT`이 구성되지 않은 경우 Langflow는 기본적으로 180초를 사용합니다.

---

## Langflow MCP 서버에 클라이언트 연결

Langflow는 로컬 MCP 클라이언트에 Langflow MCP 서버를 배포하는 데 도움이 되는 자동 설치 및 코드 스니펫을 제공합니다.

### JSON 방식으로 클라이언트 연결

1. [MCP 호환 클라이언트](https://modelcontextprotocol.io/clients)를 설치합니다. (아래 예제는 Cursor를 사용합니다)

2. 클라이언트에서 UI 또는 구성 파일을 사용하여 새 MCP 서버를 추가합니다.
   Cursor의 경우 **Cursor Settings**, **MCP**, **Add New Global MCP Server**를 선택합니다.

3. MCP 서버에 [인증을 구성](#mcp-서버-인증)합니다. (권장)

4. Langflow의 **Projects** 페이지에서 **MCP Server** 탭을 클릭합니다.

5. **JSON** 탭을 클릭하고 운영 체제에 맞는 코드 스니펫을 복사하여 클라이언트의 MCP 구성 파일에 붙여넣습니다.

```json
{
  "mcpServers": {
    "PROJECT_NAME": {
      "command": "uvx",
      "args": [
        "mcp-proxy",
        "--transport",
        "streamablehttp",
        "http://LANGFLOW_SERVER_ADDRESS/api/v1/mcp/project/PROJECT_ID/streamable"
      ]
    }
  }
}
```

6. 클라이언트의 MCP 구성 파일을 저장하고 닫습니다.

7. Langflow MCP 서버가 클라이언트의 MCP 서버 목록에 있는지 확인합니다. 필요한 경우 클라이언트를 재시작합니다.

### 자동 설치 방식

자동 설치 옵션은 특정 MCP 클라이언트(Cursor, Claude, Windsurf)에 대해서만 사용 가능합니다.

1. Langflow 서버가 실행 중인 동일한 컴퓨터에 [Cursor](https://docs.cursor.com/get-started/installation), [Claude](https://claude.ai/download), 또는 [Windsurf](https://windsurf.com/download/editor)를 설치합니다.

2. MCP 서버에 [인증을 구성](#mcp-서버-인증)합니다. (권장)

3. Langflow의 **Projects** 페이지에서 **MCP Server** 탭을 클릭합니다.

4. **Auto install** 탭에서 MCP 클라이언트 제공자를 찾아 **Add**를 클릭합니다.

---

## MCP 서버 인증

각 Langflow 프로젝트에는 고유한 MCP 서버 인증 설정을 가진 자체 MCP 서버가 있습니다.

MCP 서버 인증을 구성하려면 Langflow의 **Projects** 페이지로 이동하고 **MCP Server** 탭을 클릭한 후 **Edit Auth**를 클릭하여 원하는 인증 방법을 선택합니다:
- API 키
- OAuth
- 없음

**API 키로 인증하는 경우 예제:**

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

---

## MCP Inspector로 플로우 테스트 및 디버그

[MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector)는 MCP 서버를 테스트하고 디버그하기 위한 일반적인 도구입니다.

1. MCP Inspector를 설치합니다:

```bash
npx @modelcontextprotocol/inspector
```

2. 웹 브라우저를 열고 MCP Inspector UI로 이동합니다. 기본 주소는 `http://localhost:6274`입니다.

3. MCP Inspector UI에서 Langflow 프로젝트 MCP 서버의 연결 세부 정보를 입력합니다:
   - **Transport Type**: **STDIO** 선택
   - **Command**: `uvx`
   - **Arguments**: `mcp-proxy --headers x-api-key YOUR_API_KEY http://LANGFLOW_SERVER_ADDRESS/api/v1/mcp/project/PROJECT_ID/streamable`

4. **Connect**를 클릭합니다.

연결이 성공하면 **Tools** 탭에서 프로젝트의 플로우가 표시됩니다.

---

## 슈퍼유저로 MCP 서버 관리 제한

슈퍼유저가 아닌 사용자가 MCP 서버 연결을 편집하지 못하도록 하려면 `LANGFLOW_MCP_SERVERS_LOCKED=true`를 설정합니다.

---

## MCP 서버 환경 변수

| 변수 | 형식 | 기본값 | 설명 |
|------|------|--------|------|
| `LANGFLOW_MCP_SERVER_ENABLED` | Boolean | `True` | 각 Langflow 프로젝트에 대한 MCP 서버 초기화 여부 |
| `LANGFLOW_MCP_SERVER_ENABLE_PROGRESS_NOTIFICATIONS` | Boolean | `False` | `true`이면 Langflow MCP 서버가 진행 알림을 전송합니다 |
| `LANGFLOW_MCP_SERVER_TIMEOUT` | Integer | `20` | MCP 연결 설정 및 도구 실행 타임아웃(초) |
| `LANGFLOW_MCP_TOOL_EXECUTION_TIMEOUT` | Integer | `180` | MCP 도구 호출의 전역 타임아웃(초) |
| `LANGFLOW_MCP_MAX_SESSIONS_PER_SERVER` | Integer | `10` | 고유한 서버당 유지할 최대 MCP 세션 수 |
| `LANGFLOW_ADD_PROJECTS_TO_MCP_SERVERS` | Boolean | `True` | 새로 만든 프로젝트를 사용자의 MCP 서버 구성에 자동으로 추가할지 여부 |
| `LANGFLOW_MCP_SERVERS_LOCKED` | Boolean | `False` | `true`이면 슈퍼유저가 아닌 사용자는 UI 또는 API를 통해 MCP 서버 연결을 추가, 편집, 삭제할 수 없습니다 |

---

## 참고 항목

- [Langflow를 MCP 클라이언트로 사용](./mcp-client.md)
- [DataStax Astra DB MCP 서버 사용](./mcp-component-astra.md)

---

*원문: https://docs.langflow.org/next/mcp-server*
