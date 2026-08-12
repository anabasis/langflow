# Langflow 에이전트 사용

Langflow의 [**Agent** 컴포넌트](../components-reference/components-agents.md)는 에이전트 플로우를 빌드하는 데 핵심입니다.
이 컴포넌트는 여러 대형 언어 모델(LLM) 제공자, 도구 호출, 커스텀 지시 등 에이전트 생성에 필요한 모든 것을 제공합니다.
에이전트 구성을 단순화하여 애플리케이션 개발에 집중할 수 있게 합니다.

**에이전트는 어떻게 작동하나요?**

에이전트는 추가적인 컨텍스트를 제공하고 자율적인 작업 실행을 가능하게 하는 함수인 *도구(tool)*를 통합하여 대형 언어 모델(LLM)을 확장합니다.
이러한 통합은 에이전트를 독립형 LLM보다 더 특화되고 강력하게 만듭니다.

LLM이 일반 쿼리와 작업에 대해 수용 가능하지만 정적인 응답을 생성할 수 있는 반면, 에이전트는 통합된 컨텍스트와 도구를 활용하여 더 관련성 높은 응답을 제공하고 실제로 조치를 취할 수 있습니다.
예를 들어 회사의 문서, 저장소, 기타 리소스에 접근하여 특정 제품, 고객, 코드 지식이 필요한 작업을 팀에게 도움을 줄 수 있는 에이전트를 만들 수 있습니다.

에이전트는 LLM을 추론 엔진으로 사용하여 입력을 처리하고, 쿼리를 처리하기 위해 어떤 조치를 취할지 결정한 후 응답을 생성합니다.
응답은 일반적인 텍스트 기반 LLM 응답이거나 파일 편집, 스크립트 실행, 외부 API 호출 등의 조치를 포함할 수 있습니다.

---

## 플로우에서 Agent 컴포넌트 사용

다음 단계는 빈 플로우에서 Langflow에서 에이전트 플로우를 만드는 방법을 설명합니다.
사전 제작된 예제는 **Simple Agent** 템플릿이나 [Langflow 빠른 시작](../get-started/quickstart.md)을 사용하세요.

1. **New Flow**를 클릭하고 **Blank Flow**를 클릭합니다.

2. 플로우에 **Agent** 컴포넌트를 추가합니다.

3. Langflow의 전역 모델 제공자 구성을 편집합니다:
   1. 프로필 아이콘을 클릭하고 **Settings**, **Model Providers**를 선택합니다.
   2. 제공자를 선택합니다.
   3. **API Key** 필드에 제공자의 API 키를 추가합니다.
   4. **Save**를 클릭합니다.
   5. 사용하려는 특정 모델을 활성화합니다.

4. **Language Model** 드롭다운에서 사용하려는 모델을 선택합니다.

5. [**Chat Input** 및 **Chat Output** 컴포넌트](../components-reference/chat-input-and-output.md)를 플로우에 추가하고 **Agent** 컴포넌트에 연결합니다.

   이 시점에서 **플레이그라운드**에서 테스트할 수 있는 기본 LLM 기반 채팅 플로우가 만들어집니다.
   그러나 이 플로우는 LLM과 채팅할 뿐입니다. 이 플로우를 진정한 에이전트로 만들려면 도구를 추가합니다.

6. 플로우에 **Web Search**, **URL**, **Calculator** 컴포넌트를 추가합니다.

7. **Web Search**, **URL**, **Calculator** 컴포넌트에서 **Tool Mode**를 활성화합니다:
   1. **Web Search** 컴포넌트를 클릭하여 컴포넌트 헤더 메뉴를 열고 **Tool Mode**를 활성화합니다.
   2. **URL** 및 **Calculator** 컴포넌트에 대해 반복합니다.
   3. 각 도구 컴포넌트의 **Toolset** 포트를 **Agent** 컴포넌트의 **Tools** 포트에 연결합니다.

8. **플레이그라운드**를 열고 `What tools are you using to answer my questions?`라고 에이전트에게 물어봅니다.

   에이전트는 연결된 도구 목록을 응답해야 합니다.

9. 특정 도구를 테스트하려면 해당 도구를 사용하는 질문을 에이전트에게 합니다 (예: `Summarize today's tech news`).

기본 에이전트 플로우를 성공적으로 만들었습니다.

---

## Agent 컴포넌트 파라미터

