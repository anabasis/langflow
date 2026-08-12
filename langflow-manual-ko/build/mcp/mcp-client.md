# Langflow를 MCP 클라이언트로 사용하기
> 원문: https://docs.langflow.org/next/mcp-client

Langflow는 [Model Context Protocol(MCP)](https://modelcontextprotocol.io/introduction)을 MCP 서버와 MCP 클라이언트 양쪽 모두로 통합합니다.

이 페이지에서는 [**MCP Tools** 컴포넌트](#use-the-mcp-tools-component)와 연결된 [MCP 서버](#manage-connected-mcp-servers)를 통해 Langflow를 MCP 클라이언트로 사용하는 방법을 설명합니다.

Langflow를 MCP 서버로 사용하는 방법에 대한 정보는 [Langflow를 MCP 서버로 사용하기](https://docs.langflow.org/mcp-server)를 참고하세요.

## MCP Tools 컴포넌트 사용하기[​](#use-the-mcp-tools-component "Direct link to Use the MCP tools component")

**MCP Tools** 컴포넌트는 MCP 서버에 연결하여 [Langflow 에이전트](https://docs.langflow.org/agents)가 사용자 질의에 응답할 때 서버의 도구를 사용할 수 있게 합니다.

[Langflow가 아닌 MCP 서버에 연결하기](#mcp-stdio-mode)에서 설명한 대로 MCP 서버를 등록한 다음, **MCP** 사이드바에서 **MCP Tools**를 추가하세요.

이 컴포넌트는 접근하려는 서버의 유형에 따라 두 가지 모드를 가집니다.

- JSON 설정 파일, 서버 시작 명령어, 또는 HTTP/SSE URL로 [Langflow가 아닌 MCP 서버에 연결](#mcp-stdio-mode)하여 외부의 Langflow가 아닌 MCP 서버가 제공하는 도구에 접근합니다.
- [Langflow MCP 서버에 연결](#mcp-http-mode)하여 [Langflow 프로젝트](https://docs.langflow.org/concepts-flows#projects)의 플로우를 MCP 도구로 사용합니다.


### Langflow가 아닌 MCP 서버에 연결하기[​](#mcp-stdio-mode "Direct link to Connect to a non-Langflow MCP server")

tip

`uvx`는 Langflow 패키지의 `uv`에 포함되어 있습니다.

`npx` 서버 명령어를 사용하려면 먼저 [Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)의 LTS 릴리스를 설치해야 합니다. Docker에서 Langflow를 실행하는 경우, 컨테이너 이미지 안에 Node.js를 설치하고 다시 빌드하여 런타임에 `npx` 기반 MCP 서버를 사용할 수 있게 하세요. 자세한 내용은 [패키지 관리](https://docs.langflow.org/develop-application#package-management)를 참고하세요.

Langflow에서 `npx` MCP 서버의 예시는 [Astra DB MCP 서버를 Langflow에 연결하기](https://docs.langflow.org/mcp-component-astra)를 참고하세요.

Langflow 1.9.x 기준으로 **MCP Tools** 컴포넌트는 **Agents** 카테고리 아래에 드래그 가능한 컴포넌트로 나열되지 않습니다. 플로우에 MCP 도구를 추가하려면 다음을 수행하세요.

1. MCP 서버를 등록합니다.
**Settings** → **MCP Servers**를 열고 **Add MCP Server**를 클릭하거나, 플로우 편집기 왼쪽 사이드바에서 **MCP**를 클릭한 다음 **Add MCP Server**를 클릭합니다.

2. 서버를 설정하고 저장합니다.
연결 세부 정보를 입력한 다음 **Save**를 클릭합니다.
자세한 내용은 [Langflow를 MCP 클라이언트로 사용하기](https://docs.langflow.org/mcp-client)를 참고하세요.

3. **MCP** 사이드바에서 새 서버를 캔버스로 드래그합니다.
해당 서버의 **MCP Tools** 컴포넌트가 캔버스에 추가됩니다.

자세한 내용은 [Langflow를 MCP 클라이언트로 사용하기](https://docs.langflow.org/mcp-client)와 [Langflow를 MCP 서버로 사용하기](https://docs.langflow.org/mcp-server)를 참고하세요.

4. **MCP Tools** 컴포넌트의 **MCP Server** 필드에서 등록한 서버를 선택합니다.

    새 서버는 **Settings** > **MCP Servers**에서, 또는 **MCP** 사이드바 > **Add MCP Server**에서 다음 연결 유형 중 하나를 사용하여 등록됩니다.

  - **JSON**: 필드에 MCP 서버의 JSON 설정 객체를 붙여넣습니다. 사용하려는 필수 및 선택적 매개변수를 포함한 다음 **Add Server**를 클릭합니다.
  - **STDIO**: MCP 서버의 **Name**, **Command**와 서버가 사용하는 **Arguments**, **Environment Variables**를 입력한 다음 **Add Server**를 클릭합니다.
예를 들어, [Fetch](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) 서버를 시작하려면 **Command**는 `uvx mcp-server-fetch`입니다.
  - **HTTP/SSE**: MCP 서버의 **Name**, **URL**과 서버가 사용하는 **Headers**, **Environment Variables**를 입력한 다음 **Add Server**를 클릭합니다.
Langflow MCP 서버의 기본 **URL**은 `http://localhost:7860/api/v1/mcp/project/PROJECT_ID/streamable` 또는 `http://localhost:7860/api/v1/mcp/streamable`입니다. 자세한 내용은 [Langflow MCP 서버에 연결하기](#mcp-http-mode)를 참고하세요.

5. MCP 서버의 헤더를 설정하려면 **Headers** 필드에 각 헤더를 키-값 쌍으로 입력합니다.
헤더 값으로 [전역 변수](https://docs.langflow.org/configuration-global-variables) 이름을 입력하여 전역 변수를 사용할 수 있습니다.
자세한 내용은 [MCP 서버 헤더에서 전역 변수 사용하기](#use-global-variables-in-mcp-server-headers)를 참고하세요.

    이 서버가 MCP 서버로 실행되는 Langflow 플로우 안에 중첩되어 있는 경우, 런타임에 들어오는 요청의 `x-api-key`나 `Authorization` 헤더를 이 서버로 직접 전파할 수 있습니다.
자세한 내용은 [중첩된 MCP 서버로 x-api-key 전파하기](#propagate-x-api-key)를 참고하세요.

6. 서버 명령어에서 환경 변수를 사용하려면 **Env** 필드에 각 변수를 키-값 쌍으로 입력합니다.

7. **Tool** 필드에서 이 컴포넌트가 사용할 도구를 선택하거나, MCP 서버가 제공하는 모든 도구에 접근할 수 있도록 필드를 비워둡니다.

    특정 도구를 선택하는 경우, 추가적인 도구별 필드를 설정해야 할 수 있습니다. 도구별 필드에 대한 정보는 MCP 서버의 문서를 참고하세요.

    이 시점에서 **MCP Tools** 컴포넌트는 연결된 서버의 도구를 서비스하고 있지만, 아무것도 그 도구를 사용하고 있지 않습니다. 다음 단계에서는 에이전트가 응답에서 이 도구를 사용할 수 있도록 [**Agent** 컴포넌트](https://docs.langflow.org/components-agents)에서 이 도구를 사용 가능하게 만드는 방법을 설명합니다.

8. [컴포넌트의 헤더 메뉴](https://docs.langflow.org/concepts-components#component-menus)에서 **Tool mode**를 활성화하여 에이전트와 함께 컴포넌트를 사용할 수 있게 합니다.

9. **MCP Tools** 컴포넌트의 **Toolset** 포트를 **Agent** 컴포넌트의 **Tools** 포트에 연결합니다.

    플로우에 아직 없다면, **Chat Input**과 **Chat Output** 컴포넌트도 **Agent** 컴포넌트에 연결되어 있는지 확인하세요.

    ![STDIO 모드의 MCP Tools 컴포넌트](https://docs.langflow.org/assets/images/component-mcp-stdio-a13a643e61ceea972c4a3f64dd1ae72f.png)

10. 플로우를 테스트하여 MCP 서버가 연결되어 있고 선택한 도구가 에이전트에 의해 사용되는지 확인합니다. **Playground**를 열고, **MCP Tools** 컴포넌트를 통해 연결한 도구를 사용하는 프롬프트를 입력합니다.

    예를 들어, `fetch` 도구와 함께 `mcp-server-fetch`를 사용하는 경우, 에이전트에게 최근 기술 뉴스를 요약해 달라고 요청할 수 있습니다. 에이전트는 MCP 서버 함수 `fetch`를 호출한 다음 응답을 반환합니다.

11. 에이전트가 더 많은 도구를 사용할 수 있도록 하려면, 이 단계를 반복하여 다른 서버나 도구를 가진 도구 컴포넌트를 추가하세요.

### Langflow MCP 서버 연결하기[​](#mcp-http-mode "Direct link to Connect a Langflow MCP server")

모든 Langflow 프로젝트는 프로젝트의 플로우를 MCP 도구로 노출하는 별도의 MCP 서버를 실행합니다.
플로우를 MCP 도구로 노출하는 것을 포함하여 프로젝트의 MCP 서버에 대한 자세한 내용은 [Langflow를 MCP 서버로 사용하기](https://docs.langflow.org/mcp-server)를 참고하세요.

Langflow MCP 서버는 **streamable HTTP** 전송과 대체 수단인 **Server-Sent Events(SSE)**를 모두 지원합니다.

플로우를 도구로 활용하려면, 먼저 Langflow MCP 엔드포인트를 서버로 등록한 다음 **MCP** 사이드바에서 **MCP Tools** 컴포넌트를 추가하세요.

1. Langflow MCP 서버를 등록합니다.
**Settings** > **MCP Servers** 또는 플로우 사이드바의 **MCP** 섹션을 열고 **Add MCP Server**를 클릭한 다음 **HTTP/SSE** 모드를 선택합니다.

2. **MCP URL** 필드에 Langflow 서버의 MCP 엔드포인트를 입력합니다.

  - 프로젝트별 서버: `http://localhost:7860/api/v1/mcp/project/PROJECT_ID/streamable`
  - 전역 MCP 서버: `http://localhost:7860/api/v1/mcp/streamable`
  - Langflow Desktop 기본값: `http://localhost:7868/`

    대상 서버에서 사용 가능한 모든 플로우는 도구로 취급됩니다. 인증 및 프로젝트 URL에 대해서는 [Langflow를 MCP 서버로 사용하기](https://docs.langflow.org/mcp-server)를 참고하세요.

3. 서버를 저장합니다. 연결이 성공하면 서버가 저장되고 **MCP** 사이드바에 타일로 표시됩니다.

4. 플로우에 **MCP Tools** 컴포넌트를 추가합니다.

5. [컴포넌트의 헤더 메뉴](https://docs.langflow.org/concepts-components#component-menus)에서 **Tool Mode**를 활성화하여 에이전트와 함께 컴포넌트를 사용할 수 있게 합니다.

6. **MCP Tools** 컴포넌트의 **Toolset** 포트를 **Agent** 컴포넌트의 **Tools** 포트에 연결합니다.

7. 플로우에 아직 없다면, **Chat Input**과 **Chat Output** 컴포넌트도 **Agent** 컴포넌트에 연결되어 있는지 확인하세요.

    ![HTTP/SSE 모드가 활성화된 MCP 컴포넌트](https://docs.langflow.org/assets/images/component-mcp-sse-mode-2e742342a52231247733d8486ab612fd.png)

8. 플로우를 테스트하여 에이전트가 질의에 응답하기 위해 플로우를 사용하는지 확인합니다. **Playground**를 열고, **MCP Tools** 컴포넌트를 통해 연결한 플로우를 사용하는 프롬프트를 입력합니다.

9. 에이전트가 더 많은 도구를 사용할 수 있도록 하려면, 이 단계를 반복하여 다른 서버나 도구를 가진 도구 컴포넌트를 추가하세요.

## MCP Tools 매개변수[​](#mcp-tools-parameters "Direct link to MCP Tools parameters")

| 이름        | 타입    | 설명                                                                                                            |
| ----------- | ------- | ---------------------------------------------------------------------------------------------------------------------- |
| mcp\_server | String  | 입력 매개변수. 연결할 MCP 서버입니다.                                                                                         |
| tool        | String  | 입력 매개변수. 연결된 MCP 서버에서 실행할 특정 도구입니다. 모든 도구에 접근하려면 비워두세요. |
| use\_cache  | Boolean | 입력 매개변수. 성능 향상을 위해 MCP 서버와 도구 캐싱을 활성화합니다. 기본값: `false`.                                      |
| verify\_ssl | Boolean | 입력 매개변수. HTTPS 연결에 대한 SSL 인증서 검증을 활성화합니다. 기본값: `true`.                                           |
| response    | Table   | 출력 매개변수. 실행된 도구의 응답을 담은 [`Table`](https://docs.langflow.org/data-types#table)입니다.                         |


## 연결된 MCP 서버 관리하기[​](#manage-connected-mcp-servers "Direct link to Manage connected MCP servers")

플로우에서 사용할 MCP 서버 연결을 관리하려면, 비주얼 에디터에서 **MCP** 섹션을 연 다음 **Manage Servers**를 클릭하거나, 프로필 아이콘을 클릭하고 **Settings**를 선택한 다음 **MCP Servers**를 클릭하세요.

새 MCP 서버를 추가하려면, **Add MCP Server**를 클릭하고 서버를 등록한 다음, [Langflow가 아닌 MCP 서버에 연결하기](#mcp-stdio-mode)에서 설명한 대로 **MCP Tools** 컴포넌트에서 서버를 선택하세요.

MCP 서버 연결을 편집하거나 삭제하려면 **More**를 클릭하세요.

Langflow 서버 관리자가 MCP 서버 관리를 잠갔다면, 서버를 추가하거나 수정하려고 할 때 잠금 메시지가 표시됩니다. 자세한 내용은 [MCP 서버 관리 잠그기](https://docs.langflow.org/mcp-server#restrict-mcp-server-management)를 참고하세요.

## API로 MCP 서버 환경 변수 수정하기[​](#mcp-api-tweaks "Direct link to Modify MCP server environment variables with the API")

**MCP Tools** 컴포넌트를 조정(tweak)하여 [Langflow API](https://docs.langflow.org/api-reference-api-examples)를 통해 플로우를 실행할 때 런타임에 MCP 서버 환경 변수를 수정할 수 있습니다.

`tweaks` 매개변수를 지원하는 모든 Langflow API 요청(예: `/run` 또는 `/webhook` 엔드포인트로의 POST 요청)에 tweak을 포함할 수 있습니다.
자세한 내용은 [입력 스키마(tweaks)](https://docs.langflow.org/concepts-publish#input-schema)를 참고하세요.

**MCP Tools** 컴포넌트의 환경 변수를 tweak으로 수정하려면 다음을 수행하세요.

1. **MCP Tools** 컴포넌트가 포함된 플로우를 엽니다.

2. **MCP Tools** 컴포넌트의 고유 ID를 찾으려면, **MCP Tools** 컴포넌트에서 **Controls**를 클릭합니다.
컴포넌트의 ID가 **Controls** 창에 표시됩니다(예: `MCPTools-Bzahc`).

3. Langflow 서버의 `/run` 엔드포인트로 POST 요청을 보내고, **MCP Tools** 컴포넌트에 대한 tweak을 포함합니다.

    다음 예시는 `tweaks` 페이로드에서 `mcp_server` 아래에 중첩된 `env` 객체를 포함한 요청 구조를 보여줍니다.

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

`MCP_TOOLS_COMPONENT_ID`, `LANGFLOW_API_KEY`, `LANGFLOW_SERVER_ADDRESS`, `FLOW_ID`를 Langflow 배포 환경의 실제 값으로 바꾸세요.

Langflow는 **MCP Tools** 컴포넌트가 어떤 환경 변수를 수락하는지 자동으로 발견하거나 노출하지 않습니다.
MCP 서버가 수락하는 환경 변수를 확인하려면 MCP 서버의 문서를 참고하세요. 예를 들어, [Astra DB MCP 서버](https://github.com/datastax/astra-db-mcp)는 저장소에 문서화된 대로 `ASTRA_DB_APPLICATION_TOKEN`과 `ASTRA_DB_API_ENDPOINT`를 요구하며, 선택적으로 `ASTRA_DB_KEYSPACE` 변수를 사용할 수 있습니다.

## MCP 서버 헤더에서 전역 변수 사용하기[​](#use-global-variables-in-mcp-server-headers "Direct link to Use global variables in MCP server headers")

MCP 서버 헤더 값에 [전역 변수](https://docs.langflow.org/configuration-global-variables)를 사용하여 API 키, 인증 토큰, 기타 민감한 값을 안전하게 저장하고 참조할 수 있습니다. 이는 런타임에 사용자별 자격 증명을 전달해야 하는 배포 시나리오에서 특히 유용합니다.

헤더 값으로 전역 변수 이름을 입력하면, Langflow는 MCP 서버 요청을 하기 전에 전역 변수 이름을 실제 값으로 해석합니다. Langflow는 토큰 값을 서버로 전달할 뿐이며, MCP 서버를 대신하여 토큰을 검증하지는 않습니다.

예를 들어, MCP 서버의 베어러 인증을 위해 `TEST_BEARER_TOKEN`이라는 전역 변수를 만들려면 다음을 수행하세요.

1. **Global Variables** 창을 열려면 프로필 아이콘을 클릭하고 **Settings**를 선택한 다음 **Global Variables**를 클릭합니다.

2. `TEST_BEARER_TOKEN`이라는 이름의 **Credential** 전역 변수를 만듭니다.

3. **Value** 필드에 MCP 서버의 베어러 토큰 값을 입력합니다. 값에는 공백과 함께 `Bearer` 접두사가 포함되어야 합니다(예: `Bearer eyJhbG...`).

4. **Save Variable**을 클릭합니다.

5. Langflow 클라이언트의 MCP 서버 연결을 관리하려면, **MCP servers**를 클릭한 다음 **Manage Servers**를 클릭하거나, 프로필 아이콘을 클릭하고 **Settings**를 선택한 다음 **MCP Servers**를 클릭합니다.

6. **Add MCP Server**를 클릭합니다.

7. 다음을 선택합니다.

  - **Name**: test-mcp-server
  - **Streamable HTTP/SSE URL**: MCP 서버의 URL(예: `http://127.0.0.1:8000/mcp`).
  - **Headers**: 키 필드에 리터럴 문자열 `Authorization`을 입력합니다. 키의 값으로는 `TEST_BEARER_TOKEN`, 즉 전역 변수의 정확한 이름을 입력합니다.

8. **Create Server**를 클릭합니다.

    연결이 성공하면, Langflow는 서버가 노출하는 도구의 개수를 보여줍니다.

    서버와 전역 변수를 만든 후에는, 다음 단계에서 설명한 대로 **MCP Tools** 컴포넌트로 서버에 연결할 수 있습니다.

9. 플로우에 **MCP Tools** 컴포넌트를 추가합니다.

10. **MCP Tools** 컴포넌트에서 **MCP Server**가 만든 서버로 설정되어 있는지 확인합니다.
MCP 서버 설정에는 이미 앞서 설정한 헤더가 포함되어 있으므로, 컴포넌트에서 추가로 설정할 필요는 없습니다. 전역 변수 `TEST_BEARER_TOKEN`은 컴포넌트가 MCP 서버에 요청을 보낼 때 자동으로 해석됩니다.

11. 선택 사항: **MCP Tools** 컴포넌트의 헤더를 재정의하거나 추가 헤더를 더하려면, 컴포넌트를 클릭하여 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-menus)에서 **Headers** 매개변수를 확인한 다음 헤더 키 값을 추가합니다. 컴포넌트에서 설정한 헤더는 MCP 서버 설정에서 구성한 헤더보다 우선합니다.

12. 플로우를 테스트하여 에이전트가 서버를 사용해 질의에 응답하는지 확인합니다. **Playground**를 열고, **MCP Tools** 컴포넌트를 통해 연결한 도구를 사용하는 프롬프트를 입력합니다.

    Langflow는 MCP 서버로 요청을 보내기 전에 `TEST_BEARER_TOKEN`을 자동으로 실제 값으로 해석합니다. MCP 서버가 요청을 받으면 `Authorization` 헤더에는 해석된 토큰 값이 담겨 있습니다.

## 중첩된 MCP 서버로 `x-api-key` 전파하기[​](#propagate-x-api-key "Direct link to propagate-x-api-key")

Langflow가 MCP 서버로 실행되고 플로우에 외부 서버를 호출하는 [**MCP Tools** 컴포넌트](https://docs.langflow.org/mcp-tools)가 포함된 경우, 런타임에 외부 클라이언트의 `x-api-key`나 `Authorization` 헤더를 전달할 수 있습니다.

중첩된 서버의 **Headers** 설정에서, 키와 값을 동일한 헤더 이름(예: `x-api-key`와 `x-api-key`)으로 설정하세요.
Langflow는 들어오는 요청에서 일치하는 헤더를 읽고, 중첩된 서버를 호출하기 전에 이를 치환합니다.

들어오는 요청에 설정된 헤더가 포함되어 있지 않은 경우, 리터럴 문자열이 변경 없이 그대로 전달됩니다.

## 참고[​](#see-also "Direct link to See also")

- [Langflow MCP 클라이언트](https://docs.langflow.org/next/langflow-mcp-client)
- [Langflow를 MCP 서버로 사용하기](https://docs.langflow.org/mcp-server)
- [MCP Tools 컴포넌트로 DataStax Astra DB MCP 서버 사용하기](https://docs.langflow.org/mcp-component-astra)
