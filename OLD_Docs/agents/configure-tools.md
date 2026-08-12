# 에이전트용 도구 구성

기본적으로 [Langflow 에이전트](./use-agents.md)는 기본 LLM에 내장된 기능만 포함합니다.

에이전트에 도구를 연결하여 추가적이고 특화된 기능에 접근할 수 있습니다.
예를 들어 도구를 사용하여 회사의 지식 베이스에 접근할 수 있는 고객 지원 에이전트, 주식 가격을 검색할 수 있는 금융 에이전트, 또는 복잡한 방정식을 풀기 위해 고급 수학 함수를 사용할 수 있는 수학 튜터 에이전트와 같은 도메인별 에이전트를 만들 수 있습니다.

---

## 도구 연결

에이전트에 도구를 연결하려면 컴포넌트의 **Tool** 출력을 **Agent** 컴포넌트의 **Tools** 입력에 연결합니다.

일부 컴포넌트는 기본적으로 **Tool** 출력을 내보냅니다.
다른 모든 컴포넌트의 경우 [컴포넌트의 헤더 메뉴](../components-reference/components-overview.md)에서 **Tool Mode**를 활성화해야 합니다.
그런 다음 도구를 에이전트에 연결할 수 있습니다.

하나의 에이전트에 여러 도구를 연결할 수 있으며, 각 도구는 에이전트가 호출할 수 있는 여러 액션(함수)을 가질 수 있습니다.

플로우를 실행하면 에이전트는 도구가 사용자의 프롬프트에 응답하는 데 도움이 될 것이라고 판단할 때 특정 도구를 호출하기로 결정합니다.

### 도구 액션 편집

에이전트에 컴포넌트를 도구로 연결하면 각 도구는 에이전트가 호출할 수 있는 여러 액션(함수)을 가질 수 있습니다.
사용 가능한 액션은 각 도구 컴포넌트의 **Actions** 목록에 나열됩니다.

각 액션의 레이블, 설명, 가용성을 변경하여 에이전트가 도구 사용 방법을 이해하고 관련 없거나 원치 않는 액션을 사용하지 못하도록 할 수 있습니다.

> **팁**: 에이전트가 도구를 잘못 사용하는 것 같으면 액션 메타데이터를 편집하여 도구의 목적을 명확히 하고 불필요한 액션을 비활성화해 보세요.

도구 컴포넌트에서 **Edit Tool Actions**를 클릭하여 도구의 액션을 확인하고 편집합니다.

각 액션에 대해 다음 정보가 제공됩니다:

- **Enabled**: 액션을 에이전트에게 사용 가능하게 할지 결정하는 체크박스
- **Name**: `Fetch Content`와 같이 액션에 대한 사람이 읽을 수 있는 이름 (변경 불가)
- **Description**: `Fetch content from web pages recursively`와 같은 설명. 행을 더블 클릭하여 편집합니다.
- **Slug**: `fetch_content`와 같이 액션의 인코딩된 이름. 행을 더블 클릭하여 편집합니다.

---

## 에이전트를 도구로 사용

멀티 에이전트 플로우를 만들려면 다른 **Agent** 컴포넌트를 **Tool Mode**로 설정한 후 해당 에이전트를 주 **Agent** 컴포넌트의 도구로 연결할 수 있습니다.

직접 시도해보려면 **Simple Agent** 템플릿에 추가 에이전트를 추가합니다:

1. **Simple Agent** 템플릿을 기반으로 플로우를 만듭니다.
2. 플로우에 두 번째 **Agent** 컴포넌트를 추가합니다.
3. 두 **Agent** 컴포넌트 모두에 **OpenAI API Key**를 추가합니다.
4. 두 번째 **Agent** 컴포넌트에서 모델을 `gpt-4.1`로 변경하고 **Tool Mode**를 활성화합니다.
5. **Edit Tool Actions**를 클릭하여 도구 액션을 편집합니다.
   이 예제에서는 액션의 슬러그를 `Agent-gpt-41`로 변경하고 설명을 `Use the gpt-4.1 model for complex problem solving`으로 설정합니다.
