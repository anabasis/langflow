# Langflow 데이터 타입
> 원문: https://docs.langflow.org/next/data-types

Langflow 컴포넌트는 특정 타입의 입력을 받아들이고 특정 타입의 출력을 생성하도록 설계되어 있습니다.
입력 및 출력 데이터 타입은 컴포넌트 간에 정보가 어떤 구조로 흐르는지를 정의합니다.
이러한 구조를 이해하면 유효한 입력을 제공하고 출력 형식을 정확히 예상하는 애플리케이션을 만드는 데 도움이 됩니다.

[컴포넌트 포트](https://docs.langflow.org/concepts-components#component-ports)는 각 컴포넌트가 주고받을 수 있는 데이터 타입을 나타냅니다.
일부 데이터 타입은 연결된 필드를 통해 자명하게 드러납니다. 예를 들어 **System Message** 필드는 [메시지 데이터](#message)를 받습니다. [포트 색상](https://docs.langflow.org/concepts-components#port-colors) 또한 포트의 데이터 타입을 나타냅니다.
예를 들어 로 표시되는 **JSON** 포트는 [구조화된 데이터 객체](#json)를 받거나 내보냅니다.

플로우를 만들 때는 같은 타입(색상)의 출력 포트를 입력 포트에 연결해야 두 컴포넌트 간에 해당 타입의 데이터를 전달할 수 있습니다.

팁

- [워크스페이스](https://docs.langflow.org/concepts-overview#workspace)에서 포트에 마우스를 올리면 해당 포트의 연결 세부 정보를 볼 수 있습니다.
포트를 클릭하면  **Search**로 호환되는 컴포넌트를 검색할 수 있습니다.

- 두 컴포넌트의 데이터 타입이 호환되지 않는 경우, [**Type Convert** 컴포넌트](https://docs.langflow.org/type-convert)와 같은 처리 컴포넌트를 사용해 컴포넌트 간 데이터를 변환할 수 있습니다.

## JSON[​](#json "JSON으로 바로 가기")

팁

Langflow 버전 1.9.0에서 `Data` 타입과 포트의 이름이 `JSON`으로 변경되었습니다.
`Data`를 사용하는 플로우는 하위 호환됩니다.

**JSON** 포트는 `JSON` 타입을 받거나 생성합니다. 이는 API로 전송할 법한 JSON 페이로드와 같은 구조화된 데이터 객체입니다.
이 데이터 타입은 사용자 프로필, 설정 등 구조화된 정보와 같은 키-값 쌍을 컴포넌트 간에 전달하는 데 사용됩니다.

`JSON` 객체는 `text_key`로 지정되는 기본 텍스트 필드와 추가 메타데이터를 포함합니다.

### 스키마 및 속성[​](#schema-and-attributes "스키마 및 속성으로 바로 가기")

스키마는 [`data.py`](https://github.com/langflow-ai/langflow/blob/main/src/lfx/src/lfx/schema/data.py)에 정의되어 있습니다.

사용 가능한 속성은 다음과 같습니다.

- `data`: `JSON` 객체는 `.data` 속성 안에 키-값 쌍을 저장합니다. 이는 `JSON` 객체의 핵심 딕셔너리입니다. 각 키는 필드 이름이며 값은 지원되는 모든 데이터 타입이 될 수 있습니다.
- `text_key`: `data` 중 기본 텍스트 값으로 간주되는 키입니다.
- `default_value`: `text_key`가 없을 때의 대체 값입니다. 기본 `text_key`는 `"text"`입니다.

```
data_obj = JSON(
    text_key="text",
    data={
        "text": "Hello world",
        "name": "Charlie",
        "age": 28
    },
    default_value=""
)
```

`JSON` 객체는 JSON으로 직렬화되거나 JSON으로부터 생성되거나 다른 딕셔너리 데이터로부터 생성될 수 있습니다.
다만 그 결과물인 `JSON` 객체는 단순한 딕셔너리가 아니라 검증 로직과 메서드를 갖춘 구조화된 객체입니다.
예를 들어 JSON으로 직렬화하면 앞선 Python 예제는 다음과 같은 JSON 객체가 됩니다.

```
{
  "text_key": "text",
  "data": {
    "text": "Hello world",
    "name": "Charlie",
    "age": 28
  },
  "default_value": ""
}
```

## Table[​](#table "Table로 바로 가기")

팁

Langflow 버전 1.9.0에서 `DataFrame` 타입과 포트의 이름이 `Table`로 변경되었습니다.
`DataFrame`을 사용하는 플로우는 하위 호환됩니다.

**Table** 포트는 [pandas DataFrame](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html)을 받거나 생성합니다. 이는 표 형태의 CSV 데이터와 유사합니다.

여러 행(레코드)으로 이루어진 데이터를 다룰 때는 `Table` 타입을 사용합니다.

### 스키마 및 속성[​](#schema-and-attributes-1 "스키마 및 속성으로 바로 가기")

스키마는 [`dataframe.py`](https://github.com/langflow-ai/langflow/blob/main/src/lfx/src/lfx/schema/dataframe.py)에 정의되어 있습니다.

사용 가능한 속성은 다음과 같습니다.

- **완전한 pandas 호환성**: 모든 pandas DataFrame 메서드와 기능이 지원됩니다.

- **Langflow 통합**: [`JSON` 객체](#json)의 리스트, 딕셔너리, 또는 기존 DataFrame을 받을 수 있습니다.

- **편의 메서드**:

  * `to_data_list()`
  * `add_row()`
  * `add_rows()`
  * `to_lc_documents()`
  * `to_data()`
  * `to_message()`

- **text_key 지원**: [`JSON` 객체](#json) 호환성을 위해 `text_key`와 `default_value` 속성을 유지합니다.

### Table 구조[​](#table-structure "Table 구조로 바로 가기")

Table은 행과 열로 이루어진 표 형태의 데이터 구조를 가집니다.
키가 열(column)이 되고, 배열 안의 각 객체가 행(row)이 됩니다.

```
[
  {
    "name": "Charlie Lastname",
    "age": 28,
    "email": "charlie.lastname@example.com"
  },
  {
    "name": "Alexandra Example",
    "age": 34,
    "email": "alexandra@example.com"
  }
]
```

표 데이터로 표현하면 앞선 Table 객체는 다음과 같은 구조가 됩니다.

```
| name | age | email |
|------|-----|-------|
| Charlie Lastname | 28 | charlie.lastname@example.com |
| Alexandra Example | 34 | alexandra@example.com |
```

## Embeddings[​](#embeddings "Embeddings로 바로 가기")

**Embeddings** 포트는 유사도 검색과 같은 기능을 지원하기 위해 벡터 임베딩을 생성하거나 받아들입니다.

`Embeddings` 데이터 타입은 [임베딩 모델 컴포넌트](https://docs.langflow.org/components-embedding-models)나 벡터 스토어 컴포넌트처럼 벡터 임베딩을 생성하거나 소비하는 컴포넌트에서 특별히 사용됩니다.

예를 들어 임베딩 모델 컴포넌트는 `Embeddings` 데이터를 출력하며, 이를 벡터 스토어 컴포넌트의 **Embedding** 입력 포트에 연결할 수 있습니다.

`Embeddings`를 생성하는 기반 Python 클래스에 대한 정보는 [LangChain Embedding 모델 문서](https://docs.langchain.com/oss/python/integrations/text_embedding)를 참조하세요.

## LanguageModel[​](#languagemodel "LanguageModel로 바로 가기")

`LanguageModel` 타입은 언어 모델 컴포넌트가 생성할 수 있고 LLM을 사용하는 컴포넌트가 받아들일 수 있는 특정 데이터 타입입니다.

언어 모델 컴포넌트의 출력 타입을 **Model Response**에서 **Language Model**로 변경하면 컴포넌트의 출력 포트가 **Message** 포트에서 **Language Model** 포트로 바뀝니다.
그런 다음 나가는 **Language Model** 포트를 **Smart Transform** 컴포넌트와 같이 호환되는 컴포넌트의 **Language Model** 입력 포트에 연결합니다.

플로우에서 이런 컴포넌트를 사용하는 방법과 `LanguageModel` 출력을 전환하는 방법에 대한 자세한 내용은 [언어 모델 컴포넌트](https://docs.langflow.org/components-models#language-model-output-types)를 참조하세요.

**LanguageModel은 LangChain ChatModel의 인스턴스입니다**

Langflow는 LangChain을 기반으로 구축되었기 때문에, `LanguageModel`은 실제로 원본 컴포넌트에서 설정한 구성 파라미터를 사용하는 [LangChain 채팅 모델](https://docs.langchain.com/oss/python/integrations/chat)의 인스턴스입니다.

컴포넌트는 대개 [`ChatOpenAI`](https://docs.langchain.com/oss/python/integrations/chat/openai)나 [`ChatAnthropic`](https://docs.langchain.com/oss/python/integrations/chat/anthropic)처럼 특정 모델 제공사를 지원하도록 설계된 통합 채팅 모델의 인스턴스를 생성합니다.

컴포넌트가 어떤 특정 `Chat` 인스턴스를 생성하는지는 [컴포넌트 코드](https://docs.langflow.org/concepts-components#component-code)를 확인하면 알 수 있습니다.

## Memory[​](#memory "Memory로 바로 가기")

**Memory** 포트는 **Message History** 컴포넌트를 외부 채팅 메모리 저장소와 통합하는 데 사용됩니다.

자세한 내용은 [**Message History** 컴포넌트](https://docs.langflow.org/message-history)를 참조하세요.

## Message[​](#message "Message로 바로 가기")

**Message** 포트는 `Message` 데이터를 받거나 생성합니다. 이는 채팅 플로우에서 흔히 사용되는 텍스트 입력을 위한 추가 필드와 메서드로 [`JSON` 타입](#json)을 확장한 것입니다.

이 데이터 타입은 많은 컴포넌트에서 사용됩니다.

팁

`Message` 데이터를 받거나 생성하는 컴포넌트가 들어오거나 나가는 `Message` 데이터에 모든 속성을 포함하지 않을 수도 있습니다.
데이터가 `Message` 스키마와 호환되기만 하면 유효한 것으로 간주됩니다.

플로우를 만들 때는 컴포넌트 사이에 전달되는 데이터 타입보다 워크스페이스에서 각 컴포넌트에 표시되는 필드에 집중하는 것이 좋습니다.
특정 데이터 타입의 세부 사항은 예상한 출력이 나오지 않는 플로우나 컴포넌트를 디버깅할 때만 관련이 있는 경우가 많습니다.

예를 들어 **Chat Input** 컴포넌트는 **Input Text**(`input_value`) 필드의 내용만 필요로 합니다.
그런 다음 컴포넌트는 완전한 `Message` 객체를 구성해 플로우의 다른 컴포넌트로 데이터를 전달합니다.

### 스키마, 구조, 속성[​](#schema-structure-and-attributes "스키마, 구조, 속성으로 바로 가기")

`Message` 스키마는 [`message.py`](https://github.com/langflow-ai/langflow/blob/main/src/lfx/src/lfx/schema/message.py)에 정의되어 있습니다.
[`content_block.py`](https://github.com/langflow-ai/langflow/blob/main/src/backend/base/langflow/schema/content_block.py)처럼 일부 `Message` 속성은 자체 스키마 정의를 갖습니다.

`Message` 데이터는 JSON 객체로 구조화됩니다. 예를 들면 다음과 같습니다.

```
{
  "text": "Name: Charlie Lastname, Age: 28, Email: charlie.lastname@example.com",
  "sender": "User",
  "sender_name": "Charlie Lastname",
  "session_id": "some-session-id",
  "timestamp": "2024-06-01T12:00:00Z",
  "files": [],
  "content_blocks": [],
  "category": "message"
}
```

특정 `Message` 객체에 포함되는 속성은 컴포넌트 타입, 플로우 동작, 메시지가 질의인지 응답인지 등 맥락에 따라 달라집니다.
일반적으로 포함되는 속성은 다음과 같습니다.

- `text`: 메시지의 주요 내용입니다.
- `sender`: 채팅 메시지의 발신자를 `User` 또는 `Language Model`로 식별합니다.
- `sender_name`: 발신자의 표시 이름입니다. 기본값은 `User` 또는 `Language Model`입니다.
- `session_id`: 채팅 [세션 식별자](https://docs.langflow.org/session-id)입니다.
- `flow_id`: 메시지가 연결된 플로우의 ID입니다. 플로우가 사용자 지정 세션 ID를 사용하지 않는다면 `flow_id`와 `session_id`는 동일합니다.
- `timestamp`: 메시지가 전송된 UTC 타임스탬프입니다.
- `files`: 메시지에 포함된 파일 경로나 이미지 목록입니다.
- `content_blocks`: 텍스트, 미디어, 코드와 같은 풍부한 콘텐츠 입력을 담는 컨테이너입니다. LLM이 입력을 처리할 수 없을 때의 오류 메시지 정보도 포함됩니다.
- `category`: `"message"`, `"error"`, `"warning"`, 또는 `"info"` 중 하나입니다.

모든 속성이 필수는 아니며, 일부 컴포넌트는 원문 텍스트 입력처럼 메시지와 호환되는 입력을 받아들입니다.
엄격함의 정도는 컴포넌트마다 다릅니다.

### 입력 및 출력 컴포넌트의 Message 데이터[​](#message-data-in-input-and-output-components "입력 및 출력 컴포넌트의 Message 데이터로 바로 가기")

[**Chat Input and Output** 컴포넌트](https://docs.langflow.org/chat-input-and-output)를 사용하는 플로우에서 `Message` 데이터는 채팅 상호작용을 위한 일관된 구조를 제공하며, 챗봇, 대화 분석, LLM 또는 에이전트와의 대화 기반 사용 사례에 이상적입니다.
이런 플로우에서 **Playground** 채팅 인터페이스는 `text`, `files`, `content_blocks`의 오류 메시지 등 대화와 관련된 `Message` 속성만 출력합니다.
모든 `Message` 속성을 보려면 **Playground**의 메시지 로그를 확인하세요.

**Text Input and Output** 컴포넌트(현재는 레거시)를 사용하는 플로우에서는 `Message` 데이터가 채팅 관련 메타데이터 없이 단순한 텍스트 문자열을 전달하는 데 사용됩니다.
이런 컴포넌트는 `Message` 데이터를 진행 중인 대화의 일부가 아니라 독립적인 텍스트 문자열로 처리합니다.
이 때문에 **Text Input and Output** 컴포넌트만 있는 플로우는 **Playground**와 호환되지 않습니다.
이런 컴포넌트는 [**Chat Input and Output** 컴포넌트](https://docs.langflow.org/chat-input-and-output)로 교체하세요.

Langflow API를 사용할 때 응답에는 플로우 실행의 다른 응답 데이터와 함께 `Message` 객체가 포함됩니다.
Langflow API 응답은 매우 장황할 수 있으므로 애플리케이션에는 사용자에게 반환할 관련 데이터를 응답에서 추출하는 코드를 포함해야 합니다.
예시는 [Langflow 퀵스타트](https://docs.langflow.org/get-started-quickstart)를 참조하세요.

또한 입력/출력 컴포넌트의 입력 포트로 전달되는 입력이 완전한 `Message` 객체일 필요는 없습니다. 컴포넌트가 `Message` 객체를 구성한 뒤 플로우의 다른 컴포넌트로 전달하거나 플로우 출력으로 반환하기 때문입니다.
사실 `timestamp`처럼 정확성을 위해 컴포넌트가 직접 추가해야 하는 속성이 있으므로, 일부 컴포넌트는 완전한 `Message` 객체를 받아서는 안 됩니다.

## Tool[​](#tool "Tool로 바로 가기")

**Tool** 포트는 도구를 **Agent** 컴포넌트에 연결합니다.

도구는 **Tool Mode**를 활성화한 다른 컴포넌트일 수도 있고, 전용 **MCP Tools** 컴포넌트일 수도 있으며, **Tool Mode**만 지원하는 다른 컴포넌트일 수도 있습니다.
여러 도구를 동일한 **Agent** 컴포넌트의 같은 포트에 연결할 수 있습니다.

기능적으로 `Tool` 데이터는 에이전트 플로우에서 사용할 수 있는 LangChain `StructuredTool` 객체입니다.

자세한 내용은 [에이전트용 도구 구성](https://docs.langflow.org/agents-tools)과 [Langflow를 MCP 클라이언트로 사용하기](https://docs.langflow.org/mcp-client)를 참조하세요.

## 알 수 없거나 여러 타입[​](#unknown-or-multiple-types "알 수 없거나 여러 타입으로 바로 가기")

포트가 여러 데이터 타입을 받거나 생성할 수 있는 경우, 회색 포트 아이콘으로 표시됩니다.

포트에 마우스를 올리면 받아들이거나 생성하는 데이터 타입을 확인할 수 있습니다.

## 플로우에서 데이터 타입 확인하기[​](#view-data-types-in-flows "플로우에서 데이터 타입 확인하기로 바로 가기")

Langflow에서는  **Inspect output**을 사용해 개별 컴포넌트의 출력을 확인할 수 있습니다.
이는 다양한 데이터 타입을 학습하고, 유효하지 않거나 잘못된 형식의 입력 및 출력 문제를 디버깅하는 데 도움이 됩니다.

다음 예시는 한 타입의 데이터를 다른 타입으로 변환할 수 있는 [**Type Convert** 컴포넌트](https://docs.langflow.org/type-convert)의 출력을 확인하는 방법을 보여줍니다.

1. 플로우를 만들고 **Chat Input** 컴포넌트를 **Type Convert** 컴포넌트에 연결합니다.

2. **Chat Input** 컴포넌트에 타입 변환기가 처리할 텍스트를 입력합니다.

3. **Type Convert** 컴포넌트에서  **Run component**를 클릭한 다음  **Inspect output**을 클릭합니다.

    기본 출력은 `Message` 데이터이며, 이는 **Chat Input** 컴포넌트에서 들어온 입력과 동일합니다.
`Message` 데이터가 `JSON` 또는 `Table`로 변환된 것을 보려면 **Type Convert** 컴포넌트의 **Output Type**을 변경한 다음 컴포넌트를 다시 실행하세요.

## 참고[​](#see-also "참고로 바로 가기")

- [커스텀 컴포넌트](https://docs.langflow.org/components-custom-components)
- [Pydantic Models](https://docs.pydantic.dev/latest/api/base_model/)
- [pandas.DataFrame](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html)
