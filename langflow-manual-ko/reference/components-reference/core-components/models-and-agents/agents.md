# 에이전트

> 원문: https://docs.langflow.org/next/components-agents

Langflow의 **Agent** 컴포넌트는 에이전트 플로우를 구축하는 데 핵심적인 요소입니다.
이 컴포넌트는 플로우 내 AI 에이전트의 동작과 기능을 정의합니다.

**에이전트는 어떻게 작동하나요?**

에이전트는 *도구*(tools)를 통합하여 대규모 언어 모델(LLM)을 확장합니다. 도구는 추가 컨텍스트를 제공하고 자율적인 작업 실행을 가능하게 하는 함수입니다.
이러한 통합은 에이전트를 단독 LLM보다 더 전문화되고 강력하게 만듭니다.

일반 LLM은 일반적인 쿼리와 작업에 대해 적절하지만 수동적인 응답을 생성하는 반면, 에이전트는 통합된 컨텍스트와 도구를 활용하여 더 관련성 높은 응답을 제공하고 심지어 실제 행동을 취할 수도 있습니다.
예를 들어, 회사의 문서, 저장소, 기타 리소스에 접근하여 특정 제품, 고객, 코드에 대한 지식이 필요한 작업에서 팀을 지원하는 에이전트를 만들 수 있습니다.

에이전트는 LLM을 추론 엔진으로 사용하여 입력을 처리하고, 쿼리를 해결하기 위해 어떤 행동을 취할지 결정한 다음, 응답을 생성합니다.
이 응답은 일반적인 텍스트 기반 LLM 응답일 수도 있고, 파일 편집, 스크립트 실행, 외부 API 호출과 같은 행동을 포함할 수도 있습니다.

에이전트 맥락에서 도구는 에이전트가 작업을 수행하거나 외부 리소스에 접근하기 위해 실행할 수 있는 함수입니다.
함수는 에이전트가 이해하는 공통 인터페이스를 가진 `Tool` 객체로 래핑됩니다.
에이전트는 도구 등록을 통해 도구를 인식하게 되는데, 이는 일반적으로 에이전트 초기화 시점에 사용 가능한 도구 목록이 제공되는 과정입니다.
`Tool` 객체의 설명은 해당 도구가 무엇을 할 수 있는지 에이전트에게 알려주어, 주어진 요청에 그 도구가 적합한지 판단할 수 있게 합니다.

## 에이전트 플로우 예시[​](#examples-of-agent-flows "Direct link to Examples of agent flows")

**Agent** 컴포넌트를 사용하는 플로우 예시는 다음을 참조하세요.

- [Langflow 퀵스타트](https://docs.langflow.org/get-started-quickstart): **Simple Agent** 템플릿으로 시작하여 도구를 수정한 다음, 애플리케이션에서 에이전트 플로우를 사용하는 방법을 배웁니다.

    **Simple Agent** 템플릿은 다른 두 개의 Langflow 컴포넌트를 도구로 사용할 수 있는 **Agent** 컴포넌트를 포함한 기본 에이전트 플로우를 만듭니다.
**Agent** 컴포넌트 설정에 지정된 LLM은 응답을 생성할 때 자체 내장 기능뿐만 아니라 연결된 도구가 제공하는 기능도 사용할 수 있습니다.

- [에이전트를 도구로 사용하기](https://docs.langflow.org/agents-tools#use-an-agent-as-a-tool): 멀티 에이전트 플로우를 만듭니다.

- [Langflow를 MCP 클라이언트로 사용하기](https://docs.langflow.org/mcp-client) 및 [Langflow를 MCP 서버로 사용하기](https://docs.langflow.org/mcp-server): **Agent**와 [**MCP Tools** 컴포넌트](https://docs.langflow.org/mcp-tools)를 사용해 플로우에서 Model Context Protocol(MCP)을 구현합니다.

## Agent 컴포넌트[​](#agent-component "Direct link to Agent component")

**Agent** 컴포넌트는 에이전트 플로우에서 주요 에이전트 액터입니다.
이 컴포넌트는 LLM 통합을 사용하여 채팅 메시지나 파일 업로드와 같은 입력에 응답합니다.

에이전트는 기본 LLM에서 이미 사용 가능한 도구뿐만 아니라, **Agent** 컴포넌트의 **Tools** 포트에 연결한 추가 도구도 사용할 수 있습니다.
다른 **Agent** 컴포넌트나 [**MCP Tools** 컴포넌트](https://docs.langflow.org/mcp-tools)를 통한 MCP 서버를 포함하여, 어떤 Langflow 컴포넌트든 도구로 연결할 수 있습니다.

이 컴포넌트 사용에 대한 자세한 내용은 [Langflow 에이전트 사용하기](https://docs.langflow.org/agents)를 참조하세요.

## 참고 자료[​](#see-also "Direct link to See also")

- [**MCP Tools** 컴포넌트](https://docs.langflow.org/mcp-tools)
- [**Message History** 컴포넌트](https://docs.langflow.org/message-history)
- [채팅 메모리 저장하기](https://docs.langflow.org/memory#store-chat-memory)
- [Bundles](https://docs.langflow.org/components-bundle-components)
- [레거시 LangChain 컴포넌트](https://docs.langflow.org/bundles-langchain#legacy-langchain-components)
