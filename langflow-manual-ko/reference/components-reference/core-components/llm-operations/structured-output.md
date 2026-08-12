# Structured Output

> 원문: https://docs.langflow.org/next/structured-output

**Structured Output** 컴포넌트는 LLM을 사용하여 자연어 포맷 지침과 출력 스키마 정의를 통해 어떤 입력이든 구조화된 데이터(`JSON` 또는 `Table`)로 변환합니다.
예를 들어 이메일 메시지나 학술 논문과 같은 문서에서 특정 세부 정보를 추출할 수 있습니다.

## 플로우에서 Structured Output 컴포넌트 사용하기[​](#use-the-structured-output-component-in-a-flow "Direct link to Use the Structured Output component in a flow")

플로우에서 **Structured Output** 컴포넌트를 사용하려면 다음을 수행하세요.

1. 구조화된 데이터를 추출할 원본 자료인 **Input Message**를 제공합니다.
이는 거의 모든 컴포넌트에서 올 수 있지만, 일반적으로 비구조적 또는 반구조적 입력을 제공하는 **Chat Input**, **Read File**, 또는 다른 컴포넌트입니다.

  
  tip
      모든 원본 자료가 구조화된 출력이 될 필요는 없습니다.
**Structured Output** 컴포넌트의 강점은, 데이터가 명시적으로 라벨링되어 있지 않거나 정확한 키워드와 일치하지 않더라도 추출하고자 하는 정보를 지정할 수 있다는 점입니다.
그러면 LLM은 지침을 사용하여 원본 자료를 분석하고, 관련 데이터를 추출하고, 사양에 따라 포맷할 수 있습니다.
관련 없는 원본 자료는 구조화된 출력에 포함되지 않습니다.

2. 원본 자료에서 추출할 데이터와 이를 최종 `JSON` 또는 `Table` 출력에 어떻게 구조화할지를 지정하기 위해 **Format Instructions**와 **Output Schema**를 정의합니다.

    지침은 LLM에게 어떤 데이터를 추출할지, 어떻게 포맷할지, 예외를 어떻게 처리할지, 그리고 구조화된 데이터 준비와 관련된 기타 지침을 알려주는 프롬프트입니다.

    스키마는 LLM이 추출한 데이터를 구조화된 `JSON` 또는 `Table` 객체로 정리하기 위한 필드(키)와 데이터 타입을 정의하는 테이블입니다.
