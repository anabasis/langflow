# 벡터 RAG 챗봇 만들기

이 튜토리얼은 Langflow를 사용하여 RAG(Retrieval Augmented Generation)를 통해 데이터를 벡터 데이터베이스에 임베딩하고, 그 데이터와 채팅하는 챗봇 애플리케이션을 만드는 방법을 보여줍니다.

## 사전 요구사항

- [Langflow 설치 및 시작](./installation.md)
- [Langflow API 키](../develop/api-keys-and-authentication.md) 생성
- [OpenAI API 키](https://platform.openai.com/api-keys) 생성
- [Langflow JavaScript 클라이언트](https://docs.langflow.org/typescript-client) 설치
- 벡터 데이터베이스와 RAG 등 벡터 검색 개념에 익숙한 상태

---

## 벡터 RAG 플로우 만들기

1. Langflow에서 **New Flow**를 클릭하고 **Vector Store RAG** 템플릿을 선택합니다.

**Vector Store RAG 템플릿 정보**

이 템플릿에는 두 개의 플로우가 있습니다.

**Load Data Flow**는 파일에서 벡터 스토어로 데이터를 채웁니다. 이 데이터는 **Retriever Flow**에 제출된 쿼리에 응답하는 데 사용됩니다.

구체적으로, **Load Data Flow**는 로컬 파일에서 데이터를 수집하고, 데이터를 청크로 분할하고, 데이터를 벡터 데이터베이스에 로드 및 인덱싱한 다음, 청크에 대한 임베딩을 계산합니다. 임베딩도 로드된 데이터와 함께 저장됩니다. 이 플로우는 벡터 데이터베이스에 데이터를 로드해야 할 때만 실행하면 됩니다.

**Retriever Flow**는 채팅 입력을 받아 입력에 대한 임베딩을 생성한 다음, 여러 컴포넌트를 사용하여 청크를 텍스트로 재구성하고, 새 임베딩을 저장된 임베딩과 비교하여 유사한 데이터를 찾아 응답을 생성합니다.

2. 두 **OpenAI Embeddings** 컴포넌트에 **OpenAI** API 키를 추가합니다.

3. (선택 사항) 두 **Astra DB** 벡터 스토어 컴포넌트를 **Chroma DB** 또는 원하는 다른 벡터 스토어 컴포넌트로 교체합니다. (이 튜토리얼에서는 Chroma DB를 사용합니다)

**Load Data Flow**에는 **Read File**, **Split Text**, **Embedding Model**, 벡터 스토어(예: **Chroma DB**), **Chat Output** 컴포넌트가 있어야 합니다.

**Retriever Flow**에는 **Chat Input**, **Embedding Model**, 벡터 스토어, **Parser**, **Prompt**, **Language Model**, **Chat Output** 컴포넌트가 있어야 합니다.

플로우가 준비되었습니다. 다음 단계에서는 로딩 플로우를 사용하여 벡터 스토어에 데이터를 로드한 다음, 챗봇 애플리케이션에서 채팅 플로우를 호출하는 방법을 배웁니다.

---

## 데이터 로드 및 임베딩 생성

데이터를 로드하고 임베딩을 생성하려면 비주얼 에디터 또는 `/v2/files` 엔드포인트를 사용할 수 있습니다.

비주얼 에디터 방식이 더 간단하지만, 플로우를 만든 사용자가 데이터베이스에 데이터를 로드하는 시나리오에만 권장됩니다.

많은 사용자가 데이터를 로드하거나 프로그래밍 방식으로 데이터를 로드해야 하는 경우 Langflow API를 사용하세요.

**비주얼 에디터 방식:**

1. RAG 챗봇 플로우에서 **Read File** 컴포넌트를 클릭하고 **File**을 클릭합니다.
2. 업로드할 로컬 파일을 선택하고 **Open**을 클릭합니다. 파일이 Langflow 서버에 로드됩니다.
3. 데이터를 벡터 데이터베이스에 로드하려면 벡터 스토어 컴포넌트를 클릭하고 **Run component**를 클릭하여 선택한 컴포넌트와 그 이전 종속 컴포넌트를 실행합니다.

**Langflow API 방식 (Node.js 예제):**

```javascript
// Node 18+ 예제 (전역 fetch, FormData, Blob 사용)
import fs from 'fs/promises';

// 1. 업로드할 파일로 FormData 준비
const fileBuffer = await fs.readFile('FILE_NAME');
const data = new FormData();
data.append('file', new Blob([fileBuffer]), 'FILE_NAME');
const headers = { 'x-api-key': 'LANGFLOW_API_KEY' };

// 2. 파일을 Langflow에 업로드
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

플로우가 실행되면 선택된 파일을 수집하고, 데이터를 청크로 분할하고, 데이터를 벡터 스토어 데이터베이스에 로드한 다음, 청크에 대한 임베딩을 생성하여 벡터 스토어에도 저장합니다.

---

## JavaScript 애플리케이션에서 플로우와 채팅하기

벡터 데이터베이스의 데이터와 채팅하려면 **Retriever Flow**를 프로그래밍 방식으로 실행하는 챗봇 애플리케이션을 만드세요.

1. 챗봇을 구성하기 위해 다음 정보를 수집합니다:
   - `LANGFLOW_SERVER_ADDRESS`: Langflow 서버 도메인 (기본값: `127.0.0.1:7860`)
   - `FLOW_ID`: 플로우의 UUID 또는 커스텀 엔드포인트 이름
   - `LANGFLOW_API_KEY`: 유효한 [Langflow API 키](../develop/api-keys-and-authentication.md)

2. 다음 스크립트를 JavaScript 파일에 복사하고 플레이스홀더를 이전 단계에서 수집한 정보로 교체합니다:

```javascript
const readline = require('readline');
const { LangflowClient } = require('@datastax/langflow-client');

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
        // 채팅 출력 텍스트를 가져오는 편의 메서드 사용
        return response.chatOutputText() || 'No response';
    } catch (error) {
        return `Error: ${error.message}`;
    }
}

