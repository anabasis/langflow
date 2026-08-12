# 시각적 편집기 사용하기
> 원문: https://docs.langflow.org/concepts-overview

Langflow의 시각적 편집기를 사용하면 애플리케이션 워크플로우를 기능적으로 표현한 flow를 생성, 테스트, 공유할 수 있습니다.
flow는 애플리케이션 워크플로우의 개별 단계를 나타내는 컴포넌트들로 구성됩니다.

Langflow의 드래그 앤 드롭 인터페이스를 사용하면 방대한 코드를 작성하지 않고도 복잡한 AI 워크플로우를 만들 수 있습니다.
프롬프트, 대규모 언어 모델(LLM), 데이터 소스, 에이전트, MCP 서버 및 기타 도구와 통합 기능 등 다양한 리소스를 연결할 수 있습니다.

팁

몇 분 안에 flow를 빌드하고 실행해보려면 [Langflow 퀵스타트](https://docs.langflow.org/get-started-quickstart)를 참고하세요.

## 워크스페이스[​](#workspace "Direct link to Workspace")

[flow](https://docs.langflow.org/concepts-flows)를 빌드할 때는 주로 워크스페이스를 사용하게 됩니다.
여기서 [컴포넌트](https://docs.langflow.org/concepts-components)를 추가하고, 구성하고, 서로 연결합니다.

![Empty Langflow workspace](https://docs.langflow.org/assets/images/workspace-8fb540f88e4f855d3af89ca3ab15f462.png)

워크스페이스에서는 [**Playground**](#playground), [**Share** 메뉴](#share-menu), [**Logs**](https://docs.langflow.org/logging)에도 접근할 수 있습니다.

### 워크스페이스 제스처와 상호작용[​](#workspace-gestures-and-interactions "Direct link to Workspace gestures and interactions")

다음 단축키, 제스처, 기능을 사용해 워크스페이스를 탐색할 수 있습니다.

- **수평/수직 이동**: 워크스페이스의 빈 영역을 클릭한 채로 드래그합니다.

- **컴포넌트 재배치**: 워크스페이스 어디로든 컴포넌트를 클릭한 채로 드래그합니다.

    컴포넌트 간의 프로그래밍적 관계를 변경하려면 컴포넌트의 *edge*(엣지) 또는 *port*(포트)를 조작해야 합니다. 자세한 내용은 [컴포넌트 개요](https://docs.langflow.org/concepts-components)를 참고하세요.

    가이드 라인을 활성화하려면 **Help**를 클릭한 후 **Enable smart guides**를 토글하세요.

    컴포넌트를 편집할 수 없다면 flow가 [잠금 해제](https://docs.langflow.org/concepts-flows#lock-a-flow) 상태인지 확인하세요.

- **확대/축소**: 마우스나 트랙패드로 스크롤하거나, 확대율 옆의 **Canvas controls**를 클릭해 **Zoom In**, **Zoom Out**, **Zoom To 100%**, **Zoom To Fit** 등의 옵션을 사용할 수 있습니다.

- **메모 및 코멘트 추가**: **Add Note**를 클릭합니다.

- **키보드 단축키**: 사용 가능한 단축키를 보려면 **Help**를 클릭한 후 **Shortcuts**를 선택하세요.

## Playground[​](#playground "Direct link to Playground")

flow에 **Chat Input** 컴포넌트가 있다면 **Playground**를 사용해 flow를 실행하고, flow와 채팅하고, 입력과 출력을 확인하고, LLM의 메모리를 수정해 실시간으로 flow의 응답을 조정할 수 있습니다.

직접 사용해보려면 **Simple Agent** 템플릿을 기반으로 flow를 만든 다음, 워크스페이스에서 flow를 편집하는 동안 **Playground**를 클릭하세요.

![Playground](https://docs.langflow.org/assets/images/playground-34f869f8763b3c69ddcd4d365c96d0e6.png)

flow에 **Agent** 컴포넌트가 있다면 **Playground**는 해당 컴포넌트의 도구 호출과 출력을 표시하므로 에이전트의 도구 사용을 모니터링하고 응답 뒤에 숨겨진 추론 과정을 이해할 수 있습니다.

![Playground with agent response](https://docs.langflow.org/assets/images/playground-with-agent-56fa39130f9a50d376ba5a226ae254f0.png)

자세한 내용은 [Playground에서 flow 테스트하기](https://docs.langflow.org/concepts-playground)를 참고하세요.

## Share[​](#share-menu "Direct link to Share")

**Share** 메뉴는 flow를 외부 애플리케이션에 통합하기 위한 다음과 같은 옵션을 제공합니다.

- [**API access**](https://docs.langflow.org/concepts-publish#api-access): 자동으로 생성된 Python, JavaScript, curl 코드 스니펫으로 flow를 애플리케이션에 통합합니다.

- [**Export**](https://docs.langflow.org/concepts-flows-import#export-a-flow): flow를 JSON 파일로 로컬 머신에 내보냅니다.

- [**MCP Server**](https://docs.langflow.org/mcp-server): flow를 MCP 호환 클라이언트를 위한 도구로 노출합니다.

- [**Embed into site**](https://docs.langflow.org/concepts-publish#embedded-chat-widget): HTML, React, Angular 애플리케이션에 flow를 임베드합니다.

- [**Shareable Playground**](https://docs.langflow.org/concepts-playground#share-a-flows-playground): 다른 사용자와 flow의 **Playground** 인터페이스를 공유합니다.

    이는 **Playground** 경험을 공유하기 위한 것이며, 프로덕션 애플리케이션에서 flow를 실행하기 위한 용도가 아닙니다.

    **Sharable Playground**는 Langflow Desktop에서는 사용할 수 없습니다.

## 참고 자료[​](#see-also "Direct link to See also")

- [Langflow에서 파일 관리하기](https://docs.langflow.org/concepts-file-management)
- [전역 변수](https://docs.langflow.org/configuration-global-variables)
- [API 키와 인증](https://docs.langflow.org/api-keys-and-authentication)