자세한 내용은 [Output Schema 옵션](#output-schema-options)을 참고하세요.

3. [`LanguageModel`](https://docs.langflow.org/data-types#languagemodel) 출력을 내보내도록 설정된 [언어 모델 컴포넌트](https://docs.langflow.org/components-models)를 연결합니다.

    LLM은 **Structured Output** 컴포넌트의 **Input Message**와 **Format Instructions**를 사용하여 입력 텍스트에서 특정 데이터 조각을 추출합니다.
출력 스키마는 모델의 응답에 적용되어 최종 `JSON` 또는 `Table` 구조화 객체를 생성합니다.

4. 선택 사항: 일반적으로 구조화된 출력은 **Parser**나 **JSON Operations** 컴포넌트와 같이 추출된 데이터를 다른 처리에 사용하는 다운스트림 컴포넌트로 전달됩니다.

![Structured Output, Language Model, Type Convert, Chat Input and Output 컴포넌트로 구성된 기본 플로우.](https://docs.langflow.org/assets/images/component-structured-output-23458b0d29eed6d092b557c7aaf6ab2c.png)

**Structured Output 예제: Financial Report Parser 템플릿**

**Financial Report Parser** 템플릿은 **Structured Output** 컴포넌트를 사용하여 비구조적 텍스트에서 구조화된 데이터를 추출하는 방법의 예시를 제공합니다.

이 템플릿의 **Structured Output** 컴포넌트는 다음과 같이 설정되어 있습니다.

- **Input Message**는 샘플 재무 보고서에서 발췌한 내용이 미리 로드된 **Chat Input** 컴포넌트에서 옵니다.

- **Format Instructions**는 다음과 같습니다.

  
  ```
  You are an AI that extracts structured JSON objects from unstructured text.
  Use a predefined schema with expected types (str, int, float, bool, dict).
  Extract ALL relevant instances that match the schema - if multiple patterns exist, capture them all.
  Fill missing or ambiguous values with defaults: null for missing values.
  Remove exact duplicates but keep variations that have different field values.
  Always return valid JSON in the expected format, never throw errors.
  If multiple objects can be extracted, return them all in the structured format.
  ```

- **Output Schema**에는 `EBITDA`, `NET_INCOME`, `GROSS_PROFIT`에 대한 키가 포함됩니다.

구조화된 `JSON` 객체는 파싱 템플릿에서 스키마 키를 변수에 매핑하여 텍스트 문자열을 생성하는 **Parser** 컴포넌트로 전달됩니다.

```
EBITDA: {EBITDA}  ,  Net Income: {NET_INCOME} , GROSS_PROFIT: {GROSS_PROFIT}
```

**Playground**에 출력되면, 결과 `Message`는 변수를 **Structured Output** 컴포넌트가 추출한 실제 값으로 대체합니다. 예:

```
EBITDA: 900 million , Net Income: 500 million , GROSS_PROFIT: 1.2 billion
```

## Structured Output 파라미터[​](#structured-output-parameters "Direct link to Structured Output parameters")

기본적으로 일부 파라미터는 시각적 편집기에서 숨겨져 있습니다.
컴포넌트를 선택했을 때 표시되는 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-inspection-panel)을 통해 모든 컴포넌트 파라미터를 수정할 수 있습니다.

| Name                                    | Type              | Description                                                                                                                                                                                                                                                                                               |
| --------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Language Model (`llm`)                  | `LanguageModel`   | 입력 파라미터. 구조화된 출력을 분석, 추출, 준비하기 위해 사용할 LLM을 정의하는 **Language Model** 컴포넌트의 [`LanguageModel`](https://docs.langflow.org/data-types#languagemodel) 출력입니다.                                                                                                          |
| Input Message (`input_value`)           | String            | 입력 파라미터. 추출 대상 원본 자료가 포함된 입력 메시지입니다.                                                                                                                                                                                                                             |
| Format Instructions (`system_prompt`)   | String            | 입력 파라미터. 출력을 추출하고 포맷하는 방법에 대해 언어 모델에 전달하는 지침입니다.                                                                                                                                                                                                         |
| Schema Name (`schema_name`)             | String            | 입력 파라미터. **Output Schema**에 대한 선택적 제목입니다.                                                                                                                                                                                                                                             |
| Output Schema (`output_schema`)         | Table             | 입력 파라미터. 원하는 구조화된 출력의 스키마를 설명하는 테이블로, 최종적으로 `JSON` 또는 `Table` 출력의 내용을 결정합니다. [Output Schema 옵션](#output-schema-options)을 참고하세요.                                                                                                 |
| Structured Output (`structured_output`) | `JSON` or `Table` | 출력 파라미터. 컴포넌트가 생성하는 최종 구조화된 출력입니다. 컴포넌트의 출력 포트 근처에서 출력 데이터 타입을 **Structured Output Data** 또는 **Structured Output DataFrame** 중 하나로 선택할 수 있습니다. 출력의 구체적인 내용과 구조는 입력 파라미터에 따라 달라집니다. |

#### Output Schema 옵션[​](#output-schema-options "Direct link to Output Schema options")

LLM이 **Input Message**와 **Format Instructions**로부터 관련 데이터를 추출한 후, 데이터는 **Output Schema**에 따라 정리됩니다.

스키마는 **Structured Output** 컴포넌트의 최종 `JSON` 또는 `Table` 출력을 위한 필드(키)와 데이터 타입을 정의하는 테이블입니다.

기본 스키마는 단일 `field` 문자열입니다.

스키마에 키를 추가하려면, **Add a new row**를 클릭한 다음 각 열을 편집하여 스키마를 정의합니다.

- **Name**: 출력 필드의 이름입니다. 일반적으로 값을 추출하고자 하는 특정 키입니다.

    이러한 키는 **Parser** 컴포넌트의 템플릿과 같은 다운스트림 컴포넌트에서 변수로 참조할 수 있습니다.
예를 들어 스키마 키 `NET_INCOME`은 변수 `{NET_INCOME}`으로 참조할 수 있습니다.

- **Description**: 필드의 내용과 목적에 대한 선택적 메타데이터 설명입니다.

- **Type**: 필드에 저장된 값의 데이터 타입입니다.
지원되는 타입은 `str`(기본값), `int`, `float`, `bool`, `dict`입니다.

- **As List**: 필드가 단일 값이 아닌 값의 목록을 포함하도록 하려면 이 설정을 활성화하세요.

간단한 스키마의 경우, 몇 개의 `string` 또는 `int` 필드만 추출하면 될 수 있습니다.
목록과 딕셔너리가 있는 더 복잡한 스키마의 경우, [Langflow 데이터 타입](https://docs.langflow.org/data-types)에서 설명하는 `JSON` 및 `Table` 구조와 속성을 참고하는 것이 도움이 될 수 있습니다.
또한 대략적인 `JSON` 또는 `Table`을 생성한 다음, **JSON Operations** 컴포넌트와 같은 다운스트림 컴포넌트를 사용하여 추가로 다듬을 수도 있습니다.
