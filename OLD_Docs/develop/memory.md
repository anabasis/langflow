# 메모리 관리 옵션

Langflow는 플로우와 Langflow 서버에 관련된 데이터의 저장 및 검색을 위한 유연한 메모리 관리 옵션을 제공합니다.

---

## 저장소 옵션 및 경로

Langflow의 기본 저장소 옵션은 [SQLite](https://www.sqlite.org/) 데이터베이스입니다. 기본 저장소 경로는 운영 체제와 설치 방법에 따라 다릅니다:

**Langflow Desktop:**
- macOS: `/Users/<username>/.langflow/data/database.db`
- Windows: `C:\Users\<name>\AppData\Roaming\com.LangflowDesktop\data\database.db`

**Langflow OSS:**
- macOS/Windows/Linux/WSL (`uv pip install`): `<path_to_venv>/lib/python3.12/site-packages/langflow/langflow.db`
- macOS/Windows/Linux/WSL (`git clone`): `<path_to_clone>/src/backend/base/langflow/langflow.db`

기본 데이터베이스 경로에 대한 대안:

- **구성 디렉토리**: `LANGFLOW_SAVE_DB_IN_CONFIG_DIR=True`로 설정하면 `LANGFLOW_CONFIG_DIR`에 지정된 디렉토리에 데이터베이스를 저장합니다.
- **외부 PostgreSQL 데이터베이스**: 모든 Langflow 저장소에 외부 PostgreSQL 데이터베이스를 사용할 수 있습니다.
- **별도 채팅 메모리**: 다른 Langflow 저장소와 별도로 채팅 메모리에만 외부 저장소를 사용할 수 있습니다.
- **데이터베이스 없음**: `LANGFLOW_USE_NOOP_DATABASE=True`로 설정하면 데이터베이스 작업을 비활성화합니다.

---

## Langflow 데이터베이스 테이블

`langflow.db`에 저장되는 주요 테이블:

- **ApiKey**: Langflow API 인증 키 관리
- **File**: 파일 관리 시스템에 업로드된 파일 메타데이터 저장
- **Flow**: 노드, 엣지, 컴포넌트를 포함한 플로우 정의
- **FlowVersion**: 플로우 정의의 번호가 매겨진 스냅샷 저장
- **Folder**: 플로우 저장을 위한 구조 제공
- **KnowledgeBase**: 지식 베이스 구성 저장
- **MemoryBase**: 플로우를 위한 메모리 베이스 구성 저장
- **Message**: 컴포넌트 간 채팅 메시지 및 상호작용 저장
- **Trace** 및 **Span**: 플로우 및 컴포넌트 추적 정보 저장
- **Transactions**: 플로우 실행 기록 및 결과 저장
- **User**: 사용자 계정 정보 저장
- **Variables**: 전역 암호화 값 및 자격 증명 저장
- **VertexBuild**: 플로우 내 개별 노드의 빌드 상태 추적

> **팁**: 플로우를 데이터베이스에 저장하기 전에 플로우 데이터에서 API 키와 토큰을 자동으로 제거하려면 `LANGFLOW_REMOVE_API_KEYS=True`로 설정합니다.

---

## 외부 메모리 구성

기본 Langflow SQLite 데이터베이스를 다른 데이터베이스로 교체하려면 `LANGFLOW_DATABASE_URL` 환경 변수를 데이터베이스 URL로 설정합니다:

```
LANGFLOW_DATABASE_URL=postgresql://user:password@localhost:5432/langflow
```

추가 데이터베이스 연결 풀 설정:

```
LANGFLOW_DB_CONNECTION_SETTINGS='{"pool_size": 20, "max_overflow": 30, "pool_timeout": 30, "pool_pre_ping": true, "pool_recycle": 1800, "echo": false}'
```

---

## 캐시 메모리 구성

기본 Langflow 캐싱 동작은 비동기 인메모리 캐시입니다:

```
LANGFLOW_LANGCHAIN_CACHE=InMemoryCache
LANGFLOW_CACHE_TYPE=async
```

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `LANGFLOW_CACHE_TYPE` | `async` | 캐시 유형: `async`, `redis`, `memory` |
| `LANGFLOW_LANGCHAIN_CACHE` | `InMemoryCache` | LangChain 캐시 저장소 유형 |
| `LANGFLOW_REDIS_HOST` | `localhost` | Redis 서버 호스트명 |
| `LANGFLOW_REDIS_PORT` | `6379` | Redis 서버 포트 |
| `LANGFLOW_REDIS_DB` | `0` | Redis 데이터베이스 번호 |
| `LANGFLOW_REDIS_CACHE_EXPIRE` | `3600` | 캐시 만료 시간(초) |

---

## 채팅 메모리 저장

채팅 기반 플로우에서 채팅 기록은 Langflow `messages` 테이블에 저장됩니다.

**채팅 메모리 작동 방식**: 채팅 메모리는 LLM 또는 에이전트가 과거 대화를 보존하고 향후 상호작용에서 해당 컨텍스트를 참조할 수 있는 캐시입니다.

### 세션 ID와 채팅 메모리

채팅 기록과 메모리는 [세션 ID](./session-id.md)로 그룹화됩니다. 기본 세션 ID는 플로우 ID입니다. 더 나은 채팅 메모리 분리를 위해 커스텀 세션 ID(예: 사용자 ID)를 사용하세요.

### 채팅 메모리 옵션

- **Agent 컴포넌트**: 기본적으로 활성화된 내장 채팅 메모리 포함
- **Message History 컴포넌트**: 기본적으로 Langflow 저장소에서 메모리를 저장하고 검색. 외부 채팅 메모리 컴포넌트 연결 가능
- **서드파티 채팅 메모리 컴포넌트**: 전용 외부 채팅 메모리 데이터베이스가 필요한 경우에만 사용

---

## 참고 항목

- [파일 관리](./storage-and-memory.md)
- [환경 변수](./environment-variables.md)
- [세션 ID](./session-id.md)

---

*원문: https://docs.langflow.org/next/memory*
