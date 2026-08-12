# Webhook

> 원문: https://docs.langflow.org/next/component-webhook

**Webhook** 컴포넌트는 HTTP POST 요청을 받으면 플로우를 실행하는 웹훅 트리거를 정의합니다.

## 웹훅 트리거하기[​](#trigger-the-webhook "Direct link to Trigger the webhook")

플로우에 **Webhook** 컴포넌트를 추가하면 플로우의 [**API Access** 패널](https://docs.langflow.org/concepts-publish#api-access)에 **Webhook curl** 탭이 추가됩니다.
이 탭은 **Webhook** 컴포넌트를 통해 플로우를 트리거하는 데 사용할 수 있는 HTTP POST 요청 코드 스니펫을 자동으로 생성합니다.
예를 들면 다음과 같습니다.

```bash
curl -X POST \
  "http://$LANGFLOW_SERVER_ADDRESS/api/v1/webhook/$FLOW_ID" \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: $LANGFLOW_API_KEY' \
  -d '{"any": "data"}'
```

자세한 내용은 [웹훅으로 플로우 트리거하기](https://docs.langflow.org/webhook)를 참고하세요.

## Webhook 파라미터[​](#webhook-parameters "Direct link to Webhook parameters")

| Name         | Display Name | Description                                                                                                                                                                                                                                                                               |
| ------------ | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data         | Payload      | 입력 파라미터. HTTP POST 요청을 통해 외부 시스템으로부터 페이로드를 받습니다.                                                                                                                                                                                     |
| curl         | curl         | 입력 파라미터. 이 웹훅에 요청을 보낼 때 사용하는 curl 명령어 템플릿입니다.                                                                                                                                                                                           |
| endpoint     | Endpoint     | 입력 파라미터. 이 웹훅이 요청을 받는 엔드포인트 URL입니다.                                                                                                                                                                                                                   |
| output\_data | JSON         | 출력 파라미터. 웹훅 입력에서 처리된 데이터입니다. 입력이 없으면 빈 [`JSON`](https://docs.langflow.org/data-types#json) 객체를 반환합니다. 입력이 유효한 JSON이 아닌 경우, **Webhook** 컴포넌트는 플로우를 트리거하는 입력으로 받아들일 수 있도록 이를 `payload` 객체로 감쌉니다. |
