# If-Else

> 원문: https://docs.langflow.org/next/if-else

**If-Else** 컴포넌트는 두 문자열을 비교하여 메시지를 라우팅하는 조건부 라우터입니다.
지정한 연산자를 사용하여 두 텍스트 입력을 비교해 조건을 평가한 다음, 평가 결과에 따라 메시지를 `true_result` 또는 `false_result`로 라우팅합니다.

연산자는 연산자와 매치 텍스트(`match_text`)를 기반으로 입력(`input_text`)에서 단일 문자열을 찾지만, 정규식을 매칭하여 여러 단어를 검색할 수도 있습니다.
사용 가능한 연산자는 다음과 같습니다.

- **equals**: 정확히 일치하는지 비교
- **not equals**: 정확히 일치하는 비교의 반대
- **contains**: `input_text` 안에 `match_text`가 포함되어 있는지 확인
- **starts with**: `input_text`가 `match_text`로 시작하는지 확인
- **ends with**: `input_text`가 `match_text`로 끝나는지 확인
- **regex**: 대소문자를 구분하는 패턴으로 매칭

기본적으로 모든 연산자는 대소문자를 구분하지 않지만 **regex**는 예외입니다. **regex**는 항상 대소문자를 구분하며, [If-Else 파라미터](#if-else-parameters)에서 다른 모든 연산자에 대해 대소문자 구분을 활성화할 수 있습니다.

## 플로우에서 If-Else 컴포넌트 사용하기[​](#use-the-if-else-component-in-a-flow "Direct link to Use the If-Else component in a flow")

다음 예제는 **If-Else** 컴포넌트를 사용하여 수신되는 채팅 메시지를 정규식으로 확인한 다음, 매치 결과가 참인지 거짓인지에 따라 다른 응답을 출력합니다.

![두 개의 OpenAI 컴포넌트에 연결된 조건부 라우터](https://docs.langflow.org/assets/images/component-conditional-router-1fb27526613395545592fc9166c75c27.png)

1. 플로우에 **If-Else** 컴포넌트를 추가한 다음 아래와 같이 설정합니다.

  - **Text Input**: **Text Input** 포트를 **Chat Input** 컴포넌트 또는 다른 `Message` 입력에 연결합니다.

        입력이 `Message` 형식이 아닌 경우, [**Type Convert** 컴포넌트](https://docs.langflow.org/type-convert)나 [**Parser** 컴포넌트](https://docs.langflow.org/parser)와 같은 다른 컴포넌트를 사용하여 변환할 수 있습니다.
입력이 `Message` 형식에 적합하지 않다면 [**JSON Operations** 컴포넌트](https://docs.langflow.org/data-operations)와 같은 다른 조건부 라우팅 컴포넌트를 사용하는 것을 고려하세요.

  - **Match Text**: `.*(urgent|warning|caution).*`를 입력하여 컴포넌트가 수신 입력에서 이 값들을 찾도록 합니다. 정규식 매칭은 대소문자를 구분하므로, `warning`의 모든 변형을 찾으려면 `warning|Warning|WARNING`을 입력하세요.

  - **Operator**: **regex**를 선택합니다.

  - **Case True**: [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-menus)에서 **Case True** 파라미터를 활성화하고 **Close**를 클릭한 다음, 필드에 `New Message Detected`를 입력합니다.

        **Case True** 메시지는 매치 조건이 참으로 평가될 때 **True** 출력 포트에서 전송됩니다.

        **Case False**에는 메시지가 설정되지 않아 조건이 거짓으로 평가될 때 컴포넌트가 메시지를 내보내지 않습니다.

2. 결과가 **True**일 때 원하는 동작에 따라 해당 로직을 실행할 컴포넌트를 플로우에 추가합니다.

  1. 플로우에 **Language Model**, **Prompt Template**, **Chat Output** 컴포넌트를 추가합니다.

  2. **Language Model** 컴포넌트에 OpenAI API 키를 입력하거나 다른 제공자와 모델을 선택합니다.

  3. **If-Else** 컴포넌트의 **True** 출력 포트를 **Language Model** 컴포넌트의 **Input** 포트에 연결합니다.

  4. **Prompt Template** 컴포넌트에 평가가 참일 때 모델에 전달할 지침을 입력합니다. 예: `Send a message that a new warning, caution, or urgent message was received`.

  5. **Prompt Template** 컴포넌트를 **Language Model** 컴포넌트의 **System Message** 포트에 연결합니다.

  6. **Language Model** 컴포넌트의 출력을 **Chat Output** 컴포넌트에 연결합니다.

3. **False** 결과에 대해서도 또 다른 **Language Model**, **Prompt Template**, **Chat Output** 컴포넌트 세트로 동일한 과정을 반복합니다.

    **If-Else** 컴포넌트의 **False** 출력 포트를 두 번째 **Language Model** 컴포넌트의 **Input** 포트에 연결합니다.
두 번째 **Prompt Template**에는 평가가 거짓일 때 모델에 전달할 지침을 입력합니다. 예: `Send a message that a new low-priority message was received`.

4. 플로우를 테스트하려면 **Playground**를 열고, 정규식 문자열이 포함되거나 포함되지 않은 메시지를 플로우에 전송해 보세요.
채팅 출력은 정규식 평가 결과에 따라 프롬프트의 지침을 반영해야 합니다.

  
  ```
  User: A new user was created.

  AI: A new low-priority message was received.

  User: Sign-in warning: new user locked out.

  AI: A new warning, caution, or urgent message was received. Please review it at your earliest convenience.
  ```

## If-Else 파라미터[​](#if-else-parameters "Direct link to If-Else parameters")

기본적으로 일부 파라미터는 시각적 편집기에서 숨겨져 있습니다.
컴포넌트를 선택했을 때 표시되는 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-inspection-panel)을 통해 모든 컴포넌트 파라미터를 수정할 수 있습니다.

| Name            | Type     | Description                                                                                                                                                                |
| --------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| input\_text     | String   | 입력 파라미터. 연산에 사용될 기본 텍스트 입력입니다.                                                                                                                 |
| match\_text     | String   | 입력 파라미터. 비교 대상이 되는 텍스트입니다.                                                                                                                              |
| operator        | Dropdown | 입력 파라미터. 텍스트를 비교하는 데 사용되는 연산자입니다. 옵션에는 `equals`, `not equals`, `contains`, `starts with`, `ends with`, `regex`가 있습니다. 기본값은 `equals`입니다. |
| case\_sensitive | Boolean  | 입력 파라미터. `true`이면 비교 시 대소문자를 구분합니다. 기본값은 `false`입니다. 이 설정은 regex 비교에는 적용되지 않습니다.                                   |
| max\_iterations | Integer  | 입력 파라미터. 조건부 라우터에 허용되는 최대 반복 횟수입니다. 기본값은 10입니다.                                                                                                   |
| default\_route  | Dropdown | 입력 파라미터. 최대 반복 횟수에 도달했을 때 취할 경로입니다. 옵션에는 `true_result` 또는 `false_result`가 있습니다. 기본값은 `false_result`입니다.                        |
| true\_result    | Message  | 출력 파라미터. 조건이 참일 때 생성되는 출력입니다.                                                                                                          |
| false\_result   | Message  | 출력 파라미터. 조건이 거짓일 때 생성되는 출력입니다.                                                                                                          |
