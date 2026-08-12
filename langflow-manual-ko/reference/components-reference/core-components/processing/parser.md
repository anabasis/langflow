# Parser

> 원문: https://docs.langflow.org/next/parser

**Parser** 컴포넌트는 템플릿이나 직접 문자열화를 이용해 구조화된 데이터(`Table` 또는 `JSON`)에서 텍스트를 추출합니다.
출력은 파싱된 텍스트를 담은 `Message`입니다.

이 컴포넌트는 플로우 내 데이터 추출과 조작에 다목적으로 활용됩니다.
플로우에서 **Parser** 컴포넌트를 사용하는 예시는 다음을 참고하세요.

- [**Batch Run** 컴포넌트 예시](https://docs.langflow.org/batch-run)
- [**Structured Output** 컴포넌트 예시](https://docs.langflow.org/structured-output)
- **Financial Report Parser** 템플릿
- [웹훅으로 플로우 트리거하기](https://docs.langflow.org/webhook)
- [벡터 RAG 챗봇 만들기](https://docs.langflow.org/chat-with-rag)

![Structured Output 컴포넌트에서 텍스트를 추출하기 위해 Parser 컴포넌트를 사용하는 플로우](https://docs.langflow.org/assets/images/component-parser-1d1d72593f02991e5b14b6b1c112a744.png)

## 파싱 모드[​](#parsing-modes "Direct link to Parsing modes")

**Parser** 컴포넌트에는 **Parser**와 **Stringify** 두 가지 모드가 있습니다.

- Parser (template) 모드
- Stringify 모드

**Parser** 모드에서는 리터럴 문자열과 추출된 키에 대한 변수를 포함할 수 있는 텍스트 출력 템플릿을 작성합니다.

템플릿 어디에든 변수를 정의하려면 중괄호를 사용하세요.
변수는 열 이름과 같이 `Table` 또는 `JSON` 입력의 키와 일치해야 합니다.
예를 들어 `{name}`은 `name` 키의 값을 추출합니다.
`Table`과 `JSON` 객체의 내용과 구조에 대한 자세한 내용은 [Langflow 데이터 유형](https://docs.langflow.org/data-types)을 참고하세요.

템플릿에 리터럴 텍스트와 변수가 함께 있다면, 이중 중괄호를 사용해 리터럴 중괄호를 이스케이프하여 해당 텍스트가 변수로 해석되지 않도록 할 수 있습니다.
예: `This is a template with {{literal text in curly braces}} and a {variable}`.

템플릿에 JSON 구조처럼 리터럴 중괄호가 많이 포함되어 있다면, Mustache 템플릿 방식을 사용하는 것을 고려하세요.
자세한 내용은 [프롬프트 템플릿에서 Mustache 템플릿 사용하기](https://docs.langflow.org/components-prompts#use-mustache-templating-in-prompt-templates)를 참고하세요.

플로우가 실행되면 **Parser** 컴포넌트는 입력을 순회하며 파싱된 각 항목에 대해 `Message`를 생성합니다.
예를 들어 `Table`을 파싱하면 각 행마다 해당 행에서 추출한 고유한 값들로 채워진 `Message`가 생성됩니다.

**직원 요약 템플릿**

다음 예제 템플릿은 직원 데이터를 추출하여 채용일과 현재 직책에 대한 자연어 요약을 생성합니다.

```text
{employee_first_name} {employee_last_name} was hired on {start_date}.  
Their current position is {job_title} ({grade}).  
```

결과로 생성되는 `Message` 출력은 변수를 해당하는 추출된 값으로 대체합니다.
예를 들면 다음과 같습니다.

```text
Renlo Kai was hired on 11-July-2017.  
Their current position is Software Engineer (Principal).  
```

**직원 프로필 템플릿**

다음 예제 템플릿은 Markdown 문법과 추출된 직원 데이터를 이용해 직원 프로필을 생성합니다.

```text
# Employee Profile  
## Personal Information  
- **Name:** {name}  
- **ID:** {id}  
- **Email:** {email}  
```

플로우가 실행되면 **Parser** 컴포넌트는 `Table`의 각 행을 순회하며 해당하는 추출된 값으로 템플릿의 변수를 채웁니다.
각 행에 대해 생성된 텍스트는 [`Message`](https://docs.langflow.org/data-types#message)로 출력됩니다.

다음 파라미터는 **Parser** 모드에서 사용할 수 있습니다.

일부 파라미터는 시각적 편집기에서 기본적으로 숨겨져 있습니다.
컴포넌트를 선택했을 때 나타나는 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-inspection-panel)을 통해 모든 컴포넌트 파라미터를 수정할 수 있습니다.

| Name        | Display Name  | Info                                                                                                                                              |
| ----------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| input\_data | JSON or Table | 입력 파라미터. 파싱할 `JSON` 또는 `Table` 입력입니다.                                                                                                            |
| pattern     | Template      | 입력 파라미터. 일반 텍스트와 키에 대한 변수(`{KEY_​NAME}`)를 사용하는 형식화 템플릿입니다. 자세한 내용은 앞선 예제를 참고하세요. |
| sep         | Separator     | 입력 파라미터. 행이나 줄의 구분 기호를 정의하는 문자열입니다. 기본값: `\n`(개행 문자).                                                     |
| clean\_data | Clean Data    | `Table` 또는 `JSON` 입력의 각 셀이나 키에서 빈 행과 빈 줄을 제거할지 여부입니다. 기본값: 활성화(`true`)                              |

## 파싱된 텍스트 테스트 및 문제 해결하기[​](#test-and-troubleshoot-parsed-text "Direct link to Test and troubleshoot parsed text")

**Parser** 컴포넌트를 테스트하려면 **Run component**를 클릭한 다음 **Inspect output**을 클릭하여 파싱된 텍스트를 담은 `Message` 출력을 확인하세요.
**Playground**에서 출력을 확인하고 싶다면 **Chat Output** 컴포넌트를 연결할 수도 있습니다.

**Parser** 컴포넌트의 `Message` 출력에 빈 값이나 예상치 못한 값이 있다면, 입력과 파싱 모드 간 매핑 오류가 있거나, 입력에 빈 값이 있거나, 입력이 일반 텍스트 추출에 적합하지 않을 수 있습니다.

예를 들어 `Table`을 파싱하는 데 다음 템플릿을 사용한다고 가정해 봅시다.

```text
{employee_first_name} {employee_last_name} is a {job_title} ({grade}).  
```

`employee_first_name`이 비어 있고 `grade`가 `null`인 행을 파싱하면 다음과 같은 `Message`가 생성될 수 있습니다.

```text
Smith is a Software Engineer (null).  
```

값이 누락되거나 예상치 못한 경우 다음과 같은 방법으로 문제를 해결할 수 있습니다.

- 템플릿의 변수가 들어오는 `JSON` 또는 `Table`의 키에 매핑되는지 확인하세요.
**Parser** 컴포넌트로 데이터를 보내는 컴포넌트에서 **Inspect output**을 클릭하면 컴포넌트에 직접 전달되는 데이터를 확인할 수 있습니다.

- 소스 데이터에 값이 누락되었거나 잘못되지 않았는지 확인하세요.
이러한 불일치를 해결하는 방법은 여러 가지가 있습니다.

  * 소스 데이터를 직접 수정합니다.
  * **Parser** 컴포넌트로 데이터를 전달하기 전에 다른 컴포넌트를 사용해 이상값을 수정하거나 필터링합니다.
목적에 따라 [**Data Operations** 컴포넌트](https://docs.langflow.org/next/operations), [**Structured Output** 컴포넌트](https://docs.langflow.org/structured-output), [**Smart Transform** 컴포넌트](https://docs.langflow.org/smart-transform) 등 다양한 컴포넌트를 사용할 수 있습니다.
  * **Parser** 컴포넌트의 **Clean Data** 파라미터를 활성화하여 빈 행이나 줄을 건너뛰도록 합니다.
