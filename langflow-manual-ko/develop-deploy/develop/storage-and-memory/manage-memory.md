# 메모리 관리 옵션

> 원문: https://docs.langflow.org/next/memory

Langflow는 플로우 및 Langflow 서버와 관련된 데이터를 저장하고 검색하기 위한 유연한 메모리 관리 옵션을 제공합니다.
여기에는 필수적인 Langflow 데이터베이스 테이블, 파일 관리, 캐싱뿐만 아니라 채팅 메모리도 포함됩니다.

## 스토리지 옵션과 경로[​](#storage-options-and-paths "Direct link to Storage options and paths")

Langflow는 로컬 메모리와 외부 메모리 옵션을 모두 지원합니다.

Langflow의 기본 스토리지 옵션은 [SQLite](https://www.sqlite.org/) 데이터베이스입니다.
기본 스토리지 경로는 운영체제와 설치 방법에 따라 다릅니다.

- **Langflow Desktop**:
  * **macOS**: `/Users/<username>/.langflow/data/database.db`
  * **Windows**: `C:\Users\<name>\AppData\Roaming\com.LangflowDesktop\data\database.db`
- **Langflow OSS**
  * **macOS/Windows/Linux/WSL(`uv pip install` 사용 시)**: `<path_to_venv>/lib/python3.12/site-packages/langflow/langflow.db` (Python 버전은 다를 수 있습니다. 데이터베이스는 venv 경로에 종속되어 있으므로 가상 환경 간에 공유되지 않습니다.)
  * **macOS/Windows/Linux/WSL(`git clone` 사용 시)**: `<path_to_clone>/src/backend/base/langflow/langflow.db`

Langflow는 기본 데이터베이스 경로에 대해 몇 가지 대안을 제공합니다.

- **구성 디렉터리**: [`LANGFLOW_CONFIG_DIR`](https://docs.langflow.org/logging)에 설정된 Langflow 구성 디렉터리에 데이터베이스를 저장하려면 `LANGFLOW_SAVE_DB_IN_CONFIG_DIR=True`로 설정하세요.

- **외부 PostgreSQL 데이터베이스**: 모든 Langflow 스토리지에 외부 PostgreSQL 데이터베이스를 사용할 수 있습니다.
자세한 내용은 [외부 메모리 구성](#configure-external-memory)을 참고하세요.

    외부 스토리지는 Langflow를 제거한 후에도 데이터를 보존하거나, 여러 가상 환경 간에 동일한 데이터베이스를 공유하고 싶을 때 유용합니다.

- **별도의 채팅 메모리**: 다른 Langflow 스토리지와 별개로 채팅 메모리에만 외부 스토리지를 선택적으로 사용할 수 있습니다.
자세한 내용은 [채팅 메모리 저장](#store-chat-memory)을 참고하세요.

- **데이터베이스 없음**: 모든 데이터베이스 작업을 비활성화하고 아무 작업도 하지 않는(no-op) 세션을 실행하려면 [Langflow 환경 변수](https://docs.langflow.org/environment-variables)에서 `LANGFLOW_USE_NOOP_DATABASE=True`로 설정하세요.
이는 데이터를 유지하고 싶지 않은 테스트 상황에서 유용합니다.

## Langflow 데이터베이스 테이블[​](#langflow-database-tables "Direct link to Langflow database tables")

다음 테이블은 `langflow.db`에 저장됩니다.

• **ApiKey**: Langflow API 인증 키를 관리합니다. 컴포넌트 API 키는 **Variables** 테이블에 저장됩니다. 자세한 내용은 [API 키와 인증](https://docs.langflow.org/api-keys-and-authentication)을 참고하세요.

• **Deployment**: 배포 이름, 프로바이더 리소스 키, 연관된 프로젝트 및 프로바이더 계정을 포함하여 외부 프로바이더로의 Langflow 플로우 배포를 추적합니다.

• **DeploymentProviderAccount**: 프로바이더 URL, 테넌트 설정, 암호화된 자격 증명 등 외부 배포 프로바이더에 대해 구성된 연결을 저장합니다.

• **File**: 파일 이름, 경로, 크기, 스토리지 프로바이더 등 Langflow 파일 관리 시스템에 업로드된 파일의 메타데이터를 저장합니다. 자세한 내용은 [파일 관리](https://docs.langflow.org/concepts-file-management)를 참고하세요.

• **Flow**: 노드, 엣지, 컴포넌트를 포함한 플로우 정의를 JSON 또는 데이터베이스 레코드로 저장합니다. 자세한 내용은 [플로우 빌드](https://docs.langflow.org/concepts-flows)를 참고하세요.

tip

플로우를 데이터베이스에 저장하기 전에 플로우 데이터에서 API 키와 토큰을 자동으로 제거하려면, [Langflow 환경 변수](https://docs.langflow.org/environment-variables)에서 `LANGFLOW_REMOVE_API_KEYS=True`로 설정하세요.
`true`로 설정하면, 비밀번호 필드로 표시된 필드 중 이름에 `api`, `key`, `token`이 *포함된* 필드는 플로우가 저장되기 전에 `null`로 설정됩니다.
이를 통해 자격 증명이 데이터베이스에 저장되는 것을 방지할 수 있습니다.

• **FlowVersion**: 플로우 정의의 번호가 매겨진 스냅샷을 저장하여 버전 기록을 가능하게 합니다. 각 행은 플로우에 연결되고 순차적인 버전 번호로 식별되는 완전한 플로우 데이터 스냅샷을 담고 있습니다. 자세한 내용은 [플로우 버전 저장 및 복원](https://docs.langflow.org/concepts-flows#save-and-restore-flow-versions)을 참고하세요.

• **FlowVersionDeploymentAttachment**: 특정 플로우 버전을 프로바이더 배포에 연결하여, 어떤 플로우 버전이 어디에 배포되었는지 및 해당 버전에 대한 프로바이더의 불투명(opaque) 스냅샷 식별자를 추적합니다.

• **Folder**: 단일 사용자 폴더와 여러 사용자가 액세스하는 공유 폴더를 포함하여 플로우 저장을 위한 구조를 제공합니다. 자세한 내용은 [프로젝트에서 플로우 관리](https://docs.langflow.org/concepts-flows#projects)를 참고하세요.

• **IngestionRun**: 각 수집 작업에 대해 집계 카운터(생성된 청크 수, 처리된 바이트 수, 성공/실패/건너뛴 파일 수)와 파일별 결과 세부 정보를 포함하여 지식 베이스 수집 실행 기록을 기록합니다. 자세한 내용은 [지식 베이스](https://docs.langflow.org/knowledge-base)를 참고하세요.

• **Job**: 플로우 워크플로우 실행 및 지식 베이스 수집을 포함한 비동기 작업을 위한 백그라운드 작업 큐입니다. 작업 유형(`workflow`, `ingestion`, `evaluation`), 상태(`queued`, `in_progress`, `completed`, `failed`), 타임스탬프, 작업별 진행 상태 메타데이터를 추적합니다.

• **KnowledgeBase**: 임베딩 모델, 청킹 설정, 백엔드 유형, 상태, 캐시된 통계(청크 수, 단어 수, 전체 크기)를 포함하여 지식 베이스 구성을 저장합니다. 자세한 내용은 [지식 베이스](https://docs.langflow.org/knowledge-base)를 참고하세요.

• **MemoryBase**: 연관된 지식 베이스 이름, 임베딩 모델, 자동 캡처 임계값, 선택적 전처리 설정을 포함하여 플로우의 메모리 베이스 구성을 저장합니다.

• **MemoryBasePreprocessingOutput**: 지식 베이스에 쓰기 작업이 이루어지기 전에 LLM이 정제한 전처리 결과를 캡처합니다. 각 행은 하나의 전처리 배치를 나타내며, 재개 가능한 2단계 커밋(LLM 호출 → 지식 베이스 쓰기)을 지원하기 위해 상태(`processed`, `ingested`, `skipped`)를 추적합니다.

• **MemoryBaseSession**: 동기화 커서 위치와 처리된 메시지의 총 개수를 포함하여 각 메모리 베이스의 세션별 상태를 추적합니다.

• **MemoryBaseWorkflowRun**: 임계값 기반 수집을 지원하기 위해 메모리 베이스와 세션별 워크플로우 작업 실행을 기록하며, 각 워크플로우 작업을 그 결과로 생성된 수집 작업에 연결합니다.

• **Message**: 컴포넌트 간에 발생하는 채팅 메시지와 상호작용을 저장합니다. 자세한 내용은 [Message 객체](https://docs.langflow.org/data-types#message)와 [채팅 메모리 저장](#store-chat-memory)을 참고하세요.

• **MessageIngestionRecord**: 어떤 메시지가 어떤 작업에 의해 메모리 베이스로 수집되었는지 기록합니다. 메시지와 메모리 베이스 사이의 조인 테이블 역할을 하며, 각 메시지가 다시 수집되지 않도록 보장합니다.

• **Trace**와 **Span**: 플로우와 컴포넌트의 트레이스 및 스팬을 저장합니다. 자세한 내용은 [트레이스](https://docs.langflow.org/traces)를 참고하세요.

• **Transactions**: 플로우 실행의 실행 기록과 결과를 기록합니다. 이 정보는 [로깅](https://docs.langflow.org/logging)에 사용됩니다.

• **User**: 자격 증명, 권한, 프로필, 사용자 관리 설정을 포함한 사용자 계정 정보를 저장합니다. 자세한 내용은 [API 키와 인증](https://docs.langflow.org/api-keys-and-authentication)을 참고하세요.

• **Variables**: 전역 암호화 값과 자격 증명을 저장합니다. 자세한 내용은 [전역 변수](https://docs.langflow.org/configuration-global-variables)와 [컴포넌트 API 키](https://docs.langflow.org/api-keys-and-authentication#component-api-keys)를 참고하세요.

• **VertexBuild**: 플로우 내 개별 노드의 빌드 상태를 추적합니다. 자세한 내용은 [Playground에서 플로우 테스트](https://docs.langflow.org/concepts-playground)를 참고하세요.

자세한 내용은 [소스 코드](https://github.com/langflow-ai/langflow/tree/main/src/backend/base/langflow/services/database/models)의 데이터베이스 모델을 참고하세요.

## 외부 메모리 구성[​](#configure-external-memory "Direct link to Configure external memory")

기본 Langflow SQLite 데이터베이스를 다른 데이터베이스로 교체하려면 `LANGFLOW_DATABASE_URL` 환경 변수를 데이터베이스 URL로 설정한 다음, `.env` 파일과 함께 Langflow를 시작하세요.
자세한 내용과 예제는 [외부 PostgreSQL 데이터베이스 구성](https://docs.langflow.org/configuration-custom-database)을 참고하세요.

```
LANGFLOW_DATABASE_URL=postgresql://user:password@localhost:5432/langflow
```

데이터베이스 연결 풀 및 타임아웃 설정을 세밀하게 조정하려면 다음 추가 환경 변수를 설정할 수 있습니다.

- `LANGFLOW_DATABASE_CONNECTION_RETRY`: Langflow 데이터베이스에 대한 연결이 끊어졌을 때 재시도할지 여부입니다. `true`로 설정하면 연결이 실패했을 때 Langflow가 데이터베이스에 다시 연결을 시도합니다. 기본값: `false`.

- `LANGFLOW_DB_CONNECT_TIMEOUT`: 잠금이 해제되기를 기다리거나 데이터베이스에 대한 연결을 설정하기까지 대기하는 시간(초)입니다. 이는 `LANGFLOW_DB_CONNECTION_SETTINGS`의 `pool_timeout`과 별개일 수 있습니다. 기본값: 30.

- `LANGFLOW_MIGRATION_LOCK_NAMESPACE`: 마이그레이션 중 PostgreSQL 어드바이저리 잠금을 위한 선택적 네임스페이스 식별자입니다. 제공하지 않으면 데이터베이스 URL의 해시 값이 사용됩니다. 여러 Langflow 인스턴스가 동일한 데이터베이스를 공유하며 조율된 마이그레이션 잠금이 필요할 때 유용합니다.

- `LANGFLOW_DB_CONNECTION_SETTINGS`: 다음 데이터베이스 연결 풀 설정을 포함하는 JSON 딕셔너리입니다.

  * `pool_size`: 연결 풀에서 유지할 기본 연결 수입니다. 기본값: 20.
  * `max_overflow`: 필요 시 `pool_size`를 초과하여 생성할 수 있는 최대 연결 수입니다. 기본값: 30.
  * `pool_timeout`: 풀에서 연결을 기다리다가 타임아웃되기까지의 시간(초)입니다. 기본값: 30.
  * `pool_pre_ping`: `true`로 설정하면 풀은 매 체크아웃 시 연결의 생존 여부를 테스트합니다. 기본값: `true`.
  * `pool_recycle`: 연결이 자동으로 재활용되기까지의 시간(초)입니다. 기본값: 1800(30분).
  * `echo`: `true`로 설정하면 디버깅 목적으로 SQL 쿼리가 로깅됩니다. 기본값: `false`.

    예시:

  ```
  LANGFLOW_DB_CONNECTION_SETTINGS='{"pool_size": 20, "max_overflow": 30, "pool_timeout": 30, "pool_pre_ping": true, "pool_recycle": 1800, "echo": false}'
  ```
    더 이상 사용되지 않는 환경 변수 `LANGFLOW_DB_POOL_SIZE` 또는 `LANGFLOW_DB_MAX_OVERFLOW`는 사용하지 마세요.
대신 `LANGFLOW_DB_CONNECTION_SETTINGS`의 `pool_size`와 `max_overflow`를 사용하세요.

- `LANGFLOW_MIGRATION_LOCK_NAMESPACE`: 데이터베이스 마이그레이션 중 사용되는 PostgreSQL 어드바이저리 잠금을 위한 선택적 네임스페이스입니다. 동일한 PostgreSQL 데이터베이스를 공유하는 여러 Langflow 인스턴스를 실행할 때 유용합니다. 각 인스턴스는 충돌을 피하기 위해 고유한 네임스페이스를 사용해야 합니다. 설정하지 않으면 Langflow는 기본 네임스페이스를 사용합니다. 이 설정은 PostgreSQL을 데이터베이스 백엔드로 사용할 때만 적용됩니다.

## 캐시 메모리 구성[​](#configure-cache-memory "Direct link to Configure cache memory")

기본 Langflow 캐싱 동작은 비동기식 인메모리 캐시입니다.

```
LANGFLOW_LANGCHAIN_CACHE=InMemoryCache

LANGFLOW_CACHE_TYPE=async
```

Langflow는 대부분의 사용 사례에 적합한 기본 비동기 인메모리 캐시만 공식적으로 지원합니다.
Redis와 같은 다른 캐시 옵션은 실험적이며 예고 없이 변경될 수 있습니다.
기본값이 아닌 캐시 설정을 사용하려면 다음 환경 변수를 사용할 수 있습니다.

| 변수 | 유형 | 기본값 | 설명 |
| -------------------------------- | ------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LANGFLOW_​CACHE_​TYPE`          | String  | `async`         | Langflow 내부 캐싱 시스템의 캐시 유형을 설정합니다. 가능한 값: `async`, `redis`, `memory`. 유형을 `redis`로 설정하는 경우 `LANGFLOW_​REDIS_​*` 환경 변수도 함께 설정해야 합니다. `disk` 백엔드는 1.10에서 제거되었습니다 — 인메모리는 `async`, 워커 간 공유는 `redis`로 전환하세요. |
| `LANGFLOW_​LANGCHAIN_​CACHE`     | String  | `InMemoryCache` | LangChain 캐싱 시스템(Langflow의 의존성)의 캐시 저장 유형을 `InMemoryCache` 또는 `SQLiteCache`로 설정합니다. |
| `LANGFLOW_​REDIS_​HOST`          | String  | `localhost`     | `LANGFLOW_​CACHE_​TYPE=redis`인 경우 Redis 서버 호스트명입니다. |
| `LANGFLOW_​REDIS_​PORT`          | Integer | `6379`          | `LANGFLOW_​CACHE_​TYPE=redis`인 경우 Redis 서버 포트입니다. |
| `LANGFLOW_​REDIS_​DB`            | Integer | `0`             | `LANGFLOW_​CACHE_​TYPE=redis`인 경우 Redis 데이터베이스 번호입니다. |
| `LANGFLOW_​REDIS_​CACHE_​EXPIRE` | Integer | `3600`          | `LANGFLOW_​CACHE_​TYPE=redis`인 경우 캐시 만료 시간(초)입니다. |
| `LANGFLOW_​REDIS_​PASSWORD`      | String  | 설정되지 않음         | `LANGFLOW_​CACHE_​TYPE=redis`인 경우 Redis 인증을 위한 선택적 비밀번호입니다. |

## 채팅 메모리 저장[​](#store-chat-memory "Direct link to Store chat memory")

**Chat Input** 또는 **Chat Output** 컴포넌트가 있는 채팅 기반 플로우는 Langflow의 `messages` 테이블에 저장되는 채팅 기록을 생성합니다.
이는 최소한 채팅 로그 역할을 하지만, LLM에 역사적 맥락을 제공하는 채팅 메모리와 기능적으로 동일하지는 않습니다.

플로우에서 채팅 메모리를 저장하고 검색하려면 **Message History** 컴포넌트나 **Agent** 컴포넌트에 내장된 채팅 메모리를 사용할 수 있습니다.

**채팅 메모리는 어떻게 작동하나요?**

채팅 메모리는 LLM이나 에이전트가 과거 대화를 보존하여 향후 상호작용에서 해당 맥락을 유지하고 참조할 수 있도록 하는 캐시입니다.
예를 들어 사용자가 이미 LLM에게 자신의 이름을 알려준 적이 있다면, LLM은 향후 대화나 메시지에서 사용자에게 다시 물어보는 대신 채팅 메모리에서 그 정보를 가져올 수 있습니다.

채팅 메모리는 벡터 스토어 메모리와는 다릅니다. 채팅 메모리는 데이터베이스에서 채팅 메시지를 저장하고 검색하기 위해 특별히 구축되었기 때문입니다.

채팅 메모리를 지원하는 컴포넌트(예: **Agent** 및 **Message History** 컴포넌트)는 각자의 데이터베이스를 *메모리로서* 액세스할 수 있게 제공합니다.
메모리로서의 검색은 LLM과 에이전트에게 중요한 차이점인데, 이 저장 및 검색 메커니즘이 과거 대화의 맥락을 회상하도록 특별히 설계되었기 때문입니다.
텍스트 청크의 시맨틱 검색과 검색을 위해 설계된 벡터 스토어와 달리, 채팅 메모리는 대화 기록에 최적화된 방식으로 채팅 메시지를 저장하고 검색하도록 설계되었습니다.

### 세션 ID와 채팅 메모리[​](#session-id-and-chat-memory "Direct link to Session ID and chat memory")

채팅 기록과 메모리는 [세션 ID(`session_id`)](https://docs.langflow.org/session-id)별로 그룹화됩니다.

기본 세션 ID는 플로우 ID이며, 이는 플로우의 모든 채팅 메시지가 하나의 큰 채팅 세션으로 동일한 세션 ID 아래 저장된다는 것을 의미합니다.

특히 여러 사용자가 사용하는 플로우에서 채팅 메모리를 더 잘 분리하려면, 커스텀 세션 ID를 사용하는 것을 고려하세요.
예를 들어 사용자 ID를 세션 ID로 사용하면, 각 사용자의 채팅 기록이 별도로 저장되어 다른 사용자의 채팅과 맥락이 분리됩니다.

### 채팅 메모리 옵션[​](#chat-memory-options "Direct link to Chat memory options")

채팅 메모리가 저장되는 위치와 방식은 플로우에서 사용하는 컴포넌트에 따라 다릅니다.

- **Agent 컴포넌트**: 이 컴포넌트에는 기본적으로 활성화된 내장 채팅 메모리가 있습니다.
이 메모리를 통해 에이전트는 동일한 세션 ID와 연관된 이전 대화의 메시지를 검색하고 참조할 수 있습니다.
모든 메시지는 [Langflow 스토리지](#storage-options-and-paths)에 저장되며, 이 컴포넌트는 검색할 메시지 수와 같은 최소한의 메모리 구성 옵션을 제공합니다.

    **Agent** 컴포넌트의 내장 채팅 메모리는 대부분의 사용 사례에 충분합니다.

    외부 채팅 메모리 스토리지를 사용하거나, 채팅 컨텍스트 밖에서 메모리를 검색하거나, (에이전트가 아닌) 언어 모델 컴포넌트와 함께 채팅 메모리를 사용하려면 **Message History** 컴포넌트를(서드파티 채팅 메모리 컴포넌트와 함께 또는 없이) 사용해야 합니다.

- **Message History 컴포넌트**: 기본적으로 이 컴포넌트는 서드파티 채팅 메모리 컴포넌트를 연결하지 않는 한 Langflow 스토리지에서 메모리를 저장하고 검색합니다. 메모리를 정렬하고 필터링할 수 있는 몇 가지 추가 옵션을 제공하지만, 이 옵션들 대부분은 **Agent** 컴포넌트에도 구성 가능하거나 고정된 파라미터로 내장되어 있습니다.

    **Message History** 컴포넌트는 언어 모델이나 에이전트와 함께, 또는 그것들 없이 사용할 수 있습니다.
예를 들어 채팅 밖에서 메모리로부터 데이터를 검색해야 하는 경우, **Message History** 컴포넌트를 사용하여 채팅에 입력하지 않고도 채팅 메모리 데이터베이스에서 직접 해당 데이터를 가져올 수 있습니다.

- **서드파티 채팅 메모리 컴포넌트**: 전용 외부 채팅 메모리 데이터베이스에서 채팅 메모리를 저장하거나 검색해야 하는 경우에만 이 컴포넌트 중 하나를 사용하세요.
일반적으로 이는 Langflow 스토리지로 충족되지 않는 특정 스토리지 요구사항이 있는 경우에만 필요합니다.
예를 들어 데이터베이스를 직접 다루어 채팅 메모리 데이터를 관리하고 싶거나, 기본 Langflow 스토리지가 아닌 다른 데이터베이스를 사용하고 싶은 경우입니다.

자세한 내용과 예제는 [**Message History** 컴포넌트](https://docs.langflow.org/message-history)와 [에이전트 메모리](https://docs.langflow.org/agents#agent-memory)를 참고하세요.

## 참고 자료[​](#see-also "Direct link to See also")

- [Langflow 파일 관리](https://docs.langflow.org/concepts-file-management)
- [Langflow 로그](https://docs.langflow.org/logging)
- [Langflow 환경 변수](https://docs.langflow.org/environment-variables)
