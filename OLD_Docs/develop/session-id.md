# 세션 ID를 사용하여 컴포넌트 간 통신 관리

세션 ID는 클라이언트/서버 연결을 위한 고유 식별자입니다. 단일 세션은 클라이언트가 서버에 연결된 기간과 같습니다.

Langflow **플레이그라운드**에서 현재 세션은 창의 왼쪽에 나열됩니다.

Langflow는 세션 ID를 사용하여 플로우 내의 다양한 채팅 상호작용을 추적합니다. 이를 통해 단일 플로우에 여러 채팅 세션이 존재할 수 있습니다. 메시지는 세션 ID를 참조로 데이터베이스에 저장됩니다.

---

## 세션 ID 사용자 정의

커스텀 세션 ID는 API 호출의 페이로드의 일부로 설정하거나 개별 컴포넌트의 고급 설정으로 설정할 수 있습니다. API 세션 ID 값이 우선됩니다. 세션 ID가 지정되지 않으면 플로우 ID가 할당됩니다.

```bash
curl --request POST \
  --url "http://LANGFLOW_SERVER_ADDRESS/api/v1/run/FLOW_ID" \
  --header "Content-Type: application/json" \
  --header "x-api-key: $LANGFLOW_API_KEY" \
  --data '{
  "input_value": "안녕하세요",
  "output_type": "chat",
  "input_type": "chat",
  "session_id": "my_custom_session_value"
}'
```

`my_custom_session_value` 값은 이를 허용하는 컴포넌트에서 사용되며, 이 플로우에서 저장된 메시지는 각 `session_id` 값과 함께 `langflow.db`에 저장됩니다.

---

## 세션 ID로 메모리에서 메시지 검색

로컬 Langflow 메모리에서 메시지를 검색하려면 플로우에 **Message History** 컴포넌트를 추가합니다. 이 컴포넌트는 `sessionID`를 필터 파라미터로 허용하고, 자동으로 업스트림의 세션 ID 값을 사용하여 저장소에서 세션 ID별 메시지 기록을 검색합니다.

메시지는 Langflow API의 `GET /v1/monitor/messages`에서 `session_id`로 검색할 수 있습니다. 자세한 내용은 [모니터 엔드포인트](../api-reference/api-monitor.md)를 참조하세요.

---

## 참고 항목

- [메모리 관리](./storage-and-memory.md)
- [모니터 엔드포인트](../api-reference/api-monitor.md)

---

*원문: https://docs.langflow.org/next/session-id*
