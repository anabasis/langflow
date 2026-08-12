# Langflow 에이전트 사용하기
> 원문: https://docs.langflow.org/next/agents

Langflow의 [**Agent** 컴포넌트](https://docs.langflow.org/components-agents)는 에이전트 플로우를 구축하는 데 핵심적인 요소입니다.
이 컴포넌트는 여러 대규모 언어 모델(LLM) 제공업체, 도구 호출(tool calling), 커스텀 지침 등 에이전트를 만드는 데 필요한 모든 것을 제공합니다.
에이전트 설정을 단순화하여 애플리케이션 개발에 집중할 수 있게 해줍니다.

**에이전트는 어떻게 작동하나요?**

에이전트는 *도구(tools)*를 통합하여 대규모 언어 모델(LLM)을 확장합니다. 도구는 추가적인 컨텍스트를 제공하고 자율적인 작업 실행을 가능하게 하는 함수입니다.
이러한 통합을 통해 에이전트는 독립형 LLM보다 더 전문화되고 강력해집니다.

LLM은 일반적인 질의와 작업에 대해 무난하지만 수동적인 응답을 생성하는 반면, 에이전트는 통합된 컨텍스트와 도구를 활용하여 더 관련성 높은 응답을 제공하거나 심지어 실제 작업을 수행할 수 있습니다.
예를 들어, 회사의 문서, 저장소 및 기타 리소스에 접근하여 팀이 특정 제품, 고객, 코드에 대한 지식이 필요한 작업을 수행하도록 돕는 에이전트를 만들 수 있습니다.

에이전트는 LLM을 추론 엔진으로 사용하여 입력을 처리하고, 질의에 응답하기 위해 어떤 작업을 수행할지 결정한 다음, 응답을 생성합니다.
응답은 일반적인 텍스트 기반 LLM 응답일 수도 있고, 파일 편집, 스크립트 실행, 외부 API 호출과 같은 작업(action)을 포함할 수도 있습니다.

에이전트의 맥락에서 도구는 에이전트가 작업을 수행하거나 외부 리소스에 접근하기 위해 실행할 수 있는 함수입니다.
함수는 에이전트가 이해할 수 있는 공통 인터페이스를 가진 `Tool` 객체로 래핑됩니다.
에이전트는 도구 등록(tool registration)을 통해 도구를 인식하게 되는데, 이는 일반적으로 에이전트 초기화 시 사용 가능한 도구 목록이 제공되는 과정입니다.
`Tool` 객체의 설명(description)은 도구가 무엇을 할 수 있는지 에이전트에게 알려주어, 주어진 요청에 그 도구가 적합한지 판단할 수 있게 합니다.

## 플로우에서 Agent 컴포넌트 사용하기[​](#use-the-agent-component-in-a-flow "Direct link to Use the Agent component in a flow")

다음 단계는 빈 플로우에서 Langflow의 에이전트 플로우를 만드는 방법을 설명합니다.
미리 만들어진 예시를 사용하려면 **Simple Agent** 템플릿이나 [Langflow 빠른 시작](https://docs.langflow.org/get-started-quickstart)을 참고하세요.

1. **New Flow**를 클릭한 다음 **Blank Flow**를 클릭합니다.

2. 플로우에 **Agent** 컴포넌트를 추가합니다.

3. Langflow의 전역 모델 제공업체 설정을 편집하려면 다음을 수행합니다.

  1. **Model Providers** 창을 열려면 프로필 아이콘을 클릭하고 **Settings**를 선택한 다음 **Model Providers**를 클릭합니다.

  2. **Model Providers** 창에서 제공업체를 선택합니다.

  3. **API Key** 필드에 제공업체의 API 키를 추가합니다. 일부 제공업체는 추가 설정 필드가 필요할 수 있습니다. 자세한 내용은 해당 모델 제공업체의 문서를 참고하세요.

        키는 플로우에서 사용하려는 모델을 호출할 수 있는 권한이 있어야 하며, 계정에는 수행하려는 작업에 충분한 크레딧이 있어야 합니다.

        제공업체당 하나의 키만 추가할 수 있습니다. 해당 키가 Langflow에서 사용하려는 *모든* 모델에 접근할 수 있는지 확인하세요.

  4. **Save**를 클릭합니다.

  5. Langflow에서 사용하고 싶은 특정 모델을 활성화합니다.
사용 가능한 모델은 제공업체와 API 키 권한에 따라 다릅니다.
텍스트를 생성하는 모델은 **Language Models**에 나열됩니다.
임베딩을 생성하는 모델은 **Embedding Models**에 나열됩니다.

    Langflow의 전역 모델 설정에서 모델을 활성화하면, 플로우 내 모델 기반 컴포넌트 어디에서든 해당 모델을 사용할 수 있습니다.

4. **Language Model** 드롭다운에서 사용하려는 모델을 선택합니다.
원하는 모델이 목록에 없다면 **Models** 설정에서 활성화되어 있는지 확인하세요.
자세한 내용은 [Agent 컴포넌트 매개변수](#agent-component-parameters)를 참고하세요.

5. 플로우에 [**Chat Input** 및 **Chat Output** 컴포넌트](https://docs.langflow.org/chat-input-and-output)를 추가한 다음 **Agent** 컴포넌트에 연결합니다.

    이 시점에서 **Playground**에서 테스트할 수 있는 기본적인 LLM 기반 채팅 플로우를 만든 것입니다.
그러나 이 플로우는 LLM과 대화만 나눌 뿐입니다.
이 플로우를 확장하여 진정한 에이전트 방식으로 만들려면, 다음 단계에서 설명하는 대로 도구를 추가하세요.

    ![Chat Input, Agent, Chat Output 컴포넌트로 구성된 기본 에이전트 채팅 플로우.](https://docs.langflow.org/assets/images/agent-example-add-chat-96c042592973dd0f86ed13d19ef1fa24.png)

6. 플로우에 **Web Search**, **URL**, **Calculator** 컴포넌트를 추가합니다.

7. **Web Search**, **URL**, **Calculator** 컴포넌트에서 **Tool Mode**를 활성화합니다.

  1. **Web Search** 컴포넌트를 클릭하여 [컴포넌트 헤더 메뉴](https://docs.langflow.org/concepts-components#component-menus)를 표시한 다음 **Tool Mode**를 활성화합니다.
  2. **URL** 및 **Calculator** 컴포넌트에도 동일하게 반복합니다.
  3. 각 도구 컴포넌트의 **Toolset** 포트를 **Agent** 컴포넌트의 **Tools** 포트에 연결합니다.

    **Tool Mode**는 컴포넌트의 입력을 수정하여 컴포넌트를 도구로 만듭니다.
**Tool Mode**가 활성화되면 컴포넌트는 **Agent** 컴포넌트로부터 요청을 받아 해당 컴포넌트의 사용 가능한 작업을 도구로 활용할 수 있게 됩니다.

    **Tool Mode**일 때, 컴포넌트에는 에이전트가 해당 컴포넌트의 작업을 도구로 사용하도록 허용하려면 **Agent** 컴포넌트의 **Tools** 포트에 연결해야 하는 **Toolset** 포트가 있습니다.

    자세한 내용은 [에이전트를 위한 도구 설정](https://docs.langflow.org/agents-tools)을 참고하세요.

    ![세 개의 컴포넌트가 도구로 Agent 컴포넌트에 연결된 더 복잡한 에이전트 채팅 플로우](https://docs.langflow.org/assets/images/agent-example-add-tools-aa545843799b2155b926b723a4f3922e.png)

8. **Playground**를 열고 에이전트에게 `What tools are you using to answer my questions?`라고 질문합니다.

    에이전트는 연결된 도구 목록으로 응답해야 합니다.
내장 도구도 포함될 수 있습니다.

  
  `
  _10
  I use a combination of my built-in knowledge (up to June 2024) and a set of external tools to answer your questions. Here are the main types of tools I can use:
  _10
  Web Search & Content Fetching: I can fetch and summarize content from web pages, including crawling links recursively.
  _10
  News Search: I can search for recent news articles using Google News via RSS feeds.
  _10
  Calculator: I can perform arithmetic calculations and evaluate mathematical expressions.
  _10
  Date & Time: I can provide the current date and time in various time zones.
  _10
  These tools help me provide up-to-date information, perform calculations, and retrieve specific data from the internet when needed. If you have a specific question, let me know, and I'll use the most appropriate tool(s) to help!

`

9. 특정 도구를 테스트하려면 `Summarize today's tech news`와 같이 도구 중 하나를 사용하는 질문을 에이전트에게 합니다.

    플로우를 디버깅하고 테스트하는 데 도움이 되도록, **Playground**는 에이전트의 도구 호출, 제공된 입력, 그리고 요약을 생성하기 전에 에이전트가 받은 원본 출력을 표시합니다.
주어진 예시에서는 에이전트가 **Search Mode**가 **News**로 설정된 **Web Search** 컴포넌트를 호출해야 합니다.

일반적인 도구를 사용하는 기본적인 에이전트 플로우를 성공적으로 만들었습니다.

이 튜토리얼을 계속 발전시키려면 다른 도구 컴포넌트를 연결하거나 [Langflow를 MCP 클라이언트로 사용](https://docs.langflow.org/mcp-client)하여 더 복잡하고 전문화된 작업을 지원해 보세요.

멀티 에이전트 예시는 [에이전트를 도구로 사용하기](https://docs.langflow.org/agents-tools#use-an-agent-as-a-tool)를 참고하세요.

## Agent 컴포넌트 매개변수[​](#agent-component-parameters "Direct link to Agent component parameters")

**Agent** 컴포넌트를 설정하여 원하는 제공업체와 모델, 커스텀 지침, 도구를 사용할 수 있습니다.

일부 매개변수는 비주얼 에디터에서 기본적으로 숨겨져 있습니다.
컴포넌트를 선택했을 때 나타나는 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-inspection-panel)을 통해 모든 컴포넌트 매개변수를 수정할 수 있습니다.

### 제공업체와 모델[​](#provider-and-model "Direct link to Provider and model")

**Language Model**(`agent_llm`) 설정을 사용하여 에이전트가 사용할 LLM을 선택합니다.

Langflow의 전역 모델 제공업체 설정을 편집하려면 다음을 수행합니다.

1. **Model Providers** 창을 열려면 프로필 아이콘을 클릭하고 **Settings**를 선택한 다음 **Model Providers**를 클릭합니다.

2. **Model Providers** 창에서 제공업체를 선택합니다.

3. **API Key** 필드에 제공업체의 API 키를 추가합니다. 일부 제공업체는 추가 설정 필드가 필요할 수 있습니다. 자세한 내용은 해당 모델 제공업체의 문서를 참고하세요.

    키는 플로우에서 사용하려는 모델을 호출할 수 있는 권한이 있어야 하며, 계정에는 수행하려는 작업에 충분한 크레딧이 있어야 합니다.

    제공업체당 하나의 키만 추가할 수 있습니다. 해당 키가 Langflow에서 사용하려는 *모든* 모델에 접근할 수 있는지 확인하세요.

4. **Save**를 클릭합니다.

5. Langflow에서 사용하고 싶은 특정 모델을 활성화합니다.
사용 가능한 모델은 제공업체와 API 키 권한에 따라 다릅니다.
텍스트를 생성하는 모델은 **Language Models**에 나열됩니다.
임베딩을 생성하는 모델은 **Embedding Models**에 나열됩니다.

Langflow의 전역 모델 설정에서 모델을 활성화하면, 플로우 내 모델 기반 컴포넌트 어디에서든 해당 모델을 사용할 수 있습니다.

**Agent** 컴포넌트에서 모델을 사용하려면 **Agent** 컴포넌트의 **Language Model** 필드에서 해당 모델을 선택합니다.

**Language Model** 필드에는 전역으로 설정한 모든 언어 모델이 나열됩니다. 제공업체에 사용 가능한 언어 모델이 없는 경우 목록에 표시되지 않습니다.
예를 들어, 제공업체가 임베딩 모델만 제공하는 경우 해당 모델은 **Agent** 컴포넌트에 나열되지 않습니다.

다른 제공업체나 모델에 접근하려면 다음 중 하나를 수행할 수 있습니다.

- 아무 [언어 모델 컴포넌트](https://docs.langflow.org/components-models)든 **Agent** 컴포넌트의 **Language Model** 포트에 연결합니다. 이 옵션을 사용하면 전역 모델 제공업체 목록에 없는 모델을 사용하기 위해 커스텀 언어 모델 컴포넌트를 연결할 수 있습니다.
- **Models** 창에서 추가 제공업체를 설정한 다음 **Language Model** 드롭다운에서 모델을 선택합니다.


플로우에서 임베딩을 생성해야 하는 경우, [임베딩 모델 컴포넌트](https://docs.langflow.org/components-embedding-models)를 사용하세요.

### 에이전트 지침과 입력[​](#agent-instructions-and-input "Direct link to Agent instructions and input")

**Agent Instructions**(`system_prompt`) 필드에서 모든 대화에 사용할 커스텀 지침을 제공할 수 있습니다.

이 지침은 **Input**(`input_value`)에 추가로 적용되며, **Input**은 직접 입력하거나 **Chat Input** 컴포넌트와 같은 다른 컴포넌트를 통해 제공될 수 있습니다.

### 도구[​](#tools "Direct link to Tools")

에이전트는 요청을 완료하는 데 적절한 도구를 갖추고 있을 때 가장 유용합니다.

**Agent** 컴포넌트는 다른 에이전트와 MCP 서버를 포함한 모든 Langflow 컴포넌트를 도구로 사용할 수 있습니다.

컴포넌트를 도구로 연결하려면 연결하려는 컴포넌트에서 **Tool Mode**를 활성화한 다음 **Agent** 컴포넌트의 **Tools** 포트에 연결해야 합니다.
자세한 내용은 [에이전트를 위한 도구 설정](https://docs.langflow.org/agents-tools)을 참고하세요.

tip

에이전트가 MCP 서버의 도구를 사용하도록 하려면 [**MCP Tools** 컴포넌트](https://docs.langflow.org/mcp-tools)를 사용하세요.

### 에이전트 메모리[​](#agent-memory "Direct link to Agent memory")

Langflow 에이전트는 기본적으로 활성화되어 있는 내장 채팅 메모리를 가지고 있습니다.
이 메모리를 통해 에이전트는 이전 대화의 메시지를 검색하고 참조할 수 있으며, 각 채팅 세션 ID에 대한 롤링 컨텍스트 윈도우를 유지합니다.

채팅 메모리는 [세션 ID(`session_id`)](https://docs.langflow.org/session-id)별로 그룹화됩니다.
동일한 플로우를 실행하는 서로 다른 사용자나 애플리케이션의 채팅 메모리를 분리해야 하는 경우 커스텀 세션 ID를 사용하는 것이 권장됩니다.

기본적으로 **Agent** 컴포넌트는 Langflow 설치의 저장소를 사용하며, 제한된 수의 채팅 메시지를 검색합니다. 이 개수는 **Number of Chat History Messages** 매개변수로 설정할 수 있습니다.

**Message History** 컴포넌트는 기본 채팅 메모리에는 필요하지 않지만, Mem0와 같은 외부 채팅 메모리를 사용하려는 경우에는 필요합니다.
또한 **Message History** 컴포넌트는 메모리를 정렬, 필터링, 제한하는 더 많은 옵션을 제공합니다. 다만 이 옵션 대부분은 기본값과 함께 **Agent** 컴포넌트에 내장되어 있습니다.

Langflow는 각 에이전트 실행 중에 다음과 같은 이벤트를 **Playground**로 전송합니다: 입력 메시지, 입력 및 결과가 포함된 각 도구 호출, 도착하는 즉시 스트리밍되는 토큰, 최종 답변.
Langflow는 실행이 완료되면 완성된 메시지를 채팅 기록에 기록합니다.
**Structured Response** 출력을 사용할 때는 Langflow가 이벤트를 **Playground**로 전송하지 않으며 채팅 기록에도 기록하지 않습니다.

자세한 내용은 [채팅 메모리 저장](https://docs.langflow.org/memory#store-chat-memory) 및 [**Message History** 컴포넌트](https://docs.langflow.org/message-history)를 참고하세요.

### 추가 매개변수[​](#additional-parameters "Direct link to Additional parameters")

**Agent** 컴포넌트에서 사용 가능한 매개변수는 선택한 제공업체와 모델에 따라 달라질 수 있으며, 채팅 메모리나 temperature 같은 추가 모드, 인자, 기능에 대한 지원도 포함됩니다.
예를 들면 다음과 같습니다.

- **Current Date**(`add_current_date_tool`): 활성화(`true`)하면 현재 날짜를 조회할 수 있는 도구를 에이전트에 추가합니다.
- **Handle Parse Errors**(`handle_parsing_errors`): 활성화(`true`)하면 사용자 입력을 분석할 때 오타 같은 오류를 에이전트가 수정할 수 있게 합니다.
- **Verbose**(`verbose`): 활성화(`true`)하면 디버깅 및 분석을 위한 상세한 로그 출력을 기록합니다.


일부 매개변수는 비주얼 에디터에서 기본적으로 숨겨져 있습니다.
컴포넌트를 선택했을 때 나타나는 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-inspection-panel)을 통해 모든 컴포넌트 매개변수를 수정할 수 있습니다.

## Agent 컴포넌트 출력[​](#agent-component-output "Direct link to Agent component output")

**Agent** 컴포넌트에는 두 가지 출력이 있습니다.

- **Response**(`response`): [`Message`](https://docs.langflow.org/data-types#message) 데이터 형태의 에이전트 응답으로, 일반적으로 **Chat Output** 컴포넌트에 연결됩니다.

- **Structured Response**(`structured_response`): 정의한 **Output Schema**에 따라 구조화된 [`Data`](https://docs.langflow.org/data-types#data) 형태로 포맷된 에이전트 응답입니다.

    에이전트의 **Structured Response** 출력을 설정하려면 다음을 수행합니다.

  1. **Agent** 컴포넌트에서 컴포넌트 출력 포트 근처의 출력 레이블을 클릭하고 **Structured Response**를 선택합니다.
  2. **Agent** 컴포넌트를 선택하여 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-inspection-panel)을 연 다음 **Open table**을 클릭합니다.
  3. 추출하려는 각 필드에 대해 행을 추가하려면 **+**를 클릭합니다. 각 행에 대해 **Name**, **Type**을 입력하고, 선택적으로 **Description**과 **As List** 토글을 설정합니다.
  4. **Structured Response** 포트를 **Parser**나 **JSON Operations** 컴포넌트처럼 [`Data`](https://docs.langflow.org/data-types#data) 입력을 받는 다운스트림 컴포넌트에 연결합니다.

    **Agent** 컴포넌트는 연결된 LLM을 사용하여 구조화된 데이터를 추출하며, 추출 동작은 **Output Format Instructions** 필드에서 설정됩니다.
추출 동작을 변경하려면 **Output Format Instructions** 필드의 프롬프트를 수정하세요.
이는 **Output Schema**에 정의된 스키마를 수정하지 않습니다.

    두 출력을 동시에 연결할 수 있지만, 각 출력은 별도의 LLM 호출을 발생시킵니다. 구조화된 데이터만 필요한 경우 **Structured Response**만 연결하세요.

## 참고[​](#see-also "Direct link to See also")

- [**Agent** 및 **MCP Tools** 컴포넌트](https://docs.langflow.org/components-agents)
- [에이전트를 위한 도구 설정](https://docs.langflow.org/agents-tools)
