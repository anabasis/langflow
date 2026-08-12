# 애플리케이션에서 MCP 서버에 연결하기

이 튜토리얼에서는 Langflow의 **MCP Tools** 컴포넌트를 사용하여 MCP 서버를 애플리케이션에 연결하는 방법을 보여줍니다.

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/)은 *MCP 클라이언트*와 *MCP 서버*를 통해 에이전트가 LLM과 통합할 수 있도록 돕습니다.

- **MCP 클라이언트로 Langflow 사용**: 에이전트 컴포넌트가 연결된 컴포넌트를 도구로 사용하여 요청을 처리합니다.
- **MCP 서버로 Langflow 사용**: Langflow 플로우가 MCP 클라이언트가 사용할 수 있는 도구가 됩니다.

---

## 사전 요구사항

- [Langflow 설치 및 시작](./installation.md)
- [Langflow API 키 만들기](../develop/api-keys-and-authentication.md)
- [OpenAI API 키 만들기](https://platform.openai.com/api-keys)

---

## 에이전트 플로우 만들기

1. Langflow에서 **New Flow**를 클릭하고 **Simple Agent** 템플릿을 선택합니다.

2. **Agent** 컴포넌트에 OpenAI API 키를 입력합니다.

3. 플로우를 테스트하려면 **Playground**를 클릭하고 LLM에 질문합니다:
   `애디론댁에서 오늘 하이킹하기 안전한가요?`

   기본 모델만으로는 실시간 날씨 정보가 없어 모호한 답변을 제공합니다.

---

## MCP Tools 컴포넌트 추가

MCP 서버와 MCP 클라이언트를 함께 사용하려면 서버를 클라이언트에서 사용할 수 있도록 해야 합니다:
- 서버를 로컬에 설치
- `uvx` 또는 `npx`로 서버 패키지를 가져와 실행
- Smithery 등 원격 서버 호출

Langflow에서는 각 MCP 서버에 대해 **MCP Tools** 컴포넌트를 하나씩 사용합니다.

### 날씨 MCP 서버 설치

```bash
uv pip install mcp_weather_server
```

> Langflow가 실행 중인 동일한 Python 환경에 서버를 설치해야 합니다.

### MCP 서버 등록

1. **Simple Agent** 플로우에서 **URL** 및 **Calculator** 도구를 제거합니다.

2. 왼쪽 사이드바의 **MCP** 섹션에서 **Add MCP Server**를 클릭하고 날씨 MCP 서버를 등록합니다.

3. **JSON** 옵션을 선택하고 다음을 붙여넣습니다:

```json
{
  "mcpServers": {
    "weather": {
      "command": "python",
      "args": ["-m", "mcp_weather_server"],
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

4. **Add Server**를 클릭하고 **Actions** 목록이 채워질 때까지 기다립니다.

5. **MCP** 사이드바에서 날씨 MCP 서버를 캔버스로 드래그하여 **MCP Tools** 컴포넌트를 추가합니다.

6. 컴포넌트의 **Tool Mode**를 활성화하고 **Toolset** 포트를 **Agent** 컴포넌트의 **Tools** 포트에 연결합니다.

---

## 지리위치 서버 추가

[Toolkit MCP 서버](https://github.com/cyanheads/toolkit-mcp-server)에는 IP 지리위치를 포함한 여러 MCP 도구가 있습니다.

> **참고**: 이 도구는 Langflow 서버의 IP 지리위치를 반환합니다. 서버가 원격으로 배포된 경우 다른 접근 방식을 고려하세요.

1. **MCP** 사이드바에서 **Add MCP Server**를 클릭하고 두 번째 서버를 등록합니다.

2. **STDIO**를 선택합니다.

3. **Name**: `ip_geolocation`

4. **Command**: `npx @cyanheads/toolkit-mcp-server`

5. **Add Server**를 클릭하고 **Actions** 목록이 채워질 때까지 기다립니다.

6. **ip_geolocation** MCP 서버를 캔버스로 드래그하여 두 번째 **MCP Tools** 컴포넌트를 추가합니다.

7. **Tool Mode**를 활성화하고 **Toolset** 포트를 **Agent** 컴포넌트의 **Tools** 포트에 연결합니다.

---

## Langflow에 연결하는 Python 애플리케이션 만들기

수집할 정보:
- `LANGFLOW_SERVER_ADDRESS`: Langflow 서버의 도메인 (기본값: `127.0.0.1:7860`)
- `FLOW_ID`: 플로우의 UUID 또는 커스텀 엔드포인트 이름
- `LANGFLOW_API_KEY`: 유효한 Langflow API 키

```python
import requests
import os

url = "LANGFLOW_SERVER_ADDRESS/api/v1/run/FLOW_ID"

payload = {
    "output_type": "chat",
    "input_type": "chat",
    "input_value": "지금 제 위치의 날씨는 어떤가요?"
}

headers = {
    "Content-Type": "application/json",
    "x-api-key": "LANGFLOW_API_KEY"
}

try:
    response = requests.request("POST", url, json=payload, headers=headers)
    response.raise_for_status()

    data = response.json()
    message = data["outputs"][0]["outputs"][0]["results"]["message"]["text"]
    print(message)

except requests.exceptions.RequestException as e:
    print(f"API 요청 오류: {e}")
except (KeyError, IndexError) as e:
    print(f"응답에서 메시지 추출 오류: {e}")
```

에이전트는 `ip_geolocation` 도구로 요청자의 위치를 감지한 다음 `weather` 도구로 해당 위치의 날씨 정보를 가져옵니다.

---

## 다음 단계

- [MCP 클라이언트로 Langflow 사용](../mcp/mcp-client.md)
- [Langflow 에이전트 사용](../agents/use-agents.md)
- [MCP 서버로 Langflow 사용](../mcp/mcp-server.md)

---

*원문: https://docs.langflow.org/next/mcp-tutorial*
