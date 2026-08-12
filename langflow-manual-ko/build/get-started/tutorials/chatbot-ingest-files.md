# 파일을 수집할 수 있는 챗봇 만들기
> 원문: https://docs.langflow.org/chat-with-files

이 튜토리얼에서는 업로드한 파일(예: 회의록이나 입사 지원서)을 읽고 그에 대한 질문에 답할 수 있는 챗봇을 만드는 방법을 보여줍니다.

예를 들어 계약서를 업로드하고 "이 계약서의 해지 조항은 무엇인가요?"라고 물어보거나, 이력서를 업로드하고 "이 지원자는 마케팅 분석 경험이 있나요?"라고 물어볼 수 있습니다.

이 튜토리얼의 주된 목적은 챗봇이 응답에 파일 내용을 활용할 수 있도록 Langflow 플로우에 파일을 입력으로 제공하는 방법을 보여주는 것입니다.

## 사전 준비[​](#prerequisites)

- [Langflow 설치 및 시작](https://docs.langflow.org/get-started-installation)
- [Langflow API 키](https://docs.langflow.org/api-keys-and-authentication) 생성
- [OpenAI API 키](https://platform.openai.com/api-keys) 생성

이 튜토리얼에서는 OpenAI LLM을 사용합니다. 다른 제공자를 사용하려면 해당 제공자의 유효한 자격 증명이 필요합니다.

## 파일 입력을 받는 플로우 만들기[​](#create-a-flow-that-accepts-file-input)

파일을 수집하려면 플로우에 **Prompt Template**나 **Agent** 컴포넌트처럼 입력을 받는 컴포넌트에 연결된 **Read File** 컴포넌트가 있어야 합니다.

다음 단계는 **Basic Prompting** 템플릿을 수정하여 파일 입력을 받도록 합니다.

1. Langflow에서 **New Flow**를 클릭하고 **Basic Prompting** 템플릿을 선택합니다.

2. **Language Model** 컴포넌트에 OpenAI API 키를 입력합니다.

    다른 제공자나 모델을 사용하려면 **Model Provider**, **Model Name**, **API Key** 필드를 그에 맞게 수정하세요.

3. API 키가 유효한지 확인하려면 **Playground**를 클릭하고 LLM에게 질문을 해보세요.
LLM은 **Prompt Template** 컴포넌트의 **Template** 필드에 지정된 사양에 따라 응답해야 합니다.

4. **Playground**를 종료한 다음, **Prompt Template** 컴포넌트를 수정하여 채팅 입력에 더해 파일 입력도 받도록 합니다.
이를 위해 **Template** 필드를 편집하고 기본 프롬프트를 다음 텍스트로 교체하세요.

```text
ChatInput:
{chat-input}
File:
{file}
```

  tip
      템플릿 변수의 이름은 원하는 문자열로 지정할 수 있습니다.
이 문자열은 **Prompt Template** 컴포넌트의 필드(입력 포트) 이름이 됩니다.

    이 튜토리얼에서는 변수 이름이 연결되는 컴포넌트의 이름을 따서 지정됩니다. **Chat Input** 컴포넌트에는 **chat-input**, **Read File** 컴포넌트에는 **file**을 사용합니다.

5. 플로우에 [**Read File** 컴포넌트](https://docs.langflow.org/read-file)를 추가한 다음 **Raw Content** 출력 포트를 **Prompt Template** 컴포넌트의 **file** 입력 포트에 연결합니다.
포트를 연결하려면 한쪽 포트에서 다른 쪽 포트로 클릭 앤 드래그하세요.

    플로우를 실행하기 전에 **Read File** 컴포넌트에 직접 파일을 추가하여 입력을 미리 로드하거나, 런타임에 파일을 로드할 수 있습니다. 이 튜토리얼의 다음 섹션에서는 런타임 파일 업로드를 다룹니다.

    이 시점에서 플로우에는 다섯 개의 컴포넌트가 있습니다. **Chat Input**과 **Read File** 컴포넌트는 **Prompt Template** 컴포넌트의 입력 포트에 연결됩니다. 그런 다음 **Prompt Template** 컴포넌트의 출력 포트는 **Language Model** 컴포넌트의 입력 포트에 연결됩니다. 마지막으로 **Language Model** 컴포넌트의 출력 포트는 **Chat Output** 컴포넌트에 연결되어 사용자에게 최종 응답을 반환합니다.

    ![파일 로더 채팅 플로우](https://docs.langflow.org/assets/images/tutorial-chat-file-loader-099f2f4c5e4343412557b1a78c4b9209.png)

## Python 애플리케이션에서 플로우로 요청 보내기[​](#send-requests-to-your-flow-from-a-python-application)

이 튜토리얼 섹션에서는 애플리케이션에서 플로우로 파일 입력을 보내는 방법을 보여줍니다.

이를 위해 애플리케이션은 업로드하려는 파일과 텍스트 프롬프트를 담아 Langflow 서버에 `POST /run` 요청을 보내야 합니다.
결과에는 플로우 실행 결과와 LLM의 응답이 포함됩니다.

이 예시는 로컬 Langflow 인스턴스를 사용하며, LLM에게 샘플 이력서를 평가하도록 요청합니다.
가지고 있는 이력서가 없다면 [fake-resume.txt](https://docs.langflow.org/assets/files/fake-resume-fa337cbdb18306bd29e3168f73409745.txt)를 다운로드할 수 있습니다.

tip

JavaScript에서 파일 업로드 요청을 구성하는 예시는 [Create a vector RAG chatbot 튜토리얼](https://docs.langflow.org/chat-with-rag#load-data-and-generate-embeddings)을 참조하세요.

1. 요청을 구성하려면 다음 정보를 수집하세요.

  - `LANGFLOW_SERVER_ADDRESS`: Langflow 서버의 도메인입니다. 기본값은 `127.0.0.1:7860`입니다. 이 값은 플로우의 [**API access** 창](https://docs.langflow.org/concepts-publish#api-access)에 있는 코드 스니펫에서 얻을 수 있습니다.
  - `FLOW_ID`: 플로우의 UUID 또는 사용자 지정 엔드포인트 이름입니다. 이 값은 플로우의 [**API access** 창](https://docs.langflow.org/concepts-publish#api-access)에 있는 코드 스니펫에서 얻을 수 있습니다.
  - `FILE_COMPONENT_ID`: 플로우 내 **Read File** 컴포넌트의 UUID입니다(예: `File-KZP68`). 컴포넌트 ID를 찾으려면 Langflow에서 플로우를 열고 **Read File** 컴포넌트를 클릭한 다음 **Controls**를 클릭하세요. 컴포넌트 ID는 **Controls** 창 상단에 있습니다.
  - `CHAT_INPUT`: 플로우의 Chat Input으로 보낼 메시지입니다(예: `Evaluate this resume for a job opening in my Marketing department.`).
  - `FILE_NAME`과 `FILE_PATH`: 플로우로 보낼 로컬 파일의 이름과 경로입니다.
  - `LANGFLOW_API_KEY`: 유효한 [Langflow API 키](https://docs.langflow.org/api-keys-and-authentication)입니다.

2. 다음 스크립트를 Python 파일에 복사한 다음, 이전 단계에서 수집한 정보로 자리 표시자를 교체하세요.

```python
# requests를 사용하는 Python 예시
import requests
import json

# 1. 업로드 URL 설정
url = "http://LANGFLOW_SERVER_ADDRESS/api/v2/files/"

# 2. 파일과 페이로드 준비
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

# 5. 업로드된 파일 경로로 Langflow run 엔드포인트 호출
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
message = None
try:
    message = langflow_data['outputs'][0]['outputs'][0]['results']['message']['data']['text']
except (KeyError, IndexError, TypeError):
    pass
print(message)
```

    이 스크립트에는 두 개의 요청이 있습니다.

    첫 번째 요청은 `fake-resume.txt`와 같은 파일을 `/v2/files` 엔드포인트를 통해 Langflow 서버에 업로드합니다. 이 요청은 이후 Langflow 요청에서 참조할 수 있는 파일 경로를 반환합니다(예: `02791d46-812f-4988-ab1c-7c430214f8d5/fake-resume.txt`).

    두 번째 요청은 `/v1/run/` 엔드포인트를 통해 Langflow 플로우로 채팅 메시지를 보냅니다.
`tweaks` 파라미터에는 `uploaded_path` 변수로 업로드된 파일 경로가 포함되어 있으며, 이 파일을 **Read File** 컴포넌트로 직접 전달합니다.

3. 스크립트를 저장하고 실행하여 요청을 보내고 플로우를 테스트합니다.

    초기 출력에는 파일 업로드 엔드포인트의 JSON 응답 객체가 포함되며, Langflow가 파일을 저장하는 내부 경로도 포함됩니다.
그런 다음 LLM은 파일을 가져와 그 내용(이 경우 이력서가 채용 포지션에 적합한지)을 평가합니다.

**결과**

  다음은 이 튜토리얼의 플로우에서 나온 응답 예시입니다. LLM의 특성과 입력값의 차이로 인해 실제 응답은 다를 수 있습니다.

```text
{"id":"793ba3d8-5e7a-4499-8b89-d9a7b6325fee","name":"fake-resume (1)","path":"02791d46-812f-4988-ab1c-7c430214f8d5/fake-resume.txt","size":1779,"provider":null}
The resume for Emily J. Wilson presents a strong candidate for a position in your Marketing department. Here are some key points to consider:

### Strengths:
1. **Experience**: With over 8 years in marketing, Emily has held progressively responsible positions, culminating in her current role as Marketing Director. This indicates a solid foundation in the field.

2. **Quantifiable Achievements**: The resume highlights specific accomplishments, such as a 25% increase in brand recognition and a 30% sales increase after launching new product lines. These metrics demonstrate her ability to drive results.

3. **Diverse Skill Set**: Emily's skills encompass various aspects of marketing, including strategy development, team management, social media marketing, event planning, and data analysis. This versatility can be beneficial in a dynamic marketing environment.

4. **Educational Background**: Her MBA and a Bachelor's degree in Marketing provide a strong academic foundation, which is often valued in marketing roles.

5. **Certifications**: The Certified Marketing Professional (CMP) and Google Analytics Certification indicate a commitment to professional development and staying current with industry standards.

### Areas for Improvement:
1. **Specificity in Skills**: While the skills listed are relevant, providing examples of how she has applied these skills in her previous roles could strengthen her resume further.

2. **References**: While stating that references are available upon request is standard, including a couple of testimonials or notable endorsements could enhance credibility.

3. **Formatting**: Ensure that the resume is visually appealing and easy to read. Clear headings and bullet points help in quickly identifying key information.

### Conclusion:
Overall, Emily J. Wilson's resume reflects a well-rounded marketing professional with a proven track record of success. If her experience aligns with the specific needs of your Marketing department, she could be a valuable addition to your team. Consider inviting her for an interview to further assess her fit for the role.
```

## 다음 단계[​](#next-steps)

이 튜토리얼을 확장하려면 다음 단계를 시도해 보세요.

### 런타임에 로드된 여러 파일 처리하기[​](#process-multiple-files-loaded-at-runtime)

한 번의 플로우 실행에서 여러 파일을 처리하려면 수집하려는 각 파일마다 별도의 **Read File** 컴포넌트를 추가하세요. 그런 다음 스크립트를 수정하여 각 파일을 업로드하고, 반환된 각 파일 경로를 가져온 다음, 각 **Read File** 컴포넌트 ID에 고유한 파일 경로를 전달하세요.

예를 들어 여러 **Read File** 컴포넌트를 받아들이도록 `tweaks`를 수정할 수 있습니다.
다음 코드는 예시일 뿐이며 실제로 동작하는 코드가 아닙니다.

```python
## 여러 파일 경로 설정
file_paths = {
    FILE_COMPONENT_1: uploaded_path_1,
    FILE_COMPONENT_2: uploaded_path_2
}

def chat_with_flow(input_message, file_paths):
    """Compare the contents of these two files."""
    run_url = f"{LANGFLOW_SERVER_ADDRESS}/api/v1/run/{FLOW_ID}"
    # 두 파일 경로 모두로 tweaks 준비
    tweaks = {}
    for component_id, file_path in file_paths.items():
        tweaks[component_id] = {"path": file_path}
```

**Read File** 컴포넌트에 아카이브 파일을 전달하여 한 번에 여러 파일을 로드할 수도 있습니다.

### 런타임에 외부 파일 업로드하기[​](#upload-external-files-at-runtime)

로컬 환경이 아닌 다른 머신에서 파일을 업로드하려면 먼저 Langflow 서버가 인터넷을 통해 접근 가능해야 합니다. 그런 다음 인증된 사용자는 튜토리얼에서 보여준 것처럼 공개 Langflow 서버의 `/v2/files/` 엔드포인트에 파일을 업로드할 수 있습니다. 자세한 내용은 [Langflow 배포 개요](https://docs.langflow.org/deployment-overview)를 참조하세요.

### 채팅 세션 외부에서 파일 미리 로드하기[​](#preload-files-outside-the-chat-session)

**Read File** 컴포넌트를 사용하면 채팅 세션뿐만 아니라 플로우 어디에서든 파일을 로드할 수 있습니다.

비주얼 에디터에서는 로컬 머신이나 [Langflow 파일 관리](https://docs.langflow.org/concepts-file-management)에서 파일을 선택하여 **Read File** 컴포넌트에 미리 로드할 수 있습니다.

예를 들어 프롬프트 템플릿을 위한 안내 파일을 미리 로드하거나, Retrieval Augmented Generation(RAG) 플로우에서 쿼리하려는 문서로 벡터 스토어를 미리 로드할 수 있습니다.

**Read File** 컴포넌트와 다른 데이터 로딩 컴포넌트에 대한 자세한 내용은 [**Read File** 컴포넌트](https://docs.langflow.org/read-file)를 참조하세요.
