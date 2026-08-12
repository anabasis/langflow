# Langflow 확장 개요

Langflow는 핵심 Langflow 서버와 별도로 유지 관리되고 출시되는 컴포넌트 번들을 **확장(Extensions)**으로 제공합니다. 모든 통합이 `langflow`에 내장되는 대신 각 번들은 `lfx-duckduckgo`나 `lfx-arxiv`와 같이 pip으로 설치 가능한 독립적인 패키지입니다.

`uv pip install langflow`를 실행하면 다음이 설치됩니다:
- 모든 Langflow 핵심 컴포넌트
- `langflow` 메타패키지의 의존성으로 포함된 모든 번들

---

## 현재 확장 번들

`uv pip install langflow`에 포함된 확장 번들:

| 패키지 | 번들 | 컴포넌트 |
|--------|------|----------|
| `lfx-arxiv` | arXiv | arXiv 검색 |
| `lfx-docling` | Docling | 문서 파싱 및 청킹 |
| `lfx-duckduckgo` | DuckDuckGo | 웹 검색 |
| `lfx-ibm` | IBM | IBM watsonx.ai LLM 및 임베딩, IBM Db2 Vector Store |

각 컴포넌트의 내부 식별자가 변경됩니다. 예를 들어 이전에 `DuckDuckGoSearchComponent` 클래스로 참조된 DuckDuckGo 컴포넌트는 이제 `ext:duckduckgo:DuckDuckGoSearchComponent@official`로 참조됩니다. Langflow는 저장된 플로우를 열 때 이러한 참조를 자동으로 재작성합니다.

---

## 업그레이드 후 컴포넌트가 없는 경우

플로우를 열었을 때 노드에 `component-not-found`와 같은 오류가 표시되면, 자동 마이그레이션이 컴포넌트 참조를 해결하지 못했음을 의미합니다. 이는 다음과 같은 경우에 발생할 수 있습니다:
- 컴포넌트가 속한 번들이 업그레이드된 환경에 설치되지 않은 경우
- 컴포넌트가 둘 이상의 번들에 나타나는 이름으로 참조된 경우

오류 메시지에는 예상되는 정식 ID를 명시한 힌트가 포함됩니다:

```
component-not-found-with-hint: DuckDuckGoSearchComponent not found.
Hint: try ext:duckduckgo:DuckDuckGoSearchComponent@official
```

힌트의 번들 이름(이 예에서는 `duckduckgo`)을 사용하여 올바른 확장 패키지를 찾아 설치한 다음 플로우를 다시 로드합니다.

---

## 번들 확장 설치

필요한 번들이 Langflow 환경에 포함되어 있지 않은 경우 pip으로 설치합니다:

```bash
uv pip install lfx-duckduckgo
uv run langflow run
```

Langflow는 서버 시작 시 패키지를 검색하고 컴포넌트를 팔레트에 자동으로 로드합니다. 추가 구성이 필요하지 않습니다.

현재 로드된 확장을 보려면:

```bash
lfx extension list
```

---

## 자신만의 확장 만들기

독립적으로 버전을 관리하고 배포하려는 커스텀 컴포넌트가 있는 경우 확장으로 패키징할 수 있습니다.

---

## 참고 항목

- 환경 변수: [환경 변수](./environment-variables.md)
- 커스텀 컴포넌트: [컴포넌트 참조](../components-reference/components-overview.md)

---

*원문: https://docs.langflow.org/next/extensions-overview*
