# 애플리케이션을 에이전트에 연결하기

이 튜토리얼에서는 JavaScript 애플리케이션을 [Langflow 에이전트](../agents/use-agents.md)에 연결하는 방법을 보여줍니다.

에이전트를 사용하면 애플리케이션 코드를 변경하지 않고도 연결된 도구를 사용하여 더 상황에 맞고 시의적절한 데이터를 검색할 수 있습니다. 도구는 에이전트의 내부 LLM이 문제를 해결하고 질문에 답하기 위해 선택합니다.

---

## 사전 요구사항

- [Langflow 설치 및 시작](./installation.md)
- [Langflow API 키 만들기](../develop/api-keys-and-authentication.md)
- [Langflow JavaScript 클라이언트 설치](https://docs.langflow.org/typescript-client)
- [OpenAI API 키 만들기](https://platform.openai.com/api-keys)

---

## 에이전트 플로우 만들기

다음 단계는 **Simple Agent** 템플릿을 수정하여 **Read File** 및 **Web Search** 컴포넌트를 **Agent** 컴포넌트의 도구로 연결합니다.

1. Langflow에서 **New Flow**를 클릭하고 **Simple Agent** 템플릿을 선택합니다.

2. **URL** 및 **Calculator** 도구를 제거한 다음 **Read File** 및 **Web Search** 컴포넌트를 플로우에 추가합니다.

3. **Read File** 컴포넌트에서 **Agent** 컴포넌트가 사용할 파일을 업로드합니다.
   예: `customer-orders.csv` 파일을 업로드합니다.

4. **Read File** 및 **Web Search** 컴포넌트의 헤더 메뉴에서 **Tool Mode**를 활성화합니다.

5. **Read File** 및 **Web Search** 컴포넌트의 **Toolset** 포트를 **Agent** 컴포넌트의 **Tools** 포트에 연결합니다.

6. **Agent** 컴포넌트에 OpenAI API 키를 입력합니다.

7. 플로우를 테스트하려면 **Playground**를 클릭하고 LLM에 질문합니다:
   `carol.davis@example.com의 이전 주문을 기반으로 중고 아이템 3개를 추천해주세요.`

---

## 플로우에 Prompt Template 컴포넌트 추가

이 예시에서 애플리케이션은 고객의 이메일 주소를 Langflow 에이전트에 보냅니다.

1. **Chat Input** 및 **Agent** 컴포넌트 사이에 **Prompt Template** 컴포넌트를 추가합니다.

2. **Prompt Template** 컴포넌트의 **Template** 필드에 다음을 입력합니다:
   `이전 주문을 기반으로 {email}에게 중고 아이템 3개를 추천해주세요.`

   `{email}` 값을 중괄호로 추가하면 **Prompt Template** 컴포넌트에 새 입력이 만들어집니다.

   이 시점에서 플로우는 6개의 컴포넌트로 구성됩니다:
   - **Chat Input** → **Prompt Template**의 **email** 입력 포트
   - **Prompt Template** → **Agent**의 **System Message** 입력 포트
   - **Read File** 및 **Web Search** → **Agent**의 **Tools** 포트
   - **Agent** → **Chat Output**

---

## JavaScript 애플리케이션에서 플로우로 요청 보내기

수집할 정보:
- `LANGFLOW_SERVER_ADDRESS`: Langflow 서버의 도메인
- `FLOW_ID`: 플로우의 UUID 또는 커스텀 엔드포인트 이름
- `LANGFLOW_API_KEY`: 유효한 Langflow API 키

```javascript
import { LangflowClient } from "@datastax/langflow-client";

const LANGFLOW_SERVER_ADDRESS = 'LANGFLOW_SERVER_ADDRESS';
const FLOW_ID = 'FLOW_ID';
const LANGFLOW_API_KEY = 'LANGFLOW_API_KEY';
const email = "isabella.rodriguez@example.com";

async function runAgentFlow() {
    try {
        // Langflow 클라이언트 초기화
        const client = new LangflowClient({
            baseUrl: LANGFLOW_SERVER_ADDRESS,
            apiKey: LANGFLOW_API_KEY
        });

        console.log(`Langflow 서버에 연결 중: ${LANGFLOW_SERVER_ADDRESS}`);
        console.log(`플로우 ID: ${FLOW_ID}`);
        console.log(`이메일: ${email}`);

        // 플로우 인스턴스 가져오기
        const flow = client.flow(FLOW_ID);

        // 이메일을 입력으로 플로우 실행
        console.log('\n에이전트에 요청 보내는 중...');
        const response = await flow.run(email, {
            session_id: email
        });

        console.log('\n=== Langflow의 응답 ===');
        console.log('세션 ID:', response.sessionId);

        // 채팅 메시지에서 URL 추출
        const chatMessage = response.chatOutputText();
        console.log('\n=== 채팅 메시지의 URL ===');
        const messageUrls = chatMessage.match(/https?:\/\/[^\s"')\]]+/g) || [];
        const cleanMessageUrls = [...new Set(messageUrls)].map(url => url.trim());
        console.log('URL:');
        cleanMessageUrls.slice(0, 3).forEach(url => console.log(url));

    } catch (error) {
        console.error('플로우 실행 오류:', error);
    }
}

console.log('Langflow 에이전트 시작...\n');
runAgentFlow().catch(console.error);
```

스크립트를 저장하고 실행하여 요청을 보내고 플로우를 테스트합니다. 애플리케이션은 코드를 변경하지 않고도 로컬 CSV의 고객 이전 주문을 기반으로 추천 중고 아이템 3개의 URL을 받습니다.

---

## 다음 단계

- [Model Context Protocol (MCP) 서버](../mcp/mcp-server.md)
- [Langflow 배포 개요](../deploy/deployment-overview.md)

---

*원문: https://docs.langflow.org/next/agent-tutorial*
