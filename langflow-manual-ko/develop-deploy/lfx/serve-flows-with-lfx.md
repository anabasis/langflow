# LFX로 플로우 서비스하기

> 원문: https://docs.langflow.org/next/lfx-serve

`lfx serve`는 FastAPI 서버를 시작하여 플로우를 `POST /flows/{flow_id}/run`에서 HTTP API 엔드포인트로 노출합니다.

`lfx serve`는 공개적으로 접근 가능한 서버를 시작하므로 `LANGFLOW_API_KEY`가 필요합니다.

플로우를 한 번 실행하고 결과를 `stdout`으로 스트리밍하려면 [LFX로 플로우 실행하기](https://docs.langflow.org/next/lfx-run)를 참고하세요.

`lfx serve`와 `lfx run` 모두 `.json` 플로우 파일이나 `.py` Python 스크립트를 받습니다.

## 사전 준비[​](#prerequisites "Direct link to Prerequisites")

- [LFX 설치하기](https://docs.langflow.org/next/lfx-install)

- 플로우 JSON 파일. 저장소에서 Simple Agent 스타터 플로우를 다운로드합니다.

```bash
curl -o simple-agent-flow.json "https://raw.githubusercontent.com/langflow-ai/langflow/main/src/backend/base/langflow/initial_setup/starter_projects/Simple%20Agent.json"  
```

- 플로우에 필요한 API 키. Simple Agent 플로우는 OpenAI를 사용하며, `OPENAI_API_KEY`가 필요합니다.

## 플로우 의존성 설치하기[​](#install-dependencies "Direct link to Install flow dependencies")

`uv pip install lfx`와 `uvx lfx`는 LFX 엔진만 설치합니다. 플로우를 실행하기 전에 플로우의 컴포넌트를 제공하는 **확장(extension)**을 설치하세요.

컴포넌트가 없으면 LFX는 설치할 번들 이름을 힌트로 제공하는 `component-not-found` 오류를 보고합니다. 예를 들면:

```text
component-not-found-with-hint: DuckDuckGoSearchComponent not found.  
Hint: try ext:duckduckgo:DuckDuckGoSearchComponent@official  
```

힌트의 번들 이름을 사용하여 [번들 목록](https://docs.langflow.org/next/extensions-bundle-list)에서 pip 패키지를 찾으세요.

자세한 내용은 [번들 컴포넌트와 함께 LFX 설치하기](https://docs.langflow.org/next/lfx-install#install-with-bundle-components)를 참고하세요.

### requirements.txt 생성하기[​](#generate-requirementstxt "Direct link to Generate requirements.txt")

확장 패키지는 컴포넌트 코드를 다룹니다. 일부 플로우는 실행 시 추가 Python 패키지(해당 컴포넌트가 임포트하는 서드파티 SDK)를 여전히 필요로 합니다.

플로우 JSON 파일에서 이를 목록화하려면 [`lfx requirements`](https://docs.langflow.org/next/flow-devops-sdk#generate-requirementstxt-for-flows)를 사용합니다.

```bash
lfx requirements simple-agent-flow.json  
```

플로우를 실행하기 전에 동일한 환경에 보고된 패키지를 설치하세요.

## 서버 시작하기[​](#start-the-server "Direct link to Start the server")

1. Langflow API 키를 생성합니다.

    LFX의 경우 로컬에서 안전한 토큰을 생성합니다.

```bash
uv run python -c "import secrets; print(secrets.token_urlsafe(32))"  
```

    이는 Langflow UI나 CLI를 통해 API 키를 생성하여 Langflow 데이터베이스에 저장하는 것과는 다릅니다. LFX는 요청을 인증하기 위한 안전한 토큰 문자열만 필요로 합니다.

2. 환경 변수를 설정합니다. `.env` 파일을 사용하거나 직접 export합니다.

    **`.env` 파일**:

```text
LANGFLOW_API_KEY="sk..."  
OPENAI_API_KEY="sk-..."  
```

    **Export**:

```bash
export LANGFLOW_API_KEY="sk..."  
export OPENAI_API_KEY="sk-..."  
```

3. 플로우와 함께 서버를 시작합니다.

    **`.env` 파일 사용**:

```bash
uv run lfx serve simple-agent-flow.json --env-file .env  
```

    **export된 변수 사용**:

```bash
uv run lfx serve simple-agent-flow.json  
```

4. 시작 출력에서 `flow_id`를 복사합니다.

```text
LFX Server  
Flow loaded: simple-agent-flow.json (c1dab29d-3364-58ef-8fef-99311d32ee42)  
Server:      http://127.0.0.1:8000  
Run flows at: POST /flows/{flow_id}/run  
API key:     x-api-key header or ?x-api-key= query parameter  
```

## 서버 호출하기[​](#call-the-server "Direct link to Call the server")

새 터미널에서 API 키와 플로우 ID를 설정한 뒤 테스트 요청을 보냅니다.

```bash
export LANGFLOW_API_KEY="sk..."  
export FLOW_ID="c1dab29d-3364-58ef-8fef-99311d32ee42"  
```

- Python
- JavaScript
- curl

```python
import os  

import requests  

flow_id = os.environ["FLOW_ID"]  
api_key = os.environ["LANGFLOW_API_KEY"]  

url = f"http://localhost:8000/flows/{flow_id}/run"  

headers = {  
    "Content-Type": "application/json",  
    "x-api-key": api_key,  
}  

payload = {  
    "input_value": "Hello, world!",  
}  

response = requests.post(url, headers=headers, json=payload, timeout=60)  
response.raise_for_status()  
print(response.text)  
```

## 여러 플로우 서비스하기[​](#serve-multiple-flows "Direct link to Serve multiple flows")

여러 플로우를 서비스하려면, 디렉터리를 `lfx serve`에 전달하여 서버 시작 시 모든 `.json` 플로우를 로드합니다.

```bash
uv run lfx serve ./flows/  
```

## 로드되는 컴포넌트 제어하기[​](#control-which-components-load "Direct link to Control which components load")

LFX는 기본적으로 모든 컴포넌트 카테고리를 로드합니다. 환경 변수를 사용하여 플로우 로드 시 사용 가능한 카테고리를 제한할 수 있습니다.

| 변수                                   | 설명                                                                                   |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `LANGFLOW_​COMPONENT_​CATEGORY_​ALLOWLIST` | **포함**할 카테고리 이름의 쉼표 구분 목록. 비어 있으면 모든 카테고리가 포함됩니다. |
| `LANGFLOW_​COMPONENT_​CATEGORY_​BLOCKLIST` | **제외**할 카테고리 이름의 쉼표 구분 목록. allowlist 이후에 적용됩니다.           |

카테고리 이름은 대소문자를 구분하지 않습니다. allowlist나 blocklist의 가상 키워드 `core`는 모든 핵심 컴포넌트 카테고리로 확장됩니다.

컴포넌트 카테고리 이름은 Langflow 비주얼 에디터에 표시되는 레이블과 항상 일치하지는 않습니다.
컴포넌트 카테고리를 확인하려면 [번들 목록](https://docs.langflow.org/next/extensions-bundle-list)을 참고하세요.

특정 카테고리로 컴포넌트를 제한하려면:

```bash
export LANGFLOW_COMPONENT_CATEGORY_ALLOWLIST="openai,anthropic,processing,input_output"  
uv run lfx serve my_flow.json  
```

특정 카테고리를 제외하려면:

```bash
export LANGFLOW_COMPONENT_CATEGORY_BLOCKLIST="prototypes,langchain_utilities"  
uv run lfx run my_flow.json "Hello"  
```

핵심 카테고리만 허용하려면:

```bash
export LANGFLOW_COMPONENT_CATEGORY_ALLOWLIST="core"  
uv run lfx serve my_flow.json  
```

## 참고 자료[​](#see-also "Direct link to See also")

- [LFX로 플로우 실행하기](https://docs.langflow.org/next/lfx-run)
- [LFX 소개](https://docs.langflow.org/next/lfx-overview)
- [LFX 설치하기](https://docs.langflow.org/next/lfx-install)
- [Flow DevOps Toolkit SDK](https://docs.langflow.org/next/flow-devops-sdk)
- [확장 기능 개요](https://docs.langflow.org/next/extensions-overview)
