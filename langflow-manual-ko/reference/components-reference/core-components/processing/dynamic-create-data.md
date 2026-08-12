# Dynamic Create Data

> 원문: https://docs.langflow.org/next/dynamic-create-data

**Dynamic Create Data** 컴포넌트는 설정 가능한 필드를 가진 [`JSON`](https://docs.langflow.org/data-types#json) 객체나 [`Message`](https://docs.langflow.org/data-types#message)를 생성합니다.
**Input Configuration** 필드에서 테이블을 정의하면 컴포넌트가 그에 맞는 입력 또는 출력 핸들을 생성합니다.

## 플로우에서 Dynamic Create Data 컴포넌트 사용하기[​](#use-the-dynamic-create-data-component-in-a-flow "Direct link to Use the Dynamic Create Data component in a flow")

다음 예제는 **Dynamic Create Data** 컴포넌트를 사용하여 여러 소스로부터 구조화된 `JSON` 또는 `Message` 객체를 생성하는 방법을 보여줍니다.

1. 플로우에 **Dynamic Create Data** 컴포넌트를 추가합니다.

2. 데이터의 필드를 정의하려면 **Input Configuration** 필드에서 **Open table**을 클릭합니다.

3. 테이블에 행을 추가하려면 **Add a new row**를 클릭합니다.
새 행을 추가하면 **Field Type**에 대한 입력 및 출력 핸들이 생성됩니다.
예를 들어 `Text` 유형 필드를 추가하면 컴포넌트에 `Text` 입력과 출력 핸들이 추가됩니다.
각 새 행에 대해 **Field Name**과 **Field Type**을 설정하세요.

  - **Field Name**: 내부 키와 표시 라벨로 모두 사용되는 필드의 이름입니다.
  - **Field Type**: 생성할 입력 필드의 유형입니다. 유형 옵션은 다음과 같습니다.
    * Text: 직접 텍스트 입력을 받거나 다른 컴포넌트로부터 `Text` 또는 `Message` 출력을 받습니다.
    * Data: 다른 컴포넌트로부터 `JSON` 입력을 받습니다.
    * Number: 직접 숫자 입력을 받거나 다른 컴포넌트로부터 `Text` 또는 `Message` 출력을 받습니다.
    * Handle: 다른 컴포넌트로부터 `Text`, `JSON`, `Message` 출력을 받습니다.
    * Boolean: Boolean 값을 받습니다. 다른 컴포넌트로부터 입력을 받을 수 없습니다.

    자세한 내용은 [Langflow 데이터 유형](https://docs.langflow.org/data-types)을 참고하세요.

4. **Field Type** 선택에 따라, 다른 컴포넌트의 출력을 연결하여 입력을 동적으로 채우거나 **Dynamic Create Data** 컴포넌트의 필드에 값을 직접 입력하세요.

5. 컴포넌트의 출력 포트에서 원하는 출력 유형을 선택합니다. 이 컴포넌트는 컴포넌트 입력값의 모든 필드 값을 담은 [`JSON`](https://docs.langflow.org/data-types#json) 객체 또는, 모든 필드 값을 텍스트 문자열로 형식화한 [`Message`](https://docs.langflow.org/data-types#message)를 출력합니다.

## Dynamic Create Data 파라미터[​](#dynamic-create-data-parameters "Direct link to Dynamic Create Data parameters")

일부 파라미터는 시각적 편집기에서 기본적으로 숨겨져 있습니다.
컴포넌트를 선택했을 때 나타나는 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-inspection-panel)을 통해 모든 컴포넌트 파라미터를 수정할 수 있습니다.

| Name               | Display Name            | Info                                                                                                 |
| ------------------ | ----------------------- | ---------------------------------------------------------------------------------------------------- |
| `form_fields`      | **Input Configuration** | 입력 파라미터. 동적 폼 필드를 정의하는 테이블입니다.                                                       |
| `include_metadata` | **Include Metadata**    | 입력 파라미터. 출력에 폼 설정 메타데이터를 포함할지 여부입니다.                                       |
| `form_data`        | **Data**                | 출력 파라미터. 동적 입력의 모든 필드 값을 담은 `JSON` 객체입니다.               |
| `message`          | **Message**             | 출력 파라미터. 모든 필드 값을 사람이 읽기 쉬운 형식으로 정리한 `Text` 메시지입니다. |
