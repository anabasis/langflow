# Python 인터프리터

> 원문: https://docs.langflow.org/next/python-interpreter

이 컴포넌트를 사용하면 임포트한 패키지를 사용해 Python 코드를 실행할 수 있습니다.

**Python 인터프리터(Python Interpreter)** 컴포넌트는 Langflow 환경에 이미 설치된 패키지만 임포트할 수 있습니다.
패키지를 사용하려다 `ImportError`가 발생하면 먼저 해당 패키지를 설치해야 합니다.

커스텀 패키지를 설치하는 방법은 [커스텀 의존성 설치](https://docs.langflow.org/install-custom-dependencies)를 참고하세요.

## 플로우에서 Python 인터프리터 사용하기[​](#use-the-python-interpreter-in-a-flow "Use the Python Interpreter in a flow 항목으로 바로 가기")

1. 이 컴포넌트를 플로우에서 사용하려면 **Global Imports** 필드에 임포트하려는 패키지를 `math,pandas`와 같이 쉼표로 구분하여 입력합니다.
최소 하나의 임포트가 필요합니다.
2. **Python Code** 필드에 실행할 Python 코드를 입력합니다. 출력을 확인하려면 `print()`를 사용하세요.
3. 선택 사항: **Tool Mode**를 활성화한 다음, **Python 인터프리터** 컴포넌트를 도구로서 **Agent** 컴포넌트에 연결합니다.
예를 들어 **Python 인터프리터** 컴포넌트와 [**계산기** 컴포넌트](https://docs.langflow.org/calculator)를 **Agent** 컴포넌트의 도구로 연결한 다음, 에이전트가 수학 문제를 해결하기 위해 어떤 도구를 선택하는지 테스트해 볼 수 있습니다.
![Agent 컴포넌트에 연결된 Python 인터프리터와 계산기 컴포넌트](https://docs.langflow.org/assets/images/component-python-interpreter-1ef9e7dec643a216fd5e83c2139d09c9.png)
4. 에이전트에게 더 쉬운 수학 질문을 해봅니다.
**계산기** 도구는 덧셈, 뺄셈, 곱셈, 나눗셈, 거듭제곱 연산을 수행할 수 있습니다.
에이전트는 `evaluate_expression` 도구를 실행하여 질문에 올바르게 답합니다.


결과:

```
Executed evaluate_expression

Input:

{
  "expression": "2+5"
}

Output:

{
  "result": "7"
}
```

5. 에이전트에게 완전한 Python 코드를 제공합니다.
이 예시는 임포트한 `pandas` 패키지로 Pandas DataFrame 테이블을 생성하고, 제곱값 평균의 제곱근을 반환합니다.

```python
import pandas as pd
import math

# Create a simple DataFrame
df = pd.DataFrame({
    'numbers': [1, 2, 3, 4, 5],
    'squares': [x**2 for x in range(1, 6)]
})

# Calculate the square root of the mean
result = math.sqrt(df['squares'].mean())
print(f"Square root of mean squares: {result}")
```

에이전트는 문제를 해결하기 위해 `run_python_repl` 도구를 올바르게 선택합니다.

결과:

```
Executed run_python_repl

Input:

{
  "python_code": "import pandas as pd\nimport math\n\n# Create a simple DataFrame\ndf = pd.DataFrame({\n    'numbers': [1, 2, 3, 4, 5],\n    'squares': [x**2 for x in range(1, 6)]\n})\n\n# Calculate the square root of the mean\nresult = math.sqrt(df['squares'].mean())\nprint(f\"Square root of mean squares: {result}\")"
}

Output:

{
  "result": "Square root of mean squares: 3.3166247903554"
}
```

채팅에서 패키지 임포트를 포함하지 않아도, **Python 인터프리터** 컴포넌트의 **Global Imports** 필드에서 `pandas` 패키지가 전역으로 임포트되어 있기 때문에 에이전트는 여전히 `pd.DataFrame`을 사용해 테이블을 만들 수 있습니다.

## Python 인터프리터에 입력 전달하기[​](#pass-inputs-to-the-python-interpreter "Pass inputs to the Python Interpreter 항목으로 바로 가기")

**Python 인터프리터** 컴포넌트에 입력을 전달하려면 컴포넌트의 코드를 커스터마이즈하여 입력 필드를 추가해야 합니다.
컴포넌트 코드에 입력 필드가 추가되면 다른 컴포넌트와 연결할 수 있는 포트가 활성화됩니다.
예를 들어 [**Text** 컴포넌트](https://docs.langflow.org/text-input-and-output)를 연결하여 URL 값을 **Python 인터프리터** 컴포넌트에 전달하려면 다음과 같이 하세요.

1. 플로우에 **Python 인터프리터** 컴포넌트를 추가합니다.

2. **Python 인터프리터** 컴포넌트의 코드를 수정하려면 **Edit Code**를 클릭합니다.

3. **Python 인터프리터** 컴포넌트에 URL 입력을 전달하려면 코드를 다음과 같이 변경합니다.

    a. `inputs` 목록에 URL 입력 필드를 추가합니다. 이렇게 하면 다른 컴포넌트가 연결할 수 있는 입력 포트가 생성됩니다.

    b. `get_globals` 메서드를 업데이트하여 URL 값을 추출하고 globals 딕셔너리에 추가합니다.
이렇게 하면 컴포넌트의 Python 코드에서 `url` 변수를 사용할 수 있게 됩니다.

    c. 기본 Python 코드 값을 업데이트하여 `url` 변수를 사용하도록 합니다.

    다음 예시는 이러한 수정 사항을 보여줍니다.

**Python 코드 예시**

```python
import importlib

from langchain_experimental.utilities import PythonREPL
from lfx.custom.custom_component.component import Component
from lfx.io import MultilineInput, Output, StrInput
from lfx.schema.data import Data
from lfx.schema.message import Message  # Needed to extract text from Message objects

class PythonREPLComponent(Component):
    display_name = "Python Interpreter"
    description = "Run Python code with optional imports. Use print() to see the output."
    documentation: str = "https://docs.langflow.org/python-interpreter"
    icon = "square-terminal"

    inputs = [
        StrInput(
            name="global_imports",
            display_name="Global Imports",
            info="A comma-separated list of modules to import globally, e.g. 'math,numpy,pandas'.",
            value="math,pandas",
            required=True,
        ),
        MultilineInput(
            name="python_code",
            display_name="Python Code",
            info="The Python code to execute. Only modules specified in Global Imports can be used. Use 'url' variable if URL input is connected.",
            value="print(f'URL: {url}')",  # Updated to make the URL variable available to the Python code execution
            input_types=["Message"],
            tool_mode=True,
            required=True,
        ),
        # Add the URL input field to inputs list
        StrInput(
            name="url",
            display_name="URL",
            info="URL variable that can be used in Python code. Connect a Text component or enter manually.",
            value="",
            input_types=["Text", "Message"],
            required=False,
        ),
    ]

    outputs = [
        Output(
            display_name="Results",
            name="results",
            type_=Data,
            method="run_python_repl",
        ),
    ]

    def get_globals(self, global_imports: str | list[str]) -> dict:
        """Create a globals dictionary with only the specified allowed imports and input variables."""
        global_dict = {}

        try:
            if isinstance(global_imports, str):
                modules = [module.strip() for module in global_imports.split(",")]
            elif isinstance(global_imports, list):
                modules = global_imports
            else:
                msg = "global_imports must be either a string or a list"
                raise TypeError(msg)

            for module in modules:
                try:
                    imported_module = importlib.import_module(module)
                    global_dict[imported_module.__name__] = imported_module
                except ImportError as e:
                    msg = f"Could not import module {module}: {e!s}"
                    raise ImportError(msg) from e

            # Add the URL variable to the component's globals dictionary
            # Extract from Message object or use the string directly
            if hasattr(self, "url") and self.url:
                url_value = self.url.text if isinstance(self.url, Message) else str(self.url)
                if url_value:
                    global_dict["url"] = url_value  # Makes 'url' available in Python code
                    self.log(f"URL variable set: {url_value}")

        except Exception as e:
            self.log(f"Error in global imports: {e!s}")
            raise
        else:
            self.log(f"Successfully imported modules: {list(global_dict.keys())}")
            return global_dict

    def run_python_repl(self) -> Data:
        try:
            # Extract Python code text if it's a Message object
            python_code_text = self.python_code
            if isinstance(python_code_text, Message):
                python_code_text = python_code_text.text if python_code_text.text else ""
            elif not isinstance(python_code_text, str):
                python_code_text = str(python_code_text)

            globals_ = self.get_globals(self.global_imports)
            python_repl = PythonREPL(_globals=globals_)
            result = python_repl.run(python_code_text)
            result = result.strip() if result else ""

            self.log("Code execution completed successfully")
            return Data(data={"result": result})

        except ImportError as e:
            error_message = f"Import Error: {e!s}"
            self.log(error_message)
            return Data(data={"error": error_message})

        except SyntaxError as e:
            error_message = f"Syntax Error: {e!s}"
            self.log(error_message)
            return Data(data={"error": error_message})

        except (NameError, TypeError, ValueError) as e:
            error_message = f"Error during execution: {e!s}"
            self.log(error_message)
            return Data(data={"error": error_message})

    def build(self):
        return self.run_python_repl
```

4. 수정 내용을 저장하려면 **Check & Save**를 클릭합니다.

5. 플로우에 **Text** 컴포넌트를 추가하고 값을 `google.com`처럼 설정합니다.

6. **Text** 컴포넌트의 출력을 커스터마이즈한 **Python 인터프리터** 컴포넌트의 새로운 **URL** 입력 필드에 연결합니다.

이제 **Python 인터프리터** 컴포넌트는 실행하는 Python 코드에서 `url` 변수를 사용할 수 있습니다.

## Python 인터프리터 파라미터[​](#python-interpreter-parameters "Python Interpreter parameters 항목으로 바로 가기")

| Name            | Type   | Description                                                                                         |
| --------------- | ------ | ----------------------------------------------------------------------------------------------------- |
| global_imports | String | 입력 파라미터. `math,pandas,numpy`와 같이 전역으로 임포트할 모듈의 쉼표 구분 목록입니다. |
| python_code    | Code   | 입력 파라미터. 실행할 Python 코드입니다. Global Imports에 지정된 모듈만 사용할 수 있습니다.  |
| results         | JSON   | 출력 파라미터. 실행된 Python 코드의 출력으로, 출력된 결과나 오류를 포함합니다.  |
