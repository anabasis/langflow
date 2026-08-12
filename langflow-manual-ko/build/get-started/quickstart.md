# Quickstart
> 원문: https://docs.langflow.org/get-started-quickstart

템플릿 플로우를 로드하고, 실행한 다음, `/run` API 엔드포인트로 서비스하면서 Langflow를 시작하는 방법을 알아봅니다.

## 사전 준비[​](#prerequisites)

- [Langflow 설치 및 시작](https://docs.langflow.org/get-started-installation)

- [OpenAI API 키](https://platform.openai.com/api-keys) 생성

- [Langflow API 키](https://docs.langflow.org/api-keys-and-authentication) 생성

**Langflow API 키 생성하기**

  Langflow API 키는 Langflow에서 사용할 수 있는 사용자별 토큰입니다.

    Langflow API 키를 생성하려면 다음 절차를 따르세요.

  1. Langflow에서 사용자 아이콘을 클릭하고 **Settings**를 선택합니다.

  2. **Langflow API Keys**를 클릭하고 **Add New**를 클릭합니다.

  3. 키에 이름을 지정하고 **Create API Key**를 클릭합니다.

  4. API 키를 복사하여 안전하게 보관합니다.

  5. 요청에 Langflow API 키를 사용하려면 터미널에서 `LANGFLOW_API_KEY` 환경 변수를 설정한 다음 요청에 `x-api-key` 헤더 또는 쿼리 파라미터를 포함시키세요.
예시는 다음과 같습니다.

```bash
# 변수 설정
export LANGFLOW_API_KEY="sk..."

# 요청 전송
curl --request POST \
--url "http://LANGFLOW_SERVER_ADDRESS/api/v1/run/FLOW_ID" \
--header "Content-Type: application/json" \
--header "x-api-key: $LANGFLOW_API_KEY" \
--data '{
  "output_type": "chat",
  "input_type": "chat",
  "input_value": "Hello"
}'
```

tip

가입 시 "An API key must be passed as query or header" 오류가 발생하면 [문제 해결](https://docs.langflow.org/troubleshoot#an-api-key-must-be-passed-as-query-or-header)을 참조하세요.

## Simple Agent 템플릿 플로우 실행하기[​](#run-the-simple-agent-template-flow)

1. Langflow에서 **New Flow**를 클릭하고 **Simple Agent** 템플릿을 선택합니다.

![Simple Agent 템플릿](https://docs.langflow.org/assets/images/quickstart-simple-agent-flow-fc8c6fc8913a645037e188be1ff6e019.png)

**Simple Agent** 템플릿은 [**Chat Input**과 **Chat Output** 컴포넌트](https://docs.langflow.org/chat-input-and-output), [**Calculator** 컴포넌트](https://docs.langflow.org/calculator), [**URL** 컴포넌트](https://docs.langflow.org/url)에 연결된 [**Agent** 컴포넌트](https://docs.langflow.org/agents)로 구성됩니다. 이 플로우를 실행하면 **Chat Input** 컴포넌트를 통해 에이전트에 쿼리를 제출하고, 에이전트는 **Calculator**와 **URL** 도구를 사용해 응답을 생성한 다음, **Chat Output** 컴포넌트를 통해 응답을 반환합니다.

[Model Context Protocol(MCP) 서버](https://docs.langflow.org/mcp-server)를 포함하여 많은 컴포넌트가 에이전트의 도구가 될 수 있습니다. 에이전트는 주어진 쿼리의 맥락에 따라 어떤 도구를 호출할지 결정합니다.

2. **Agent** 컴포넌트에서 **Setup Provider**를 클릭하여 언어 모델 제공자를 선택합니다.

    Langflow의 전역 모델 제공자 구성을 편집하려면 다음을 수행하세요.

  1. **Model Providers** 창을 열려면 프로필 아이콘을 클릭하고 **Settings**를 선택한 다음 **Model Providers**를 클릭합니다.

  2. **Model Providers** 창에서 제공자를 선택합니다.

  3. **API Key** 필드에 제공자의 API 키를 추가합니다. 일부 제공자는 추가 구성 필드가 필요합니다. 자세한 내용은 해당 모델 제공자의 문서를 참조하세요.

        이 키는 플로우에서 사용하려는 모델을 호출할 수 있는 권한이 있어야 하며, 계정에는 수행하려는 작업에 충분한 크레딧이 있어야 합니다.

        제공자별로 하나의 키만 추가할 수 있습니다. 키가 Langflow에서 사용하려는 *모든* 모델에 대한 액세스 권한을 가지고 있는지 확인하세요.

  4. **Save**를 클릭합니다.

  5. Langflow에서 사용하려는 특정 모델을 활성화합니다.
사용 가능한 모델은 제공자와 API 키의 권한에 따라 달라집니다.
텍스트를 생성하는 모델은 **Language Models**에 나열됩니다.
임베딩을 생성하는 모델은 **Embedding Models**에 나열됩니다.

    Langflow의 전역 모델 구성에서 모델을 활성화하면 플로우 내 모든 모델 기반 컴포넌트에서 해당 모델을 사용할 수 있습니다.

3. **Agent** 컴포넌트에서 **Language Model** 드롭다운에서 구성한 모델을 선택합니다.

**더 많은 모델과 제공자에 접근하기**

  더 많은 모델과 제공자에 접근하는 방법은 두 가지입니다.

  - Langflow의 전역 **Models** 구성을 편집합니다. 이러한 제공자와 모델은 Langflow의 핵심 기능의 일부입니다. **Ollama** 제공자를 사용하면 로컬 또는 원격 Ollama 인스턴스에 호스팅된 모든 모델에 연결할 수 있습니다.
  - [추가 언어 모델 컴포넌트](https://docs.langflow.org/components-models#additional-language-models)를 **Agent** 컴포넌트의 **Language Model** 포트에 연결합니다.

4. 플로우를 실행하려면 **Playground**를 클릭합니다.

5. **Calculator** 도구를 테스트하려면 `I want to add 4 and 4.`와 같은 간단한 수학 질문을 에이전트에게 물어보세요. 플로우를 테스트하고 평가하는 데 도움이 되도록, **Playground**는 에이전트가 프롬프트를 분석하고 도구를 선택한 다음 도구를 사용해 응답을 생성하는 추론 과정을 보여줍니다.
이 경우 수학 질문으로 인해 에이전트는 **Calculator** 도구를 선택하고 `evaluate_expression`과 같은 액션을 사용합니다.

![Agent 도구가 있는 Playground](https://docs.langflow.org/assets/images/quickstart-simple-agent-playground-e3adf053e3da75750e5f2bc8f60b639d.png)

6. **URL** 도구를 테스트하려면 에이전트에게 시사 이슈에 대해 물어보세요.
이 요청에 대해 에이전트는 **URL** 도구의 `fetch_content` 액션을 선택한 다음 최신 뉴스 헤드라인 요약을 반환합니다.

7. 플로우 테스트가 끝나면 **Close**를 클릭합니다.

다음 단계

첫 플로우를 실행했다면 다음 단계를 시도해 보세요.

- 다른 도구를 연결하거나 더 많은 [컴포넌트](https://docs.langflow.org/concepts-components)를 추가하여 **Simple Agent** 플로우를 편집합니다.
- 처음부터 또는 다른 템플릿 플로우를 수정하여 [자신만의 플로우를 빌드](https://docs.langflow.org/concepts-flows)합니다.
- [외부 애플리케이션에서 플로우 실행하기](#run-your-flows-from-external-applications)에 설명된 대로 플로우를 애플리케이션에 통합합니다.

## 외부 애플리케이션에서 플로우 실행하기[​](#run-your-flows-from-external-applications)

Langflow는 IDE이지만, Python, JavaScript, HTTP를 통해 [Langflow API](https://docs.langflow.org/api-reference-api-examples)로 호출할 수 있는 런타임이기도 합니다.

Langflow를 로컬에서 시작하면 로컬 Langflow 서버로 요청을 보낼 수 있습니다.
프로덕션 애플리케이션의 경우 API 호출을 처리할 [안정적인 Langflow 인스턴스를 배포](https://docs.langflow.org/deployment-overview)해야 합니다.

예를 들어 `/run` 엔드포인트를 사용하여 플로우를 실행하고 결과를 얻을 수 있습니다.

Langflow는 Langflow API를 시작하는 데 도움이 되는 코드 스니펫을 제공합니다.

1. 플로우를 편집할 때 **Share**를 클릭한 다음 **API access**를 클릭합니다.

    API access 창의 기본 코드는 Langflow 서버 `url`, `headers`, 요청 데이터 `payload`로 요청을 구성합니다.
코드 스니펫에는 해당 플로우의 `LANGFLOW_SERVER_ADDRESS`와 `FLOW_ID` 값이 자동으로 포함되며, 터미널 세션에서 환경 변수로 설정한 경우 `LANGFLOW_API_KEY`를 포함하는 스크립트도 포함됩니다.
다른 서버나 플로우에 이 코드를 사용하는 경우 이 값들을 교체하세요.
기본 Langflow 서버 주소는 `http://localhost:7860`입니다.

  - Python
  - JavaScript
  - curl

```python
import requests

url = "http://LANGFLOW_SERVER_ADDRESS/api/v1/run/FLOW_ID"  # 이 플로우의 전체 API 엔드포인트 URL

# 요청 페이로드 구성
payload = {
    "output_type": "chat",
    "input_type": "chat",
    "input_value": "hello world!"
}

# 요청 헤더
headers = {
    "Content-Type": "application/json",
    "x-api-key": "$LANGFLOW_API_KEY"
}

try:
    # API 요청 전송
    response = requests.request("POST", url, json=payload, headers=headers)
    response.raise_for_status()  # 잘못된 상태 코드에 대해 예외 발생

    # 응답 출력
    print(response.text)

except requests.exceptions.RequestException as e:
    print(f"Error making API request: {e}")
except ValueError as e:
    print(f"Error parsing response: {e}")
```

2. 스니펫을 복사하여 스크립트 파일에 붙여넣고 스크립트를 실행하여 요청을 보냅니다.
curl 스니펫을 사용하는 경우 터미널에서 명령을 직접 실행할 수 있습니다.

요청이 성공하면 응답에는 세션 ID, 입력, 출력, 컴포넌트, 소요 시간 등 플로우 실행에 대한 다양한 세부 정보가 포함됩니다.
다음은 **Simple Agent** 템플릿 플로우 실행 응답의 예시입니다.

**결과**

```json
{
  "session_id": "29deb764-af3f-4d7d-94a0-47491ed241d6",
  "outputs": [
    {
      "inputs": {
        "input_value": "hello world!"
      },
      "outputs": [
        {
          "results": {
            "message": {
              "text_key": "text",
              "data": {
                "timestamp": "2025-06-16 19:58:23 UTC",
                "sender": "Machine",
                "sender_name": "AI",
                "session_id": "29deb764-af3f-4d7d-94a0-47491ed241d6",
                "text": "Hello world! 🌍 How can I assist you today?",
                "files": [],
                "error": false,
                "edit": false,
                "properties": {
                  "text_color": "",
                  "background_color": "",
                  "edited": false,
                  "source": {
                    "id": "Agent-ZOknz",
                    "display_name": "Agent",
                    "source": "gpt-4o-mini"
                  },
                  "icon": "bot",
                  "allow_markdown": false,
                  "positive_feedback": null,
                  "state": "complete",
                  "targets": []
                },
                "category": "message",
                "content_blocks": [
                  {
                    "title": "Agent Steps",
                    "contents": [
                      {
                        "type": "text",
                        "duration": 2,
                        "header": {
                          "title": "Input",
                          "icon": "MessageSquare"
                        },
                        "text": "**Input**: hello world!"
                      },
                      {
                        "type": "text",
                        "duration": 226,
                        "header": {
                          "title": "Output",
                          "icon": "MessageSquare"
                        },
                        "text": "Hello world! 🌍 How can I assist you today?"
                      }
                    ],
                    "allow_markdown": true,
                    "media_url": null
                  }
                ],
                "id": "f3d85d9a-261c-4325-b004-95a1bf5de7ca",
                "flow_id": "29deb764-af3f-4d7d-94a0-47491ed241d6",
                "duration": null
              },
              "default_value": "",
              "text": "Hello world! 🌍 How can I assist you today?",
              "sender": "Machine",
              "sender_name": "AI",
              "files": [],
              "session_id": "29deb764-af3f-4d7d-94a0-47491ed241d6",
              "timestamp": "2025-06-16T19:58:23+00:00",
              "flow_id": "29deb764-af3f-4d7d-94a0-47491ed241d6",
              "error": false,
              "edit": false,
              "properties": {
                "text_color": "",
                "background_color": "",
                "edited": false,
                "source": {
                  "id": "Agent-ZOknz",
                  "display_name": "Agent",
                  "source": "gpt-4o-mini"
                },
                "icon": "bot",
                "allow_markdown": false,
                "positive_feedback": null,
                "state": "complete",
                "targets": []
              },
              "category": "message",
              "content_blocks": [
                {
                  "title": "Agent Steps",
                  "contents": [
                    {
                      "type": "text",
                      "duration": 2,
                      "header": {
                        "title": "Input",
                        "icon": "MessageSquare"
                      },
                      "text": "**Input**: hello world!"
                    },
                    {
                      "type": "text",
                      "duration": 226,
                      "header": {
                        "title": "Output",
                        "icon": "MessageSquare"
                      },
                      "text": "Hello world! 🌍 How can I assist you today?"
                    }
                  ],
                  "allow_markdown": true,
                  "media_url": null
                }
              ],
              "duration": null
            }
          },
          "artifacts": {
            "message": "Hello world! 🌍 How can I assist you today?",
            "sender": "Machine",
            "sender_name": "AI",
            "files": [],
            "type": "object"
          },
          "outputs": {
            "message": {
              "message": "Hello world! 🌍 How can I assist you today?",
              "type": "text"
            }
          },
          "logs": {
            "message": []
          },
          "messages": [
            {
              "message": "Hello world! 🌍 How can I assist you today?",
              "sender": "Machine",
              "sender_name": "AI",
              "session_id": "29deb764-af3f-4d7d-94a0-47491ed241d6",
              "stream_url": null,
              "component_id": "ChatOutput-aF5lw",
              "files": [],
              "type": "text"
            }
          ],
          "timedelta": null,
          "duration": null,
          "component_display_name": "Chat Output",
          "component_id": "ChatOutput-aF5lw",
          "used_frozen_result": false
        }
      ]
    }
  ]
}
```

프로덕션 애플리케이션에서는 이 응답 중 일부를 선택하여 사용자에게 반환하거나 로그에 저장하는 등의 작업이 필요할 것입니다. 다음 단계에서는 애플리케이션에서 사용할 수 있도록 Langflow API 응답에서 데이터를 추출하는 방법을 보여줍니다.

### 응답에서 데이터 추출하기[​](#extract-data-from-the-response)

다음 예시는 API 창의 예제 코드를 확장하여 에이전트의 이전 답변을 저장하는 터미널 기반 질의응답 채팅을 만듭니다.

1. **Simple Agent** 플로우의 `/run` 스니펫을 다음 스크립트에 통합하세요.
이 스크립트는 터미널에서 질의응답 채팅을 실행하고 비교할 수 있도록 에이전트의 이전 답변을 저장합니다.

  - Python
  - JavaScript

```python
import requests
import json

url = "http://LANGFLOW_SERVER_ADDRESS/api/v1/run/FLOW_ID"

def ask_agent(question):
    payload = {
        "output_type": "chat",
        "input_type": "chat",
        "input_value": question,
    }

    headers = {
    "Content-Type": "application/json",
    "x-api-key": "LANGFLOW_API_KEY"
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()

        # 응답 메시지 가져오기
        data = response.json()
        message = data["outputs"][0]["outputs"][0]["outputs"]["message"]["message"]
        return message

    except Exception as e:
        return f"Error: {str(e)}"

def extract_message(data):
    try:
        return data["outputs"][0]["outputs"][0]["outputs"]["message"]["message"]
    except (KeyError, IndexError):
        return None

# ask_agent 응답에서 이전 답변 저장
previous_answer = None

# 터미널 채팅
while True:
    # 사용자 입력 받기
    print("\nAsk the agent anything, such as 'What is 15 * 7?' or 'What is the capital of France?')")
    print("Type 'quit' to exit or 'compare' to see the previous answer")
    user_question = input("Your question: ")

    if user_question.lower() == 'quit':
        break
    elif user_question.lower() == 'compare':
        if previous_answer:
            print(f"\nPrevious answer was: {previous_answer}")
        else:
            print("\nNo previous answer to compare with!")
        continue

    # 답변 받아서 표시
    result = ask_agent(user_question)
    print(f"\nAgent's answer: {result}")
    # 비교를 위해 답변 저장
    previous_answer = result
```

2. 에이전트의 이전 답변을 보려면 `compare`를 입력하세요. 터미널 채팅을 종료하려면 `exit`을 입력하세요.

### tweaks를 사용해 플로우 실행에 일시적인 오버라이드 적용하기[​](#use-tweaks-to-apply-temporary-overrides-to-a-flow-run)

요청에 tweaks를 포함하여 플로우 파라미터를 일시적으로 수정할 수 있습니다.
Tweaks는 API 요청에 추가되며, 플로우 내 컴포넌트 파라미터를 일시적으로 변경합니다.
Tweaks는 단 한 번의 실행 동안에만 플로우의 컴포넌트 설정을 오버라이드합니다.
근본적인 플로우 구성을 수정하거나 다음 실행까지 유지되지 않습니다.

Tweaks는 `/run` 엔드포인트의 `payload`에 추가됩니다.
형식을 지정하는 데 도움이 되도록 코드 스니펫을 복사하기 전에 [오버라이드하려는 필드를 노출](https://docs.langflow.org/concepts-publish#input-schema)하세요.

1. 캔버스에서 파라미터를 오버라이드하려는 컴포넌트를 선택합니다.
2. **Parameters**를 클릭한 다음 스니펫에 포함하려는 필드에서 **API**를 클릭합니다.
3. **Share** > **API access**를 클릭합니다.
필드에서 **API**를 활성화해도 파라미터 값이 영구적으로 변경되지는 않습니다. 예시 코드 스니펫에 해당 필드가 추가될 뿐입니다.
4. 예를 들어 에이전트의 LLM 모델을 OpenAI에서 Anthropic으로 변경하고 요청에 Anthropic API 키를 포함하려면 **Agent** 컴포넌트를 선택하고 **Parameters**를 연 다음 **Language Model** 필드에서 **API**를 활성화합니다.

Langflow는 노출된 파라미터를 기반으로 코드 스니펫의 `tweaks` 객체를 업데이트하고, 참고할 수 있도록 기본값을 포함합니다.
스크립트에서 업데이트된 코드 스니펫을 사용하여 오버라이드와 함께 플로우를 실행하세요.

```json
payload = {
    "output_type": "chat",
    "input_type": "chat",
    "input_value": "hello world!",
    "tweaks": {
        "Agent-ZOknz": {
            "agent_llm": "Anthropic",
            "api_key": "ANTHROPIC_API_KEY",
            "model_name": "claude-opus-4-5-20251101"
        }
    }
}
```

## 다음 단계[​](#next-steps)

- [Langflow API로 플로우 실행하기](https://docs.langflow.org/concepts-publish)
- [Langflow를 Model Context Protocol(MCP) 서버로 사용하기](https://docs.langflow.org/mcp-server)
- [Langflow 애플리케이션 컨테이너화하기](https://docs.langflow.org/develop-application)
- [파일 관리](https://docs.langflow.org/concepts-file-management)
