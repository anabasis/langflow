# 애플리케이션을 에이전트에 연결하기
> 원문: https://docs.langflow.org/agent-tutorial

이 튜토리얼에서는 JavaScript 애플리케이션을 [Langflow 에이전트](https://docs.langflow.org/agents)에 연결하는 방법을 보여줍니다.

에이전트를 사용하면 애플리케이션 코드를 변경하지 않고도 연결된 도구를 사용하여 더 맥락에 맞고 시의적절한 데이터를 가져올 수 있습니다. 도구는 문제를 해결하고 질문에 답하기 위해 에이전트 내부의 LLM이 선택합니다.

## 사전 준비[​](#prerequisites)

- [Langflow 설치 및 시작](https://docs.langflow.org/get-started-installation)
- [Langflow API 키](https://docs.langflow.org/api-keys-and-authentication) 생성
- [Langflow JavaScript 클라이언트](https://docs.langflow.org/typescript-client) 설치
- [OpenAI API 키](https://platform.openai.com/api-keys) 생성

이 튜토리얼에서는 OpenAI LLM을 사용합니다. 다른 제공자를 사용하려면 해당 제공자의 유효한 자격 증명이 필요합니다.

## 에이전트 플로우 만들기[​](#create-an-agent-flow)

다음 단계는 **Simple Agent** 템플릿을 수정하여 [**Read File** 컴포넌트](https://docs.langflow.org/read-file)와 [**Web Search** 컴포넌트](https://docs.langflow.org/web-search)를 **Agent** 컴포넌트의 도구로 연결합니다.
**Read File** 컴포넌트는 Langflow에 업로드한 파일을 로드하고, **Web Search** 컴포넌트는 DuckDuckGo 검색을 수행합니다.
**Agent** 컴포넌트에 도구로 연결되면 에이전트는 요청을 처리할 때 이 컴포넌트들을 사용할 수 있는 옵션을 갖게 됩니다.

1. Langflow에서 **New Flow**를 클릭하고 **Simple Agent** 템플릿을 선택합니다.

2. **URL**과 **Calculator** 도구를 제거한 다음 플로우에 **Read File**과 **Web Search** 컴포넌트를 추가합니다.

3. **Read File** 컴포넌트에 **Agent** 컴포넌트가 사용할 수 있도록 만들려는 파일을 업로드합니다.

    이 튜토리얼에서는 에이전트가 고객 구매 기록에 접근해야 합니다.
자신의 데이터에 맞게 튜토리얼을 조정할 수 있으며, 그대로 따라 하려면 [`customer-orders.csv`](https://docs.langflow.org/assets/files/customer_orders-0c1c00f9ebd1f6b3c9ede72af1b67ca2.csv)를 다운로드할 수 있습니다.
파일 업로드 필드를 클릭하고 파일을 선택하여 `customer-orders.csv`를 **Read File** 컴포넌트에 업로드하세요.
이 튜토리얼의 이후 단계에서는 에이전트가 고객 데이터에서 `email` 값을 찾도록 프롬프트됩니다.

4. **Read File**과 **Web Search** [컴포넌트의 헤더 메뉴](https://docs.langflow.org/concepts-components#component-menus)에서 **Tool Mode**를 활성화하여 에이전트와 함께 컴포넌트를 사용할 수 있도록 합니다.

5. **Read File**과 **Web Search** 컴포넌트의 **Toolset** 포트를 **Agent** 컴포넌트의 **Tools** 포트에 연결합니다.

6. **Agent** 컴포넌트에 OpenAI API 키를 입력합니다.

    다른 제공자나 모델을 사용하려면 **Model Provider**, **Model Name**, **API Key** 필드를 그에 맞게 수정하세요.

7. 플로우를 테스트하려면 **Playground**를 클릭하고 LLM에게 `Recommend 3 used items for carol.davis@example.com, based on previous orders.`와 같은 질문을 해보세요.

    이 예시 프롬프트가 주어지면 LLM은 `customer_orders.csv`의 이전 주문을 기반으로 추천과 관련 웹 링크로 응답할 것입니다.

    **Playground**는 에이전트가 사용할 도구를 선택하고 해당 도구가 제공하는 기능과 상호작용하는 사고 과정을 출력합니다.
예를 들어 에이전트는 **Read File** 컴포넌트를 사용해 CSV 데이터를 로드하고, **Web Search** 컴포넌트의 `perform_search` 도구를 사용해 관련 상품 링크를 찾을 수 있습니다.

## 플로우에 Prompt Template 컴포넌트 추가하기[​](#add-a-prompt-template-component-to-the-flow)

이 예시에서 애플리케이션은 고객의 이메일 주소를 Langflow 에이전트로 보냅니다. 에이전트는 **Read File** 컴포넌트에서 고객의 이전 주문을 읽고, 해당 상품의 중고 버전을 웹에서 검색한 다음 세 가지 결과를 반환합니다.

1. 이메일 주소를 플로우 내 값으로 포함하려면 **Chat Input**과 **Agent** 컴포넌트 사이에 [**Prompt Template** 컴포넌트](https://docs.langflow.org/components-prompts)를 추가하세요.

2. **Prompt Template** 컴포넌트의 **Template** 필드에 `Recommend 3 used items for {email}, based on previous orders.`를 입력합니다. 중괄호 안에 `{email}` 값을 추가하면 **Prompt Template** 컴포넌트에 새로운 입력이 생성되며, `{email}` 포트에 연결된 컴포넌트가 해당 변수에 값을 공급합니다.
이렇게 하면 요청에서 사용자의 이메일이 플로우로 유입되는 지점이 만들어집니다.
`customer_orders.csv` 예제 파일을 사용하지 않는다면 데이터셋에서 값을 검색하도록 입력을 수정하세요.

    이 시점에서 플로우에는 여섯 개의 컴포넌트가 있습니다. **Chat Input** 컴포넌트는 **Prompt Template** 컴포넌트의 **email** 입력 포트에 연결됩니다. 그런 다음 **Prompt Template** 컴포넌트의 출력은 **Agent** 컴포넌트의 **System Message** 입력 포트에 연결됩니다. **Read File**과 **Web Search** 컴포넌트는 **Agent** 컴포넌트의 **Tools** 포트에 연결됩니다. 마지막으로 **Agent** 컴포넌트의 출력은 **Chat Output** 컴포넌트에 연결되어 애플리케이션에 최종 응답을 반환합니다.

    ![Read File과 Web Search 컴포넌트를 도구로 연결한 Agent 컴포넌트](https://docs.langflow.org/assets/images/tutorial-agent-with-directory-dae1830ae14e6883f02069c163404d12.png)

## JavaScript 애플리케이션에서 플로우로 요청 보내기[​](#send-requests-to-your-flow-from-a-javascript-application)

플로우가 작동하면, JavaScript 애플리케이션을 플로우에 연결하여 에이전트의 응답을 사용하세요.

1. 플로우에 연결할 JavaScript 애플리케이션을 구성하려면 다음 정보를 수집하세요.

  - `LANGFLOW_SERVER_ADDRESS`: Langflow 서버의 도메인입니다. 기본값은 `127.0.0.1:7860`입니다. 이 값은 플로우의 [**API access** 창](https://docs.langflow.org/concepts-publish#api-access)에 있는 코드 스니펫에서 얻을 수 있습니다.
  - `FLOW_ID`: 플로우의 UUID 또는 사용자 지정 엔드포인트 이름입니다. 이 값은 플로우의 [**API access** 창](https://docs.langflow.org/concepts-publish#api-access)에 있는 코드 스니펫에서 얻을 수 있습니다.
  - `LANGFLOW_API_KEY`: 유효한 [Langflow API 키](https://docs.langflow.org/api-keys-and-authentication)입니다.

2. 다음 스크립트를 JavaScript 파일에 복사한 다음, 이전 단계에서 수집한 정보로 자리 표시자를 교체하세요.
`customer_orders.csv` 예제 파일을 사용하는 경우 코드 예시의 이메일 주소 그대로 이 예시를 실행할 수 있습니다.
그렇지 않다면 데이터셋에서 값을 검색하도록 `const email = "isabella.rodriguez@example.com"`을 수정하세요.

```js
import { LangflowClient } from "@datastax/langflow-client";

const LANGFLOW_SERVER_ADDRESS = 'LANGFLOW_SERVER_ADDRESS';
const FLOW_ID = 'FLOW_ID';
const LANGFLOW_API_KEY = 'LANGFLOW_API_KEY';
const email = "isabella.rodriguez@example.com";

async function runAgentFlow(): Promise<void> {
    try {
        // Langflow 클라이언트 초기화
        const client = new LangflowClient({
            baseUrl: LANGFLOW_SERVER_ADDRESS,
            apiKey: LANGFLOW_API_KEY
        });

        console.log(`Connecting to Langflow server at: ${LANGFLOW_SERVER_ADDRESS} `);
        console.log(`Flow ID: ${FLOW_ID}`);
        console.log(`Email: ${email}`);

        // 플로우 인스턴스 가져오기
        const flow = client.flow(FLOW_ID);

        // 이메일을 입력으로 플로우 실행
        console.log('\nSending request to agent...');
        const response = await flow.run(email, {
            session_id: email // 컨텍스트를 위해 이메일을 세션 ID로 사용
        });

        console.log('\n=== Response from Langflow ===');
        console.log('Session ID:', response.sessionId);

        // 채팅 메시지에서 URL 추출
        const chatMessage = response.chatOutputText();
        console.log('\n=== URLs from Chat Message ===');
        const messageUrls = chatMessage.match(/https?:\/\/[^\s"')\]]+/g) || [];
        const cleanMessageUrls = [...new Set(messageUrls)].map(url => url.trim());
        console.log('URLs from message:');
        cleanMessageUrls.slice(0, 3).forEach(url => console.log(url));

    } catch (error) {
        console.error('Error running flow:', error);

        // 오류 메시지 제공
        if (error instanceof Error) {
            if (error.message.includes('fetch')) {
                console.error('\nMake sure your Langflow server is running and accessible at:', LANGFLOW_SERVER_ADDRESS);
            }
            if (error.message.includes('401') || error.message.includes('403')) {
                console.error('\nCheck your API key configuration');
            }
            if (error.message.includes('404')) {
                console.error('\nCheck your Flow ID - make sure it exists and is correct');
            }
        }
    }
}

// 함수 실행
console.log('Starting Langflow Agent...\n');
runAgentFlow().catch(console.error);
```

3. 스크립트를 저장하고 실행하여 요청을 보내고 플로우를 테스트합니다.

    애플리케이션은 코드 변경 없이도 로컬 CSV의 고객 이전 주문을 기반으로 추천된 중고 상품 URL 세 개를 받습니다.

**결과**

  다음은 이 튜토리얼의 플로우에서 나온 응답 예시입니다. LLM의 특성과 입력값의 차이로 인해 실제 응답은 다를 수 있습니다.

```text
Starting Langflow Agent...

Connecting to Langflow server at: http://localhost:7860
Flow ID: local-db-search
Email: isabella.rodriguez@example.com

Sending request to agent...

=== Response from Langflow ===
Session ID: isabella.rodriguez@example.com

URLs found:
https://www.facebook.com/marketplace/258164108225783/electronics/
https://www.facebook.com/marketplace/458332108944152/furniture/
https://www.facebook.com/marketplace/613732137493719/kitchen-cabinets/
```

4. 플로우로 유입되는 트래픽을 빠르게 확인하려면 **Playground**를 열어보세요.
새 세션은 사용자의 이메일 주소로 이름 붙여집니다.
세션을 구분하면 에이전트가 컨텍스트를 유지하는 데 도움이 됩니다. 세션 ID에 대한 자세한 내용은 [Session ID](https://docs.langflow.org/session-id)를 참조하세요.

## 다음 단계[​](#next-steps)

이 튜토리얼을 확장하거나 더 알아보려면 다음을 참조하세요.

- [Model Context Protocol(MCP) 서버](https://docs.langflow.org/mcp-server)
- [Langflow 배포 개요](https://docs.langflow.org/deployment-overview)
