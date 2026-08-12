# 번들 소개

> 원문: https://docs.langflow.org/next/components-bundle-components

번들에는 Langflow와 특정 서드파티 통합을 지원하는 커스텀 컴포넌트가 포함되어 있습니다.
Langflow의 코어 컴포넌트와 동일한 방식으로 플로우에 추가하고 구성할 수 있습니다.

번들을 탐색하려면 시각적 편집기에서 **Bundles**를 클릭하세요.

## 번들 유지 관리 및 문서[​](#bundle-maintenance-and-documentation "Bundle maintenance and documentation 항목으로 바로 가기")

많은 번들 컴포넌트는 Langflow 코드베이스에 기여하는 서드파티 기여자들이 개발합니다.

일부 제공자는 번들과 함께 문서를 기여하는 반면, 다른 제공자는 자체 문서에 번들을 문서화합니다.
문서가 전혀 없는 번들도 있습니다.

특정 번들 컴포넌트의 문서를 찾으려면 Langflow 문서와 해당 제공자의 문서를 확인하세요.
가능하다면 컴포넌트 자체를 통해 API 엔드포인트와 같은 관련 문서 링크도 찾을 수 있습니다.

1. 컴포넌트를 클릭하여 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-menus)을 표시합니다.
2. **More**를 클릭합니다.
3. **Docs**를 선택합니다.

Langflow 문서는 플로우 내에서 번들을 사용하는 데 초점을 맞춥니다.
그렇기 때문에 번들 컴포넌트에 대한 Langflow 특유의 구성 단계에 중점을 둡니다.
제공자별 기능이나 API에 대한 정보는 해당 제공자의 문서를 참고하세요.

## 컴포넌트 파라미터[​](#component-parameters "Component parameters 항목으로 바로 가기")

일부 파라미터는 시각적 편집기에서 기본적으로 숨겨져 있습니다.
컴포넌트를 선택했을 때 표시되는 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-inspection-panel)을 통해 모든 컴포넌트 파라미터를 수정할 수 있습니다.

## 코어 컴포넌트와 번들[​](#core-components-and-bundles "Core components and bundles 항목으로 바로 가기")

tip

Langflow 문서에는 모든 번들이나 번들 내 모든 컴포넌트가 나열되어 있지 않습니다.
사용 중인 Langflow 버전에 대한 가장 정확하고 최신의 번들 및 컴포넌트 목록을 확인하려면 시각적 편집기에서 **Bundles**를 확인하세요.

