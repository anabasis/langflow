# Langflow 데이터 타입

Langflow 컴포넌트는 특정 유형의 입력과 출력을 허용하고 생성하도록 설계되었습니다. 입력 및 출력 데이터 타입은 컴포넌트 간의 정보 구조와 흐름을 정의합니다.

[컴포넌트 포트](../components-reference/components-overview.md)는 각 컴포넌트가 주고받을 수 있는 데이터 타입을 나타냅니다. 포트 색상도 포트의 데이터 타입을 나타냅니다.

플로우를 구축할 때 동일한 유형(색상)의 입력 포트에 출력 포트를 연결하여 두 컴포넌트 간에 해당 유형의 데이터를 전송합니다.

> **팁**: 워크스페이스에서 포트 위에 마우스를 올리면 해당 포트의 연결 세부 정보를 볼 수 있습니다. 포트를 클릭하면 호환 가능한 컴포넌트를 검색할 수 있습니다.
>
> 두 컴포넌트의 데이터 타입이 호환되지 않는 경우 **Type Convert** 컴포넌트를 사용하여 컴포넌트 간에 데이터를 변환할 수 있습니다.

---

## JSON

> **참고**: Langflow 1.9.0 버전에서 `Data` 타입과 포트가 `JSON`으로 이름이 변경되었습니다. `Data`를 사용하는 플로우는 하위 호환됩니다.

**JSON** 포트는 `JSON` 타입을 허용하거나 생성합니다. 이는 API로 보내는 JSON 페이로드와 유사한 구조화된 데이터 객체입니다. 이 데이터 타입은 사용자 프로파일, 설정 또는 기타 구조화된 정보와 같은 키-값 쌍을 컴포넌트 간에 전달하는 데 사용됩니다.

`JSON` 객체는 `text_key`로 표시되는 기본 텍스트 필드와 추가 메타데이터를 포함합니다.

### 스키마 및 속성

- `data`: 키-값 쌍을 저장하는 핵심 딕셔너리
- `text_key`: 기본 텍스트 값으로 간주되는 `data`의 키
- `default_value`: `text_key`가 없을 때의 대체값. 기본 `text_key`는 `"text"`

```python
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

JSON으로 직렬화하면:

```json
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

---

## Table

> **참고**: Langflow 1.9.0 버전에서 `DataFrame` 타입과 포트가 `Table`로 이름이 변경되었습니다. `DataFrame`을 사용하는 플로우는 하위 호환됩니다.

**Table** 포트는 테이블 형식 CSV 데이터와 유사한 [pandas DataFrames](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html)를 허용하거나 생성합니다.

여러 행 또는 레코드가 포함된 데이터 작업에 `Table` 타입을 사용합니다.

### Table 구조

Table은 행과 열이 있는 표 형식 데이터 구조를 가집니다. 키는 열이고 배열의 각 객체는 행입니다:

```json
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

표 형식으로 표현하면:

| name | age | email |
|------|-----|-------|
| Charlie Lastname | 28 | charlie.lastname@example.com |
| Alexandra Example | 34 | alexandra@example.com |

---

## Embeddings

**Embeddings** 포트는 유사성 검색과 같은 기능을 지원하기 위해 벡터 임베딩을 방출하거나 수집합니다.

`Embeddings` 데이터 타입은 임베딩 모델 컴포넌트와 벡터 스토어 컴포넌트와 같이 벡터 임베딩을 생성하거나 소비하는 컴포넌트에서 특별히 사용됩니다.

---

## LanguageModel

`LanguageModel` 타입은 언어 모델 컴포넌트에서 생성되고 LLM을 사용하는 컴포넌트에서 허용될 수 있는 특정 데이터 타입입니다.

언어 모델 컴포넌트의 출력 타입을 **Model Response**에서 **Language Model**로 변경하면 컴포넌트의 출력 포트가 **Message** 포트에서 **Language Model** 포트로 변경됩니다.

Langflow는 LangChain을 기반으로 구축되어 있어, `LanguageModel`은 실제로 원래 컴포넌트에서 설정한 구성 매개변수를 사용하는 [LangChain 채팅 모델](https://docs.langchain.com/oss/python/integrations/chat)의 인스턴스입니다.

---

## Memory

**Memory** 포트는 **Message History** 컴포넌트를 외부 채팅 메모리 저장소와 통합하는 데 사용됩니다.

---

## Message

**Message** 포트는 `Message` 데이터를 허용하거나 생성합니다. 이는 채팅 플로우에서 일반적으로 사용되는 텍스트 입력을 위한 추가 필드 및 메서드로 [`JSON` 타입](#json)을 확장합니다.

### 스키마, 구조 및 속성

`Message` 데이터는 JSON 객체로 구조화됩니다:

```json
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

주요 속성:
- `text`: 주요 메시지 내용
- `sender`: 채팅 메시지의 발신자. `User` 또는 `Language Model`
- `sender_name`: 발신자의 표시 이름
- `session_id`: 채팅 세션 식별자
- `flow_id`: 메시지와 연관된 플로우의 ID
- `timestamp`: 메시지가 전송된 UTC 타임스탬프
- `files`: 메시지와 함께 포함된 파일 경로 또는 이미지 목록
- `content_blocks`: 텍스트, 미디어 또는 코드와 같은 리치 콘텐츠 입력 컨테이너
- `category`: `"message"`, `"error"`, `"warning"`, 또는 `"info"`

---

## Tool

**Tool** 포트는 도구를 **Agent** 컴포넌트에 연결합니다.

도구는 **Tool Mode**를 활성화한 다른 컴포넌트이거나, 전용 **MCP Tools** 컴포넌트이거나, **Tool Mode**만 지원하는 다른 컴포넌트일 수 있습니다.

기능적으로 `Tool` 데이터는 에이전트 플로우에서 사용할 수 있는 LangChain `StructuredTool` 객체입니다.

---

## 알 수 없는 타입 또는 여러 타입

포트가 여러 데이터 타입을 허용하거나 생성할 수 있는 경우 회색 포트 아이콘으로 표시됩니다.

포트 위에 마우스를 올리면 허용되거나 생성되는 데이터 타입을 볼 수 있습니다.

---

## 플로우에서 데이터 타입 보기

Langflow에서 **Inspect output**을 사용하여 개별 컴포넌트의 출력을 볼 수 있습니다.

예를 들어 **Type Convert** 컴포넌트를 사용하여 데이터를 한 타입에서 다른 타입으로 변환하는 방법:

1. 플로우를 만들고 **Chat Input** 컴포넌트를 **Type Convert** 컴포넌트에 연결합니다.
2. **Chat Input** 컴포넌트에서 타입 변환기가 처리할 텍스트를 입력합니다.
3. **Type Convert** 컴포넌트에서 **Run component**를 클릭하고 **Inspect output**을 클릭합니다.

---

## 참고 항목

- [커스텀 컴포넌트](../components-reference/components-overview.md)
- [Pydantic Models](https://docs.pydantic.dev/latest/api/base_model/)
- [pandas.DataFrame](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html)

---

*원문: https://docs.langflow.org/next/data-types*
