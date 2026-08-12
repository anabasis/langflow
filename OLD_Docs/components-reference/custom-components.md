# 커스텀 Python 컴포넌트 만들기

API 통합부터 데이터 처리까지 Langflow에 필요한 기능을 추가하기 위한 커스텀 컴포넌트를 만들 수 있습니다.

Langflow의 노드 기반 환경에서 각 노드는 개별 기능을 수행하는 "컴포넌트"입니다. Langflow의 커스텀 컴포넌트는 다음을 기반으로 합니다:

- `Component`를 상속하는 Python 클래스
- 컴포넌트를 식별하고 설명하는 클래스 수준 속성
- 데이터 흐름을 결정하는 입력 및 출력 목록
- 컴포넌트의 동작과 로직을 정의하는 메서드

---

## 커스텀 컴포넌트 빠른 시작

### Python 파일 만들기

1. 컴포넌트를 위한 Python 파일을 만듭니다 (예: `dataframe_processor.py`).

2. `Component` 클래스의 객체로 컴포넌트를 작성합니다:

```python
from typing import Any, Dict, Optional
import pandas as pd
from lfx.custom.custom_component.component import Component

class DataFrameProcessor(Component):
    """다양한 작업으로 pandas DataFrames를 처리하는 컴포넌트."""

    display_name: str = "DataFrame Processor"
    description: str = "다양한 작업으로 pandas DataFrames를 처리하고 변환합니다."
    documentation: str = "https://docs.langflow.org/components-dataframe-processor"
    icon: str = "DataframeIcon"
    priority: int = 100
    name: str = "dataframe_processor"

    inputs = []
    outputs = []

    def some_output_method(self):
        return ...
```

클래스 속성:
- `display_name`: 비주얼 에디터에 표시되는 사용자 친화적 이름
- `description`: 컴포넌트 기능 설명
- `documentation`: 상세 문서 링크
- `icon`: 시각적 표현을 위한 이모지 또는 아이콘 식별자 (Lucide 아이콘)
- `priority`: 표시 순서 제어 옵션. 낮은 번호가 먼저 표시됨
- `name`: 클래스 이름으로 기본 설정되는 선택적 내부 식별자

### 커스텀 컴포넌트 저장

컴포넌트는 카테고리 폴더 안에 배치되어야 합니다:

```
src/lfx/src/lfx/components/
└── data/          # 카테고리 폴더 (메뉴 위치 결정)
    ├── __init__.py  # 필수 - Python 패키지로 만듦
    └── dataframe_processor.py  # 커스텀 컴포넌트 파일
```

`LANGFLOW_COMPONENTS_PATH` 환경 변수를 사용하는 경우:

```
/your/custom/components/path/
└── category_name/
    ├── __init__.py
    └── custom_component.py
```

### `__init__.py` 파일 만들기

각 카테고리 디렉토리에는 Langflow가 컴포넌트를 올바르게 인식하고 로드할 수 있도록 `__init__.py` 파일이 **반드시** 포함되어야 합니다:

```python
from .dataframe_processor import DataFrameProcessor

__all__ = ["DataFrameProcessor"]
```

---

## 입력 및 출력

### 입력

입력은 클래스 수준 `inputs` 목록에 정의됩니다. 예시:

```python
from lfx.io import StrInput, BoolInput, DropdownInput

inputs = [
    StrInput(name="title", display_name="Title"),
    BoolInput(name="enabled", display_name="Enabled", value=True),
    DropdownInput(name="mode", display_name="Mode", options=["Fast", "Safe", "Experimental"], value="Safe")
]
```

- `StrInput`: 텍스트 입력 필드 (접근: `self.title`)
- `BoolInput`: 불리언 토글 (접근: `self.enabled`)
- `DropdownInput`: 드롭다운 선택 메뉴 (접근: `self.mode`)

### 출력

출력은 클래스 수준 `outputs` 목록에 정의됩니다:

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
    df = DataFrame({"col1": [1, 2], "col2": [3, 4]})
    self.status = f"Built DataFrame with {len(df)} rows."
    return df
```

#### 여러 출력이 있는 컴포넌트

컴포넌트는 여러 출력을 정의할 수 있습니다. `group_outputs` 매개변수로 동작 제어:

- `group_outputs=False` (기본값): 출력이 그룹화되어 사용자가 하나를 선택
- `group_outputs=True`: 모든 출력을 동시에 사용 가능

### Tool Mode

`tool_mode=True`를 설정하면 커스텀 컴포넌트가 **Tool Mode**를 지원할 수 있습니다:

```python
inputs = [
    MessageTextInput(
        name="message",
        display_name="Message",
        info="도구가 직접 처리할 메시지 입력",
        tool_mode=True,
    ),
]
```

---

## 오류 처리 및 로깅

```python
# 표준 예외 발생
def compute_result(self) -> str:
    if not self.user_input:
        raise ValueError("입력이 제공되지 않았습니다.")

# 오류를 JSON으로 반환 (플로우 계속 진행)
def run_model(self) -> Data:
    try:
        # ...
    except Exception as e:
        return Data(data={"error": str(e)})

# 상태 메시지 설정
def parse_data(self) -> Data:
    # ...
    self.status = f"Parsed {len(rows)} rows successfully."

# 출력 중지
def some_output(self) -> Data:
    if not self.user_input:
        self.stop("some_output")

# 컴포넌트 로그
def process_file(self, file_path: str):
    self.log(f"Processing file {file_path}")
```

---

## 동적 필드 활성화

`dynamic=True`와 `real_time_refresh=True`를 사용하여 사용자 상호작용에 따라 입력 필드를 변경하거나 표시/숨길 수 있습니다:

```python
from lfx.custom import Component
from lfx.io import DropdownInput, StrInput

class RegexRouter(Component):
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
            dynamic=True,
            show=False,
        ),
    ]

    def update_build_config(self, build_config: dict, field_value: str, field_name: str | None = None) -> dict:
        if field_name == "operator":
            build_config["regex_pattern"]["show"] = (field_value == "regex")
        return build_config
```

---

## Langflow에 커스텀 컴포넌트 기여

커스텀 컴포넌트를 Langflow 프로젝트에 기여하려면 [컴포넌트 기여 가이드](../community/contribute.md)를 참조하세요.

---

*원문: https://docs.langflow.org/next/components-custom-components*
