# 컴포넌트 기여하기

> 원문: https://docs.langflow.org/next/contributing-components

새 컴포넌트는 [`Component`](https://github.com/langflow-ai/langflow/blob/main/src/lfx/src/lfx/custom/custom_component/component.py) 클래스의 객체로 추가됩니다.

종속성은 [pyproject.toml](https://github.com/langflow-ai/langflow/blob/main/pyproject.toml) 파일에 추가됩니다.

## Langflow에 예제 컴포넌트 기여하기[​](#contribute-an-example-component-to-langflow "Direct link to Contribute an example component to Langflow")

누구나 예제 컴포넌트를 기여할 수 있습니다. 예를 들어, **DataFrame processor**라는 새로운 데이터 컴포넌트를 만들어 Langflow에 기여하려면 다음 단계를 따르세요.

1. 컴포넌트를 위한 Python 파일을 만듭니다. 예: `dataframe_processor.py`.

2. 컴포넌트를 [`Component`](https://github.com/langflow-ai/langflow/blob/main/src/backend/base/langflow/custom/custom_component/component.py) 클래스의 객체로 작성합니다. `Component`를 상속하는 새 클래스를 만들고 베이스 클래스의 메서드를 오버라이드합니다.

  하위 호환성
      Langflow 1.7부터 `lfx` import 경로가 `import from langflow.custom import Component`를 대체했지만, 기존 입력 방식도 여전히 호환되며 동일하게 작동합니다.

```python
from typing import Any, Dict, Optional
import pandas as pd
from lfx.custom.custom_component.component import Component

class DataFrameProcessor(Component):
    """A component that processes pandas DataFrames with various operations."""
```

3. 커스텀 컴포넌트에 대한 정보를 제공하는 클래스 속성을 정의합니다.

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
  - `display_name`: 비주얼 에디터에 표시되는 사용자 친화적인 이름.
  - `description`: 컴포넌트가 하는 일에 대한 간략한 설명.
  - `documentation`: 상세 문서로 연결되는 링크.
  - `icon`: 시각적 표현을 위한 이모지 또는 아이콘 식별자.
Langflow는 아이콘에 [Lucide](https://lucide.dev/icons)를 사용합니다. 컴포넌트에 아이콘을 지정하려면 icon 속성에 Lucide 아이콘 이름을 문자열로 지정하세요. 예: `icon = "file-text"`. Langflow는 Lucide 라이브러리의 아이콘을 자동으로 렌더링합니다.
자세한 내용은 [번들 기여하기](https://docs.langflow.org/contributing-bundles#add-the-bundle-to-the-frontend-folder)를 참고하세요.
  - `priority`: 표시 순서를 제어하는 선택적 정수. 숫자가 작을수록 먼저 표시됩니다.
  - `name`: 클래스 이름을 기본값으로 사용하는 선택적 내부 식별자.

4. 입력, 출력, 그리고 이를 처리하는 메서드를 지정하여 컴포넌트의 인터페이스를 정의합니다. 메서드 이름은 출력 목록의 `method` 필드와 일치해야 하는데, 이는 Langflow가 각 출력을 생성하기 위해 호출할 메서드를 알아내는 방식이기 때문입니다.

    이 예제는 최소한의 커스텀 컴포넌트 골격을 만듭니다.

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

5. `dataframe_processor.py`를 `src/lfx/src/lfx/components` 디렉터리에 저장합니다.
이 예제는 데이터 컴포넌트를 추가하는 것이므로 `/data` 디렉터리에 추가합니다.

6. 컴포넌트 종속성을 `src/lfx/src/lfx/components/data/__init__.py`에 `from .DataFrameProcessor import DataFrameProcessor`로 추가합니다.
Langflow 저장소의 [/data/**init**.py](https://github.com/langflow-ai/langflow/blob/dev/src/lfx/src/lfx/components/data/__init__.py)를 참고할 수 있습니다.

7. 새로운 종속성을 [pyproject.toml](https://github.com/langflow-ai/langflow/blob/main/pyproject.toml#L20) 파일에 추가합니다.

8. 컴포넌트에 대한 문서를 제출합니다. 이 예제 컴포넌트의 경우, [Data components 페이지](https://github.com/langflow-ai/langflow/blob/main/docs/docs/Components/components-data.mdx)에 문서를 제출하면 됩니다.

9. 변경 사항을 풀 리퀘스트로 제출합니다. Langflow 팀이 검토하고, 변경을 제안하고, 여러분의 컴포넌트를 Langflow에 추가합니다.

## 컴포넌트 수정 시 모범 사례[​](#best-practices-for-modifying-components "Direct link to Best practices for modifying components")

컴포넌트를 만들거나 업데이트할 때는 하위 호환성을 유지하고 사용자에게 원활한 경험을 제공하기 위해 다음 모범 사례를 따르세요.

### 클래스나 `name` 속성의 이름을 변경하지 마세요[​](#dont-rename-the-class-or-name-attribute "Direct link to dont-rename-the-class-or-name-attribute")

클래스 이름이나 `name` 속성을 변경하면 기존 사용자 전체에서 컴포넌트가 깨집니다. 이는 프런트엔드가 클래스 이름이나 `name` 속성으로 설정되는 `type` 속성을 검사하기 때문입니다. 이 이름들이 변경되면 해당 컴포넌트는 사실상 새로운 컴포넌트가 되고, 기존 컴포넌트는 사라집니다.

대신 다음과 같이 하세요.

- 기존 이름이 불명확한 경우 표시 이름만 변경하세요.
- 기능이 변경되었지만 여전히 관련이 있는 경우 표시 이름만 변경하세요.
- 새로운 내부 이름이 필요한 경우, 기존 컴포넌트를 `legacy=true`로 표시하고 새 컴포넌트를 만드세요.

예를 들면 다음과 같습니다.

```python
class MyCustomComponent(BaseComponent):
    name = "my_custom_component_internal"
    legacy = True
```

### 필드와 출력을 제거하지 마세요[​](#dont-remove-fields-and-outputs "Direct link to Don't remove fields and outputs")

필드나 출력을 제거하면 엣지 연결이 끊어지고 컴포넌트의 동작이 변경될 수 있습니다.

대신 필드를 `deprecated`로 표시하고 같은 위치에 유지하세요. 제거가 반드시 필요한 경우, 마이그레이션 계획을 정의하고 문서화해야 합니다. 필드 정보의 변경 사항은 항상 사용자에게 명확하게 전달하세요.

### 오래된 컴포넌트는 legacy로 유지 관리하세요[​](#maintain-outdated-components-as-legacy "Direct link to Maintain outdated components as legacy")

컴포넌트를 업데이트할 때는 완전히 별개의 엔티티로 만들면서 기존 컴포넌트는 legacy 버전으로 유지하세요. 항상 하위 호환성을 보장하고, `LCModelComponent`와 같은 베이스 클래스에서 메서드와 속성을 제거하지 마세요.

### 비동기 메서드를 우선시하세요[​](#favor-asynchronous-methods "Direct link to Favor asynchronous methods")

컴포넌트에서는 항상 비동기 메서드와 함수를 우선시하세요. 파일과 상호작용할 때는 더 나은 성능과 호환성을 위해 `aiofile`과 `anyio.Path`를 사용하세요.

### 컴포넌트에 테스트를 포함하세요[​](#include-tests-with-your-component "Direct link to Include tests with your component")

`ComponentTestBase` 클래스를 사용하여 변경 사항에 대한 테스트를 포함하세요. 자세한 내용은 [컴포넌트 테스트 기여하기](https://docs.langflow.org/contributing-component-tests)를 참고하세요.

### 문서화[​](#documentation "Direct link to Documentation")

풀 리퀘스트에서 변경 사항을 문서화할 때는 *무엇이* 변경되었는지(예: 표시 이름 업데이트나 새 필드), *왜* 변경되었는지(예: 개선 또는 버그 수정), 그리고 기존 사용자에 대한 *영향*을 명확하게 설명하세요.

예를 들면 다음과 같습니다.

**예시 PR**

```
# Pull request with changes to Notify component

This pull request updates the Notify component.

## What changed
- Added new `timeout` field to control how long the component waits for a response.
- Renamed `message` field to `notification_text` for clarity.
- Added support for async operations.
- Deprecated the `retry_count` field in favor of `max_retries`.

## Why it changed
- `timeout` field addresses user requests for better control over wait times.
- `message` to `notification_text` change makes the field's purpose clearer.
- Async support improves performance in complex flows.
- `retry_count` to `max_retries` aligns with common retry pattern terminology.

## Impact on users
- New `timeout` field is optional (defaults to 30 seconds).
- Users will see a deprecation warning for `retry_count`.
  - Migration: Replace `retry_count` with `max_retries` in existing flows.
  - Both fields will work until version 2.0.
- No action needed for async support - it's backward compatible.
```

## 풀 리퀘스트 흐름 예시[​](#example-pull-request-flow "Direct link to Example pull request flow")

1. 컴포넌트를 만들거나 업데이트합니다.
목적이 동일하게 유지된다면 클래스 이름과 `name` 속성을 유지하세요.
그렇지 않다면 새 컴포넌트를 만들고 기존 컴포넌트를 `legacy`로 옮기세요.
2. 테스트를 추가합니다.
`ComponentTestBase` 클래스 중 하나를 사용하여 테스트를 만드세요.
자세한 내용은 [컴포넌트 테스트 기여하기](https://docs.langflow.org/contributing-component-tests)를 참고하세요.
3. 오래된 필드와 출력을 `deprecated`로 표시하고 같은 위치에 유지하여 하위 호환성을 보장합니다.
4. 변경 사항을 문서화합니다.
호환성이 깨지는 변경 사항이 있는 경우 마이그레이션 안내를 포함하세요.
