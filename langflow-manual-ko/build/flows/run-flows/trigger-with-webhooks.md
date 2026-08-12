# 웹훅으로 flow 트리거하기
> 원문: https://docs.langflow.org/next/webhook

**Webhook** 컴포넌트를 사용하면 외부 이벤트에 대한 응답으로 flow 실행을 시작할 수 있습니다.

**Webhook** 컴포넌트를 사용하면 flow가 외부 소스로부터 직접 데이터를 받을 수 있습니다. 그런 다음 flow는 데이터를 파싱하고 이를 flow 내의 다른 컴포넌트로 전달하여 API 호출, 데이터베이스 쓰기, LLM과의 채팅 등 다른 작업을 시작할 수 있습니다.
입력이 유효한 JSON이 아니라면, **Webhook** 컴포넌트는 flow를 트리거하는 입력으로 받아들일 수 있도록 이를 `payload` 객체로 감쌉니다.

**Webhook** 컴포넌트는 flow를 더 이벤트 중심적으로 만들고, 전체 애플리케이션 및 서비스 스택과 통합할 수 있는 다재다능한 진입점을 제공합니다.
예를 들면 다음과 같습니다.

- LLM을 사용해 고객 피드백이나 설문 응답의 감정과 내용을 분석합니다.
- 모니터링 시스템으로부터 알림을 수신하고, 경고 유형과 심각도에 따라 자동화된 대응을 트리거합니다.
- 이커머스 플랫폼과 통합하여 주문을 처리하고 재고를 업데이트합니다.

## Webhook 컴포넌트 구성하기[​](#configure-the-webhook-component "Direct link to Configure the Webhook component")

flow에서 **Webhook** 컴포넌트를 사용하려면 다음을 수행합니다.

1. Langflow에서 **Webhook** 컴포넌트를 사용하려는 flow를 엽니다.

