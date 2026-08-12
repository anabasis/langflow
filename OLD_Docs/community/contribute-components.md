# 컴포넌트 기여하기

새 컴포넌트는 [`Component`](https://github.com/langflow-ai/langflow/blob/main/src/lfx/src/lfx/custom/custom_component/component.py) 클래스의 객체로 추가됩니다.

의존성은 [pyproject.toml](https://github.com/langflow-ai/langflow/blob/main/pyproject.toml) 파일에 추가됩니다.

---

## Langflow에 예제 컴포넌트 기여

예를 들어 **DataFrame processor**라는 새 데이터 컴포넌트를 만들려면:

1. 컴포넌트의 Python 파일을 만듭니다 (예: `dataframe_processor.py`).

2. `Component` 클래스의 객체로 컴포넌트를 작성합니다:

```python
from typing import Any, Dict, Optional
import pandas as pd
from lfx.custom.custom_component.component import Component

class DataFrameProcessor(Component):
    """pandas DataFrames를 다양한 작업으로 처리하는 컴포넌트."""

    display_name: str = "DataFrame Processor"
    description: str = "필터링, 정렬, 집계 등 다양한 작업으로 pandas DataFrame을 처리하고 변환합니다."
    documentation: str = "https://docs.langflow.org/components-dataframe-processor"
    icon: str = "DataframeIcon"
    priority: int = 100
    name: str = "dataframe_processor"

    # 입력 및 출력 목록
    inputs = []
    outputs = []

    # 메서드
    def some_output_method(self):
        return ...
```

3. `dataframe_processor.py`를 `src/lfx/src/lfx/components` 디렉토리에 저장합니다.

4. 컴포넌트 의존성을 `src/lfx/src/lfx/components/data/__init__.py`에 추가합니다.

5. 새 의존성을 `pyproject.toml` 파일에 추가합니다.

6. 풀 리퀘스트로 변경 사항을 제출합니다.

---

## 컴포넌트 수정 모범 사례

### 클래스 이름 또는 `name` 속성 변경 금지

클래스 이름이나 `name` 속성을 변경하면 모든 기존 사용자의 컴포넌트가 손상됩니다. 내부 이름이 필요한 경우 이전 컴포넌트를 `legacy=true`로 표시하고 새 컴포넌트를 만듭니다:

```python
class MyCustomComponent(BaseComponent):
    name = "my_custom_component_internal"
    legacy = True
```

### 필드 및 출력 제거 금지

필드나 출력을 제거하면 엣지가 연결 해제되고 컴포넌트 동작이 변경될 수 있습니다. 대신 필드를 `deprecated`로 표시하고 같은 위치에 유지합니다.

### 구식 컴포넌트를 레거시로 유지

컴포넌트를 업데이트할 때 이전 컴포넌트를 레거시 버전으로 유지하면서 완전히 별개의 개체로 만듭니다. 항상 이전 버전과의 호환성을 보장합니다.

### 비동기 메서드 선호

컴포넌트에서 항상 비동기 메서드와 함수를 선호합니다. 파일과 상호작용할 때 더 나은 성능과 호환성을 위해 `aiofile`과 `anyio.Path`를 사용합니다.

### 테스트 포함

`ComponentTestBase` 클래스를 사용하여 변경 사항에 대한 테스트를 포함합니다.

---

## 예제 풀 리퀘스트 흐름

1. 컴포넌트를 만들거나 업데이트합니다.
2. `ComponentTestBase` 클래스를 사용하여 테스트를 만듭니다.
3. 구식 필드와 출력을 `deprecated`로 표시하고 같은 위치에 유지합니다.
4. 변경 사항을 문서화하고 주요 변경 사항이 있는 경우 마이그레이션 지침을 포함합니다.

---

*원문: https://docs.langflow.org/next/contributing-components*
