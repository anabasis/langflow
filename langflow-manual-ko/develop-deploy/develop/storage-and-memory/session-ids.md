# 컴포넌트 간 통신 관리를 위한 세션 ID 사용

> 원문: https://docs.langflow.org/next/session-id

세션 ID는 클라이언트/서버 연결에 대한 고유 식별자입니다. 하나의 세션은 클라이언트가 서버에 연결되어 있는 기간과 같습니다.

Langflow **Playground**에서는 현재 세션이 패널 왼쪽에 나열됩니다.

Langflow는 세션 ID를 사용하여 플로우 내의 서로 다른 채팅 상호작용을 추적합니다. 이를 통해 하나의 플로우에 여러 채팅 세션이 존재할 수 있습니다. 메시지는 세션 ID를 참조 값으로 하여 데이터베이스에 저장됩니다.

세션별로 사용자를 구분하는 것은 클라이언트/서버 연결을 관리하는 데 도움이 될 뿐만 아니라, 하나의 플로우 내에서 별도의 대화 맥락을 유지하는 데에도 중요합니다. LLM은 쿼리에 대한 응답을 생성할 때 과거 상호작용에 의존하는데, 이러한 대화가 분리되어 있지 않으면 응답의 유용성이 떨어지거나 심지어 혼란스러워질 수 있습니다.

## 세션 ID 커스터마이징[​](#customize-session-id "Direct link to Customize session ID")

커스텀 세션 ID는 API 호출의 페이로드 일부로 설정하거나, 개별 컴포넌트의 고급 설정으로 설정할 수 있습니다. API 세션 ID 값이 우선합니다. 세션 ID가 지정되지 않으면 플로우 ID가 할당됩니다.

페이로드에 커스텀 세션 ID를 설정하면, 다운스트림의 모든 컴포넌트는 업스트림 컴포넌트의 세션 ID 값을 사용합니다.
`LANGFLOW_SERVER_ADDRESS`, `FLOW_ID`, `LANGFLOW_API_KEY`를 여러분의 Langflow 배포 값으로 바꾸세요.

```
curl --request POST \
  --url "http://LANGFLOW_SERVER_ADDRESS/api/v1/run/FLOW_ID" \
  --header "Content-Type: application/json" \
  --header "x-api-key: $LANGFLOW_API_KEY" \
  --data '{
  "input_value": "Hello",
  "output_type": "chat",
  "input_type": "chat",
  "session_id": "my_custom_session_value"
}'
```

`my_custom_session_value` 값은 이를 받아들이는 컴포넌트에서 사용되며, 이 플로우에서 저장된 메시지는 각각의 `session_id` 값과 함께 `langflow.db`에 저장됩니다.

## 세션 ID로 메모리에서 메시지 검색하기[​](#retrieval-of-messages-from-memory-by-session-id "Direct link to Retrieval of messages from memory by session ID")

로컬 Langflow 메모리에서 메시지를 검색하려면, 플로우에 [**Message History** 컴포넌트](https://docs.langflow.org/message-history)를 추가하세요.
이 컴포넌트는 `sessionID`를 필터 파라미터로 받아들이며, 업스트림의 세션 ID 값을 자동으로 사용하여 스토리지에서 세션 ID별로 메시지 기록을 검색합니다.

메시지는 Langflow API의 `GET /v1/monitor/messages`에서 `session_id`로 검색할 수 있습니다. 자세한 내용은 [Monitor 엔드포인트](https://docs.langflow.org/api-monitor)를 참고하세요.

세션 ID가 실제로 동작하는 예시는 [Langflow에서 세션 ID 사용하기](https://www.youtube.com/watch?v=nJiF_eF21MY)를 참고하세요.