**Agent** 컴포넌트를 원하는 제공자와 모델, 커스텀 지시, 도구를 사용하도록 구성할 수 있습니다.

### 제공자 및 모델

**Language Model** (`agent_llm`) 설정을 사용하여 에이전트가 사용할 LLM을 선택합니다.

**Language Model** 필드는 전역으로 구성된 모든 언어 모델을 나열합니다. 제공자에 언어 모델이 없으면 나열되지 않습니다.

다른 제공자나 모델에 접근하려면 다음 중 하나를 수행합니다:
- 임의의 [언어 모델 컴포넌트](../components-reference/components-models.md)를 **Agent** 컴포넌트의 **Language Model** 포트에 연결합니다.
- **Models** 패널에서 추가 제공자를 구성한 후 **Language Model** 드롭다운에서 모델을 선택합니다.

### 에이전트 지시 및 입력

**Agent Instructions** (`system_prompt`) 필드에서 모든 대화에 사용할 커스텀 지시를 제공할 수 있습니다.

이 지시는 **Input** (`input_value`)에 추가적으로 적용됩니다.

### 도구

에이전트는 요청을 완료하기 위한 적절한 도구를 사용할 때 가장 유용합니다.

**Agent** 컴포넌트는 다른 에이전트 및 MCP 서버를 포함한 모든 Langflow 컴포넌트를 도구로 사용할 수 있습니다.

도구로 컴포넌트를 연결하려면 연결할 컴포넌트에서 **Tool Mode**를 활성화한 후 **Agent** 컴포넌트의 **Tools** 포트에 연결해야 합니다.

자세한 내용은 [에이전트용 도구 구성](./configure-tools.md)을 참조하세요.

> **팁**: 에이전트가 MCP 서버의 도구를 사용하도록 하려면 [**MCP Tools** 컴포넌트](../mcp/mcp-client.md)를 사용합니다.

### 에이전트 메모리

Langflow 에이전트에는 기본적으로 활성화된 기본 채팅 메모리가 있습니다.
이 메모리를 통해 이전 대화의 메시지를 검색하고 참조하여 각 채팅 세션 ID에 대한 롤링 컨텍스트 창을 유지합니다.

채팅 메모리는 [세션 ID (`session_id`)](https://docs.langflow.org/session-id)별로 그룹화됩니다.
동일한 플로우를 실행하는 다른 사용자 또는 애플리케이션의 채팅 메모리를 분리해야 하는 경우 커스텀 세션 ID를 사용하는 것이 좋습니다.

### 추가 파라미터

**Agent** 컴포넌트에서 사용 가능한 파라미터는 선택한 제공자와 모델에 따라 변경될 수 있습니다. 예를 들어:

- **Current Date** (`add_current_date_tool`): 활성화(`true`)하면 에이전트가 현재 날짜를 검색할 수 있는 도구가 추가됩니다.
- **Handle Parse Errors** (`handle_parsing_errors`): 활성화(`true`)하면 에이전트가 사용자 입력 분석 시 오타와 같은 오류를 수정할 수 있습니다.
- **Verbose** (`verbose`): 활성화(`true`)하면 디버깅 및 분석을 위한 자세한 로깅 출력이 기록됩니다.

---

## Agent 컴포넌트 출력

**Agent** 컴포넌트에는 두 가지 출력이 있습니다:

- **Response** (`response`): 일반적으로 **Chat Output** 컴포넌트에 연결되는 [`Message`](../develop/data-types.md) 데이터로서의 에이전트 응답.

- **Structured Response** (`structured_response`): 정의한 **Output Schema**에 따라 구조화된 [`Data`](../develop/data-types.md)로 형식화된 에이전트 응답.

  구조화된 응답 출력 구성:
  1. **Agent** 컴포넌트에서 출력 포트 근처의 출력 레이블을 클릭하고 **Structured Response**를 선택합니다.
  2. **Agent** 컴포넌트를 선택하여 컴포넌트 검사 패널을 열고 **Open table**을 클릭합니다.
  3. **+**를 클릭하여 추출할 각 필드에 행을 추가합니다.
  4. **Structured Response** 포트를 `Data` 입력을 허용하는 다운스트림 컴포넌트에 연결합니다.

---

## 참고 항목

- [**Agent** 및 **MCP Tools** 컴포넌트](../components-reference/components-agents.md)
- [에이전트용 도구 구성](./configure-tools.md)

---

*원문: https://docs.langflow.org/next/agents*
