# 벡터 데이터 관리

벡터 데이터는 AI 애플리케이션에 매우 중요합니다. Langflow는 임베딩 모델, 벡터 스토어, 지식 베이스를 포함하여 플로우에서 벡터 데이터를 저장하고 검색하는 데 도움이 되는 여러 컴포넌트를 제공합니다.

---

## 임베딩 모델

임베딩 모델 컴포넌트는 지정된 LLM을 사용하여 텍스트 임베딩을 생성합니다.

두 가지 일반적인 사용 사례:
- **벡터 저장**: 벡터 데이터베이스에 작성된 콘텐츠에 대한 임베딩 생성
- **벡터 검색**: 유사성 검색을 실행하기 위한 쿼리에서 임베딩 생성

두 경우 모두 임베딩 모델 컴포넌트는 벡터 스토어 컴포넌트에 연결됩니다.

---

## 벡터 스토어

벡터 스토어 컴포넌트는 벡터 데이터베이스를 읽고 씁니다. 일반적으로 이 컴포넌트는 원격 데이터베이스에 연결되지만, 일부는 로컬 데이터베이스를 지원합니다.

Langflow에는 임베딩 저장, 유사성 검색, Graph RAG 순회, OpenSearch와 같은 전용 검색 인스턴스 등 벡터 데이터를 읽고 쓸 수 있는 벡터 스토어 컴포넌트가 포함되어 있습니다.

사용 가능한 벡터 스토어 컴포넌트를 찾으려면 비주얼 에디터에서 **Bundles**를 탐색하거나 선호하는 벡터 데이터베이스 제공자를 검색합니다.

### 벡터 검색 플로우 예시

1. **Vector Store RAG** 템플릿으로 플로우를 만듭니다. 이 템플릿에는 두 개의 서브플로우가 있습니다:
   - **Load Data**: 임베딩 및 콘텐츠를 벡터 데이터베이스에 로드
   - **Retriever**: 벡터 검색을 실행하여 관련 컨텍스트 검색

2. 두 Astra DB 컴포넌트 또는 선택한 다른 벡터 스토어 컴포넌트 쌍에 대한 데이터베이스 연결을 구성합니다.

3. 임베딩 모델을 구성합니다:
   - **OpenAI 모델 사용**: 두 **OpenAI Embeddings** 컴포넌트에 OpenAI API 키 입력
   - **다른 제공자 사용**: 선호하는 임베딩 모델 컴포넌트로 교체
   - **Astra DB vectorize 사용**: vectorize 통합이 있는 Astra DB의 경우 임베딩 컴포넌트 제거 가능

4. **Load Data** 서브플로우를 실행하여 벡터 스토어를 채웁니다.

5. **Playground**를 열어 채팅을 시작하면 **Retriever** 서브플로우가 실행됩니다.

---

## 지식 베이스

Langflow 지식 베이스는 Langflow 저장소에 저장된 로컬 벡터 데이터베이스입니다.

지식 베이스는 로컬이므로 모든 플로우 실행마다 데이터를 원격에서 요청하고 재수집할 필요가 없습니다.

### 벡터 스토어와의 주요 차이점

- **로컬 저장소**: Langflow 지식 베이스는 독점적으로 로컬입니다.
- **내장 임베딩 모델**: 여러 임베딩 모델에 대한 내장 지원 포함
- **기본 유사성 검색**: 표준 유사성 검색만 지원
- **구조화된 데이터**: 구조화된 데이터만 지원

### 지식 베이스 저장 위치

각 지식 베이스는 [ChromaDB](https://docs.trychroma.com/docs/overview/introduction) 벡터 데이터베이스입니다.

**Langflow Desktop:**
- macOS: `/Users/<username>/.langflow/knowledge_bases`
- Windows: `C:\Users\<name>\AppData\Roaming\com.LangflowDesktop\knowledge_bases`

**Langflow OSS:**
- macOS/Windows/Linux/WSL (`uv pip install`): `<path_to_venv>/lib/python3.12/site-packages/langflow/knowledge_bases`
- macOS/Windows/Linux/WSL (`git clone`): `<path_to_clone>/src/backend/base/langflow/knowledge_bases`

기본 `knowledge_bases` 디렉토리 경로를 변경하려면 `LANGFLOW_KNOWLEDGE_BASES_DIR` 환경 변수를 설정합니다:

```bash
export LANGFLOW_KNOWLEDGE_BASES_DIR="/path/to/parent/directory"
```

### 지식 베이스 생성

1. **Projects** 페이지에서 **Knowledge**를 클릭합니다.
2. **Add Knowledge**를 클릭합니다.
3. **Create Knowledge Base** 창에서 이름을 입력하고 임베딩 모델을 선택합니다.
4. **Configure Sources**를 클릭하여 소스를 구성합니다.
5. **Review & Build** 창에서 첫 번째 청크를 미리 보고 **Create**를 클릭합니다.
6. **Status**가 **Ready**로 변경되면 사용 가능합니다.

### 지식 베이스 관리

**Projects** 페이지에서 **Knowledge**를 클릭하여 지식 베이스를 관리합니다. 각 지식 베이스에 대해 이름, 임베딩 모델, 디스크 크기, 단어/문자/청크 수, 상태를 확인할 수 있습니다.

---

## 참고 항목

- [Langflow 에이전트 사용](../agents/use-agents.md)
- [RAG 챗봇 만들기](../get-started/chat-with-rag.md)

---

*원문: https://docs.langflow.org/next/knowledge*
