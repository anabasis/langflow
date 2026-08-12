# Langflow를 MCP 서버로 사용하기
> 원문: https://docs.langflow.org/next/mcp-server

Langflow는 [Model Context Protocol(MCP)](https://modelcontextprotocol.io/introduction)을 MCP 서버와 MCP 클라이언트 양쪽 모두로 통합합니다.

이 페이지에서는 Langflow를 MCP 서버로 사용하여 플로우를 [MCP 클라이언트](https://modelcontextprotocol.io/clients)가 응답을 생성할 때 사용할 수 있는 [도구](https://modelcontextprotocol.io/docs/concepts/tools)로 노출하는 방법을 설명합니다.

Langflow MCP 서버는 **streamable HTTP** 전송과 대체 수단인 **Server-Sent Events(SSE)**를 모두 지원합니다.
기본 프로젝트 MCP 서버 설정은 URL 경로 `/streamable`에서 streamable HTTP 전송을 사용합니다.

Langflow를 MCP 클라이언트로 사용하고 플로우 내에서 MCP 서버 연결을 관리하는 방법에 대한 정보는 [Langflow를 MCP 클라이언트로 사용하기](https://docs.langflow.org/mcp-client)를 참고하세요.

## 사전 요구 사항[​](#prerequisites "Direct link to Prerequisites")

- [**Chat Output** 컴포넌트](https://docs.langflow.org/chat-input-and-output)가 있는 플로우가 최소 하나 이상 있는 [Langflow 프로젝트](https://docs.langflow.org/concepts-flows#projects)가 필요합니다.

    플로우를 MCP 도구로 사용하려면 **Chat Output** 컴포넌트가 필요합니다.

- MCP Inspector를 사용하여 [플로우를 테스트하고 디버깅](#test-and-debug-flows)하려는 경우, 컴퓨터에 [Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)의 LTS 버전이 설치되어 있어야 합니다.

- [공개 Langflow 서버를 배포](https://docs.langflow.org/deployment-public-server)하려는 경우, [ngrok이 설치](https://ngrok.com/docs/getting-started/#1-install-ngrok)되어 있고 [ngrok authtoken](https://dashboard.ngrok.com/get-started/your-authtoken)이 있어야 합니다.

## 플로우를 MCP 도구로 서비스하기[​](#select-flows-to-serve "Direct link to Serve flows as MCP tools")

[Langflow 프로젝트](https://docs.langflow.org/concepts-flows#projects)를 만들면, Langflow는 자동으로 해당 프로젝트를 MCP 서버 설정에 추가하고 프로젝트의 플로우를 MCP 도구로 사용할 수 있게 합니다.

Langflow 서버에 인증이 활성화되어 있는 경우(`AUTO_LOGIN=false`), 프로젝트의 MCP 서버는 자동으로 API 키 인증으로 설정되며, 새 프로젝트의 플로우에 접근하기 위한 새로운 API 키가 생성됩니다.
자세한 내용은 [MCP 서버 인증](#authentication)을 참고하세요.

### Langflow 프로젝트의 자동 MCP 서버 설정 방지하기[​](#prevent-automatic-mcp-server-configuration-for-langflow-projects "Direct link to Prevent automatic MCP server configuration for Langflow projects")

새 프로젝트에 대한 자동 MCP 서버 설정을 비활성화하려면, `LANGFLOW_ADD_PROJECTS_TO_MCP_SERVERS` 환경 변수를 `false`로 설정하세요.
자세한 내용은 [MCP 서버 환경 변수](#mcp-server-environment-variables)를 참고하세요.

### Langflow 프로젝트의 MCP 서버 선택적으로 활성화/비활성화하기[​](#selectively-enable-and-disable-mcp-servers-for-langflow-projects "Direct link to Selectively enable and disable MCP servers for Langflow projects")

자동 MCP 서버 설정 활성화 여부와 관계없이, MCP 도구로 노출되는 프로젝트를 선택적으로 활성화하거나 비활성화할 수 있습니다.

1. [**Projects** 페이지](https://docs.langflow.org/concepts-flows#projects)에서 **MCP Server** 탭을 클릭하거나, 플로우를 편집할 때 **Share**를 클릭한 다음 **MCP Server**를 선택합니다.

    ![MCP 서버 프로젝트 페이지](https://docs.langflow.org/assets/images/mcp-server-53850e4ac7599dec00dd7d01922ba79f.png)

    **Flows/Tools** 섹션에는 현재 이 MCP 서버에서 도구로 서비스되고 있는 플로우가 나열됩니다.

2. 노출된 플로우를 전환하려면 **Edit Tools**를 클릭한 다음 도구로 노출하고 싶은 플로우를 선택합니다.
플로우가 도구로 사용되지 않도록 하려면 첫 번째 열의 체크박스를 해제하세요.

3. 변경 사항을 저장하려면 **MCP Server Tools** 대화 상자를 닫습니다.

    ![MCP Server Tools](https://docs.langflow.org/assets/images/mcp-server-tools-ddc0f1dc04109b9f3daf6a2f380073c4.png)

### 플로우 도구 이름과 설명 편집하기[​](#edit-flow-tool-names-and-descriptions "Direct link to Edit flow tool names and descriptions")

도구 이름과 설명은 MCP 클라이언트가 플로우가 제공하는 작업과 언제 그 작업을 사용해야 하는지 파악하는 데 도움이 됩니다.
MCP 클라이언트에 서비스하는 모든 도구에 명확하고 설명적인 이름과 설명을 제공하는 것이 좋습니다.

Langflow MCP 서버에서 플로우 도구의 이름과 설명을 편집하려면 다음을 수행하세요.

1. [**Projects** 페이지](https://docs.langflow.org/concepts-flows#projects)에서 **MCP Server** 탭을 클릭하거나, 플로우를 편집할 때 **Share**를 클릭한 다음 **MCP Server**를 선택합니다.

2. **Edit Tools**를 클릭합니다.

3. 편집하고 싶은 **Description** 또는 **Tool**을 클릭합니다.

  - **Tool name**: 에이전트가 도구로 사용할 때 플로우가 무엇을 하는지 명확하게 알 수 있는 이름을 입력합니다.

  - **Tool description**: 플로우가 수행하는 구체적인 작업을 완전하고 정확하게 설명하는 설명을 입력합니다.

4. 변경 사항을 저장하려면 **MCP Server Tools** 대화 상자를 닫습니다.

#### 도구 이름과 설명의 중요성[​](#importance-of-tool-names-and-descriptions "Direct link to Importance of tool names and descriptions")

MCP 클라이언트는 응답을 생성할 때 사용할 작업을 결정하기 위해 도구 이름과 설명을 사용합니다.

MCP 클라이언트는 Langflow 프로젝트를 활성화된 모든 플로우가 도구로 나열된 하나의 MCP 서버로 취급하기 때문에, 불명확한 이름과 설명은 에이전트가 도구를 잘못 또는 일관성 없이 선택하게 만들 수 있습니다.

예를 들어, 플로우의 기본 도구 이름은 `adbbf8c7-0a34-493b-90ea-5e8b42f78b66`와 같은 플로우 ID입니다.
이는 플로우의 유형이나 목적에 대한 정보를 에이전트에게 전혀 제공하지 않습니다.

플로우에 대한 더 많은 맥락을 제공하려면, Langflow 프로젝트의 MCP 서버를 설정할 때 플로우 이름과 설명을 명확하게 지정하세요.

이러한 이름과 설명을 함수 이름과 코드 주석이라고 생각하세요.
플로우가 해결하는 문제를 설명하는 명확한 문장을 사용하세요.

**예시: 도구 이름과 설명 사용법**

예를 들어, **Document Q&A** 템플릿을 기반으로 이력서에 대해 대화하는 LLM을 사용하는 플로우를 만들고, 다음과 같은 이름과 설명을 부여했다고 가정해 봅시다.

- **도구 이름**: `document_qa_for_resume`

- **도구 설명**: `A flow for analyzing Emily's resume.`

Langflow MCP 서버를 Cursor에 연결한 후, `What job experience does Emily have?`와 같이 이력서에 대해 Cursor에게 물어볼 수 있습니다.
도구 이름과 설명이 제공하는 맥락을 사용하여, 에이전트는 Emily의 이력서에 대한 응답을 만들기 위해 `document_qa_for_resume` MCP 도구를 사용하기로 결정할 수 있습니다.
필요한 경우, 에이전트는 응답을 생성하기 전에 플로우 도구를 사용해도 되는지 허가를 요청합니다.

`What job experience does Alex have?`와 같이 다른 이력서에 대해 질문하면, 도구 설명이 이 플로우가 Emily의 이력서를 위한 것이라고 명시하고 있으므로 에이전트는 `document_qa_for_resume`이 이 요청과 관련이 없다고 판단할 수 있습니다.
이 경우 에이전트는 다른 사용 가능한 도구를 사용하거나, Alex에 대한 정보에 접근할 수 없음을 알려줄 수 있습니다.
예를 들면 다음과 같습니다.

```
I notice you're asking about Alex's job experience.
Based on the available tools, I can see there is a Document QA for Resume flow that's designed for analyzing resumes.
However, the description mentions it's for "Emily's resume" not Alex's. I don't have access to Alex's resume or job experience information.
```

### 도구 실행 타임아웃 설정하기[​](#configure-tool-execution-timeouts "Direct link to Configure tool execution timeouts")

도구 실행 타임아웃을 설정하는 방법은 세 가지입니다. MCP Tools 컴포넌트의 타임아웃 설정, 전역 환경 변수, Langflow의 기본 폴백입니다. 이를 어떻게 설정하는지에 따라 각 도구 호출에 대한 실제 타임아웃 한도가 결정되는 방식이 달라집니다.

Langflow는 다음 순서로 시간을 평가합니다.

1. 컴포넌트별 타임아웃은 플로우 내 MCP Tools 컴포넌트에서 직접 설정됩니다. [**MCP Tools** 컴포넌트](https://docs.langflow.org/mcp-tools)에서 컴포넌트별 타임아웃을 설정하려면, 고급 설정 탭을 열고 **Tool Execution Timeout (seconds)** 필드에 값을 입력하세요. 값이 `0`이면 컴포넌트별 재정의가 비활성화되고 전역 설정으로 되돌아갑니다.

2. 전역 타임아웃은 `LANGFLOW_MCP_TOOL_EXECUTION_TIMEOUT` 환경 변수로 설정됩니다. 기본값은 180초입니다.

3. `LANGFLOW_MCP_TOOL_EXECUTION_TIMEOUT`이나 `LANGFLOW_MCP_SERVER_TIMEOUT` 중 어느 것도 설정되지 않은 경우, Langflow는 기본값인 180초를 사용합니다.

180초보다 오래 걸리는 도구 호출을 지원하려면, 전역 한도를 높이기 위해 `LANGFLOW_MCP_TOOL_EXECUTION_TIMEOUT`을 `180`보다 큰 값으로 설정하거나, 특정 MCP Tools 컴포넌트의 한도만 높이기 위해 해당 컴포넌트의 **Tool Execution Timeout (seconds)** 필드를 `180`보다 큰 값으로 설정하세요.

`LANGFLOW_MCP_SERVER_TIMEOUT`이 `LANGFLOW_MCP_TOOL_EXECUTION_TIMEOUT`보다 큰 값으로 설정된 경우, 서버 타임아웃이 우선하여 도구 호출의 실제 한도가 됩니다.

## Langflow MCP 서버에 클라이언트 연결하기[​](#connect-clients-to-use-the-servers-actions "Direct link to Connect clients to your Langflow MCP server")

Langflow는 로컬 MCP 클라이언트에 Langflow MCP 서버를 배포하는 데 도움이 되는 자동 설치와 코드 스니펫을 제공합니다.

JSON 옵션은 Langflow MCP 서버를 모든 로컬 또는 원격 MCP 클라이언트에 연결할 수 있게 해줍니다.
이 과정은 [MCP 호환 클라이언트](https://modelcontextprotocol.io/clients)라면 어디에나 적용할 수 있습니다.

1. [MCP 호환 클라이언트](https://modelcontextprotocol.io/clients)를 설치합니다.

    이 단계는 Cursor를 예시로 사용하지만, 파일 이름 같은 클라이언트별 세부 사항에 약간의 차이가 있을 뿐 모든 클라이언트에서 과정은 일반적으로 동일합니다.

2. 클라이언트의 UI 또는 설정 파일을 사용하여 새 MCP 서버를 추가합니다.

    예를 들어 Cursor에서는 **Cursor Settings**로 이동하여 **MCP**를 선택한 다음 **Add New Global MCP Server**를 클릭하면 Cursor의 전역 `mcp.json` 설정 파일이 열립니다.

3. 권장: MCP 서버에 대한 [인증](#authentication)을 설정합니다.

4. Langflow의 **Projects** 페이지에서 **MCP Server** 탭을 클릭합니다.

5. **JSON** 탭을 클릭하고 운영체제에 맞는 코드 스니펫을 복사한 다음, 클라이언트의 MCP 설정 파일에 붙여넣습니다.
예를 들면 다음과 같습니다.

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
    **MCP Server** 탭은 `LANGFLOW_SERVER_ADDRESS`와 `PROJECT_ID` 값을 자동으로 채워줍니다.

    Langflow 서버의 기본 주소는 `http://localhost:7860`입니다.
[공개 Langflow 서버](https://docs.langflow.org/deployment-public-server)를 사용하는 경우, 서버 주소가 자동으로 포함됩니다.

    Langflow 서버에 인증이 필요한 경우, 설정에 Langflow API 키나 OAuth 설정을 포함해야 합니다.
자세한 내용은 [MCP 서버 인증](#authentication)을 참고하세요.

6. MCP 서버 명령어에 다른 환경 변수를 포함하려면, 환경 변수의 키-값 쌍을 담은 `env` 객체를 추가하세요. 예를 들면 다음과 같습니다.

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
      ],
      "env": {
        "KEY": "VALUE"
      }
    }
  }
}
```
    이 환경 변수는 `mcp-proxy` 프로세스만을 위한 것이므로, `env` 객체에 API 키를 추가하지 마세요.
대신 `args` 아래에 API 키를 추가하세요.
예시는 [MCP 서버 인증](#authentication)을 참고하세요.

7. 클라이언트의 MCP 설정 파일을 저장하고 닫습니다.

8. Langflow MCP 서버가 클라이언트의 MCP 서버 목록에 있는지 확인합니다.
필요한 경우, 수정된 설정 파일을 적용하기 위해 클라이언트를 다시 시작하세요.

자동 설치 옵션은 특정 MCP 클라이언트에서만 사용할 수 있습니다.
자동 설치는 Langflow가 클라이언트의 설정 파일에 쓸 수 있도록 클라이언트가 로컬에 설치되어 있어야 합니다.
클라이언트가 지원되지 않거나, 원격으로 설치되어 있거나, 추가 환경 변수를 전달해야 하는 경우 **JSON** 옵션을 사용하세요.

1. Langflow 서버가 실행 중인 동일한 컴퓨터에 [Cursor](https://docs.cursor.com/get-started/installation), [Claude](https://claude.ai/download), 또는 [Windsurf](https://windsurf.com/download/editor)를 설치합니다.

2. 권장: MCP 서버에 대한 [인증](#authentication)을 설정합니다.

3. Langflow의 **Projects** 페이지에서 **MCP Server** 탭을 클릭합니다.

4. **Auto install** 탭에서 MCP 클라이언트 제공업체를 찾은 다음 **Add**를 클릭합니다.

    Langflow 프로젝트의 MCP 서버가 로컬 Cursor, Claude, Windsurf 클라이언트의 설정 파일에 자동으로 추가됩니다.
예를 들어 Cursor의 경우, 서버 설정이 `mcp.json` 설정 파일에 추가됩니다.

    선택한 클라이언트가 설치되어 있지 않더라도 Langflow는 이 설정을 추가하려고 시도합니다.
설치를 확인하려면 클라이언트에서 사용 가능한 MCP 서버를 확인하세요.

MCP 클라이언트가 Langflow 프로젝트의 MCP 서버에 연결되면, 플로우가 도구로 등록됩니다.
Cursor는 질의에 따라 도구를 사용할 시점을 결정하며, 필요한 경우 권한을 요청합니다.
자세한 내용은 [Cursor의 MCP 문서](https://docs.cursor.com/context/model-context-protocol)와 같은 클라이언트의 MCP 문서를 참고하세요.

## MCP 서버 인증[​](#authentication "Direct link to MCP server authentication")

각 [Langflow 프로젝트](https://docs.langflow.org/concepts-flows#projects)에는 고유한 MCP 서버 인증 설정을 가진 자체 MCP 서버가 있습니다.

새 프로젝트를 만들면, Langflow는 Langflow 서버의 인증 설정에 따라 프로젝트의 MCP 서버에 대한 인증을 자동으로 설정합니다. 인증이 활성화된 경우(`AUTO_LOGIN=false`), 프로젝트는 자동으로 API 키 인증으로 설정되며 프로젝트의 플로우에 접근하기 위한 새로운 API 키가 생성됩니다.

Langflow MCP 서버에 대한 인증을 설정하려면, Langflow의 **Projects** 페이지로 이동하여 **MCP Server** 탭을 클릭하고 **Edit Auth**를 클릭한 다음 원하는 인증 방식을 선택하세요.

- API key
- OAuth
- None


Langflow API 키로 MCP 서버를 인증할 때, 프로젝트의 MCP 서버 **JSON** 코드 스니펫과 **Auto install** 설정은 (streamable 전송의 경우) **args** 배열에 `--headers`와 `x-api-key` 인자를 자동으로 포함합니다.

**Generate API key**를 클릭하면 코드 템플릿에 새 Langflow API 키가 자동으로 삽입됩니다.
또는 `YOUR_API_KEY`를 기존 Langflow API 키로 바꿀 수도 있습니다.

설정에 API 키를 추가하려면, `args`에서 `"--headers"`, `"x-api-key"`, 키 값의 세 개의 별도 항목을 사용하세요. 예를 들면 다음과 같습니다.

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

## Langflow MCP 서버를 외부에 배포하기[​](#deploy-your-server-externally "Direct link to Deploy your Langflow MCP server externally")

Langflow MCP 서버를 외부에 배포하려면 [공개 Langflow 서버 배포하기](https://docs.langflow.org/deployment-public-server)를 참고하세요.

## MCP Inspector로 플로우 테스트하고 디버깅하기[​](#test-and-debug-flows "Direct link to Use MCP Inspector to test and debug flows")

Node 사전 요구 사항

MCP Inspector를 사용하려면 컴퓨터에 [Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)의 LTS 버전이 설치되어 있어야 합니다.

[MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector)는 MCP 서버를 테스트하고 디버깅하는 데 흔히 사용되는 도구입니다.
MCP Inspector를 사용하여 플로우를 모니터링하고 MCP 서버가 플로우를 어떻게 소비하는지 파악할 수 있습니다.

1. MCP Inspector를 설치합니다.

```bash
npx @modelcontextprotocol/inspector
```
    프록시 포트 지정을 포함하여 MCP Inspector 설정에 대한 자세한 내용은 [MCP Inspector GitHub 프로젝트](https://github.com/modelcontextprotocol/inspector)를 참고하세요.

2. 웹 브라우저를 열고 MCP Inspector UI로 이동합니다.
기본 주소는 `http://localhost:6274`입니다.

3. MCP Inspector UI에서 Langflow 프로젝트의 MCP 서버에 대한 연결 세부 정보를 입력합니다.
필드 값은 서버의 [인증](#authentication) 방식에 따라 달라집니다.

  - **Transport Type**: **STDIO**를 선택합니다.
  - **Command**: `uvx`
  - **Arguments**: 다음 인자 목록을 공백으로 구분하여 입력합니다. `YOUR_API_KEY`, `LANGFLOW_SERVER_ADDRESS`, `PROJECT_ID` 값을 Langflow MCP 서버의 값으로 바꾸세요. 예를 들면 다음과 같습니다.

```bash
mcp-proxy --headers x-api-key YOUR_API_KEY http://LANGFLOW_SERVER_ADDRESS/api/v1/mcp/project/PROJECT_ID/streamable
```

- **Connect**를 클릭합니다.

    연결에 성공하면, **Tools** 탭에서 프로젝트의 플로우를 볼 수 있습니다.
이 탭에서 플로우가 MCP에 의해 도구로 어떻게 등록되는지 모니터링하고, 커스텀 입력값으로 도구를 테스트할 수 있습니다.

- MCP Inspector를 종료하려면, 시작한 것과 동일한 터미널 창에서 `Control+C`를 누르세요.

## MCP 서버 관리를 슈퍼유저로 제한하기[​](#restrict-mcp-server-management "Direct link to Restrict MCP server management to superusers")

슈퍼유저가 아닌 사용자가 MCP 서버 연결을 편집하지 못하도록 하려면 `LANGFLOW_MCP_SERVERS_LOCKED=true`로 설정하세요.

`true`로 설정하면, 슈퍼유저가 아닌 사용자는 이미 설정된 기존 MCP 서버를 사용할 수 있지만 UI나 API에서 MCP 서버 연결을 설정할 수는 없습니다.
슈퍼유저는 MCP 서버 설정에 대한 전체 접근 권한을 유지합니다.

사용자에 대한 MCP 서버 설정 잠금은 플로우를 MCP 도구로 서비스하는 Langflow 내장 MCP 서버를 비활성화하지 않습니다.

## MCP 서버 환경 변수[​](#mcp-server-environment-variables "Direct link to MCP server environment variables")

다음 환경 변수는 Langflow 프로젝트의 MCP 서버와 관련된 동작을 설정합니다.

| 변수                                                 | 형식  | 기본값 | 설명                                                                                                                                                                                                                                   |
| -------------------------------------------------------- | ------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LANGFLOW_​MCP_​SERVER_​ENABLED`                         | Boolean | `True`  | 각 Langflow 프로젝트에 대해 MCP 서버를 초기화할지 여부입니다. `false`인 경우, Langflow는 MCP 서버를 초기화하지 않습니다.                                                                                                                  |
| `LANGFLOW_​MCP_​SERVER_​ENABLE_​PROGRESS_​NOTIFICATIONS` | Boolean | `False` | `true`인 경우, Langflow MCP 서버는 진행 상황 알림을 전송합니다.                                                                                                                                                                                  |
| `LANGFLOW_​MCP_​SERVER_​TIMEOUT`                         | Integer | `20`    | MCP 연결 설정 및 도구 실행에 대한 타임아웃(초)입니다. [도구 실행 타임아웃 설정하기](#configure-tool-execution-timeouts)를 참고하세요.                                                                                                  |
| `LANGFLOW_​MCP_​TOOL_​EXECUTION_​TIMEOUT`                | Integer | `180`   | MCP 도구 호출에 대한 전역 타임아웃(초)입니다. [도구 실행 타임아웃 설정하기](#configure-tool-execution-timeouts)를 참고하세요.                                                                                                                    |
| `LANGFLOW_​MCP_​MAX_​SESSIONS_​PER_​SERVER`              | Integer | `10`    | 고유 서버당 유지할 최대 MCP 세션 수입니다.                                                                                                                                                                                                     |
| `LANGFLOW_​ADD_​PROJECTS_​TO_​MCP_​SERVERS`              | Boolean | `True`  | 새로 생성된 프로젝트를 사용자의 MCP 서버 설정에 자동으로 추가할지 여부입니다. `false`인 경우, 프로젝트를 MCP 서버에 수동으로 추가해야 합니다.                                                                                                      |
| `LANGFLOW_​MCP_​SERVERS_​LOCKED`                         | Boolean | `False` | `true`인 경우, 슈퍼유저가 아닌 사용자는 UI나 API를 통해 MCP 서버 연결을 추가, 편집, 삭제할 수 없습니다. 슈퍼유저는 전체 접근 권한을 유지합니다. 자세한 내용은 [MCP 서버 관리를 슈퍼유저로 제한하기](#restrict-mcp-server-management)를 참고하세요. |


## Langflow MCP 서버 문제 해결하기[​](#troubleshooting-mcp-server "Direct link to Troubleshoot Langflow MCP servers")

MCP 서버 및 클라이언트에 대한 문제 해결 조언은 [Langflow 문제 해결: MCP 문제](https://docs.langflow.org/troubleshoot#mcp)를 참고하세요.

## 참고[​](#see-also "Direct link to See also")

- [Langflow를 MCP 클라이언트로 사용하기](https://docs.langflow.org/mcp-client)
- [DataStax Astra DB MCP 서버 사용하기](https://docs.langflow.org/mcp-component-astra)
- [MCP 서버 환경 변수](https://docs.langflow.org/environment-variables#mcp)
