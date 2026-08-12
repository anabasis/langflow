# 모니터 엔드포인트

`/monitor` 엔드포인트는 **플레이그라운드**에서 플로우를 실행하고, 채팅 기록을 저장하고, 플로우 로그를 생성하는 것과 관련된 내부 Langflow 기능을 위한 것입니다.

이 정보는 주로 커스텀 컴포넌트를 구축하거나 이러한 엔드포인트를 호출하거나 이해해야 하는 방식으로 Langflow 코드베이스에 기여하는 사람들을 위한 것입니다.

일반적인 Langflow 애플리케이션 개발의 경우 더 적합한 모니터링, 디버깅, 메모리 관리 옵션이 있습니다:
- [로그](../develop/logging.md): Langflow 로그 저장 위치, 사용자 정의 옵션
- [플레이그라운드에서 플로우 테스트](../flows/test-flows.md): 플로우 실행 및 메시지 기록 검사
- [메모리 관리 옵션](https://docs.langflow.org/memory): Langflow 저장소 위치 및 옵션

---

## Vertex 빌드

Vertex 빌드 엔드포인트(`/monitor/builds`)는 **플레이그라운드** 기능을 위한 것입니다.

### Vertex 빌드 가져오기

특정 플로우의 Vertex 빌드를 검색합니다:

```python
import os
import requests

url = f"{os.getenv('LANGFLOW_URL', '')}/api/v1/monitor/builds?flow_id={os.getenv('FLOW_ID', '')}"

headers = {
    "accept": "application/json",
    "x-api-key": f"{os.getenv('LANGFLOW_API_KEY', '')}",
}

response = requests.request("GET", url, headers=headers)
response.raise_for_status()
print(response.text)
```

**결과:**

```json
{
  "vertex_builds": {
    "ChatInput-NCmix": [
      {
        "data": {
          "results": {...},
          "timedelta": 0.015060124918818474,
          "duration": "15 ms"
        },
        "valid": true,
        "build_id": "40aa200e-74db-4651-b698-f80301d2b26b",
        "id": "ChatInput-NCmix",
        "flow_id": "01ce083d-748b-4b8d-97b6-33adbb6a528a"
      }
    ]
  }
}
```

### Vertex 빌드 삭제

특정 플로우의 Vertex 빌드를 삭제합니다:

```python
url = f"{os.getenv('LANGFLOW_URL', '')}/api/v1/monitor/builds?flow_id={os.getenv('FLOW_ID', '')}"
response = requests.request("DELETE", url, headers=headers)
```

**결과:** `204 No Content`

---

## 메시지 엔드포인트

`/monitor/messages` 엔드포인트는 `langflow.db`의 메시지 테이블에서 레코드를 저장, 검색, 편집, 삭제합니다.

### 메시지 가져오기

모든 메시지 목록을 검색합니다:

```python
url = f"{os.getenv('LANGFLOW_URL', '')}/api/v1/monitor/messages"
response = requests.request("GET", url, headers=headers)
```

필터링을 위해 `flow_id`, `session_id`, `sender`, `sender_name` 쿼리 파라미터를 사용합니다. 정렬에는 `order_by`를 사용합니다:

```python
url = f"...?flow_id={flow_id}&session_id=01ce083d&sender=Machine&sender_name=AI&order_by=timestamp"
```

**결과:**

```json
[
  {
    "id": "1c1d6134-9b8b-4079-931c-84dcaddf19ba",
    "flow_id": "01ce083d-748b-4b8d-97b6-33adbb6a528a",
    "timestamp": "2024-12-23 19:20:11 UTC",
    "sender": "Machine",
    "sender_name": "AI",
    "session_id": "01ce083d-748b-4b8d-97b6-33adbb6a528a",
    "text": "안녕하세요! 오늘 어떤 프로젝트를 시작해 볼까요?",
    "category": "message"
  }
]
```

### 메시지 삭제

ID로 특정 메시지를 삭제합니다:

```python
params = [("message_ids", str(message_id))]
response = requests.delete(f"{base}/api/v1/monitor/messages", headers=headers, params=params)
```

**결과:** `204 No Content`

### 메시지 업데이트

ID로 특정 메시지를 업데이트합니다:

```python
payload = {"text": "업데이트된 메시지 내용"}
response = requests.put(
    f"{base}/api/v1/monitor/messages/{message_id}",
    headers=headers,
    json=payload,
)
```

### 세션 ID 업데이트

메시지의 세션 ID를 업데이트합니다:

```python
response = requests.patch(
    f"{base}/api/v1/monitor/messages/session/{old_session_id}",
    headers=headers,
    params={"new_session_id": new_session_id},
)
```

### 세션별 메시지 삭제

특정 세션의 모든 메시지를 삭제합니다:

```python
url = f"{os.getenv('LANGFLOW_URL', '')}/api/v1/monitor/messages/session/my_session_id"
response = requests.request("DELETE", url, headers=headers)
```

**결과:** `204 No Content`

---

## 트레이스 가져오기

특정 플로우의 트레이스 메타데이터와 스팬 트리를 검색합니다:

```python
response = requests.get(
    f"{base_url}/api/v1/monitor/traces",
    params={"flow_id": flow_id, "page": 1, "size": 50},
    headers={"x-api-key": api_key},
)
```

**결과:**

```json
{
  "traces": [
    {
      "id": "426656db-fc3c-4a3a-acf8-c60acf099543",
      "name": "Simple Agent - 9e774f60",
      "status": "ok",
      "startTime": "2026-03-03T19:13:30.692628Z",
      "totalLatencyMs": 18693,
      "totalTokens": 2050,
      "flowId": "9e774f60-857b-44b4-bbcd-87bd23848ee8"
    }
  ],
  "total": 1
}
```

---

## 트랜잭션 가져오기

특정 플로우의 모든 트랜잭션(컴포넌트 간 상호작용)을 검색합니다:

```python
url = f"{os.getenv('LANGFLOW_URL', '')}/api/v1/monitor/transactions?flow_id={os.getenv('FLOW_ID', '')}&page=1&size=50"
response = requests.request("GET", url, headers=headers)
```

---

## 참고 항목

- [세션 ID](https://docs.langflow.org/session-id)
- [로그](../develop/logging.md)

---

*원문: https://docs.langflow.org/next/api-monitor*
