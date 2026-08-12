# 번들 개요

번들은 Langflow와 특정 서드파티 통합을 지원하는 커스텀 컴포넌트를 포함합니다. 핵심 컴포넌트와 동일한 방식으로 플로우에 추가하고 구성할 수 있습니다.

번들을 탐색하려면 비주얼 에디터에서 **Bundles**를 클릭합니다.

---

## 번들 유지 관리 및 문서

많은 번들 컴포넌트는 Langflow 코드베이스에 서드파티 기여자가 개발했습니다. 특정 번들 컴포넌트의 문서를 찾으려면 Langflow 문서와 제공자 문서를 탐색하세요.

컴포넌트 자체에서 관련 문서 링크를 찾을 수도 있습니다:
1. 컴포넌트를 클릭하여 검사 패널 열기
2. **More** 클릭
3. **Docs** 선택

---

## 컴포넌트 파라미터

일부 파라미터는 비주얼 에디터에서 기본적으로 숨겨져 있습니다. 컴포넌트를 선택하면 나타나는 컴포넌트 검사 패널을 통해 모든 파라미터를 수정할 수 있습니다.

---

## 핵심 컴포넌트와 번들

Langflow는 서드파티, 제공자별 번들 외에도 일반 **핵심 컴포넌트**를 제공합니다.

특정 서비스나 통합을 찾고 있다면 비주얼 에디터에서 컴포넌트를 **검색**할 수 있습니다.

가장 정확하고 최신 번들 및 컴포넌트 목록은 비주얼 에디터의 **Bundles**를 확인하세요.

### 주요 번들 목록

| 번들 | 설명 |
|------|------|
| Amazon | Amazon Bedrock, Kendra, S3 등 |
| Anthropic | Anthropic Claude 모델 |
| Azure | Azure OpenAI, Azure AI Search 등 |
| Chroma | Chroma 벡터 스토어 |
| Cohere | Cohere 모델 및 임베딩 |
| DataStax | AstraDB 벡터 스토어 |
| DeepSeek | DeepSeek LLM |
| Docling | 문서 파싱 및 청킹 |
| DuckDuckGo | 웹 검색 |
| Elastic | Elasticsearch 벡터 스토어 |
| FAISS | FAISS 벡터 스토어 |
| Google | Google Gemini, Vertex AI, Google Drive 등 |
| Groq | Groq LLM |
| Hugging Face | Hugging Face 모델 |
| IBM | IBM watsonx.ai, IBM Db2 |
| LangChain | LangChain 유틸리티 컴포넌트 |
| Milvus | Milvus 벡터 스토어 |
| MistralAI | Mistral AI 모델 |
| MongoDB | MongoDB Atlas 벡터 스토어 |
| Notion | Notion 통합 |
| NVIDIA | NVIDIA NIM 모델 |
| Ollama | 로컬 LLM (Ollama) |
| OpenAI | OpenAI GPT 모델, DALL-E |
| OpenRouter | 다중 LLM 라우터 |
| Perplexity | Perplexity AI |
| pgvector | PostgreSQL 벡터 스토어 |
| Pinecone | Pinecone 벡터 스토어 |
| Qdrant | Qdrant 벡터 스토어 |
| Redis | Redis 캐시 및 벡터 스토어 |
| SearchApi | 웹 검색 API |
| Serper | Google 검색 API |
| Supabase | Supabase 벡터 스토어 |
| Weaviate | Weaviate 벡터 스토어 |
| Wikipedia | Wikipedia 검색 |
| xAI | xAI Grok 모델 |

---

## 레거시 번들

레거시 컴포넌트는 더 이상 지원되지 않으며 향후 릴리스에서 제거될 수 있습니다. 기존 플로우에서 계속 사용할 수 있지만, 가능한 빨리 지원되는 컴포넌트로 교체하는 것이 좋습니다.

**CrewAI 번들** (레거시): Agent 컴포넌트로 교체 권장

**Embeddings 번들** (레거시):
- **Embedding Similarity**: 벡터 스토어 컴포넌트의 내장 유사성 검색으로 교체
- **Text Embedder**: 임베딩 모델 컴포넌트로 교체

**Vector Stores 번들** (레거시): **Local DB** 컴포넌트를 Chroma DB 컴포넌트로 교체

**Zep 번들** (레거시): **Zep Chat Memory**를 **Message History** 컴포넌트로 교체

---

*원문: https://docs.langflow.org/next/components-bundle-components*
