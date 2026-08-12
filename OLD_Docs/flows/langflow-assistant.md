# Langflow Assistant로 플로우 및 컴포넌트 빌드

**Langflow Assistant**는 캔버스 툴바에서 접근할 수 있는 앱 내 가상 어시스턴트 패인입니다.

애플리케이션에 대한 질문에 답하고 Langflow를 최대한 활용할 수 있도록 도와줍니다.

**Langflow Assistant**는 Langflow 그래프의 구조를 이해하므로 자연어 프롬프트에서 완전한 플로우를 빌드하거나 개별 컴포넌트를 만들 수 있습니다.

내부적으로 **Langflow Assistant**는 메시지를 보낼 때마다 Langflow 서버에서 내장된 Langflow 플로우를 실행합니다. 이 플로우는 캔버스에서 열린 플로우와 구별되며 자체 언어 모델을 가집니다. **Langflow Assistant**의 언어 모델은 컨텍스트로 워크스페이스에서 현재 열린 플로우만 가집니다. 다른 플로우에 대한 컨텍스트를 제공하려면 워크스페이스에서 해당 플로우로 전환하고 **Langflow Assistant**를 여세요.

---

## 사전 요구사항

- **Langflow Assistant**가 사용할 LLM 공급자를 [글로벌 모델 공급자 페이지](../components-reference/components-overview.md)에 연결
- 커스텀 컴포넌트 생성이 사용자 역할에 대해 활성화되고 허용되어야 합니다:
  - `LANGFLOW_ALLOW_CUSTOM_COMPONENTS`가 `true`여야 합니다 (기본값).
  - 슈퍼유저가 아닌 사용자의 경우 `LANGFLOW_CUSTOM_COMPONENT_ADMIN_ONLY`가 `false`여야 합니다 (기본값).

---

## Langflow Assistant로 커스텀 컴포넌트 만들기

이 예제에서는 URL 목록을 검증하고 정규화하는 커스텀 컴포넌트를 만들도록 **Langflow Assistant**에게 프롬프트를 제공한 다음, **플레이그라운드**의 결과를 기반으로 코드를 반복합니다.

1. 캔버스 툴바에서 **Langflow** 아이콘을 클릭합니다. **Langflow Assistant** 패인이 열립니다.

2. (선택 사항) `What can you help me with?`라고 물어 **Langflow Assistant**의 기능 목록을 확인합니다.

3. **Langflow Assistant**에게 커스텀 컴포넌트를 생성하도록 프롬프트를 제공합니다:

```
Create a custom component URLTitleExtractor with:
input: text
output: list of {url, title, status}
timeout handling + per-URL error handling
clean docstring and typed methods.
```

4. **Langflow Assistant**가 프롬프트에서 컴포넌트 코드를 생성합니다. 생성은 모델 기반이므로 코드는 예제와 다를 수 있습니다.

코드를 검사하려면 **View Code**를 클릭합니다. 컴포넌트를 캔버스에 추가하려면 **Add to Canvas**를 클릭합니다.

5. 컴포넌트를 **Chat Input** 및 **Chat Output** 컴포넌트에 연결합니다. 이 시점에서 플로우에는 세 개의 연결된 컴포넌트가 있습니다:
   - **Chat Input**: URL이 포함된 텍스트를 **URLTitleExtractor**로 전송합니다.
   - **URLTitleExtractor**: 텍스트를 읽고, URL을 찾고, 각 페이지를 가져와서 `url`, `title`, `status` 열이 있는 테이블을 출력합니다.
   - **Chat Output**: **URLTitleExtractor**의 결과를 받아 사용자 또는 호출 애플리케이션에 테이블을 다시 표시합니다.

6. **플레이그라운드**를 열고 Langflow에게 URL 목록을 확인하도록 알립니다:

```
Check these links: https://langflow.org
https://github.com/langflow-ai/langflow
https://python.org
https://this-domain-should-not-resolve-12345.invalid
```

