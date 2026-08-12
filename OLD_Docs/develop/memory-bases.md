# 메모리 베이스 관리

메모리 베이스는 Langflow 에이전트의 장기 채팅 기록을 벡터화된 형식으로 저장하여 세션 전반에 걸쳐 과거 대화를 의미론적으로 검색할 수 있게 합니다.

**메모리 베이스 vs 다른 메모리 옵션:**
- [Message History 컴포넌트](../components-reference/components-overview.md): `messages` 테이블에서 시간 순서대로 메시지를 검색
- **메모리 베이스**: 메시지를 벡터 스토어에 임베딩하고 **의미론적 유사성**으로 검색 → 최신 메시지 대신 **가장 관련성 높은 컨텍스트** 반환
- [지식 베이스](./knowledge.md): 파일로 수동 채우는 반면, 메모리 베이스는 플로우의 채팅 세션으로 자동 채워짐

기본적으로 각 메모리 베이스는 로컬 [ChromaDB](https://docs.trychroma.com/docs/overview/introduction) 벡터 스토어로 지원되지만, ChromaDB 클라우드, OpenSearch 등 다른 제공자도 사용 가능합니다.

---

## 메모리 베이스 수집 구성

각 메모리 베이스는 하나의 플로우에만 연결될 수 있지만, 단일 플로우에는 여러 메모리 베이스를 연결할 수 있습니다.

플로우가 실행을 완료할 때마다 캡처된 메시지가 구성 가능한 **임계값**을 향해 카운트됩니다. 미처리 실행 수가 임계값에 도달하면 비동기 수집 작업이 메시지를 벡터 스토어에 씁니다.

**자동 캡처(Auto-capture)**: 기본적으로 활성화되어 있으며, 메모리 베이스는 모든 플로우 실행을 추적하고 배치 임계값에 도달하면 수집 작업을 시작합니다. 자동 캡처를 비활성화하면 카운터가 증가하지 않습니다.

> **팁**: 플로우에 **Chat Input** 또는 **Chat Output** 컴포넌트가 있어야 메시지가 `messages` 테이블에 기록됩니다.

**세션별 필터링**: 기본적으로 메모리 베이스 컴포넌트는 현재 `session_id`와 일치하는 청크만 검색합니다. **Filter by Session**을 비활성화하면 수집된 모든 세션에서 검색합니다.

### LLM 전처리

선택적 **LLM 전처리**가 활성화되면 메시지가 임베딩되기 전에 LLM을 통해 처리됩니다. LLM은 원시 대화를 압축된 요약으로 증류하고, 원시 메시지 대신 요약이 벡터 스토어에 기록됩니다.

**킬 프레이즈(kill phrase)**: 수집을 게이트하도록 구성합니다. LLM의 응답에 킬 프레이즈가 포함되면 배치가 건너뛰어집니다. 기본 킬 프레이즈는 `NO_INGEST`입니다.

**전처리 프롬프트 예시:**

```
이 대화에서 핵심 사실을 요약하세요: 사용자가 보고한 문제,
취한 문제 해결 단계, 결과 또는 해결 방법.
미래 세션에서 지원 에이전트가 필요로 할 정보에 집중하세요.
대화에 저장할 가치 있는 정보가 없으면 정확히 NO_INGEST로 응답하세요.
```

---

## 메모리 베이스 만들기

1. 왼쪽 사이드바에서 **Memories**를 클릭하여 **Memory Bases** 창을 엽니다.
2. **Create**를 클릭합니다.
3. **Create Memory** 창에서 다음을 입력합니다:
   - **Name**: 이 메모리 베이스의 표시 이름 (계정 내에서 고유해야 함)
   - **Embedding Model**: 메시지를 벡터화하는 데 사용할 임베딩 모델
   - 선택 사항: **LLM Preprocessing** 활성화
4. **Create Memory**를 클릭합니다.

새 메모리 베이스의 상태는 첫 번째 수집 작업이 완료될 때까지 **Empty**입니다.

---

## 플로우에서 메모리 베이스 사용

1. [Simple Agent 스타터 플로우](../get-started/quickstart.md)를 만듭니다.
2. 비주얼 에디터에서 **Memory Base** 컴포넌트를 추가합니다.
3. **Memory Base** 필드에서 만든 메모리 베이스를 선택합니다.
4. **Memory Base** 컴포넌트에서 **Tool Mode**를 활성화합니다.
5. Memory Base 컴포넌트의 **Toolset** 출력을 **Agent** 컴포넌트의 **Tools** 입력에 연결합니다.

---

## 메모리 베이스 저장 위치

메모리 베이스는 [지식 베이스](./knowledge.md)와 동일한 디스크 레이아웃을 사용합니다:

**Langflow Desktop:**
- macOS: `/Users/<username>/.langflow/knowledge_bases`
- Windows: `C:\Users\<name>\AppData\Roaming\com.LangflowDesktop\knowledge_bases`

**Langflow OSS:**
- macOS/Windows/Linux: `<path_to_venv>/lib/python3.12/site-packages/langflow/knowledge_bases`

```bash
export LANGFLOW_KNOWLEDGE_BASES_DIR="/path/to/parent/directory"
```

---

## 참고 항목

- [벡터 데이터 관리](./knowledge.md)
- [메모리 관리 옵션](./memory.md)

---

*원문: https://docs.langflow.org/next/memory-bases*
