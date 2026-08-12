# A2A 에이전트

> 원문: https://docs.langflow.org/next/a2a-agent-component

팁

Langflow 1.11.x부터 A2A 지원 기능은 기본적으로 **꺼져** 있습니다. 활성화하려면 Langflow를 시작하기 전에 다음 환경 변수를 설정하세요.

```bash
LANGFLOW_A2A_ENABLED=true  
```

`LANGFLOW_A2A_ENABLED`는 Langflow의 A2A 서버 엔드포인트를 활성화합니다. [Langflow 플로우를 A2A 에이전트로 게시](https://docs.langflow.org/next/a2a-server#publish-a-flow-as-an-a2a-agent)하거나, 게시된 해당 플로우를 호출하기 위해 **Internal** 모드를 사용할 때 이 변수를 설정해야 합니다. **External** 모드로 원격 에이전트를 호출하는 경우에는 이 변수가 필요하지 **않습니다**.

**A2A Agent** 컴포넌트는 [Agent2Agent(A2A)](https://a2a-protocol.org/) 에이전트를 호출하고 그 응답을 반환합니다.

동일한 Langflow [프로젝트](https://docs.langflow.org/concepts-flows#projects) 내에 게시된 A2A 에이전트 플로우를 호출하려면 **Internal** 모드를 사용하고, 게시된 URL로 원격 A2A 에이전트를 호출하려면 **External** 모드를 사용합니다.

Langflow 플로우 게시에 대한 자세한 내용은 [플로우를 A2A 에이전트로 게시](https://docs.langflow.org/next/a2a-server#publish-a-flow-as-an-a2a-agent)를 참조하세요.

## 플로우에서 Internal 모드 사용하기[​](#use-internal-mode-in-a-flow "Direct link to Use Internal mode in a flow")

1. 플로우에 **A2A Agent** 컴포넌트를 추가합니다.
2. **A2A Agent** 컴포넌트에서 **Mode**를 **Internal**로 설정합니다.
3. **Agent**에서 Langflow [프로젝트](https://docs.langflow.org/concepts-flows#projects) 내에 게시된 A2A 에이전트 플로우를 선택합니다. 해당 플로우에는 [**Chat Input** 및 **Chat Output** 컴포넌트](https://docs.langflow.org/next/chat-input-and-output)가 있어야 합니다. 자세한 내용은 [플로우를 A2A 에이전트로 게시](https://docs.langflow.org/next/a2a-server#publish-a-flow-as-an-a2a-agent)를 참조하세요.
4. [**Chat Input** 컴포넌트](https://docs.langflow.org/next/chat-input-and-output#chat-input)를 **A2A Agent** 컴포넌트의 **Message** 입력에 연결합니다.
5. **Response** 출력을 [**Chat Output** 컴포넌트](https://docs.langflow.org/next/chat-input-and-output#chat-output)와 같은 플로우 내 다음 컴포넌트에 연결합니다.

## 플로우에서 External 모드 사용하기[​](#use-external-mode-in-a-flow "Direct link to Use External mode in a flow")

1. 플로우에 **A2A Agent** 컴포넌트를 추가합니다.
2. **A2A Agent** 컴포넌트에서 **Mode**를 **External**로 설정합니다.
3. **Agent URL** 필드에 원격 에이전트의 기본 URL을 입력합니다.
또는 **Agent URL** 필드에 에이전트의 `/.well-known/agent-card.json` 카드 URL을 입력할 수도 있습니다.
두 옵션 모두 동일한 에이전트로 확인됩니다.
URL이 카드를 반환하면, 컴포넌트는 읽기 전용 **Agent card** 미리보기를 표시합니다.
4. 선택 사항: 원격 에이전트가 `x-api-key` 인증을 요구하는 경우, **API Key** 필드에 API 키를 입력하거나 [전역 변수](https://docs.langflow.org/next/configuration-global-variables)를 사용하세요.
5. [**Chat Input** 컴포넌트](https://docs.langflow.org/next/chat-input-and-output#chat-input)를 **A2A Agent** 컴포넌트의 **Message** 입력에 연결합니다.
6. **Response** 출력을 [**Chat Output** 컴포넌트](https://docs.langflow.org/next/chat-input-and-output#chat-output)와 같은 플로우 내 다음 컴포넌트에 연결합니다.

### 로컬 및 사설 에이전트 URL[​](#local-and-private-agent-urls "Direct link to Local and private agent URLs")

Langflow는 기본적으로 [SSRF 보호](https://docs.langflow.org/next/api-keys-and-authentication#ssrf-protection)를 활성화합니다.
`localhost`, `127.0.0.1`, `::1`과 같은 루프백 및 사설 주소는 허용하지 않는 한 차단됩니다.

원격 에이전트 URL이 `http://localhost:7862`의 다른 Langflow 인스턴스와 같은 로컬 또는 사설 호스트를 가리킨다면, **A2A Agent** 컴포넌트를 실행하는 Langflow 인스턴스에서 `LANGFLOW_SSRF_ALLOWED_HOSTS`를 설정하세요. 허용 목록에는 전체 URL이 아니라 호스트 이름을 입력해야 합니다. 예를 들면 다음과 같습니다.

```bash
export LANGFLOW_SSRF_ALLOWED_HOSTS=localhost,127.0.0.1  
```

변수를 변경한 후에는 Langflow를 재시작하세요.

자세한 내용은 [SSRF 보호](https://docs.langflow.org/next/api-keys-and-authentication#ssrf-protection)를 참조하세요.

## A2A Agent 매개변수[​](#a2a-agent-parameters "Direct link to A2A Agent parameters")

| 이름                  | 유형          | 설명                                                                                                                                                     |
| --------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| mode                  | Tab           | 입력 매개변수. **Internal**은 이 프로젝트 내 다른 에이전트 플로우를 호출합니다. **External**은 URL로 원격 A2A 에이전트를 호출합니다. 기본값: `External`.                      |
| agent\_name\_selected | Dropdown      | 입력 매개변수. **Internal** 모드 전용. 이 프로젝트 내 에이전트 플로우([**Chat Input** 및 **Chat Output** 컴포넌트](https://docs.langflow.org/next/chat-input-and-output)를 갖춘 것). |
| agent\_url            | String        | 입력 매개변수. **External** 모드 전용. 원격 A2A 에이전트의 기본 URL 또는 `/.well-known/agent-card.json` 카드 URL.                                            |
| agent\_card           | Data display  | 입력 매개변수. **External** 모드 전용. 원격 에이전트가 공개한 카드의 읽기 전용 미리보기. URL이 카드를 반환하면 표시됩니다.                          |
| input\_value          | String        | 입력 매개변수. 에이전트에게 전송할 메시지입니다. **Tool Mode**를 지원합니다.                                                                                                      |
| api\_key              | Secret string | 입력 매개변수. **External** 모드 전용. 인증이 필요한 에이전트를 위해 `x-api-key`로 전송되는 선택적 API 키.                                                       |
| timeout               | Integer       | 입력 매개변수. **External** 모드 전용. 에이전트의 응답을 기다리는 최대 시간(초). 기본값: `60`.                                                          |
| response              | Message       | 출력 매개변수. 에이전트의 응답 텍스트입니다.                                                                                                                       |

## 참고 자료[​](#see-also "Direct link to See also")

- [Langflow를 A2A 에이전트로 사용하기](https://docs.langflow.org/next/a2a-server)
- [SSRF 보호](https://docs.langflow.org/next/api-keys-and-authentication#ssrf-protection)
- [Agent2Agent 프로토콜](https://a2a-protocol.org/)
