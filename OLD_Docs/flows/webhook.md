# 웹훅으로 플로우 트리거

**Webhook** 컴포넌트를 사용하여 외부 이벤트에 응답하여 플로우 실행을 시작할 수 있습니다.

**Webhook** 컴포넌트를 사용하면 플로우가 외부 소스에서 데이터를 직접 수신할 수 있습니다. 그런 다음 플로우는 데이터를 파싱하여 플로우의 다른 컴포넌트로 전달하여 API 호출, 데이터베이스 쓰기, LLM과의 채팅 등 다른 액션을 시작할 수 있습니다. 입력이 유효한 JSON이 아닌 경우 **Webhook** 컴포넌트는 플로우를 트리거하는 입력으로 수락될 수 있도록 `payload` 객체에 래핑합니다.

**Webhook** 컴포넌트 활용 예시:
- LLM을 사용하여 고객 피드백이나 설문 조사 응답의 감정과 내용을 분석합니다.
- 모니터링 시스템에서 알림을 받은 다음, 알림 유형 및 심각도에 따라 자동화된 응답을 트리거합니다.
- 전자 상거래 플랫폼과 통합하여 주문을 처리하고 재고를 업데이트합니다.

---

## Webhook 컴포넌트 구성

플로우에서 **Webhook** 컴포넌트를 사용하려면:

1. Langflow에서 **Webhook** 컴포넌트를 사용할 플로우를 엽니다.

2. 플로우에 **Webhook** 컴포넌트와 **Parser** 컴포넌트를 추가합니다.

   이 두 컴포넌트는 **Parser** 컴포넌트가 **Webhook** 컴포넌트에서 받은 원시 페이로드에서 관련 데이터를 추출하기 때문에 일반적으로 함께 사용됩니다.

3. **Webhook** 컴포넌트의 **Data** 출력을 **Parser** 컴포넌트의 **Data** 입력에 연결합니다.

4. **Parser** 컴포넌트의 **Template** 필드에 원시 페이로드를 구조화된 텍스트로 파싱하는 템플릿을 입력합니다.

   템플릿에서 **Prompt Template** 컴포넌트에서 변수를 정의하는 것과 같은 방식으로 페이로드 키에 대한 변수를 사용합니다.

   예를 들어 **Webhook** 컴포넌트가 다음 JSON 데이터를 수신할 것으로 예상하는 경우:

   ```json
   {
     "id": "",
     "name": "",
     "email": ""
   }
   ```

   파서 템플릿에서 JSON 키를 중괄호를 사용하여 참조할 수 있습니다:

   ```
   ID: {id} - Name: {name} - Email: {email}
   ```

5. **Parser** 컴포넌트의 **Parsed Text** 출력을 **Chat Input** 컴포넌트와 같이 플로우의 다음 논리적 컴포넌트에 연결합니다.

6. **Webhook** 컴포넌트의 **Endpoint** 필드에서 데이터를 **Webhook** 컴포넌트에 보내고 플로우를 트리거하는 데 사용할 API 엔드포인트를 복사합니다.

7. `id`, `name`, `email` 문자열이 포함된 페이로드를 보내 플로우를 트리거하는 POST 요청을 전송합니다:

   ```bash
   curl -X POST "http://localhost:7860/api/v1/webhook/FLOW_ID" \
       -H "Content-Type: application/json" \
       -H "x-api-key: LANGFLOW_API_KEY" \
       -d '{"id": "12345", "name": "alex", "email": "alex@email.com"}'
   ```

   성공적인 응답은 Langflow가 플로우를 시작했음을 나타냅니다:

   ```json
   {
     "message": "Task started in the background",
     "status": "in progress"
   }
   ```

8. 플로우의 최근 파싱된 페이로드를 보려면 **Parser** 컴포넌트를 클릭하고 **Inspect output**을 클릭합니다.

---

## 웹훅 인증 요구

기본적으로 웹훅은 API 키 인증이 필요합니다 (`LANGFLOW_WEBHOOK_AUTH_ENABLE=True`).

웹훅이 인증 없이 실행되도록 허용하려면(권장하지 않음; 신뢰할 수 있는 환경에서만 사용) Langflow `.env` 파일에서 `LANGFLOW_WEBHOOK_AUTH_ENABLE=False`를 설정합니다.

웹훅 인증이 활성화된 경우 각 웹훅 요청에 Langflow API 키를 제공해야 합니다.

**HTTP 헤더로 API 키 포함:**

```bash
curl -X POST "http://LANGFLOW_SERVER_ADDRESS/api/v1/webhook/FLOW_ID" \
    -H "Content-Type: application/json" \
    -H "x-api-key: LANGFLOW_API_KEY" \
    -d '{"id": "12345", "name": "alex", "email": "alex@email.com"}'
```

**쿼리 파라미터로 API 키 포함:**

```bash
curl -X POST "http://LANGFLOW_SERVER_ADDRESS/api/v1/webhook/FLOW_ID?x-api-key=LANGFLOW_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"id": "12345", "name": "alex", "email": "alex@email.com"}'
```

---

## Webhook 컴포넌트가 있는 플로우 문제 해결

### Webhook 컴포넌트가 받은 데이터 검증

**Webhook** 컴포넌트가 있는 플로우를 문제 해결하고 컴포넌트가 데이터를 받는지 확인하려면:

1. **Webhook**, **Parser**, **Chat Output** 컴포넌트가 있는 플로우를 만듭니다.
2. **Webhook** 컴포넌트의 **Data** 출력을 **Parser** 컴포넌트의 **Data** 입력에 연결합니다.
3. **Parser** 컴포넌트의 **Parsed Text** 출력을 **Chat Output** 컴포넌트의 **Text** 입력에 연결합니다.
4. **Parser** 컴포넌트를 편집하여 **Mode**를 **Stringify**로 설정합니다.
5. **Share**, **API access**를 선택하고 **Webhook curl** 코드 스니펫을 복사합니다.
6. POST 요청을 보내 플로우를 트리거합니다.
7. **Playground**를 클릭하여 **Chat Output** 컴포넌트가 POST 요청에서 JSON 데이터를 출력했는지 확인합니다.

### Parser 컴포넌트 빌드 실패

**Parser** 컴포넌트는 **Webhook** 컴포넌트에서 데이터를 받지 못하거나 들어오는 데이터에 문제가 있는 경우 빌드에 실패할 수 있습니다.

이 경우 **Parser** 컴포넌트의 **Mode**를 **Stringify**로 변경하여 컴포넌트가 파싱된 페이로드를 단일 문자열로 출력하게 합니다.

---

## 참고 항목

- [Langflow API 시작하기](../api-reference/api-reference.md)
- [플로우 트리거 엔드포인트](https://docs.langflow.org/api-flows-run)

---

*원문: https://docs.langflow.org/next/webhook*
