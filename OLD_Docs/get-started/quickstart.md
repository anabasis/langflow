# 빠른 시작

템플릿 플로우를 로드하고, 실행하고, `/run` API 엔드포인트에서 서빙하는 방법으로 Langflow를 시작합니다.

## 사전 요구사항

- [Langflow 설치 및 시작](./installation.md)
- [OpenAI API 키](https://platform.openai.com/api-keys) 생성
- [Langflow API 키](../develop/api-keys-and-authentication.md) 생성

**Langflow API 키 만들기**

Langflow API 키는 Langflow와 함께 사용할 수 있는 사용자별 토큰입니다.

1. Langflow에서 사용자 아이콘을 클릭한 후 **Settings**를 선택합니다.
2. **Langflow API Keys**를 클릭한 후 **Add New**를 클릭합니다.
3. 키 이름을 입력하고 **Create API Key**를 클릭합니다.
4. API 키를 복사하여 안전하게 저장합니다.
5. 요청에 Langflow API 키를 사용하려면 터미널에서 `LANGFLOW_API_KEY` 환경 변수를 설정하고 `x-api-key` 헤더 또는 쿼리 파라미터를 요청에 포함합니다.

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

---

## Simple Agent 템플릿 플로우 실행

1. Langflow에서 **New Flow**를 클릭하고 **Simple Agent** 템플릿을 선택합니다.

**Simple Agent** 템플릿은 **Chat Input** 및 **Chat Output** 컴포넌트, **Calculator** 컴포넌트, **URL** 컴포넌트에 연결된 [**Agent** 컴포넌트](../agents/use-agents.md)로 구성됩니다. 이 플로우를 실행하면 **Chat Input** 컴포넌트를 통해 에이전트에 쿼리를 제출하고, 에이전트가 **Calculator**와 **URL** 도구를 사용하여 응답을 생성한 후 **Chat Output** 컴포넌트를 통해 응답을 반환합니다.

많은 컴포넌트가 에이전트의 도구로 사용될 수 있으며, [모델 컨텍스트 프로토콜(MCP) 서버](../mcp/mcp-server.md)도 포함됩니다. 에이전트는 주어진 쿼리의 컨텍스트에 따라 어떤 도구를 호출할지 결정합니다.

2. **Agent** 컴포넌트에서 **Setup Provider**를 클릭하여 언어 모델 제공자를 선택합니다.

   Langflow의 전역 모델 제공자 구성을 편집하려면:

   1. 프로필 아이콘을 클릭하고 **Settings**를 선택한 후 **Model Providers**를 클릭합니다.
   2. **Model Providers** 패널에서 제공자를 선택합니다.
   3. **API Key** 필드에 제공자의 API 키를 추가합니다.
   4. **Save**를 클릭합니다.
   5. Langflow에서 사용하려는 특정 모델을 활성화합니다.

3. **Agent** 컴포넌트의 **Language Model** 드롭다운에서 구성된 모델을 선택합니다.

4. 플로우를 실행하려면 **Playground**를 클릭합니다.

5. **Calculator** 도구를 테스트하려면 `I want to add 4 and 4.`와 같은 간단한 수학 질문을 에이전트에게 합니다.

6. **URL** 도구를 테스트하려면 최신 이벤트에 대해 에이전트에게 질문합니다.

7. 테스트가 완료되면 **Close**를 클릭합니다.

---

## 외부 애플리케이션에서 플로우 실행

Langflow는 IDE이기도 하지만 Python, JavaScript, 또는 HTTP를 통해 [Langflow API](../api-reference/api-examples.md)로 호출할 수 있는 런타임이기도 합니다.

Langflow를 로컬에서 시작하면 로컬 Langflow 서버로 요청을 보낼 수 있습니다.
프로덕션 애플리케이션의 경우 API 호출을 처리하려면 [안정적인 Langflow 인스턴스를 배포](../deploy/deployment-overview.md)해야 합니다.

예를 들어 `/run` 엔드포인트를 사용하여 플로우를 실행하고 결과를 얻을 수 있습니다.

1. 플로우를 편집할 때 **Share**를 클릭하고 **API access**를 클릭합니다.

2. 코드 스니펫을 복사하여 스크립트 파일에 붙여넣고 스크립트를 실행하여 요청을 보냅니다.

**Python 예제:**

```python
import requests

url = "http://LANGFLOW_SERVER_ADDRESS/api/v1/run/FLOW_ID"

payload = {
    "output_type": "chat",
    "input_type": "chat",
    "input_value": "hello world!"
}

headers = {
    "Content-Type": "application/json",
    "x-api-key": "$LANGFLOW_API_KEY"
}

try:
    response = requests.request("POST", url, json=payload, headers=headers)
    response.raise_for_status()
    print(response.text)
except requests.exceptions.RequestException as e:
    print(f"Error making API request: {e}")
```

### 응답에서 데이터 추출

다음 예제는 터미널에서 질문-답변 채팅을 실행하고 에이전트의 이전 답변을 저장합니다.

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
        data = response.json()
        message = data["outputs"][0]["outputs"][0]["outputs"]["message"]["message"]
        return message
    except Exception as e:
        return f"Error: {str(e)}"

# 이전 답변 저장
previous_answer = None

while True:
    print("\n에이전트에게 무엇이든 물어보세요 (예: 'What is 15 * 7?')")
    print("종료하려면 'quit'을 입력하거나 이전 답변을 보려면 'compare'를 입력하세요")
    user_question = input("질문: ")

    if user_question.lower() == 'quit':
        break
    elif user_question.lower() == 'compare':
        if previous_answer:
            print(f"\n이전 답변: {previous_answer}")
        else:
            print("\n비교할 이전 답변이 없습니다!")
        continue

    result = ask_agent(user_question)
    print(f"\n에이전트 답변: {result}")
    previous_answer = result
```

### tweaks를 사용하여 플로우 실행에 임시 재정의 적용

요청에 tweaks를 포함하여 플로우 파라미터를 일시적으로 수정할 수 있습니다.
tweaks는 API 요청에 추가되며, 플로우 내의 컴포넌트 파라미터를 단일 실행에 대해서만 일시적으로 변경합니다.

```python
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

---

## 다음 단계

- [Langflow API로 플로우 트리거](../flows/run-flows.md)
- [Langflow를 MCP 서버로 사용](../mcp/mcp-server.md)
- [Langflow 애플리케이션 컨테이너화](../deploy/containerize.md)
- [파일 관리](../develop/storage-and-memory.md)

---

*원문: https://docs.langflow.org/next/get-started-quickstart*
