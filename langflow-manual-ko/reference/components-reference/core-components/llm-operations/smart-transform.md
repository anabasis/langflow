# Smart Transform

> 원문: https://docs.langflow.org/next/smart-transform

이 컴포넌트는 여러 차례 이름이 변경되었습니다.
이전 이름에는 **Lambda Filter**와 **Smart Function**이 있습니다.

**Smart Transform** 컴포넌트는 LLM과 자연어 지침을 사용하여 [`JSON`](https://docs.langflow.org/data-types#json), [`Table`](https://docs.langflow.org/data-types#table), 또는 [`Message`](https://docs.langflow.org/data-types#message) 입력을 필터링하거나 변환할 수 있는 Lambda 함수를 생성합니다.
이 컴포넌트는 [언어 모델 컴포넌트](https://docs.langflow.org/components-models)에 연결해야 하며, 이 모델은 **Instructions** 파라미터에 제공한 자연어 지침을 기반으로 함수를 생성하는 데 사용됩니다.
LLM은 입력에 대해 함수를 실행한 다음, 결과를 [`JSON`](https://docs.langflow.org/data-types#json), [`Table`](https://docs.langflow.org/data-types#table), 또는 [`Message`](https://docs.langflow.org/data-types#message)로 출력합니다.

tip

원하는 결과나 구체적인 동작에 초점을 맞춰 간결하고 명확한 지침을 제공하세요. 예: `Filter the data to only include items where the 'status' is 'active'`.
마침표와 같은 종결 구두점이 오류나 예기치 않은 동작을 일으킬 수 있으므로, 한 문장 이하로 작성하는 것이 좋습니다.

Lambda 함수와 직접적인 관련이 없는 더 상세한 지침을 제공해야 하는 경우, **Language Model** 컴포넌트의 **Input** 필드나 **Prompt Template** 컴포넌트를 통해 입력할 수 있습니다.

가장 신뢰할 수 있는 결과를 얻으려면, **Smart Transform** 컴포넌트의 출력 타입이 입력 타입과 일치해야 합니다. 예를 들어 [`Message`](https://docs.langflow.org/data-types#message) 입력에는 **Message** 출력을 선택하세요.

다음 예제는 **API Request** 엔드포인트를 사용하여 `https://jsonplaceholder.typicode.com/users` 엔드포인트에서 JSON 데이터를 **Smart Transform** 컴포넌트로 전달합니다.
그런 다음, **Smart Transform** 컴포넌트는 데이터와 `extract emails` 지침을 연결된 **Language Model** 컴포넌트로 전달합니다.
여기서 LLM은 JSON 데이터에서 이메일 주소를 추출하는 필터 함수를 생성하고, 필터링된 데이터를 채팅 출력으로 반환합니다.

![API 응답에서 데이터를 추출하기 위해 Smart Transform 컴포넌트를 사용하는 작은 플로우.](https://docs.langflow.org/assets/images/component-lambda-filter-76cd345c52fa41a59dcfac0205dc3068.png)

## Smart Transform 파라미터[​](#smart-transform-parameters "Direct link to Smart Transform parameters")

기본적으로 일부 파라미터는 시각적 편집기에서 숨겨져 있습니다.
컴포넌트를 선택했을 때 표시되는 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-inspection-panel)을 통해 모든 컴포넌트 파라미터를 수정할 수 있습니다.

| Name                | Display Name   | Info                                                                                                                                                                                 |
| ------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| data                | JSON           | 입력 파라미터. 생성된 Lambda 함수를 사용하여 필터링하거나 변환할 [`JSON`](https://docs.langflow.org/data-types#json), [`Table`](https://docs.langflow.org/data-types#table), 또는 [`Message`](https://docs.langflow.org/data-types#message) 입력입니다. |
| model               | Language Model | 입력 파라미터. **Language Model** 컴포넌트에서 [`LanguageModel`](https://docs.langflow.org/data-types#languagemodel) 출력을 연결합니다.                                                                    |
| filter\_instruction | Instructions   | 입력 파라미터. 데이터를 어떻게 필터링하거나 변환할지에 대한 자연어 지침입니다. LLM은 이 지침을 사용하여 Lambda 함수를 생성합니다.                             |
| sample\_size        | Sample Size    | 입력 파라미터. 대규모 데이터셋의 경우, 데이터셋의 앞부분과 뒷부분에서 샘플링할 문자 수입니다. 데이터셋이 `max_​size` 이상일 때만 적용됩니다. 기본값: `1000`.   |
| max\_size           | Max Size       | 입력 파라미터. 데이터셋을 대규모로 간주하여 `sample_​size` 값에 따른 샘플링을 트리거하는 문자 수입니다. 기본값: `30000`.                             |