2. flow에 [**Webhook** 컴포넌트](https://docs.langflow.org/webhook)와 [**Parser** 컴포넌트](https://docs.langflow.org/parser)를 추가합니다.

    이 두 컴포넌트는 흔히 함께 짝을 이루는데, **Parser** 컴포넌트가 **Webhook** 컴포넌트가 받은 원시 페이로드에서 관련 데이터를 추출하기 때문입니다.

3. **Webhook** 컴포넌트의 **Data** 출력을 **Parser** 컴포넌트의 **Data** 입력에 연결합니다.

4. **Parser** 컴포넌트의 **Template** 필드에 원시 페이로드를 구조화된 텍스트로 파싱하기 위한 템플릿을 입력합니다.

    템플릿에서는 [**Prompt Template** 컴포넌트](https://docs.langflow.org/components-prompts)에서 변수를 정의하는 것과 같은 방식으로 페이로드 키에 대한 변수를 사용합니다.

    예를 들어 **Webhook** 컴포넌트가 다음 JSON 데이터를 받을 것으로 예상한다고 가정합니다.

```
{
  "id": "",
  "name": "",
  "email": ""
}
```
    그런 다음 파서 템플릿 어디에서든 [중괄호를 사용](https://docs.langflow.org/components-prompts#define-variables-in-prompts)해 JSON 키를 참조할 수 있습니다.

```
ID: {id} - Name: {name} - Email: {email}
```

5. **Parser** 컴포넌트의 **Parsed Text** 출력을 flow의 **Chat Input** 컴포넌트와 같은 다음 논리적 컴포넌트에 연결합니다.

    **Webhook**과 **Parser** 컴포넌트만 테스트하고 싶다면 **Parsed Text** 출력을 **Chat Output** 컴포넌트의 **Text** 입력에 직접 연결할 수 있습니다. 그러면 flow를 실행한 후 **Playground**에서 파싱된 데이터를 확인할 수 있습니다.

6. **Webhook** 컴포넌트의 **Endpoint** 필드에서 **Webhook** 컴포넌트에 데이터를 전송하고 flow를 트리거하는 데 사용할 API 엔드포인트를 복사합니다.

    또는 완전한 `POST /v1/webhook/$FLOW_ID` 코드 스니펫을 얻으려면 flow의 [**API access** 창](https://docs.langflow.org/concepts-publish#api-access)을 열고 **Webhook curl** 탭을 클릭하세요.
**Webhook** 컴포넌트의 **curl** 필드에서 기본 curl 명령을 수정할 수도 있습니다.
이 필드가 기본적으로 보이지 않는다면 **Webhook** 컴포넌트를 클릭해 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-menus)을 노출하세요.

7. `data`가 포함된 POST 요청을 flow의 `webhook` 엔드포인트로 전송해 flow를 트리거합니다.

    다음 예시는 `id`, `name`, `email` 문자열을 포함하는 페이로드를 전송합니다.

```
curl -X POST "http://localhost:7860/api/v1/webhook/FLOW_ID" \
    -H "Content-Type: application/json" \
    -H "x-api-key: LANGFLOW_API_KEY" \
    -d '{"id": "12345", "name": "alex", "email": "alex@email.com"}'
```
    성공적인 응답은 Langflow가 flow를 시작했음을 나타냅니다.
응답에는 flow 전체의 출력이 포함되지 않으며, flow가 시작되었다는 표시만 포함됩니다.

```
{
  "message": "Task started in the background",
  "status": "in progress"
}
```

8. flow에서 가장 최근에 파싱된 페이로드를 보려면 **Parser** 컴포넌트를 클릭한 다음 **Inspect output**을 클릭합니다.
앞의 예시에서 파싱된 페이로드는 `ID: 12345 - Name: alex - Email: alex@email.com`과 같은 문자열이 됩니다.

## Composio 웹훅으로 flow 트리거하기[​](#trigger-flows-with-composio-webhooks "Direct link to Trigger flows with Composio webhooks")

일반적으로 **Webhook** 컴포넌트를 수동으로 트리거하지는 않습니다.
외부 애플리케이션의 페이로드로 flow를 트리거하는 방법을 알아보려면 비디오 튜토리얼 [How to Use Webhooks in Langflow](https://www.youtube.com/watch?v=IC1CAtzFRE0)를 참고하세요.

## 웹훅에 인증 요구하기[​](#require-authentication-for-webhooks "Direct link to Require authentication for webhooks")

기본적으로 웹훅은 API 키 인증을 요구합니다(`LANGFLOW_WEBHOOK_AUTH_ENABLE=True`).

웹훅이 인증 없이 실행되도록 허용하려면(권장하지 않으며, 신뢰할 수 있는 환경에서만 사용) Langflow `.env` 파일에서 `LANGFLOW_WEBHOOK_AUTH_ENABLE=False`로 설정하세요. 비활성화하면 웹훅 엔드포인트에 대한 요청은 flow 소유자가 보낸 것으로 처리됩니다.

웹훅 인증이 활성화되어 있다면 각 웹훅 요청과 함께 Langflow API 키를 제공해야 합니다.

요청에 API 키를 HTTP 헤더로 포함하려면 다음과 같이 합니다.

```
curl -X POST "http://LANGFLOW_SERVER_ADDRESS/api/v1/webhook/FLOW_ID" \
    -H "Content-Type: application/json" \
    -H "x-api-key: LANGFLOW_API_KEY" \
    -d '{"id": "12345", "name": "alex", "email": "alex@email.com"}'
```

요청에 API 키를 쿼리 파라미터로 포함하려면 다음과 같이 합니다.

```
curl -X POST "http://LANGFLOW_SERVER_ADDRESS/api/v1/webhook/FLOW_ID?x-api-key=LANGFLOW_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"id": "12345", "name": "alex", "email": "alex@email.com"}'
```

`LANGFLOW_SERVER_ADDRESS`, `FLOW_ID`, `LANGFLOW_API_KEY`를 배포 환경의 값으로 대체하세요.

자세한 내용은 [API 키와 인증](https://docs.langflow.org/api-keys-and-authentication)을 참고하세요.

## Webhook 컴포넌트가 있는 flow 문제 해결하기[​](#troubleshoot-flows-with-webhook-components "Direct link to Troubleshoot flows with Webhook components")

**Webhook** 컴포넌트에서 발생할 수 있는 일반적인 문제를 해결하는 데 다음 정보를 활용하세요.

### Webhook 컴포넌트가 받은 데이터 검증하기[​](#validate-data-received-by-the-webhook-component "Direct link to Validate data received by the Webhook component")

**Webhook** 컴포넌트가 있는 flow를 문제 해결하고 컴포넌트가 데이터를 받고 있는지 확인하려면, 파싱된 페이로드만 출력하는 작은 flow를 만들 수 있습니다.

1. **Webhook**, **Parser**, **Chat Output** 컴포넌트로 flow를 생성합니다.

2. **Webhook** 컴포넌트의 **Data** 출력을 **Parser** 컴포넌트의 **Data** 입력에 연결합니다.

3. **Parser** 컴포넌트의 **Parsed Text** 출력을 **Chat Output** 컴포넌트의 **Text** 입력에 연결합니다.

4. **Parser** 컴포넌트를 편집해 **Mode**를 **Stringify**로 설정합니다.

    이 모드는 **Webhook** 컴포넌트가 받은 데이터를 **Chat Output** 컴포넌트가 출력하는 문자열로 전달합니다.

5. **Share**를 클릭하고 **API access**를 선택한 다음 **Webhook curl** 코드 스니펫을 복사합니다.

6. 선택사항: 다른 페이로드를 전달하고 싶다면 코드 스니펫의 `data`를 편집합니다.

7. flow를 트리거하기 위해 POST 요청을 전송합니다.

8. **Chat Output** 컴포넌트가 POST 요청의 JSON 데이터를 출력했는지 확인하려면 **Playground**를 클릭합니다.

### Parser 컴포넌트 빌드 실패[​](#parser-component-build-failure "Direct link to Parser component build failure")

**Parser** 컴포넌트는 **Webhook** 컴포넌트로부터 데이터를 받지 못하거나 들어오는 데이터에 문제가 있으면 빌드에 실패할 수 있습니다.

이런 일이 발생하면 **Parser** 컴포넌트의 **Mode**를 **Stringify**로 변경해 컴포넌트가 파싱된 페이로드를 단일 문자열로 출력하도록 시도해보세요.
그런 다음 문자열 출력을 검사해 파싱 템플릿을 문제 해결하거나, 파싱된 데이터를 문자열 형태로 다룰 수 있습니다.

## 참고 자료[​](#see-also "Direct link to See also")

- [Langflow API 시작하기](https://docs.langflow.org/api-reference-api-examples)
- [**Webhook** 컴포넌트](https://docs.langflow.org/webhook)
- [flow 트리거 엔드포인트](https://docs.langflow.org/api-flows-run)
