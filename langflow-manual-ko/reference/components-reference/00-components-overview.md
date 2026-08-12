# 컴포넌트 개요

> 원문: https://docs.langflow.org/next/concepts-components

컴포넌트는 플로우를 구성하는 기본 단위입니다.
애플리케이션의 클래스와 마찬가지로 각 컴포넌트는 특정 사용 사례나 통합을 위해 설계되어 있습니다.

tip

Langflow는 워크스페이스를 위한 키보드 단축키를 제공합니다.

Langflow 헤더에서 프로필 아이콘을 클릭하고 **Settings**를 선택한 다음 **Shortcuts**를 클릭하면 사용 가능한 단축키를 확인할 수 있습니다.

## 플로우에 컴포넌트 추가하기[​](#component-menus "Direct link to Add a component to a flow")

플로우에 컴포넌트를 추가하려면 **Core components** 또는 **Bundles** 메뉴에서 컴포넌트를 [워크스페이스](https://docs.langflow.org/concepts-overview#workspace)로 드래그합니다.

컴포넌트는 유형이나 제공자별로 그룹화되어 있으며, 일부 컴포넌트는 기본적으로 숨겨져 있습니다.

- **Core components**: Langflow의 기본 컴포넌트로, **Inputs and Outputs** 또는 **Data**와 같이 목적별로 그룹화되어 있습니다.
이 컴포넌트들은 루프나 파싱과 같은 범용 기능을 제공하거나, 여러 서드파티 통합을 지원하는 단일 컴포넌트를 제공합니다.

- **Bundles**: 번들에는 특정 서드파티 통합을 지원하는 하나 이상의 컴포넌트가 포함되어 있으며, 서비스 제공자별로 그룹화되어 있습니다.

- **Legacy**: 이 컴포넌트들은 기본적으로 숨겨져 있습니다.
자세한 내용은 [레거시 컴포넌트](#legacy-components)를 참고하세요.

### 컴포넌트 설정하기[​](#configure-a-component "Direct link to Configure a component")

플로우에 컴포넌트를 추가한 후에는 컴포넌트의 파라미터를 설정하고 플로우 내 다른 컴포넌트와 연결합니다.

각 컴포넌트에는 해당 컴포넌트의 목적에 맞는 입력, 출력, 파라미터, 컨트롤이 있습니다.
기본적으로 컴포넌트는 필수 옵션과 공통 옵션만 표시합니다.
메타 설정을 포함한 추가 설정과 컨트롤에 접근하려면 [컴포넌트 검사 패널](#component-inspection-panel)을 사용하세요.

### 컴포넌트 검사 패널[​](#component-inspection-panel "Direct link to Component inspection panel")

워크스페이스에서 컴포넌트를 선택하면 화면 오른쪽에 컴포넌트 검사 패널이 나타납니다.

이 검사 패널에는 숨겨진 파라미터나 고급 파라미터를 포함하여 컴포넌트의 모든 파라미터가 표시됩니다.

### 컴포넌트 헤더 메뉴[​](#component-header-menus "Direct link to Component header menus")

컴포넌트의 헤더 메뉴에 접근하려면 워크스페이스에서 해당 컴포넌트를 클릭하세요.

![Agent 컴포넌트](https://docs.langflow.org/assets/images/agent-component-1388a5c249e1f446bce2a7586a87e986.png)

다음 옵션들은 헤더 메뉴에서 바로 사용할 수 있습니다.

- **Code**: 컴포넌트의 Python 코드를 직접 수정하여 컴포넌트 설정을 변경합니다.
- **Freeze**: 컴포넌트와 그 상위(upstream)의 모든 컴포넌트를 고정(freeze)하여 재실행을 방지합니다. 자세한 내용은 [컴포넌트 고정하기](#freeze-a-component)를 참고하세요.
- **Tool Mode**: 컴포넌트를 **Agent** 컴포넌트와 결합할 때 이 옵션을 활성화합니다.

**Delete**, **Duplicate** 컨트롤을 포함한 다른 모든 옵션을 보려면 **Show More**를 클릭하세요.

### 컴포넌트 이름 변경하기[​](#rename-a-component "Direct link to Rename a component")

컴포넌트의 이름이나 설명을 수정하려면 워크스페이스에서 해당 컴포넌트를 클릭한 다음 **Edit**를 클릭하세요.
컴포넌트 설명에는 Markdown 문법을 사용할 수 있습니다.

### 컴포넌트 실행하기[​](#run-a-component "Direct link to Run a component")

단일 컴포넌트를 실행하려면 **Run component**를 클릭하세요.
**Last Run** 값이 표시되면 컴포넌트가 성공적으로 실행된 것입니다.

단일 컴포넌트를 실행하는 것은 플로우 전체를 실행하는 것과 다릅니다. 단일 컴포넌트 실행에서는 `build_vertex` 함수가 호출되며, 이 함수는 시각적 편집기를 통해 제공된 직접 입력값(`inputs_dict` 파라미터)만으로 단일 컴포넌트를 빌드하고 실행합니다. `VertexBuildResult` 데이터는 컴포넌트의 `build` 메서드를 호출하고 실행하는 `build_and_run` 메서드로 전달됩니다. 플로우 전체를 실행하는 것과 달리, 단일 컴포넌트를 실행할 때는 상위 종속성이 자동으로 실행되지 않습니다.

### 컴포넌트 출력과 로그 검사하기[​](#inspect-component-output-and-logs "Direct link to Inspect component output and logs")

단일 컴포넌트의 출력과 로그를 확인하려면 **Inspect**를 클릭하세요.

### 컴포넌트 고정하기[​](#freeze-a-component "Direct link to Freeze a component")

info

컴포넌트를 고정하면 선택한 컴포넌트의 상위에 있는 모든 컴포넌트도 함께 고정됩니다.

컴포넌트와 *그 상위의 모든 컴포넌트*로부터 일관된 출력을 기대하고, 해당 컴포넌트들을 한 번만 실행하면 되는 경우 고정 옵션을 사용하세요.

컴포넌트를 고정하면 해당 컴포넌트와 상위의 모든 컴포넌트가 재실행되지 않으며, 그 컴포넌트들의 마지막 출력 상태가 유지됩니다.
이후 플로우를 실행할 때는 보존된 출력이 사용됩니다.

컴포넌트를 고정하려면 워크스페이스에서 해당 컴포넌트를 클릭해 헤더 메뉴를 연 다음 **Freeze**를 클릭하세요.

## 컴포넌트 포트[​](#component-ports "Direct link to Component ports")

각 컴포넌트의 테두리에는 원형 포트 아이콘이 있습니다. 이는 컴포넌트의 *연결 지점(connection point)* 또는 *포트*를 나타냅니다.

포트는 특정 데이터 유형의 입력을 받거나 출력을 생성합니다.
데이터 유형은 포트가 연결된 필드나 [포트의 색상](#port-colors)을 통해 유추할 수 있습니다.
예를 들어 **System Message** 필드는 파란색 포트 아이콘으로 표시되는 것처럼 [message 데이터](https://docs.langflow.org/data-types#message)를 받습니다.

![여러 입력을 가진 Prompt Template 컴포넌트](https://docs.langflow.org/assets/images/prompt-component-858130cb1fdfd071e743d5f0b122fd0e.png)

플로우를 구성할 때, 동일한 유형(색상)의 출력 포트와 입력 포트를 연결하여 두 컴포넌트 간에 해당 유형의 데이터를 전달합니다.
각 데이터 유형의 프로그래밍적 표현에 대한 자세한 내용은 [Langflow 데이터 유형](https://docs.langflow.org/data-types)을 참고하세요.

tip

- 워크스페이스에서 포트 위에 마우스를 올리면 해당 포트의 연결 상세 정보를 확인할 수 있습니다.
포트를 클릭하면 호환되는 컴포넌트를 **Search**할 수 있습니다.

- 두 컴포넌트의 데이터 유형이 호환되지 않는 경우, [**Type Convert** 컴포넌트](https://docs.langflow.org/type-convert)와 같은 처리 컴포넌트를 사용해 컴포넌트 간 데이터를 변환할 수 있습니다.

### 동적 포트[​](#dynamic-ports "Direct link to Dynamic ports")

일부 컴포넌트는 동적으로 추가되거나 제거되는 포트를 가지고 있습니다.
예를 들어 **Prompt Template** 컴포넌트는 [중괄호로 감싼 입력](https://docs.langflow.org/components-prompts#define-variables-in-prompts)을 받으며, **Template** 필드에서 중괄호로 감싼 값이 감지되면 새 포트가 열립니다.

![여러 입력을 가진 Prompt Template 컴포넌트](https://docs.langflow.org/assets/images/prompt-component-with-multiple-inputs-858130cb1fdfd071e743d5f0b122fd0e.png)

### 출력 유형 선택[​](#output-type-selection "Direct link to Output type selection")

모든 컴포넌트는 플로우 내 다른 컴포넌트로 전달되거나 최종 플로우 결과로 반환되는 출력을 생성합니다.

일부 컴포넌트는 여러 유형의 출력을 생성할 수 있습니다.

- 컴포넌트가 모든 유형을 한 번에 내보내는 경우, 해당 컴포넌트는 시각적 편집기에서 여러 개의 출력 포트를 가집니다. 컴포넌트 코드에서는 이것이 `group_outputs=True`로 표현됩니다.

- 컴포넌트가 하나의 유형만 내보내는 경우, 출력 포트 근처의 출력 레이블을 클릭한 다음 원하는 출력 유형을 선택하여 출력 유형을 지정해야 합니다. 컴포넌트 코드에서는 이것이 `group_outputs=False`로 표현되거나 `group_outputs` 파라미터가 생략됩니다.

예를 들어 언어 모델 컴포넌트는 **Model Response** 또는 **Language Model** *중 하나*를 출력할 수 있습니다.
**Model Response** 출력은 다른 컴포넌트의 `Message` 포트로 전달할 수 있는 [`Message`](https://docs.langflow.org/data-types#message) 데이터를 생성합니다.
**Language Model** 출력은 [**Structured Output** 컴포넌트](https://docs.langflow.org/structured-output)와 같이 **Language Model** 입력을 가진 컴포넌트에 연결되어야 하며, 이 경우 연결된 LLM을 이용해 수신 컴포넌트의 추론을 수행합니다.

![Language Model 컴포넌트의 출력 유형 선택](https://docs.langflow.org/assets/images/select-output-ad560bd6e07233463111cf2516097571.png)

### 포트 색상[​](#port-colors "Direct link to Port colors")

컴포넌트 포트의 색상은 해당 포트가 받아들이거나 내보내는 데이터 유형을 나타냅니다.
예를 들어 **Message** 포트는 `Message` 데이터를 받거나 내보냅니다.

다음 표는 컴포넌트 데이터 유형과 그에 대응하는 포트 색상을 나열한 것입니다.

| Data type                 | Port color | Port icon example |
| ------------------------- | ---------- | ----------------- |
| JSON                      | 빨간색(Red)        |                   |
| Table                     | 분홍색(Pink)       |                   |
| Embeddings                | 에메랄드색(Emerald)    |                   |
| LanguageModel             | 자홍색(Fuchsia)   |                   |
| Memory                    | 주황색(Orange)     |                   |
| Message                   | 인디고색(Indigo)    |                   |
| Tool                      | 청록색(Cyan)      |                   |
| Unknown or multiple types | 회색(Gray)       |                   |

## 컴포넌트 코드[​](#component-code "Direct link to Component code")

[워크스페이스](https://docs.langflow.org/concepts-overview#workspace)와 코드 양쪽에서 컴포넌트를 편집할 수 있습니다. 플로우를 편집할 때 컴포넌트를 선택한 다음 **Code**를 클릭하면 해당 컴포넌트의 내부 Python 코드를 보고 편집할 수 있습니다.

모든 컴포넌트에는 설정 방법과 수행할 수 있는 작업을 결정하는 내부 코드가 있습니다.
플로우를 생성하고 실행하는 맥락에서 컴포넌트 코드는 다음과 같은 작업을 수행합니다.

- 시각적 편집기에 표시할 설정 옵션을 결정합니다.
- 컴포넌트에 정의된 입력 유형에 따라 입력값을 검증합니다.
- 설정된 파라미터, 메서드, 함수를 이용해 데이터를 처리합니다.
- 결과를 플로우 내 다음 컴포넌트로 전달합니다.

모든 컴포넌트는 컴포넌트의 인터페이스와 동작을 정의하는 기본 `Component` 클래스를 상속합니다.
예를 들어 [**Recursive Character Text Splitter** 컴포넌트](https://github.com/langflow-ai/langflow/blob/main/src/lfx/src/lfx/components/langchain_utilities/recursive_character.py)는 [`LCTextSplitterComponent`](https://github.com/langflow-ai/langflow/blob/main/src/lfx/src/lfx/base/textsplitters/model.py) 클래스의 하위 클래스입니다.

각 컴포넌트의 코드에는 입력과 출력에 대한 정의가 포함되어 있으며, 이는 워크스페이스에서 [컴포넌트 포트](#component-ports)로 표시됩니다.
예를 들어 `RecursiveCharacterTextSplitter`에는 네 개의 입력이 있습니다. 각 입력 정의는 `IntInput`과 같은 입력 유형뿐 아니라, 인코딩된 이름, 표시 이름, 설명, 해당 입력에 대한 기타 파라미터를 지정합니다.
이 값들은 시각적 편집기에서 표시 이름이나 툴팁과 같은 컴포넌트 설정을 결정합니다.

RecursiveCharacterTextSplitter inputs (from recursive_character.py)

```python
inputs = [  
    IntInput(  
        name="chunk_size",  
        display_name="Chunk Size",  
        info="The maximum length of each chunk.",  
        value=1000,  
    ),  
    IntInput(  
        name="chunk_overlap",  
        display_name="Chunk Overlap",  
        info="The amount of overlap between chunks.",  
        value=200,  
    ),  
    DataInput(  
        name="data_input",  
        display_name="Input",  
        info="The texts to split.",  
        input_types=["Document", "Data", "JSON"],  
        required=True,  
    ),  
    MessageTextInput(  
        name="separators",  
        display_name="Separators",  
        info='The characters to split on.\nIf left empty defaults to ["\\n\\n", "\\n", " ", ""].',  
        is_list=True,  
    ),  
]  
```

또한 컴포넌트에는 기능을 처리하는 메서드나 함수가 있습니다.
예를 들어 `RecursiveCharacterTextSplitter`에는 두 개의 메서드가 있습니다.

RecursiveCharacterTextSplitter methods (from recursive_character.py)

```python
def get_data_input(self) -> Any:  
    return self.data_input  

def build_text_splitter(self) -> TextSplitter:  
    if not self.separators:  
        separators: list[str] | None = None  
    else:  
        # check if the separators list has escaped characters  
        # if there are escaped characters, unescape them  
        separators = [unescape_string(x) for x in self.separators]  

    return RecursiveCharacterTextSplitter(  
        separators=separators,  
        chunk_size=self.chunk_size,  
        chunk_overlap=self.chunk_overlap,  
    )  
```

`get_data_input` 메서드는 컴포넌트의 입력에서 분할할 텍스트를 가져와 해당 클래스에서 사용할 수 있도록 만듭니다.
`build_text_splitter` 메서드는 부모 클래스의 `build` 메서드를 호출하여 `RecursiveCharacterTextSplitter` 객체를 생성합니다. 그런 다음 생성된 스플리터로 텍스트를 분할하고 다음 컴포넌트로 전달합니다.

## 컴포넌트 버전[​](#component-versions "Direct link to Component versions")

컴포넌트의 버전과 상태는 Langflow 내부 데이터베이스에 저장됩니다. 플로우에 컴포넌트를 추가하면 Langflow 데이터베이스의 정보를 기반으로 한 분리된(detached) 사본이 생성됩니다.
이 사본들은 기본 Langflow 데이터베이스와 분리되어 있으며, Langflow 버전을 업그레이드할 때 발생할 수 있는 업데이트와 동기화되지 않습니다.

즉, 개별 컴포넌트 인스턴스는 특정 플로우에 추가된 시점의 버전 번호와 상태를 유지합니다. 예를 들어 어떤 컴포넌트를 플로우에 추가할 당시 버전이 1.0이었다면, 직접 업데이트하지 않는 한 *해당 플로우 내에서는* 계속 버전 1.0으로 유지됩니다.

### 컴포넌트 버전 업데이트하기[​](#update-component-versions "Direct link to Update component versions")

워크스페이스에서 플로우를 편집할 때, 컴포넌트의 워크스페이스 버전이 데이터베이스 버전보다 낮으면 Langflow가 이를 알려주어 컴포넌트의 워크스페이스 버전을 업데이트할 수 있습니다.

- **Update ready**: 이 알림은 해당 컴포넌트 업데이트에 호환성을 깨는(breaking) 변경 사항이 없음을 의미합니다.

- **Update available**: 이 알림은 해당 컴포넌트 업데이트에 호환성을 깨는 변경 사항이 있을 수 있음을 의미합니다.

    호환성을 깨는 변경 사항은 컴포넌트의 입력과 출력을 수정하여, 컴포넌트 간 연결이 끊기고 플로우가 깨지는 원인이 됩니다. 컴포넌트를 업데이트한 후에는 컴포넌트 설정을 편집하거나 컴포넌트 포트를 다시 연결해야 할 수 있습니다.

컴포넌트를 업데이트하는 방법은 두 가지입니다.

- 단일 컴포넌트를 업데이트하려면 **Update**를 클릭하세요. 이는 호환성을 깨는 변경 사항이 없는 업데이트에 권장됩니다.

- 사용 가능한 모든 업데이트를 확인하고 업데이트 전에 스냅샷을 생성하려면 **Review**를 클릭하세요. 이는 호환성을 깨는 변경 사항이 있는 업데이트에 권장됩니다.

    컴포넌트를 업데이트하기 전에 플로우의 스냅샷을 저장하려면 **Create backup flow before updating**을 활성화하세요. 백업 플로우는 원본 플로우와 동일한 프로젝트 폴더에 `(backup)` 접미사가 붙은 이름으로 저장됩니다.

    특정 컴포넌트만 업데이트하려면 업데이트하려는 컴포넌트를 선택한 다음 **Update Components**를 클릭하세요.

컴포넌트는 실행 중인 Langflow 버전을 기준으로 최신 버전으로 업데이트됩니다.

## 컴포넌트 그룹화하기[​](#group-components "Direct link to Group components")

여러 컴포넌트를 하나의 컴포넌트로 그룹화하여 재사용할 수 있습니다. 이는 RAG **Agent** 컴포넌트와 관련 도구 또는 벡터 스토어 컴포넌트처럼 서로 관련된 컴포넌트들을 결합하여 대규모 플로우를 정리하는 데 유용합니다.

1. `Shift` 키를 누른 상태로 클릭 앤 드래그하여 병합하려는 모든 컴포넌트를 선택 영역으로 감쌉니다. 병합하려면 컴포넌트가 선택 영역 안에 완전히 들어와야 합니다.

    또는 컴포넌트를 하나씩 선택하려면 Windows에서는 `Ctrl`, Mac에서는 `Cmd` 키를 누른 상태로 각 컴포넌트를 클릭하여 그룹에 추가할 수 있습니다.

2. 마우스와 키보드에서 손을 뗀 다음 **Group**을 클릭하여 컴포넌트들을 하나의 그룹 컴포넌트로 병합합니다.

그룹화된 컴포넌트는 이름, 코드, 설정을 포함하여 하나의 컴포넌트로 설정 및 관리됩니다.

컴포넌트 그룹을 해제하려면 워크스페이스에서 해당 컴포넌트를 클릭해 헤더 메뉴를 연 다음 **Show More**를 클릭하고 **Ungroup**을 선택하세요.

이 그룹을 다른 플로우에서도 재사용하려면 워크스페이스에서 해당 컴포넌트를 클릭해 헤더 메뉴를 연 다음 **Show More**를 클릭하고 **Save**를 선택하여 컴포넌트를 커스텀 컴포넌트로 **Core components** 메뉴에 저장하세요.

## 레거시 컴포넌트[​](#legacy-components "Direct link to Legacy components")

레거시 컴포넌트는 더 이상 지원되지 않으며 향후 릴리스에서 제거될 수 있습니다.
기존 플로우에서는 계속 사용할 수 있지만, 가능한 한 빨리 지원되는 컴포넌트로 교체하는 것을 권장합니다.
플로우에 있는 컴포넌트의 **Legacy** 배너에는 대체 컴포넌트가 제안되어 있습니다.
릴리스 노트와 Langflow 문서에서도 가능한 한 대체 컴포넌트를 안내합니다.

레거시 컴포넌트를 어떻게 대체해야 할지 모르겠다면, 제공자, 서비스, 또는 컴포넌트 이름으로 컴포넌트를 **Search**해 보세요.
해당 컴포넌트는 완전히 새로운 컴포넌트, 유사한 컴포넌트, 또는 다른 카테고리의 동일 컴포넌트 신규 버전으로 대체되었을 수 있습니다.

뚜렷한 대체재가 없다면 다른 컴포넌트를 사용 사례에 맞게 조정할 수 있는지 검토하세요.
예를 들어 많은 **Core components**는 [**API Request** 컴포넌트](https://docs.langflow.org/api-request)처럼 여러 제공자와 사용 사례를 지원하는 범용 기능을 제공합니다.

이러한 옵션이 모두 적합하지 않다면, 레거시 컴포넌트의 코드를 이용해 직접 커스텀 컴포넌트를 만들거나 레거시 컴포넌트에 대해 [토론을 시작](https://docs.langflow.org/contributing-github-issues)하는 것을 고려해 보세요.

새 플로우에서 레거시 컴포넌트 사용을 지양하도록, 이 컴포넌트들은 기본적으로 숨겨져 있습니다.
시각적 편집기에서 **Component settings**를 클릭하면 **Legacy** 필터를 전환할 수 있습니다.
