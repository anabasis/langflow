# LFX로 플로우 실행하기

> 원문: https://docs.langflow.org/next/lfx-run

`lfx run`은 플로우를 한 번 실행하고 결과를 `stdout`으로 스트리밍합니다. API 키는 필요하지 않습니다.

플로우를 HTTP 엔드포인트로 대신 노출하려면 [LFX로 플로우 서비스하기](https://docs.langflow.org/next/lfx-serve)를 참고하세요.

`lfx run`과 `lfx serve` 모두 `.json` 플로우 파일이나 `.py` Python 스크립트를 받습니다.

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

## 플로우 실행하기[​](#run-a-flow "Direct link to Run a flow")

JSON 파일로부터 플로우를 실행하려면:

```bash
uv run lfx run simple-agent-flow.json "Hello world"  
```

또는 `--input-value` 플래그를 사용합니다.

```bash
uv run lfx run simple-agent-flow.json --input-value "Hello world"  
```

### 플로우를 제공하는 다른 방법[​](#other-ways-to-provide-a-flow "Direct link to Other ways to provide a flow")

`stdin`으로부터 플로우 JSON을 실행하려면:

```bash
cat simple-agent-flow.json | uv run lfx run --stdin \  
  --input-value "Hello world" \  
  --format json | jq '.result'  
```

원격 API로부터 플로우를 가져와 실행하려면:

```bash
curl https://api.example.com/flows/my-agent-flow | uv run lfx run --stdin \  
  --input-value "Hello world"  
```

플로우를 실행 전에 수정하려면(예: 모델을 `gpt-4o`로 변경):

```bash
cat simple-agent-flow.json | jq '(.data.nodes[] | select(.data.node.template.model_name.value) | .data.node.template.model_name.value) = "gpt-4o"' | \  
  uv run lfx run --stdin \  
  --input-value "Hello world" \  
  --format json | jq '.result'  
```

플로우 JSON을 문자열 인자로 직접 전달하려면:

```bash
uv run lfx run --flow-json '{"data": {"nodes": [...], "edges": [...]}}' \  
  --input-value "Hello world"  
```

## Python 스크립트로부터 플로우 실행하기[​](#run-a-flow-from-a-python-script "Direct link to Run a flow from a Python script")

JSON 파일 외에도 `lfx run`은 프로그래밍 방식으로 플로우를 정의하는 `.py` Python 스크립트를 받습니다.

`simple_agent.py` 파일을 생성합니다.

```python
"""A simple agent flow example.  

Usage:  
    uv run lfx run simple_agent.py "How are you?"  
"""  

import os  
from pathlib import Path  

from lfx import components as cp  
from lfx.graph import Graph  
from lfx.log.logger import LogConfig  

async def get_graph() -> Graph:  
    log_config = LogConfig(  
        log_level="INFO",  
        log_file=Path("langflow.log"),  
    )  

    chat_input = cp.ChatInput()  
    agent = cp.AgentComponent()  
    url_component = cp.URLComponent()  
    tools = await url_component.to_toolkit()  

    agent.set(  
        model_name="gpt-4.1-mini",  
        agent_llm="OpenAI",  
        api_key=os.getenv("OPENAI_API_KEY"),  
        input_value=chat_input.message_response,  
        tools=tools,  
    )  
    chat_output = cp.ChatOutput().set(input_value=agent.message_response)  

    return Graph(chat_input, chat_output, log_config=log_config)  
```

플로우를 실행합니다.

```bash
uv run lfx run simple_agent.py "How are you?" --verbose  
```

더 많은 예제는 [PyPI의 Complete Agent Example](https://pypi.org/project/lfx)을 참고하세요.

## lfx run 옵션[​](#lfx-run-options "Direct link to lfx run options")

| 옵션                                       | 설명                                                                                                  |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `--check-variables` / `--no-check-variables` | 플로우의 전역 변수를 검증합니다. 기본값: 검증함.                                                        |
| `--flow-json`                                | 인라인 JSON 플로우 콘텐츠를 문자열로 로드합니다.                                                                   |
| `--format`, `-f`                             | 출력 형식: `json`, `text`, `message`, 또는 `result`. 기본값: `json`.                                      |
| `--input-value`                              | 그래프에 전달할 입력 값. `--stdin` 및 `--flow-json`과 함께 사용 시 필수.                                 |
| `--session-id`                               | 대화 추적을 위한 세션 ID. 설정하지 않으면 자동 생성됩니다.                                                             |
| `--stdin`                                    | `stdin`으로부터 JSON 플로우 콘텐츠를 읽습니다.                                                                         |
| `--timing`                                   | 출력에 상세한 타이밍 정보를 포함합니다.                                                               |
| `--upgrade-flow`                             | 호환성 모드: `check`는 문제를 보고하고 실패하며, `safe`는 실행 전에 메모리 상에서 안전한 업그레이드를 적용합니다. |
| `--verbose`, `-v`                            | 기본 진행 상황과 진단 출력을 표시합니다.                                                               |
| `-vv`                                        | 상세한 진행 상황과 디버그 정보를 표시합니다.                                                               |
| `-vvv`                                       | 컴포넌트 로그를 포함한 전체 디버깅 출력을 표시합니다.                                                               |

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

- [LFX로 플로우 서비스하기](https://docs.langflow.org/next/lfx-serve)
- [LFX 소개](https://docs.langflow.org/next/lfx-overview)
- [LFX 설치하기](https://docs.langflow.org/next/lfx-install)
- [Flow DevOps Toolkit SDK](https://docs.langflow.org/next/flow-devops-sdk)
- [확장 기능 개요](https://docs.langflow.org/next/extensions-overview)
