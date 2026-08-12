# Langflow를 A2A 서버로 사용하기
> 원문: https://docs.langflow.org/next/a2a-server

tip

Langflow 1.11.x 기준으로 A2A 지원은 기본적으로 **꺼져** 있습니다. 활성화하려면 Langflow를 시작하기 전에 다음 환경 변수를 설정하세요.

```bash
LANGFLOW_A2A_ENABLED=true
```

Langflow는 [Agent2Agent(A2A) 프로토콜](https://a2a-protocol.org/)을 지원합니다. 플로우를 게시하여 다른 에이전트가 호출할 수 있게 하거나, 플로우 내부에서 원격 A2A 에이전트를 호출할 수 있습니다.

이 페이지에서는 A2A 클라이언트가 검색하고 호출할 수 있는 A2A 에이전트로 플로우를 게시하는 방법을 설명합니다.

플로우 내부에서 원격 A2A 에이전트를 호출하려면 [**A2A Agent** 컴포넌트](https://docs.langflow.org/next/a2a-agent-component)를 참고하세요.

## 사전 요구 사항[​](#prerequisites "Direct link to Prerequisites")

- Langflow 서버에서 `LANGFLOW_A2A_ENABLED`가 `true`로 설정되어 있어야 합니다.
- [**Chat Input**](https://docs.langflow.org/chat-input-and-output#chat-input)(또는 **Human Input**) 컴포넌트와 [**Chat Output**](https://docs.langflow.org/chat-input-and-output#chat-output) 컴포넌트를 포함하는 [Langflow 플로우](https://docs.langflow.org/concepts-flows)가 있어야 합니다. A2A 호출자는 메시지를 보내고 응답을 읽으므로, 메시지를 수신하고 응답할 수 있는 플로우만 에이전트로 서비스될 수 있습니다. Langflow는 **Agent** 탭에서 플로우가 저장될 때 해당 플로우를 "에이전트 타입"으로 표시합니다. "워크플로우 타입" 플로우는 게시가 활성화되어 있어도 A2A 엔드포인트에서 `404`를 반환합니다.

## 플로우를 A2A 에이전트로 게시하기[​](#publish-a-flow-as-an-a2a-agent "Direct link to Publish a flow as an A2A agent")

1. 게시하려는 플로우를 엽니다.

2. 비주얼 에디터의 사이드바에서 **Agent**를 클릭합니다.

    **Agent** 창이 나타납니다.

    ![플로우를 A2A 에이전트로 서비스하기 위한 Agent 창](https://docs.langflow.org/assets/images/serve-a2a-40efbcf103178be45283923717b89e9d.png)

    이 창은 에이전트 서비스 설정을 하고 [에이전트 카드](#customize-the-agent-card)를 표시하며, A2A 엔드포인트용 테스터를 포함합니다.

    게시할 플로우에 채팅 입력이나 채팅 출력이 없는 경우, 상태는 **Unavailable**로 표시되고 토글이 비활성화됩니다.

    `LANGFLOW_A2A_ENABLED`가 `false`로 설정된 경우, 상태는 **Off**로 표시됩니다.

3. **Serve as an A2A agent**를 **On**으로 설정합니다.

    플로우 상태가 **Draft**로 변경됩니다.
플로우는 아직 서비스되지 않습니다.

4. 플로우를 게시하려면 **Save**를 클릭합니다.

    Langflow가 플로우를 게시합니다. 상태가 **Live**로 변경되고, Langflow는 플로우의 [에이전트 카드](#customize-the-agent-card)와 JSON-RPC 엔드포인트를 서비스합니다.

5. 게시된 에이전트를 테스트하려면 **Try it** 창에 메시지를 입력한 다음 **Send**를 클릭합니다.

    Langflow는 라이브 A2A 엔드포인트를 통해 메시지를 전송하고 에이전트의 응답을 표시하므로, 카드 URL을 공유하기 전에 에이전트가 응답하는지 확인할 수 있습니다.

    [프로젝트의 인증](#authentication)이 **API key** 또는 **OAuth**로 설정된 경우, **API key** 필드가 표시됩니다. 테스트 요청이 인증할 수 있도록 유효한 Langflow API 키를 붙여넣으세요. 프로젝트 인증이 **None**인 경우, 이 필드는 숨겨지며 키가 필요하지 않습니다.

6. 플로우의 엔드포인트를 공유하려면 **Address** 아래에서 **URL**을 선택합니다.

    또는 `message/send` 요청을 생성하려면 **curl**을 선택합니다.

플로우 서비스를 중지하려면 **Serve as an A2A agent**를 끄고 **Save**를 클릭합니다.

## A2A 엔드포인트[​](#a2a-endpoints "Direct link to A2A endpoints")

플로우가 게시되면, Langflow는 플로우에 대해 두 개의 엔드포인트를 서비스합니다.

| 엔드포인트                                                 | 설명                                                                                                                                                           |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /api/v1/a2a/{flow_​id}/.well-known/agent-card.json` | 클라이언트 검색에 사용되는 [에이전트 카드](#customize-the-agent-card)입니다. A2A 공개 카드는 A2A 스펙에 따라 인증이 필요하지 않습니다.                                       |
| `POST /api/v1/a2a/{flow_​id}/jsonrpc`                    | JSON-RPC 엔드포인트입니다. `message/send`, `message/stream`, `tasks/get`, `tasks/cancel`, `tasks/resubscribe`, `tasks/pushNotificationConfig/*` 메서드를 지원합니다. |

카드는 `protocolVersion` `0.3.0`과 선호 전송 방식으로 `JSONRPC`를 알립니다.

`message/send` 요청은 플로우를 실행하고 에이전트의 응답을 텍스트 아티팩트로 담은 완료된 작업(task)을 반환합니다. 여러 턴에 걸친 대화를 이어가려면 `contextId`를 전송하세요. Langflow는 이를 플로우의 채팅 세션에 매핑하므로, 동일한 `contextId`를 공유하는 메시지는 기록(history)을 공유합니다.

### 메시지 전송하기[​](#send-a-message "Direct link to Send a message")

메시지를 보내려면 에이전트 카드 URL이 아니라 **Address** 탭의 JSON-RPC URL을 사용하세요.
`FLOW_ID`를 실제 플로우 ID로 바꾸세요. [프로젝트의 인증](#authentication)이 키를 요구하는 경우 `x-api-key`를 포함하세요.

```python
import os
import uuid
import requests

url = "http://localhost:7860/api/v1/a2a/FLOW_ID/jsonrpc"
headers = {
    "Content-Type": "application/json",
    "x-api-key": os.environ["LANGFLOW_API_KEY"],  # 프로젝트 인증이 None이면 생략
}
payload = {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "message/send",
    "params": {
        "message": {
            "role": "user",
            "parts": [{"kind": "text", "text": "Hello"}],
            "messageId": uuid.uuid4().hex,
        }
    },
}

response = requests.post(url, headers=headers, json=payload, timeout=60)
response.raise_for_status()
print(response.json())
```

성공적인 응답은 완료된 작업(task)입니다. 에이전트의 응답 텍스트는 `result.artifacts[0].parts[0].text`에 있습니다. 여러 파트가 있는 경우, `result.artifacts[0].parts`를 순회하며 각 파트의 `text` 또는 `kind`별 다른 필드를 읽으세요.

응답 예시:

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "result": {
    "artifacts": [
      {
        "artifactId": "0775cf82-85b5-46a1-94aa-1e38db57cc2b",
        "name": "result",
        "parts": [
          {
            "kind": "text",
            "text": "Hello from docs test"
          }
        ]
      }
    ],
    "contextId": "8bc12160-1d54-4fe1-809d-95422945c3ed",
    "id": "7f3f305e-f02e-444a-90bf-01179646fd85",
    "kind": "task",
    "status": {
      "state": "completed",
      "timestamp": "2026-07-17T15:02:30.172601Z"
    }
  }
}
```

작업을 나중에 다시 읽으려면 `tasks/get`을 호출하세요.

```bash
curl -X POST "http://localhost:7860/api/v1/a2a/FLOW_ID/jsonrpc" \
  -H "Content-Type: application/json" \
  -H "x-api-key: LANGFLOW_API_KEY" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tasks/get",
    "params": {
      "id": "7f3f305e-f02e-444a-90bf-01179646fd85"
    }
  }'
```

응답 예시(`message/send`와 동일한 작업 페이로드):

```json
{
  "id": 2,
  "jsonrpc": "2.0",
  "result": {
    "artifacts": [
      {
        "artifactId": "0775cf82-85b5-46a1-94aa-1e38db57cc2b",
        "name": "result",
        "parts": [
          {
            "kind": "text",
            "text": "Hello from docs test"
          }
        ]
      }
    ],
    "contextId": "8bc12160-1d54-4fe1-809d-95422945c3ed",
    "id": "7f3f305e-f02e-444a-90bf-01179646fd85",
    "kind": "task",
    "status": {
      "state": "completed",
      "timestamp": "2026-07-17T15:02:30.172601Z"
    }
  }
}
```

동일한 채팅 세션을 이어가려면, 이후 `message/send` 요청에서 `contextId`를 재사용하세요.

```bash
curl -X POST "http://localhost:7860/api/v1/a2a/FLOW_ID/jsonrpc" \
  -H "Content-Type: application/json" \
  -H "x-api-key: LANGFLOW_API_KEY" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "message/send",
    "params": {
      "message": {
        "role": "user",
        "parts": [{"kind": "text", "text": "Follow-up"}],
        "messageId": "2",
        "contextId": "8bc12160-1d54-4fe1-809d-95422945c3ed"
      }
    }
  }'
```

## 스트리밍 및 푸시 알림[​](#streaming-and-push-notifications "Direct link to Streaming and push notifications")

에이전트 카드는 `streaming`과 `pushNotifications`를 모두 알립니다.

### 메시지 스트리밍하기[​](#stream-a-message "Direct link to Stream a message")

메시지를 스트리밍하려면 `message/send`와 동일한 메시지 형태로 `message/stream`을 호출하세요. 응답은 JSON-RPC 프레임의 SSE 스트림(`Content-Type: text/event-stream`)입니다.

```python
import json
import os
import uuid
import requests

url = "http://localhost:7860/api/v1/a2a/FLOW_ID/jsonrpc"
headers = {
    "Content-Type": "application/json",
    "x-api-key": os.environ["LANGFLOW_API_KEY"],  # 프로젝트 인증이 None이면 생략
}
payload = {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "message/stream",
    "params": {
        "message": {
            "role": "user",
            "parts": [{"kind": "text", "text": "Hello"}],
            "messageId": uuid.uuid4().hex,
        }
    },
}

with requests.post(url, headers=headers, json=payload, stream=True, timeout=60) as response:
    response.raise_for_status()
    for line in response.iter_lines(decode_unicode=True):
        if line and line.startswith("data:"):
            print(json.loads(line.removeprefix("data:").strip()))
```

SSE 응답 예시(`data:` 줄마다 하나의 JSON 객체):

```text
data: {"id":1,"jsonrpc":"2.0","result":{"contextId":"57bcbe61-9a27-40eb-9040-cfa7a677df17","id":"0732102b-ac16-4b84-8a40-0ecb06be8788","kind":"task","status":{"state":"submitted"}}}

data: {"id":1,"jsonrpc":"2.0","result":{"contextId":"57bcbe61-9a27-40eb-9040-cfa7a677df17","final":false,"kind":"status-update","status":{"state":"working","timestamp":"2026-07-17T15:02:30.341209Z"},"taskId":"0732102b-ac16-4b84-8a40-0ecb06be8788"}}

data: {"id":1,"jsonrpc":"2.0","result":{"append":false,"artifact":{"artifactId":"675b035c-8fc3-4740-aed2-ee635dd4aa2b","name":"result","parts":[{"kind":"text","text":"Hello stream"}]},"contextId":"57bcbe61-9a27-40eb-9040-cfa7a677df17","kind":"artifact-update","lastChunk":false,"taskId":"0732102b-ac16-4b84-8a40-0ecb06be8788"}}

data: {"id":1,"jsonrpc":"2.0","result":{"contextId":"57bcbe61-9a27-40eb-9040-cfa7a677df17","final":true,"kind":"status-update","status":{"state":"completed","timestamp":"2026-07-17T15:02:30.389825Z"},"taskId":"0732102b-ac16-4b84-8a40-0ecb06be8788"}}
```

### 작업 재구독하기[​](#resubscribe-to-a-task "Direct link to Resubscribe to a task")

작업 `id`와 함께 `tasks/resubscribe`를 호출하여 해당 작업의 이벤트 스트림에 다시 연결하세요.

```python
import json
import os
import requests

url = "http://localhost:7860/api/v1/a2a/FLOW_ID/jsonrpc"
headers = {
    "Content-Type": "application/json",
    "x-api-key": os.environ["LANGFLOW_API_KEY"],  # 프로젝트 인증이 None이면 생략
}
payload = {
    "jsonrpc": "2.0",
    "id": 12,
    "method": "tasks/resubscribe",
    "params": {"id": "TASK_ID"},
}

with requests.post(url, headers=headers, json=payload, stream=True, timeout=60) as response:
    response.raise_for_status()
    for line in response.iter_lines(decode_unicode=True):
        if line and line.startswith("data:"):
            print(json.loads(line.removeprefix("data:").strip()))
```

동일한 워커에서 해당 작업의 스트림이 여전히 살아 있다면, 구독자는 `message/stream`과 같은 SSE 프레임을 받습니다. 작업이 이미 완료된 경우(짧은 동기 실행에서 흔함), 스트림은 오류 프레임으로 종료됩니다.

```text
data: {"error":{"code":-32603,"message":"Task a8820afb-7af7-4831-9233-b236e25e63be has no active stream to resubscribe to"},"id":12,"jsonrpc":"2.0"}
```

라이브 재구독 큐는 메모리 내에 있으며 워커별로 관리됩니다. 멀티 워커 배포 환경에서는, 작업을 실행 중인 워커와 다른 워커로 라우팅된 `tasks/resubscribe` 요청은 "no active stream"을 반환합니다. 단일 워커를 사용하거나, 작업을 시작한 워커로의 스티키 라우팅을 사용하는 것이 좋습니다.

### 푸시 알림 웹훅 등록하기[​](#register-a-push-notification-webhook "Direct link to Register a push notification webhook")

초기 `message/send` 또는 `message/stream` 요청에 `pushNotificationConfig`를 포함하면, Langflow가 작업이 실행되는 동안 웹훅으로 라이프사이클 이벤트를 POST로 전송할 수 있습니다. 블로킹 `message/send`가 반환된 후 등록하면 이미 완료된 이벤트는 재전송되지 않습니다.

```python
import os
import uuid
import requests

url = "http://localhost:7860/api/v1/a2a/FLOW_ID/jsonrpc"
headers = {
    "Content-Type": "application/json",
    "x-api-key": os.environ["LANGFLOW_API_KEY"],  # 프로젝트 인증이 None이면 생략
}
payload = {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "message/send",
    "params": {
        "message": {
            "role": "user",
            "parts": [{"kind": "text", "text": "Hello"}],
            "messageId": uuid.uuid4().hex,
        },
        "configuration": {
            "pushNotificationConfig": {
                "url": "https://example.com/a2a-webhook",
            },
        },
    },
}

response = requests.post(url, headers=headers, json=payload, timeout=60)
response.raise_for_status()
print(response.json())
```

여전히 활성 상태인 작업에 웹훅을 추가하거나 업데이트하려면, `taskId`와 공개된 `http` 또는 `https` 웹훅 URL과 함께 `tasks/pushNotificationConfig/set`을 호출하세요. 이 메서드는 향후 이벤트에만 영향을 미치며, 이미 발생한 라이프사이클 이벤트는 재전송하지 않습니다.

```bash
curl -X POST "http://localhost:7860/api/v1/a2a/FLOW_ID/jsonrpc" \
  -H "Content-Type: application/json" \
  -H "x-api-key: LANGFLOW_API_KEY" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tasks/pushNotificationConfig/set",
    "params": {
      "taskId": "TASK_ID",
      "pushNotificationConfig": {
        "url": "https://example.com/a2a-webhook"
      }
    }
  }'
```

응답 예시:

```json
{
  "id": 3,
  "jsonrpc": "2.0",
  "result": {
    "pushNotificationConfig": {
      "id": "7f3f305e-f02e-444a-90bf-01179646fd85",
      "url": "https://example.com/a2a-webhook"
    },
    "taskId": "7f3f305e-f02e-444a-90bf-01179646fd85"
  }
}
```

warning

푸시 알림 설정은 메모리 내에 있으며 워커별로 관리됩니다. 멀티 워커 배포 환경에서는, 이후의 `tasks/pushNotificationConfig/*` 호출이나 웹훅 전송이 다른 워커에 저장된 설정을 놓칠 수 있습니다. 단일 워커를 사용하거나, 웹훅을 등록한 워커로의 스티키 라우팅을 사용하는 것이 좋습니다.

작업에 등록된 웹훅 목록은 `tasks/pushNotificationConfig/list`로 확인할 수 있습니다.

```python
import os
import requests

url = "http://localhost:7860/api/v1/a2a/FLOW_ID/jsonrpc"
headers = {
    "Content-Type": "application/json",
    "x-api-key": os.environ["LANGFLOW_API_KEY"],  # 프로젝트 인증이 None이면 생략
}
payload = {
    "jsonrpc": "2.0",
    "id": 4,
    "method": "tasks/pushNotificationConfig/list",
    "params": {"id": "TASK_ID"},
}

response = requests.post(url, headers=headers, json=payload, timeout=60)
response.raise_for_status()
print(response.json())
```

응답 예시:

```json
{
  "id": 4,
  "jsonrpc": "2.0",
  "result": [
    {
      "pushNotificationConfig": {
        "id": "7f3f305e-f02e-444a-90bf-01179646fd85",
        "url": "https://example.com/a2a-webhook"
      },
      "taskId": "7f3f305e-f02e-444a-90bf-01179646fd85"
    }
  ]
}
```

웹훅 URL은 등록 시 검증됩니다. 전체 주소가 공개 주소로 해석되는 `http` 및 `https` URL만 허용됩니다. 루프백, 사설, 링크 로컬, 예약된, 멀티캐스트, 미지정 대상은 거부됩니다. 신뢰할 수 있는 내부 네트워크에서 사설 웹훅 대상을 허용하려면 `LANGFLOW_A2A_ALLOW_PRIVATE_WEBHOOKS`를 `true`로 설정하세요.

`tasks/pushNotificationConfig/get` 및 `tasks/pushNotificationConfig/delete`로 설정을 관리할 수도 있습니다.

### 작업 취소하기[​](#cancel-a-task "Direct link to Cancel a task")

[휴먼 인풋(human input)](#human-in-the-loop-agents)을 기다리는 작업과 같은 활성 작업을 취소하려면, 취소할 작업 `id`와 함께 `tasks/cancel`을 호출하세요.

```bash
curl -X POST "http://localhost:7860/api/v1/a2a/FLOW_ID/jsonrpc" \
  -H "Content-Type: application/json" \
  -H "x-api-key: LANGFLOW_API_KEY" \
  -d '{
    "jsonrpc": "2.0",
    "id": 4,
    "method": "tasks/cancel",
    "params": {
      "id": "7f3f305e-f02e-444a-90bf-01179646fd85"
    }
  }'
```

Langflow는 취소된 상태를 유지하므로, 이후 `tasks/get`은 `canceled`를 반환합니다.
이미 완료되거나 실패한 작업은 취소할 수 없습니다.

## 에이전트 카드 커스터마이징하기[​](#customize-the-agent-card "Direct link to Customize the agent card")

A2A 프로토콜에서 **에이전트 카드**는 클라이언트가 에이전트가 무엇을 하는지, 어떻게 통신하는지 알기 위해 가져오는 JSON 파일입니다.

플로우를 게시하면 Langflow는 `/.well-known/agent-card.json`에서 카드를 서비스합니다.

기본적으로 카드는 플로우의 이름과 설명, Langflow 버전, 그리고 플로우의 입력 스키마에서 파생된 하나의 스킬을 사용합니다. **Agent** 탭의 **Customize card** 아래에서 에이전트 카드의 다음 필드를 설정할 수 있습니다.

| 필드           | 설명                                                            |
| --------------- | ---------------------------------------------------------------------- |
| **Name**        | 에이전트 이름입니다. 기본값은 플로우 이름입니다.                                             |
| **Version**     | 표시되는 버전입니다. 기본값은 Langflow 버전입니다.              |
| **Description** | 에이전트 설명입니다. 기본값은 플로우 설명입니다.               |
| **Tags**        | 사람들이 에이전트를 찾는 데 도움이 되는 키워드입니다. 기본값은 `langflow`입니다.      |
| **Examples**    | 호출자에게 표시되는 샘플 프롬프트입니다. 에이전트가 실행되는 방식에는 영향을 미치지 않습니다. |

변경 사항을 적용하려면 **Save**를 클릭하세요.

**Agent** 탭에는 플로우의 입력 스키마에서 파생된 카드의 **Input contract**도 표시됩니다.
**Input contract**는 MCP 도구의 입력 스키마와 유사하게, 에이전트가 호출자로부터 기대하는 필드 목록입니다.

## 인증[​](#authentication "Direct link to Authentication")

에이전트 카드 자체는 항상 공개되어 있으므로 클라이언트는 언제나 에이전트를 검색할 수 있습니다.
JSON-RPC 엔드포인트만 인증을 강제합니다.
해당 엔드포인트가 키를 요구하는지 여부는 [플로우 프로젝트의 인증 설정](https://docs.langflow.org/next/mcp-server#authentication)에 따라 달라집니다.

- **None**: 엔드포인트가 공개됩니다. 카드는 보안 스킴을 알리지 않으며 호출자는 `x-api-key`를 생략합니다.
- **API key**: 카드는 `apiKey` 보안 스킴을 알립니다. `message/send`와 `message/stream`은 `x-api-key` 헤더에 유효한 Langflow API 키를 요구합니다. 유효한 키가 없는 요청은 `401`을 반환합니다.
- **OAuth**: Langflow 1.11.x 기준으로 A2A에서는 지원되지 않습니다. 이 설정은 API key와 동일하게 동작합니다.

인증된 요청 예시:

```bash
curl -X POST "http://localhost:7860/api/v1/a2a/FLOW_ID/jsonrpc" \
  -H "Content-Type: application/json" \
  -H "x-api-key: LANGFLOW_API_KEY" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "message/send",
    "params": {
      "message": {
        "role": "user",
        "parts": [{"kind": "text", "text": "Hello"}],
        "messageId": "1"
      }
    }
  }'
```

## 휴먼 인 더 루프 에이전트[​](#human-in-the-loop-agents "Direct link to Human-in-the-loop agents")

플로우가 휴먼 인풋을 위해 일시 정지되면, `message/send`는 프롬프트와 함께 `input-required` 상태의 작업을 반환합니다. 재개하려면, 사람의 응답을 담은 동일한 `taskId`와 `contextId`로 또 다른 `message/send`를 전송하세요. Langflow는 체크포인트로부터 일시 정지된 플로우를 복원하고 플로우 실행을 계속합니다.

## 원격 A2A 에이전트 호출하기[​](#call-a-remote-a2a-agent "Direct link to Call a remote A2A agent")

[**A2A Agent** 컴포넌트](https://docs.langflow.org/next/a2a-agent-component)를 사용하면 플로우가 동일한 Langflow [프로젝트](https://docs.langflow.org/concepts-flows#projects) 내의 플로우를 호출하거나, 스펙을 준수하는 원격 A2A 에이전트를 호출할 수 있습니다.

자세한 내용은 [**A2A Agent** 컴포넌트](https://docs.langflow.org/next/a2a-agent-component)를 참고하세요.

## A2A 환경 변수[​](#a2a-environment-variables "Direct link to A2A environment variables")

| 변수                                  | 기본값 | 설명                                                                                                  |
| ----------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------ |
| `LANGFLOW_​A2A_​ENABLED`                  | `false` | 게시된 에이전트 타입 플로우에 대해 A2A 카드와 JSON-RPC 엔드포인트를 활성화합니다.                                |
| `LANGFLOW_​A2A_​ALLOW_​PRIVATE_​WEBHOOKS` | `false` | 사설 주소로 해석되는 푸시 알림 웹훅을 허용합니다. 신뢰할 수 있는 내부 네트워크에서만 사용하세요. |

## 참고[​](#see-also "Direct link to See also")

- [에이전트를 위한 도구 설정](https://docs.langflow.org/next/agents-tools)
- [Langflow를 MCP 클라이언트로 사용하기](https://docs.langflow.org/next/mcp-client)
