# 에이전트를 위한 도구 설정
> 원문: https://docs.langflow.org/next/agents-tools

기본적으로 [Langflow 에이전트](https://docs.langflow.org/agents)는 기본 LLM에 내장된 기능만 포함합니다.

에이전트에 도구를 연결하여 추가적이고 목적에 맞는 기능에 접근할 수 있게 할 수 있습니다.
예를 들어, 도구는 회사의 지식 베이스에 접근할 수 있는 고객 지원 에이전트, 주가를 조회할 수 있는 금융 에이전트, 복잡한 방정식을 풀기 위해 고급 수학 함수를 사용할 수 있는 수학 튜터 에이전트와 같은 특정 도메인 에이전트를 만드는 데 사용될 수 있습니다.

## 도구 연결하기[​](#attach-tools "Direct link to Attach tools")

에이전트에 도구를 연결하려면 컴포넌트의 **Tool** 출력을 **Agent** 컴포넌트의 **Tools** 입력에 연결하면 됩니다.

일부 컴포넌트는 기본적으로 **Tool** 출력을 내보냅니다.
다른 모든 컴포넌트의 경우 [컴포넌트의 헤더 메뉴](https://docs.langflow.org/concepts-components#component-menus)에서 **Tool Mode**를 활성화해야 합니다.
그런 다음 해당 도구를 에이전트에 연결할 수 있습니다.

하나의 에이전트에 여러 도구를 연결할 수 있으며, 각 도구는 에이전트가 호출할 수 있는 여러 작업(함수)을 가질 수 있습니다.

플로우를 실행하면, 에이전트는 도구가 사용자 프롬프트에 응답하는 데 도움이 될 것이라고 판단할 경우 특정 도구를 호출할 시점을 결정합니다.

### 도구의 작업 편집하기[​](#edit-a-tools-actions "Direct link to Edit a tool's actions")

컴포넌트를 도구로 에이전트에 연결하면, 각 도구는 에이전트가 호출할 수 있는 여러 작업(함수)을 가질 수 있습니다.
사용 가능한 작업은 각 도구 컴포넌트의 **Actions** 목록에 나열됩니다.

에이전트가 도구를 사용하는 방법을 이해하고 관련 없거나 원치 않는 작업을 사용하지 않도록 하기 위해 각 작업의 레이블, 설명, 사용 가능 여부를 변경할 수 있습니다.

tip

에이전트가 도구를 잘못 사용하는 것 같다면, 작업의 메타데이터를 편집하여 도구의 목적을 명확히 하고 불필요한 작업을 비활성화해 보세요.

**Prompt Template** 컴포넌트를 사용하여 에이전트에게 추가 지침이나 예시를 전달해 보는 것도 좋습니다.

도구의 작업을 보고 편집하려면 도구 컴포넌트에서 **Edit Tool Actions**를 클릭하세요.

각 작업에 대해 다음 정보가 제공됩니다.

- **Enabled**: 작업이 에이전트에서 사용 가능한지 여부를 결정하는 체크박스입니다.
선택하면 작업이 활성화됩니다.
선택하지 않으면 작업이 비활성화됩니다.

- **Name**: `Fetch Content`와 같은 작업의 사람이 읽을 수 있는 문자열 이름입니다. 이 값은 변경할 수 없습니다.

- **Description**: `Fetch content from web pages recursively`와 같은 작업 목적에 대한 사람이 읽을 수 있는 설명입니다.
이 값을 편집하려면 작업 행을 더블클릭하여 편집 창을 엽니다.
필드 밖을 클릭하거나 대화 상자를 닫으면 변경 사항이 자동으로 저장됩니다.

- **Slug**: `fetch_content`와 같이 보통 이름과 동일하지만 스네이크 케이스로 된 작업의 인코딩된 이름입니다.
이 값을 편집하려면 작업 행을 더블클릭하여 편집 창을 엽니다.
필드 밖을 클릭하거나 대화 상자를 닫으면 변경 사항이 자동으로 저장됩니다.

일부 작업은 입력값에 고정된 값을 제공할 수 있게 합니다.
일반적으로는 에이전트가 자체적으로 값을 제공하도록 이 필드를 비워두는 것이 좋습니다.
그러나 에이전트의 동작을 디버깅하려 하거나 사용 사례상 작업에 고정된 입력이 필요한 경우에는 고정 값을 사용할 수 있습니다.

## 에이전트를 도구로 사용하기[​](#use-an-agent-as-a-tool "Direct link to Use an agent as a tool")

멀티 에이전트 플로우를 만들려면, 다른 **Agent** 컴포넌트를 **Tool Mode**로 설정한 다음 해당 에이전트를 기본 **Agent** 컴포넌트의 도구로 연결하면 됩니다.

직접 시도해 보려면 **Simple Agent** 템플릿에 에이전트를 하나 더 추가해 보세요.

1. **Simple Agent** 템플릿을 기반으로 플로우를 만듭니다.

2. 플로우에 두 번째 **Agent** 컴포넌트를 추가합니다.

3. 두 **Agent** 컴포넌트 모두에 **OpenAI API Key**를 추가합니다.

4. 두 번째 **Agent** 컴포넌트에서 모델을 `gpt-4.1`로 변경한 다음 **Tool Mode**를 활성화합니다.

5. [도구의 작업을 편집](#edit-a-tools-actions)하려면 **Edit Tool Actions**를 클릭합니다.

    이 예시에서는 작업의 슬러그를 `Agent-gpt-41`로 변경하고, 설명을 `Use the gpt-4.1 model for complex problem solving`으로 설정합니다.
이렇게 하면 기본 에이전트가 이 도구가 `gpt-4.1` 모델을 사용한다는 것을 알게 되어, 대규모 스크래핑 및 검색 작업처럼 더 큰 컨텍스트 윈도우가 필요한 작업에 도움이 될 수 있습니다.

    또 다른 예로, 특정 작업이나 도메인에 대해 학습된 에이전트처럼 여러 전문화된 모델을 기본 에이전트에 연결한 다음, 기본 에이전트가 질의에 응답하기 위해 필요할 때마다 각 전문화된 에이전트를 호출하도록 할 수 있습니다.

    사용 가능한 도구 세트를 제한하고 싶다면 도구를 활성화하거나 비활성화할 수도 있습니다.

6. 새 에이전트의 **Toolset** 포트를 기존 에이전트의 **Tools** 포트에 연결합니다.

    ![도구로 사용되는 에이전트](https://docs.langflow.org/assets/images/agent-example-agent-as-tool-769c67697334395efdc08e0c9393ac7f.png)

## 커스텀 컴포넌트를 도구로 추가하기[​](#components-as-tools "Direct link to Add custom components as tools")

에이전트는 [커스텀 컴포넌트](https://docs.langflow.org/components-custom-components)를 도구로 사용할 수 있습니다.

1. 에이전트 플로우에 커스텀 컴포넌트를 추가하려면 **Core components** 또는 **Bundles** 메뉴에서 **New Custom Component**를 클릭합니다.

2. **Code** 창에 Python 코드를 입력하여 커스텀 컴포넌트를 만듭니다.

    커스텀 컴포넌트를 위한 코드가 아직 없다면, 직접 만들기 전에 예시로 다음 코드 스니펫을 사용할 수 있습니다.

**Text Analyzer 커스텀 컴포넌트**

  
      이 코드는 텍스트 분석기 컴포넌트를 생성합니다.

  
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

        # Perform text analysis
        word_count = len(text.split())
        char_count = len(text)
        sentence_count = len(re.findall(r'\w+[.!?]', text))

        # Transform text
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

5. **Playground**를 열고 에이전트에게 `Use the text analyzer on this text: "Agents really are thinking machines!"`라고 지시합니다.

    지시에 따라 에이전트는 `analyze_text` 작업을 호출하고 결과를 반환해야 합니다.
예를 들면 다음과 같습니다.

  
```
gpt-4o
Finished
0.6s
Here is the analysis of the text "Agents really are thinking machines!":
Original Text: Agents really are thinking machines!
Word Count: 5
Character Count: 36
Sentence Count: 1
Reversed Text: !senihcam gnikniht era yllaer stnegA
Uppercase Text: AGENTS REALLY ARE THINKING MACHINES!
```

## 모든 컴포넌트를 도구로 만들기[​](#make-any-component-a-tool "Direct link to Make any component a tool")

도구로 사용하려는 컴포넌트에 **Tool Mode** 버튼이 없는 경우, 컴포넌트의 입력 중 하나에 `tool_mode=True`를 추가하고 새로 생긴 **Toolset** 출력을 에이전트의 **Tools** 입력에 연결하세요.

Langflow는 다음 데이터 타입에 대해 **Tool Mode**를 지원합니다.

- `DataInput`
- `DataFrameInput`
- `PromptInput`
- `MessageTextInput`
- `MultilineInput`
- `DropdownInput`


예를 들어, [커스텀 컴포넌트를 도구로 사용하기](#components-as-tools)의 예시 코드에서는 `MessageTextInput` 입력에 `tool_mode=True`를 포함하여 커스텀 컴포넌트를 도구로 사용할 수 있도록 했습니다.

```python
inputs = [
    MessageTextInput(
        name="input_text",
        display_name="Input Text",
        info="Enter text to analyze",
        value="Hello, World!",
        tool_mode=True,
    ),
]
```

## 플로우를 도구로 사용하기[​](#use-flows-as-tools "Direct link to Use flows as tools")

에이전트는 [**Run Flow** 컴포넌트](https://docs.langflow.org/run-flow)를 통해 다른 플로우를 도구로 사용할 수 있습니다.

1. 플로우에 **Run Flow** 컴포넌트를 추가합니다.
2. 에이전트가 도구로 사용할 플로우를 선택합니다.
3. **Tool Mode**를 활성화합니다.
선택한 플로우는 **Run Flow** 컴포넌트에서 [작업(action)](#edit-a-tools-actions)이 됩니다.
4. **Run Flow** 컴포넌트의 **Tool** 출력을 **Agent** 컴포넌트의 **Tools** 입력에 연결합니다.
5. **Playground**를 열고 에이전트에게 `What tools are you using to answer my questions?`라고 질문합니다. 응답에서 해당 플로우가 사용 가능한 도구로 표시되어야 합니다.
6. 연결된 플로우를 구체적으로 사용하는 질문을 에이전트에게 합니다.
연결된 플로우는 질문에 기반한 답변을 반환합니다.


![도구로 Agent 컴포넌트에 연결된 Run Flow 컴포넌트](https://docs.langflow.org/assets/images/agent-example-run-flow-as-tool-51573ecc32ec62f213e75cfaccd66ba6.png)

## 참고[​](#see-also "Direct link to See also")

- [Agent 컴포넌트](https://docs.langflow.org/components-agents)
- [Langflow를 MCP 클라이언트로 사용하기](https://docs.langflow.org/mcp-client)
- [Langflow를 MCP 서버로 사용하기](https://docs.langflow.org/mcp-server)