이전 버전의 Langflow에서 사용했던 컴포넌트를 찾을 수 없다면, 제거되었거나 [레거시 컴포넌트](#legacy-bundles)로 표시되었을 수 있습니다.

Langflow는 서드파티 제공자 전용 번들 외에도 범용 **코어 컴포넌트**를 제공합니다.

특정 서비스나 통합을 찾고 있다면, 시각적 편집기에서 컴포넌트를 **검색**할 수 있습니다.

이 방법들이 모두 실패하면, 언제든지 자신만의 [커스텀 컴포넌트](https://docs.langflow.org/components-custom-components)를 만들 수 있습니다.

## 레거시 번들[​](#legacy-bundles "Legacy bundles 항목으로 바로 가기")

레거시 컴포넌트는 더 이상 지원되지 않으며 향후 릴리스에서 제거될 수 있습니다.
기존 플로우에서는 계속 사용할 수 있지만, 가능한 한 빨리 지원되는 컴포넌트로 교체하는 것을 권장합니다.
권장 대체 컴포넌트는 플로우 내 컴포넌트의 **Legacy** 배너에 표시됩니다.
또한 릴리스 노트와 Langflow 문서에서도 가능한 한 안내됩니다.

레거시 컴포넌트를 어떻게 대체해야 할지 모르는 경우, 제공자, 서비스, 또는 컴포넌트 이름으로 컴포넌트를 **검색**해 보세요.
해당 컴포넌트는 완전히 새로운 컴포넌트, 유사한 컴포넌트, 또는 다른 카테고리의 동일 컴포넌트의 새 버전으로 대체되었을 수 있습니다.

명확한 대체 컴포넌트가 없다면, 다른 컴포넌트를 사용 사례에 맞게 조정할 수 있는지 고려해 보세요.
예를 들어 많은 **코어 컴포넌트**는 [**API Request** 컴포넌트](https://docs.langflow.org/api-request)처럼 여러 제공자와 사용 사례를 지원하는 범용 기능을 제공합니다.

이 두 옵션 모두 적합하지 않다면, 레거시 컴포넌트의 코드를 사용하여 자체 커스텀 컴포넌트를 만들거나 해당 레거시 컴포넌트에 대해 [토론을 시작](https://docs.langflow.org/contributing-github-issues)할 수 있습니다.

새 플로우에서 레거시 컴포넌트 사용을 지양하도록 하기 위해, 이러한 컴포넌트는 기본적으로 숨겨져 있습니다.
시각적 편집기에서 **Component settings**를 클릭하여 **Legacy** 필터를 전환할 수 있습니다.

다음 번들에는 레거시 컴포넌트만 포함되어 있습니다.

### CrewAI 번들[​](#crewai-bundle "CrewAI bundle 항목으로 바로 가기")

다음 레거시 CrewAI 컴포넌트를 [**Agent** 컴포넌트](https://docs.langflow.org/components-agents)와 같은 다른 에이전틱 컴포넌트로 교체하세요.

**CrewAI Agent**

이 컴포넌트는 CrewAI 에이전트를 나타내며, 크루 내에서 정의된 역할, 목표, 능력을 가진 전문화된 AI 에이전트를 만들 수 있게 합니다.
자세한 내용은 [CrewAI 에이전트 문서](https://docs.crewai.com/core-concepts/Agents/)를 참고하세요.

이 컴포넌트는 다음 파라미터를 사용합니다.

| Name                   | Display Name         | Info                                                                                             |
| ---------------------- | -------------------- | ------------------------------------------------------------------------------------------------ |
| role                   | Role                 | 입력 파라미터. 에이전트의 역할입니다.                                                          |
| goal                   | Goal                 | 입력 파라미터. 에이전트의 목표입니다.                                                     |
| backstory              | Backstory            | 입력 파라미터. 에이전트의 배경 서사입니다.                                                     |
| tools                  | Tools                | 입력 파라미터. 에이전트가 사용할 수 있는 도구입니다.                                              |
| llm                    | Language Model       | 입력 파라미터. 에이전트를 실행하는 언어 모델입니다.                                         |
| memory                 | Memory               | 입력 파라미터. 에이전트에 메모리를 부여할지 여부를 결정합니다.                                    |
| verbose                | Verbose              | 입력 파라미터. 상세 출력을 활성화합니다.                                                    |
| allow_delegation      | Allow Delegation     | 입력 파라미터. 에이전트가 다른 에이전트에게 작업을 위임할 수 있는지 결정합니다. |
| allow_code_execution | Allow Code Execution | 입력 파라미터. 에이전트가 코드를 실행할 수 있는지 결정합니다.                   |
| kwargs                 | kwargs               | 입력 파라미터. 에이전트를 위한 추가 키워드 인수입니다.                                     |
| output                 | Agent                | 출력 파라미터. 생성된 CrewAI Agent 객체입니다.                                           |

**CrewAI Hierarchical Crew, CrewAI Hierarchical Task**

**CrewAI Hierarchical Crew** 컴포넌트는 에이전트 그룹을 나타내며 계층 구조 안에서 협업 방식과 수행할 작업을 관리합니다. 이 컴포넌트를 사용하면 작업 실행을 감독하는 관리자를 포함한 크루를 만들 수 있습니다.
자세한 내용은 [CrewAI 계층형 크루 문서](https://docs.crewai.com/how-to/Hierarchical/)를 참고하세요.

다음 파라미터를 사용합니다.

| Name                   | Display Name         | Info                                                                                         |
| ---------------------- | -------------------- | -------------------------------------------------------------------------------------------- |
| agents                 | Agents               | 입력 파라미터. 크루 구성원을 나타내는 Agent 객체 목록입니다.                    |
| tasks                  | Tasks                | 입력 파라미터. 실행할 작업을 나타내는 HierarchicalTask 객체 목록입니다. |
| manager_llm           | Manager LLM          | 입력 파라미터. 관리자 에이전트를 위한 언어 모델입니다.                                   |
| manager_agent         | Manager Agent        | 입력 파라미터. 관리자 역할을 수행할 특정 에이전트입니다.                                   |
| verbose                | Verbose              | 입력 파라미터. 상세한 로깅을 위한 상세 출력을 활성화합니다.                           |
| memory                 | Memory               | 입력 파라미터. 크루의 메모리 구성입니다.                                      |
| use_cache             | Use Cache            | 입력 파라미터. 결과 캐싱을 활성화합니다.                                            |
| max_rpm               | Max RPM              | 입력 파라미터. 분당 최대 요청 수를 설정합니다.                                  |
| share_crew            | Share Crew           | 입력 파라미터. 크루 정보를 에이전트 간에 공유할지 결정합니다.             |
| function_calling_llm | Function Calling LLM | 입력 파라미터. 함수 호출을 위한 언어 모델입니다.                                    |
| crew                   | Crew                 | 출력 파라미터. 계층형 작업 실행을 지원하는 생성된 Crew 객체입니다.              |

**CrewAI Sequential Crew, CrewAI Sequential Task**

**CrewAI Sequential Crew** 컴포넌트는 순차적으로 실행되는 작업을 가진 에이전트 그룹을 나타냅니다. 이 컴포넌트를 사용하면 특정 순서대로 작업을 수행하는 크루를 만들 수 있습니다.
자세한 내용은 [CrewAI 순차형 크루 문서](https://docs.crewai.com/how-to/Sequential/)를 참고하세요.

다음 파라미터를 사용합니다.

| Name                   | Display Name         | Info                                                                                       |
| ---------------------- | -------------------- | ------------------------------------------------------------------------------------------ |
| tasks                  | Tasks                | 입력 파라미터. 실행할 작업을 나타내는 SequentialTask 객체 목록입니다. |
| verbose                | Verbose              | 입력 파라미터. 상세한 로깅을 위한 상세 출력을 활성화합니다.                         |
| memory                 | Memory               | 입력 파라미터. 크루의 메모리 구성입니다.                                    |
| use_cache             | Use Cache            | 입력 파라미터. 결과 캐싱을 활성화합니다.                                          |
| max_rpm               | Max RPM              | 입력 파라미터. 분당 최대 요청 수를 설정합니다.                                |
| share_crew            | Share Crew           | 입력 파라미터. 크루 정보를 에이전트 간에 공유할지 결정합니다.           |
| function_calling_llm | Function Calling LLM | 입력 파라미터. 함수 호출을 위한 언어 모델입니다.                                  |
| crew                   | Crew                 | 출력 파라미터. 순차형 작업 실행을 지원하는 생성된 Crew 객체입니다.              |

**CrewAI Sequential Task Agent**

이 컴포넌트는 CrewAI Task와 그에 연관된 에이전트를 생성하여, 특정 역할과 능력을 가진 에이전트로 순차적 작업을 정의할 수 있게 합니다.
자세한 내용은 [CrewAI 순차형 에이전트 문서](https://docs.crewai.com/how-to/Sequential/)를 참고하세요.

다음 파라미터를 사용합니다.

| Name                   | Display Name         | Info                                                                                             |
| ---------------------- | -------------------- | ------------------------------------------------------------------------------------------------ |
| role                   | Role                 | 입력 파라미터. 에이전트의 역할입니다.                                                          |
| goal                   | Goal                 | 입력 파라미터. 에이전트의 목표입니다.                                                     |
| backstory              | Backstory            | 입력 파라미터. 에이전트의 배경 서사입니다.                                                     |
| tools                  | Tools                | 입력 파라미터. 에이전트가 사용할 수 있는 도구입니다.                                              |
| llm                    | Language Model       | 입력 파라미터. 에이전트를 실행하는 언어 모델입니다.                                         |
| memory                 | Memory               | 입력 파라미터. 에이전트에 메모리를 부여할지 여부를 결정합니다.                                    |
| verbose                | Verbose              | 입력 파라미터. 상세 출력을 활성화합니다.                                                    |
| allow_delegation      | Allow Delegation     | 입력 파라미터. 에이전트가 다른 에이전트에게 작업을 위임할 수 있는지 결정합니다. |
| allow_code_execution | Allow Code Execution | 입력 파라미터. 에이전트가 코드를 실행할 수 있는지 결정합니다.                   |
| agent_kwargs          | Agent kwargs         | 입력 파라미터. 에이전트를 위한 추가 kwargs입니다.                                            |
| task_description      | Task Description     | 입력 파라미터. 작업의 목적과 실행 방식을 설명하는 텍스트입니다.                |
| expected_output       | Expected Task Output | 입력 파라미터. 예상되는 작업 결과에 대한 명확한 정의입니다.                              |
| async_execution       | Async Execution      | 입력 파라미터. 비동기 작업 실행 여부를 나타내는 불리언 플래그입니다.                            |
| previous_task         | Previous Task        | 입력 파라미터. 체이닝을 위한 시퀀스 내 이전 작업입니다.                                 |
| task_output           | Sequential Task      | 출력 파라미터. 생성된 작업을 나타내는 SequentialTask 객체 목록입니다.             |

### Embeddings 번들[​](#embeddings-bundle "Embeddings bundle 항목으로 바로 가기")

- **Embedding Similarity**: 벡터 스토어 컴포넌트에 내장된 유사도 검색 기능으로 대체되었습니다.
- **Text Embedder**: 임베딩 모델 컴포넌트로 대체되었습니다.

### Vector Stores 번들[​](#vector-stores-bundle "Vector Stores bundle 항목으로 바로 가기")

이 번들에는 레거시 **Local DB** 컴포넌트만 포함되어 있습니다.
다른 모든 벡터 스토어 컴포넌트는 [**DataStax** 번들](https://docs.langflow.org/bundles-datastax)과 같이 각 제공자별 번들에서 찾을 수 있습니다.

**Local DB**

**Local DB** 컴포넌트는 **Chroma DB** 벡터 스토어 컴포넌트(**Chroma** 번들 내)나 다른 벡터 스토어 컴포넌트로 교체하세요.

**Local DB** 컴포넌트는 Langflow와 함께 사용하기 위한 영구적인 인메모리 Chroma DB 인스턴스에서 읽고 씁니다.
읽기와 쓰기를 위한 별도의 모드, 자동 컬렉션 관리, Langflow 캐시 디렉터리 내 기본 영속성을 제공합니다.

**Mode** 파라미터를 컴포넌트가 수행할 작업에 맞게 설정한 다음, 다른 파라미터도 그에 맞게 구성하세요.
일부 파라미터는 한 모드에서만 사용할 수 있습니다.

- Ingest
- Retrieve

로컬 Chroma 벡터 스토어를 생성하거나 쓰려면 **Ingest** 모드를 사용하세요.

**Ingest** 모드에서는 다음 파라미터를 사용할 수 있습니다.

| Name                                          | Type          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name Your Collection** (`collection_​name`) | String        | 입력 파라미터. Chroma 벡터 스토어 컬렉션의 이름입니다. 기본값: `langflow`. **Ingest** 모드에서만 사용할 수 있습니다.                                                                                                                                                                                                                                                                                                                                                 |
| **Persist Directory** (`persist_​directory`)  | String        | 입력 파라미터. 벡터 스토어를 생성하고 영속화할 기본 디렉터리입니다. 여러 플로우에서 또는 여러 컬렉션을 만들기 위해 **Local DB** 컴포넌트를 사용하는 경우, 컬렉션은 `$PERSISTENT_​DIRECTORY/vector_​stores/$COLLECTION_​NAME`에 저장됩니다. 지정하지 않으면 기본 위치는 Langflow 구성 디렉터리입니다. 자세한 내용은 [메모리 관리 옵션](https://docs.langflow.org/memory)을 참고하세요.                                |
| **Embedding** (`embedding`)                   | Embeddings    | 입력 파라미터. 벡터 스토어에 사용할 임베딩 함수입니다.                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Allow Duplicates** (`allow_​duplicates`)    | Boolean       | 입력 파라미터. `true`(기본값)이면 쓰기 작업이 컬렉션 내 기존 중복 항목을 확인하지 않아, 동일한 콘텐츠의 여러 사본을 저장할 수 있습니다. `false`이면 이미 존재하는 문서와 일치하는 문서는 추가되지 않습니다. `false`인 경우, 전체 컬렉션을 검색하거나 `limit`에 지정된 레코드 수만 검색하여 중복 제거를 엄격하게 적용할 수 있습니다. **Ingest** 모드에서만 사용할 수 있습니다. |
| **Ingest Data** (`ingest_​data`)              | JSON or Table | 입력 파라미터. 컬렉션에 쓸 레코드입니다. 레코드는 임베딩되어 시맨틱 검색을 위해 인덱싱됩니다. **Ingest** 모드에서만 사용할 수 있습니다.                                                                                                                                                                                                                                                                                                                          |
| **Limit** (`limit`)                           | Integer       | 입력 파라미터. **Allow Duplicates**가 `false`일 때 비교할 레코드 수를 제한합니다. 대규모 컬렉션에 쓸 때 성능을 개선하는 데 도움이 될 수 있지만, 일부 중복 레코드가 발생할 수 있습니다. **Ingest** 모드에서만 사용할 수 있습니다.                                                                                                                                                                                                                                         |

### Zep 번들[​](#zep-bundle "Zep bundle 항목으로 바로 가기")

**Zep Chat Memory**

**Zep Chat Memory** 컴포넌트는 레거시 컴포넌트입니다.
이 컴포넌트는 [**Message History** 컴포넌트](https://docs.langflow.org/message-history)로 교체하세요.

이 컴포넌트는 `ZepChatMessageHistory` 인스턴스를 생성하여, LLM용 메모리 서버인 Zep을 사용한 채팅 메시지의 저장과 검색을 가능하게 합니다.

다음 파라미터를 사용합니다.

| Name             | Type                   | Description                                                                |
| ---------------- | ---------------------- | -------------------------------------------------------------------------- |
| url              | MessageText            | 입력 파라미터. Zep 인스턴스의 URL입니다. 필수입니다.                    |
| api_key         | SecretString           | 입력 파라미터. Zep 인스턴스 인증을 위한 API 키입니다.     |
| api_base_path  | Dropdown               | 입력 파라미터. 사용할 API 버전입니다. api/v1 또는 api/v2 중 선택할 수 있습니다. |
| session_id      | MessageText            | 입력 파라미터. 채팅 세션을 식별하는 고유 식별자입니다. 선택 사항입니다.     |
| message_history | BaseChatMessageHistory | 출력 파라미터. 해당 세션의 ZepChatMessageHistory 인스턴스입니다.    |

## 참고 자료[​](#see-also "See also 항목으로 바로 가기")

- [LangWatch 관측 및 평가](https://docs.langflow.org/integrations-langwatch)
