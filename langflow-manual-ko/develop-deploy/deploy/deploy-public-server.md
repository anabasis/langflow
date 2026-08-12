# 공개 Langflow 서버 배포하기
> 원문: https://docs.langflow.org/next/deployment-public-server

기본적으로 `http://localhost:7860`의 Langflow 서버는 공개 인터넷에 노출되지 않습니다.
하지만 [ngrok](https://ngrok.com/docs/getting-started/)이나 [zrok](https://docs.zrok.io/docs/getting-started) 같은 포워딩 플랫폼으로 Langflow 서버 트래픽을 포워딩하면 서버를 공개할 수 있습니다.

Langflow 서버를 공개하면 [Langflow MCP 서버를 외부에 배포](#deploy-your-mcp-server-externally)하거나, [API 요청을 처리](#serve-api-requests)하거나, [플로우의 Playground를 공개적으로 공유](#share-a-flows-playground)하는 등의 작업을 할 수 있습니다.

## 사전 요구 사항[​](#prerequisites "사전 요구 사항으로 바로 가기")

Langflow를 호스팅할 머신에 [Langflow를 설치](https://docs.langflow.org/get-started-installation)하고 리버스 프록시나 포워딩 서비스를 설치하세요.

이 가이드에서는 ngrok을 사용하지만, 유사한 리버스 프록시나 포워딩 플랫폼을 사용해도 됩니다.

이 가이드를 따라 하려면 [ngrok을 설치](https://ngrok.com/docs/getting-started/#1-install-ngrok)하고 [ngrok 인증 토큰을 생성](https://dashboard.ngrok.com/get-started/your-authtoken)하세요.

## ngrok으로 Langflow 서버 노출하기[​](#expose-your-langflow-server-with-ngrok "ngrok으로 Langflow 서버 노출하기로 바로 가기")

1. Langflow를 시작합니다.

    ```
    uv run langflow run
    ```

2. 다른 터미널 창에서 ngrok 인증 토큰을 사용해 로컬 ngrok 서버를 인증합니다.

    ```
    ngrok config add-authtoken NGROK_AUTHTOKEN
    ```

3. ngrok을 사용해 Langflow 서버를 공개 인터넷에 노출합니다.

    ```
    ngrok http http://localhost:7860
    ```
    이 예시는 기본 Langflow 리스닝 주소인 `http://localhost:7860`을 사용한다고 가정합니다. 리스닝 주소가 다르면 명령을 그에 맞게 수정해야 합니다.

    ngrok 세션이 터미널에서 시작되고 인증이 없는 임시 도메인을 배포합니다.
인증을 추가하거나 고정 도메인을 배포하려면 [ngrok 문서](https://ngrok.com/docs/)를 참조하세요.

    `Forwarding` 줄에는 Langflow 서버의 포워딩 주소가 출력됩니다.

    ```
    Forwarding https://94b1-76-64-171-14.ngrok-free.app -> http://localhost:7860
    ```
    포워딩 주소는 Langflow 서버의 리버스 프록시 역할을 하며, ngrok은 로컬 트래픽을 이 도메인으로 전달합니다.

4. Langflow 서버가 공개적으로 사용 가능한지 확인하려면 `https://94b1-76-64-171-14.ngrok-free.app`과 같은 포워딩 주소 URL로 이동하세요.

## 공개 Langflow 서버 사용하기[​](#use-a-public-langflow-server "공개 Langflow 서버 사용하기로 바로 가기")

Langflow 서버를 공개하면 [Langflow MCP 서버를 외부에 배포](#deploy-your-mcp-server-externally)하거나, [API 요청을 처리](#serve-api-requests)하거나, [플로우의 Playground를 공개적으로 공유](#share-a-flows-playground)하는 등의 작업을 할 수 있습니다.

### MCP 서버를 외부에 배포하기[​](#deploy-your-mcp-server-externally "MCP 서버를 외부에 배포하기로 바로 가기")

공개 Langflow 서버를 배포한 후에는 Langflow 프로젝트의 MCP 서버에도 공개적으로 접근할 수 있습니다.

이를 위해서는 [Langflow MCP 서버에 클라이언트를 연결](https://docs.langflow.org/mcp-server#connect-clients-to-use-the-servers-actions)할 때 서버의 포워딩 주소를 사용하세요.

### API 요청 처리하기[​](#serve-api-requests "API 요청 처리하기로 바로 가기")

공개 Langflow 서버의 [Langflow API](https://docs.langflow.org/api-reference-api-examples) 엔드포인트로 요청을 보내려면 API 요청의 [기본 URL](https://docs.langflow.org/api-reference-api-examples#base-url)로 서버의 도메인을 사용하세요.
예를 들면 다음과 같습니다.

```
curl -X POST \
  "PUBLIC_SERVER_DOMAIN/api/v1/webhook/FLOW_ID" \
  -H "Content-Type: application/json" \
  -H "x-api-key: LANGFLOW_API_KEY" \
  -d '{"data": "example-data"}'
```

팁

공개 Langflow 서버에서 플로우를 만들면 [**API access** 패널](https://docs.langflow.org/concepts-publish)에서 생성되는 코드 스니펫이 자동으로 공개 서버의 도메인을 사용합니다.

또한 스크립트에서 Langflow API 호출을 만들 때도 공개 도메인을 사용해야 하며, 여기에는 Langflow가 자동으로 생성하는 코드 스니펫도 포함됩니다.
예를 들어 다음 코드 스니펫은 지정된 플로우(`d764c4b8...`)를 트리거하기 위해 ngrok 도메인을 호출합니다.

```
import requests

url = "https://3f7c-73-64-93-151.ngrok-free.app/api/v1/run/d764c4b8-5cec-4c0f-9de0-4b419b11901a"  # The complete API endpoint URL for this flow

# Request payload configuration
payload = {
    "output_type": "chat",
    "input_type": "chat",
    "input_value": "Hello"
}

# Request headers
headers = {
    "Content-Type": "application/json",
    "x-api-key": "LANGFLOW_API_KEY"
}

try:
    # Send API request
    response = requests.request("POST", url, json=payload, headers=headers)
    response.raise_for_status()  # Raise exception for bad status codes

    # Print response
    print(response.text)

except requests.exceptions.RequestException as e:
    print(f"Error making API request: {e}")
except ValueError as e:
    print(f"Error parsing response: {e}")
```

스크립트에서 Langflow API를 사용하는 데모는 [퀵스타트](https://docs.langflow.org/get-started-quickstart)를 참조하세요.

### 플로우의 Playground 공유하기[​](#share-a-flows-playground "플로우의 Playground 공유하기로 바로 가기")

공개 Langflow 서버를 배포한 후에는 **Shareable Playground** 옵션을 사용해 플로우의 **Playground**를 공개 URL로 제공할 수 있습니다.
사용자가 이 URL에 접근하면 Langflow를 설치하거나 Langflow API 키를 생성하지 않고도 플로우의 채팅 입력 및 출력과 상호작용하고 결과를 볼 수 있습니다.

자세한 내용은 [플로우의 Playground 공유하기](https://docs.langflow.org/concepts-playground#share-a-flows-playground)를 참조하세요.
