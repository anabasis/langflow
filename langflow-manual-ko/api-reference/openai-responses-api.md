# OpenAI Responses API
> 원문: https://docs.langflow.org/next/api-openai-responses

Langflow에는 [OpenAI Responses API](https://platform.openai.com/docs/api-reference/responses)와 호환되는 엔드포인트가 포함되어 있습니다.
이 엔드포인트는 `POST /api/v1/responses`에서 사용할 수 있습니다.

이 엔드포인트를 사용하면 최소한의 코드 변경만으로 기존 OpenAI 클라이언트 라이브러리를 사용할 수 있습니다.
`gpt-4`와 같은 `model` 이름을 `flow_id`로 교체하기만 하면 됩니다.
플로우 ID는 [**API access** 패널](https://docs.langflow.org/concepts-publish#api-access)의 코드 스니펫이나 플로우 URL에서 찾을 수 있습니다.

## 사전 요구 사항[​](#prerequisites "Direct link to Prerequisites")

Langflow의 OpenAI Responses API 엔드포인트와 호환되려면, 플로우와 요청이 다음 요구 사항을 충족해야 합니다.

- **Chat Input**: 플로우에는 **Chat Input** 컴포넌트가 있어야 합니다.
이 컴포넌트가 없는 플로우를 이 엔드포인트에 전달하면 오류가 반환됩니다.
컴포넌트 유형 `ChatInput`과 `Chat Input`은 채팅 입력으로 인식됩니다.
- **Tools**: `tools` 파라미터는 지원되지 않으며, 제공될 경우 오류를 반환합니다.
- **Model Names**: 요청에서 `model` 필드는 유효한 플로우 ID 또는 엔드포인트 이름을 포함해야 합니다.
- **Authentication**: 모든 요청은 `x-api-key` 헤더에 전달된 API 키가 필요합니다.
자세한 내용은 [API 키 및 인증](https://docs.langflow.org/api-keys-and-authentication)을 참고하십시오.

### OpenAI 클라이언트 라이브러리를 위한 추가 설정[​](#additional-configuration-for-openai-client-libraries "Direct link to Additional configuration for OpenAI client libraries")

이 엔드포인트는 OpenAI의 API와 호환되지만, OpenAI 클라이언트 라이브러리를 사용할 때는 특별한 설정이 필요합니다.
Langflow는 인증에 `x-api-key` 헤더를 사용하는 반면, OpenAI는 `Authorization: Bearer` 헤더를 사용합니다.
OpenAI 클라이언트 라이브러리로 Langflow에 요청을 보낼 때는 커스텀 헤더를 설정하고 `api_key` 설정을 포함해야 합니다.
`api_key` 파라미터는 클라이언트 예시의 `"dummy-api-key"`처럼 어떤 값이든 가질 수 있습니다. 실제 인증은 `default_headers` 설정을 통해 처리되기 때문입니다.

다음 예시에서 `LANGFLOW_SERVER_URL`, `LANGFLOW_API_KEY`, `FLOW_ID` 값을 배포 환경의 값으로 교체하십시오.

- OpenAI Python Client
- OpenAI TypeScript Client

```python
import os

from openai import OpenAI

base = (os.environ.get("LANGFLOW_URL") or os.environ.get("LANGFLOW_SERVER_URL", "")).rstrip("/")
api_key = os.environ.get("LANGFLOW_API_KEY", "")
flow_id = os.environ.get("FLOW_ID", "")

client = OpenAI(
    base_url=f"{base}/api/v1/",
    default_headers={"x-api-key": api_key},
    api_key="dummy-api-key",  # Required by OpenAI SDK but not used by Langflow
)

try:
    response = client.responses.create(
        model=flow_id,
        input="There is an event that happens on the second wednesday of every month. What are the event dates in 2026?",
    )
except Exception as exc:
    # Empty bootstrap flows return an error body; use a flow with ChatInput + ChatOutput in the UI.
    print(exc)
else:
    try:
        print(response.output_text)
    except Exception:
        print(response)
```

**응답(Response)**

```text
Here are the event dates for the second Wednesday of each month in 2026:
- January 14, 2026
- February 11, 2026
- March 11, 2026
- April 8, 2026
- May 13, 2026
- June 10, 2026
- July 8, 2026
- August 12, 2026
- September 9, 2026
- October 14, 2026
- November 11, 2026
- December 9, 2026
If you need these in a different format or want a downloadable calendar, let me know!
```

## 예시 요청[​](#example-request "Direct link to Example request")

- Python
- JavaScript
- curl

```python
import os

import requests

url = f"{os.getenv('LANGFLOW_SERVER_URL', '')}/api/v1/responses"

headers = {
    "x-api-key": f"{os.getenv('LANGFLOW_API_KEY', '')}",
    "Content-Type": "application/json",
}

payload = {"model": "$YOUR_FLOW_ID", "input": "Hello, how are you?", "stream": False}

response = requests.request("POST", url, headers=headers, json=payload)
response.raise_for_status()

print(response.text)
```

### 헤더[​](#headers "Direct link to Headers")

| Header | Required | Description | Example |
| --- | --- | --- | --- |
| `x-api-key` | Yes | 인증을 위한 Langflow API 키 | `"sk-..."` |
| `Content-Type` | Yes | JSON 형식을 지정 | `"application/json"` |
| `X-LANGFLOW-GLOBAL-VAR-*` | No | 플로우에 대한 전역 변수 | `"X-LANGFLOW-GLOBAL-VAR-API_KEY: sk-..."` 자세한 내용은 [헤더로 플로우에 전역 변수 전달하기](#global-var) 참고. |

### 요청 본문[​](#request-body "Direct link to Request body")

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `model` | `string` | Yes | - | 실행할 플로우 ID 또는 엔드포인트 이름. |
| `input` | `string` | Yes | - | 처리할 입력 텍스트. |
| `stream` | `boolean` | No | `false` | 응답을 스트리밍할지 여부. |
| `background` | `boolean` | No | `false` | 백그라운드에서 처리할지 여부. |
| `tools` | `list[Any]` | No | `null` | Tools는 아직 지원되지 않습니다. |
| `previous_response_id` | `string` | No | `null` | 대화를 이어갈 이전 응답의 ID. 자세한 내용은 [응답 및 세션 ID로 대화 이어가기](#response-id) 참고. |
| `include` | `list[string]` | No | `null` | 포함할 추가 응답 데이터. 예: `['tool_call.results']`. 자세한 내용은 [도구 호출 결과 조회하기](#tool-call-results) 참고. |

## 예시 응답[​](#example-response "Direct link to Example response")

```json
{
  "id": "e5e8ef8a-7efd-4090-a110-6aca082bceb7",
  "object": "response",
  "created_at": 1756837941,
  "status": "completed",
  "model": "ced2ec91-f325-4bf0-8754-f3198c2b1563",
  "output": [
    {
      "type": "message",
      "id": "msg_e5e8ef8a-7efd-4090-a110-6aca082bceb7",
      "status": "completed",
      "role": "assistant",
      "content": [
        {
          "type": "output_text",
          "text": "Hello! I'm here and ready to help. How can I assist you today?",
          "annotations": []
        }
      ]
    }
  ],
  "parallel_tool_calls": true,
  "previous_response_id": null,
  "reasoning": {"effort": null, "summary": null},
  "store": true,
  "temperature": 1.0,
  "text": {"format": {"type": "text"}},
  "tool_choice": "auto",
  "tools": [],
  "top_p": 1.0,
  "truncation": "disabled",
  "usage": null,
  "user": null,
  "metadata": {}
}
```

### 응답 본문[​](#response-body "Direct link to Response body")

응답에는 Langflow가 동적으로 설정하는 필드와 OpenAI 호환 기본값을 사용하는 필드가 포함됩니다.

위에 표시된 OpenAI 호환 기본값은 현재 고정되어 있으며 요청을 통해 수정할 수 없습니다.
이 값들은 API 호환성을 유지하고 일관된 응답 형식을 제공하기 위해 포함되어 있습니다.

요청 시에는 동적 필드만 설정하게 됩니다.
기본값은 완전성을 위해, 그리고 전체 응답 구조를 보여주기 위해 여기에 문서화되어 있습니다.

Langflow가 동적으로 설정하는 필드:

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | 고유 응답 식별자. |
| `created_at` | `int` | 응답 생성의 Unix 타임스탬프. |
| `model` | `string` | 실행된 플로우 ID. |
| `output` | `list[dict]` | 출력 항목(메시지, 도구 호출 등)의 배열. |
| `previous_response_id` | `string` | 대화를 이어가는 경우 이전 응답의 ID. |
| `usage` | `dict` | `usage` 필드가 사용 가능한 경우의 토큰 사용량 통계. `prompt_tokens`, `completion_tokens`, `total_tokens`를 포함합니다. |

**OpenAI 호환 기본값을 가진 필드**

| Field | Type | Default Value | Description |
| --- | --- | --- | --- |
| `object` | `string` | `"response"` | 항상 `"response"`. |
| `status` | `string` | `"completed"` | 응답 상태: `"completed"`, `"in_progress"`, 또는 `"failed"`. |
| `error` | `dict` | `null` | 오류 세부 정보(있는 경우). |
| `incomplete_details` | `dict` | `null` | 불완전한 응답 세부 정보(있는 경우). |
| `instructions` | `string` | `null` | 응답 지시 사항(있는 경우). |
| `max_output_tokens` | `int` | `null` | 최대 출력 토큰 수(있는 경우). |
| `parallel_tool_calls` | `boolean` | `true` | 병렬 도구 호출 활성화 여부. |
| `reasoning` | `dict` | `{"effort": null, "summary": null}` | effort와 summary를 포함한 추론 정보. |
| `store` | `boolean` | `true` | 응답이 저장되는지 여부. |
| `temperature` | `float` | `1.0` | 온도 설정. |
| `text` | `dict` | `{"format": {"type": "text"}}` | 텍스트 형식 설정. |
| `tool_choice` | `string` | `"auto"` | 도구 선택 설정. |
| `tools` | `list[dict]` | `[]` | 사용 가능한 도구. |
| `top_p` | `float` | `1.0` | Top-p 설정. |
| `truncation` | `string` | `"disabled"` | 잘림(truncation) 설정. |
| `usage` | `dict` | `null` | 토큰 사용량 통계. 플로우 컴포넌트에서 사용 가능할 때 동적으로 설정되며, 그렇지 않으면 `null`. [토큰 사용량 추적](#token-usage-tracking) 참고. |
| `user` | `string` | `null` | 사용자 식별자(있는 경우). |
| `metadata` | `dict` | `{}` | 추가 메타데이터. |

## 스트리밍 요청 예시[​](#example-streaming-request "Direct link to Example streaming request")

요청에서 `"stream": true`를 설정하면, API는 응답이 생성됨에 따라 각 청크가 응답의 작은 부분을 포함하는 스트림을 반환합니다. 이를 통해 사용자가 ChatGPT의 타이핑 효과와 유사하게 AI의 출력이 단어 단위로 나타나는 실시간 경험을 할 수 있습니다.

- Python
- JavaScript
- curl

```python
import os

import requests

url = f"{os.getenv('LANGFLOW_SERVER_URL', '')}/api/v1/responses"

headers = {
    "x-api-key": f"{os.getenv('LANGFLOW_API_KEY', '')}",
    "Content-Type": "application/json",
}

payload = {"model": "$FLOW_ID", "input": "Tell me a story about a robot", "stream": True}

response = requests.request("POST", url, headers=headers, json=payload)
response.raise_for_status()

print(response.text)
```

**결과(Result)**

```json
{
  "id": "f7fcea36-f128-41c4-9ac1-e683137375d5",
  "object": "response.chunk",
  "created": 1756838094,
  "model": "ced2ec91-f325-4bf0-8754-f3198c2b1563",
  "delta": {
    "content": "Once"
  },
  "status": null
}
```

### 스트리밍 응답 본문[​](#streaming-response-body "Direct link to Streaming response body")

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | 고유 응답 식별자. |
| `object` | `string` | 항상 `"response.chunk"`. |
| `created` | `int` | 청크 생성의 Unix 타임스탬프. |
| `model` | `string` | 실행된 플로우 ID. |
| `delta` | `dict` | 새로 추가된 콘텐츠 청크. |
| `status` | `string` | 응답 상태: `"completed"`, `"in_progress"`, 또는 `"failed"`(선택). |

스트림은 응답이 완료되었음을 나타내는 `"status": "completed"`가 포함된 마지막 청크까지 계속됩니다.

**최종 완료 청크**

```text
{
  "id": "f7fcea36-f128-41c4-9ac1-e683137375d5",
  "object": "response.chunk",
  "created": 1756838094,
  "model": "ced2ec91-f325-4bf0-8754-f3198c2b1563",
  "delta": {},
  "status": "completed"
}
```

## 응답 및 세션 ID로 대화 이어가기[​](#response-id "Direct link to Continue conversations with response and session IDs")

대화 연속성을 이용하면 여러 API 호출에 걸쳐 맥락을 유지할 수 있어, 플로우와의 멀티턴 대화가 가능해집니다. 이는 사용자가 지속적인 대화를 나눌 수 있는 채팅 애플리케이션을 구축할 때 필수적입니다.

요청을 보내면 API는 `id` 필드를 포함한 응답을 반환합니다. 다음 요청에서 이 `id`를 `previous_response_id`로 사용하여 이전에 중단한 지점부터 대화를 이어갈 수 있습니다.

첫 번째 메시지:

- Python
- JavaScript
- curl

```python
import os

import requests

base = os.environ.get("LANGFLOW_URL") or os.environ.get("LANGFLOW_SERVER_URL", "")
flow_id = os.environ.get("FLOW_ID", "")
api_key = os.environ.get("LANGFLOW_API_KEY", "")

url = f"{base}/api/v1/responses"

headers = {
    "x-api-key": api_key,
    "Content-Type": "application/json",
}

payload = {
    "model": flow_id,
    "input": "Hello, my name is Alice",
    "stream": False,
}

response = requests.post(url, headers=headers, json=payload, timeout=120)
response.raise_for_status()

print(response.text)
```

**결과(Result)**

```json
{
  "id": "c45f4ac8-772b-4675-8551-c560b1afd590",
  "object": "response",
  "created_at": 1756839042,
  "status": "completed",
  "model": "ced2ec91-f325-4bf0-8754-f3198c2b1563",
  "output": [
    {
      "type": "message",
      "id": "msg_c45f4ac8-772b-4675-8551-c560b1afd590",
      "status": "completed",
      "role": "assistant",
      "content": [
        {
          "type": "output_text",
          "text": "Hello, Alice! How can I assist you today?",
          "annotations": []
        }
      ]
    }
  ],
  "previous_response_id": null
}
```

후속 메시지:

- Python
- JavaScript
- curl

```python
# Continuation requests use the same endpoint; add `previous_response_id` from a prior
# response's `id` field. The bootstrap flow is empty; use a Playground flow with ChatInput +
# ChatOutput for a full run. Same first message as continue-conversations-with-response-and-session-ids.py.

import os

import requests

base = os.environ.get("LANGFLOW_URL") or os.environ.get("LANGFLOW_SERVER_URL", "")
flow_id = os.environ.get("FLOW_ID", "")
api_key = os.environ.get("LANGFLOW_API_KEY", "")

url = f"{base}/api/v1/responses"

headers = {
    "x-api-key": api_key,
    "Content-Type": "application/json",
}

payload = {
    "model": flow_id,
    "input": "Hello, my name is Alice",
    "stream": False,
}

response = requests.post(url, headers=headers, json=payload, timeout=120)
response.raise_for_status()

print(response.text)
```

**결과(Result)**

```json
{
  "id": "c45f4ac8-772b-4675-8551-c560b1afd590",
  "object": "response",
  "created_at": 1756839043,
  "status": "completed",
  "model": "ced2ec91-f325-4bf0-8754-f3198c2b1563",
  "output": [
    {
      "type": "message",
      "id": "msg_c45f4ac8-772b-4675-8551-c560b1afd590",
      "status": "completed",
      "role": "assistant",
      "content": [
        {
          "type": "output_text",
          "text": "Your name is Alice. How can I help you today?",
          "annotations": []
        }
      ]
    }
  ],
  "previous_response_id": "c45f4ac8-772b-4675-8551-c560b1afd590"
}
```

선택적으로, `previous_response_id`에 자체 세션 ID 값을 사용할 수도 있습니다.

- Python
- JavaScript
- curl

```python
# Same pattern as continue-conversations-with-response-and-session-ids-2.py; you can pass
# `previous_response_id` from the prior turn (or a session id your app stores).

import os

import requests

base = os.environ.get("LANGFLOW_URL") or os.environ.get("LANGFLOW_SERVER_URL", "")
flow_id = os.environ.get("FLOW_ID", "")
api_key = os.environ.get("LANGFLOW_API_KEY", "")

url = f"{base}/api/v1/responses"

headers = {
    "x-api-key": api_key,
    "Content-Type": "application/json",
}

payload = {
    "model": flow_id,
    "input": "Hello, my name is Alice",
    "stream": False,
}

response = requests.post(url, headers=headers, json=payload, timeout=120)
response.raise_for_status()

print(response.text)
```

**결과(Result)**

이 예시는 다른 `previous_response_id` 예시와 동일한 플로우를 사용하지만, 지정된 세션에서 LLM은 아직 Alice를 소개받지 않았습니다.

```json
{
  "id": "session-alice-1756839048",
  "object": "response",
  "created_at": 1756839048,
  "status": "completed",
  "model": "ced2ec91-f325-4bf0-8754-f3198c2b1563",
  "output": [
    {
      "type": "message",
      "id": "msg_session-alice-1756839048",
      "status": "completed",
      "role": "assistant",
      "content": [
        {
          "type": "output_text",
          "text": "I don't have access to your name unless you tell me. If you'd like, you can share your name, and I'll remember it for this conversation!",
          "annotations": []
        }
      ]
    }
  ],
  "previous_response_id": "session-alice-1756839048"
}
```

## 도구 호출 결과 조회하기[​](#tool-call-results "Direct link to Retrieve tool call results")

`/api/v1/responses` 엔드포인트에 요청을 보내 도구 또는 함수 호출을 포함하는 플로우를 실행할 때, 요청 페이로드에 `"include": ["tool_call.results"]`를 추가하면 원본 도구 실행 세부 정보를 조회할 수 있습니다.

`include` 파라미터가 없으면, 도구 호출은 기본적인 함수 호출 정보만 반환하고 원본 도구 결과는 반환하지 않습니다.
예를 들면 다음과 같습니다.

```json
{
  "id": "fc_1",
  "type": "function_call",
  "status": "completed",
  "name": "evaluate_expression",
  "arguments": "{\"expression\": \"15*23\"}"
},
```

각 도구 실행의 원본 `results`를 얻으려면, 요청 페이로드에 `include: ["tool_call.results"]`를 추가하십시오.

- Python
- JavaScript
- curl

```python
import os

import requests

base = os.environ.get("LANGFLOW_URL") or os.environ.get("LANGFLOW_SERVER_URL", "")
flow_id = os.environ.get("FLOW_ID", "")
api_key = os.environ.get("LANGFLOW_API_KEY", "")

url = f"{base}/api/v1/responses"

headers = {
    "Content-Type": "application/json",
    "x-api-key": api_key,
}

payload = {
    "model": flow_id,
    "input": "Calculate 23 * 15 and show me the result",
    "stream": False,
    "include": ["tool_call.results"],
}

response = requests.post(url, headers=headers, json=payload, timeout=120)
response.raise_for_status()

print(response.text)
```

이제 응답에는 도구 호출의 결과가 포함됩니다.
예를 들면 다음과 같습니다.

```json
{
  "id": "evaluate_expression_1",
  "type": "tool_call",
  "tool_name": "evaluate_expression",
  "queries": ["15*23"],
  "results": {"result": "345"}
}
```

**결과(Result)**

```json
{
  "id": "a6e5511e-71f8-457a-88d2-7d8c6ea34e36",
  "object": "response",
  "created_at": 1756835379,
  "status": "completed",
  "error": null,
  "incomplete_details": null,
  "instructions": null,
  "max_output_tokens": null,
  "model": "ced2ec91-f325-4bf0-8754-f3198c2b1563",
  "output": [
    {
      "id": "evaluate_expression_1",
      "queries": [
        "15*23"
      ],
      "status": "completed",
      "tool_name": "evaluate_expression",
      "type": "tool_call",
      "results": {
        "result": "345"
      }
    },
    {
      "type": "message",
      "id": "msg_a6e5511e-71f8-457a-88d2-7d8c6ea34e36",
      "status": "completed",
      "role": "assistant",
      "content": [
        {
          "type": "output_text",
          "text": "The result of 23 * 15 is 345.",
          "annotations": []
        }
      ]
    }
  ],
  "parallel_tool_calls": true,
  "previous_response_id": null,
  "reasoning": {
    "effort": null,
    "summary": null
  },
  "store": true,
  "temperature": 1.0,
  "text": {
    "format": {
      "type": "text"
    }
  },
  "tool_choice": "auto",
  "tools": [],
  "top_p": 1.0,
  "truncation": "disabled",
  "usage": null,
  "user": null,
  "metadata": {}
}
```

`X-LANGFLOW-GLOBAL-VAR-{VARIABLE_NAME}`로 전달된 변수는 데이터베이스에 존재하는지 여부와 관계없이 항상 플로우에서 사용할 수 있습니다.

플로우 컴포넌트가 헤더나 Langflow 데이터베이스에서 제공되지 않은 변수를 참조하는 경우, 플로우는 기본적으로 실패합니다.

이를 방지하려면 `FALLBACK_TO_ENV_VARS` 환경 변수를 `true`로 설정할 수 있으며, 이렇게 하면 다른 방법으로 지정되지 않은 경우 플로우가 `.env` 파일의 값을 사용할 수 있습니다.

위 예시에서, `OPENAI_API_KEY`는 헤더에 제공되지 않으면 데이터베이스 변수로 대체됩니다. `USER_ID`와 `ENVIRONMENT`는 `FALLBACK_TO_ENV_VARS`가 활성화된 경우 환경 변수로 대체됩니다.
그렇지 않으면 플로우가 실패합니다.

## 토큰 사용량 추적[​](#token-usage-tracking "Direct link to Token usage tracking")

플로우가 토큰 사용 정보를 제공하는 언어 모델 컴포넌트를 사용하는 경우, OpenAI Responses API 엔드포인트는 토큰 사용량을 추적합니다. 응답의 `usage` 필드에는 요청과 응답에 사용된 토큰 수에 대한 통계가 포함됩니다.

`usage` 필드가 사용 가능한 경우, 플로우 실행 결과에서 토큰 사용량이 자동으로 추출됩니다.
`usage` 필드는 `prompt_tokens`, `completion_tokens`, `total_tokens` 필드를 사용하는 OpenAI 형식을 따릅니다.
플로우 컴포넌트에서 토큰 사용 정보를 사용할 수 없는 경우 `usage` 필드는 `null`입니다.

`usage` 필드는 토큰 개수와 함께든 `null`이든 응답에 항상 존재합니다. 아래 예시에 표시된 조건부 확인은 사용량을 사용할 수 없는 경우를 처리하기 위한 선택적 방어적 프로그래밍입니다.

- Python
- JavaScript
- curl

```python
import os

import requests

url = f"{os.getenv('LANGFLOW_SERVER_URL', '')}/api/v1/responses"

headers = {
    "x-api-key": f"{os.getenv('LANGFLOW_API_KEY', '')}",
    "Content-Type": "application/json",
}

payload = {"model": "FLOW_ID", "input": "Explain quantum computing in simple terms", "stream": False}

response = requests.request("POST", url, headers=headers, json=payload)
response.raise_for_status()

print(response.text)
```

**토큰 사용량을 포함한 응답**

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "object": "response",
  "created_at": 1756837941,
  "status": "completed",
  "model": "ced2ec91-f325-4bf0-8754-f3198c2b1563",
  "output": [
    {
      "type": "message",
      "id": "msg_a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "status": "completed",
      "role": "assistant",
      "content": [
        {
          "type": "output_text",
          "text": "Quantum computing is a type of computing that uses quantum mechanical phenomena...",
          "annotations": []
        }
      ]
    }
  ],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 145,
    "total_tokens": 157
  },
  "previous_response_id": null
}
```
