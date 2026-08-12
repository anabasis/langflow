# Smart Router

> 원문: https://docs.langflow.org/next/smart-router

**Smart Router** 컴포넌트는 [**If-Else** 컴포넌트](https://docs.langflow.org/if-else)의 LLM 기반 변형입니다.
문자열 매칭 대신, **Smart Router**는 연결된 [**Language Model** 컴포넌트](https://docs.langflow.org/components-models)를 사용하여 수신 메시지를 분류하고 라우팅합니다.

**If-Else** 컴포넌트를 사용하는 모든 곳에서 **Smart Router** 컴포넌트를 사용할 수 있습니다.
예를 들어 [If-Else 컴포넌트 예제 플로우](https://docs.langflow.org/if-else#use-the-if-else-component-in-a-flow)를 만든 다음, **If-Else** 컴포넌트를 **Smart Router** 컴포넌트로 교체해 보세요.
정규식 대신, **Routes** 테이블을 사용하여 메시지에 대한 출력을 정의합니다.

**Routes** 테이블은 라우팅을 위한 카테고리를 정의합니다.
예를 들어 감정 분석을 위한 routes 테이블은 다음과 같을 수 있습니다.

| Route Name | Route Description                                          | Route Message               |
| ---------- | ---------------------------------------------------------- | --------------------------- |
| Positive   | Positive feedback, satisfaction, or compliments            |                             |
| Negative   | Complaints, issues, or dissatisfaction                     |                             |
| Neutral    | Questions, requests for information, or neutral statements | Thank you for your inquiry! |

이 컴포넌트는 **Positive**, **Negative**, **Neutral** 라우트에 대한 포트를 생성합니다.
LLM이 입력 텍스트를 분류하면, 라우트 이름으로 일치하는 카테고리의 출력 포트로 라우팅합니다.
Positive와 Negative 라우트의 경우, 원본 입력 텍스트가 그대로 전달됩니다.
Neutral 라우트의 경우, 입력 텍스트 대신 `"Thank you for your inquiry!"` 라우트 메시지가 전송됩니다.

**Override Output** 파라미터는 LLM이 어떤 라우트와 일치시키든 상관없이 단일 메시지를 전송합니다.
override 메시지는 다른 모든 출력 옵션보다 우선하며, 원본 입력 텍스트와 사용자 지정 라우트 메시지를 모두 완전히 대체합니다.
감정 분석 예제에서 **Override Output**을 `"Message received"`로 설정하면, 모든 라우트가 동일한 메시지를 전송합니다.

**Additional Instructions** 파라미터는 LLM에 추가 지침을 더합니다.
분류할 입력 텍스트를 참조하려면 `{input_text}` 플레이스홀더를 사용하고, 쉼표로 구분된 라우트 이름 목록을 참조하려면 `{routes}`를 사용하세요.

예를 들어 LLM에 도메인 특화 컨텍스트를 추가하려면, 사용자 지정 프롬프트로 다음을 포함하세요.

```text
The text "{input_text}" is from a customer support context.

Consider the urgency and emotional tone when choosing from {routes}.
```

## Smart Router 파라미터[​](#smart-router-parameters "Direct link to Smart Router parameters")

기본적으로 일부 파라미터는 시각적 편집기에서 숨겨져 있습니다.
컴포넌트를 선택했을 때 표시되는 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-inspection-panel)을 통해 모든 컴포넌트 파라미터를 수정할 수 있습니다.

| Name                    | Type                                       | Description                                                                                                                                                                                                                                                                                           |
| ----------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Language Model          | [LanguageModel](https://docs.langflow.org/data-types#languagemodel) | 입력 파라미터. 분류에 사용할 언어 모델입니다. LLM은 입력 텍스트와 사용 가능한 카테고리를 받아 일치하는 정확한 카테고리 이름을 반환합니다. 필수입니다.                                                                                                                 |
| Input                   | String                                     | 입력 파라미터. 분류를 위한 기본 텍스트 입력입니다. 필수입니다.                                                                                                                                                                                                                                 |
| Routes                  | Table                                      | 입력 파라미터. 라우팅을 위한 카테고리를 정의하는 테이블입니다. 각 행에는 라우트 이름(필수), LLM이 카테고리를 이해하는 데 도움이 되는 선택적 라우트 설명, 그리고 선택적 커스텀 출력 메시지가 포함됩니다. 컴포넌트는 각 라우트 카테고리에 대해 하나의 출력 포트를 생성합니다. 필수입니다.                |
| Override Output         | Message                                    | 입력 파라미터. 다른 모든 출력 옵션보다 우선하는 선택적 override 메시지입니다. 제공되면, 이 메시지는 모든 라우트에 대해 원본 입력 텍스트와 사용자 지정 라우트 메시지를 모두 대체합니다. 고급 설정입니다.                                                                          |
| Additional Instructions | String                                     | 입력 파라미터. LLM 기반 분류를 위한 추가 지침입니다. 이는 이미 전체 Routes 테이블(이름과 설명)을 포함하는 기본 분류 프롬프트에 추가됩니다. 입력 텍스트에는 `{input_text}`를, 라우트 이름만의 쉼표 구분 목록에는 `{routes}`를 사용하세요. |
| Include Else Output     | Boolean                                    | 입력 파라미터. 어떤 라우트와도 일치하지 않는 경우를 위한 Else 출력을 포함합니다. 비활성화하면 일치하는 항목이 없을 때 출력이 생성되지 않습니다. 기본값: false.                                                                                                                                              |
| Else                    | Message                                    | 출력 파라미터. Else 출력입니다. **Include Else Output**이 `true`일 때만 사용할 수 있습니다. 일치하는 라우트가 없을 때 override 메시지(제공된 경우) 또는 원본 입력 텍스트를 사용합니다.                                                                                                                   |