7. 플로우를 실행합니다. 출력은 URL당 하나의 행, 페이지 제목과 상태 코드가 있는 테이블과 유사합니다.

| url | title | status |
|-----|-------|--------|
| https://langflow.org | Langflow \| Low-code AI builder | 200 |
| https://github.com/langflow-ai/langflow | GitHub - langflow-ai/langflow | 200 |
| https://python.org | Welcome to Python.org | 200 |
| https://this-domain-should-not-resolve-12345.invalid | | |

8. 더 반복하려면 **Langflow Assistant**에게 원하는 것을 말하세요. 예를 들어, `Update URLTitleExtractor to add max_urls (default 5) and skip duplicates.`라고 프롬프트를 제공합니다.

---

## Langflow Assistant로 에이전트 플로우 빌드

> **경고**: 플로우 빌드는 매 턴마다 전체 Langflow 그래프를 읽고 쓰므로 단일 컴포넌트 생성보다 훨씬 더 많은 토큰을 사용할 수 있습니다.

개별 컴포넌트 생성 외에도 **Langflow Assistant**는 단일 프롬프트에서 플로우를 만들 수 있습니다.

**URLTitleExtractor** 커스텀 컴포넌트를 도구로 사용하는 간단한 에이전트 플로우를 만들도록 **Langflow Assistant**에게 요청합니다:

1. 캔버스에 **URLTitleExtractor** 컴포넌트가 있는 상태에서 **Langflow Assistant**를 열고 에이전트 플로우를 빌드하도록 프롬프트를 제공합니다:

```
Build a simple agent flow using the URLTitleExtractor custom component as a tool.
```

2. Langflow Assistant가 제안하는 플로우 다이어그램을 보여줍니다. 승인하려면 **Add to Canvas**를 클릭합니다.

**Langflow Assistant**는 **Agent** 컴포넌트를 추가하고, **URLTitleExtractor**를 **Tools** 입력에 연결하며, 플로우를 완성하기 위해 **Chat Input**과 **Chat Output**을 연결합니다.

3. 변경 사항을 설명하여 반복하고, **Replace canvas**를 클릭하여 현재 캔버스의 전체 플로우를 교체합니다.

4. **플레이그라운드**를 열고 에이전트에게 URL을 확인하도록 요청합니다:

```
What is the title of the page at https://langflow.org?
```

에이전트는 **URLTitleExtractor** 도구를 사용하여 페이지를 가져오고 제목을 반환합니다.

5. **Langflow Assistant**는 플로우를 더 반복하거나 Langflow에 대한 질문에 답할 수 있습니다. 예를 들어 `How do I send an API request to chat with this flow in Python?`이라고 물어보면 Langflow 문서에서 출처한 요청이 포함된 응답을 받을 수 있습니다.

---

## 프롬프트에서 캔버스 컴포넌트 참조

**Langflow Assistant** 프롬프트에서 `@` 및 `.` 선택기를 사용하여 컴포넌트와 해당 필드를 직접 참조할 수 있습니다.

**Langflow Assistant** 프롬프트 입력에서 `@`를 입력하여 사용 가능한 모든 컴포넌트를 나열하고 컴포넌트를 선택하여 참조를 삽입합니다. 컴포넌트 내의 특정 필드를 선택하려면 컴포넌트 다음에 `.`를 입력합니다.

예를 들어, Agent 컴포넌트의 시스템 프롬프트 필드를 업데이트하도록 **Langflow Assistant**에게 프롬프트를 제공하려면:

```
Update @Agent.System Prompt to always respond in bullet points.
```

---

## 참고 항목

- [플로우 빌드](./build-flows.md)
- [커스텀 컴포넌트](../components-reference/components-overview.md)
- [Langflow API로 플로우 트리거](./run-flows.md)

---

*원문: https://docs.langflow.org/next/langflow-assistant*