function chat() {
    console.log('🤖 Langflow RAG 챗봇 (종료하려면 "quit" 입력)\n');

    const ask = () => {
        rl.question('👤 You: ', async (input) => {
            if (['quit', 'exit', 'bye'].includes(input.trim().toLowerCase())) {
                console.log('👋 안녕히 가세요!');
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

> **팁**: [Langflow TypeScript 클라이언트](https://docs.langflow.org/typescript-client)의 `chatOutputText()` 편의 메서드는 Langflow의 복잡한 JSON 응답 구조를 단순화합니다. `data.outputs[0].outputs[0].results.message.data.text`처럼 중첩된 객체를 수동으로 탐색하는 대신, 클라이언트가 자동으로 메시지 텍스트를 추출하고 잠재적으로 정의되지 않은 값을 처리합니다.

3. 스크립트를 저장하고 실행하여 요청을 보내고 플로우를 테스트합니다.

**결과 예시:**

```
👤 You: 엔진에 관한 문서가 있나요?
🤖 Assistant: 네, 제공된 텍스트에는 엔진 설치, 유지 관리 및 선택에 관한 여러 경고 및 지침이 포함되어 있습니다...

👤 You: Briggs and Stratton 엔진에 대한 내용이어야 합니다.
🤖 Assistant: 텍스트는 Briggs & Stratton 엔진에 대한 중요한 안전 및 설치 지침을 제공합니다...
```

---

## 다음 단계

- [모델 컨텍스트 프로토콜(MCP) 서버](../mcp/mcp-server.md)
- [Langflow 배포 개요](../deploy/deployment-overview.md)

---

*원문: https://docs.langflow.org/next/chat-with-rag*
