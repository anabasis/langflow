# Batch Run

> 원문: https://docs.langflow.org/next/batch-run

**Batch Run** 컴포넌트는 [`Table`](https://docs.langflow.org/data-types#table)의 *하나의 텍스트 열에 있는 각 행*에 대해 언어 모델을 실행한 다음, 원본 텍스트와 LLM 응답이 포함된 새로운 `Table`을 반환합니다.
출력에는 다음과 같은 열이 포함됩니다.

- `text_input`: 입력 `Table`의 원본 텍스트
- `model_response`: 각 입력에 대한 모델의 응답
- `batch_index`: `Table`의 모든 행에 대한 0부터 시작하는 처리 순서
- `metadata` (선택 사항): 처리에 관한 추가 정보

## 플로우에서 Batch Run 컴포넌트 사용하기[​](#use-the-batch-run-component-in-a-flow "Direct link to Use the Batch Run component in a flow")

**Batch Run**의 출력을 [**Parser** 컴포넌트](https://docs.langflow.org/parser)에 전달하면, 파싱 템플릿에서 `{text_input}`, `{model_response}`와 같은 변수를 사용하여 이 키들을 참조할 수 있습니다.
다음 예제에서 이를 보여줍니다.

![OpenAI와 Parser에 연결된 batch run 컴포넌트](https://docs.langflow.org/assets/images/component-batch-run-19c94fbb0646b2731b37013b84dff1f6.png)

1. 언어 모델 컴포넌트를 **Batch Run** 컴포넌트의 **Language model** 포트에 연결합니다.

2. 다른 컴포넌트의 `Table` 출력을 **Batch Run** 컴포넌트의 **DataFrame** 입력에 연결합니다.
예를 들어 CSV 파일이 있는 **Read File** 컴포넌트를 연결할 수 있습니다.

3. **Batch Run** 컴포넌트의 **Column Name** 필드에, 처리할 텍스트가 포함된 수신 `Table`의 열 이름을 입력합니다.
예를 들어 CSV 파일의 `name` 열에서 텍스트를 추출하려면 **Column Name** 필드에 `name`을 입력하세요.

4. **Batch Run** 컴포넌트의 **Batch Results** 출력을 **Parser** 컴포넌트의 **DataFrame** 입력에 연결합니다.

5. 선택 사항: **Batch Run**의 [컴포넌트 메뉴](https://docs.langflow.org/concepts-components#component-menus)에서 **System Message** 파라미터를 활성화하고 **Close**를 클릭한 다음, LLM이 파일에서 추출한 각 셀을 어떻게 처리하기를 원하는지에 대한 지침을 입력합니다.
예: `Create a business card for each name.`

6. **Parser** 컴포넌트의 **Template** 필드에, **Batch Run** 컴포넌트의 새 `Table` 열(`text_input`, `model_response`, `batch_index`)을 처리하기 위한 템플릿을 입력합니다.

    예를 들어 다음 템플릿은 배치 처리 후 결과로 생성된 `Table`의 세 열을 사용합니다.

  
  ```
  record_number: {batch_index}, name: {text_input}, summary: {model_response}
  ```

7. 처리를 테스트하려면 **Parser** 컴포넌트를 클릭하고 **Run component**를 클릭한 다음, **Inspect output**을 클릭하여 최종 `Table`을 확인합니다.

    **Playground**에서 출력을 확인하고 싶다면 **Parser** 컴포넌트에 **Chat Output** 컴포넌트를 연결할 수도 있습니다.

## Batch Run 파라미터[​](#batch-run-parameters "Direct link to Batch Run parameters")

기본적으로 일부 파라미터는 시각적 편집기에서 숨겨져 있습니다.
컴포넌트를 선택했을 때 표시되는 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-inspection-panel)을 통해 모든 컴포넌트 파라미터를 수정할 수 있습니다.

| Name                 | Type             | Description                                                                                                               |
| -------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| model                | HandleInput      | 입력 파라미터. 언어 모델 컴포넌트의 'Language Model' 출력을 연결합니다. 필수입니다.                           |
| system\_message      | MultilineInput   | 입력 파라미터. DataFrame의 모든 행에 대한 여러 줄 시스템 지침입니다.                                           |
| df                   | DataFrameInput   | 입력 파라미터. `column_name`으로 지정된 열이 텍스트 메시지로 취급되는 DataFrame입니다. 필수입니다.        |
| column\_name         | MessageTextInput | 입력 파라미터. 텍스트 메시지로 취급할 DataFrame 열의 이름입니다. 비어 있으면 모든 열이 TOML 형식으로 포맷됩니다. |
| output\_column\_name | MessageTextInput | 입력 파라미터. 모델의 응답이 저장되는 열의 이름입니다. 기본값=`model_response`.                       |
| enable\_metadata     | BoolInput        | 입력 파라미터. `True`이면 출력 DataFrame에 메타데이터를 추가합니다.                                                         |
| batch\_results       | Table            | 출력 파라미터. 모든 원본 열과 모델의 응답 열이 포함된 DataFrame입니다.                                 |
