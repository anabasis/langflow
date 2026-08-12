# Human Input

> 원문: https://docs.langflow.org/next/human-input

**Human Input** 컴포넌트는 사람이 콘텐츠를 검토하고 작업을 선택할 수 있도록 플로우를 일시 중지합니다. 설정된 각 **User Action**은 하나의 분기 출력이 됩니다.
사람이 결정을 내리면 플로우는 선택된 분기에서만 계속 진행됩니다.

## 플로우에서 Human Input 컴포넌트 사용하기[​](#use-the-human-input-component-in-a-flow "Direct link to Use the Human Input component in a flow")

이 예제는 **Approve**와 **Reject** 분기로 플로우를 게이트합니다.

1. **Flow Controls**에서 **Human Input** 컴포넌트를 추가합니다.
2. **Form Content**에 사람 검토자에게 보여줄 텍스트를 입력합니다. 예: `Review this summary before it is sent to the customer.`
3. **User Actions**에서 기본값인 **Approve**와 **Reject**를 그대로 둡니다.
선택적으로 **Escalate**와 같은 사용자 지정 라벨을 추가할 수 있습니다.
각 작업은 컴포넌트에 그에 대응하는 출력 핸들을 추가합니다.
4. **Approve** 출력을 요청이 승인되었을 때 실행할 컴포넌트에 연결합니다.
5. **Reject** 출력을 거부 사유를 설명하는 [**Chat Output** 컴포넌트](https://docs.langflow.org/next/chat-input-and-output)와 같은 대체 경로에 연결합니다.
6. **Playground**에서 플로우를 실행합니다. 실행이 **Human Input** 노드에 도달하면 승인 패널에서 작업을 선택하여 플로우를 재개합니다.

tip

각 **User Action** 라벨은 API 재개 요청에서 고정된 `action_id`에 매핑됩니다. 예를 들어 `Request Changes`는 `request_changes`가 됩니다.

### 타임아웃 및 폴백 설정하기[​](#configure-timeouts-and-fallback "Direct link to Configure timeouts and fallback")

폴백을 활성화하면 컴포넌트에 새로운 출력 핸들이 생성됩니다.
설정된 타임아웃 이전에 결정이 내려지지 않으면 Langflow는 이 **Fallback** 출력으로 라우팅합니다.

응답이 없는 요청을 처리하려면 다음을 수행하세요.

1. [컴포넌트 검사 패널](https://docs.langflow.org/next/concepts-components#component-menus)에서 **Enable Fallback**을 선택합니다.
2. **Timeout** 시간을 설정합니다.
3. **Fallback** 출력을 타임아웃이 만료되었을 때 실행되어야 하는 로직에 연결합니다.

## Human Input 파라미터[​](#human-input-parameters "Direct link to Human Input parameters")

| Name               | Display name    | Description                                                                                       |
| ------------------ | --------------- | ------------------------------------------------------------------------------------------------- |
| `prompt`           | Form Content    | 검토를 위해 사람에게 표시되는 콘텐츠입니다.                                                            |
| `decisions`        | User Actions    | 사람이 선택할 수 있는 작업입니다. 각 작업은 컴포넌트 분기 출력이 됩니다.                      |
| `timeout`          | Timeout         | **Enable Fallback**이 켜져 있을 때, 폴백 경로로 넘어가기 전 응답을 기다리는 시간입니다.  |
| `enable_​fallback` | Enable Fallback | 활성화하면, 타임아웃 내에 사용자 작업이 응답되지 않았을 때 사용되는 **Fallback** 출력이 추가됩니다. |

기본적으로 일부 파라미터는 시각적 편집기에서 숨겨져 있습니다.
컴포넌트를 선택했을 때 표시되는 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-inspection-panel)을 통해 모든 컴포넌트 파라미터를 수정할 수 있습니다.

## 플로우에서 HITL 사용하기[​](#use-hitl-in-a-flow "Direct link to Use HITL in a flow")

동영상 예제는 [Langflow 1.11 릴리스 블로그](https://www.langflow.org/blog/langflow-1-11)를 참고하세요.

## 참고 항목[​](#see-also "Direct link to See also")

- [Human-in-the-Loop](https://docs.langflow.org/next/human-in-the-loop)
- [If-Else](https://docs.langflow.org/next/if-else)
- [Workflow API (Beta)](https://docs.langflow.org/next/workflow-api)
