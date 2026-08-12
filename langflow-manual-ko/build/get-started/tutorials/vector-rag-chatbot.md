# 벡터 RAG 챗봇 만들기
> 원문: https://docs.langflow.org/chat-with-rag

이 튜토리얼에서는 Retrieval Augmented Generation(RAG)을 사용하여 데이터를 벡터 데이터베이스에 벡터로 임베딩하고, 그 데이터와 채팅할 수 있는 챗봇 애플리케이션을 Langflow로 만드는 방법을 보여줍니다.

## 사전 준비[​](#prerequisites)

- [Langflow 설치 및 시작](https://docs.langflow.org/get-started-installation)
- [Langflow API 키](https://docs.langflow.org/api-keys-and-authentication) 생성
- [OpenAI API 키](https://platform.openai.com/api-keys) 생성
- [Langflow JavaScript 클라이언트](https://docs.langflow.org/typescript-client) 설치
- 벡터 데이터베이스, RAG와 같은 벡터 검색 개념 및 애플리케이션에 익숙할 것

## 벡터 RAG 플로우 만들기[​](#create-a-vector-rag-flow)

1. Langflow에서 **New Flow**를 클릭하고 **Vector Store RAG** 템플릿을 선택합니다.

**Vector Store RAG 템플릿에 대하여**

  이 템플릿에는 두 개의 플로우가 있습니다.

    **Load Data Flow**는 파일의 데이터로 벡터 스토어를 채웁니다.
이 데이터는 **Retriever Flow**에 제출된 쿼리에 응답하는 데 사용됩니다.

    구체적으로 **Load Data Flow**는 로컬 파일에서 데이터를 수집하고, 데이터를 청크로 분할하고, 벡터 데이터베이스에 데이터를 로드 및 인덱싱한 다음, 청크에 대한 임베딩을 계산합니다. 임베딩은 로드된 데이터와 함께 저장됩니다. 이 플로우는 벡터 데이터베이스에 데이터를 로드해야 할 때만 실행하면 됩니다.

    **Retriever Flow**는 채팅 입력을 받아 입력에 대한 임베딩을 생성한 다음, 여러 컴포넌트를 사용하여 청크를 텍스트로 재구성하고, 새 임베딩을 저장된 임베딩과 비교하여 유사한 데이터를 찾아 응답을 생성합니다.

2. 두 **OpenAI Embeddings** 컴포넌트 모두에 **OpenAI** API 키를 추가합니다.

3. 선택 사항: 두 **Astra DB** 벡터 스토어 컴포넌트를 **Chroma DB**나 원하는 다른 벡터 스토어 컴포넌트로 교체합니다.
이 튜토리얼에서는 Chroma DB를 사용합니다.

    **Load Data Flow**에는 **Read File**, **Split Text**, **Embedding Model**, 벡터 스토어(예: **Chroma DB**), **Chat Output** 컴포넌트가 있어야 합니다.

    ![파일 로더 채팅 플로우](https://docs.langflow.org/assets/images/tutorial-chatbot-embed-files-6157311fb4d16e7f944d55254f0cc0e2.png)

    **Retriever Flow**에는 **Chat Input**, **Embedding Model**, 벡터 스토어, **Parser**, **Prompt**, **Language Model**, **Chat Output** 컴포넌트가 있어야 합니다.

    ![RAG로 채팅하는 플로우](https://docs.langflow.org/assets/images/tutorial-chatbot-chat-flow-af7257d77ff0259ab1a0980641d464ce.png)

    이제 플로우를 사용할 준비가 되었습니다.
튜토리얼을 계속 진행하여 로딩 플로우로 벡터 스토어에 데이터를 로드하는 방법과, 챗봇 애플리케이션에서 채팅 플로우를 호출하는 방법을 알아보세요.

## 데이터를 로드하고 임베딩 생성하기[​](#load-data-and-generate-embeddings)

데이터를 로드하고 임베딩을 생성하려면 비주얼 에디터 또는 `/v2/files` 엔드포인트를 사용할 수 있습니다.

비주얼 에디터 옵션이 더 간단하지만, 플로우를 만든 사용자와 데이터베이스에 데이터를 로드하는 사용자가 같은 경우에만 권장됩니다.

여러 사용자가 데이터를 로드하거나 프로그래밍 방식으로 데이터를 로드해야 하는 상황에서는 Langflow API 옵션을 사용하세요.

- 비주얼 에디터
- Langflow API

1. RAG 챗봇 플로우에서 **Read File** 컴포넌트를 클릭한 다음 **File**을 클릭합니다.
2. 업로드하려는 로컬 파일을 선택한 다음 **Open**을 클릭합니다.
파일이 Langflow 서버로 로드됩니다.
3. 데이터를 벡터 데이터베이스에 로드하려면 벡터 스토어 컴포넌트를 클릭한 다음 **Run component**를 클릭하여 선택한 컴포넌트와 그 이전의 모든 종속 컴포넌트를 실행합니다.

Python에서 파일 업로드 요청을 구성하는 예시는 [Create a chatbot that can ingest files 튜토리얼](https://docs.langflow.org/chat-with-files#send-requests-to-your-flow-from-a-python-application)을 참조하세요.

다음 스크립트는 이 과정을 보여줍니다.

```js
// Node 18+ 예시로, 전역 fetch, FormData, Blob을 사용합니다
import fs from 'fs/promises';

// 1. 업로드할 파일로 폼 데이터 준비
const fileBuffer = await fs.readFile('FILE_NAME');
const data = new FormData();
data.append('file', new Blob([fileBuffer]), 'FILE_NAME');
const headers = { 'x-api-key': 'LANGFLOW_API_KEY' };

// 2. Langflow에 파일 업로드
const uploadRes = await fetch('LANGFLOW_SERVER_ADDRESS/api/v2/files/', {
  method: 'POST',
  headers,
  body: data
});
const uploadData = await uploadRes.json();
const uploadedPath = uploadData.path;

// 3. 업로드된 파일 경로로 Langflow run 엔드포인트 호출
const payload = {
  input_value: "Analyze this file",
  output_type: "chat",
  input_type: "text",
  tweaks: {
    'FILE_COMPONENT_NAME': {
      path: uploadedPath
    }
  }
};
const runRes = await fetch('LANGFLOW_SERVER_ADDRESS/api/v1/run/FLOW_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-api-key': 'LANGFLOW_API_KEY' },
  body: JSON.stringify(payload)
});
const langflowData = await runRes.json();
// 메시지만 출력
console.log(langflowData.outputs?.[0]?.outputs?.[0]?.results?.message?.data?.text);
```

플로우가 실행되면 선택한 파일을 수집하고, 데이터를 청크로 분할하고, 벡터 스토어 데이터베이스에 데이터를 로드한 다음, 청크에 대한 임베딩을 생성하며, 이 임베딩도 벡터 스토어에 저장됩니다.

이제 데이터베이스에는 LLM이 쿼리에 응답할 때 컨텍스트로 사용할 수 있는 벡터 임베딩이 포함된 데이터가 있으며, 이는 튜토리얼의 다음 섹션에서 보여드립니다.

## JavaScript 애플리케이션에서 플로우와 채팅하기[​](#chat-with-your-flow-from-a-javascript-application)

벡터 데이터베이스의 데이터와 채팅하려면 **Retriever Flow**를 프로그래밍 방식으로 실행하는 챗봇 애플리케이션을 만드세요.

이 튜토리얼은 시연 목적으로 JavaScript를 사용합니다.

1. 챗봇을 구성하려면 다음 정보를 수집하세요.

  - `LANGFLOW_SERVER_ADDRESS`: Langflow 서버의 도메인입니다. 기본값은 `127.0.0.1:7860`입니다. 이 값은 플로우의 [**API access** 창](https://docs.langflow.org/concepts-publish#api-access)에 있는 코드 스니펫에서 얻을 수 있습니다.
  - `FLOW_ID`: 플로우의 UUID 또는 사용자 지정 엔드포인트 이름입니다. 이 값은 플로우의 [**API access** 창](https://docs.langflow.org/concepts-publish#api-access)에 있는 코드 스니펫에서 얻을 수 있습니다.
  - `LANGFLOW_API_KEY`: 유효한 [Langflow API 키](https://docs.langflow.org/api-keys-and-authentication)입니다.

2. 다음 스크립트를 JavaScript 파일에 복사한 다음, 이전 단계에서 수집한 정보로 자리 표시자를 교체하세요.

```js
const readline = require('readline');
const { LangflowClient } = require('@datastax/langflow-client');

# pragma: allowlist nextline secret
const API_KEY = 'LANGFLOW_API_KEY';
const SERVER = 'LANGFLOW_SERVER_ADDRESS';
const FLOW_ID = 'FLOW_ID';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Langflow 클라이언트 초기화
const client = new LangflowClient({
    baseUrl: SERVER,
    apiKey: API_KEY
});

async function sendMessage(message) {
    try {
        const response = await client.flow(FLOW_ID).run(message, {
            session_id: 'user_1'
        });

        // 편의 메서드를 사용해 채팅 출력 텍스트 가져오기
        return response.chatOutputText() || 'No response';
    } catch (error) {
        return `Error: ${error.message}`;
    }
}

function chat() {
    console.log('🤖 Langflow RAG Chatbot (type "quit" to exit)\n');

    const ask = () => {
        rl.question('👤 You: ', async (input) => {
            if (['quit', 'exit', 'bye'].includes(input.trim().toLowerCase())) {
                console.log('👋 Goodbye!');
                rl.close();
                return;
            }

            const response = await sendMessage(input.trim());
            console.log(`🤖 Assistant: ${response}\n`);
            ask();
        });
    };

    ask();
}

chat();
```

    이 스크립트는 `chat` 입력/출력 타입을 사용하여 플로우와 통신하며 벡터 데이터베이스의 콘텐츠와 채팅하는 Node 애플리케이션을 생성합니다.
채팅은 여러 메시지에 걸쳐 지속적인 대화 컨텍스트를 유지합니다. `text` 타입의 입력/출력을 사용하는 경우 각 요청은 독립적인 텍스트 문자열입니다.

  tip
      [Langflow TypeScript 클라이언트](https://docs.langflow.org/typescript-client)에는 Langflow의 복잡한 JSON 응답 구조를 다루기 쉽게 해주는 `chatOutputText()` 편의 메서드가 있습니다.
`data.outputs[0].outputs[0].results.message.data.text`처럼 여러 단계의 중첩 객체를 수동으로 탐색하는 대신, 클라이언트가 자동으로 메시지 텍스트를 추출하고 정의되지 않은 값도 우아하게 처리합니다.

3. 스크립트를 저장하고 실행하여 요청을 보내고 플로우를 테스트합니다.

**결과**

  다음은 이 튜토리얼의 플로우에서 나온 응답 예시입니다. LLM의 특성과 입력값의 차이로 인해 실제 응답은 다를 수 있습니다.

```text
👤 You: Do you have any documents about engines?
🤖 Assistant: Yes, the provided text contains several warnings and guidelines related to engine installation, maintenance, and selection. It emphasizes the importance of using the correct engine for specific applications, ensuring all components are in good condition, and following safety precautions to prevent fire or explosion. If you need more specific information or details, please let me know!

👤 You: It should be about a Briggs and Stratton engine.
🤖 Assistant: The text provides important safety and installation guidelines for Briggs & Stratton engines. It emphasizes that these engines should not be used on 3-wheel All-Terrain Vehicles (ATVs), motor bikes, aircraft products, or vehicles intended for competitive events, as such uses are not approved by Briggs & Stratton.

If you have any specific questions about Briggs & Stratton engines or need further information, feel free to ask!
```

## 다음 단계[​](#next-steps)

이 튜토리얼을 확장하거나 더 알아보려면 다음을 참조하세요.

- [Model Context Protocol(MCP) 서버](https://docs.langflow.org/mcp-server)
- [Langflow 배포 개요](https://docs.langflow.org/deployment-overview)
