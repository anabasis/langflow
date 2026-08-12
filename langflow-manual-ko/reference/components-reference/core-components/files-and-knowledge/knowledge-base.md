# Knowledge Base

> 원문: https://docs.langflow.org/next/knowledge-base

Langflow 지식 베이스(knowledge base)는 Langflow 스토리지에 저장되는 로컬 벡터 데이터베이스입니다.

지식 베이스는 로컬에 저장되기 때문에, 플로우를 실행할 때마다 데이터를 원격으로 요청하고 다시 색인화(ingest)할 필요가 없습니다.
이는 원격 벡터 데이터베이스를 사용하는 것보다 효율적일 수 있으며, 고객 및 제품 데이터의 일부와 같이 사용자 정의된 도메인 특화 데이터셋을 사용하는 플로우에 적합한 선택입니다.

지식 베이스 컴포넌트는 벡터 스토어 컴포넌트와 거의 같은 방식으로 사용할 수 있습니다.
그러나 다음과 같은 몇 가지 주요 차이점이 있습니다.

- **로컬 저장**: Langflow 지식 베이스는 전적으로 로컬에 저장됩니다.
이에 비해 일부 벡터 스토어 컴포넌트만 로컬 데이터베이스를 지원합니다.
- **내장 임베딩 모델**: Langflow 지식 베이스는 여러 임베딩 모델을 기본적으로 지원합니다.
지식 베이스에서는 다른 모델을 사용할 수 없습니다.
다른 제공업체나 모델을 사용하려면 원하는 임베딩 모델 컴포넌트와 함께 벡터 스토어 컴포넌트를 사용해야 합니다.
- **기본적인 유사도 검색**: Langflow 지식 베이스를 조회할 때는 표준 유사도 검색만 지원됩니다.
더 고급 검색이 필요하다면 원하는 기능을 지원하는 벡터 데이터베이스 제공업체용 벡터 스토어 컴포넌트를 사용해야 합니다.
- **구조화된 데이터**: Langflow 지식 베이스는 구조화된 데이터만 지원합니다.
비구조화된 데이터의 경우 호환되는 벡터 스토어 컴포넌트를 사용해야 합니다.

**Knowledge Base** 컴포넌트는 시맨틱 검색을 사용하여 기존 지식 베이스에서 데이터를 읽어옵니다.

출력은 조회된 지식 베이스에서 가장 일치도가 높은 결과를 담은 [`Table`](https://docs.langflow.org/data-types#table)입니다.

## Knowledge Base 파라미터[​](#knowledge-base-parameters "Direct link to Knowledge Base parameters")

일부 파라미터는 비주얼 에디터에서 기본적으로 숨겨져 있습니다.
컴포넌트를 선택했을 때 나타나는 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-inspection-panel)을 통해 모든 컴포넌트 파라미터를 수정할 수 있습니다.

| 이름              | 표시 이름               | 설명                                                                                                                                                                                                                           |
| ----------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| knowledge\_base   | Knowledge                  | 입력 파라미터. 데이터를 가져올 지식 베이스를 선택합니다.                                                                                                                                                                            |
| api\_key          | Embedding Provider API Key | 입력 파라미터. 기존에 제공된 키를 재정의하기 위한 임베딩 제공업체의 선택적 API 키입니다. 임베딩 제공업체와 모델은 지식 베이스를 생성할 때 선택됩니다.                                                                                        |
| search\_query     | Search Query               | 입력 파라미터. 시맨틱 유사도를 사용하여 지식 베이스 데이터를 필터링하기 위한 선택적 검색어입니다. 생략하면 임의의 정렬 순서로 상위 결과가 반환됩니다.                                                                                     |
| top\_k            | Top K Results              | 입력 파라미터. 반환할 검색 결과 수입니다. 기본값: `5`.                                                                                                                                                                            |
| include\_metadata | Include Metadata           | 입력 파라미터. 출력에 모든 메타데이터와 임베딩을 포함할지 여부입니다. 활성화하면 각 출력 행에 모든 메타데이터, 임베딩, 콘텐츠가 포함됩니다. 비활성화하면 콘텐츠만 반환됩니다. 기본값: 활성화(true).                                     |

## 플로우에서 Knowledge Base 컴포넌트 사용하기[​](#use-the-knowledge-base-component-in-a-flow "Direct link to Use the Knowledge Base component in a flow")

[지식 베이스](https://docs.langflow.org/knowledge)를 생성하고 데이터를 로드한 후에는, 어떤 플로우에서든 **Knowledge Base** 컴포넌트를 사용하여 시맨틱 검색으로 지식 베이스에서 데이터를 검색할 수 있습니다.

1. 플로우에 **Knowledge Base** 컴포넌트를 추가합니다.

2. **Knowledge** 필드에서, 이전 단계에서 만든 고객 판매 데이터 지식 베이스와 같이 검색하려는 지식 베이스를 선택합니다.

3. 검색 결과를 채팅 메시지로 확인하려면 **Results** 출력을 **Chat Output** 컴포넌트에 연결합니다.

4. **Search query**에 임베딩된 데이터와 관련된 쿼리를 입력합니다.

    고객 판매 데이터 예시의 경우, `laptop`이나 `wireless devices`와 같은 제품명을 입력합니다.

5. **Knowledge Base** 컴포넌트에서 **Run component**를 클릭한 뒤 **Playground**를 열어 출력을 확인합니다.

## 참고 자료[​](#see-also "Direct link to See also")

- [벡터 데이터 관리](https://docs.langflow.org/knowledge)
