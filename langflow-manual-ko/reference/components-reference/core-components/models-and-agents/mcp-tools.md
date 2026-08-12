# MCP 도구

> 원문: https://docs.langflow.org/next/mcp-tools

**MCP Tools** 컴포넌트는 Model Context Protocol(MCP) 서버에 연결하여, 해당 MCP 서버의 함수들을 Langflow 에이전트가 입력에 응답하는 데 사용할 수 있는 도구로 노출합니다.

공개적으로 이용 가능한 MCP 서버나 직접 구축한 사용자 정의 MCP 서버 외에도, Langflow MCP 서버에 연결하여 에이전트가 여러분의 Langflow 플로우를 도구로 사용하게 할 수 있습니다.
이를 위해서는 **MCP Tools** 컴포넌트의 [HTTP/SSE 모드](https://docs.langflow.org/mcp-client#mcp-http-mode)를 사용하여 Langflow 프로젝트의 MCP 서버에 연결하세요.

Langflow 1.9.x부터 **MCP Tools** 컴포넌트는 **Agents** 카테고리에서 드래그 가능한 컴포넌트로 나열되지 않습니다. 플로우에 MCP 도구를 추가하려면 다음을 수행하세요.

1. MCP 서버를 등록합니다.
**Settings** → **MCP Servers**를 연 다음 **Add MCP Server**를 클릭하거나, 플로우 에디터의 왼쪽 사이드바에서 **MCP**를 클릭한 다음 **Add MCP Server**를 클릭합니다.

2. 서버를 구성하고 저장합니다.
연결 세부 정보를 입력한 다음 **Save**를 클릭합니다.
자세한 내용은 [Langflow를 MCP 클라이언트로 사용하기](https://docs.langflow.org/mcp-client)를 참조하세요.

3. **MCP** 사이드바에서 새 서버를 캔버스로 드래그합니다.
해당 서버의 **MCP Tools** 컴포넌트가 캔버스에 추가됩니다.

자세한 내용은 [Langflow를 MCP 클라이언트로 사용하기](https://docs.langflow.org/mcp-client)와 [Langflow를 MCP 서버로 사용하기](https://docs.langflow.org/mcp-server)를 참조하세요.

자세한 내용은 [Langflow를 MCP 클라이언트로 사용하기](https://docs.langflow.org/mcp-client)와 [Langflow를 MCP 서버로 사용하기](https://docs.langflow.org/mcp-server)를 참조하세요.

Tool mode가 누락됨

기존 플로우를 업그레이드하는 중이고 **MCP Tools** 컴포넌트에서 **Tool Mode** 옵션이 사라졌다면, [플로우 업그레이드 후 MCP Tools 컴포넌트의 Tool Mode 옵션이 사라지는 문제](https://docs.langflow.org/troubleshoot#mcp-tools-component-loses-tool-mode-option-after-upgrading-flows)를 참조하세요.

## MCP Tools 매개변수[​](#mcp-tools-parameters "Direct link to MCP Tools parameters")

| 이름        | 유형    | 설명                                                                                                            |
| ----------- | ------- | ---------------------------------------------------------------------------------------------------------------------- |
| mcp\_server | String  | 입력 매개변수. 연결할 MCP 서버입니다. 이전에 구성한 서버 중에서 선택하거나 새 서버를 추가하세요.             |
| tool        | String  | 입력 매개변수. 연결된 MCP 서버에서 실행할 특정 도구입니다. 모든 도구에 접근하려면 비워 두세요. |
| use\_cache  | Boolean | 입력 매개변수. 성능 향상을 위해 MCP 서버와 도구의 캐싱을 활성화합니다. 기본값: `false`.                      |
| verify\_ssl | Boolean | 입력 매개변수. HTTPS 연결에 대한 SSL 인증서 검증을 활성화합니다. 기본값: `true`.                           |
| response    | Table   | 출력 매개변수. 실행된 도구의 응답을 담은 [`Table`](https://docs.langflow.org/data-types#table)입니다.                         |

**MCP Tools 컴포넌트의 이전 버전**

- Langflow 버전 1.5에서 **MCP Connection** 컴포넌트가 **MCP Tools** 컴포넌트로 이름이 변경되었습니다.
- Langflow 버전 1.3에서 **MCP Tools (stdio)**와 **MCP Tools (SSE)** 컴포넌트가 제거되고, 통합된 **MCP Connection** 컴포넌트로 대체되었으며, 이 컴포넌트는 이후 **MCP Tools**로 이름이 변경되었습니다.
