# Langflow API로 flow 트리거하기
> 원문: https://docs.langflow.org/next/concepts-publish

flow를 빌드한 후에는 모바일 앱이나 웹사이트 내의 챗봇처럼 애플리케이션 내에서 이를 실행하고 싶을 것입니다.

Langflow는 외부 애플리케이션에서 flow를 실행하는 여러 방법을 제공합니다.

- [Langflow API로 flow 트리거하기](#api-access)
- [웹사이트에 임베드된 채팅 위젯 추가하기](#embedded-chat-widget)
- [Langflow MCP 서버를 통해 flow 서빙하기](#serve-flows-through-a-langflow-mcp-server)
- [OpenAI Responses 호환 엔드포인트로 flow 실행하기](#openai-responses-api)

이 옵션들은 격리된 로컬 Langflow 인스턴스와 함께 사용할 수도 있지만, [Langflow 서버를 배포](https://docs.langflow.org/deployment-overview)했거나 [Langflow를 애플리케이션의 의존성으로 패키징](https://docs.langflow.org/develop-application)했을 때 일반적으로 더 유용합니다.

## Langflow API로 flow 실행하기[​](#api-access "Direct link to Use the Langflow API to run flows")

Langflow API는 프로그래밍 방식으로 flow와 Langflow 서버에 접근하는 주된 방법입니다.

직접 해보기

Langflow API를 호출하는 스크립트 예시는 [퀵스타트](https://docs.langflow.org/get-started-quickstart)를 참고하세요.

### API 코드 스니펫 생성하기[​](#generate-api-code-snippets "Direct link to Generate API code snippets")

스크립트에 Langflow API 요청을 임베드하는 것을 돕기 위해 Langflow는 flow에 대한 Python, JavaScript, curl 코드 스니펫을 자동으로 생성합니다.
이 코드 스니펫을 얻으려면 다음을 수행합니다.

1. Langflow에서 애플리케이션에 임베드하려는 flow를 엽니다.

2. **Share**를 클릭한 다음 **API access**를 선택합니다.

    이 코드 스니펫은 `/v1/run/$FLOW_ID` 엔드포인트를 호출하며, Langflow 서버 URL, flow ID, 헤더, 요청 파라미터와 같은 최소한의 값을 자동으로 채워줍니다.

  
  Windows
      API access 창에서 생성되는 경로는 *nix 환경을 가정합니다.
Microsoft Windows나 WSL을 사용한다면 코드 스니펫에 있는 파일 경로를 조정해야 할 수 있습니다.

    ![API access pane](https://docs.langflow.org/assets/images/api-pane-5fab94770d85eec84d6f8c10edb185c9.png)

3. 선택사항: flow 자체를 변경하지 않고 코드 스니펫의 컴포넌트 파라미터를 수정하려면 [**Input Schema**](#input-schema)를 클릭하세요.

4. 사용하려는 언어의 스니펫을 복사합니다.

5. 스니펫을 그대로 실행하거나 더 큰 스크립트의 일부로 사용합니다.

다른 Langflow API 엔드포인트에 대한 더 많은 정보와 예시는 [Langflow API 시작하기](https://docs.langflow.org/api-reference-api-examples)를 참고하세요.

### Langflow API 인증[​](#langflow-api-authentication "Direct link to Langflow API authentication")

Langflow 1.5 이후 버전에서는 대부분의 API 엔드포인트가 Langflow API 키로 인증을 요구합니다.

**API access** 창에서 생성된 코드 스니펫은 로컬 터미널 세션에 설정된 `LANGFLOW_API_KEY` 환경 변수를 확인하는 스크립트를 포함합니다.
이 스크립트는 로컬 터미널 세션 외의 다른 곳에 설정된 Langflow API 키는 확인하지 않습니다.

이 스크립트가 동작하려면 코드 스니펫을 실행하려는 터미널 세션에 `LANGFLOW_API_KEY` 변수를 설정해야 합니다. 예를 들어 `export LANGFLOW_API_KEY="sk..."`와 같이 설정합니다.

대안으로, 코드 스니펫을 편집하여 `x-api-key` 헤더를 포함시키고 요청이 Langflow API에 인증될 수 있도록 할 수도 있습니다.

자세한 내용은 [API 키와 인증](https://docs.langflow.org/api-keys-and-authentication)과 [Langflow API 시작하기](https://docs.langflow.org/api-reference-api-examples)를 참고하세요.

### 입력 스키마(Tweaks)[​](#input-schema "Direct link to Input Schema (tweaks)")

Tweaks는 flow 자체를 영구적으로 수정하는 대신, 런타임에 컴포넌트 파라미터를 일회성으로 오버라이드하는 것입니다.
스크립트에서 tweaks를 사용하는 예시는 [퀵스타트](https://docs.langflow.org/get-started-quickstart)를 참고하세요.

팁

Tweaks는 flow를 더 동적이고 재사용 가능하게 만들어줍니다.

각 애플리케이션에 특정한 tweaks를 각 애플리케이션의 Langflow API 요청에 전달함으로써, 하나의 flow를 만들어 여러 애플리케이션에 사용할 수 있습니다.

**API access** 창에서 **Input Schema**를 클릭하면 flow의 코드 스니펫 요청 페이로드에 `tweaks`를 추가할 수 있습니다.

flow의 **Input Schema**에 대한 변경 사항은 해당 flow의 **API access** 코드 스니펫에 대한 tweaks로만 저장됩니다.
이 tweaks는 [워크스페이스](https://docs.langflow.org/concepts-overview#workspace)에 설정된 flow 파라미터를 변경하지 않으며, 다른 flow에는 적용되지 않습니다.

**Input Schema**를 통해 tweaks를 추가하는 것은 Langflow API 요청에 수동으로 추가한 tweaks의 형식 문제를 해결하는 데 도움이 될 수 있습니다.

예를 들어 다음 curl 명령은 flow의 **Chat Input** 컴포넌트에서 **Store Messages** 설정을 비활성화하는 tweak를 포함합니다.

```
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

### flow ID 별칭 사용하기[​](#use-a-flow-id-alias "Direct link to Use a flow ID alias")

요청에서 실제 flow ID 대신 별칭을 사용하고 싶다면 flow의 `/v1/run/$FLOW_ID` 엔드포인트 이름을 변경할 수 있습니다.

1. Langflow에서 flow를 연 다음 **Share**를 클릭하고 **API access**를 선택합니다.

2. **Input Schema**를 클릭합니다.

3. **Endpoint Name** 필드에 기억하기 쉽고 사람이 읽기 좋은 이름과 같은, flow의 ID에 대한 별칭을 입력합니다.

    이름에는 문자, 숫자, 하이픈, 밑줄만 포함될 수 있으며, 예를 들어 `flow-customer-database-agent`와 같이 사용할 수 있습니다.

4. 변경 사항을 저장하려면 **Input Schema** 창을 닫습니다.

이제 자동으로 생성된 코드 스니펫은 원래 flow ID 대신 새로운 엔드포인트 이름을 사용합니다. 예를 들어 `url = "http://localhost:7868/api/v1/run/flow-customer-database-agent"`와 같습니다.

## 웹사이트에 flow 임베드하기[​](#embedded-chat-widget "Direct link to Embed a flow into a website")

각 flow에 대해 Langflow는 임베드된 채팅 위젯을 통해 flow와 상호작용할 수 있도록 웹사이트 HTML의 `<body>`에 삽입할 수 있는 코드 스니펫을 제공합니다.

필수 컴포넌트

채팅 위젯은 **Chat Input**과 **Chat Output** 컴포넌트를 가진 flow만 지원하며, 이는 채팅 경험을 위해 필수적입니다. **Text Input**과 **Text Output** 컴포넌트도 메시지를 주고받을 수 있지만, 지속적인 LLM 채팅 컨텍스트를 포함하지는 않습니다.

[**Chat Input** 컴포넌트](https://docs.langflow.org/chat-input-and-output)가 없는 flow와 채팅을 시도하면 flow는 트리거되지만, 응답은 단지 입력이 비어있었다는 것만 나타냅니다.

### langflow-chat 스니펫 가져오기[​](#get-a-langflow-chat-snippet "Direct link to Get a langflow-chat snippet")

flow의 임베드된 채팅 위젯 코드 스니펫을 가져오려면 다음을 수행합니다.

1. Langflow에서 임베드하려는 flow를 엽니다.
2. **Share**를 클릭한 다음 **Embed into site**를 선택합니다.
3. 코드 스니펫을 복사해 웹사이트 HTML의 `<body>`에서 사용합니다.
자세한 내용은 [React, Angular, HTML로 채팅 위젯 임베드하기](#embed-the-chat-widget)를 참고하세요.
4. 위젯이 flow를 실행할 권한을 갖도록 `api_key` prop을 추가합니다. [langflow-chat 웹 컴포넌트 구성하기](#configure-the-langflow-chat-web-component)에서 설명한 바와 같습니다.

채팅 위젯은 CDN에서 로드되는 `langflow-chat`이라는 웹 컴포넌트로 구현됩니다. 자세한 내용은 [langflow-embedded-chat 저장소](https://github.com/langflow-ai/langflow-embedded-chat)를 참고하세요.

예를 들어 다음 HTML은 ngrok에 배포된 Langflow 서버에서 호스팅되는 **Basic Prompting** 템플릿 flow에 대한 채팅 위젯을 임베드합니다.

```html
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/gh/langflow-ai/langflow-embedded-chat@main/dist/build/static/js/bundle.min.js"></script>
  </head>
  <body>
    <langflow-chat
      host_url="https://c822-73-64-93-151.ngrok-free.app"
      flow_id="dcbed533-859f-4b99-b1f5-16fce884f28f"
      api_key="$LANGFLOW_API_KEY"
    ></langflow-chat>
  </body>
</html>
```

이 코드가 실제 사이트에 배포되면 반응형 챗봇으로 렌더링됩니다.
사용자가 챗봇과 상호작용하면 입력이 지정된 flow를 트리거하고, 챗봇은 flow 실행의 출력을 반환합니다.

![Default chat widget](https://docs.langflow.org/assets/images/chat-widget-default-50fbdf351e2e984e4103a225be85f9a4.png)

직접 해보기

자신의 flow를 사용하는 임베드된 채팅 위젯의 대화형 라이브 데모는 [Langflow embedded chat CodeSandbox](https://codesandbox.io/p/sandbox/langflow-embedded-chat-example-dv9zpx)를 사용해보세요.
자세한 내용은 [langflow-embedded-chat README](https://github.com/langflow-ai/langflow-embedded-chat?tab=readme-ov-file#live-example)를 참고하세요.

### React, Angular, HTML로 채팅 위젯 임베드하기[​](#embed-the-chat-widget "Direct link to Embed the chat widget with React, Angular, or HTML")

다음 예시는 React, Angular, 일반 HTML에서 임베드된 채팅 위젯을 사용하는 방법을 보여줍니다.

- React
- Angular
- HTML

React 애플리케이션에서 채팅 위젯을 사용하려면 위젯 스크립트를 로드하고 채팅 인터페이스를 렌더링하는 컴포넌트를 생성하세요.

1. 웹 컴포넌트를 선언하고 React 컴포넌트로 캡슐화합니다.

```
//Declaration of langflow-chat web component
declare global {
namespace JSX {
    interface IntrinsicElements {
    "langflow-chat": any;
    }
}
}

//Definition for langflow-chat React component
export default function ChatWidget({ className }) {
return (
    <div className={className}>
    <langflow-chat
        host_url="https://c822-73-64-93-151.ngrok-free.app"
        flow_id="dcbed533-859f-4b99-b1f5-16fce884f28f"
        api_key="$LANGFLOW_API_KEY"
    ></langflow-chat>
    </div>
);
}
```

2. 코드 어디에나 컴포넌트를 배치하여 채팅 위젯을 렌더링합니다.

    다음 예시에서 React 위젯 컴포넌트는 `docs/src/components/ChatWidget/index.tsx`에 위치하며, `index.tsx`는 이전 단계의 선언 및 정의와 함께 CDN에서 채팅 위젯 코드를 로드하는 스크립트를 포함합니다.

```
import React, { useEffect } from 'react';

// Component to load the chat widget script
const ChatScriptLoader = () => {
useEffect(() => {
    if (!document.querySelector('script[src*="langflow-embedded-chat"]')) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/langflow-ai/langflow-embedded-chat@main/dist/build/static/js/bundle.min.js';
    script.async = true;
    document.body.appendChild(script);
    }
}, []);

return null;
};

//Declaration of langflow-chat web component
declare global {
namespace JSX {
    interface IntrinsicElements {
    "langflow-chat": any;
    }
}
}

//Definition for langflow-chat React component
export default function ChatWidget({ className }) {
return (
    <div className={className}>
    <ChatScriptLoader />
    <langflow-chat
        host_url="https://c822-73-64-93-151.ngrok-free.app"
        flow_id="dcbed533-859f-4b99-b1f5-16fce884f28f"
        api_key="$LANGFLOW_API_KEY"
    ></langflow-chat>
    </div>
);
}
```

3. `langflow-chat` React 컴포넌트를 가져와서 페이지에서 사용할 수 있도록 합니다.
다음 import 문을 자신의 React 컴포넌트 이름과 경로로 수정하세요.

```
import ChatWidget from '@site/src/components/ChatWidget';
```

4. 위젯을 표시하려면 페이지의 원하는 위치에서 `langflow-chat` 컴포넌트를 호출합니다.
다음 참조를 자신의 React 컴포넌트 이름과 원하는 `className`으로 수정하세요.

```
<ChatWidget className="my-chat-widget" />
```

- `@NgModule` 데코레이터에서 `schemas` 배열에 `CUSTOM_ELEMENTS_SCHEMA`를 추가합니다.

```
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

@NgModule({
declarations: [
    AppComponent
],
imports: [
    BrowserModule
],
schemas: [CUSTOM_ELEMENTS_SCHEMA],
providers: [],
bootstrap: [AppComponent]
})
export class AppModule { }
```

- 임베드된 채팅 위젯을 사용하려는 `.component.ts` 파일을 편집합니다.

- `@Component` 데코레이터의 `template` 키에 `<langflow-chat>` 엘리먼트를 추가합니다.

```
import { Component } from '@angular/core';

@Component({
selector: 'app-root',
template: `
    <div class="container">
    <h1>Langflow Chat Test</h1>
    <langflow-chat
        host_url="https://c822-73-64-93-151.ngrok-free.app"
        flow_id="dcbed533-859f-4b99-b1f5-16fce884f28f"
        api_key="$LANGFLOW_API_KEY"
    ></langflow-chat>
    </div>
`,
styles: [`
    .container {
    padding: 20px;
    text-align: center;
    }
`]
})
export class AppComponent {
title = 'Langflow Chat Test';
}
```

```html
<head>
<script src="https://cdn.jsdelivr.net/gh/langflow-ai/langflow-embedded-chat@v1.0.7/dist/build/static/js/bundle.min.js"></script>
</head>
<body>
<langflow-chat
host_url="https://c822-73-64-93-151.ngrok-free.app"
flow_id="dcbed533-859f-4b99-b1f5-16fce884f28f"
api_key="$LANGFLOW_API_KEY"
></langflow-chat>
</body>
</html>
```

### langflow-chat 웹 컴포넌트 구성하기[​](#configure-the-langflow-chat-web-component "Direct link to Configure the langflow-chat web component")

HTML에서 임베드된 채팅 위젯을 사용하려면 `langflow-chat` 웹 컴포넌트에 최소한 다음 입력이 포함되어야 합니다(React에서는 *props*라고도 함).

- `host_url`: Langflow 서버 URL. `HTTPS`여야 합니다. 끝에 슬래시(`/`)를 포함하지 마세요.
- `flow_id`: 임베드하려는 flow의 ID.
- `api_key`: [Langflow API 키](https://docs.langflow.org/api-keys-and-authentication). 위젯이 flow를 실행할 권한을 갖도록 이 prop을 사용하는 것을 권장합니다.

Langflow가 생성하는 [**Embed into site** 코드 스니펫](#get-a-langflow-chat-snippet)에는 최소 입력값이 자동으로 채워집니다.

임베드된 채팅 위젯을 수정하기 위해 추가 입력(props)을 사용할 수 있습니다.
전체 props, 타입, 설명 목록은 [langflow-embedded-chat README](https://github.com/langflow-ai/langflow-embedded-chat?tab=readme-ov-file#configuration)를 참고하세요.

**예시: Langflow API 키 prop**

`api_key` prop은 채팅 위젯이 기반 Langflow API 요청을 인증하는 데 사용할 수 있는 Langflow API 키를 저장합니다.

Langflow 팀은 민감한 자격 증명을 다룰 때 업계 모범 사례를 따르는 것을 권장합니다.
예를 들어 API 키를 안전하게 저장한 다음 환경 변수로 조회하세요.

```
<langflow-chat
    host_url="https://c822-73-64-93-151.ngrok-free.app"
    flow_id="dcbed533-859f-4b99-b1f5-16fce884f28f"
    api_key="$LANGFLOW_API_KEY"
></langflow-chat>
```

**예시: 스타일 props**

임베드된 채팅 위젯의 스타일과 위치를 커스터마이즈하기 위해 사용할 수 있는 많은 props가 있습니다.
이 props의 다수는 JSON 타입이며, `langflow-chat` 웹 컴포넌트를 임베드하는 위치에 따라 특정 형식이 필요합니다.

React와 일반 HTML에서 JSON props는 `\{"key":"value"\}`와 같이 JSON 객체나 문자열화된 JSON으로 표현됩니다.

```
<langflow-chat
    host_url="https://c822-73-64-93-151.ngrok-free.app"
    flow_id="dcbed533-859f-4b99-b1f5-16fce884f28f"
    api_key="$LANGFLOW_API_KEY"
    chat_window_style='{
        "backgroundColor": "#1a0d0d",
        "border": "4px solid #b30000",
        "borderRadius": "16px",
        "boxShadow": "0 8px 32px #b30000",
        "color": "#fff",
        "fontFamily": "Georgia, serif",
        "padding": "16px"
    }'
    window_title="Custom Styled Chat"
    height="600"
    width="400"
></langflow-chat>
```

Angular 애플리케이션의 경우 [프로퍼티 바인딩 문법](https://angular.dev/guide/templates/binding#binding-dynamic-properties-and-attributes)을 사용해 JSON props를 JavaScript 객체로 전달하세요. 예를 들면 다음과 같습니다.

```
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <h1>Langflow Chat Test</h1>
      <langflow-chat
        host_url="https://c822-73-64-93-151.ngrok-free.app"
        flow_id="dcbed533-859f-4b99-b1f5-16fce884f28f"
        api_key="$LANGFLOW_API_KEY"
        [chat_window_style]='{"backgroundColor": "#ffffff"}'
        [bot_message_style]='{"color": "#000000"}'
        [user_message_style]='{"color": "#000000"}'
        height="600"
        width="400"
        chat_position="bottom-right"
      ></langflow-chat>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      text-align: center;
    }
  `]
})
export class AppComponent {
  title = 'Langflow Chat Test';
}
```

**예시: Session ID prop**

다음 예시는 임베드된 채팅 위젯이 시작한 flow 실행을 식별하는 데 도움이 되는 커스텀 [session ID](https://docs.langflow.org/session-id)를 추가합니다.

```
<langflow-chat
    host_url="https://c822-73-64-93-151.ngrok-free.app"
    flow_id="dcbed533-859f-4b99-b1f5-16fce884f28f"
    api_key="$LANGFLOW_API_KEY"
    session_id="$SESSION_ID"
></langflow-chat>
```

**예시: Tweaks prop**

`tweaks` prop을 사용해 런타임에 flow 파라미터를 수정합니다.
`tweaks` 객체에 사용 가능한 키는 임베드된 채팅 위젯을 통해 서빙하는 flow에 따라 다릅니다.

React와 일반 HTML에서 `tweaks`는 [`/v1/run/$FLOW_ID`](https://docs.langflow.org/api-flows-run#run-flow)와 같은 Langflow API 엔드포인트에 전달하는 방식과 유사하게 JSON 객체로 선언됩니다. 예를 들면 다음과 같습니다.

```
<langflow-chat
    host_url="https://c822-73-64-93-151.ngrok-free.app"
    flow_id="dcbed533-859f-4b99-b1f5-16fce884f28f"
    api_key="$LANGFLOW_API_KEY"
    tweaks='{
        "model_name": "llama-3.1-8b-instant"
    }'
></langflow-chat>
```

Angular 애플리케이션의 경우 [프로퍼티 바인딩 문법](https://angular.dev/guide/templates/binding#binding-dynamic-properties-and-attributes)을 사용해 JSON props를 JavaScript 객체로 전달하세요. 예를 들면 다음과 같습니다.

```
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <h1>Langflow Chat Test</h1>
      <langflow-chat
        host_url="https://c822-73-64-93-151.ngrok-free.app"
        flow_id="dcbed533-859f-4b99-b1f5-16fce884f28f"
        api_key="$LANGFLOW_API_KEY"
        [tweaks]='{"model_name": "llama-3.1-8b-instant"}'
      ></langflow-chat>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      text-align: center;
    }
  `]
})
export class AppComponent {
  title = 'Langflow Chat Test';
}
```

## Langflow MCP 서버를 통해 flow 서빙하기[​](#serve-flows-through-a-langflow-mcp-server "Direct link to Serve flows through a Langflow MCP server")

각 [Langflow 프로젝트](https://docs.langflow.org/concepts-flows#projects)는 프로젝트의 flow를 [MCP 클라이언트](https://modelcontextprotocol.io/clients)가 응답을 생성하는 데 사용할 수 있는 [도구](https://modelcontextprotocol.io/docs/concepts/tools)로 노출하는 MCP 서버를 가지고 있습니다.

Langflow MCP 서버를 통해 flow를 서빙하는 것 외에도, Langflow 자체를 자신의 Langflow MCP 서버를 포함한 어떤 MCP 서버에든 접근하는 MCP 클라이언트로 사용할 수 있습니다.

Langflow MCP 서버와의 상호작용은 Langflow API의 `/mcp` 엔드포인트를 통해 이뤄집니다.

자세한 내용은 [Langflow를 MCP 서버로 사용하기](https://docs.langflow.org/mcp-server)와 [Langflow를 MCP 클라이언트로 사용하기](https://docs.langflow.org/mcp-client)를 참고하세요.

## OpenAI Responses 호환 엔드포인트로 flow 실행하기[​](#openai-responses-api "Direct link to Run flows with the OpenAI Responses compatible endpoint")

Langflow는 `/api/v1/responses`에서 OpenAI Responses API와 호환되는 엔드포인트를 제공하여, 기존 OpenAI 클라이언트 라이브러리와 코드를 최소한의 수정으로 사용할 수 있게 해줍니다.

자세한 내용은 [OpenAI Responses API](https://docs.langflow.org/api-openai-responses)를 참고하세요.

## 참고 자료[​](#see-also "Direct link to See also")

- [flow 가져오기 및 내보내기](https://docs.langflow.org/concepts-flows-import)
- [Files 엔드포인트](https://docs.langflow.org/api-files)
- [Playground에서 flow 테스트하기](https://docs.langflow.org/concepts-playground)
