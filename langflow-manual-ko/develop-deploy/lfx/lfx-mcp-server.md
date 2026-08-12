# LFX MCP 서버로 플로우 빌드하기

> 원문: https://docs.langflow.org/next/lfx-mcp

`lfx-mcp`를 사용하여 코딩 에이전트를 실행 중인 Langflow 인스턴스에 연결한 다음, 터미널에서 플로우를 빌드하고 검증하고 실행할 수 있습니다.

MCP 클라이언트는 `lfx-mcp`를 로컬 표준 stdio 서브프로세스로 시작합니다.
서버는 Langflow REST API를 호출하므로, 에이전트가 생성한 플로우는 Langflow UI에 나타납니다.

`lfx-mcp`는 다음의 다른 MCP 옵션과는 다릅니다.

- [Langflow를 MCP 서버로 사용하기](https://docs.langflow.org/next/mcp-server): 기존 플로우를 클라이언트가 호출할 수 있는 도구로 노출.
- [Langflow를 MCP 클라이언트로 사용하기](https://docs.langflow.org/next/mcp-client): 캔버스의 컴포넌트에서 MCP 서버를 호출.

Bob(IBM)과 Claude Code의 경우, Langflow의 **Settings** → **Langflow MCP Client**에서 가이드 설정을 사용할 수도 있습니다.
자세한 내용은 [코딩 에이전트를 위한 Langflow MCP Client](https://docs.langflow.org/next/langflow-mcp-client)를 참고하세요.

## 사전 준비[​](#prerequisites "Direct link to Prerequisites")

- 실행 중인 Langflow 인스턴스
- [Langflow API 키](https://docs.langflow.org/next/api-keys-and-authentication)
- Langflow에서 사용 가능한 LLM 제공자 API 키, 일반적으로 [전역 변수](https://docs.langflow.org/next/configuration-global-variables)로 설정
- [`uv`](https://docs.astral.sh/uv/getting-started/installation/), 또는 `uv pip install lfx`로 설치된 `lfx`
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code), 또는 stdio 서버를 지원하는 다른 MCP 클라이언트

## 에이전트 연결 및 플로우 빌드[​](#connect-an-agent-and-build-a-flow "Direct link to Connect an agent and build a flow")

에이전트를 연결하고 Langflow 서버에 플로우를 생성하려면 다음 단계를 따르세요.

1. MCP 클라이언트에 `lfx-mcp`를 추가합니다.

    `uvx --from lfx lfx-mcp`를 사용하세요.
PyPI에는 독립형 `lfx-mcp` 패키지가 없으며, 바이너리는 `lfx` 패키지 안에 포함되어 있습니다.

    Claude Code에 서버를 추가하려면 다음을 실행합니다.

```bash
claude mcp add langflow \  
  -e LANGFLOW_SERVER_URL=http://localhost:7860 \  
  -e LANGFLOW_API_KEY=<YOUR_LANGFLOW_API_KEY> \  
  -- uvx --from lfx lfx-mcp  
```

    Claude Desktop이나 다른 stdio 클라이언트에 추가하려면, `lfx-mcp`를 실행하고 동일한 환경 변수를 설정하는 MCP 서버 항목을 생성합니다.

  - uvx (권장)
  - lfx installed

```json
{  
  "mcpServers": {  
    "langflow": {  
      "command": "uvx",  
      "args": ["--from", "lfx", "lfx-mcp"],  
      "env": {  
        "LANGFLOW_SERVER_URL": "http://localhost:7860",  
        "LANGFLOW_API_KEY": "<YOUR_LANGFLOW_API_KEY>"  
      }  
    }  
  }  
}  
```

macOS에서 Claude Desktop은 이 설정을 `~/Library/Application Support/Claude/claude_desktop_config.json`에 저장합니다.

| 변수                | 설명                   | 기본값                 |
| ----------------------- | ------------------------------ | ------------------------ |
| `LANGFLOW_​SERVER_​URL` | Langflow 인스턴스의 URL | `http://localhost:7860` |
| `LANGFLOW_​API_​KEY`    | Langflow API 키              | 없음                     |

`LANGFLOW_API_KEY`를 생략하면, 에이전트는 Langflow 사용자 이름과 비밀번호로 `login` 도구를 호출할 수 있습니다.

- 서버가 등록되었는지 확인합니다.

```bash
claude mcp list  
```

    출력에는 다음과 유사한 항목이 포함됩니다.

```text
langflow: uvx --from lfx lfx-mcp  
```

- 에이전트를 시작하고 플로우 빌드를 요청합니다.

```bash
claude  
```

    다음과 같은 프롬프트를 입력합니다.

```text
Create a simple agent chatbot flow in Langflow using OpenAI, validate the flow,  
and then run it with the message "What is Langflow?"  
```

    에이전트는 일반적으로 다음을 수행합니다.

  1. `search_component_types` 또는 `describe_component_type`으로 컴포넌트 타입 탐색
  2. `create_flow_from_spec`으로 한 번의 요청에서 플로우 생성
  3. `validate_flow`로 연결 검증
  4. `run_flow`로 플로우 실행 후 응답 반환
    새 플로우는 서버 URL의 Langflow UI에 나타납니다.

    `create_flow_from_spec` 도구는 노드, 엣지, 설정에 대한 간결한 텍스트 스펙을 받습니다.

```text
name: My Chatbot  
description: A simple chatbot  

nodes:  
  A: ChatInput  
  B: OpenAIModel  
  C: ChatOutput  

edges:  
  A.message -> B.input_value  
  B.text_output -> C.input_value  

config:  
  B.model_name: gpt-4o-mini  
```

    엣지를 작성하기 전에 타입 이름과 입력/출력 이름을 확인하려면 `describe_component_type`을 사용하세요.
`component_as_tool`을 통해 연결하면 에이전트 도구 연결을 위한 tool mode가 활성화됩니다.

    MCP 클라이언트는 서버로부터 전체 도구 목록을 검색합니다.
플로우 빌드 및 실행 외에도 에이전트는 다음을 수행할 수 있습니다.

  - 플로우 목록 조회, 복제, 이름 변경, 내보내기, 삭제
  - 스타터 프로젝트로부터 플로우 생성
  - `$N.field` 참조를 사용해 여러 도구 호출을 배치 처리
  - 편집이 끝나면 `notify_done`을 호출하여 Langflow UI를 새로 고침

## 참고 자료[​](#see-also "Direct link to See also")

- [코딩 에이전트를 위한 Langflow MCP Client](https://docs.langflow.org/next/langflow-mcp-client)
- [Langflow를 MCP 서버로 사용하기](https://docs.langflow.org/next/mcp-server)
- [Langflow를 MCP 클라이언트로 사용하기](https://docs.langflow.org/next/mcp-client)
- [LFX 소개](https://docs.langflow.org/next/lfx-overview)
- [LFX 설치하기](https://docs.langflow.org/next/lfx-install)
