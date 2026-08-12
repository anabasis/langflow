# 비주얼 에디터 사용

Langflow의 비주얼 에디터를 사용하여 애플리케이션 워크플로우의 기능적 표현인 플로우를 만들고, 테스트하고, 공유합니다.
플로우는 애플리케이션 워크플로우의 개별 단계를 나타내는 컴포넌트로 구성됩니다.

Langflow의 드래그 앤 드롭 인터페이스를 통해 광범위한 코드 작성 없이 복잡한 AI 워크플로우를 만들 수 있습니다.
프롬프트, 대형 언어 모델(LLM), 데이터 소스, 에이전트, MCP 서버 등 다양한 리소스를 연결할 수 있습니다.

> **팁**
>
> 몇 분 안에 플로우를 빌드하고 실행해보려면 [Langflow 빠른 시작](../get-started/quickstart.md)을 참조하세요.

---

## 워크스페이스

[플로우](./build-flows.md)를 빌드할 때 주로 워크스페이스에서 작업합니다.
여기서 [컴포넌트](../components-reference/components-overview.md)를 추가하고 구성하며 서로 연결합니다.

워크스페이스에서 [**플레이그라운드**](#플레이그라운드), [**Share** 메뉴](#share-메뉴), **Logs**에도 접근할 수 있습니다.

### 워크스페이스 제스처 및 상호작용

워크스페이스를 탐색하는 단축키, 제스처 및 기능:

- **가로/세로 이동(Pan)**: 워크스페이스의 빈 영역을 클릭하고 드래그합니다.
- **컴포넌트 재배치**: 워크스페이스의 어느 곳이든 컴포넌트를 클릭하고 드래그합니다.
- **확대/축소(Zoom)**: 마우스 또는 트랙패드에서 스크롤하거나 **Canvas controls**를 클릭하여 **Zoom In**, **Zoom Out**, **Zoom To 100%**, **Zoom To Fit** 옵션을 사용합니다.
- **노트 및 댓글 추가**: **Add Note**를 클릭합니다.
- **키보드 단축키**: **Help**를 클릭한 후 **Shortcuts**를 선택하여 사용 가능한 단축키를 확인합니다.

---

## 플레이그라운드

플로우에 **Chat Input** 컴포넌트가 있는 경우 **플레이그라운드**를 사용하여 플로우를 실행하고, 플로우와 채팅하고, 입력 및 출력을 확인하고, LLM의 메모리를 수정하여 실시간으로 플로우 응답을 조정할 수 있습니다.

**Simple Agent** 템플릿을 기반으로 플로우를 만든 후 워크스페이스에서 플로우를 편집할 때 **Playground**를 클릭하여 직접 시도해보세요.

플로우에 **Agent** 컴포넌트가 있는 경우 **플레이그라운드**는 해당 도구 호출과 출력을 표시하여 에이전트의 도구 사용을 모니터링하고 응답의 근거를 이해할 수 있게 합니다.

자세한 내용은 [플레이그라운드에서 플로우 테스트](./test-flows.md)를 참조하세요.

---

## Share 메뉴

**Share** 메뉴는 플로우를 외부 애플리케이션에 통합하기 위한 다음 옵션을 제공합니다:

- [**API access**](./run-flows.md): 자동 생성된 Python, JavaScript, curl 코드 스니펫으로 플로우를 애플리케이션에 통합합니다.
- [**Export**](./import-export-flows.md): 플로우를 JSON 파일로 로컬 머신에 내보냅니다.
- [**MCP Server**](../mcp/mcp-server.md): 플로우를 MCP 호환 클라이언트의 도구로 노출합니다.
- [**Embed into site**](./run-flows.md): HTML, React, 또는 Angular 애플리케이션에 플로우를 임베드합니다.
- [**Shareable Playground**](./test-flows.md): **플레이그라운드** 인터페이스를 다른 사용자와 공유합니다.

  > **참고**: 이 기능은 **플레이그라운드** 경험을 공유하기 위한 것으로, 프로덕션 애플리케이션에서 플로우를 실행하기 위한 것이 아닙니다. **Shareable Playground**는 Langflow Desktop에서 사용할 수 없습니다.

---

## 참고 항목

- [Langflow에서 파일 관리](../develop/storage-and-memory.md)
- [전역 변수](../develop/global-variables.md)
- [API 키 및 인증](../develop/api-keys-and-authentication.md)

---

*원문: https://docs.langflow.org/next/concepts-overview*
