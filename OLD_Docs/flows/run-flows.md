# Langflow API로 플로우 트리거

플로우를 빌드한 후 모바일 앱이나 웹사이트의 챗봇과 같은 애플리케이션 내에서 실행하고 싶을 것입니다.

Langflow는 외부 애플리케이션에서 플로우를 실행하는 여러 가지 방법을 제공합니다:

- [Langflow API로 플로우 트리거](#langflow-api-사용)
- [웹사이트에 임베디드 채팅 위젯 추가](#웹사이트에-플로우-임베드)
- [Langflow MCP 서버를 통해 플로우 서빙](#langflow-mcp-서버를-통해-플로우-서빙)
- [OpenAI Responses 호환 엔드포인트로 플로우 실행](#openai-responses-api)

---

## Langflow API 사용

Langflow API는 플로우와 Langflow 서버에 프로그래밍 방식으로 접근하는 기본 방법입니다.

### API 코드 스니펫 생성

Langflow는 스크립트에 Langflow API 요청을 임베드하는 데 도움이 되는 Python, JavaScript, curl 코드 스니펫을 자동으로 생성합니다.

1. Langflow에서 애플리케이션에 임베드할 플로우를 엽니다.
2. **Share**를 클릭하고 **API access**를 선택합니다.
3. (선택 사항) [**Input Schema**](#input-schema-tweaks)를 클릭하여 플로우 자체를 변경하지 않고 코드 스니펫의 컴포넌트 파라미터를 수정합니다.
4. 사용할 언어의 스니펫을 복사합니다.
5. 스니펫을 그대로 실행하거나 더 큰 스크립트의 컨텍스트에서 사용합니다.

### Langflow API 인증

Langflow 버전 1.5 이상에서는 대부분의 API 엔드포인트에 Langflow API 키를 사용한 인증이 필요합니다.

**API access** 패인에서 생성된 코드 스니펫에는 로컬 터미널 세션에서 설정된 `LANGFLOW_API_KEY` 환경 변수를 확인하는 스크립트가 포함됩니다.

이 스크립트가 작동하려면 코드 스니펫을 실행하려는 터미널 세션에서 `LANGFLOW_API_KEY` 변수를 설정해야 합니다:

```bash
export LANGFLOW_API_KEY="sk..."
```

### Input Schema (tweaks)

Tweaks는 플로우 자체를 영구적으로 수정하지 않고 런타임에 컴포넌트 파라미터를 수정하는 일회성 재정의입니다.

> **팁**: tweaks를 사용하면 플로우를 더 동적이고 재사용 가능하게 만들 수 있습니다. 하나의 플로우를 만들고 각 애플리케이션의 Langflow API 요청에서 애플리케이션별 tweaks를 전달하여 여러 애플리케이션에 사용할 수 있습니다.

**API access** 패인에서 **Input Schema**를 클릭하여 플로우 코드 스니펫의 요청 페이로드에 `tweaks`를 추가합니다.

예를 들어 플로우의 **Chat Input** 컴포넌트에서 **Store Messages** 설정을 비활성화하는 tweak이 포함된 curl 명령:

```bash
curl --request POST \
  --url "http://LANGFLOW_SERVER_ADDRESS/api/v1/run/FLOW_ID" \
  --header "Content-Type: application/json" \
  --header "x-api-key: LANGFLOW_API_KEY" \
  --data '{
  "input_value": "Text to input to the flow",
  "output_type": "chat",
  "input_type": "chat",
  "tweaks": {
    "ChatInput-4WKag": {
      "should_store_message": false
    }
  }
}'
```

### 플로우 ID 별칭 사용

실제 플로우 ID 대신 별칭을 사용하려면 플로우의 `/v1/run/$FLOW_ID` 엔드포인트를 이름 바꾸기할 수 있습니다:

1. Langflow에서 플로우를 열고 **Share**, **API access**를 선택합니다.
2. **Input Schema**를 클릭합니다.
3. **Endpoint Name** 필드에 플로우 ID의 별칭을 입력합니다 (예: `flow-customer-database-agent`). 문자, 숫자, 하이픈, 밑줄만 사용 가능합니다.
4. **Input Schema** 패인을 닫아 변경사항을 저장합니다.

자동 생성된 코드 스니펫은 이제 원래 플로우 ID 대신 새 엔드포인트 이름을 사용합니다.

---

## 웹사이트에 플로우 임베드

각 플로우에 대해 Langflow는 웹사이트의 HTML `<body>`에 삽입하여 임베디드 채팅 위젯을 통해 플로우와 상호작용할 수 있는 코드 스니펫을 제공합니다.

> **참고**: 채팅 위젯은 **Chat Input** 및 **Chat Output** 컴포넌트가 있는 플로우만 지원합니다.

### langflow-chat 스니펫 가져오기

1. Langflow에서 임베드할 플로우를 엽니다.
2. **Share**, **Embed into site**를 클릭합니다.
3. 코드 스니펫을 복사하여 웹사이트 HTML의 `<body>`에 사용합니다.
4. 위젯이 플로우를 실행할 권한을 갖도록 `api_key` prop을 추가합니다.

**HTML 예제:**

```html
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/gh/langflow-ai/langflow-embedded-chat@main/dist/build/static/js/bundle.min.js"></script>
  </head>
  <body>
    <langflow-chat
      host_url="https://your-langflow-server.ngrok-free.app"
      flow_id="your-flow-id"
      api_key="$LANGFLOW_API_KEY"
    ></langflow-chat>
  </body>
</html>
```

### React, Angular, HTML에서 채팅 위젯 임베드

**React 예제:**

```tsx
export default function ChatWidget({ className }) {
  return (
    <div className={className}>
      <langflow-chat
        host_url="https://your-langflow-server.ngrok-free.app"
        flow_id="your-flow-id"
        api_key="$LANGFLOW_API_KEY"
      ></langflow-chat>
    </div>
  );
}
```

### langflow-chat 웹 컴포넌트 구성

`langflow-chat` 웹 컴포넌트에는 다음 최소 입력(props)이 포함되어야 합니다:

- `host_url`: Langflow 서버 URL. HTTPS여야 하며 후행 슬래시(`/`) 없이 입력합니다.
- `flow_id`: 임베드할 플로우의 ID
- `api_key`: [Langflow API 키](./api-keys-and-authentication.md). 위젯이 플로우 실행 권한을 갖도록 권장합니다.

**스타일 props 예제:**

```html
<langflow-chat
  host_url="https://your-langflow-server.ngrok-free.app"
  flow_id="your-flow-id"
  api_key="$LANGFLOW_API_KEY"
  chat_window_style='{
    "backgroundColor": "#1a0d0d",
    "border": "4px solid #b30000",
    "borderRadius": "16px"
  }'
  window_title="커스텀 스타일 채팅"
  height="600"
  width="400"
></langflow-chat>
```

**Tweaks prop 예제:**

```html
<langflow-chat
  host_url="https://your-langflow-server.ngrok-free.app"
  flow_id="your-flow-id"
  api_key="$LANGFLOW_API_KEY"
  tweaks='{
    "model_name": "llama-3.1-8b-instant"
  }'
></langflow-chat>
```

---

## Langflow MCP 서버를 통해 플로우 서빙

각 [Langflow 프로젝트](./build-flows.md)에는 [MCP 클라이언트](https://modelcontextprotocol.io/clients)가 응답을 생성하는 데 사용할 수 있는 [도구](https://modelcontextprotocol.io/docs/concepts/tools)로 프로젝트의 플로우를 노출하는 MCP 서버가 있습니다.

자세한 내용은 [Langflow를 MCP 서버로 사용](../mcp/mcp-server.md) 및 [Langflow를 MCP 클라이언트로 사용](../mcp/mcp-client.md)을 참조하세요.

---

## OpenAI Responses API

Langflow에는 기존 OpenAI 클라이언트 라이브러리와 코드를 최소한의 수정으로 사용할 수 있는 `/api/v1/responses`에 OpenAI Responses API 호환 엔드포인트가 포함되어 있습니다.

---

## 참고 항목

- [플로우 가져오기 및 내보내기](./import-export-flows.md)
- [플레이그라운드에서 플로우 테스트](./test-flows.md)

---

*원문: https://docs.langflow.org/next/concepts-publish*
