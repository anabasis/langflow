# flow 가져오기 및 내보내기
> 원문: https://docs.langflow.org/next/concepts-flows-import

flow를 내보내서 Langflow 인스턴스 간에 전송하거나, 다른 사람과 공유하거나, 백업을 생성할 수 있습니다.

## flow 내보내기[​](#export-a-flow "Direct link to Export a flow")

flow를 내보내는 방법은 세 가지입니다.

- **프로젝트에서 내보내기**: [**Projects** 페이지](https://docs.langflow.org/concepts-flows#projects)에서 내보내려는 flow를 찾고, **More**를 클릭한 다음 **Export**를 선택합니다. 프로젝트의 모든 flow를 내보내려면 **Projects** 목록에서 **Options**를 클릭한 다음 **Download**를 선택합니다.

- **공유를 통해 내보내기**: flow를 편집하는 동안 **Share**를 클릭한 다음 **Export**를 클릭합니다.

- **Langflow API로 내보내기**: 하나의 flow를 내보내려면 [`/flows/download`](https://docs.langflow.org/api-flows#export-flows) 엔드포인트를 사용하세요.
프로젝트의 모든 flow를 내보내려면 [`/projects/download`](https://docs.langflow.org/api-projects#export-a-project) 엔드포인트를 사용하세요.

내보낸 flow는 `FLOW_NAME.json`이라는 이름의 JSON 파일로 로컬 머신에 다운로드됩니다.
프로젝트 전체를 내보내면 JSON 파일들이 zip 아카이브로 패키징됩니다.
자세한 내용은 [Langflow JSON 파일 내용](#langflow-json-file-contents)을 참고하세요.

### 내 API 키와 함께 저장하기[​](#save-with-my-api-keys "Direct link to Save with my API keys")

**Projects** 페이지나 **Share** 메뉴에서 내보낼 때, **Save with my API keys**를 선택하면 flow *와* 정의된 API 키 변수를 함께 내보낼 수 있습니다.
API 키가 아닌 변수는 **Save with my API keys** 설정과 무관하게 내보내기에 포함됩니다.

경고

컴포넌트의 API 키 필드에 문자 그대로의 키를 입력하면, **Save with my API keys**는 그 리터럴 키 값을 내보냅니다.

키가 Langflow 전역 변수에 저장되어 있다면, **Save with my API keys**는 변수 이름만 내보냅니다.

본인이나 다른 사용자가 다른 Langflow 인스턴스로 flow를 가져올 때, 해당 인스턴스는 flow를 성공적으로 실행하기 위해 동일한 이름과 유효한 값을 가진 Langflow 전역 변수를 갖고 있어야 합니다.
변수가 누락되었거나 유효하지 않다면 flow를 가져온 후 해당 변수를 생성하거나 편집해야 합니다.

## flow 가져오기[​](#import-a-flow "Direct link to Import a flow")

로컬 머신에서 다음과 같은 방법으로 Langflow JSON 파일을 가져올 수 있습니다.

- **프로젝트로 가져오기**: **Projects** 페이지에서 **Upload a flow**를 클릭한 다음 가져올 Langflow JSON 파일을 선택합니다.
- **어디서든 가져오기**: 파일 탐색기에서 Langflow JSON 파일을 Langflow 창으로 드래그 앤 드롭하면 어떤 Langflow 페이지에서든 flow를 가져올 수 있습니다.
- **Langflow API로 가져오기**: 하나의 Langflow JSON 파일을 가져오려면 [`/flows/upload/`](https://docs.langflow.org/api-flows#import-flows) 엔드포인트를 사용하세요.
Langflow JSON 파일들의 zip 아카이브를 가져오려면 [`/projects/upload`](https://docs.langflow.org/api-projects#import-a-project) 엔드포인트를 사용하세요.

### 가져온 flow 실행하기[​](#run-an-imported-flow "Direct link to Run an imported flow")

가져오고 나면 flow는 바로 사용할 준비가 됩니다.
flow에 전역 변수가 포함되어 있다면, Langflow 인스턴스에 동일한 이름과 유효한 값을 가진 전역 변수가 있는지 확인하세요.
자세한 내용은 [내 API 키와 함께 저장하기](https://docs.langflow.org/concepts-flows-import#save-with-my-api-keys)를 참고하세요.

## Langflow JSON 파일 내용[​](#langflow-json-file-contents "Direct link to Langflow JSON file contents")

내보낸 flow는 `FLOW_NAME.json`이라는 이름의 JSON 파일로 로컬 머신에 다운로드됩니다.

Langflow JSON 파일에는 다음이 포함됩니다.

- flow의 컴포넌트와 연결을 설명하는 [노드](#nodes)와 [엣지](#edges).
- flow와 그것이 속한 프로젝트를 설명하는 [추가 메타데이터](#additional-metadata-and-project-information).

Langflow JSON 파일의 예시는 Langflow 저장소에 있는 [템플릿](https://github.com/langflow-ai/langflow/tree/main/src/backend/base/langflow/initial_setup/starter_projects)들을 살펴보거나, Langflow에서 템플릿으로 flow를 만들고 내보낸 다음 텍스트 편집기에서 내보낸 JSON 파일을 열어 확인할 수 있습니다.

### 노드[​](#nodes "Direct link to Nodes")

노드는 flow를 구성하는 컴포넌트를 나타냅니다.
예를 들어 다음 객체는 **Chat Input** 컴포넌트를 나타냅니다.

```
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
    "x": 689.5720422421635,
    "y": 765.155834131403
  }
}
```

각 노드는 `ChatInput-jFwUm`과 같이 `NODE_NAME-UUID` 형식의 고유 식별자를 가집니다.

`ChatInput` 노드와 같은 진입점 노드는 flow를 실행할 때 처음 실행되는 노드입니다.

### 엣지[​](#edges "Direct link to Edges")

엣지는 노드 간의 연결을 나타냅니다.

다음 예시는 `ChatInput` 노드와 `OpenAIModel` 노드 간의 엣지(연결)를 나타냅니다.

```
{
  "className": "",
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
  "id": "reactflow__edge-ChatInput-jFwUm{...}-OpenAIModel-OcXkl{...}",
  "source": "ChatInput-jFwUm",
  "sourceHandle": "{...}",
  "target": "OpenAIModel-OcXkl",
  "targetHandle": "{...}"
}
```

이 엣지는 `ChatInput` 컴포넌트가 `Message` 타입을 `target` 노드인 `OpenAIModel` 노드로 출력함을 보여줍니다.
`OpenAIModel` 컴포넌트는 `input_value` 필드에서 `Message` 타입을 받습니다.

### 추가 메타데이터와 프로젝트 정보[​](#additional-metadata-and-project-information "Direct link to Additional metadata and project information")

flow에 대한 추가 정보는 루트 `data` 객체에 저장됩니다.

- flow의 이름, 설명, `last_tested_version`을 포함한 메타데이터와 프로젝트 정보. 예를 들면 다음과 같습니다.

```
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

- 워크스페이스에서 flow를 열 때 뷰포트의 위치를 정의하는 flow에 대한 시각적 정보입니다.

```
"viewport": {
  "x": -37.61270157375441,
  "y": -155.91266341888854,
  "zoom": 0.7575251406952855
}
```

- **Notes**(메모)는 flow의 목적, 구성 세부사항, 그리고 flow를 편집하는 사용자에게 관련된 기타 정보를 설명하는 코멘트입니다.
텍스트, 링크, 코드 스니펫 및 기타 정보를 포함할 수 있습니다.
Markdown 형식으로 인코딩되어 `node` 객체로 저장됩니다.

```
{
  "id": "undefined-kVLkG",
  "node": {
    "description": "## 📖 README\nPerform basic prompting with an OpenAI model.\n\n#### Quick Start\n- Add your **OpenAI API key** to the **OpenAI Model**\n- Open the **Playground** to chat with your bot.\n..."
  }
}
```

## 참고 자료[​](#see-also "Direct link to See also")

- [flow 빌드하기](https://docs.langflow.org/concepts-flows)
- [flow 공유 및 임베드하기](https://docs.langflow.org/concepts-publish)
