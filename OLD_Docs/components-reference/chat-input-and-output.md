# Chat Input and Output

> **주의**: 플레이그라운드에서 플로우와 채팅하려면 **Chat Input and Output** 컴포넌트가 필요합니다.

**Chat Input and Output** 컴포넌트는 Langflow에서 대화형 상호작용을 처리하도록 설계되었습니다.

---

## Chat Input

**Chat Input** 컴포넌트는 채팅 메시지나 파일과 같은 텍스트 및 파일 입력을 허용합니다. 이 데이터는 제공된 입력과 발신자, 세션 ID, 타임스탬프, 파일 첨부 파일과 같은 관련 채팅 메타데이터를 포함하는 [`Message` 데이터](../develop/data-types.md)로 다른 컴포넌트에 전달됩니다.

**Chat Input** 컴포넌트가 다른 컴포넌트에 전달되는 `Message` 객체를 구성하기 때문에 초기 입력은 완전한 `Message` 객체로 제공되어서는 안 됩니다.

### Chat Input 매개변수

| 이름 | 표시 이름 | 설명 |
|------|----------|------|
| `input_value` | Input Text | 입력으로 전달할 메시지 텍스트 문자열 |
| `sender` | Sender Type | 발신자를 `User` 또는 `Language Model`로 식별 |
| `sender_name` | Sender Name | 발신자 이름. 미지정 시 기본값은 `User` 또는 `Language Model` |
| `session_id` | Session ID | 채팅 세션의 고유 식별자. 비어 있으면 현재 세션 ID가 사용됨 |
| `files` | Files | 메시지와 함께 보낼 파일 |
| `should_store_message` | Store Messages | 채팅 기록에 메시지를 저장할지 여부 |

---

## Chat Output

**Chat Output** 컴포넌트는 다른 컴포넌트의 `Message`, `JSON` 또는 `Table` 데이터를 수집하고, 필요한 경우 `Message` 데이터로 변환한 다음 최종 출력을 채팅 메시지로 방출합니다.

**플레이그라운드**에서 채팅 출력은 텍스트 응답, 발신자 이름, 파일 첨부 파일과 같이 채팅 인터페이스와 관련된 `Message` 객체의 일부로 제한됩니다.

Langflow API를 사용할 때 API 응답에는 플로우 실행의 다른 응답 데이터와 함께 **Chat Output** `Message` 객체가 포함됩니다.

### Chat Output 매개변수

| 이름 | 표시 이름 | 설명 |
|------|----------|------|
| `input_value` | Inputs | 출력으로 전달할 메시지 텍스트 문자열 |
| `should_store_message` | Store Messages | 채팅 기록에 메시지를 저장할지 여부 |
| `sender` | Sender Type | 발신자를 `User` 또는 `Language Model`로 식별 |
| `sender_name` | Sender Name | 발신자 이름 |
| `session_id` | Session ID | 채팅 세션의 고유 식별자 |
| `data_template` | Data Template | `JSON` 입력을 `text`로 변환하는 템플릿 |
| `clean_data` | Basic Clean Data | 활성화된 경우 `Table` 입력을 텍스트로 변환할 때 정리 |

---

## 플로우에서 Chat Input 및 Output 컴포넌트 사용

**Chat Input** 및 **Chat Output** 컴포넌트를 사용하려면 [`Message` 데이터](../develop/data-types.md#message)를 허용하거나 방출하는 컴포넌트에 연결합니다.

### Langflow API로 채팅 입력 전송

Langflow API를 사용하여 **Chat Input** 컴포넌트에 입력을 보내 플로우를 실행할 수 있습니다:

```bash
curl --request POST \
  --url "http://$LANGFLOW_SERVER_ADDRESS/api/v1/run/$FLOW_ID" \
  --header "Content-Type: application/json" \
  --header "x-api-key: $LANGFLOW_API_KEY" \
  --data '{
  "input_value": "Mac M1에 Docker를 설치하는 권장 방법은 무엇인가요?",
  "output_type": "chat",
  "input_type": "chat"
}'
```

커스텀 세션 ID를 사용하려면 요청에 `session_id`를 포함합니다:

```bash
curl --request POST \
  --url "http://$LANGFLOW_SERVER_ADDRESS/api/v1/run/$FLOW_ID" \
  --header "Content-Type: application/json" \
  --header "x-api-key: $LANGFLOW_API_KEY" \
  --data '{
  "input_value": "Mac M1에 Docker를 설치하는 권장 방법은 무엇인가요?",
  "session_id": "$USER_ID",
  "output_type": "chat",
  "input_type": "chat"
}'
```

---

*원문: https://docs.langflow.org/next/chat-input-and-output*
