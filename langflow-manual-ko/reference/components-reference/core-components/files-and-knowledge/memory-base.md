# Memory Base

> 원문: https://docs.langflow.org/next/memory-base

메모리 베이스(memory base)는 각 플로우 실행 이후 대화 메시지를 자동으로 색인화하는 플로우별 벡터 스토어입니다.
Memory Base 컴포넌트는 시맨틱 검색을 사용하여 현재 플로우에 연결된 [메모리 베이스](https://docs.langflow.org/next/memory-bases)에서 컨텍스트를 검색합니다.
가장 관련성이 높은 대화 청크(chunk)가 [DataFrame](https://docs.langflow.org/data-types#dataframe)으로 반환됩니다.

## Memory Base 파라미터[​](#memory-base-parameters "Direct link to Memory Base parameters")

일부 파라미터는 비주얼 에디터에서 기본적으로 숨겨져 있습니다.
컴포넌트를 선택했을 때 나타나는 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-inspection-panel)을 통해 모든 컴포넌트 파라미터를 수정할 수 있습니다.

| 이름                  | 표시 이름      | 설명                                                                                                                                                                                                     |
| --------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `memory_​base`        | Memory Base       | 입력 파라미터. 검색할 메모리 베이스를 선택합니다. 현재 플로우에 연결된 메모리 베이스만 목록에 표시됩니다. 새 메모리 베이스를 생성한 후에는 새로고침 버튼을 클릭하여 목록을 다시 불러오세요.              |
| `search_​query`       | Search Query      | 입력 파라미터. 시맨틱 검색에 사용되는 쿼리 문자열입니다. 비어 있으면 결과가 반환되지 않습니다. 에이전트 사용을 위한 Tool Mode를 지원합니다.                                                              |
| `top_​k`              | Top K Results     | 입력 파라미터. 반환할 상위 결과 수입니다. 기본값: `5`.                                                                                                                                                    |
| `include_​metadata`   | Include Metadata  | 입력 파라미터. 각 출력 행에 청크 메타데이터(세션 ID, 발신자, 타임스탬프 등)를 포함할지 여부입니다. 기본값: 활성화.                                                                                       |
| `filter_​by_​session` | Filter by Session | 입력 파라미터. 활성화하면 현재 `session_​id`의 청크만 반환됩니다. 이 메모리 베이스에 색인화된 모든 세션에서 검색하려면 비활성화하세요. 이는 대화 간 회상(cross-conversation recall)에 유용합니다. 기본값: 활성화. |

출력은 **Results**라는 이름의 `DataFrame`이며, 각 행은 일치하는 하나의 메모리 청크를 나타냅니다.

**Include Metadata**가 활성화된 경우, 각 행에는 `session_id`, `sender`, `sender_name`, `timestamp`와 같은 필드도 포함됩니다.

검색어가 제공된 경우, 각 행에는 유사도 점수를 나타내는 `_score` 필드가 포함됩니다.

## 플로우에서 Memory Base 컴포넌트 사용하기[​](#use-the-memory-base-component-in-a-flow "Direct link to Use the Memory Base component in a flow")

자세한 내용은 [메모리 베이스 관리](https://docs.langflow.org/next/memory-bases)를 참고하세요.
