# 플로우 트리거 엔드포인트

`/run` 및 `/webhook` 엔드포인트를 사용하여 플로우를 실행합니다.

플로우를 생성, 읽기, 업데이트, 삭제하려면 [플로우 관리 엔드포인트](./api-flows.md)를 참조하세요.

---

## 플로우 실행

지정된 ID 또는 이름으로 플로우를 실행합니다. 플로우 ID는 **API access** 창의 코드 스니펫 또는 플로우 URL에서 찾을 수 있습니다.

> **팁**: Langflow는 모든 플로우에 대해 `/v1/run/$FLOW_ID` 엔드포인트의 Python, JavaScript, curl 코드 스니펫을 자동으로 생성합니다.

다음 예시는 **Basic Prompting** 템플릿 플로우를 실행합니다:

```python
import os
import requests

base = os.environ.get("LANGFLOW_URL") or os.environ.get("LANGFLOW_SERVER_URL", "")
flow_id = os.environ.get("FLOW_ID", "")
api_key = os.environ.get("LANGFLOW_API_KEY", "")

url = f"{base}/api/v1/run/{flow_id}"

headers = {
    "Content-Type": "application/json",
    "x-api-key": api_key,
}

payload = {
    "input_value": "흥미로운 것에 대해 말해줘!",
    "session_id": "chat-123",
    "input_type": "chat",
    "output_type": "chat",
    "output_component": "",
}

response = requests.post(url, headers=headers, json=payload, timeout=60)
response.raise_for_status()
print(response.text)
```

### 응답 형식

```json
{
  "session_id": "chat-123",
  "outputs": [{
    "inputs": {
      "input_value": "흥미로운 것에 대해 말해줘!"
    },
    "outputs": [{
      "results": {
        "message": {
          "text": "생물발광(bioluminescence)에 대해 들어보셨나요?...",
          "sender": "Machine",
          "sender_name": "AI",
          "session_id": "chat-123",
          "timestamp": "2025-03-03T17:17:37+00:00",
          "flow_id": "d2bbd92b-187e-4c84-b2d4-5df365704201"
        }
      }
    }]
  }]
}
```

---

## LLM 토큰 응답 스트리밍

`/v1/run/$FLOW_ID`에 `?stream=true` 쿼리 파라미터를 추가하여 LLM 토큰 응답을 스트리밍합니다:

```python
import os
import requests

url = f"{os.getenv('LANGFLOW_SERVER_URL', '')}/api/v1/run/{os.getenv('FLOW_ID', '')}?stream=true"

headers = {
    "accept": "application/json",
    "Content-Type": "application/json",
    "x-api-key": f"{os.getenv('LANGFLOW_API_KEY', '')}",
}

payload = {"message": "흥미로운 것에 대해 말해줘!", "session_id": "chat-123"}

response = requests.request("POST", url, headers=headers, json=payload)
response.raise_for_status()
print(response.text)
```

응답은 `token` 이벤트로 스트리밍되고 연결을 닫는 최종 `end` 이벤트로 끝납니다.

---

## 실행 엔드포인트 헤더

| 헤더 | 정보 | 예시 |
|------|------|------|
| `Content-Type` | 필수. JSON 형식 지정 | `"application/json"` |
| `accept` | 선택. 응답 형식 지정 | `"application/json"` |
| `x-api-key` | 필수. 인증을 위한 Langflow API 키 | `"sk-..."` |
| `X-LANGFLOW-GLOBAL-VAR-*` | 선택. 플로우에 전역 변수 전달 | `"X-LANGFLOW-GLOBAL-VAR-API_KEY: sk-..."` |

---

## 실행 엔드포인트 파라미터

| 파라미터 | 타입 | 정보 |
|----------|------|------|
| `flow_id` | UUID/string | 필수. URL의 일부: `/run/$FLOW_ID` |
| `stream` | Boolean | 선택. 쿼리 파라미터: `/run/$FLOW_ID?stream=true` |
| `input_value` | string | 선택. 주요 입력 텍스트/프롬프트. 기본값: `null` |
| `input_type` | string | 선택. 입력 유형 (`"chat"` 또는 `"text"`). 기본값: `"chat"` |
| `output_type` | string | 선택. 출력 유형 (`"chat"`, `"any"`, `"debug"`). 기본값: `"chat"` |
| `output_component` | string | 선택. 출력 대상 컴포넌트. 기본값: `""` |
| `tweaks` | object | 선택. 컴포넌트 조정. 기본값: `null` |
| `session_id` | string | 선택. 대화 컨텍스트 ID. 기본값: `null` |

---

## 헤더에 전역 변수 전달

`X-LANGFLOW-GLOBAL-VAR-{VARIABLE_NAME}` 형식의 HTTP 헤더를 사용하여 전역 변수를 플로우에 전달할 수 있습니다.

- 헤더에 전달된 변수는 OS 환경 변수보다 우선합니다
- 변수는 자동으로 대문자로 변환됩니다
- 변수는 이 특정 요청 실행 동안에만 사용 가능하며 유지되지 않습니다

```python
headers = {
    "Content-Type": "application/json",
    "x-api-key": api_key,
    "X-LANGFLOW-GLOBAL-VAR-USER_ID": "user123",
    "X-LANGFLOW-GLOBAL-VAR-ENVIRONMENT": "production",
}
```

---

## 웹훅 플로우 실행

`/webhook` 엔드포인트를 사용하여 HTTP `POST` 요청으로 플로우를 시작합니다.

```python
import os
import requests

base = os.environ.get("LANGFLOW_SERVER_URL", "")
flow_id = os.environ.get("FLOW_ID", "")
api_key = os.environ.get("LANGFLOW_API_KEY", "")

headers = {
    "Content-Type": "application/json",
    "x-api-key": api_key,
}

payload = {"data": "example-data"}

response = requests.post(
    f"{base}/api/v1/webhook/{flow_id}",
    headers=headers,
    json=payload,
    timeout=60,
)
response.raise_for_status()
print(response.text)
```

**응답:**

```json
{
  "message": "작업이 백그라운드에서 시작되었습니다",
  "status": "in progress"
}
```

---

## 더 이상 사용되지 않는 플로우 트리거 엔드포인트

다음 엔드포인트는 더 이상 사용되지 않으며 `/run` 엔드포인트로 대체되었습니다:
- `/process`
- `/predict`

---

*원문: https://docs.langflow.org/next/api-flows-run*
