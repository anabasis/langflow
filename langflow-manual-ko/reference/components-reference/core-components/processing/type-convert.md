# Type Convert

> 원문: https://docs.langflow.org/next/type-convert

**Type Convert** 컴포넌트는 데이터를 한 유형에서 다른 유형으로 변환합니다.
`JSON`, `Table`, `Message` 데이터 유형을 지원합니다.

- Data
- DataFrame
- Message

`JSON` 객체는 기본 `text` 키와 다른 키-값 쌍을 포함하는 구조화된 객체입니다.

```
"data": {
  "text": "User Profile",
  "name": "Charlie Lastname",
  "age": 28,
  "email": "charlie.lastname@example.com"
},
```

컴포넌트의 `data` 딕셔너리와 관련된 더 넓은 컨텍스트에서는 어떤 키가 기본 `text_key`인지도 식별하며, 기본 키가 지정되지 않은 경우 사용할 선택적 기본값을 제공할 수도 있습니다.
예를 들면 다음과 같습니다.

```
{
  "text_key": "text",
  "data": {
    "text": "User Profile",
    "name": "Charlie Lastname",
    "age": 28,
    "email": "charlie.lastname@example.com"
  },
  "default_value": ""
}
```

```
[
{
"name": "Charlie Lastname",
"age": 28,
"email": "charlie.lastname@example.com"
},
{
"name": "Bobby Othername",
"age": 25,
"email": "bobby.othername@example.com"
}
]
```

자세한 내용은 [Langflow 데이터 유형](https://docs.langflow.org/data-types)을 참고하세요.

## 플로우에서 Type Convert 컴포넌트 사용하기[​](#use-the-type-convert-component-in-a-flow "Direct link to Use the Type Convert component in a flow")

**Type Convert** 컴포넌트는 일반적으로 데이터를 하위 컴포넌트가 요구하는 형식으로 변환하는 데 사용됩니다.
예를 들어 어떤 컴포넌트가 `Message`를 출력하지만 다음 컴포넌트가 `JSON`을 요구한다면, **Type Convert** 컴포넌트를 사용하여 `Message`를 `JSON`으로 다시 형식화한 다음 하위 컴포넌트로 전달할 수 있습니다.

다음 예제는 **Type Convert** 컴포넌트를 사용하여 **Web Search** 컴포넌트의 `Table` 출력을 LLM의 텍스트 입력으로 전달되는 `Message` 데이터로 변환합니다.

1. **Basic prompting** 템플릿을 기반으로 플로우를 생성합니다.

2. 플로우에 **Web Search** 컴포넌트를 추가한 다음 `environmental news`와 같은 검색어를 입력합니다.

3. **Prompt Template** 컴포넌트에서 **Template** 필드의 내용을 다음 텍스트로 바꿉니다.

  `
  Answer the user's question using the {context}
  `

    중괄호는 **Prompt Template** 컴포넌트의 입력 필드가 되는 [프롬프트 변수](https://docs.langflow.org/components-prompts#define-variables-in-prompts)를 정의합니다.
이 예제에서는 다음 단계에서 설명하는 것처럼 **context** 필드를 사용하여 검색 결과를 템플릿에 전달합니다.

4. 플로우에 **Type Convert** 컴포넌트를 추가한 다음 **Output Type**을 **Message**로 설정합니다.

    **Web Search** 컴포넌트의 `Table` 출력은 **context** 변수의 `Message` 입력과 호환되지 않으므로, 검색 결과를 **Prompt Template** 컴포넌트로 전달하려면 **Type Convert** 컴포넌트를 사용하여 `Table`을 `Message`로 변경해야 합니다.

5. 나머지 플로우에 추가 컴포넌트를 연결합니다.

  - **Web Search** 컴포넌트의 출력을 **Type Convert** 컴포넌트의 입력에 연결합니다.
  - **Type Convert** 컴포넌트의 출력을 **Prompt Template** 컴포넌트의 **context** 입력에 연결합니다.

    ![웹 검색 출력을 텍스트 입력으로 변환하기](https://docs.langflow.org/assets/images/component-type-convert-and-web-search-39a09775930134090eb60ff7f536b70e.png)

6. **Language Model** 컴포넌트에 OpenAI API 키를 추가합니다.

    다른 제공자나 모델을 사용하려면 **Model Provider**, **Model Name**, **API Key** 필드를 그에 맞게 수정하세요.

7. **Playground**를 클릭한 다음 `latest news`나 `what's the latest research on the environment?`와 같이 검색어와 관련된 질문을 해 보세요.

**결과**

LLM은 검색 결과 컨텍스트, 사용자의 채팅 메시지, 그리고 자체 학습 데이터를 이용해 질문에 응답합니다.
예를 들면 다음과 같습니다.

```
Here are some of the latest news articles related to the environment:
Ozone Pollution and Global Warming: A recent study highlights that ozone pollution is a significant global environmental concern, threatening human health and crop production while exacerbating global warming. Read more
...
```

## Type Convert 파라미터[​](#type-convert-parameters "Direct link to Type Convert parameters")

| Name         | Display Name | Info                                                                                                                             |
| ------------ | ------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| input\_data  | Input Data   | 입력 파라미터. 변환할 데이터입니다. `JSON`, `Table`, `Message` 입력을 받습니다.                                               |
| output\_type | Output Type  | 입력 파라미터. **Data**, **DataFrame**, **Message** 중 하나로 지정하는 원하는 출력 유형입니다.                                                      |
| output       | Output       | 출력 파라미터. 지정된 형식으로 변환된 데이터입니다. 선택한 **Output Type**에 따라 출력 포트가 달라집니다. |
