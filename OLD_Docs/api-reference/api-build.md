# 빌드 엔드포인트

> **참고**: `/build` 엔드포인트는 Langflow의 프론트엔드 비주얼 에디터 코드에서 사용됩니다. 앱에서 플로우를 실행하려면 [플로우 트리거 엔드포인트](./api-flows-run.md)를 사용하세요.

`/build` 엔드포인트는 Langflow 비주얼 에디터에서 플로우를 구축하는 Langflow의 프론트엔드 코드를 지원합니다. Langflow 코드베이스에 기여할 때 이 엔드포인트를 이해해야 할 수 있습니다.

---

## 플로우 빌드 및 이벤트 스트리밍

이 엔드포인트는 플로우를 빌드하고 실행하며, 실행 이벤트를 스트리밍하는 데 사용할 수 있는 작업 ID를 반환합니다.

1. `/build/$FLOW_ID/flow` 엔드포인트로 POST 요청을 보냅니다:

```python
import os
import requests

url = f"{os.getenv('LANGFLOW_URL', '')}/api/v1/build/{os.getenv('FLOW_ID', '')}/flow"

headers = {
    "accept": "application/json",
    "Content-Type": "application/json",
    "x-api-key": f"{os.getenv('LANGFLOW_API_KEY', '')}",
}

payload = {"inputs": {"input_value": "이야기를 들려줘"}}

response = requests.request("POST", url, headers=headers, json=payload)
response.raise_for_status()
print(response.text)
```

**결과:**

```json
{
  "job_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

2. 빌드 엔드포인트에서 작업 ID를 받은 후 `/build/$JOB_ID/events` 엔드포인트를 사용하여 실행 결과를 스트리밍합니다:

```python
url = f"{os.getenv('LANGFLOW_URL', '')}/api/v1/build/{os.getenv('JOB_ID', '')}/events"
response = requests.request("GET", url, headers=headers)
```

**결과:**

```
{"event": "vertices_sorted", "data": {"ids": ["ChatInput-XtBLx"], "to_run": [...]}}

{"event": "add_message", "data": {"sender": "User", "text": "이야기를 들려줘", ...}}

{"event": "end", "data": {}}
```

`/build/$FLOW_ID/events` 엔드포인트에는 기본값이 `true`인 `stream` 쿼리 파라미터가 있습니다. 스트리밍을 비활성화하고 모든 이벤트를 한 번에 가져오려면 `?event_delivery=polling`을 설정합니다.

---

## 빌드 헤더

| 헤더 | 정보 | 예시 |
|------|------|------|
| `Content-Type` | 필수. JSON 형식 지정 | `"application/json"` |
| `accept` | 선택. 응답 형식 지정 | `"application/json"` |
| `x-api-key` | 선택. 인증이 활성화된 경우 필수 | `"sk-..."` |

---

## 빌드 파라미터

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `inputs` | object | 선택. 플로우 컴포넌트의 입력 값 |
| `data` | object | 선택. 저장된 구성을 재정의할 플로우 데이터 |
| `files` | array[string] | 선택. 사용할 파일 경로 목록 |
| `start_component_id` | string | 선택. 실행을 시작할 컴포넌트 ID |
| `stop_component_id` | string | 선택. 실행을 중지할 컴포넌트 ID |
| `log_builds` | Boolean | 빌드 로그 기록 여부. 기본값: `true` |

### 시작 및 중지 지점 설정

`stop_component_id`를 설정하면 비주얼 에디터에서 해당 컴포넌트의 **Run component**를 클릭하는 것과 동일하게 동작합니다.

```python
payload = {"stop_component_id": "OpenAIModel-Uksag"}
```

### 플로우 파라미터 재정의

데이터를 직접 전달하여 Langflow 데이터베이스에 저장된 값을 사용하지 않고 플로우를 실행할 수 있습니다:

```python
payload = {
    "data": {"nodes": [], "edges": []},
    "inputs": {"input_value": "커스텀 입력", "session": "session_id"},
}
```

---

## 참고 항목

- [Vertex 빌드 가져오기](./api-monitor.md#vertex-빌드)
- [플로우 트리거 엔드포인트](./api-flows-run.md)

---

*원문: https://docs.langflow.org/next/api-build*
