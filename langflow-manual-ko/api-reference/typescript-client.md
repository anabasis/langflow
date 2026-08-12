# Langflow TypeScript 클라이언트
> 원문: https://docs.langflow.org/next/typescript-client

Langflow TypeScript 클라이언트를 사용하면 TypeScript 애플리케이션에서 Langflow API와 프로그래밍 방식으로 상호작용할 수 있습니다.

클라이언트 코드 저장소는 [langflow-client-ts](https://github.com/datastax/langflow-client-ts/)를 참고하십시오.

npm 패키지는 [@datastax/langflow-client](https://www.npmjs.com/package/@datastax/langflow-client)를 참고하십시오.

## Langflow TypeScript 패키지 설치[​](#install-the-langflow-typescript-package "Direct link to Install the Langflow TypeScript package")

Langflow typescript 클라이언트 패키지를 설치하려면 다음 명령 중 하나를 사용하십시오.

- npm
- yarn
- pnpm

```bash
npm install @datastax/langflow-client
```

## Langflow TypeScript 클라이언트 초기화[​](#initialize-the-langflow-typescript-client "Direct link to Initialize the Langflow TypeScript client")

1. 코드에 클라이언트를 임포트합니다.

```tsx
import { LangflowClient } from "@datastax/langflow-client";
```

2. 서버와 상호작용할 `LangflowClient` 객체를 초기화합니다.

```tsx
const baseUrl = "BASE_URL";
const apiKey = "API_KEY";
const client = new LangflowClient({ baseUrl, apiKey });
```

    `BASE_URL`과 `API_KEY`를 배포 환경의 값으로 교체하십시오.
기본 Langflow 기본 URL은 `http://localhost:7860`입니다.
API 키를 생성하려면 [API 키 및 인증](https://docs.langflow.org/api-keys-and-authentication)을 참고하십시오.

## 서버에 연결하고 응답 받기[​](#connect-to-your-server-and-get-responses "Direct link to Connect to your server and get responses")

1. Langflow 클라이언트를 초기화했다면, Langflow 서버를 호출해 연결을 테스트합니다.

    다음 예시는 플로우 ID와 채팅 입력 문자열을 전달해 플로우(`runFlow`)를 실행합니다.

```tsx
import { LangflowClient } from "@datastax/langflow-client";

const baseUrl = "http://localhost:7860";
const client = new LangflowClient({ baseUrl });

async function runFlow() {
    const flowId = "aa5a238b-02c0-4f03-bc5c-cc3a83335cdf";
    const flow = client.flow(flowId);
    const input = "Is anyone there?";

    const response = await flow.run(input);
    console.log(response);
}

runFlow().catch(console.error);
```

    다음 값을 교체하십시오.

  - `baseUrl`: Langflow 서버의 URL.
  - `flowId`: 실행하려는 플로우의 ID.
  - `input`: 플로우를 트리거하기 위해 전송할 채팅 입력 메시지.
이는 **Chat Input** 컴포넌트가 있는 플로우에서만 유효합니다.

2. 클라이언트가 Langflow 서버에 성공적으로 연결되었는지 확인하기 위해 결과를 검토합니다.

    다음 예시는 Langflow 서버에 정상적으로 도달하여 플로우를 성공적으로 시작한 `runFlow` 요청의 응답을 보여줍니다.

```text
FlowResponse {
  sessionId: 'aa5a238b-02c0-4f03-bc5c-cc3a83335cdf',
  outputs: [ { inputs: [Object], outputs: [Array] } ]
}
```

    이 경우 응답에는 클라이언트-서버 세션의 고유 식별자인 [`sessionID`](https://docs.langflow.org/session-id)와 플로우 실행에 대한 정보를 담은 `outputs` 배열이 포함됩니다.

3. 선택 사항: 서버에서 전체 응답 객체를 받고 싶다면, `console.log`를 반환된 JSON 객체를 문자열화하도록 변경합니다.

```tsx
console.log(JSON.stringify(response, null, 2));
```

    반환되는 `inputs`와 `outputs` 객체의 정확한 구조는 플로우의 컴포넌트와 설정에 따라 다릅니다.

4. 선택 사항: 응답에 **Chat Output** 컴포넌트의 채팅 메시지만 포함되도록 하려면, `console.log`가 `chatOutputText` 편의 함수를 사용하도록 변경합니다.

```tsx
console.log(response.chatOutputText());
```

## TypeScript 클라이언트 고급 기능 사용[​](#use-advanced-typescript-client-features "Direct link to Use advanced TypeScript client features")

TypeScript 클라이언트는 단순히 서버에 연결해 플로우를 실행하는 것 이상의 작업을 할 수 있습니다.

이 예시는 퀵스타트를 확장하여 Langflow와 상호작용하는 추가 기능을 다룹니다.

1. 요청과 함께 [tweaks](https://docs.langflow.org/concepts-publish#input-schema)를 객체로 전달합니다.
Tweaks는 컴포넌트 설정에 대한 프로그래밍 방식의 런타임 오버라이드입니다.

    이 예시는 플로우 내 언어 모델 컴포넌트가 사용하는 LLM을 변경합니다.

```tsx
const tweaks = { model_name: "gpt-4o-mini" };
```

2. 요청과 함께 [세션 ID](https://docs.langflow.org/session-id)를 전달하여 다른 플로우 실행과 대화를 분리하고, 이후 같은 세션 ID를 호출해 대화를 이어갈 수 있도록 합니다.

```tsx
const session_id = "aa5a238b-02c0-4f03-bc5c-cc3a83335cdf";
```

3. Flow 객체에서 `run`을 호출하는 대신, 동일한 인자로 `stream`을 호출하여 스트리밍 응답을 받습니다.

```tsx
const response = await client.flow(flowId).stream(input);

for await (const event of response) {
  console.log(event);
}
```

    응답은 객체의 [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)입니다.
Langflow 응답 스트리밍에 대한 자세한 내용은 [`/run` 엔드포인트](https://docs.langflow.org/api-flows-run#run-flow)를 참고하십시오.

4. 수정된 TypeScript 애플리케이션을 실행하여 `tweaks`, `session_id`, 스트리밍을 사용해 플로우를 실행합니다.

```tsx
import { LangflowClient } from "@datastax/langflow-client";

const baseUrl = "http://localhost:7860";
const client = new LangflowClient({ baseUrl });

async function runFlow() {
    const flowId = "aa5a238b-02c0-4f03-bc5c-cc3a83335cdf";
    const input = "Is anyone there?";
    const tweaks = { model_name: "gpt-4o-mini" };
    const session_id = "test-session";

    const response = await client.flow(flowId).stream(input, {
        session_id,
        tweaks,
      });

    for await (const event of response) {
        console.log(event);
    }

}
runFlow().catch(console.error);
```

    다음 값을 교체하십시오.

  - `baseUrl`: Langflow 서버의 URL.
  - `flowId`: 실행하려는 플로우의 ID.
  - `input`: 플로우가 **Chat Input** 컴포넌트를 가지고 있다고 가정할 때, 플로우를 트리거하기 위해 전송할 채팅 입력 메시지.
  - `tweaks`: 플로우 실행에 적용할 tweak 수정자. 이 예시는 플로우 내 컴포넌트가 사용하는 LLM을 변경합니다.
  - `session_id`: 커스텀 세션 ID를 전달합니다.
생략하거나 비워두면, 플로우 ID가 기본 세션 ID가 됩니다.

**결과(Result)**

  스트리밍을 활성화하면, 응답에는 플로우 메타데이터와 플로우 활동에 대한 타임스탬프가 찍힌 이벤트가 포함됩니다.
예를 들면 다음과 같습니다.

```text
{
  event: 'add_message',
  data: {
    timestamp: '2025-05-23 15:52:48 UTC',
    sender: 'User',
    sender_name: 'User',
    session_id: 'test-session',
    text: 'Is anyone there?',
    files: [],
    error: false,
    edit: false,
    properties: {
      text_color: '',
      background_color: '',
      edited: false,
      source: [Object],
      icon: '',
      allow_markdown: false,
      positive_feedback: null,
      state: 'complete',
      targets: []
    },
    category: 'message',
    content_blocks: [],
    id: '7f096715-3f2d-4d84-88d6-5e2f76bf3fbe',
    flow_id: 'aa5a238b-02c0-4f03-bc5c-cc3a83335cdf',
    duration: null
  }
}
{
  event: 'token',
  data: {
    chunk: 'Absolutely',
    id: 'c5a99314-6b23-488b-84e2-038aa3e87fb5',
    timestamp: '2025-05-23 15:52:48 UTC'
  }
}
{
  event: 'token',
  data: {
    chunk: ',',
    id: 'c5a99314-6b23-488b-84e2-038aa3e87fb5',
    timestamp: '2025-05-23 15:52:48 UTC'
  }
}
{
  event: 'token',
  data: {
    chunk: " I'm",
    id: 'c5a99314-6b23-488b-84e2-038aa3e87fb5',
    timestamp: '2025-05-23 15:52:48 UTC'
  }
}
{
  event: 'token',
  data: {
    chunk: ' here',
    id: 'c5a99314-6b23-488b-84e2-038aa3e87fb5',
    timestamp: '2025-05-23 15:52:48 UTC'
  }
}

// this response is abbreviated

{
  event: 'end',
  data: { result: { session_id: 'test-session', outputs: [Array] } }
}
```

## TypeScript 클라이언트로 Langflow 로그 조회하기[​](#retrieve-langflow-logs-with-the-typescript-client "Direct link to Retrieve Langflow logs with the TypeScript client")

[Langflow 로그](https://docs.langflow.org/logging)를 조회하려면, Langflow `.env` 파일에 다음 값을 포함하여 Langflow 서버에서 로그 조회 기능을 활성화해야 합니다.

```text
LANGFLOW_ENABLE_LOG_RETRIEVAL=True
LANGFLOW_LOG_RETRIEVER_BUFFER_SIZE=10000
LANGFLOW_LOG_LEVEL=DEBUG
```

다음 예시 스크립트는 백그라운드에서 로그 스트리밍을 시작한 다음, 플로우 실행을 모니터링할 수 있도록 플로우를 실행합니다.

```tsx
import { LangflowClient } from "@datastax/langflow-client";

const baseUrl = "http://localhost:7863";
const flowId = "86f0bf45-0544-4e88-b0b1-8e622da7a7f0";

async function runFlow(client: LangflowClient) {
    const input = "Is anyone there?";
    const response = await client.flow(flowId).run(input);
    console.log('Flow response:', response);
}

async function main() {
    const client = new LangflowClient({ baseUrl: baseUrl });

    // Start streaming logs
    console.log('Starting log stream...');
    for await (const log of await client.logs.stream()) {
        console.log('Log:', log);
    }

    // Run the flow
    await runFlow(client);

}

main().catch(console.error);
```

다음 값을 교체하십시오.

- `baseUrl`: Langflow 서버의 URL.
- `flowId`: 실행하려는 플로우의 ID.
- `input`: 플로우가 **Chat Input** 컴포넌트를 가지고 있다고 가정할 때, 플로우를 트리거하기 위해 전송할 채팅 입력 메시지.

로그는 무기한 스트리밍되기 시작하며, 플로우는 한 번 실행됩니다.

**결과(Result)**

다음 예시 결과는 가독성을 위해 축약되었지만, 메시지를 따라가면 플로우가 컴포넌트를 인스턴스화하고, 모델을 설정하고, 출력을 처리하는 과정을 확인할 수 있습니다.

스트림 끝에 있는 `FlowResponse` 객체는 `outputs` 배열의 플로우 결과와 함께 클라이언트에 반환됩니다.

```text
Starting log stream...
Log: Log {
  timestamp: 2025-05-30T11:49:16.006Z,
  message: '2025-05-30T07:49:16.006127-0400 DEBUG Instantiating ChatInput of type component\n'
}
Log: Log {
  timestamp: 2025-05-30T11:49:16.029Z,
  message: '2025-05-30T07:49:16.029957-0400 DEBUG Instantiating Prompt of type component\n'
}
Log: Log {
  timestamp: 2025-05-30T11:49:16.049Z,
  message: '2025-05-30T07:49:16.049520-0400 DEBUG Instantiating ChatOutput of type component\n'
}
Log: Log {
  timestamp: 2025-05-30T11:49:16.069Z,
  message: '2025-05-30T07:49:16.069359-0400 DEBUG Instantiating OpenAIModel of type component\n'
}
Log: Log {
  timestamp: 2025-05-30T11:49:16.086Z,
  message: "2025-05-30T07:49:16.086426-0400 DEBUG Running layer 0 with 2 tasks, ['ChatInput-xjucM', 'Prompt-I3pxU']\n"
}
Log: Log {
  timestamp: 2025-05-30T11:49:16.101Z,
  message: '2025-05-30T07:49:16.101766-0400 DEBUG Building Chat Input\n'
}
Log: Log {
  timestamp: 2025-05-30T11:49:16.113Z,
  message: '2025-05-30T07:49:16.113343-0400 DEBUG Building Prompt\n'
}
Log: Log {
  timestamp: 2025-05-30T11:49:16.131Z,
  message: '2025-05-30T07:49:16.131423-0400 DEBUG Logged vertex build: 6bd9fe9c-5eea-4f05-a96d-f6de9dc77e3c\n'
}
Log: Log {
  timestamp: 2025-05-30T11:49:16.143Z,
  message: '2025-05-30T07:49:16.143295-0400 DEBUG Logged vertex build: 39c68ec9-3859-4fff-9b14-80b3271f8fbf\n'
}
Log: Log {
  timestamp: 2025-05-30T11:49:16.188Z,
  message: "2025-05-30T07:49:16.188730-0400 DEBUG Running layer 1 with 1 tasks, ['OpenAIModel-RtlZm']\n"
}
Log: Log {
  timestamp: 2025-05-30T11:49:16.201Z,
  message: '2025-05-30T07:49:16.201946-0400 DEBUG Building OpenAI\n'
}
Log: Log {
  timestamp: 2025-05-30T11:49:16.216Z,
  message: '2025-05-30T07:49:16.216622-0400 INFO Model name: gpt-4.1-mini\n'
}
Flow response: FlowResponse {
  sessionId: '86f0bf45-0544-4e88-b0b1-8e622da7a7f0',
  outputs: [ { inputs: [Object], outputs: [Array] } ]
}
Log: Log {
  timestamp: 2025-05-30T11:49:18.094Z,
  message: `2025-05-30T07:49:18.094364-0400 DEBUG Vertex OpenAIModel-RtlZm, result: <langflow.graph.utils.UnbuiltResult object at 0x364d24dd0>, object: {'text_output': "Hey there! I'm here and ready to help you build something awesome with AI. What are you thinking about creating today?"}\n`
}
```

자세한 내용은 [로그 엔드포인트](https://docs.langflow.org/api-logs)를 참고하십시오.
