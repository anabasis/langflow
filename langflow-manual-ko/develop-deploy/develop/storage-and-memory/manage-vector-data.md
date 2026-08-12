# 벡터 데이터 관리

> 원문: https://docs.langflow.org/next/knowledge

벡터 데이터는 AI 애플리케이션에 매우 중요합니다.
Langflow는 임베딩 모델, 벡터 스토어, 지식 베이스를 포함하여 플로우에서 벡터 데이터를 저장하고 검색할 수 있는 여러 컴포넌트를 제공합니다.

## 임베딩 모델[​](#embedding-models "Direct link to Embedding models")

임베딩 모델 컴포넌트는 지정된 대규모 언어 모델(LLM)을 사용하여 텍스트 임베딩을 생성합니다.

이 컴포넌트들의 일반적인 사용 사례는 두 가지입니다.

- **벡터 저장**: 벡터 데이터베이스에 기록될 콘텐츠에 대한 임베딩을 생성합니다.
- **벡터 검색**: 유사도 검색을 실행하기 위해 쿼리로부터 임베딩을 생성합니다.

두 경우 모두 임베딩 모델 컴포넌트는 벡터 스토어 컴포넌트에 연결됩니다.
자세한 내용, 예제, 사용 가능한 옵션은 [임베딩 모델 컴포넌트](https://docs.langflow.org/components-embedding-models)를 참고하세요.

또는 여러 임베딩 모델에 대한 내장 지원을 포함하는 [지식 베이스](#knowledge-bases)를 사용할 수도 있습니다.

## 벡터 스토어[​](#vector-stores "Direct link to Vector stores")

벡터 스토어 컴포넌트는 벡터 데이터베이스에서 읽고 씁니다.
일반적으로 이 컴포넌트들은 원격 데이터베이스에 연결되지만, 일부 벡터 스토어 컴포넌트는 로컬 데이터베이스도 지원합니다.

설계상 벡터 데이터는 챗봇이나 에이전트와 같은 LLM 애플리케이션에 필수적입니다.

일반적인 채팅 상호작용과 흔한 작업에는 LLM만 사용할 수 있지만, RAG와 같은 컨텍스트 민감성과 내부 비즈니스 데이터와 같은 커스텀 데이터셋을 활용하면 애플리케이션을 한 단계 발전시킬 수 있습니다.
이를 위해서는 추가적인 컨텍스트를 제공하고 의미 있는 쿼리를 정의하는 벡터 데이터베이스 및 벡터 검색을 통합해야 하는 경우가 많습니다.

Langflow는 임베딩 저장, 유사도 검색, Graph RAG 순회, OpenSearch와 같은 전용 검색 인스턴스를 포함하여 벡터 데이터를 읽고 쓸 수 있는 벡터 스토어 컴포넌트를 포함합니다.
이들은 서로 의존적인 기능을 가지고 있으므로, 벡터 스토어, 언어 모델, 임베딩 모델 컴포넌트를 동일한 플로우 또는 일련의 의존 플로우에서 함께 사용하는 것이 일반적입니다.

사용 가능한 벡터 스토어 컴포넌트를 찾으려면 [**Bundles**](https://docs.langflow.org/components-bundle-components)를 살펴보거나 원하는 벡터 데이터베이스 프로바이더를 **Search**로 검색하세요.

**예시: 벡터 검색 플로우**

tip

플로우에서 벡터 데이터를 사용하는 튜토리얼은 [벡터 RAG 챗봇 만들기](https://docs.langflow.org/chat-with-rag)를 참고하세요.

다음 예시는 임베딩 모델 및 언어 모델 컴포넌트와 같은 관련 컴포넌트와 함께 플로우에서 벡터 스토어 컴포넌트를 사용하는 방법을 보여줍니다.
이 단계들은 이러한 컴포넌트를 효과적으로 사용하기 위한 중요한 구성 세부 사항, 기능, 모범 사례를 안내합니다.
이는 하나의 예시일 뿐이며, 가능한 모든 사용 사례나 구성에 대한 규범적인 가이드는 아닙니다.

1. **Vector Store RAG** 템플릿으로 플로우를 생성합니다.

    이 템플릿에는 두 개의 서브플로우가 있습니다.
**Load Data** 서브플로우는 임베딩과 콘텐츠를 벡터 데이터베이스에 로드하고, **Retriever** 서브플로우는 사용자 쿼리를 기반으로 관련 컨텍스트를 검색하기 위해 벡터 검색을 실행합니다.

2. 두 [**Astra DB** 컴포넌트](https://docs.langflow.org/bundles-datastax#astra-db) 모두에 대한 데이터베이스 연결을 구성하거나, 원하는 다른 벡터 스토어 컴포넌트 한 쌍으로 교체하세요.
두 컴포넌트가 동일한 벡터 스토어에 연결되어 있고, **Retriever** 서브플로우의 컴포넌트가 유사도 검색을 실행할 수 있는지 확인하세요.

    각 벡터 스토어 컴포넌트에서 설정하는 파라미터는 플로우 내에서 해당 컴포넌트가 맡는 역할에 따라 다릅니다.
이 예시에서 **Load Data** 서브플로우는 벡터 스토어에 *쓰기* 작업을 하고, **Retriever** 서브플로우는 벡터 스토어에서 *읽기* 작업을 합니다.
따라서 검색 관련 파라미터는 **Retriever** 서브플로우의 **Vector Search** 컴포넌트에만 해당합니다.

    특정 파라미터에 대한 정보는 선택한 벡터 스토어 컴포넌트의 문서를 참고하세요.

3. 임베딩 모델을 구성하려면 다음 중 하나를 수행하세요.

  - **OpenAI 모델 사용**: 두 **OpenAI Embeddings** 컴포넌트 모두에 OpenAI API 키를 입력합니다.
기본 모델을 사용하거나 다른 OpenAI 임베딩 모델을 선택할 수 있습니다.

  - **다른 프로바이더 사용**: **OpenAI Embeddings** 컴포넌트를 원하는 다른 [임베딩 모델 컴포넌트](https://docs.langflow.org/components-embedding-models) 한 쌍으로 교체한 다음, 그에 맞게 파라미터와 자격 증명을 구성합니다.

  - **Astra DB vectorize 사용**: vectorize 통합 기능이 있는 Astra DB 벡터 스토어를 사용하는 경우, 두 **OpenAI Embeddings** 컴포넌트를 모두 제거할 수 있습니다.
이렇게 하면 vectorize 통합이 **Ingest Data**(**Load Data** 서브플로우 내)와 **Search Query**(**Retriever** 서브플로우 내)로부터 자동으로 임베딩을 생성합니다.

  tip
      벡터 스토어에 이미 임베딩이 포함되어 있는 경우, 임베딩 모델 컴포넌트가 기존 임베딩과 동일한 모델을 사용하는지 확인하세요.
동일한 벡터 스토어에서 서로 다른 임베딩 모델을 혼용하면 부정확한 검색 결과가 나올 수 있습니다.

4. 권장: [**Split Text** 컴포넌트](https://docs.langflow.org/split-text)에서 임베딩 모델에 맞게 청킹 설정을 최적화하세요.
예를 들어 임베딩 모델의 토큰 한도가 512라면, **Chunk Size** 파라미터가 이 한도를 초과해서는 안 됩니다.

    또한 **Retriever** 서브플로우는 채팅 입력을 벡터 검색을 위해 벡터 스토어 컴포넌트로 직접 전달하므로, 채팅 입력 문자열이 임베딩 모델의 한도를 초과하지 않는지 확인하세요.
이 예시에서는 한도 내에 있는 쿼리를 입력할 수 있지만, 프로덕션 환경에서는 준수 여부를 보장하기 위해 추가 검사나 전처리 단계를 구현해야 할 수 있습니다.
예를 들어 벡터 검색을 실행하기 전에 채팅 입력을 준비하기 위한 추가 컴포넌트를 사용하거나, 애플리케이션 코드에서 채팅 입력 한도를 강제할 수 있습니다.

5. **Language Model** 컴포넌트에 OpenAI API 키를 입력하거나, 플로우의 채팅 부분에 사용할 다른 프로바이더와 모델을 선택하세요.

6. **Load Data** 서브플로우를 실행하여 벡터 스토어를 채웁니다.
**Read File** 컴포넌트에서 파일을 하나 이상 선택한 다음, **Load Data** 서브플로우의 벡터 스토어 컴포넌트에서 **Run component**를 클릭합니다.

    **Load Data** 서브플로우는 로컬 머신에서 파일을 로드하고, 청크로 나누고, 청크에 대한 임베딩을 생성한 다음, 청크와 임베딩을 벡터 데이터베이스에 저장합니다.

    ![벡터 스토어로 데이터 임베딩하기](https://docs.langflow.org/assets/images/vector-store-document-ingestion-6157311fb4d16e7f944d55254f0cc0e2.png)

    **Load Data** 서브플로우는 채팅을 사용할 때마다 매번 실행할 필요가 없으므로, **Retriever** 서브플로우와 분리되어 있습니다.
벡터 스토어의 데이터를 미리 로드하거나 업데이트해야 할 때 필요에 따라 **Load Data** 서브플로우를 실행할 수 있습니다.
그러면 채팅 상호작용에는 채팅에 필요한 컴포넌트만 사용됩니다.

    벡터 스토어에 이미 벡터 검색에 사용하고 싶은 데이터가 있다면, **Load Data** 서브플로우를 실행할 필요가 없습니다.

7. **Playground**를 열고 채팅을 시작하여 **Retriever** 서브플로우를 실행합니다.

    **Retriever** 서브플로우는 채팅 입력으로부터 임베딩을 생성하고, 벡터 검색을 실행하여 벡터 스토어에서 유사한 콘텐츠를 검색하고, 검색 결과를 LLM을 위한 보충 컨텍스트로 파싱한 다음, LLM을 사용하여 쿼리에 대한 자연어 응답을 생성합니다.
LLM은 내부 학습 데이터 및 기본 웹 검색과 날짜/시간 정보 같은 도구와 함께 벡터 검색 결과를 사용하여 응답을 생성합니다.

    ![벡터 스토어에서 검색하기](https://docs.langflow.org/assets/images/vector-store-retrieval-af7257d77ff0259ab1a0980641d464ce.png)

    원본 검색 결과 블록 전체를 LLM에 전달하지 않기 위해, **Parser** 컴포넌트는 검색 결과 `JSON` 객체에서 `text` 문자열을 추출한 다음, `Message` 형식으로 **Prompt Template** 컴포넌트에 전달합니다.
그 후 이 문자열과 다른 템플릿 콘텐츠가 LLM을 위한 자연어 지침으로 컴파일됩니다.

    검색 결과를 어떻게 사용하고 싶은지에 따라 **JSON Operations** 컴포넌트와 같은 다른 컴포넌트를 이 변환에 사용할 수 있습니다.

    원본 검색 결과를 보려면 **Retriever** 서브플로우를 실행한 후 벡터 스토어 컴포넌트에서 **Inspect output**을 클릭하세요.

## 지식 베이스[​](#knowledge-bases "Direct link to Knowledge bases")

Langflow 지식 베이스는 플로우에서 사용할 임베딩을 저장하는 벡터 데이터베이스입니다.
기본적으로 지식 베이스는 Chroma를 로컬 벡터 스토어로 사용하지만, OpenSearch와 같은 외부 벡터 데이터베이스 프로바이더를 구성할 수도 있습니다.
자세한 내용은 [벡터 데이터베이스 프로바이더 구성](#configure-vector-database-providers)을 참고하세요.

지식 베이스는 플로우가 실행될 때마다 데이터를 다시 수집하지 않으므로, 원격 벡터 데이터베이스를 사용하는 것보다 효율적일 수 있습니다.
고객 및 제품 데이터 조각과 같은 커스텀, 도메인 특화 데이터셋을 사용하는 플로우에 적합한 선택입니다.

지식 베이스 컴포넌트는 벡터 스토어 컴포넌트를 사용하는 방식과 거의 동일하게 사용할 수 있습니다.
다만 몇 가지 주요 차이점이 있습니다.

- **기본적으로 로컬 스토리지**: Langflow 지식 베이스는 기본적으로 Chroma 로컬 스토리지를 사용합니다.
반면 일부 벡터 스토어 컴포넌트만 로컬 데이터베이스를 지원합니다.
- **내장 임베딩 모델**: Langflow 지식 베이스는 여러 임베딩 모델에 대한 내장 지원을 포함합니다.
다른 모델은 지식 베이스와 함께 사용할 수 없습니다.
다른 프로바이더나 모델을 사용하려면 원하는 임베딩 모델 컴포넌트와 함께 벡터 스토어 컴포넌트를 사용해야 합니다.
- **기본 유사도 검색**: Langflow 지식 베이스를 쿼리할 때는 표준 유사도 검색만 지원됩니다.
더 고급 검색이 필요한 경우, 원하는 기능을 지원하는 벡터 데이터베이스 프로바이더용 벡터 스토어 컴포넌트를 사용해야 합니다.
- **구조화된 데이터**: Langflow 지식 베이스는 구조화된 데이터만 지원합니다.
비구조화된 데이터의 경우 호환되는 벡터 스토어 컴포넌트를 사용해야 합니다.

### 지식 베이스 생성하기[​](#create-a-knowledge-base "Direct link to Create a knowledge base")

이 예시에서는 청크로 나뉜 고객 주문의 지식 베이스를 생성합니다.
이 예시를 따라 하려면 [`customer-orders.csv`](https://docs.langflow.org/assets/files/customer_orders-0c1c00f9ebd1f6b3c9ede72af1b67ca2.csv)를 로컬 머신에 다운로드하거나, 자신의 구조화된 데이터에 맞게 단계를 조정하세요.

1. [**Projects** 페이지](https://docs.langflow.org/concepts-flows#projects)에서 프로젝트 목록 아래에 있는 **Knowledge**를 클릭하여 지식 베이스를 보고 관리합니다.

2. 새 지식 베이스를 생성하려면 **Add Knowledge**를 클릭합니다.

3. **Create Knowledge Base** 패널에서 지식 베이스의 이름을 입력하고, 임베딩 모델을 선택하고, **DB Provider**를 선택합니다.

    Langflow의 전역 모델 프로바이더 구성을 편집하려면 다음을 수행하세요.

  1. **Model Providers** 패널을 열려면 프로필 아이콘을 클릭하고 **Settings**를 선택한 다음 **Model Providers**를 클릭합니다.

  2. **Model Providers** 패널에서 프로바이더를 선택합니다.

  3. **API Key** 필드에 프로바이더의 API 키를 추가합니다. 일부 프로바이더는 추가 구성 필드가 필요합니다. 자세한 내용은 모델 프로바이더의 문서를 참고하세요.

        이 키는 플로우에서 사용하려는 모델을 호출할 권한이 있어야 하며, 계정에는 수행하려는 작업에 충분한 크레딧이 있어야 합니다.

        각 프로바이더당 하나의 키만 추가할 수 있습니다. 이 키가 Langflow에서 사용하려는 *모든* 모델에 액세스할 수 있는지 확인하세요.

  4. **Save**를 클릭합니다.

  5. Langflow에서 사용하려는 특정 모델을 활성화합니다.
사용 가능한 모델은 프로바이더와 API 키의 권한에 따라 다릅니다.
텍스트를 생성하는 모델은 **Language Models** 아래에 나열됩니다.
임베딩을 생성하는 모델은 **Embedding Models** 아래에 나열됩니다.

    Langflow의 전역 모델 구성에서 모델을 활성화하면, 플로우 내의 모든 모델 기반 컴포넌트에서 해당 모델을 사용할 수 있습니다.

    **DB Provider**는 임베딩이 저장되는 위치를 결정합니다. 기본값은 **Settings → DB Providers**에서 구성된 프로바이더입니다. 기존 지식 베이스는 원래의 백엔드를 유지하므로, 전역 DB Provider를 변경해도 새로 생성되는 지식 베이스에만 영향을 미칩니다.

    지식 베이스를 생성한 후에는 임베딩 모델이나 DB 프로바이더를 변경할 수 없습니다. 둘 중 하나를 변경해야 하는 경우, 지식 베이스를 삭제하고 다시 생성해야 합니다.

4. 선택 사항: 모든 청크에 추가 컨텍스트를 태그하려면 **Custom Metadata Fields**를 추가합니다. 예를 들어 여러 팀의 파일을 수집하는 경우, 값이 `support`인 `team` 필드를 추가하세요. 이렇게 하면 **Knowledge Base** 컴포넌트가 검색할 때, `team`이 `support`와 같은 청크만 반환하도록 결과를 필터링하여 지원팀의 콘텐츠로 결과 범위를 제한할 수 있습니다.

5. 지식 베이스의 소스를 구성하려면 **Configure Sources**를 클릭합니다.
선택적으로, 빈 지식 베이스를 생성하려면 **Create**를 클릭합니다.

6. **Configure Sources** 패널에서 지식 베이스의 데이터 소스와 임베딩된 데이터가 벡터 검색 검색을 위해 어떻게 청킹될지를 구성합니다.
이 예시에서는 **Add Sources**를 클릭한 다음, 로컬 머신에서 다운로드한 [`customer-orders.csv`](https://docs.langflow.org/assets/files/customer_orders-0c1c00f9ebd1f6b3c9ede72af1b67ca2.csv) 파일을 선택합니다.
**Chunk Size**, **Chunk Overlap**, **Separator**의 기본 설정으로 충분합니다.
계속하려면 **Next Step**을 클릭합니다.

7. **Review & Build** 패널에서는 모든 데이터를 지식 베이스에 임베딩하기 위해 토큰을 소비하기 전에 첫 번째 청크를 미리 볼 수 있습니다.
일반적인 청크 크기는 512~1000자입니다. 청크가 작을수록 더 세분화된 검색이 가능하지만 청크 간 컨텍스트를 잃을 수 있습니다.
청크가 원하는 대로 임베딩되지 않았다면, **Back**을 클릭하여 청킹 전략을 구성하세요.
이 데이터를 임베딩하려면 **Create**를 클릭합니다.

8. 데이터가 **Knowledge**로 임베딩됩니다.
사용 가능해지면 **Status**가 **Ready**로 변경됩니다.

새로운 지식 베이스를 플로우에서 사용하려면 [플로우에서 Knowledge Base 컴포넌트 사용하기](https://docs.langflow.org/knowledge-base)를 참고하세요.

### 지식 베이스 관리하기[​](#manage-knowledge-bases "Direct link to Manage knowledge bases")

[**Projects** 페이지](https://docs.langflow.org/concepts-flows#projects)에서 프로젝트 목록 아래에 있는 **Knowledge**를 클릭하여 지식 베이스를 보고 관리하세요.

각 지식 베이스에 대해 다음 정보를 확인할 수 있습니다.

- 이름
- 임베딩 모델
- 디스크 사용 크기
- 단어, 문자, 청크의 수
- 청크의 평균 길이와 크기
- 지식 베이스의 상태

지식 베이스 이름 옆의 아이콘은 소스 파일 유형을 나타냅니다.

- 빨강 — PDF
- 초록 — CSV
- 보라 — 일반 텍스트(`.txt`)
- 자홍 — Markdown(`.md`, `.mdx`)
- 노랑 — HTML
- 파랑 — 코드 파일(`.py`, `.js`, `.ts`)
- 남색 — JSON
- — 여러 소스 유형

청킹 동작은 임베딩 모델에 의해 결정되며, 임베딩 모델은 지식 베이스를 생성할 때 설정됩니다.
임베딩 모델을 변경해야 하는 경우, 지식 베이스를 삭제하고 다시 생성해야 합니다.

지식 베이스를 업데이트하려면 **More**를 클릭한 다음 **Update Knowledge Base**를 선택하세요.

지식 베이스의 청크를 보려면 **More**를 클릭한 다음 **View Chunks**를 선택하세요.

지식 베이스를 삭제하려면 **More**를 클릭한 다음 **Delete**를 클릭하세요.
삭제된 지식 베이스를 사용하는 플로우가 있다면, 다른 지식 베이스를 사용하도록 업데이트해야 합니다.

플로우에서 지식 베이스를 사용하는 방법에 대한 자세한 내용은 [**Knowledge Base** 컴포넌트](https://docs.langflow.org/knowledge-base) 문서를 참고하세요.

### 벡터 데이터베이스 프로바이더 구성하기[​](#configure-vector-database-providers "Direct link to Configure vector database providers")

**DB Providers**는 지식 베이스가 임베딩을 저장하고 검색하는 벡터 데이터베이스입니다.
이 프로바이더를 구성하려면 **Settings → DB Providers**로 이동하세요.
선택한 프로바이더는 앞으로 생성하는 모든 지식 베이스에 적용됩니다.
기존 지식 베이스는 생성 당시 활성화되어 있던 프로바이더를 계속 사용합니다.

#### Chroma(기본값)[​](#chroma-default "Direct link to Chroma (default)")

기본적으로 지식 베이스는 별도의 추가 설정 없이 [ChromaDB](https://docs.trychroma.com/docs/overview/introduction)를 로컬 벡터 스토어로 사용합니다.
지식 베이스는 Langflow 인스턴스에 로컬로 저장됩니다.
기본 저장 위치는 운영체제와 설치 방법에 따라 다릅니다.

- **Langflow Desktop**:
  * **macOS**: `/Users/<username>/.langflow/knowledge_bases`
  * **Windows**: `C:\Users\<name>\AppData\Roaming\com.LangflowDesktop\knowledge_bases`
- **Langflow OSS**:
  * **macOS/Windows/Linux/WSL(`uv pip install` 사용 시)**: `<path_to_venv>/lib/python3.12/site-packages/langflow/knowledge_bases` (Python 버전은 다를 수 있습니다. 지식 베이스는 가상 환경 간에 공유되지 않습니다.)
  * **macOS/Windows/Linux/WSL(`git clone` 사용 시)**: `<path_to_clone>/src/backend/base/langflow/knowledge_bases`

`LANGFLOW_CONFIG_DIR` 환경 변수를 설정하면, 해당 경로를 기준으로 `knowledge_bases` 하위 디렉터리가 생성됩니다.

기본 `knowledge_bases` 디렉터리 경로를 변경하려면 `LANGFLOW_KNOWLEDGE_BASES_DIR` 환경 변수를 설정하세요.

```
export LANGFLOW_KNOWLEDGE_BASES_DIR="/path/to/parent/directory"
```

#### Chroma Cloud[​](#chroma-cloud "Direct link to Chroma Cloud")

[Chroma Cloud](https://docs.trychroma.com/docs/overview/introduction)를 데이터베이스 프로바이더로 사용하려면 Chroma Cloud 계정과 Chroma Cloud의 API 키가 필요합니다.

1. Chroma Cloud 대시보드에서 **API Key**, **Tenant**, **Database** 이름을 복사합니다.

2. Chroma Cloud를 Langflow에 연결하려면 **Settings**를 클릭한 다음 **DB Providers**를 클릭합니다.

3. **Chroma Cloud**를 선택합니다.

4. 다음 값을 입력합니다.

  - **API Key**: Chroma Cloud API 키를 입력합니다.
  - **Tenant**: 선택적으로 테넌트 이름을 입력합니다. 비워두면 API 키와 연관된 테넌트가 기본값으로 사용됩니다.
  - **Database**: 선택적으로 데이터베이스 이름을 입력합니다. 비워두면 `default_database`가 기본값으로 사용됩니다.
  - **Region**: 선택적으로 클라우드 리전을 입력합니다.

5. **Save and Use Chroma Cloud**를 클릭합니다.

    선택적으로, 저장 전에 Langflow가 Chroma Cloud 인스턴스에 도달할 수 있는지 확인하려면 **Test Connection**을 클릭하세요.

    이제 Chroma Cloud 데이터베이스가 지식 베이스 프로바이더로 Langflow에 연결되었습니다.
이 프로바이더로 지식 베이스를 생성하려면 [지식 베이스 생성하기](#create-a-knowledge-base)를 참고하세요.

#### OpenSearch[​](#opensearch "Direct link to OpenSearch")

OpenSearch를 데이터베이스 프로바이더로 사용하려면, Langflow 인스턴스에서 접근 가능한 실행 중인 OpenSearch 클러스터가 필요합니다.
이 예시는 로컬에서 실행되는 OpenSearch 컨테이너를 사용하지만, 원격 OpenSearch 인스턴스도 사용할 수 있습니다.

1. 이 예시에서는 보안이 비활성화된 로컬 OpenSearch 컨테이너를 시작합니다. 이렇게 하면 사용자 이름, 비밀번호, TLS 없이 연결할 수 있습니다. 이 구성은 예시 목적으로만 사용되며 프로덕션 환경에서는 권장되지 *않습니다*.

  ```
  podman run -d \
    --name opensearch \
    -p 9200:9200 \
    -p 9600:9600 \
    -e "discovery.type=single-node" \
    -e "plugins.security.disabled=true" \
    -e "OPENSEARCH_INITIAL_ADMIN_PASSWORD=YOUR_OPENSEARCH_PASSWORD" \
    opensearchproject/opensearch:latest
  ```

  note
      OpenSearch 3.x는 보안이 비활성화되어 있어도 `OPENSEARCH_INITIAL_ADMIN_PASSWORD`를 설정해야 합니다.

    비밀번호가 유효성 검사를 통과하지 못하면, 컨테이너는 `Password failed validation` 오류와 함께 즉시 종료됩니다.

    비밀번호는 [OpenSearch 비밀번호 복잡성 요구사항](https://docs.opensearch.org/latest/security/configuration/demo-configuration/#setting-up-a-custom-admin-password)을 준수해야 합니다.

2. 클러스터에 도달할 수 있는지 확인합니다.

  ```
  curl -s http://localhost:9200
  ```
    성공적인 응답은 컨테이너가 시작되어 요청을 받을 수 있음을 나타냅니다.

  ```
  {
    "name" : "your-node-name",
    "cluster_name" : "docker-cluster",
    "version" : {
      "distribution" : "opensearch",
      "number" : "3.6.0"
    },
    "tagline" : "The OpenSearch Project: https://opensearch.org/"
  }
  ```
    응답이 없거나 연결 오류가 발생하면 컨테이너가 아직 시작 중일 수 있습니다. 몇 초 기다린 다음 다시 시도하세요.

3. OpenSearch 데이터베이스를 지식 베이스로 Langflow에 연결하려면 **Settings**를 클릭한 다음 **DB Providers**를 클릭합니다.

4. **OpenSearch**를 선택합니다.

5. 로컬 OpenSearch 컨테이너에 대해 다음 값을 입력합니다.

  - **Cluster URL**: `http://localhost:9200`을 입력합니다.
  - **Username**: 보안이 비활성화된 경우 비워둡니다. 그렇지 않으면 기본 인증 사용자 이름을 입력합니다.
  - **Password**: 보안이 비활성화된 경우 비워둡니다. 그렇지 않으면 기본 인증 비밀번호를 입력합니다.
  - **Default Index name**: `langflow_knowledge`를 입력합니다. 읽고 쓸 OpenSearch 인덱스입니다. 이 인덱스는 이후 수집 단계에서 생성되므로 즉시 사용할 수는 없습니다.
  - **Vector field**: `vector_field`를 입력합니다. 임베딩 벡터를 저장하는 문서 필드입니다.
  - **Text field**: `text`를 입력합니다. 청크 텍스트를 저장하는 문서 필드입니다.
  - **Use TLS (HTTPS)**: 끕니다. 클러스터가 HTTPS를 사용하는 경우 활성화하세요.
  - **Verify TLS certificate**: 끕니다. 클러스터가 CA 서명 인증서를 사용하는 경우 활성화하세요.

  tip
      지식 베이스 이름이 OpenSearch 인덱스 이름과 일치할 필요는 없습니다. 이는 공유 OpenSearch 인덱스 내에서 검색 범위를 지정하는 데 사용되는 내부 레이블일 뿐입니다.

6. **Save and Use OpenSearch**를 클릭합니다.

    선택적으로, 저장 전에 Langflow가 OpenSearch 클러스터에 도달할 수 있는지 확인하려면 **Test Connection**을 클릭하세요.

    이제 OpenSearch 데이터베이스가 지식 베이스 프로바이더로 Langflow에 연결되었습니다.

이 프로바이더로 지식 베이스를 생성하려면 [지식 베이스 생성하기](#create-a-knowledge-base)를 참고하세요.

## 참고 자료[​](#see-also "Direct link to See also")

- [Langflow 에이전트 사용하기](https://docs.langflow.org/agents)
- [언어 모델 컴포넌트](https://docs.langflow.org/components-models)
