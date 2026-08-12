# 코딩 에이전트용 Langflow MCP 클라이언트

**Bob (IBM)** 및 **Claude Code**와 같은 코딩 에이전트를 Langflow 인스턴스에 연결하여 MCP를 통해 플로우를 빌드하고 실행할 수 있습니다.

이 페이지는 **Settings**의 **Langflow MCP Client** 항목에 대해 설명합니다. 이는 Langflow의 다른 MCP 옵션과는 다릅니다.

- [**Langflow를 MCP 클라이언트로 사용**](./mcp-client.md): 플로우에서 **MCP Tools** 컴포넌트를 사용하여 캔버스의 에이전트 컴포넌트가 외부 MCP 서버 또는 Langflow MCP URL을 호출할 수 있도록 합니다.
- [**Langflow를 MCP 서버로 사용**](./mcp-server.md): Langflow의 **MCP Servers** 페이지를 사용하여 Cursor 또는 Windsurf와 같은 데스크톱 클라이언트에 Langflow 프로젝트를 MCP 서버로 노출합니다.

---

## Bob (IBM) 또는 Claude Code 연결

Langflow를 코딩 에이전트에 연결하려면:

1. 프로필 아이콘을 클릭하고 **Settings**를 선택한 다음 **Langflow MCP Client**를 클릭합니다.

2. Langflow에 연결할 코딩 에이전트를 선택하고 UI에 표시된 단계를 따릅니다.

   모든 클라이언트 구성은 `uvx`로 `lfx-mcp`를 실행하고, `LANGFLOW_SERVER_URL`을 Langflow 서버 URL로, `LANGFLOW_API_KEY`를 선택한 Langflow API 키로 설정합니다.

   - **Bob (IBM)** 에 연결하려면: 구성 JSON을 `~/.bob/settings/mcp_settings.json`에 붙여넣거나, 프로젝트 전용 설정의 경우 **Edit Project MCP**를 사용합니다.
   - **Claude Code** 에 연결하려면: 페이지에 표시된 `claude mcp add` 명령을 실행하거나 JSON 구성을 `~/.claude.json`에 수동으로 추가합니다.

   `LANGFLOW_API_KEY`를 설정하지 않으면 코딩 에이전트는 해당 서버의 Langflow 웹 UI에 로그인하는 데 사용하는 Langflow 사용자 이름과 비밀번호로 로그인할 수 있습니다.

---

## 참고 항목

- [Langflow를 MCP 클라이언트로 사용](./mcp-client.md)
- [Langflow를 MCP 서버로 사용](./mcp-server.md)
- [MCP Tools 컴포넌트](https://docs.langflow.org/mcp-tools)

---

*원문: https://docs.langflow.org/next/langflow-mcp-client*
