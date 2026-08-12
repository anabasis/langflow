# 애플리케이션에서 MCP 서버에 연결하기
> 원문: https://docs.langflow.org/mcp-tutorial

이 튜토리얼에서는 Langflow의 [**MCP Tools** 컴포넌트](https://docs.langflow.org/mcp-client)를 사용하여 MCP 서버를 애플리케이션에 연결하는 방법을 보여줍니다.

[Model Context Protocol(MCP)](https://modelcontextprotocol.io/)는 *MCP 클라이언트*와 *MCP 서버*를 통해 에이전트가 LLM과 통합되도록 돕습니다.
구체적으로 MCP 서버는 에이전트(MCP 클라이언트)가 전문화된 작업을 완료하는 데 사용하는 도구를 호스팅합니다.
MCP 서버는 Cursor와 같은 MCP 클라이언트에 연결됩니다.
그런 다음 사용자는 클라이언트와 상호작용하고, 클라이언트는 요청을 완료하는 데 필요한 만큼 연결된 서버의 도구를 사용합니다.

Langflow를 MCP 클라이언트이자 MCP 서버로 실행할 수 있습니다.

- [Langflow를 MCP 클라이언트로 사용하기](https://docs.langflow.org/mcp-client): MCP 클라이언트로 실행되면 Langflow 플로우 내의 **Agent** 컴포넌트가 연결된 컴포넌트를 도구로 사용하여 요청을 처리할 수 있습니다.
기존 컴포넌트를 도구로 사용할 수 있으며, 어떤 MCP 서버든 플로우에 연결하여 해당 서버의 도구를 에이전트가 사용할 수 있도록 만들 수 있습니다.

- [Langflow를 MCP 서버로 사용하기](https://docs.langflow.org/mcp-server): MCP 서버로 실행되면 사용자의 플로우는 외부 클라이언트나 다른 Langflow 플로우와 같은 MCP 클라이언트가 사용할 수 있는 도구가 됩니다.

이 튜토리얼에서는 Langflow **MCP Tools** 컴포넌트를 사용하여 여러 MCP 서버를 플로우에 연결한 다음, Python 애플리케이션을 사용하여 플로우를 실행하고 프로그래밍 방식으로 에이전트와 채팅해 보겠습니다.

## 사전 준비[​](#prerequisites)

- [Langflow 설치 및 시작](https://docs.langflow.org/get-started-installation)
- [Langflow API 키](https://docs.langflow.org/api-keys-and-authentication) 생성
- [OpenAI API 키](https://platform.openai.com/api-keys) 생성

이 튜토리얼에서는 OpenAI LLM을 사용합니다. 다른 제공자를 사용하려면 해당 제공자의 유효한 자격 증명이 필요합니다.

## 에이전트 플로우 만들기[​](#create-an-agent-flow)

1. Langflow에서 **New Flow**를 클릭하고 **Simple Agent** 템플릿을 선택합니다.

2. **Agent** 컴포넌트에 OpenAI API 키를 입력합니다.

    다른 제공자나 모델을 사용하려면 **Model Provider**, **Model Name**, **API Key** 필드를 그에 맞게 수정하세요.

3. 플로우를 테스트하려면 **Playground**를 클릭하고 LLM에게 `Is it safe to go hiking in the Adirondacks today?`라고 물어보세요.

    이 쿼리는 LLM 단독으로는 전문화된 쿼리를 처리하기 위해 설계된 정보나 기능에 접근하지 못할 수 있음을 보여줍니다. 이 예시에서 기본 OpenAI 모델은 다소 모호한 응답을 제공하지만, 에이전트는 내부 `get_current_date` 함수를 사용하여 현재 날짜는 알고 있습니다.

```text
Today is July 11, 2025.
To determine if it's safe to go hiking in the Adirondacks today, you should check the current weather conditions, trail advisories, and any local alerts (such as bear activity or flooding).
Would you like a detailed weather forecast or information on trail conditions for the Adirondacks today?
```

    응답을 개선하려면 응답을 생성할 때 에이전트가 사용할 전문화된 도구를 제공하는 MCP 서버를 플로우에 연결할 수 있습니다. 튜토리얼의 다음 부분에서는 에이전트에게 실시간 날씨 정보를 제공하는 MCP 서버를 연결하여 더 구체적인 응답을 생성하도록 만들어 보겠습니다.

## MCP Tools 컴포넌트 추가하기[​](#add-an-mcp-tools-component)

온라인에는 다양한 작업을 위한 도구를 제공하는 여러 MCP 서버가 있습니다.
MCP 서버를 MCP 클라이언트와 함께 사용하려면 해당 서버를 클라이언트에서 사용할 수 있도록 만들어야 합니다.
모든 MCP 클라이언트에서 이를 수행하는 방법은 여러 가지가 있습니다.

- 서버를 로컬에 설치합니다.
- `uvx` 또는 `npx`를 사용하여 서버 패키지를 가져와 실행합니다.
- Smithery 등에서 제공하는 원격으로 실행 중인 서버를 호출합니다.

이 튜토리얼에서는 `uv pip install`로 날씨 서버를 로컬에 설치하는 방법과, `npx`를 사용하여 지오로케이션 서버 패키지를 실행하는 방법을 보여줍니다.
사용하는 특정 MCP 서버의 요구 사항은 다를 수 있습니다.

Langflow에서는 **MCP Tools** 컴포넌트를 사용하여 특정 MCP 서버를 플로우에 연결합니다.
플로우가 사용하려는 MCP 서버마다 하나의 **MCP Tools** 컴포넌트가 필요합니다.

1. 이 튜토리얼에서는 로컬 머신에 uv와 Python으로 [날씨 MCP 서버](https://github.com/isdaniel/mcp_weather_server)를 설치합니다.

```shell
uv pip install mcp_weather_server
```

    Langflow가 실행 중인 것과 동일한 Python 환경에 서버를 설치해야 합니다.

  - 가상 환경의 Langflow: 서버를 설치하기 전에 환경을 활성화하세요.
  - Langflow Docker 이미지: Docker 컨테이너 내부에 서버를 설치하세요.
  - Langflow Desktop 또는 시스템 전역 Langflow OSS: Langflow를 실행하는 것과 동일한 사용자 환경 또는 전역에 서버를 설치하세요.

2. **Simple Agent** 플로우에서 **URL**과 **Calculator** 도구를 제거합니다.

3. 왼쪽 사이드바에서 **MCP** 섹션을 열고 **Add MCP Server**를 클릭한 다음 날씨 MCP 서버를 등록합니다.

4. **Add MCP Server** 창에서 서버 시작 명령과 인자를 입력하여 날씨 MCP 서버를 플로우에 연결하세요. 이 튜토리얼에서는 **JSON** 또는 **STDIO** 옵션을 사용합니다.

    Langflow는 에이전트가 해당 서버가 제공하는 도구를 사용해야 한다고 판단할 때 서버를 시작하는 명령을 실행합니다.

    두 구성 모두 같은 정보를 다른 형식으로 제공한다는 점에 유의하세요.
즉 MCP 서버 저장소가 JSON 파일만 제공하는 경우에도 STDIO 옵션과 함께 그 값을 사용할 수 있습니다.

  - JSON
  - STDIO

  MCP 서버 구성을 JSON 객체로 제공하려면 **JSON**을 선택하고 서버 구성을 **JSON** 필드에 붙여넣으세요.

```json
{
  "mcpServers": {
    "weather": {
      "command": "python",
      "args": [
        "-m",
        "mcp_weather_server"
      ],
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

5. **Add Server**를 클릭한 다음 **Actions** 목록이 채워질 때까지 기다리세요. 이는 MCP 서버가 성공적으로 연결되었음을 의미합니다.

6. **MCP** 사이드바에서 날씨 MCP 서버를 캔버스로 드래그하여 해당 서버의 [**MCP Tools**](https://docs.langflow.org/mcp-client) 컴포넌트를 추가합니다.

    이 날씨 서버를 사용하면 **MCP Tools** 컴포넌트에도 선택적인 **City** 필드가 추가됩니다.
이 튜토리얼에서는 이 필드에 아무것도 입력하지 마세요.
대신 다음 단계에서 지오로케이션 MCP 서버를 추가하여 에이전트가 사용자의 위치를 감지하도록 하겠습니다.

7. **MCP Tools** 컴포넌트를 클릭하고 [컴포넌트의 헤더 메뉴](https://docs.langflow.org/concepts-components#component-menus)에서 **Tool Mode**를 활성화한 다음, 컴포넌트의 **Toolset** 포트를 **Agent** 컴포넌트의 **Tools** 포트에 연결합니다.

    이 시점에서 플로우에는 네 개의 연결된 컴포넌트가 있습니다.

  - **Chat Input** 컴포넌트는 **Agent** 컴포넌트의 **Input** 포트에 연결되어 있습니다. 이를 통해 사용자나 애플리케이션의 프롬프트로 플로우가 트리거될 수 있습니다.
  - 날씨 MCP 서버가 있는 **MCP Tools** 컴포넌트는 **Agent** 컴포넌트의 **Tools** 포트에 연결되어 있습니다. 에이전트는 모든 요청에 이 서버를 사용하는 것은 아니며, 서버가 프롬프트에 응답하는 데 도움이 된다고 판단할 때만 이 연결을 사용합니다.
  - **Agent** 컴포넌트의 **Output** 포트는 **Chat Output** 컴포넌트에 연결되어 사용자에게 최종 응답을 반환합니다.

    ![날씨 MCP 서버에 연결된 Agent 컴포넌트](https://docs.langflow.org/assets/images/tutorial-mcp-weather-2073f7de52c423626a6ba308cd62da90.png)

8. 날씨 MCP 서버를 테스트하려면 **Playground**를 클릭하고 LLM에게 `Is it safe to go hiking in the Adirondacks today?`라고 물어보세요.

    **Playground**는 에이전트가 요청을 분석하고 사용할 도구를 선택하는 로직을 보여줍니다.

    이상적으로는 날씨 MCP 서버가 제공하는 추가 맥락 덕분에 에이전트의 응답이 이전 응답보다 더 구체적일 것입니다.
예를 들면 다음과 같습니다.

```text
The current weather in Lake Placid, a central location in the Adirondacks,
is foggy with a temperature of 17.2°C (about 63°F).
If you plan to go hiking today, be cautious as fog can reduce visibility
on trails and make navigation more difficult.
```

    이 응답이 더 낫지만, 이 MCP 서버가 단순히 날씨 API를 호출하는 것보다 더 가치 있는 이유는 무엇일까요?

    MCP 서버는 종종 고도로 전문화된 작업이나 복잡한 다단계 문제 해결을 위해 연결된 도구와 같은 특정 작업을 위해 커스터마이징됩니다.
일반적으로는 특정 작업을 위한 커스텀 스크립트를 작성해야 하는데, 여기에는 하나의 스크립트 안에 여러 API 호출이 포함될 수도 있으며, 그런 다음 에이전트의 맥락 밖에서 이 스크립트를 실행하거나 어떻게든 에이전트에 제공해야 합니다.

    대신 MCP는 각 서버의 특정 엔드포인트 구조를 알거나 커스텀 통합을 작성할 필요 없이 모든 MCP 서버를 동일한 방식으로 에이전트에 추가할 수 있도록 보장합니다.
MCP는 다양한 도구를 에이전틱 애플리케이션에 통합하는 표준화된 방법입니다.
새로운 MCP 서버를 사용할 때마다 새로운 API를 배우거나 커스텀 코드를 작성할 필요가 없습니다.

    또한 해결하려는 문제에 따라 하나의 에이전트에 여러 MCP 서버를 연결할 수 있습니다.
서버를 더 많이 추가할수록 에이전트가 응답에 사용할 수 있는 전문화된 맥락이 늘어납니다.
이 튜토리얼에서는 날씨 MCP 서버를 추가한 것만으로도 이미 LLM 응답의 품질이 향상되었습니다.
튜토리얼의 다음 섹션에서는 사용자가 프롬프트에서 위치를 지정하지 않았을 때 에이전트가 사용자의 위치를 감지할 수 있도록 `ip_geolocation` MCP 서버를 추가하겠습니다.

## 지오로케이션 서버 추가하기[​](#add-a-geolocation-server)

[Toolkit MCP 서버](https://github.com/cyanheads/toolkit-mcp-server)에는 IP 지오로케이션을 포함해 네트워크 모니터링을 위한 여러 MCP 도구가 포함되어 있습니다. 매우 정밀하지는 않지만 API 키가 필요하지 않습니다.

이 도구는 Langflow 서버의 IP 지오로케이션을 반환한다는 점에 유의하세요. 따라서 서버가 원격으로 배포된 경우, 브라우저 지오로케이션 API와 같은 사용자별 위치 데이터를 얻는 대체 방법을 고려하세요.

이 MCP 서버는 [npx](https://docs.npmjs.com/cli/v8/commands/npx) 명령 하나로 시작할 수 있으며, 패키지를 로컬에 설치하지 않고도 [Toolkit MCP 서버 Node 레지스트리 패키지](https://www.npmjs.com/package/@cyanheads/toolkit-mcp-server)를 다운로드하여 실행합니다.

플로우에 Toolkit MCP 서버를 추가하려면 다음을 수행하세요.

1. **MCP** 사이드바를 열고 **Add MCP Server**를 클릭한 다음 두 번째 서버를 등록합니다.

2. **STDIO**를 선택합니다.

3. **Name**에 `ip_geolocation`을 입력합니다.

  tip
      도구 이름과 설명은 에이전트가 도구를 선택하는 데 도움이 됩니다.
에이전트가 도구 선택에 어려움을 겪는다면 이름과 설명이 명확하고 사람이 읽기 쉬운지 확인하세요.

4. **Command**에 `npx @cyanheads/toolkit-mcp-server`를 입력합니다.

5. **Add Server**를 클릭한 다음 **Actions** 목록이 채워질 때까지 기다리세요. 이는 MCP 서버가 성공적으로 연결되었음을 의미합니다.

6. **MCP** 사이드바에서 **ip_geolocation** MCP 서버를 캔버스로 드래그하여 두 번째 **MCP Tools** 컴포넌트를 추가합니다.

7. 새 **MCP Tools** 컴포넌트를 클릭하고 [컴포넌트의 헤더 메뉴](https://docs.langflow.org/concepts-components#component-menus)에서 **Tool Mode**를 활성화한 다음, 컴포넌트의 **Toolset** 포트를 **Agent** 컴포넌트의 **Tools** 포트에 연결합니다.

    이제 플로우에는 총 다섯 개의 컴포넌트로, 추가적인 **MCP Tools** 컴포넌트가 있습니다.

    ![날씨 및 지오로케이션 MCP 서버에 연결된 Agent 컴포넌트](https://docs.langflow.org/assets/images/tutorial-mcp-geolocation-b8140a46fa3a3ef20ed15dc6cf4a9060.png)

## Langflow에 연결하는 Python 애플리케이션 만들기[​](#create-a-python-application-that-connects-to-langflow)

이 시점에서 **Playground**를 열고 현재 위치의 날씨에 대해 물어보면 IP 지오로케이션 도구를 테스트할 수 있습니다.
하지만 지오로케이션 도구는 사용자나 여러분이 세계 곳곳의 다른 장소에 대한 날씨를 물어보고 싶은 애플리케이션에서 가장 유용합니다.

튜토리얼의 마지막 부분에서는 Langflow API를 사용하여 스크립트에서 플로우를 실행하는 방법을 알아봅니다.
이는 예를 들어 사용자가 특정 스포츠를 즐기기에 날씨가 좋은지 알고 싶어 하는 모바일 앱과 같은 더 큰 애플리케이션의 일부가 될 수 있습니다.

Langflow API를 사용하여 플로우를 실행하면 코드를 변경하지 않고도 플로우의 일부 측면을 변경할 수 있습니다.
예를 들어 Langflow에서 플로우에 더 많은 MCP 서버를 추가한 다음, 동일한 스크립트로 플로우를 실행할 수 있습니다.
동일한 입력을 사용하거나 에이전트가 다른 도구를 사용하도록 유도하는 새로운 입력을 사용할 수도 있습니다.

1. 이 튜토리얼의 Python 스크립트를 위해 다음 정보를 수집하세요.

  - `LANGFLOW_SERVER_ADDRESS`: Langflow 서버의 도메인입니다. 기본값은 `127.0.0.1:7860`입니다. 이 값은 플로우의 [**API access** 창](https://docs.langflow.org/concepts-publish#api-access)에 있는 코드 스니펫에서 얻을 수 있습니다.
  - `FLOW_ID`: 플로우의 UUID 또는 사용자 지정 엔드포인트 이름입니다. 이 값은 플로우의 [**API access** 창](https://docs.langflow.org/concepts-publish#api-access)에 있는 코드 스니펫에서 얻을 수 있습니다.
  - `LANGFLOW_API_KEY`: 유효한 [Langflow API 키](https://docs.langflow.org/api-keys-and-authentication)입니다.

2. 다음 스크립트를 Python 파일에 복사한 다음, 이전 단계에서 수집한 정보로 자리 표시자를 교체하세요.

```python
import requests
import os

url = "LANGFLOW_SERVER_ADDRESS/api/v1/run/FLOW_ID"  # 이 플로우의 전체 API 엔드포인트 URL

# 요청 페이로드 구성
payload = {
    "output_type": "chat",
    "input_type": "chat",
    "input_value": "What's the weather like where I am right now?"
}

# 요청 헤더
headers = {
    "Content-Type": "application/json",
    "x-api-key": "LANGFLOW_API_KEY"
}

try:
    # API 요청 전송
    response = requests.request("POST", url, json=payload, headers=headers)
    response.raise_for_status()  # 잘못된 상태 코드에 대해 예외 발생

    # 메시지 텍스트만 파싱하고 출력
    data = response.json()
    message = data["outputs"][0]["outputs"][0]["results"]["message"]["text"]
    print(message)

except requests.exceptions.RequestException as e:
    print(f"Error making API request: {e}")
except ValueError as e:
    print(f"Error parsing response: {e}")
except (KeyError, IndexError) as e:
    print(f"Error extracting message from response: {e}")
```

    이 스크립트는 이전 **Playground** 예시와는 다른 프롬프트를 사용한다는 점에 유의하세요.
이 스크립트에서 `input_value`는 특정 도시와 같은 힌트를 제공하지 않고 사용자의 현재 위치의 날씨에 대해 물어봅니다.

    또한 이 스크립트에는 전체 Langflow API 응답에서 LLM의 답변을 추출하는 파싱 코드가 포함되어 있습니다.
Langflow API 응답에는 사용자에게 전달되는 답변과 관련 없는 메타데이터 등의 정보가 포함되어 있으므로, 자신의 애플리케이션에서도 비슷한 추출 방식을 사용하는 것이 좋습니다.

3. 스크립트를 저장하고 실행하여 요청을 보내고 플로우를 테스트합니다.

    에이전트는 `ip_geolocation` 도구를 사용해 요청자의 위치를 감지한 다음, `weather` 도구를 사용해 해당 위치의 날씨 정보를 가져옵니다.
예를 들면 다음과 같습니다.

```text
The weather in Waynesboro, Pennsylvania, is currently overcast with a temperature of 23.0°C (about 73.4°F).
If you need more details or have any other questions, feel free to ask!
```

    이 튜토리얼에서 사용한 `ip_geolocation` 도구는 Langflow 서버의 위치를 사용하며, 이는 실제 사용자 위치와 다를 수 있다는 점을 기억하세요.

## 다음 단계[​](#next-steps)

이 튜토리얼에서 소개한 개념을 더 발전시키려면 다음을 참조하세요.

- [Langflow를 MCP 클라이언트로 사용하기](https://docs.langflow.org/mcp-client)
- [Langflow 에이전트 사용하기](https://docs.langflow.org/agents)
- [Langflow를 MCP 서버로 사용하기](https://docs.langflow.org/mcp-server)
- [Langflow 배포 개요](https://docs.langflow.org/deployment-overview)
