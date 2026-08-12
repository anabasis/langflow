# 퍼블릭 Langflow 서버 배포

기본적으로 `http://localhost:7860`의 Langflow 서버는 공개 인터넷에 노출되지 않습니다. [ngrok](https://ngrok.com/docs/getting-started/)이나 [zrok](https://docs.zrok.io/docs/getting-started)과 같은 포워딩 플랫폼으로 Langflow 서버 트래픽을 포워딩하여 서버를 공개할 수 있습니다.

---

## 사전 요구사항

Langflow가 설치된 머신에 ngrok을 설치합니다:
1. [ngrok 설치](https://ngrok.com/docs/getting-started/#1-install-ngrok)
2. [ngrok authtoken 생성](https://dashboard.ngrok.com/get-started/your-authtoken)

---

## ngrok으로 Langflow 서버 공개

1. Langflow 시작:

```bash
uv run langflow run
```

2. 다른 터미널에서 ngrok authtoken 인증:

```bash
ngrok config add-authtoken NGROK_AUTHTOKEN
```

3. Langflow 서버를 공개 인터넷에 노출:

```bash
ngrok http http://localhost:7860
```

`Forwarding` 줄에 포워딩 주소가 출력됩니다:

```
Forwarding https://94b1-76-64-171-14.ngrok-free.app -> http://localhost:7860
```

4. 포워딩 주소 URL로 이동하여 Langflow 서버가 공개적으로 사용 가능한지 확인합니다.

---

## 공개 Langflow 서버 사용

### 외부에 MCP 서버 배포

공개 Langflow 서버를 배포한 후, 클라이언트를 Langflow MCP 서버에 연결할 때 서버의 포워딩 주소를 사용합니다.

### API 요청 처리

공개 Langflow 서버의 API 엔드포인트로 요청을 보내려면 서버의 도메인을 API 요청의 기본 URL로 사용합니다:

```bash
curl -X POST \
  "PUBLIC_SERVER_DOMAIN/api/v1/webhook/FLOW_ID" \
  -H "Content-Type: application/json" \
  -H "x-api-key: LANGFLOW_API_KEY" \
  -d '{"data": "example-data"}'
```

Python 스크립트 예시:

```python
import requests

url = "https://3f7c-73-64-93-151.ngrok-free.app/api/v1/run/FLOW_ID"

payload = {
    "output_type": "chat",
    "input_type": "chat",
    "input_value": "안녕하세요"
}

headers = {
    "Content-Type": "application/json",
    "x-api-key": "LANGFLOW_API_KEY"
}

response = requests.request("POST", url, json=payload, headers=headers)
print(response.text)
```

### 플로우의 플레이그라운드 공유

공개 Langflow 서버를 배포한 후 **Shareable Playground** 옵션을 사용하여 플로우의 **Playground**를 공개 URL에서 사용 가능하게 만들 수 있습니다.

---

## 참고 항목

- [Langflow 배포 개요](./deployment-overview.md)
- [Nginx와 SSL로 배포](./nginx-ssl.md)

---

*원문: https://docs.langflow.org/next/deployment-public-server*
