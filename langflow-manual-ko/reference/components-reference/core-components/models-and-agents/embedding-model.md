# 임베딩 모델

> 원문: https://docs.langflow.org/next/components-embedding-models

임베딩 모델 컴포넌트는 지정된 대규모 언어 모델(LLM)을 사용하여 텍스트 임베딩을 생성합니다.

Langflow에는 일부 LLM을 기본으로 지원하는 **Embedding Model** 코어 컴포넌트가 포함되어 있습니다.
또는 **Embedding Model** 코어 컴포넌트 대신 [추가 임베딩 모델](#additional-embedding-models)을 사용할 수도 있습니다.

## 플로우에서 임베딩 모델 컴포넌트 사용하기[​](#use-embedding-model-components-in-a-flow "Direct link to Use embedding model components in a flow")

플로우 내에서 임베딩을 생성해야 하는 어디든 임베딩 모델 컴포넌트를 사용할 수 있습니다.

이 예시는 플로우에서 임베딩 모델 컴포넌트를 사용하여 의미 기반 검색 시스템을 만드는 방법을 보여줍니다.
이 플로우는 텍스트 파일을 로드하고, 텍스트를 청크로 분할하고, 각 청크에 대한 임베딩을 생성한 다음, 청크와 임베딩을 벡터 스토어에 로드합니다. 입력 및 출력 컴포넌트를 통해 사용자는 채팅 인터페이스로 벡터 스토어를 쿼리할 수 있습니다.

![Embedding Model, File, Split Text, Chroma DB, Chat Input, Chat Output 컴포넌트를 사용하는 의미 기반 검색 플로우](https://docs.langflow.org/assets/images/component-embedding-models-add-chat-fec505c7d61c7bddc37eeb1d4cb9d489.png)

1. 플로우를 만들고 **Read File** 컴포넌트를 추가한 다음, 플로우 테스트에 사용할 수 있는 PDF와 같은 텍스트 데이터가 담긴 파일을 선택합니다.

2. Langflow의 전역 모델 공급자 설정을 편집하려면 다음을 수행합니다.

  1. **Model Providers** 창을 열려면 프로필 아이콘을 클릭하고 **Settings**를 선택한 다음 **Model Providers**를 클릭합니다.

  2. **Model Providers** 창에서 공급자를 선택합니다.

  3. **API Key** 필드에 해당 공급자의 API 키를 추가합니다.

        이 키는 플로우에서 사용하려는 모델을 호출할 권한이 있어야 하며, 계정에는 수행하려는 작업에 필요한 만큼의 크레딧이 있어야 합니다.

        공급자별로 키는 하나만 추가할 수 있습니다. Langflow에서 사용하려는 *모든* 모델에 대한 접근 권한이 해당 키에 있는지 확인하세요.

  4. Langflow에서 사용할 특정 모델을 활성화합니다.
사용 가능한 모델은 공급자와 API 키의 권한에 따라 달라집니다.
텍스트를 생성하는 모델은 **Language Models** 아래에 나열됩니다.
임베딩을 생성하는 모델은 **Embedding Models** 아래에 나열됩니다.

    Langflow의 전역 모델 설정에서 모델을 활성화하면, 플로우 내 모든 모델 기반 컴포넌트에서 해당 모델을 사용할 수 있습니다.

  
  원하는 공급자나 모델이 목록에 없는 경우
      원하는 임베딩 모델 공급자나 모델이 Langflow의 전역 **Models**에서 사용할 수 없다면, 코어 컴포넌트 대신 [추가 임베딩 모델](#additional-embedding-models)을 사용할 수 있습니다.

    원하는 공급자를 찾으려면 [**Bundles**](https://docs.langflow.org/components-bundle-components)를 둘러보거나 **Search**를 이용하세요. 예를 들어 [**Hugging Face Embeddings Inference** 컴포넌트](https://docs.langflow.org/bundles-huggingface#hugging-face-embeddings-inference)가 있습니다.

3. 플로우에 **Embedding Model** 코어 컴포넌트를 추가한 다음, **Embedding Model** 드롭다운에서 구성한 임베딩 모델을 선택합니다.

4. 플로우에 [**Split Text** 컴포넌트](https://docs.langflow.org/split-text)를 추가합니다.
이 컴포넌트는 텍스트 입력을 임베딩으로 처리할 더 작은 청크로 분할합니다.

5. 플로우에 **Chroma DB** 컴포넌트와 같은 벡터 스토어 컴포넌트를 추가한 다음, 해당 컴포넌트가 벡터 데이터베이스에 연결되도록 구성합니다.
이 컴포넌트는 생성된 임베딩을 저장하여 유사도 검색에 사용될 수 있게 합니다.

6. 컴포넌트를 연결합니다.

  - **Read File** 컴포넌트의 **Loaded Files** 출력을 **Split Text** 컴포넌트의 **JSON or Table** 입력에 연결합니다.
  - **Split Text** 컴포넌트의 **Chunks** 출력을 벡터 스토어 컴포넌트의 **Ingest Data** 입력에 연결합니다.
  - **Embedding Model** 컴포넌트의 **Embeddings** 출력을 벡터 스토어 컴포넌트의 **Embedding** 입력에 연결합니다.

7. 벡터 스토어를 쿼리하려면 [**Chat Input 및 Output** 컴포넌트](https://docs.langflow.org/chat-input-and-output)를 추가합니다.

  - **Chat Input** 컴포넌트를 벡터 스토어 컴포넌트의 **Search Query** 입력에 연결합니다.
  - 벡터 스토어 컴포넌트의 **Search Results** 출력을 **Chat Output** 컴포넌트에 연결합니다.

8. **Playground**를 클릭한 다음, 쿼리와 의미적으로 가장 유사한 텍스트 청크를 검색할 검색어를 입력합니다.

## Embedding Model 매개변수[​](#embedding-model-parameters "Direct link to Embedding Model parameters")

다음 매개변수는 **Embedding Model** 코어 컴포넌트에 해당합니다.
다른 임베딩 모델 컴포넌트에는 추가적이거나 다른 매개변수가 있을 수 있습니다.

일부 매개변수는 비주얼 에디터에서 기본적으로 숨겨져 있습니다.
컴포넌트를 선택했을 때 나타나는 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-inspection-panel)을 통해 모든 컴포넌트 매개변수를 수정할 수 있습니다.

| 이름                | 표시 이름      | 유형       | 설명                                                                                                                                     |
| ------------------- | ----------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| provider            | Model Provider    | List       | 입력 매개변수. 임베딩 모델 공급자를 선택합니다. 모델은 **Models** 창에서 전역적으로 구성됩니다.                                    |
| model               | Model Name        | List       | 입력 매개변수. 사용할 임베딩 모델을 선택합니다. 옵션은 선택한 공급자에 따라 다르며 **Models** 창에서 전역적으로 구성됩니다. |
| api\_base           | API Base URL      | String     | 입력 매개변수. API의 기본 URL입니다. 기본값을 사용하려면 비워 둡니다.                                                                                 |
| dimensions          | Dimensions        | Integer    | 입력 매개변수. 출력 임베딩의 차원 수입니다.                                                                                            |
| chunk\_size         | Chunk Size        | Integer    | 입력 매개변수. 처리할 텍스트 청크의 크기입니다. 기본값: `1000`.                                                                           |
| request\_timeout    | Request Timeout   | Float      | 입력 매개변수. API 요청에 대한 타임아웃입니다.                                                                                                      |
| max\_retries        | Max Retries       | Integer    | 입력 매개변수. 최대 재시도 횟수입니다. 기본값: `3`.                                                                                |
| show\_progress\_bar | Show Progress Bar | Boolean    | 입력 매개변수. 임베딩 생성 중 진행률 표시줄을 표시할지 여부입니다.                                                                                 |
| model\_kwargs       | Model Kwargs      | Dictionary | 입력 매개변수. 모델에 전달할 추가 키워드 인수입니다.                                                                             |
| embeddings          | Embeddings        | Embeddings | 출력 매개변수. 선택한 공급자를 사용하여 임베딩을 생성하는 인스턴스입니다.                                                                            |

## 추가 임베딩 모델[​](#additional-embedding-models "Direct link to Additional embedding models")

원하는 공급자나 모델이 Langflow의 전역 **Models**에서 사용할 수 없다면, **Embedding Model** 코어 컴포넌트를 임베딩을 생성하는 다른 컴포넌트로 교체할 수 있습니다.

추가 임베딩 모델 컴포넌트를 찾으려면 [**Bundles**](https://docs.langflow.org/components-bundle-components)를 둘러보거나 원하는 공급자를 **Search**로 찾아보세요.

## 모델과 벡터 스토어 결합하기[​](#pair-models-with-vector-stores "Direct link to Pair models with vector stores")

설계상 벡터 데이터는 챗봇이나 에이전트와 같은 LLM 애플리케이션에서 필수적입니다.

일반적인 채팅 상호작용과 흔한 작업에는 LLM만으로도 충분하지만, (RAG와 같은) 컨텍스트 민감성과 (내부 비즈니스 데이터와 같은) 사용자 지정 데이터셋을 통해 애플리케이션을 한 단계 발전시킬 수 있습니다.
이를 위해서는 대개 추가 컨텍스트를 제공하고 의미 있는 쿼리를 정의하는 벡터 데이터베이스와 벡터 검색의 통합이 필요합니다.

Langflow에는 임베딩 저장, 유사도 검색, Graph RAG 순회, OpenSearch와 같은 전용 검색 인스턴스를 포함해 벡터 데이터를 읽고 쓸 수 있는 벡터 스토어 컴포넌트가 포함되어 있습니다.
이들은 서로 의존적인 기능을 갖고 있기 때문에, 벡터 스토어, 언어 모델, 임베딩 모델 컴포넌트를 동일한 플로우 또는 일련의 종속 플로우 내에서 함께 사용하는 것이 일반적입니다.

사용 가능한 벡터 스토어 컴포넌트를 찾으려면 [**Bundles**](https://docs.langflow.org/components-bundle-components)를 둘러보거나 원하는 벡터 데이터베이스 공급자를 **Search**로 찾아보세요.

**예시: 벡터 검색 플로우**

팁

플로우에서 벡터 데이터를 사용하는 튜토리얼은 [벡터 RAG 챗봇 만들기](https://docs.langflow.org/chat-with-rag)를 참조하세요.

다음 예시는 임베딩 모델 및 언어 모델 컴포넌트와 같은 관련 컴포넌트와 함께 벡터 스토어 컴포넌트를 플로우에서 사용하는 방법을 보여줍니다.
이 단계들은 이러한 컴포넌트를 효과적으로 사용하기 위한 중요한 구성 세부사항, 기능, 모범 사례를 다룹니다.
이는 하나의 예시일 뿐이며, 가능한 모든 사용 사례나 구성에 대한 규범적인 가이드는 아닙니다.

1. **Vector Store RAG** 템플릿으로 플로우를 만듭니다.

    이 템플릿에는 두 개의 서브플로우가 있습니다.
**Load Data** 서브플로우는 임베딩과 콘텐츠를 벡터 데이터베이스에 로드하고, **Retriever** 서브플로우는 사용자 쿼리를 기반으로 관련 컨텍스트를 검색하기 위한 벡터 검색을 실행합니다.

2. 두 [**Astra DB** 컴포넌트](https://docs.langflow.org/bundles-datastax#astra-db) 모두에 대해 데이터베이스 연결을 구성하거나, 원하는 다른 벡터 스토어 컴포넌트 쌍으로 교체합니다.
컴포넌트들이 동일한 벡터 스토어에 연결되고, **Retriever** 서브플로우의 컴포넌트가 유사도 검색을 실행할 수 있는지 확인하세요.

    각 벡터 스토어 컴포넌트에 설정하는 매개변수는 플로우 내에서 해당 컴포넌트의 역할에 따라 달라집니다.
이 예시에서 **Load Data** 서브플로우는 벡터 스토어에 *쓰고*, **Retriever** 서브플로우는 벡터 스토어에서 *읽습니다*.
따라서 검색 관련 매개변수는 **Retriever** 서브플로우 내의 **Vector Search** 컴포넌트에만 관련이 있습니다.

    특정 매개변수에 대한 정보는 선택한 벡터 스토어 컴포넌트의 문서를 참조하세요.

3. 임베딩 모델을 구성하려면 다음 중 하나를 수행합니다.

  - **OpenAI 모델 사용**: 두 **OpenAI Embeddings** 컴포넌트 모두에 OpenAI API 키를 입력합니다.
기본 모델을 사용하거나 다른 OpenAI 임베딩 모델을 선택할 수 있습니다.

  - **다른 공급자 사용**: **OpenAI Embeddings** 컴포넌트를 원하는 다른 [임베딩 모델 컴포넌트](https://docs.langflow.org/components-embedding-models) 쌍으로 교체한 다음, 매개변수와 자격 증명을 그에 맞게 구성합니다.

  - **Astra DB 벡터화 사용**: 벡터화 통합 기능이 있는 Astra DB 벡터 스토어를 사용하는 경우, 두 **OpenAI Embeddings** 컴포넌트를 모두 제거할 수 있습니다.
이렇게 하면 벡터화 통합이 **Ingest Data**(**Load Data** 서브플로우 내)와 **Search Query**(**Retriever** 서브플로우 내)로부터 자동으로 임베딩을 생성합니다.

  
  팁
      벡터 스토어에 이미 임베딩이 포함되어 있다면, 임베딩 모델 컴포넌트가 기존 임베딩과 동일한 모델을 사용하도록 하세요.
동일한 벡터 스토어에서 서로 다른 임베딩 모델을 혼용하면 부정확한 검색 결과가 나올 수 있습니다.

4. 권장 사항: [**Split Text** 컴포넌트](https://docs.langflow.org/split-text)에서 임베딩 모델에 맞게 청킹 설정을 최적화하세요.
예를 들어, 임베딩 모델의 토큰 한도가 512라면 **Chunk Size** 매개변수가 이 한도를 초과해서는 안 됩니다.

    또한 **Retriever** 서브플로우가 채팅 입력을 벡터 검색을 위해 벡터 스토어 컴포넌트로 직접 전달하므로, 채팅 입력 문자열이 임베딩 모델의 한도를 초과하지 않도록 하세요.
이 예시에서는 한도 내에 있는 쿼리를 입력할 수 있지만, 프로덕션 환경에서는 준수를 보장하기 위해 추가적인 검사나 전처리 단계를 구현해야 할 수 있습니다.
예를 들어, 벡터 검색을 실행하기 전에 채팅 입력을 준비하는 추가 컴포넌트를 사용하거나, 애플리케이션 코드에서 채팅 입력 한도를 강제할 수 있습니다.

5. **Language Model** 컴포넌트에 OpenAI API 키를 입력하거나, 플로우의 채팅 부분에 사용할 다른 공급자와 모델을 선택합니다.

6. **Load Data** 서브플로우를 실행하여 벡터 스토어를 채웁니다.
**Read File** 컴포넌트에서 하나 이상의 파일을 선택한 다음, **Load Data** 서브플로우 내 벡터 스토어 컴포넌트에서 **Run component**를 클릭합니다.

    **Load Data** 서브플로우는 로컬 머신에서 파일을 로드하고, 청크로 분할하고, 청크에 대한 임베딩을 생성한 다음, 청크와 그 임베딩을 벡터 데이터베이스에 저장합니다.

    ![벡터 스토어로 데이터 임베딩하기](https://docs.langflow.org/assets/images/vector-store-document-ingestion-6157311fb4d16e7f944d55254f0cc0e2.png)

    **Load Data** 서브플로우는 채팅을 사용할 때마다 실행할 필요가 없기 때문에 **Retriever** 서브플로우와 분리되어 있습니다.
벡터 스토어의 데이터를 미리 로드하거나 업데이트해야 할 때 필요에 따라 **Load Data** 서브플로우를 실행할 수 있습니다.
그러면 채팅 상호작용은 채팅에 필요한 컴포넌트만 사용하게 됩니다.

    벡터 검색에 사용하려는 데이터가 벡터 스토어에 이미 있다면, **Load Data** 서브플로우를 실행할 필요가 없습니다.

7. **Playground**를 열고 채팅을 시작하여 **Retriever** 서브플로우를 실행합니다.

    **Retriever** 서브플로우는 채팅 입력으로부터 임베딩을 생성하고, 벡터 검색을 실행해 벡터 스토어에서 유사한 콘텐츠를 검색하고, 검색 결과를 LLM을 위한 보충 컨텍스트로 파싱한 다음, LLM을 사용해 쿼리에 대한 자연어 응답을 생성합니다.
LLM은 벡터 검색 결과를 자체 내부 학습 데이터 및 기본 웹 검색, 날짜/시간 정보와 같은 도구와 함께 사용하여 응답을 생성합니다.

    ![벡터 스토어에서 검색하기](https://docs.langflow.org/assets/images/vector-store-retrieval-af7257d77ff0259ab1a0980641d464ce.png)

    검색 결과 원본 전체를 LLM에 전달하지 않기 위해, **Parser** 컴포넌트는 검색 결과 `JSON` 객체에서 `text` 문자열을 추출한 다음 `Message` 형식으로 **Prompt Template** 컴포넌트에 전달합니다.
이후 해당 문자열과 다른 템플릿 콘텐츠가 결합되어 LLM을 위한 자연어 지시문으로 컴파일됩니다.

    검색 결과를 어떻게 활용하고 싶은지에 따라 **JSON Operations** 컴포넌트 등 다른 컴포넌트를 이 변환에 사용할 수도 있습니다.

    원본 검색 결과를 확인하려면, **Retriever** 서브플로우를 실행한 후 벡터 스토어 컴포넌트에서 **Inspect output**을 클릭하세요.
