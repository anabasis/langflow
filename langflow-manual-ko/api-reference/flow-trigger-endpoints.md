# 플로우 트리거 엔드포인트
> 원문: https://docs.langflow.org/next/api-flows-run

`/run`과 `/webhook` 엔드포인트를 사용해 플로우를 실행합니다.

플로우를 생성, 조회, 업데이트, 삭제하려면 [플로우 관리 엔드포인트](https://docs.langflow.org/api-flows)를 참고하십시오.

## 플로우 실행(Run flow)[​](#run-flow "Direct link to Run flow")

팁

Langflow는 모든 플로우에 대해 `/v1/run/$FLOW_ID` 엔드포인트용 Python, JavaScript, curl 코드 스니펫을 자동으로 생성합니다.
자세한 내용은 [API 코드 스니펫 생성하기](https://docs.langflow.org/concepts-publish#generate-api-code-snippets)를 참고하십시오.

지정한 ID 또는 이름으로 플로우를 실행합니다.
플로우 ID는 [**API access** 패널](https://docs.langflow.org/concepts-publish#api-access)의 코드 스니펫이나 플로우 URL에서 확인할 수 있습니다.

다음 예시는 요청 본문에 플로우 파라미터를 전달하여 **Basic Prompting** 템플릿 플로우를 실행합니다.
이 플로우는 채팅 입력 문자열(`input_value`)을 필요로 하며, 다른 모든 파라미터는 기본값을 사용합니다.

- Python
- JavaScript
- curl

```
1import os
2
3import requests
4
5base = os.environ.get("LANGFLOW_URL") or os.environ.get("LANGFLOW_SERVER_URL", "")
6flow_id = os.environ.get("FLOW_ID", "")
7api_key = os.environ.get("LANGFLOW_API_KEY", "")
8
9url = f"{base}/api/v1/run/{flow_id}"
10
11headers = {
12    "Content-Type": "application/json",
13    "x-api-key": api_key,
14}
15
16payload = {
17    "input_value": "Tell me about something interesting!",
18    "session_id": "chat-123",
19    "input_type": "chat",
20    "output_type": "chat",
21    "output_component": "",
22}
23
24response = requests.post(url, headers=headers, json=payload, timeout=60)
25response.raise_for_status()
26print(response.text)
```

`/v1/run/$FLOW_ID`의 응답에는 실행에 대한 메타데이터, 입력, 출력이 포함됩니다.

**결과(Result)**

다음 예시는 Basic Prompting 플로우의 응답을 보여줍니다.

```
{
  "session_id": "chat-123",
  "outputs": [{
    "inputs": {
      "input_value": "Tell me about something interesting!"
    },
    "outputs": [{
      "results": {
        "message": {
          "text": "Sure! Have you ever heard of the phenomenon known as \"bioluminescence\"? It's a fascinating natural occurrence where living organisms produce and emit light. This ability is found in various species, including certain types of jellyfish, fireflies, and deep-sea creatures like anglerfish.\n\nBioluminescence occurs through a chemical reaction in which a light-emitting molecule called luciferin reacts with oxygen, catalyzed by an enzyme called luciferase. The result is a beautiful glow that can serve various purposes, such as attracting mates, deterring predators, or luring prey.\n\nOne of the most stunning displays of bioluminescence can be seen in the ocean, where certain plankton emit light when disturbed, creating a mesmerizing blue glow in the water. This phenomenon is often referred to as \"sea sparkle\" and can be seen in coastal areas around the world.\n\nBioluminescence not only captivates our imagination but also has practical applications in science and medicine, including the development of biosensors and imaging techniques. It's a remarkable example of nature's creativity and complexity!",
          "sender": "Machine",
          "sender_name": "AI",
          "session_id": "chat-123",
          "timestamp": "2025-03-03T17:17:37+00:00",
          "flow_id": "d2bbd92b-187e-4c84-b2d4-5df365704201",
          "properties": {
            "source": {
              "id": "OpenAIModel-d1wOZ",
              "display_name": "OpenAI",
              "source": "gpt-4o-mini"
            },
            "icon": "OpenAI"
          },
          "component_id": "ChatOutput-ylMzN"
        }
      }
    }]
  }]
}
```

애플리케이션에서 응답을 파싱하는 경우, 전체 응답을 사용자에게 그대로 전달하기보다는 응답에서 관련 콘텐츠를 추출해야 하는 경우가 많습니다.
Langflow API 응답에서 데이터를 추출하는 스크립트 예시는 [퀵스타트](https://docs.langflow.org/get-started-quickstart)를 참고하십시오.

### LLM 토큰 응답 스트리밍[​](#stream-llm-token-responses "Direct link to Stream LLM token responses")

`/v1/run/$FLOW_ID`를 사용하면 플로우는 배치로 실행되며 선택적으로 LLM 토큰 응답 스트리밍을 사용할 수 있습니다.

LLM 토큰 응답을 스트리밍하려면 요청에 `?stream=true` 쿼리 파라미터를 추가하십시오.

- Python
- JavaScript
- curl

```
1import os
2
3import requests
4
5url = f"{os.getenv('LANGFLOW_SERVER_URL', '')}/api/v1/run/{os.getenv('FLOW_ID', '')}?stream=true"
6
7headers = {
8    "accept": "application/json",
9    "Content-Type": "application/json",
10    "x-api-key": f"{os.getenv('LANGFLOW_API_KEY', '')}",
11}
12
13payload = {"message": "Tell me something interesting!", "session_id": "chat-123"}
14
15response = requests.request("POST", url, headers=headers, json=payload)
16response.raise_for_status()
17
18print(response.text)
```

LLM 채팅 응답은 `token` 이벤트로 스트리밍되어 돌아오며, 마지막에 연결을 종료하는 `end` 이벤트로 마무리됩니다.

**결과(Result)**

다음 예시는 가독성을 위해 축약되었으며, 일련의 `token` 이벤트와 LLM의 토큰 스트리밍 응답을 종료하는 마지막 `end` 이벤트를 보여줍니다.

```
{"event": "add_message", "data": {"timestamp": "2025-03-03T17:20:18", "sender": "User", "sender_name": "User", "session_id": "chat-123", "text": "Tell me about something interesting!", "files": [], "error": false, "edit": false, "properties": {"text_color": "", "background_color": "", "edited": false, "source": {"id": null, "display_name": null, "source": null}, "icon": "", "allow_markdown": false, "positive_feedback": null, "state": "complete", "targets": []}, "category": "message", "content_blocks": [], "id": "0103a21b-ebf7-4c02-9d72-017fb297f812", "flow_id": "d2bbd92b-187e-4c84-b2d4-5df365704201"}}

{"event": "add_message", "data": {"timestamp": "2025-03-03T17:20:18", "sender": "Machine", "sender_name": "AI", "session_id": "chat-123", "text": "", "files": [], "error": false, "edit": false, "properties": {"text_color": "", "background_color": "", "edited": false, "source": {"id": "OpenAIModel-d1wOZ", "display_name": "OpenAI", "source": "gpt-4o-mini"}, "icon": "OpenAI", "allow_markdown": false, "positive_feedback": null, "state": "complete", "targets": []}, "category": "message", "content_blocks": [], "id": "27b66789-e673-4c65-9e81-021752925161", "flow_id": "d2bbd92b-187e-4c84-b2d4-5df365704201"}}

{"event": "token", "data": {"chunk": " Have", "id": "27b66789-e673-4c65-9e81-021752925161", "timestamp": "2025-03-03 17:20:18 UTC"}}

{"event": "token", "data": {"chunk": " you", "id": "27b66789-e673-4c65-9e81-021752925161", "timestamp": "2025-03-03 17:20:18 UTC"}}

{"event": "token", "data": {"chunk": " ever", "id": "27b66789-e673-4c65-9e81-021752925161", "timestamp": "2025-03-03 17:20:18 UTC"}}

{"event": "token", "data": {"chunk": " heard", "id": "27b66789-e673-4c65-9e81-021752925161", "timestamp": "2025-03-03 17:20:18 UTC"}}

{"event": "token", "data": {"chunk": " of", "id": "27b66789-e673-4c65-9e81-021752925161", "timestamp": "2025-03-03 17:20:18 UTC"}}

{"event": "token", "data": {"chunk": " the", "id": "27b66789-e673-4c65-9e81-021752925161", "timestamp": "2025-03-03 17:20:18 UTC"}}

{"event": "token", "data": {"chunk": " phenomenon", "id": "27b66789-e673-4c65-9e81-021752925161", "timestamp": "2025-03-03 17:20:18 UTC"}}

{"event": "end", "data": {"result": {"session_id": "chat-123", "message": "Sure! Have you ever heard of the phenomenon known as \"bioluminescence\"?..."}}}
```

### Run 엔드포인트 헤더[​](#run-endpoint-headers "Direct link to Run endpoint headers")

| Header | Info | Example |
| --- | --- | --- |
| Content-Type | 필수. JSON 형식을 지정합니다. | "application/json" |
| accept | 선택. 응답 형식을 지정합니다. 지정하지 않으면 JSON이 기본값입니다. | "application/json" |
| x-api-key | 필수. 인증을 위한 Langflow API 키입니다. 헤더 또는 쿼리 파라미터로 전달할 수 있습니다. | "sk-..." |
| `X-LANGFLOW-GLOBAL-VAR-*` | 선택. 플로우에 전역 변수를 전달합니다. 변수 이름은 자동으로 대문자로 변환됩니다. 이 변수들은 OS 환경 변수보다 우선하며, 이 특정 요청 실행 중에만 사용할 수 있습니다. | `"X-LANGFLOW-GLOBAL-VAR-API_KEY: sk-..."` |

### Run 엔드포인트 파라미터[​](#run-endpoint-parameters "Direct link to Run endpoint parameters")

| Parameter | Type | Info |
| --- | --- | --- |
| flow_id | UUID/string | 필수. URL의 일부: `/run/$FLOW_ID` |
| stream | Boolean | 선택. 쿼리 파라미터: `/run/$FLOW_ID?stream=true` |
| input_value | string | 선택. JSON 본문 필드. 주요 입력 텍스트/프롬프트. 기본값: `null` |
| input_type | string | 선택. JSON 본문 필드. 입력 유형("chat" 또는 "text"). 기본값: `"chat"` |
| output_type | string | 선택. JSON 본문 필드. 출력 유형("chat", "any", "debug"). 기본값: `"chat"` |
| output_component | string | 선택. JSON 본문 필드. 출력 대상 컴포넌트. 기본값: `""` |
| tweaks | object | 선택. JSON 본문 필드. 컴포넌트 조정. 기본값: `null` |
| session_id | string | 선택. JSON 본문 필드. 대화 맥락 ID. [세션 ID](https://docs.langflow.org/session-id) 참고. 기본값: `null` |

### 모든 헤더와 파라미터를 포함한 요청 예시[​](#request-example-with-all-headers-and-parameters "Direct link to Request example with all headers and parameters")

- Python
- JavaScript
- curl

```
1import os
2
3import requests
4
5base = os.environ.get("LANGFLOW_URL") or os.environ.get("LANGFLOW_SERVER_URL", "")
6flow_id = os.environ.get("FLOW_ID", "")
7api_key = os.environ.get("LANGFLOW_API_KEY", "")
8
9headers = {
10    "Content-Type": "application/json",
11    "accept": "application/json",
12    "x-api-key": api_key,
13}
14
15payload = {
16    "input_value": "Tell me a story",
17    "input_type": "chat",
18    "output_type": "chat",
19    "output_component": "chat_output",
20    "session_id": "chat-123",
21}
22
23response = requests.post(
24    f"{base}/api/v1/run/{flow_id}?stream=false",
25    headers=headers,
26    json=payload,
27    timeout=60,
28)
29response.raise_for_status()
30print(response.text)
```

### 요청 헤더로 전역 변수 전달하기[​](#pass-global-variables-in-headers "Direct link to Pass global variables in request headers")

`X-LANGFLOW-GLOBAL-VAR-{VARIABLE_NAME}` 형식의 HTTP 헤더를 사용해 플로우에 전역 변수를 전달할 수 있습니다.

헤더로 전달된 변수는 OS 환경 변수보다 우선합니다. 변수가 헤더와 환경 변수 모두에 제공된 경우, 헤더 값이 사용됩니다. 변수는 이 특정 요청 실행 중에만 사용할 수 있으며 지속되지 않습니다.

변수 이름은 자동으로 대문자로 변환됩니다. 예를 들어 `X-LANGFLOW-GLOBAL-VAR-api-key`는 플로우 내에서 `API_KEY`가 됩니다.

이 변수를 먼저 Langflow의 Global Variables 섹션에서 만들 필요는 없습니다. 이 헤더 형식을 사용해 어떤 변수 이름이든 전달할 수 있습니다.

- Python
- JavaScript
- curl

```
1import os
2
3import requests
4
5base = os.environ.get("LANGFLOW_URL") or os.environ.get("LANGFLOW_SERVER_URL", "")
6flow_id = os.environ.get("FLOW_ID", "")
7api_key = os.environ.get("LANGFLOW_API_KEY", "")
8
9headers = {
10    "Content-Type": "application/json",
11    "x-api-key": api_key,
12    "X-LANGFLOW-GLOBAL-VAR-USER_ID": "user123",
13    "X-LANGFLOW-GLOBAL-VAR-ENVIRONMENT": "production",
14}
15
16payload = {
17    "input_value": "Tell me about something interesting!",
18    "input_type": "chat",
19    "output_type": "chat",
20}
21
22response = requests.post(f"{base}/api/v1/run/{flow_id}", headers=headers, json=payload, timeout=60)
23response.raise_for_status()
24print(response.text)
```

플로우 컴포넌트가 헤더나 Langflow 데이터베이스에서 제공되지 않은 변수를 참조하는 경우, 플로우는 기본적으로 실패합니다. 이를 방지하려면 `.env` 파일에 `LANGFLOW_FALLBACK_TO_ENV_VAR=True`를 설정할 수 있으며, 이렇게 하면 다른 방법으로 지정되지 않은 경우 플로우가 OS 환경 변수의 값을 사용할 수 있습니다.

## 웹훅으로 플로우 실행(Webhook run flow)[​](#webhook-run-flow "Direct link to Webhook run flow")

`/webhook` 엔드포인트를 사용해 HTTP `POST` 요청을 보내 플로우를 시작합니다.

팁

플로우에 [**Webhook** 컴포넌트](https://docs.langflow.org/webhook)를 추가한 후, [**API access** 패널](https://docs.langflow.org/concepts-publish)을 열고 **Webhook curl** 탭을 클릭하면 해당 플로우에 대해 자동으로 생성된 `POST /webhook` 요청을 얻을 수 있습니다.
자세한 내용은 [웹훅으로 플로우 트리거하기](https://docs.langflow.org/webhook)를 참고하십시오.

- Python
- JavaScript
- curl

```
1import os
2
3import requests
4
5base = os.environ.get("LANGFLOW_URL") or os.environ.get("LANGFLOW_SERVER_URL", "")
6flow_id = os.environ.get("FLOW_ID", "")
7api_key = os.environ.get("LANGFLOW_API_KEY", "")
8
9headers = {
10    "Content-Type": "application/json",
11    "x-api-key": api_key,
12}
13
14payload = {"data": "example-data"}
15
16response = requests.post(
17    f"{base}/api/v1/webhook/{flow_id}",
18    headers=headers,
19    json=payload,
20    timeout=60,
21)
22response.raise_for_status()
23print(response.text)
```

**결과(Result)**

```
1{
2  "message": "Task started in the background",
3  "status": "in progress"
4}
```

## 지원 종료된 플로우 트리거 엔드포인트[​](#deprecated-flow-trigger-endpoints "Direct link to Deprecated flow trigger endpoints")

다음 엔드포인트는 지원 종료(deprecated)되었으며 `/run` 엔드포인트로 대체되었습니다.

- `/process`
- `/predict`
