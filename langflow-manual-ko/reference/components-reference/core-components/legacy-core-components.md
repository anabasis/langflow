# 레거시 코어 컴포넌트

> 원문: https://docs.langflow.org/next/legacy-core-components

레거시 컴포넌트는 더 이상 지원되지 않으며 향후 릴리스에서 제거될 수 있습니다.
기존 플로우에서는 계속 사용할 수 있지만, 가능한 한 빨리 지원되는 컴포넌트로 교체하는 것을 권장합니다.
권장 대체 컴포넌트는 플로우 내 컴포넌트의 **Legacy** 배너에 표시됩니다.
또한 릴리스 노트와 Langflow 문서에서도 가능한 한 안내됩니다.

레거시 컴포넌트를 어떻게 대체해야 할지 모르는 경우, 제공자, 서비스, 또는 컴포넌트 이름으로 컴포넌트를 **검색**해 보세요.
해당 컴포넌트는 완전히 새로운 컴포넌트, 유사한 컴포넌트, 또는 다른 카테고리의 동일 컴포넌트의 새 버전으로 대체되었을 수 있습니다.

명확한 대체 컴포넌트가 없다면, 다른 컴포넌트를 사용 사례에 맞게 조정할 수 있는지 고려해 보세요.
예를 들어 많은 **코어 컴포넌트**는 [**API Request** 컴포넌트](https://docs.langflow.org/api-request)처럼 여러 제공자와 사용 사례를 지원하는 범용 기능을 제공합니다.

이 두 옵션 모두 적합하지 않다면, 레거시 컴포넌트의 코드를 사용하여 자체 커스텀 컴포넌트를 만들거나 해당 레거시 컴포넌트에 대해 [토론을 시작](https://docs.langflow.org/contributing-github-issues)할 수 있습니다.

새 플로우에서 레거시 컴포넌트 사용을 지양하도록 하기 위해, 이러한 컴포넌트는 기본적으로 숨겨져 있습니다.
시각적 편집기에서 **Component settings**를 클릭하여 **Legacy** 필터를 전환할 수 있습니다.

## 레거시 입력/출력 컴포넌트[​](#legacy-input--output-components "Legacy Input / Output components 항목으로 바로 가기")

- **Text Input**: [**Chat Input** 컴포넌트](https://docs.langflow.org/chat-input-and-output)로 대체되었습니다.
- **Text Output**: [**Chat Output** 컴포넌트](https://docs.langflow.org/chat-input-and-output)로 대체되었습니다.

## 레거시 Data 컴포넌트[​](#legacy-data-components "Legacy Data components 항목으로 바로 가기")

다음 Data 컴포넌트는 레거시 상태입니다.

- **Directory**
- **Load CSV**
- **Load JSON**

이 컴포넌트들은 CSV, JSON 및 다양한 다른 파일 유형의 로드를 지원하는 [**Read File** 컴포넌트](https://docs.langflow.org/read-file)로 교체하세요.

## 레거시 File 컴포넌트[​](#legacy-file-components "Legacy File components 항목으로 바로 가기")

다음 Files and Knowledge 컴포넌트는 레거시 상태입니다.

- **Knowledge Base** (레거시): **Retrieve** 모드의 [**Knowledge Base** 컴포넌트](https://docs.langflow.org/knowledge-base)로 대체되었습니다.
- **Knowledge Ingestion**: **Ingest** 모드의 [**Knowledge Base** 컴포넌트](https://docs.langflow.org/knowledge-base)로 대체되었습니다.

## 레거시 Helper 컴포넌트[​](#legacy-helper-components "Legacy Helper components 항목으로 바로 가기")

다음 Helper 컴포넌트는 레거시 상태입니다.

- **Message Store**: [**Message History** 컴포넌트](https://docs.langflow.org/message-history)로 대체되었습니다.

- **Create List**: [Processing 컴포넌트](https://docs.langflow.org/concepts-components)로 교체하세요.

- **ID Generator**: 임의 코드를 실행하여 ID를 생성하는 컴포넌트로 교체하거나, ID 생성기 스크립트를 애플리케이션 코드(Langflow 플로우 외부)에 내장하세요.

- **Output Parser**: [**Structured Output** 컴포넌트](https://docs.langflow.org/structured-output)와 [**Parser** 컴포넌트](https://docs.langflow.org/parser)로 교체하세요.
필요한 컴포넌트는 파싱 작업의 데이터 유형과 복잡도에 따라 다릅니다.

    **Output Parser** 컴포넌트는 LangChain의 `CommaSeparatedListOutputParser`를 사용하여 언어 모델의 출력을 `["item1", "item2", "item3"]`와 같은 쉼표 구분 값(CSV) 형식으로 변환했습니다.
**Structured Output** 컴포넌트는 커스텀 스키마를 지원하고 더 복잡한 파싱도 처리하므로 이 컴포넌트의 좋은 대안이 됩니다.

    **Parser** 컴포넌트는 형식 지정 지침과 파싱 기능만 제공합니다. *프롬프트는 포함하지 않습니다.* LLM이 사용할 수 있는 프롬프트를 만들려면 파서를 **Prompt Template** 컴포넌트에 연결해야 합니다.

## 레거시 Logic 컴포넌트[​](#legacy-logic-components "Legacy Logic components 항목으로 바로 가기")

다음 Logic 컴포넌트는 레거시 상태입니다.

**Condition**

이 레거시 컴포넌트의 대안으로 [**If-Else** 컴포넌트](https://docs.langflow.org/if-else)를 참고하세요.

**Condition** 컴포넌트는 지정된 키에 적용된 조건(불리언 검증 포함)에 따라 `JSON` 객체를 라우팅합니다.
조건 평가 결과에 따라 결과를 라우팅하기 위한 `true_output`과 `false_output`을 지원합니다.

이 컴포넌트는 복잡한 데이터 구조의 조건부 라우팅이 필요한 워크플로우에서 유용하며, 데이터 내용에 기반한 동적 의사 결정을 가능하게 합니다.

단일 `JSON` 객체 또는 `JSON` 객체의 리스트를 처리할 수 있습니다.
`JSON` 객체 리스트를 처리할 때는 다음과 같이 동작합니다.

- 리스트의 각 객체가 개별적으로 평가됩니다.
- 조건을 충족하는 객체는 `true_output`으로 전달됩니다.
- 조건을 충족하지 않는 객체는 `false_output`으로 전달됩니다.
- 모든 객체가 한쪽 출력으로 전달되면 다른 출력은 비어 있습니다.

**Condition** 컴포넌트는 다음 파라미터를 사용합니다.

| Name           | Type     | Description                                                                                                                                              |
| -------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data_input    | JSON     | 입력 파라미터. 처리할 Data 객체 또는 Data 객체의 리스트입니다. 단일 항목과 리스트를 모두 처리할 수 있습니다.                  |
| key_name      | String   | 입력 파라미터. Data 객체에서 확인할 키의 이름입니다.                                                                                                        |
| operator       | Dropdown | 입력 파라미터. 적용할 연산자입니다. 옵션: `equals`, `not equals`, `contains`, `starts with`, `ends with`, `boolean validator`. 기본값: `equals`. |
| compare_value | String   | 입력 파라미터. 비교할 값입니다. 연산자가 `boolean validator`일 때는 표시/사용되지 않습니다.                                                      |

`operator` 옵션은 다음과 같이 동작합니다.

- `equals`: 키 값과 compare_value 간의 완전 일치 비교.
- `not equals`: 완전 일치의 반대.
- `contains`: 키 값 안에 compare_value가 포함되어 있는지 확인.
- `starts with`: 키 값이 compare_value로 시작하는지 확인.
- `ends with`: 키 값이 compare_value로 끝나는지 확인.
- `boolean validator`: 키 값을 불리언으로 취급합니다. 다음 값들은 참으로 간주됩니다.
  * 불리언 `true`.
  * 문자열: `true`, `1`, `yes`, `y`, `on` (대소문자 구분 없음)
  * 그 외의 값은 Python의 `bool()` 함수를 사용해 변환됩니다.

**Pass**

이 레거시 컴포넌트의 대안으로, 메시지를 수정 없이 전달하려면 [**If-Else** 컴포넌트](https://docs.langflow.org/if-else)를 사용하세요.

**Pass** 컴포넌트는 입력 메시지를 수정 없이 그대로 전달합니다.

다음 파라미터를 사용합니다.

| Name             | Display Name    | Info                                                                                    |
| ---------------- | --------------- | ----------------------------------------------------------------------------------------- |
| input_message   | Input Message   | 입력 파라미터. 전달할 메시지입니다.                                                |
| ignored_message | Ignored Message | 입력 파라미터. 무시되는 두 번째 메시지입니다. 연속성을 위한 우회 방법으로 사용됩니다. |
| output_message  | Output Message  | 출력 파라미터. 입력에서 전달된 메시지입니다.                                                 |

**Flow As Tool**

이 컴포넌트는 로드된 플로우를 실행하는 함수로부터 도구를 만들었습니다.

Langflow 버전 1.1.2에서 사용 중단되었으며 [**Run Flow** 컴포넌트](https://docs.langflow.org/run-flow)로 대체되었습니다.

**Sub Flow**

이 컴포넌트는 전체 플로우를 더 큰 워크플로우 내의 컴포넌트로 통합했습니다.
선택한 플로우에 따라 동적으로 입력을 생성하고, 제공된 파라미터로 플로우를 실행했습니다.

Langflow 버전 1.1.2에서 사용 중단되었으며 [**Run Flow** 컴포넌트](https://docs.langflow.org/run-flow)로 대체되었습니다.

## 레거시 Processing 컴포넌트[​](#legacy-processing-components "Legacy Processing components 항목으로 바로 가기")

다음 Processing 컴포넌트는 레거시 상태입니다.

**Alter Metadata**

이 레거시 컴포넌트는 [**JSON Operations** 컴포넌트](https://docs.langflow.org/data-operations)로 교체하세요.

이 컴포넌트는 입력 객체의 메타데이터를 수정합니다. 새 메타데이터를 추가하거나, 기존 메타데이터를 업데이트하거나, 지정된 메타데이터 필드를 제거할 수 있습니다. `Message`와 `JSON` 객체 모두에서 동작하며, 사용자가 입력한 텍스트로부터 새로운 `JSON` 객체를 생성할 수도 있습니다.

다음 파라미터를 사용합니다.

| Name           | Display Name     | Info                                                                                                                              |
| -------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| input_value   | Input            | 입력 파라미터. Metadata를 추가할 대상 객체입니다.                                                                       |
| text_in       | User Text        | 입력 파라미터. 텍스트 입력이며, 값은 `JSON` 객체의 'text' 속성에 담깁니다. 빈 텍스트 항목은 무시됩니다. |
| metadata       | Metadata         | 입력 파라미터. 각 객체에 추가할 메타데이터입니다.                                                                  |
| remove_fields | Fields to Remove | 입력 파라미터. 제거할 메타데이터 필드입니다.                                                                                       |
| data           | JSON             | 출력 파라미터. 메타데이터가 추가된 입력 객체 목록입니다.                                                                |

**Combine Data**

이 레거시 컴포넌트는 [**JSON Operations** 컴포넌트](https://docs.langflow.org/data-operations) 또는 [**Loop** 컴포넌트](https://docs.langflow.org/loop)로 교체하세요.

이 컴포넌트는 여러 데이터 소스를 하나의 통합된 `JSON` 객체로 결합합니다.

이 컴포넌트는 `JSON` 객체 리스트를 순회하며 하나의 `JSON` 객체(`merged_data`)로 병합합니다.
입력 리스트가 비어 있으면 빈 데이터 객체를 반환합니다.
입력 데이터 객체가 하나뿐이면 해당 객체를 그대로 반환합니다.

병합 과정은 덧셈 연산자를 사용하여 데이터 객체를 결합합니다.

**Combine Text**

이 레거시 컴포넌트는 [**JSON Operations** 컴포넌트](https://docs.langflow.org/data-operations)로 교체하세요.

이 컴포넌트는 지정된 구분자를 사용하여 두 텍스트 입력을 하나의 텍스트 청크로 연결하고, 결합된 텍스트를 담은 `Message` 객체를 출력합니다.

**Create Data**

이 레거시 컴포넌트는 [**Dynamic Create Data** 컴포넌트](https://docs.langflow.org/dynamic-create-data)로 교체하세요.
이 컴포넌트는 지정된 개수의 필드와 텍스트 키를 가진 `JSON` 객체를 동적으로 생성합니다.

다음 파라미터를 사용합니다.

| Name                 | Display Name       | Info                                                                                        |
| -------------------- | ------------------ | ------------------------------------------------------------------------------------------- |
| number_of_fields   | Number of Fields   | 입력 파라미터. 레코드에 추가할 필드 수입니다.                            |
| text_key            | Text Key           | 입력 파라미터. 텍스트 콘텐츠로 사용할 필드를 식별하는 키입니다.              |
| text_key_validator | Text Key Validator | 입력 파라미터. 활성화하면 지정된 `Text Key`가 주어진 `JSON`에 존재하는지 확인합니다. |

**Data to DataFrame/Data to Message**

이 레거시 컴포넌트들은 [**JSON Operations** 컴포넌트](https://docs.langflow.org/data-operations)와 [**Type Convert** 컴포넌트](https://docs.langflow.org/type-convert) 같은 최신 Processing 컴포넌트로 교체하세요.

이 컴포넌트들은 하나 이상의 `JSON` 객체를 `Table` 또는 `Message` 객체로 변환했습니다.

**Data to DataFrame** 컴포넌트의 경우, 각 `JSON` 객체는 결과 `Table`의 한 행에 대응합니다.
`.data` 속성의 필드는 열이 되고, `.text` 필드(존재하는 경우)는 `text` 열에 배치됩니다.

**Extract Key**

이 레거시 컴포넌트는 [**JSON Operations** 컴포넌트](https://docs.langflow.org/data-operations)로 교체하세요.

이 컴포넌트는 `JSON` 객체에서 특정 키를 추출하여 해당 키와 연결된 값을 반환합니다.

**Filter Data**

이 레거시 컴포넌트는 [**JSON Operations** 컴포넌트](https://docs.langflow.org/data-operations)로 교체하세요.

이 컴포넌트는 키 목록(`filter_criteria`)을 기준으로 `JSON` 객체를 필터링하여, 필터 조건과 일치하는 키-값 쌍만 포함하는 새로운 `JSON` 객체(`filtered_data`)를 반환합니다.

**Filter Values**

이 레거시 컴포넌트는 [**JSON Operations** 컴포넌트](https://docs.langflow.org/data-operations)로 교체하세요.

Filter values 컴포넌트는 지정된 키, 필터 값, 비교 연산자를 기준으로 데이터 항목 목록을 필터링합니다.

다음 파라미터를 사용합니다.

| Name           | Display Name        | Info                                                             |
| -------------- | ------------------- | ------------------------------------------------------------------ |
| input_data    | Input data          | 입력 파라미터. 필터링할 데이터 항목 목록입니다.               |
| filter_key    | Filter Key          | 입력 파라미터. 필터링 기준이 될 키입니다.                           |
| filter_value  | Filter Value        | 입력 파라미터. 필터링 기준이 될 값입니다.                         |
| operator       | Comparison Operator | 입력 파라미터. 값 비교에 적용할 연산자입니다. |
| filtered_data | Filtered data       | 출력 파라미터. 필터링된 데이터 항목의 결과 목록입니다.     |

**JSON Cleaner**

이 레거시 컴포넌트는 [**Parser** 컴포넌트](https://docs.langflow.org/parser)로 교체하세요.

이 컴포넌트는 JSON 문자열이 JSON 명세를 완전히 준수하도록 정리합니다.

다음 파라미터를 사용합니다.

| Name                   | Display Name              | Info                                                                                                                                                                                                                                                                                |
| ---------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| json_str              | JSON String               | 입력 파라미터. 정리할 JSON 문자열입니다. 언어 모델이나 JSON 명세를 완전히 준수하지 않을 수 있는 다른 소스에서 생성된, 잘못된 형식일 수 있는 원본 JSON 문자열일 수 있습니다.                               |
| remove_control_chars | Remove Control Characters | 입력 파라미터. `True`로 설정하면 JSON 문자열에서 제어 문자(ASCII 문자 0-31 및 127)를 제거합니다. 파싱 문제를 일으키거나 JSON을 유효하지 않게 만들 수 있는 보이지 않는 문자를 제거하는 데 도움이 됩니다.                                              |
| normalize_unicode     | Normalize Unicode         | 입력 파라미터. 활성화하면 JSON 문자열의 유니코드 문자를 정규 조합 형식(NFC)으로 정규화합니다. 이를 통해 시스템 간에 유니코드 문자의 일관된 표현을 보장하고 문자 인코딩 문제를 방지합니다. |
| validate_json         | Validate JSON             | 입력 파라미터. `True`로 설정하면 최종 복구 작업을 적용하기 전에 JSON 문자열을 파싱하여 올바른 형식인지 확인합니다. JSON이 유효하지 않으면 ValueError를 발생시켜 JSON의 주요 구조적 문제를 조기에 발견할 수 있습니다.        |
| output                 | Cleaned JSON String       | 출력 파라미터. JSON 명세를 완전히 준수하는, 정리되고 복구되고 검증된 결과 JSON 문자열입니다.                                                                                                                                                                       |

**Message to Data**

이 레거시 컴포넌트는 [**Type Convert** 컴포넌트](https://docs.langflow.org/type-convert)로 교체하세요.

이 컴포넌트는 `Message` 객체를 `JSON` 객체로 변환합니다.

**Parse DataFrame**

이 레거시 컴포넌트는 [**Table Operations** 컴포넌트](https://docs.langflow.org/dataframe-operations) 또는 [**Parser** 컴포넌트](https://docs.langflow.org/parser)로 교체하세요.

이 컴포넌트는 템플릿을 사용하여 `Table` 객체를 일반 텍스트로 변환합니다.

다음 파라미터를 사용합니다.

| Name     | Display Name | Info                                                                          |
| -------- | ------------ | ------------------------------------------------------------------------------ |
| df       | Table        | 입력 파라미터. 텍스트 행으로 변환할 DataFrame입니다.                       |
| template | Template     | 입력 파라미터. 형식 지정을 위한 템플릿입니다(`{column_​name}` 플레이스홀더 사용). |
| sep      | Separator    | 입력 파라미터. 출력에서 행을 결합할 때 사용할 문자열입니다.                               |
| text     | Text         | 출력 파라미터. 모든 행이 결합된 단일 텍스트입니다.                         |

**Parse JSON**

이 레거시 컴포넌트는 [**Parser** 컴포넌트](https://docs.langflow.org/parser)로 교체하세요.

이 컴포넌트는 JQ 쿼리를 사용하여 `Message`와 `JSON` 객체의 JSON 필드를 변환 및 추출한 다음, `JSON` 객체 목록인 `filtered_data`를 반환합니다.

**Regex Extractor**

이 레거시 컴포넌트는 [**Parser** 컴포넌트](https://docs.langflow.org/parser)로 교체하세요.

이 컴포넌트는 정규 표현식을 사용하여 텍스트에서 패턴을 추출합니다. 텍스트에서 특정 패턴이나 정보를 찾아 추출하는 데 사용할 수 있습니다.

**Select Data**

이 레거시 컴포넌트는 [**JSON Operations** 컴포넌트](https://docs.langflow.org/data-operations)로 교체하세요.

이 컴포넌트는 리스트에서 단일 `JSON` 객체를 선택합니다.

다음 파라미터를 사용합니다.

| Name           | Display Name  | Info                                          |
| -------------- | ------------- | ------------------------------------------------ |
| data_list     | Data List     | 입력 파라미터. 선택할 대상이 되는 데이터 목록입니다.  |
| data_index    | Data Index    | 입력 파라미터. 선택할 데이터의 인덱스입니다.  |
| selected_data | Selected Data | 출력 파라미터. 선택된 `JSON` 객체입니다. |

**Update Data**

이 레거시 컴포넌트는 [**JSON Operations** 컴포넌트](https://docs.langflow.org/data-operations)로 교체하세요.

이 컴포넌트는 지정된 필드로 데이터를 동적으로 업데이트하거나 추가합니다.

다음 파라미터를 사용합니다.

| Name                 | Display Name       | Info                                                             |
| -------------------- | ------------------ | ------------------------------------------------------------------ |
| old_data            | JSON               | 입력 파라미터. 업데이트할 레코드입니다.                          |
| number_of_fields   | Number of Fields   | 입력 파라미터. 추가할 필드 수입니다. 최대 15개입니다. |
| text_key            | Text Key           | 입력 파라미터. 텍스트 콘텐츠에 사용할 키입니다.                       |
| text_key_validator | Text Key Validator | 입력 파라미터. 텍스트 키 존재 여부를 검증합니다.                |
| data                 | JSON               | 출력 파라미터. 업데이트된 Data 객체입니다.                      |

## 레거시 Tools 컴포넌트[​](#legacy-tools-components "Legacy Tools components 항목으로 바로 가기")

다음 Tools 컴포넌트는 레거시 상태입니다.

- **Calculator Tool**: [**계산기** 컴포넌트](https://docs.langflow.org/calculator)로 대체되었습니다.
- **Python Code Structured**: [**Python 인터프리터** 컴포넌트](https://docs.langflow.org/python-interpreter)로 대체되었습니다.
- **Python REPL**: [**Python 인터프리터** 컴포넌트](https://docs.langflow.org/python-interpreter)로 대체되었습니다.
- **Search API**: [**SearchApi** 번들](https://docs.langflow.org/bundles-searchapi)로 대체되었습니다.
- **SearXNG Search**: 직접적인 대체 컴포넌트가 없습니다. 다른 제공자의 검색 컴포넌트를 사용하거나, 커스텀 컴포넌트를 만들거나, [**API Request** 컴포넌트](https://docs.langflow.org/api-request)와 같은 코어 컴포넌트를 사용하세요.
- **Serp Search API**: **SerpApi** 번들로 대체되었습니다.
- **Tavily Search API**: **Tavily** 번들로 대체되었습니다.
- **Wikidata API**: [**Wikipedia** 번들](https://docs.langflow.org/bundles-wikipedia)로 대체되었습니다.
- **Wikipedia API**: [**Wikipedia** 번들](https://docs.langflow.org/bundles-wikipedia)로 대체되었습니다.
- **Yahoo! Finance**: **Yahoo! Search** 번들로 대체되었습니다.
