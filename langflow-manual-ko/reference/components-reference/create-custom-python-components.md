# 커스텀 Python 컴포넌트 만들기

> 원문: https://docs.langflow.org/next/components-custom-components

API 통합부터 데이터 처리까지, Langflow에 필요한 모든 기능을 추가할 수 있는 자신만의 커스텀 컴포넌트를 만드세요.

Langflow의 노드 기반 환경에서 각 노드는 개별적인 기능을 수행하는 "컴포넌트"입니다.
Langflow의 커스텀 컴포넌트는 다음을 기반으로 구축됩니다.

- `Component`를 상속하는 Python 클래스.
- 컴포넌트를 식별하고 설명하는 클래스 수준의 속성.
- 데이터 흐름을 결정하는 [입력 및 출력 목록](#inputs-and-outputs).
- 컴포넌트의 동작과 로직을 정의하는 메서드.
- [오류 처리와 로깅](#error-handling-and-logging)을 위한 내부 변수.

예제 컴포넌트를 Langflow에 추가하려면 [커스텀 컴포넌트 빠른 시작](#quickstart)을 사용한 다음, 더 고급 컴포넌트 커스터마이징을 위해서는 이어지는 레퍼런스 가이드를 사용하세요.

## 커스텀 컴포넌트 빠른 시작[​](#quickstart "Custom component quickstart 항목으로 바로 가기")

Python 파일을 생성하고, 올바른 폴더에 저장하고, `__init__.py` 파일을 포함하고, Langflow에 로드하여 커스텀 `DataFrameProcessor` 컴포넌트를 만들어 봅니다.

### Python 파일 생성[​](#create-a-python-file "Create a Python file 항목으로 바로 가기")

1. `dataframe_processor.py`와 같이 컴포넌트를 위한 Python 파일을 생성합니다.

2. 컴포넌트를 [`Component`](https://github.com/langflow-ai/langflow/blob/main/src/backend/base/langflow/custom/custom_component/component.py) 클래스의 객체로 작성합니다. `Component`를 상속하는 새 클래스를 만들고 기본 클래스의 메서드를 오버라이드합니다.

  하위 호환성
      `lfx` 임포트 경로는 Langflow 1.7에서 `import from langflow.custom import Component`를 대체했지만, 기존 입력 방식도 여전히 호환되며 동일하게 동작합니다.

```python
from typing import Any, Dict, Optional
import pandas as pd
from lfx.custom.custom_component.component import Component

class DataFrameProcessor(Component):
    """A component that processes pandas DataFrames with various operations."""
```

3. 커스텀 컴포넌트에 대한 정보를 제공하기 위해 클래스 속성을 정의합니다.

```python
from typing import Any, Dict, Optional
import pandas as pd
from lfx.custom.custom_component.component import Component

class DataFrameProcessor(Component):
    """A component that processes pandas DataFrames with various operations."""

    display_name: str = "DataFrame Processor"
    description: str = "Process and transform pandas DataFrames with various operations like filtering, sorting, and aggregation."
    documentation: str = "https://docs.langflow.org/components-dataframe-processor"
    icon: str = "DataframeIcon"
    priority: int = 100
    name: str = "dataframe_processor"
```

  - `display_name`: 시각적 편집기에 표시되는 사용자 친화적인 이름입니다.
  - `description`: 컴포넌트가 수행하는 작업에 대한 간단한 설명입니다.
  - `documentation`: 상세 문서로 연결되는 링크입니다.
  - `icon`: 시각적 표현을 위한 이모지 또는 아이콘 식별자입니다.
Langflow는 아이콘으로 [Lucide](https://lucide.dev/icons)를 사용합니다. 컴포넌트에 아이콘을 지정하려면 `icon = "file-text"`처럼 icon 속성을 Lucide 아이콘의 이름(문자열)으로 설정하세요. Langflow는 Lucide 라이브러리의 아이콘을 자동으로 렌더링합니다.
자세한 내용은 [번들 기여하기](https://docs.langflow.org/contributing-bundles#add-the-bundle-to-the-frontend-folder)를 참고하세요.
  - `priority`: 표시 순서를 제어하는 선택적 정수입니다. 숫자가 작을수록 먼저 표시됩니다.
  - `name`: 클래스 이름으로 기본 설정되는 선택적 내부 식별자입니다.

4. 입력, 출력, 이를 처리할 메서드를 지정하여 컴포넌트의 인터페이스를 정의합니다. 메서드 이름은 출력 목록의 `method` 필드와 일치해야 하는데, 이것이 Langflow가 각 출력을 생성하기 위해 호출할 메서드를 아는 방법이기 때문입니다.

    이 예시는 최소한의 커스텀 컴포넌트 골격을 만듭니다.

```python
from typing import Any, Dict, Optional
import pandas as pd
from lfx.custom.custom_component.component import Component

class DataFrameProcessor(Component):
    """A component that processes pandas DataFrames with various operations."""

    display_name: str = "DataFrame Processor"
    description: str = "Process and transform pandas DataFrames with various operations like filtering, sorting, and aggregation."
    documentation: str = "https://docs.langflow.org/components-dataframe-processor"
    icon: str = "DataframeIcon"
    priority: int = 100
    name: str = "dataframe_processor"

    # input and output lists
    inputs = []
    outputs = []

    # method
    def some_output_method(self):
        return ...
```

### 커스텀 컴포넌트 저장[​](#custom-component-path "Save the custom component 항목으로 바로 가기")

UI가 커스텀 컴포넌트를 찾아 로드할 수 있도록 Langflow 디렉터리에 저장합니다.

기본적으로 Langflow는 `src/lfx/src/lfx/components` 디렉터리에서 커스텀 컴포넌트를 찾습니다.

기본 디렉터리에 컴포넌트를 저장할 때는, 시각적 편집기에서 제대로 로드되고 표시되려면 특정 디렉터리 구조로 구성되어야 합니다.

컴포넌트는 기본 디렉터리에 직접 두지 않고 카테고리 폴더 안에 두어야 합니다.

카테고리 폴더 이름은 Langflow **코어 컴포넌트** 메뉴에서 컴포넌트가 표시될 위치를 결정합니다.
예를 들어 예제 `DataFrameProcessor` 컴포넌트를 **Data** 카테고리에 추가하려면 `data` 하위 폴더에 배치합니다.

```text
src/lfx/src/lfx/components/
    └── data/                      # Category folder (determines menu location)
        ├── __init__.py            # Required - makes it a Python package
        └── dataframe_processor.py # Your custom component file
```

`LANGFLOW_COMPONENTS_PATH` [환경 변수](https://docs.langflow.org/environment-variables)를 사용하여 다른 위치에 커스텀 컴포넌트를 만드는 경우에도, 시각적 편집기에 표시되려면 유사한 디렉터리 구조로 구성되어야 합니다.

```text
/your/custom/components/path/    # Base directory set by LANGFLOW_COMPONENTS_PATH
    └── category_name/
        ├── __init__.py
        └── custom_component.py
```

각 폴더 안에 여러 컴포넌트를 두고, 여러 카테고리 폴더로 컴포넌트를 다른 카테고리로 구성할 수 있습니다.

```text
/app/custom_components/
    ├── data/
    │   ├── __init__.py
    │   ├── custom_component.py
    │   └── dataframe_processor.py
    └── tools/
        ├── __init__.py
        └── custom_tool.py
```

디렉터리 깊이 제한

컴포넌트는 최대 2단계 깊이까지 허용됩니다.

예를 들어 `data/custom_component.py`는 발견되지만 `data/tools/custom_component.py`는 발견되지 않습니다.

깊이 제한을 늘리려면 `src/lfx/src/lfx/custom/directory_reader/directory_reader.py`의 `MAX_DEPTH`를 수정하세요. 하위 디렉터리는 여전히 중첩된 계층이 아니라 별도의 카테고리로 표시됩니다.

### `__init__.py` 파일 생성[​](#create-the-__init__py-file "Create the __init__.py file 항목으로 바로 가기")

각 카테고리 디렉터리에는 Langflow가 컴포넌트를 올바르게 인식하고 로드할 수 있도록 `__init__.py` 파일이 **반드시** 있어야 합니다.
이는 디렉터리가 모듈로 취급되도록 보장하는 Python 패키지 요구 사항입니다.

`DataFrameProcessor` 컴포넌트를 포함하려면, 컴포넌트 디렉터리에 다음 내용으로 `__init__.py`라는 파일을 만드세요.

```python
from .dataframe_processor import DataFrameProcessor

__all__ = ["DataFrameProcessor"]
```

**DataFrameProcessor 컴포넌트 지연 로드하기**

또는 성능에 더 유리하지만 조금 더 복잡한 **지연 로드(lazy load)** 방식을 사용할 수 있습니다.

```python
from __future__ import annotations

from typing import TYPE_CHECKING, Any

from lfx.components._importing import import_mod

if TYPE_CHECKING:
    from lfx.components.data.dataframe_processor import DataFrameProcessor

_dynamic_imports = {
    "DataFrameProcessor": "dataframe_processor",
}

__all__ = [
    "DataFrameProcessor",
]

def __getattr__(attr_name: str) -> Any:
    """Lazily import data components on attribute access."""
    if attr_name not in _dynamic_imports:
        msg = f"module '{__name__}' has no attribute '{attr_name}'"
        raise AttributeError(msg)
    try:
        result = import_mod(attr_name, _dynamic_imports[attr_name], __spec__.parent)
    except (ModuleNotFoundError, ImportError, AttributeError) as e:
        msg = f"Could not import '{attr_name}' from '{__name__}': {e}"
        raise AttributeError(msg) from e
    globals()[attr_name] = result
    return result

def __dir__() -> list[str]:
    return list(__all__)
```

지연 로드에 대한 추가 예시는 [FAISS 컴포넌트](https://github.com/langflow-ai/langflow/blob/main/src/lfx/src/lfx/components/FAISS/__init__.py)를 참고하세요.

### 컴포넌트 로드하기[​](#load-your-component "Load your component 항목으로 바로 가기")

애플리케이션이 컴포넌트를 빌드하도록 합니다.

1. 백엔드와 프론트엔드를 재빌드하려면 `make install_frontend && make build_frontend && make install_backend && uv run langflow run --port 7860`을 실행합니다.

2. 프론트엔드 애플리케이션을 새로고침합니다.
새로운 `DataFrameProcessor` 컴포넌트가 시각적 편집기의 **코어 컴포넌트** 메뉴 아래 **Data** 카테고리에 표시됩니다.

### Docker 배포[​](#docker-deployment "Docker deployment 항목으로 바로 가기")

Docker에서 Langflow를 실행할 때는, 커스텀 컴포넌트 디렉터리를 마운트하고 `docker run` 명령에서 `LANGFLOW_COMPONENTS_PATH` 환경 변수를 커스텀 컴포넌트 디렉터리로 설정합니다.

```bash
docker run -d \
  --name langflow \
  -p 7860:7860 \
  -v ./custom_components:/app/custom_components \
  -e LANGFLOW_COMPONENTS_PATH=/app/custom_components \
  langflowai/langflow:latest
```

[커스텀 컴포넌트 저장](#custom-component-path)의 예시와 동일한 커스텀 컴포넌트 디렉터리 구조를 만드세요.

```text
/app/custom_components/          # LANGFLOW_COMPONENTS_PATH
    └── data/
        ├── __init__.py
        └── dataframe_processor.py
```

## 컴포넌트 실행 방식[​](#how-components-execute "How components execute 항목으로 바로 가기")

Langflow의 엔진은 다음을 관리합니다.

1. **인스턴스화(Instantiation)**: 컴포넌트가 생성되고 내부 구조가 초기화됩니다.
2. **입력 할당(Assigning Inputs)**: 시각적 편집기나 연결로부터의 값이 컴포넌트 필드에 할당됩니다.
3. **검증 및 설정(Validation and Setup)**: `_pre_run_setup`과 같은 선택적 훅.
4. **출력 생성(Outputs Generation)**: `run()` 또는 `build_results()`가 출력 메서드를 트리거합니다.

커스텀 컴포넌트 코드에서 이 선택적 훅을 오버라이드하여 실행을 커스터마이즈할 수 있습니다.

- **`_pre_run_setup()`** - **검증 및 설정** 단계에서 사용됩니다.
실행 시작 전에 컴포넌트 상태를 초기화하려면 컴포넌트 클래스 안에 이 메서드를 추가합니다.

```python
class MyComponent(Component):
    # ... your inputs, outputs, and other attributes ...

    def _pre_run_setup(self):
        if not hasattr(self, "_initialized"):
            self._initialized = True
            self.iteration = 0
```

- **`run` 또는 `_run` 오버라이드** - **출력 생성** 단계에서 사용됩니다.
주요 실행 로직을 커스터마이즈하려면 컴포넌트 클래스 안에 이 메서드를 추가합니다.

```python
class MyComponent(Component):

    async def_run(self):
        # Custom execution logic here
        # This runs instead of the default output method calls
        pass
```

- **`self.ctx`에 데이터 저장**.
메서드 호출 간에 데이터를 공유하려면 컴포넌트 메서드 어디서든 `self.ctx`를 사용하세요.

```python
class MyComponent(Component):

    def _pre_run_setup(self):
        # Initialize counter in setup
        self.ctx["processed_items"] = 0

    def process_data(self) -> Data:
        # Increment counter during processing
        self.ctx["processed_items"] += 1
        return Data(data={"item": f"processed {self.ctx['processed_items']}"})

    def get_summary(self) -> Data:
        # Access counter in different method
        total = self.ctx["processed_items"]
        return Data(data={"summary": f"Processed {total} items total"})
```

## 입력과 출력[​](#inputs-and-outputs "Inputs and outputs 항목으로 바로 가기")

입력과 출력은 데이터가 컴포넌트를 통해 흐르는 방식, 시각적 편집기에 표시되는 방식, 다른 컴포넌트와의 연결이 검증되는 방식을 정의하는 **클래스 수준의 구성**입니다.

### 입력[​](#inputs "Inputs 항목으로 바로 가기")

입력은 클래스 수준의 `inputs` 목록에서 정의됩니다. Langflow는 컴포넌트를 로드할 때 이 목록을 사용해 시각적 편집기에서 컴포넌트 필드와 [포트](https://docs.langflow.org/concepts-components#component-ports)를 렌더링합니다. 사용자나 다른 컴포넌트가 값이나 연결을 제공하여 이러한 입력을 채웁니다.

입력은 보통 `lfx.io`의 클래스(예: `StrInput`, `DataInput`, `MessageTextInput`) 인스턴스입니다.

예를 들어 다음 컴포넌트에는 텍스트 필드(`StrInput`), 불리언 토글(`BoolInput`), 드롭다운 선택(`DropdownInput`) 세 가지 입력이 있습니다.

```python
from lfx.io import StrInput, BoolInput, DropdownInput

inputs = [
    StrInput(name="title", display_name="Title"),
    BoolInput(name="enabled", display_name="Enabled", value=True),
    DropdownInput(name="mode", display_name="Mode", options=["Fast", "Safe", "Experimental"], value="Safe")
]
```

`StrInput`은 텍스트를 입력할 수 있는 한 줄 텍스트 필드를 생성합니다. `name="title"` 파라미터는 컴포넌트 메서드에서 `self.title`로 이 값을 접근한다는 의미이며, `display_name="Title"`은 시각적 편집기에서 "Title"이라는 라벨을 표시합니다.

`BoolInput`은 기본적으로 `value=True`로 활성화된 불리언 토글을 생성합니다. 사용자는 이를 켜거나 끌 수 있으며, `self.enabled`로 현재 상태를 접근합니다.

`DropdownInput`은 "Fast", "Safe", "Experimental"이라는 세 가지 사전 정의된 옵션이 있는 선택 메뉴를 제공합니다.
`value="Safe"`는 "Safe"를 기본 선택으로 설정하며, `self.mode`로 사용자의 선택을 접근합니다.

모든 사용 가능한 파라미터 목록은 Langflow 코드베이스의 [BaseInputMixin 정의](https://github.com/langflow-ai/langflow/blob/main/src/lfx/src/lfx/inputs/input_mixin.py)를 참고하세요.

모든 사용 가능한 입력 타입 목록은 Langflow 코드베이스의 [입력 타입 정의](https://github.com/langflow-ai/langflow/blob/main/src/lfx/src/lfx/inputs/inputs.py)를 참고하세요.

```python
from lfx.io import StrInput, DataInput, MultilineInput, IntInput, BoolInput, DropdownInput, FileInput, CodeInput, ModelInput, HandleInput, Output
```

### 출력[​](#outputs "Outputs 항목으로 바로 가기")

출력은 클래스 수준의 `outputs` 목록에서 정의됩니다. Langflow가 컴포넌트를 렌더링할 때, 각 출력은 시각적 편집기에서 커넥터 지점이 됩니다. 출력에 무언가를 연결하면 Langflow는 자동으로 해당 메서드를 호출하고 반환된 객체를 다음 컴포넌트에 전달합니다.

출력은 보통 `lfx.io`의 `Output` 인스턴스입니다.

예를 들어 다음 컴포넌트에는 `Table`을 반환하는 `output`이 하나 있습니다.

```python
from lfx.io import Output
from lfx.schema import DataFrame

outputs = [
    Output(
        name="df_out",
        display_name="DataFrame Output",
        method="build_df"
    )
]

def build_df(self) -> DataFrame:
    # Process data and return DataFrame
    df = DataFrame({"col1": [1, 2], "col2": [3, 4]})
    self.status = f"Built DataFrame with {len(df)} rows."
    return df
```

`Output`은 시각적 편집기에서 **DataFrame Output**이라는 라벨이 붙은 커넥터 지점을 만듭니다. `name="df_out"` 파라미터는 이 출력을 식별하고, `display_name="DataFrame Output"`은 UI에 라벨을 표시합니다. `method="build_df"` 파라미터는 이 출력이 다른 컴포넌트에 연결될 때 Langflow가 `build_df` 메서드를 호출하도록 지시합니다.

`build_df` 메서드는 데이터를 처리하고 `Table`을 반환합니다. `-> DataFrame` 타입 어노테이션은 Langflow가 연결을 검증하는 데 도움이 되며, 시각적 편집기에서 색상 코딩을 제공합니다. `self.status`를 설정하여 UI에 진행 상황 메시지를 표시할 수도 있습니다.

모든 사용 가능한 파라미터의 전체 목록은 Langflow 코드베이스의 [Output 클래스 정의](https://github.com/langflow-ai/langflow/blob/main/src/lfx/src/lfx/template/field/base.py)를 참고하세요. 일반적인 파라미터는 다음과 같습니다.

**추가 반환 타입:**

- **`Message`**: 구조화된 채팅 메시지
- **`JSON`**: `.data`와 선택적 `.text`를 가진 유연한 객체
- **`Table`**: 테이블 형태 데이터(pandas DataFrame 서브클래스)
- **기본 타입(Primitive types)**: `str`, `int`, `bool`, 타입 일관성을 위해 권장되지 않음

#### 연관된 메서드[​](#associated-methods "Associated methods 항목으로 바로 가기")

각 출력은 출력 메서드 이름이 메서드 이름과 일치해야 하는 메서드와 연결됩니다. 이 메서드는 일반적으로 `Message`, `JSON`, `Table` 같은 객체를 반환하며, `self.<input_name>`으로 입력을 사용할 수 있습니다.

예를 들어, 다음 `Output`은 연결될 때 `read_file` 메서드를 호출하는 `file_contents`라는 커넥터 지점을 정의합니다. `read_file` 메서드는 `self.filename`으로 파일 이름 입력에 접근하고, 파일 콘텐츠를 읽고, 상태 메시지를 설정한 다음, 콘텐츠를 `JSON` 객체로 감싸서 반환합니다.

```python
Output(
    name="file_contents",
    display_name="File Contents",
    method="read_file"
)

def read_file(self) -> Data:
    path = self.filename
    with open(path, "r") as f:
        content = f.read()
    self.status = f"Read {len(content)} chars from {path}"
    return Data(data={"content": content})
```

#### 여러 출력을 가진 컴포넌트[​](#components-with-multiple-outputs "Components with multiple outputs 항목으로 바로 가기")

컴포넌트는 여러 개의 출력을 정의할 수 있습니다.
각 출력은 서로 다른 메서드를 가질 수 있습니다.

예를 들면 다음과 같습니다.

```python
outputs = [
    Output(display_name="Processed Data", name="processed_data", method="process_data"),
    Output(display_name="Debug Info", name="debug_info", method="provide_debug_info"),
]
```

기본적으로 Langflow에서 여러 출력을 생성하는 컴포넌트는 시각적 편집기에서 하나의 출력만 선택할 수 있도록 허용합니다.
컴포넌트에는 사용자가 원하는 출력 타입을 선택할 수 있는 출력 포트가 하나만 있습니다.

이 동작은 `group_outputs` 파라미터로 제어됩니다.

- **`group_outputs=False` (기본값)**: 컴포넌트에 출력이 두 개 이상 있고 `group_outputs`가 `false`이거나 설정되지 않은 경우, 출력은 시각적 편집기에서 그룹화되며 사용자는 하나를 선택해야 합니다.

    컴포넌트가 플로우에서 사용될 때 한 가지 유형의 출력만 반환할 것으로 예상될 때 이 옵션을 사용하세요.

- **`group_outputs=True`**: 모든 출력을 동시에 시각적 편집기에서 사용할 수 있습니다. 컴포넌트에는 각 출력에 대한 출력 포트가 하나씩 있으며, 사용자는 0개 이상의 출력을 다른 컴포넌트에 연결할 수 있습니다.

    컴포넌트가 여러 값을 반환하고 이 값들이 다운스트림 컴포넌트나 프로세스에 병렬로 사용될 것으로 예상될 때 이 옵션을 사용하세요.

- False or not set
- True

이 예시에서 시각적 편집기는 단일 출력 포트를 제공하며, 사용자는 출력 중 하나를 선택할 수 있습니다.
`group_outputs=False`가 기본 동작이므로, 이 예시에서 보이듯이 컴포넌트에 명시적으로 설정할 필요가 없습니다.

```python
outputs = [
    Output(
        name="structured_output",
        display_name="Structured Output",
        method="build_structured_output",
    ),
    Output(
        name="dataframe_output",
        display_name="DataFrame Output",
        method="build_structured_dataframe",
    ),
]
```

### 도구 모드[​](#tool-mode "Tool mode 항목으로 바로 가기")

**Tool Mode**를 지원하는 컴포넌트는 (**Tool Mode**가 *아닐* 때) 독립형 컴포넌트로 사용되거나, **Agent** 컴포넌트와 같이 **Tools** 입력을 가진 다른 컴포넌트를 위한 도구로 사용될 수 있습니다.

`tool_mode=True`를 설정하면 커스텀 컴포넌트가 **Tool Mode**를 지원하도록 허용할 수 있습니다.

```python
inputs = [
    MessageTextInput(
        name="message",
        display_name="Mensage",
        info="Enter the message that will be processed directly by the tool",
        tool_mode=True,
    ),
]
```

## 타입 어노테이션[​](#typed-annotations "Typed annotations 항목으로 바로 가기")

Langflow에서 타입 어노테이션은 Langflow가 사용자를 시각적으로 안내하고 플로우 일관성을 유지할 수 있게 합니다.
시각적 편집기에서 올바른 색상 코딩과 검증을 활성화하려면 항상 출력 메서드에 `-> Data`, `-> Message`, `-> DataFrame`과 같은 반환 타입을 어노테이션하세요.
더 나은 일관성을 위해 일반 구조체를 반환하는 대신 `JSON`, `Message`, `Table` 래퍼를 사용하세요. 플로우를 예측 가능하고 구축하기 쉽게 만들려면 컴포넌트 전반에서 타입을 일관되게 유지하세요.

타입 어노테이션은 `-> Data`나 `-> Message`와 같은 출력에 고유한 색상을 부여하는 색상 코딩, 호환되지 않는 연결을 차단하는 자동 검증, 사용자가 컴포넌트 간 데이터 흐름을 빠르게 이해할 수 있는 향상된 가독성을 제공합니다.

### 일반적인 반환 타입[​](#common-return-types "Common return types 항목으로 바로 가기")

- Message
- Data
- DataFrame
- Primitive Types

채팅 스타일 출력을 위한 것입니다. 여러 `Message` 호환 입력 중 어느 것에도 연결됩니다.

```python
def produce_message(self) -> Message:
    return Message(text="Hello! from typed method!", sender="System")
```

## 동적 필드 활성화[​](#enable-dynamic-fields "Enable dynamic fields 항목으로 바로 가기")

**Langflow**에서 동적 필드를 사용하면 사용자의 상호작용에 따라 입력이 변경되거나 표시될 수 있습니다. `dynamic=True`를 설정하여 입력을 동적으로 만들 수 있습니다. 선택적으로 `real_time_refresh=True`를 설정하면 `update_build_config` 메서드가 트리거되어 실시간으로 입력의 표시 여부나 속성을 조정하며, 사용자의 선택에 따라 관련 필드만 노출하는 맥락 인식형 시각적 편집기 경험을 만듭니다.

이 예시에서 operator 필드는 `real_time_refresh=True`로 업데이트를 트리거합니다.
`regex_pattern` 필드는 처음에는 숨겨져 있으며 `dynamic=True`로 제어됩니다.

```python
from lfx.custom import Component
from lfx.io import DropdownInput, StrInput

class RegexRouter(Component):
    display_name = "Regex Router"
    description = "Demonstrates dynamic fields for regex input."

    inputs = [
        DropdownInput(
            name="operator",
            display_name="Operator",
            options=["equals", "contains", "regex"],
            value="equals",
            real_time_refresh=True,
        ),
        StrInput(
            name="regex_pattern",
            display_name="Regex Pattern",
            info="Used if operator='regex'",
            dynamic=True,
            show=False,
        ),
    ]
```

### 사용자 선택에 따라 필드 표시 또는 숨기기[​](#show-or-hide-fields-based-on-user-selections "Show or hide fields based on user selections 항목으로 바로 가기")

사용자가 `real_time_refresh=True`가 설정된 필드를 변경하면, Langflow는 `update_build_config` 메서드를 호출합니다.

이 메서드를 사용하면 사용자가 선택한 내용에 따라 다른 필드를 표시하거나, 숨기거나, 수정할 수 있습니다.

이 예시는 사용자가 operator 드롭다운에서 "regex"를 선택했을 때만 `regex_pattern` 필드를 표시합니다.

```python
def update_build_config(self, build_config: dict, field_value: str, field_name: str | None = None) -> dict:
    if field_name == "operator":
        if field_value == "regex":
            build_config["regex_pattern"]["show"] = True
        else:
            build_config["regex_pattern"]["show"] = False
    return build_config
```

`update_build_config`에서 `show`와 `hide` 외에도 추가 필드 속성을 수정할 수 있습니다.

- **`required`**: 필드를 동적으로 필수 또는 선택 사항으로 만듭니다.

```python
if field_value == "regex":
    build_config["regex_pattern"]["required"] = True
else:
    build_config["regex_pattern"]["required"] = False
```

- **`advanced`**: 필드를 "Advanced" 섹션으로 이동합니다.

```python
if field_value == "experimental":
    build_config["regex_pattern"]["advanced"] = False  # Show in main section
else:
    build_config["regex_pattern"]["advanced"] = True   # Hide in advanced
```

- **`options`**: 다른 선택에 따라 드롭다운 옵션을 변경합니다.

```python
if field_value == "regex":
    build_config["operator"]["options"] = ["regex", "contains", "starts_with"]
else:
    build_config["operator"]["options"] = ["equals", "contains", "not_equals"]
```

## 오류 처리 및 로깅[​](#error-handling-and-logging "Error handling and logging 항목으로 바로 가기")

검증이 실패할 때 `ValueError`와 같은 표준 Python 예외나 `ToolException`과 같은 전용 예외를 발생시킬 수 있습니다. Langflow는 이를 자동으로 포착하여 시각적 편집기에 적절한 오류 메시지를 표시함으로써, 사용자가 무엇이 잘못되었는지 빠르게 파악할 수 있게 도와줍니다.

```python
def compute_result(self) -> str:
    if not self.user_input:
        raise ValueError("No input provided.")
    # ...
```

또는 플로우를 갑자기 중단시키는 대신, `"error"` 필드를 포함하는 `JSON` 객체를 반환할 수 있습니다. 이 방식은 플로우가 계속 작동할 수 있게 하며, 다운스트림 컴포넌트가 오류를 감지하고 우아하게 처리할 수 있게 합니다.

```python
def run_model(self) -> Data:
    try:
        # ...
    except Exception as e:
        return Data(data={"error": str(e)})
```

Langflow는 컴포넌트 실행을 디버깅하고 관리하는 데 도움이 되는 여러 도구를 제공합니다. `self.status`를 사용하여 실행 결과에 대한 짧은 메시지를 시각적 편집기에 직접 표시하여 사용자가 문제를 해결하기 쉽게 만들 수 있습니다.

```python
def parse_data(self) -> Data:
# ...
self.status = f"Parsed {len(rows)} rows successfully."
return Data(data={"rows": rows})
```

`self.stop()`을 사용하면 특정 조건이 실패했을 때 같은 컴포넌트의 다른 출력을 중단시키지 않고 개별 출력 경로를 중단할 수 있습니다.

이 예시는 사용자 입력이 비어 있을 때 출력을 중단시켜, 컴포넌트가 유효하지 않은 데이터를 처리하지 못하도록 합니다.

```python
def some_output(self) -> Data:
if not self.user_input or len(self.user_input.strip()) == 0:
    self.stop("some_output")
    return Data(data={"error": "Empty input provided"})
```

`self.log()`를 사용하여 컴포넌트 내부에서 주요 실행 세부 정보를 기록할 수 있습니다. 이 로그는 구조화된 데이터로 저장되며 컴포넌트 상세 보기의 "Logs" 또는 "Events" 섹션에 표시되고, 시각적 편집기의 **Logs** 버튼이나 내보낸 파일을 통해 나중에 접근할 수 있습니다.

컴포넌트 로그는 Langflow의 메인 애플리케이션 로깅 시스템과는 별개입니다. `self.log()`는 UI에 표시되는 컴포넌트별 로그를 생성하는 반면, Langflow의 메인 로깅 시스템은 [structlog](https://www.structlog.org)를 사용하여 `langflow.log` 파일로 출력되는 애플리케이션 수준 로깅을 처리합니다. 자세한 내용은 [로그](https://docs.langflow.org/logging)를 참고하세요.

이 예시는 컴포넌트가 파일 처리를 시작할 때 메시지를 기록합니다.

```python
def process_file(self, file_path: str):
self.log(f"Processing file {file_path}")
```

## Langflow에 커스텀 컴포넌트 기여하기[​](#contribute-custom-components-to-langflow "Contribute custom components to Langflow 항목으로 바로 가기")

커스텀 컴포넌트를 Langflow 프로젝트에 기여하려면 [컴포넌트 기여하기](https://docs.langflow.org/contributing-components)를 참고하세요.