6. 새 에이전트의 **Toolset** 포트를 기존 에이전트의 **Tools** 포트에 연결합니다.

---

## 커스텀 컴포넌트를 도구로 추가

에이전트는 [커스텀 컴포넌트](../components-reference/components-custom-components.md)를 도구로 사용할 수 있습니다.

1. **Core components** 또는 **Bundles** 메뉴에서 **New Custom Component**를 클릭합니다.
2. **Code** 패인에 Python 코드를 입력하여 커스텀 컴포넌트를 만듭니다.

**Text Analyzer 커스텀 컴포넌트 예제:**

```python
from langflow.custom import Component
from langflow.io import MessageTextInput, Output
from langflow.schema import Data
import re

class TextAnalyzerComponent(Component):
    display_name = "Text Analyzer"
    description = "Analyzes and transforms input text."
    documentation: str = "http://docs.langflow.org/components/custom"
    icon = "chart-bar"
    name = "TextAnalyzerComponent"

    inputs = [
        MessageTextInput(
            name="input_text",
            display_name="Input Text",
            info="Enter text to analyze",
            value="Hello, World!",
            tool_mode=True,
        ),
    ]

    outputs = [
        Output(display_name="Analysis Result", name="output", method="analyze_text"),
    ]

    def analyze_text(self) -> Data:
        text = self.input_text
        word_count = len(text.split())
        char_count = len(text)
        sentence_count = len(re.findall(r'\w+[.!?]', text))
        reversed_text = text[::-1]
        uppercase_text = text.upper()

        analysis_result = {
            "original_text": text,
            "word_count": word_count,
            "character_count": char_count,
            "sentence_count": sentence_count,
            "reversed_text": reversed_text,
            "uppercase_text": uppercase_text
        }

        data = Data(value=analysis_result)
        self.status = data
        return data
```

3. 커스텀 컴포넌트에서 **Tool Mode**를 활성화합니다.
4. 커스텀 컴포넌트의 도구 출력을 **Agent** 컴포넌트의 **Tools** 입력에 연결합니다.
5. **플레이그라운드**를 열고 에이전트에게 `Use the text analyzer on this text: "Agents really are thinking machines!"`라고 지시합니다.

---

## 모든 컴포넌트를 도구로 만들기

사용하려는 컴포넌트에 **Tool Mode** 버튼이 없으면, 컴포넌트의 입력 중 하나에 `tool_mode=True`를 추가하고 새 **Toolset** 출력을 에이전트의 **Tools** 입력에 연결합니다.

Langflow는 다음 데이터 유형에 대해 **Tool Mode**를 지원합니다:
- `DataInput`
- `DataFrameInput`
- `PromptInput`
- `MessageTextInput`
- `MultilineInput`
- `DropdownInput`

---

## 플로우를 도구로 사용

에이전트는 [**Run Flow** 컴포넌트](https://docs.langflow.org/run-flow)를 사용하여 다른 플로우를 도구로 사용할 수 있습니다.

1. 플로우에 **Run Flow** 컴포넌트를 추가합니다.
2. 에이전트가 도구로 사용할 플로우를 선택합니다.
3. **Tool Mode**를 활성화합니다.
4. **Run Flow** 컴포넌트의 **Tool** 출력을 **Agent** 컴포넌트의 **Tools** 입력에 연결합니다.
5. **플레이그라운드**를 열고 에이전트에게 `What tools are you using to answer my questions?`라고 물어봅니다.

---

## 참고 항목

- [에이전트 컴포넌트](../components-reference/components-agents.md)
- [Langflow를 MCP 클라이언트로 사용](../mcp/mcp-client.md)
- [Langflow를 MCP 서버로 사용](../mcp/mcp-server.md)

---

*원문: https://docs.langflow.org/next/agents-tools*
