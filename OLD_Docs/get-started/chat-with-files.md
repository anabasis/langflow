# 파일을 수집할 수 있는 챗봇 만들기

이 튜토리얼에서는 회의 메모나 구직 지원서와 같이 업로드한 파일을 읽고 질문에 답할 수 있는 챗봇을 구축하는 방법을 보여줍니다.

예를 들어 계약서를 업로드하고 "이 계약의 해지 조항은 무엇인가요?"라고 물어볼 수 있습니다. 또는 이력서를 업로드하고 "이 지원자에게 마케팅 분석 경험이 있나요?"라고 물어볼 수 있습니다.

이 튜토리얼의 주요 초점은 Langflow 플로우에 파일을 입력으로 제공하는 방법을 보여주는 것입니다.

---

## 사전 요구사항

- [Langflow 설치 및 시작](./installation.md)
- [Langflow API 키 만들기](../develop/api-keys-and-authentication.md)
- [OpenAI API 키 만들기](https://platform.openai.com/api-keys)

---

## 파일 입력을 허용하는 플로우 만들기

파일을 수집하려면 플로우에 **Prompt Template** 또는 **Agent** 컴포넌트와 같은 입력을 받는 컴포넌트에 연결된 **Read File** 컴포넌트가 있어야 합니다.

다음 단계는 **Basic Prompting** 템플릿을 수정하여 파일 입력을 허용합니다:

1. Langflow에서 **New Flow**를 클릭하고 **Basic Prompting** 템플릿을 선택합니다.

2. **Language Model** 컴포넌트에 OpenAI API 키를 입력합니다.

3. API 키가 유효한지 확인하려면 **Playground**를 클릭하고 LLM에 질문합니다.

4. **Prompt Template** 컴포넌트의 **Template** 필드를 수정하여 채팅 입력 외에 파일 입력도 허용합니다:

```
ChatInput:
{chat-input}
File:
{file}
```

> **팁**: 템플릿 변수에 원하는 문자열을 사용할 수 있습니다.

5. 플로우에 **Read File** 컴포넌트를 추가하고 **Raw Content** 출력 포트를 **Prompt Template** 컴포넌트의 **file** 입력 포트에 연결합니다.

이 시점에서 플로우에는 5개의 컴포넌트가 있습니다:
- **Chat Input** → **Prompt Template** 입력 포트
- **Read File** → **Prompt Template** 파일 입력 포트
- **Prompt Template** → **Language Model** → **Chat Output**

---

## Python 애플리케이션에서 플로우로 요청 보내기

이 예시는 로컬 Langflow 인스턴스를 사용하여 LLM에 샘플 이력서를 평가하도록 요청합니다.

수집할 정보:
- `LANGFLOW_SERVER_ADDRESS`: Langflow 서버의 도메인 (기본값: `127.0.0.1:7860`)
- `FLOW_ID`: 플로우의 UUID 또는 커스텀 엔드포인트 이름
- `FILE_COMPONENT_ID`: 플로우의 **Read File** 컴포넌트의 UUID (예: `File-KZP68`)
- `CHAT_INPUT`: 플로우의 Chat Input에 보낼 메시지
- `FILE_NAME` 및 `FILE_PATH`: 플로우에 보낼 로컬 파일의 이름 및 경로
- `LANGFLOW_API_KEY`: 유효한 Langflow API 키

```python
import requests
import json

# 1. 업로드 URL 설정
url = "http://LANGFLOW_SERVER_ADDRESS/api/v2/files/"

# 2. 파일 및 페이로드 준비
payload = {}
files = [
  ('file', ('FILE_PATH', open('FILE_NAME', 'rb'), 'application/octet-stream'))
]
headers = {
  'Accept': 'application/json',
  'x-api-key': 'LANGFLOW_API_KEY'
}

# 3. Langflow에 파일 업로드
response = requests.request("POST", url, headers=headers, data=payload, files=files)
print(response.text)

# 4. 응답에서 업로드된 파일 경로 가져오기
uploaded_data = response.json()
uploaded_path = uploaded_data.get('path')

# 5. 업로드된 파일 경로로 Langflow 실행 엔드포인트 호출
run_url = "http://LANGFLOW_SERVER_ADDRESS/api/v1/run/FLOW_ID"
run_payload = {
    "input_value": "CHAT_INPUT",
    "output_type": "chat",
    "input_type": "chat",
    "tweaks": {
        "FILE_COMPONENT_ID": {
            "path": uploaded_path
        }
    }
}
run_headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-api-key': 'LANGFLOW_API_KEY'
}
run_response = requests.post(run_url, headers=run_headers, data=json.dumps(run_payload))
langflow_data = run_response.json()

# 메시지만 출력
try:
    message = langflow_data['outputs'][0]['outputs'][0]['results']['message']['data']['text']
    print(message)
except (KeyError, IndexError, TypeError):
    pass
```

이 스크립트에는 두 가지 요청이 포함됩니다:
1. `/v2/files` 엔드포인트로 파일 업로드 → 파일 경로 반환
2. `/v1/run/` 엔드포인트로 채팅 메시지 전송 (tweaks에 업로드된 파일 경로 포함)

---

## 다음 단계

- **런타임에 여러 파일 처리**: 여러 파일을 처리하려면 각 파일에 대해 별도의 **Read File** 컴포넌트를 추가합니다.
- **런타임에 외부 파일 업로드**: 다른 머신에서 파일을 업로드하려면 Langflow 서버가 인터넷에서 접근 가능해야 합니다.
- **채팅 세션 외부에서 파일 미리 로드**: **Read File** 컴포넌트를 사용하여 플로우의 어디서나 파일을 로드할 수 있습니다.

---

*원문: https://docs.langflow.org/next/chat-with-files*
