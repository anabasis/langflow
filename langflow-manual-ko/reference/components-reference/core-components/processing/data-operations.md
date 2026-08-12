# Data Operations

> 원문: https://docs.langflow.org/next/operations

tip

Langflow 1.11.0 이전에는 텍스트, JSON, 테이블 처리를 별도의 **Text Operations**, **JSON Operations**, **Table Operations** 컴포넌트가 각각 담당했습니다.

**Data Operations** 컴포넌트는 [`Message`](https://docs.langflow.org/data-types#message), [`JSON`](https://docs.langflow.org/data-types#json), [`Table`](https://docs.langflow.org/data-types#table) 입력에 대해 작업을 수행합니다.
**Input Type**을 설정하여 사용 가능한 작업 세트를 선택하세요.
출력 유형은 선택한 작업과 입력 유형에 따라 달라집니다.

## 플로우에서 Data Operations 컴포넌트 사용하기[​](#use-the-data-operations-component-in-a-flow "Direct link to Use the Data Operations component in a flow")

이 예제는 서로 다른 입력 유형을 가진 여러 개의 **Data Operations** 컴포넌트를 사용하는 완전한 데이터 변환 파이프라인을 보여줍니다.

웹훅에 샘플 JSON 메시지를 보내면, 파이프라인이 `products` 배열을 추출하고, 재고가 0보다 큰 제품만 필터링한 다음, 가격순으로 정렬하여 필터링된 결과를 표시합니다.

![Webhook, Type Convert, Chat Output 컴포넌트와 함께 Data Operations 컴포넌트를 사용하는 데이터 변환 플로우](https://docs.langflow.org/assets/images/component-operations-4fc672bb6575b073fa845e568892ed94.png)

1. JSON 데이터를 받기 위해 [**Webhook** 컴포넌트](https://docs.langflow.org/webhook)를 추가합니다.

2. 키를 선택하기 위해 **Data Operations** 컴포넌트를 추가합니다.
**Input Type**을 `JSON`으로, **Operation**을 **Select Keys**로 설정하고, `products` 키를 입력하여 제품 배열을 추출합니다.

3. `JSON`을 `Table`로 변환하기 위해 [**Type Convert** 컴포넌트](https://docs.langflow.org/type-convert)를 추가합니다.
**Input Type**을 `JSON`으로, **Output Type**을 `Table`로 설정합니다.

4. 행을 필터링하기 위해 또 다른 **Data Operations** 컴포넌트를 추가합니다.
**Input Type**을 `Table`로, **Operation**을 **Filter**로 설정하고, **Column Name**을 `stock`으로, **Filter Operator**를 `greater than`으로, **Filter Value**를 `0`으로 설정합니다.

5. 결과를 정렬하기 위해 또 다른 **Data Operations** 컴포넌트를 추가합니다.
**Input Type**을 `Table`로, **Operation**을 **Sort**로 설정하고, **Column Name**을 `price`로 설정한 다음 **Sort Ascending**을 활성화합니다.

6. 결과를 표시하기 위해 **Chat Output** 컴포넌트를 추가합니다.

7. 플로우를 테스트하려면 다음 JSON을 웹훅 엔드포인트로 전송하세요.
**YOUR_FLOW_ID**를 플로우의 UUID로 바꾸세요.

```bash
curl -X POST "http://localhost:7860/api/v1/webhook/YOUR_FLOW_ID" \  
  -H "Content-Type: application/json" \  
  -d '{  
    "store": "Electronics Warehouse",  
    "location": "New York",  
    "products": [  
      {  
        "name": "Widget A",  
        "price": 29.99,  
        "stock": 10,  
        "category": "Electronics"  
      },  
      {  
        "name": "Widget B",  
        "price": 49.99,  
        "stock": 5,  
        "category": "Electronics"  
      },  
      {  
        "name": "Widget C",  
        "price": 19.99,  
        "stock": 0,  
        "category": "Electronics"  
      },  
      {  
        "name": "Widget D",  
        "price": 39.99,  
        "stock": 15,  
        "category": "Electronics"  
      },  
      {  
        "name": "Widget E",  
        "price": 59.99,  
        "stock": 3,  
        "category": "Electronics"  
      }  
    ]  
  }'  
```

결과는 **Playground**에서 가격순으로 정렬된 재고가 있는 제품들의 `Table`이어야 합니다.
파이프라인 내 각 **Data Operations** 컴포넌트의 변환 단계를 확인하려면 **Inspect output**을 클릭하세요.

## 예제[​](#examples "Direct link to Examples")

- Text
- JSON
- Table

### 언어 모델의 텍스트 정리하기[​](#clean-text-from-a-language-model "Direct link to Clean text from a language model")

다음 예제는 언어 모델의 텍스트 출력을 다른 컴포넌트로 전달하기 전에 **Data Operations** 컴포넌트를 사용해 정리하는 방법을 보여줍니다.

1. **Language Model** 컴포넌트와 **Data Operations** 컴포넌트로 플로우를 만들고, **Language Model** 컴포넌트의 **Message** 출력을 **Data Operations** 컴포넌트의 **Text Input**에 연결합니다.

    모든 텍스트 작업은 입력으로 텍스트 문자열이 필요합니다.
이전 컴포넌트가 `Message`나 텍스트 출력을 생성하지 않는다면, 먼저 [**Type Convert** 컴포넌트](https://docs.langflow.org/type-convert)를 사용하여 데이터 형식을 변환할 수 있습니다.

2. **Input Type**을 `Text`로 설정한 다음 **Operation** 필드에서 **Text Clean**을 선택합니다.

  
  tip
      작업은 하나만 선택할 수 있습니다.
여러 작업을 수행해야 한다면, 여러 개의 **Data Operations** 컴포넌트를 연결하여 각 작업을 순차적으로 실행하세요.

3. 모델 출력을 정규화하기 위해 **Remove Extra Spaces**와 **Remove Empty Lines**를 활성화합니다.

4. 선택 사항: 결과를 **Playground**에서 확인하려면 출력을 **Chat Output** 컴포넌트에 연결하세요.

5. **Data Operations** 컴포넌트에서 **Run component**를 클릭한 다음 **Inspect output**을 클릭하여 결과를 확인합니다.

작업은 하나만 선택할 수 있습니다.
데이터에 대해 여러 작업을 수행해야 한다면, 여러 개의 **Data Operations** 컴포넌트를 연결하여 각 작업을 순차적으로 실행할 수 있습니다.
더 복잡한 다단계 작업의 경우, [**Smart Transform** 컴포넌트](https://docs.langflow.org/smart-transform)와 같은 컴포넌트를 사용하는 것을 고려하세요.

- **Select Keys**에서 `name`, `username`, `email` 키를 추가합니다.
각 키에 대한 필드를 추가하려면 **Add more**를 클릭하세요.

    이 예제에서는 웹훅이 항상 `name`, `username`, `email` 키를 포함하는 일관된 페이로드를 받는다고 가정합니다.
**Select Keys** 작업은 들어오는 각 페이로드에서 이 키들의 값을 추출합니다.

- 선택 사항: **Playground**에서 출력을 확인하려면 **Data Operations** 컴포넌트의 출력을 **Chat Output** 컴포넌트에 연결하세요.

    ![Webhook, Data Operations, Chat Output 컴포넌트를 가진 플로우](https://docs.langflow.org/assets/images/component-data-operations-select-key-93930aae7e89dd3367368845d3ed43e8.png)

- 플로우를 테스트하려면 플로우의 웹훅 엔드포인트로 다음 요청을 보내세요.
웹훅 엔드포인트에 대한 자세한 내용은 [웹훅으로 플로우 트리거하기](https://docs.langflow.org/webhook)를 참고하세요.

```bash
curl -X POST "http://$LANGFLOW_SERVER_URL/api/v1/webhook/$FLOW_ID" \  
-H "Content-Type: application/json" \  
-H "x-api-key: $LANGFLOW_API_KEY" \  
-d '{  
  "id": 1,  
  "name": "Leanne Graham",  
  "username": "Bret",  
  "email": "Sincere@april.biz",  
  "address": {  
    "street": "Main Street",  
    "suite": "Apt. 556",  
    "city": "Springfield",  
    "zipcode": "92998-3874",  
    "geo": {  
      "lat": "-37.3159",  
      "lng": "81.1496"  
    }  
  },  
  "phone": "1-770-736-8031 x56442",  
  "website": "hildegard.org",  
  "company": {  
    "name": "Acme-Corp",  
    "catchPhrase": "Multi-layered client-server neural-net",  
    "bs": "harness real-time e-markets"  
  }  
}'  
```

- **Select Keys** 작업 결과로 나온 `JSON`을 확인하려면 다음 중 하나를 수행하세요.

  - **Chat Output** 컴포넌트를 연결했다면, **Playground**를 열어 채팅 메시지로 결과를 확인하세요.
  - **Data Operations** 컴포넌트에서 **Inspect output**을 클릭하세요.

### Path Selection 작업[​](#path-selection-operation "Direct link to Path Selection operation")

**Path Selection** 작업을 사용하면 점(dot) 표기법 경로로 중첩된 JSON 구조에서 값을 추출할 수 있습니다.

1. **Input Type**을 `JSON`으로 설정한 다음 **Operation** 필드에서 **Path Selection**을 선택합니다.

2. **JSON to Map** 필드에 JSON 구조를 입력합니다.

    이 예제에서는 다음 JSON 구조를 사용합니다.

```json
{  
  "user": {  
    "profile": {  
      "name": "John Doe",  
      "email": "john@example.com"  
    },  
    "settings": {  
      "theme": "dark"  
    }  
  }  
}  
```

    **Select Path** 드롭다운에 사용 가능한 경로가 자동으로 채워집니다.

3. **Select Path** 드롭다운에서 경로를 선택합니다.
`.user.profile.name`과 같은 경로를 선택하여 "John Doe"를 추출하거나, `.user.settings.theme`을 선택하여 "dark"를 추출할 수 있습니다.

### JQ Expression 작업[​](#jq-expression-operation "Direct link to JQ Expression operation")

**JQ Expression** 작업을 사용하면 [jq](https://jqlang.org/) 쿼리 언어로 더 고급 JSON 필터링을 수행할 수 있습니다.

1. **Input Type**을 `JSON`으로 설정한 다음 **Operation** 필드에서 **JQ Expression**을 선택합니다.

2. **JQ Expression** 필드에 **Data Operations** 컴포넌트의 **JSON** 입력에 대해 실행할 `jq` 필터를 입력합니다.

    이 예제의 JSON 구조에서는 `.user.profile.name`과 같은 표현식으로 "John Doe"를 추출하거나, `.user.profile | {name, email}`로 필드를 새 객체로 투영하거나, `.user.profile | tostring`으로 해당 필드를 문자열로 변환할 수 있습니다.

```json
{  
  "user": {  
    "profile": {  
      "name": "John Doe",  
      "email": "john@example.com"  
    },  
    "settings": {  
      "theme": "dark"  
    }  
  }  
}  
```

작업은 하나만 선택할 수 있습니다.
데이터에 대해 여러 작업을 수행해야 한다면, 여러 개의 **Data Operations** 컴포넌트를 연결하여 각 작업을 순차적으로 실행할 수 있습니다.
스키마를 대폭 변경하거나 피벗하는 등 더 복잡한 다단계 작업의 경우, **Data Operations** 컴포넌트를 대체하거나 그 전처리 단계로서 [**Structured Output** 컴포넌트](https://docs.langflow.org/structured-output)나 [**Smart Transform** 컴포넌트](https://docs.langflow.org/smart-transform)와 같은 LLM 기반 컴포넌트를 사용하는 것을 고려하세요.

이 예제 플로우를 따라 하고 있다면, **Smart Transform** 컴포넌트로 추출된 데이터에 적용하고 싶은 작업을 아무거나 선택하세요.
들어오는 `Table`의 내용을 확인하려면 **Type Convert** 컴포넌트에서 **Run component**를 클릭한 다음 **Inspect output**을 클릭하세요.
`Table`이 잘못된 형태로 보인다면, 각 상위 컴포넌트에서 **Inspect output**을 클릭하여 오류가 발생하는 위치를 파악한 다음, 필요에 따라 플로우 설정을 수정하세요.
예를 들어 **Smart Transform** 컴포넌트가 예상한 필드를 추출하지 못했다면, 지시 사항을 수정하거나 **API Response** 출력에 해당 필드가 존재하는지 확인하세요.

- 작업의 파라미터를 설정합니다.
구체적인 파라미터는 선택한 작업에 따라 다릅니다.
예를 들어 **Filter** 작업을 선택했다면, **Column Name**, **Filter Value**, **Filter Operator** 파라미터로 필터 조건을 정의해야 합니다.
자세한 내용은 [Table operations](#table-operations)를 참고하세요.

- 플로우를 테스트하려면 **Data Operations** 컴포넌트에서 **Run component**를 클릭한 다음 **Inspect output**을 클릭하여 해당 작업으로 새로 생성된 `Table`을 확인하세요.

    **Playground**에서 출력을 확인하려면 **Data Operations** 컴포넌트의 출력을 **Chat Output** 컴포넌트에 연결하고, **Data Operations** 컴포넌트를 다시 실행한 다음 **Playground**를 클릭하세요.

다른 예시는 [조건부 루프](https://docs.langflow.org/loop#conditional-looping)를 참고하세요.

## Data Operations 파라미터[​](#data-operations-parameters "Direct link to Data Operations parameters")

많은 파라미터는 선택한 **Input Type**과 **Operation**에 따라 조건부로 표시됩니다.

일부 파라미터는 시각적 편집기에서 기본적으로 숨겨져 있습니다.
컴포넌트를 선택했을 때 나타나는 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-inspection-panel)을 통해 모든 컴포넌트 파라미터를 수정할 수 있습니다.

- Text
- JSON
- Table

**Input Type**이 `Text`로 설정되었을 때 사용 가능합니다.
대부분의 텍스트 작업은 `Message`를 반환합니다. **Word Count**는 `JSON` 객체를, **Text to DataFrame**은 `Table`을 반환합니다.

| Name                   | Display Name              | Info                                                                                                                                                                           |
| ---------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| text\_input            | Text Input                | 입력 파라미터. 처리할 텍스트 문자열입니다. 모든 작업에 필요합니다.                                                                                                                      |
| operation              | Operation                 | 입력 파라미터. 텍스트에 대해 수행할 작업입니다. [사용 가능한 텍스트 작업](#available-text-operations)을 참고하세요.                                                            |
| case\_type             | Case Type                 | 입력 파라미터. 적용할 대소문자 변환입니다. 옵션: `uppercase`, `lowercase`, `title`, `capitalize`, `swapcase`. 기본값: `lowercase`. **Case Conversion**에서만 표시됩니다. |
| search\_pattern        | Search Pattern            | 입력 파라미터. 찾을 텍스트나 정규식 패턴입니다. **Text Replace**에서만 표시됩니다.                                                                                           |
| replacement\_text      | Replacement Text          | 입력 파라미터. 각 일치 항목을 대체할 텍스트입니다. **Text Replace**에서만 표시됩니다.                                                                                       |
| use\_regex             | Use Regex                 | 입력 파라미터. 활성화하면 **Search Pattern**을 정규식으로 처리합니다. 기본값: 비활성화. **Text Replace**에서만 표시됩니다.                                            |
| extract\_pattern       | Extract Pattern           | 입력 파라미터. 텍스트와 대조할 정규식 패턴입니다. **Text Extract**에서만 표시됩니다.                                                                    |
| max\_matches           | Max Matches               | 입력 파라미터. 반환할 최대 일치 수입니다. 기본값: `10`. **Text Extract**에서만 표시됩니다.                                                                          |
| head\_characters       | Characters from Start     | 입력 파라미터. 텍스트 시작 부분에서 반환할 문자 수입니다. 음수가 될 수 없습니다. 기본값: `100`. **Text Head**에서만 표시됩니다.                            |
| tail\_characters       | Characters from End       | 입력 파라미터. 텍스트 끝 부분에서 반환할 문자 수입니다. 음수가 될 수 없습니다. 기본값: `100`. **Text Tail**에서만 표시됩니다.                                  |
| strip\_mode            | Strip Mode                | 입력 파라미터. 텍스트의 어느 쪽을 제거할지 지정합니다. 옵션: `both`(기본값), `left`, `right`. **Text Strip**에서만 표시됩니다.                                                |
| strip\_characters      | Characters to Strip       | 입력 파라미터. 제거할 특정 문자입니다. 비워두면 공백을 제거합니다. **Text Strip**에서만 표시됩니다.                                                                |
| text\_input\_2         | Second Text Input         | 입력 파라미터. 첫 번째 텍스트와 결합할 두 번째 텍스트 문자열입니다. **Text Join**에서만 표시됩니다.                                                                  |
| remove\_extra\_spaces  | Remove Extra Spaces       | 입력 파라미터. 연속된 여러 공백을 하나의 공백으로 축소합니다. 기본값: 활성화. **Text Clean**에서만 표시됩니다.                                                    |
| remove\_special\_chars | Remove Special Characters | 입력 파라미터. 영숫자와 공백을 제외한 모든 문자를 제거합니다. 기본값: 비활성화. **Text Clean**에서만 표시됩니다.                                                       |
| remove\_empty\_lines   | Remove Empty Lines        | 입력 파라미터. 텍스트에서 빈 줄을 제거합니다. 기본값: 비활성화. **Text Clean**에서만 표시됩니다.                                                                           |
| table\_separator       | Table Separator           | 입력 파라미터. 열을 구분하는 데 사용되는 문자입니다. 기본값: `|`. **Text to DataFrame**에서만 표시됩니다.                                                                    |
| has\_header            | Has Header                | 입력 파라미터. 첫 번째 행이 헤더 행인지 여부입니다. 기본값: 활성화. **Text to DataFrame**에서만 표시됩니다.                                                                |
| count\_words           | Count Words               | 입력 파라미터. 출력에 단어 수와 고유 단어 수를 포함합니다. 기본값: 활성화. **Word Count**에서만 표시됩니다.                                                      |
| count\_characters      | Count Characters          | 입력 파라미터. 출력에 문자 수(공백 포함/제외)를 포함합니다. **Word Count**에서만 표시됩니다.                                                             |
| count\_lines           | Count Lines               | 입력 파라미터. 출력에 전체 줄 수와 비어 있지 않은 줄 수를 포함합니다. 기본값: 활성화. **Word Count**에서만 표시됩니다.                                                        |

#### 사용 가능한 텍스트 작업[​](#available-text-operations "Direct link to Available text operations")

| Name              | Required Inputs                                                           | Output            | Process                                                                               |
| ----------------- | ------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------- |
| Word Count        | 없음                                                                      | `JSON`            | 텍스트의 단어, 고유 단어, 문자, 줄 수를 셉니다.                        |
| Case Conversion   | `case_​type`                                                              | `Message`         | 텍스트를 지정한 대소문자로 변환합니다.                                              |
| Text Replace      | `search_​pattern`, `replacement_​text`, `use_​regex`                      | `Message`         | 패턴과 일치하는 항목을 대체 텍스트로 바꿉니다.                              |
| Text Extract      | `extract_​pattern`, `max_​matches`                                        | `Message`         | 정규식 패턴과 일치하는 모든 부분 문자열을 추출하여 개행으로 구분된 텍스트로 반환합니다. |
| Text Head         | `head_​characters`                                                        | `Message`         | 텍스트의 처음 `n`개 문자를 반환합니다.                                         |
| Text Tail         | `tail_​characters`                                                        | `Message`         | 텍스트의 마지막 `n`개 문자를 반환합니다.                                         |
| Text Strip        | `strip_​mode`, `strip_​characters`                                        | `Message`         | 텍스트 양끝에서 공백이나 지정한 문자를 제거합니다.                |
| Text Join         | `text_​input_​2`                                                          | `Text`, `Message` | 두 텍스트 입력을 개행으로 구분하여 연결합니다.                                  |
| Text Clean        | `remove_​extra_​spaces`, `remove_​special_​chars`, `remove_​empty_​lines` | `Message`         | 여분의 공백, 특수 문자, 빈 줄을 제거하여 텍스트를 정규화합니다.        |
| Text to DataFrame | `table_​separator`, `has_​header`                                         | `Table`           | 구분자로 구분된 텍스트 테이블을 [`Table`](https://docs.langflow.org/data-types#table)로 변환합니다.        |

## 참고 자료[​](#see-also "Direct link to See also")

- [Parser](https://docs.langflow.org/parser)
- [Type Convert](https://docs.langflow.org/type-convert)
- [Smart Transform](https://docs.langflow.org/smart-transform)
