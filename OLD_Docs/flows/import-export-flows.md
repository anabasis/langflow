# 플로우 가져오기 및 내보내기

플로우를 내보내어 Langflow 인스턴스 간에 전송하거나, 다른 사람과 공유하거나, 백업을 만들 수 있습니다.

---

## 플로우 내보내기

플로우를 내보내는 세 가지 방법이 있습니다:

- **프로젝트에서 내보내기**: [**Projects** 페이지](./build-flows.md)에서 내보낼 플로우를 찾아 **More**를 클릭하고 **Export**를 선택합니다. 프로젝트의 모든 플로우를 내보내려면 **Projects** 목록에서 **Options**를 클릭하고 **Download**를 선택합니다.

- **공유로 내보내기**: 플로우를 편집할 때 **Share**를 클릭하고 **Export**를 클릭합니다.

- **Langflow API로 내보내기**: 하나의 플로우를 내보내려면 [`/flows/download`](https://docs.langflow.org/api-flows) 엔드포인트를 사용합니다. 프로젝트의 모든 플로우를 내보내려면 [`/projects/download`](https://docs.langflow.org/api-projects) 엔드포인트를 사용합니다.

내보낸 플로우는 `FLOW_NAME.json` 형식의 JSON 파일로 로컬 머신에 다운로드됩니다. 전체 프로젝트를 내보내면 JSON 파일이 zip 아카이브로 패키징됩니다.

### API 키와 함께 저장

**Projects** 페이지 또는 **Share** 메뉴에서 내보낼 때 **Save with my API keys**를 선택하여 플로우와 정의된 API 키 변수를 함께 내보낼 수 있습니다. **Save with my API keys** 설정에 관계없이 API 키가 아닌 변수는 내보내기에 포함됩니다.

> **경고**: 컴포넌트의 API 키 필드에 리터럴 키를 입력하면 **Save with my API keys**로 리터럴 키 값을 내보냅니다.
>
> 키가 Langflow 전역 변수에 저장되어 있으면 **Save with my API keys**는 변수 이름만 내보냅니다. 플로우를 다른 Langflow 인스턴스로 가져올 때 해당 인스턴스에 같은 이름의 Langflow 전역 변수와 유효한 값이 있어야 플로우를 성공적으로 실행할 수 있습니다.

---

## 플로우 가져오기

다음 방법으로 로컬 머신에서 Langflow JSON 파일을 가져올 수 있습니다:

- **프로젝트로 가져오기**: **Projects** 페이지에서 **Upload a flow**를 클릭하고 가져올 Langflow JSON 파일을 선택합니다.
- **어디서나 가져오기**: 파일 탐색기에서 Langflow JSON 파일을 Langflow 창으로 드래그 앤 드롭하여 모든 Langflow 페이지에서 플로우를 가져옵니다.
- **Langflow API로 가져오기**: 하나의 Langflow JSON 파일을 가져오려면 [`/flows/upload/`](https://docs.langflow.org/api-flows) 엔드포인트를 사용합니다. Langflow JSON 파일의 zip 아카이브를 가져오려면 [`/projects/upload`](https://docs.langflow.org/api-projects) 엔드포인트를 사용합니다.

### 가져온 플로우 실행

가져오면 플로우를 바로 사용할 수 있습니다. 플로우에 전역 변수가 포함되어 있으면 Langflow 인스턴스에 같은 이름과 유효한 값을 가진 전역 변수가 있는지 확인하세요.

---

## Langflow JSON 파일 내용

내보낸 플로우는 `FLOW_NAME.json` 형식의 JSON 파일로 다운로드됩니다.

Langflow JSON 파일에는 다음이 포함됩니다:
- 플로우의 컴포넌트와 연결을 설명하는 **노드(Nodes)** 및 **엣지(Edges)**
- 플로우와 해당 프로젝트를 설명하는 **추가 메타데이터**

### 노드

노드는 플로우를 구성하는 컴포넌트를 나타냅니다. 예를 들어, 다음 객체는 **Chat Input** 컴포넌트를 나타냅니다:

```json
{
  "data": {
    "description": "Get chat inputs from the Playground.",
    "display_name": "Chat Input",
    "id": "ChatInput-jFwUm",
    "node": {
      "base_classes": ["Message"],
      "description": "Get chat inputs from the Playground.",
      "display_name": "Chat Input",
      "icon": "MessagesSquare",
      "template": {
        "input_value": {
          "display_name": "Text",
          "info": "Message to be passed as input.",
          "value": "Hello"
        },
        "sender": {
          "value": "User",
          "options": ["Machine", "User"]
        },
        "sender_name": {
          "value": "User"
        },
        "should_store_message": {
          "value": true
        }
      }
    },
    "type": "ChatInput"
  },
  "position": {
    "x": 689.57,
    "y": 765.16
  }
}
```

각 노드는 `NODE_NAME-UUID` 형식의 고유 식별자를 가지며(예: `ChatInput-jFwUm`), `ChatInput` 노드와 같은 진입점 노드는 플로우 실행 시 처음 실행되는 노드입니다.

### 엣지

엣지는 노드 간의 연결을 나타냅니다. 다음 예는 `ChatInput` 노드와 `OpenAIModel` 노드 간의 엣지(연결)를 나타냅니다:

```json
{
  "data": {
    "sourceHandle": {
      "dataType": "ChatInput",
      "id": "ChatInput-jFwUm",
      "name": "message",
      "output_types": ["Message"]
    },
    "targetHandle": {
      "fieldName": "input_value",
      "id": "OpenAIModel-OcXkl",
      "inputTypes": ["Message"],
      "type": "str"
    }
  },
  "source": "ChatInput-jFwUm",
  "target": "OpenAIModel-OcXkl"
}
```

이 엣지는 `ChatInput` 컴포넌트가 `Message` 타입을 `target` 노드인 `OpenAIModel` 노드로 출력함을 보여줍니다.

### 추가 메타데이터 및 프로젝트 정보

플로우에 대한 추가 정보는 루트 `data` 객체에 저장됩니다. 여기에는 이름, 설명, `last_tested_version` 등의 메타데이터와 뷰포트 위치 정보, 그리고 플로우의 목적을 설명하는 **Notes**(마크다운 형식)가 포함됩니다.

```json
{
  "name": "Basic Prompting",
  "description": "Perform basic prompting with an OpenAI model.",
  "tags": ["chatbots"],
  "id": "1511c230-d446-43a7-bfc3-539e69ce05b8",
  "last_tested_version": "1.0.19.post2",
  "gradient": "2",
  "icon": "Braces"
}
```

---

## 참고 항목

- [플로우 빌드](./build-flows.md)
- [Langflow API로 플로우 트리거](./run-flows.md)

---

*원문: https://docs.langflow.org/next/concepts-flows-import*
