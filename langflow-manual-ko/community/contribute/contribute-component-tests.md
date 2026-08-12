# 컴포넌트 테스트 기여하기

> 원문: https://docs.langflow.org/next/contributing-component-tests

이 가이드는 일관성과 충분한 커버리지를 보장하기 위해 애플리케이션 컴포넌트의 테스트를 구성하고 구현하는 방법을 설명합니다.

## 파일 이름 지정[​](#file-naming "Direct link to File naming")

- 테스트 파일은 테스트 대상 컴포넌트와 동일한 디렉터리 구조를 따라야 하지만, 해당하는 유닛 테스트 폴더 안에 위치해야 합니다.

    예를 들어, 컴포넌트의 파일 경로가 `src/lfx/src/lfx/components/data/`라면, 테스트 파일은 `src/backend/tests/unit/components/data`에 위치해야 합니다.

- 테스트 파일 이름은 스네이크 케이스를 사용하고 `test_<file_name>.py` 패턴을 따라야 합니다.

    예를 들어, 테스트할 파일이 `FileComponent.py`라면, 테스트 파일 이름은 `test_file_component.py`가 되어야 합니다.

## 파일 구조[​](#file-structure "Direct link to File structure")

- 각 테스트 파일은 테스트를 컴포넌트별로 클래스로 그룹화해야 합니다. 파일 안에 독립적인(standalone) 테스트 함수가 있어서는 안 되며, 클래스 안의 테스트 메서드만 있어야 합니다.
- 클래스 이름은 `Test<ClassName>` 패턴을 따라야 합니다.
예를 들어, 테스트 대상 컴포넌트가 `FileComponent`라면, 테스트 클래스 이름은 `TestFileComponent`가 되어야 합니다.

## 임포트, 상속, 필수 메서드[​](#imports-inheritance-and-mandatory-methods "Direct link to Imports, inheritance, and mandatory methods")

컴포넌트 테스트를 표준화하기 위해 베이스 테스트 클래스가 만들어졌으며, 모든 컴포넌트 테스트 클래스는 이를 임포트하고 상속해야 합니다. 이 베이스 클래스들은 `src/backend/tests/unit/base.py` 파일에 있습니다.

베이스 테스트 클래스를 임포트하려면 다음과 같이 합니다.

```python
from tests.base import ComponentTestBaseWithClient
from tests.base import ComponentTestBaseWithoutClient
```

이 베이스 클래스들은 컴포넌트 테스트 클래스가 구현해야 하는 필수 메서드를 강제합니다. 베이스 클래스는 이전 버전에서 빌드된 컴포넌트가 현재 버전에서도 계속 작동하도록 보장합니다. 이 베이스 클래스 중 하나를 상속함으로써, 개발자는 `@pytest.fixture`로 데코레이트된 다음 메서드를 정의해야 합니다.

- `component_class:` 테스트할 컴포넌트의 클래스를 반환합니다. 예를 들면 다음과 같습니다.

```python
@pytest.fixture
def component_class(self):
    return FileComponent
```

- `default_kwargs:` 컴포넌트를 인스턴스화하는 데 필요한 기본 인자를 담은 딕셔너리를 반환합니다. 예를 들면 다음과 같습니다.

```python
@pytest.fixture
def default_kwargs(self):
    return {"file_path": "/tmp/test.txt", "_session_id": "123"}
```

- `file_names_mapping:` 테스트 대상 컴포넌트가 시간에 따라 가졌던 `version`, `module`, `file_name` 사이의 관계를 나타내는 딕셔너리 목록을 반환합니다. 아직 릴리스되지 않은 컴포넌트라면 비워둘 수 있습니다. 예를 들면 다음과 같습니다.

```python
@pytest.fixture
def file_names_mapping(self):
    return [
        {"version": "1.0.15", "module": "data", "file_name": "File"},
        {"version": "1.0.16", "module": "data", "file_name": "File"},
        {"version": "1.0.17", "module": "data", "file_name": "File"},
        {"version": "1.0.18", "module": "data", "file_name": "File"},
        {"version": "1.0.19", "module": "data", "file_name": "File"},
    ]
```

## 컴포넌트 기능 테스트하기[​](#testing-component-functionalities "Direct link to Testing component functionalities")

테스트 파일의 기본 구조가 정의되면, 컴포넌트 기능에 대한 테스트 메서드를 구현합니다. 다음 지침을 따라야 합니다.

1. 테스트 메서드 이름은 설명적이어야 하고, 스네이크 케이스를 사용해야 하며, `test_<case_name>` 패턴을 따라야 합니다.
2. 각 테스트는 **Arrange, Act, Assert** 패턴을 따라야 합니다.
  1. **Arrange**: 데이터를 준비합니다.
  2. **Act**: 컴포넌트를 실행합니다.
  3. **Assert**: 결과를 검증합니다.

### 예시[​](#example "Direct link to Example")

1. **Arrange**: 데이터를 준비합니다.

    필수는 아니지만, 기본 구조에 정의된 fixture를 사용하는 것이 권장됩니다.

```python
def test_post_code_processing(self, component_class, default_kwargs):
    component = component_class(**default_kwargs)
```

2. **Act**: 컴포넌트를 실행합니다.

    **Arrange** 단계에서 준비한 컴포넌트의 `.to_frontend_node()` 메서드를 호출합니다.

```python
def test_post_code_processing(self, component_class, default_kwargs):
    component = component_class(**default_kwargs)

    frontend_node = component.to_frontend_node()
```

3. **Assert**: 결과를 검증합니다.

    `.to_frontend_node()` 메서드를 실행한 후, 결과 데이터는 `frontend_node["data"]["node"]` 딕셔너리에서 검증할 수 있습니다. 어서션은 명확해야 하며 예상되는 결과를 다뤄야 합니다.

```python
def test_file_component_processing(self, component_class, default_kwargs):
    component = component_class(**default_kwargs)

    frontend_node = component.to_frontend_node()

    node_data = frontend_node["data"]["node"]
    assert node_data["template"]["path"]["file_path"] == "/tmp/test.txt"
    assert "path" in node_data["template"]
    assert node_data["display_name"] == "File"
```
