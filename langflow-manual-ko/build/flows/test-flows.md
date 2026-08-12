# Playground에서 flow 테스트하기
> 원문: https://docs.langflow.org/next/concepts-playground

Langflow의 **Playground**는 LLM 기반 flow를 실시간으로 테스트할 수 있는 동적 인터페이스입니다.

flow가 다양한 입력에 어떻게 응답하는지 테스트하고, 메모리를 검토 및 수정하고, flow의 출력과 로직을 모니터링할 수 있습니다.
예를 들어 에이전트 flow가 다양한 입력에 응답할 때 적절한 도구를 사용하는지 확인할 수 있습니다.

**Playground**를 사용하면 flow의 로직과 동작을 빠르게 반복할 수 있어 애플리케이션을 프로토타이핑하고 다듬기가 더 쉬워집니다.

## Playground에서 flow 실행하기[​](#run-a-flow-in-the-playground "Direct link to Run a flow in the Playground")

**Playground**에서 flow를 실행하려면 flow를 연 다음 **Playground**를 클릭합니다.
그런 다음 flow에 [**Chat Input** 컴포넌트](https://docs.langflow.org/chat-input-and-output)가 있다면 프롬프트를 입력하거나 [음성 모드를 사용](https://docs.langflow.org/concepts-voice-mode)해 flow를 트리거하고 채팅 세션을 시작합니다.

**Playground** 화면을 확대하려면 **Playground** 패널 안에서 **Enter fullscreen**을 클릭하세요.

![The Langflow visual builder with the Playground active](https://docs.langflow.org/assets/images/playground-34f869f8763b3c69ddcd4d365c96d0e6.png)

팁

**Playground**에 메시지 입력 필드가 없다면, flow에 **Language Model** 또는 **Agent** 컴포넌트의 **Input** 포트에 직접 또는 간접적으로 연결된 **Chat Input** 컴포넌트가 있는지 확인하세요.

**Playground**는 챗봇이나 에이전트처럼 LLM을 쿼리-응답 형식으로 사용하는 flow를 위해 설계되었으므로, **Playground** 채팅 인터페이스에서 완전히 지원되려면 flow에 **Chat Input**, **Language Model**/**Agent**, **Chat Output** 컴포넌트가 있어야 합니다.

웹훅 이벤트, 파일 업로드, 텍스트 입력 등 다른 유형의 입력이 필요한 flow의 경우, [Langflow API를 사용해 flow를 트리거](https://docs.langflow.org/api-flows-run)한 다음 **Playground**를 열어 해당되는 경우 flow 실행의 LLM 활동을 검토할 수 있습니다.

![Playground window](https://docs.langflow.org/assets/images/playground-34f869f8763b3c69ddcd4d365c96d0e6.png)

**Playground**의 동작 방식에 대한 기술적 세부사항은 [모니터 엔드포인트](https://docs.langflow.org/api-monitor)를 참고하세요.

### 에이전트 로직 검토하기[​](#review-agent-logic "Direct link to Review agent logic")

flow에 **Agent** 컴포넌트가 있다면 **Playground**는 에이전트가 사용한 도구와 각 도구의 출력을 출력합니다.
이는 에이전트의 도구 사용을 모니터링하고 에이전트 응답 뒤에 숨겨진 로직을 이해하는 데 도움이 됩니다.
예를 들어 다음 에이전트는 웹 검색을 수행하기 위해 연결된 `fetch_content` 도구를 사용했습니다.

![Playground with agent response](https://docs.langflow.org/assets/images/playground-with-agent-56fa39130f9a50d376ba5a226ae254f0.png)

### 채팅 기록 보기[​](#view-chat-history "Direct link to View chat history")

**Playground**에서는 타임스탬프, 내용, 발신자를 포함해 flow의 각 채팅 세션에 대한 메시지 로그를 볼 수 있습니다.

**Playground** 사이드바에서 검토하려는 채팅 세션을 찾고, **Options**를 클릭한 다음 **Message Logs**를 선택하세요.

![Playground logs](https://docs.langflow.org/assets/images/messages-logs-0253cad77c1fb946dc1e2f0fe239261f.png)

메시지 로그는 각 채팅 메시지에 대한 [`Message` 데이터](https://docs.langflow.org/data-types#message)를 분해해서 보여줍니다.
메시지 로그의 어떤 셀이든 클릭하면 해당 셀의 전체 내용을 볼 수 있습니다.

### Playground에서 메모리 수정하기[​](#modify-memories-in-the-playground "Direct link to Modify memories in the Playground")

flow를 디버그하고 테스트하는 데 도움이 되도록 [메시지 로그](#view-chat-history)에서 개별 메시지를 편집하거나 삭제할 수 있습니다.
예를 들어, 더 이상 flow의 일부가 아닌 컴포넌트를 테스트하는 동안 보낸 메시지를 삭제하고 싶을 수 있습니다.

사이드바에서 채팅 세션 전체를 삭제할 수도 있습니다. **Options**를 클릭한 다음 **Delete**를 선택하세요.

메모리를 수정하면 채팅 세션을 계속하거나 여러 채팅 세션에 걸쳐 메모리를 유지할 경우 챗봇 응답의 동작에 영향을 미칩니다.

**메시지 로그를 편집하면 기본 채팅 메모리 저장소인 Langflow의 내부 `messages` 테이블을 편집하게 됩니다.** Langflow에서 세션과 채팅 메모리를 관리하는 방법에 대한 자세한 내용은 [커스텀 세션 ID 사용하기](#session-ids)와 [메모리 관리 옵션](https://docs.langflow.org/memory)을 참고하세요.

## 커스텀 세션 ID 설정하기[​](#session-ids "Direct link to Set custom session IDs")

채팅 세션은 flow 실행에 대한 고유 식별자인 세션 ID(`session_id`)로 식별됩니다.

기본 세션 ID는 flow ID이며, 이는 flow의 모든 채팅 메시지가 하나의 거대한 채팅 세션으로서 동일한 세션 ID 아래 저장됨을 의미합니다.

여러 flow 실행에 걸쳐 채팅 컨텍스트를 유지하거나 flow를 디버깅할 때 채팅 세션을 구분해야 한다면, 커스텀 `session_id`를 설정할 수 있습니다.

커스텀 세션 ID는 여러 이유로 유용합니다.

- 하나의 flow가 여러 채팅 세션을 갖는 상황(예: 여러 사용자와의 상호작용을 동시에 처리하는 챗봇)에서 채팅 세션을 분리합니다.
- 여러 flow 실행에 걸쳐 채팅 세션을 계속하거나, 한 flow에서 다른 flow로 컨텍스트를 전달할 때 메모리를 유지합니다.
- 동일한 flow 내에서 여러 사용자의 활동을 구분합니다.
- flow를 디버깅하고 테스트할 때 자신의 채팅 세션을 식별합니다.

시각적 편집기와 프로그래밍 방식 모두에서 커스텀 세션 ID를 설정할 수 있습니다.

- 시각적 편집기
- Langflow API

[입력 및 출력 컴포넌트](https://docs.langflow.org/chat-input-and-output)에서 **Session ID** 필드를 사용하세요.

1. 커스텀 세션 ID를 설정하려는 컴포넌트를 클릭합니다.
2. [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-menus)에서 **Session ID**를 활성화합니다.
3. **Close**를 클릭합니다.
4. 커스텀 세션 ID를 입력합니다.
필드가 비어있으면 flow는 기본 세션 ID를 사용합니다.
5. 커스텀 세션 ID로 채팅을 시작하려면 **Playground**를 엽니다.

새 채팅 세션을 시작하거나 다른 세션 ID로 이전 채팅 세션을 계속하려는 경우 **Session ID**를 변경해야 합니다.

```
-H "Content-Type: application/json" \
-H "x-api-key: $LANGFLOW_API_KEY" \
-d '{
"session_id": "CUSTOM_SESSION_ID",
"input_value": "message",
"input_type": "chat",
"output_type": "chat"
}'
```

이 명령은 지정된 `session_id`로 새로운 채팅 세션을 시작하거나, 해당 ID를 가진 기존 세션이 있다면 그 세션을 가져옵니다.

팁

프로덕션 환경에서는 하드코딩된 값보다 세션 ID에 변수를 사용하는 것을 고려하세요.

예를 들어 인증된 사용자를 위한 컨텍스트를 유지하고 싶다면, 사용자 ID가 세션 ID로 유용한 변수가 될 수 있습니다.
또는 모든 채팅을 고유하게 만들고 싶다면, 각 세션 ID에 대해 UUID를 자동으로 생성하고 싶을 수 있습니다.

자세한 내용은 [세션 ID를 사용해 컴포넌트 간 통신 관리하기](https://docs.langflow.org/session-id)를 참고하세요.

## flow의 Playground 공유하기[​](#share-a-flows-playground "Direct link to Share a flow's Playground")

경고

**Shareable Playground**는 테스트 목적으로만 사용됩니다.
**Playground**는 애플리케이션에 flow를 임베드하기 위한 것이 아닙니다. 애플리케이션이나 웹사이트에서 flow를 실행하는 방법에 대한 정보는 [Langflow API로 flow 트리거하기](https://docs.langflow.org/concepts-publish)를 참고하세요.

**Shareable Playground**는 Langflow Desktop에서는 사용할 수 없습니다.

**Shareable Playground** 옵션은 단일 flow에 대한 **Playground**를 `/public_flow/$FLOW_ID` 엔드포인트에 노출합니다.

[퍼블릭 Langflow 서버를 배포](https://docs.langflow.org/deployment-overview)한 후, 이 퍼블릭 URL을 다른 사용자와 공유하여 지정된 flow의 **Playground**에만 접근하도록 허용할 수 있습니다.
사용자는 Langflow를 설치하거나 Langflow API 키를 생성하지 않고도 flow의 채팅 입력과 출력을 사용하고 결과를 볼 수 있습니다.

다른 사용자와 flow의 **Playground**를 공유하려면 다음을 수행합니다.

1. Langflow에서 공유하려는 flow를 엽니다.
2. [워크스페이스](https://docs.langflow.org/concepts-overview#workspace)에서 **Share**를 클릭한 다음 **Shareable Playground**를 활성화합니다.
3. **Shareable Playground**를 다시 클릭해 **Playground** 창을 엽니다.
이 창의 URL이 flow의 **Shareable Playground** 주소입니다. 예를 들어 `https://3f7c-73-64-93-151.ngrok-free.app/playground/d764c4b8-5cec-4c0f-9de0-4b419b11901a`와 같습니다.
4. URL을 다른 사용자에게 보내 flow의 **Playground**에 대한 접근 권한을 부여합니다.

## 참고 자료[​](#see-also "Direct link to See also")

- [이미지 업로드하기](https://docs.langflow.org/concepts-file-management#upload-images)
- [음성 모드 사용하기](https://docs.langflow.org/concepts-voice-mode)
- [Langflow API로 flow 트리거하기](https://docs.langflow.org/concepts-publish)
- [세션 ID](https://docs.langflow.org/session-id)
