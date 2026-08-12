# 컴포넌트 테스트 기여

이 가이드는 일관성과 충분한 커버리지를 보장하기 위해 애플리케이션 컴포넌트 테스트를 구조화하고 구현하는 방법을 설명합니다.

---

## 파일 이름 규칙

- 테스트 파일은 테스트하는 컴포넌트와 동일한 디렉토리 구조를 따르되, 해당 단위 테스트 폴더에 배치해야 합니다.

  예: 컴포넌트 파일 경로가 `src/lfx/src/lfx/components/data/`이면 테스트 파일은 `src/backend/tests/unit/components/data`에 위치합니다.

- 테스트 파일 이름은 스네이크 케이스를 사용하고 `test_<file_name>.py` 패턴을 따릅니다.

  예: 테스트할 파일이 `FileComponent.py`이면 테스트 파일 이름은 `test_file_component.py`입니다.

---

## 파일 구조

- 각 테스트 파일은 컴포넌트별로 테스트를 클래스로 그룹화해야 합니다. 파일에 독립 테스트 함수는 없어야 합니다 — 클래스 내의 테스트 메서드만 있어야 합니다.
- 클래스 이름은 `Test<ClassName>` 패턴을 따릅니다.

---

## 임포트, 상속 및 필수 메서드

컴포넌트 테스트를 표준화하기 위해 기본 테스트 클래스가 생성되었습니다:

```python
from tests.base import ComponentTestBaseWithClient
from tests.base import ComponentTestBaseWithoutClient
```

이 기본 클래스를 상속하면 `@pytest.fixture`로 장식된 다음 메서드를 정의해야 합니다:

- **`component_class`**: 테스트할 컴포넌트의 클래스를 반환합니다:

```python
@pytest.fixture
def component_class(self):
    return FileComponent
```

- **`default_kwargs`**: 컴포넌트를 인스턴스화하는 데 필요한 기본 인수 딕셔너리를 반환합니다:

```python
@pytest.fixture
def default_kwargs(self):
    return {"file_path": "/tmp/test.txt", "_session_id": "123"}
```

- **`file_names_mapping`**: 테스트된 컴포넌트가 시간이 지남에 따라 가진 `version`, `module`, `file_name` 간의 관계를 나타내는 딕셔너리 목록을 반환합니다:

```python
@pytest.fixture
def file_names_mapping(self):
    return [
        {"version": "1.0.15", "module": "data", "file_name": "File"},
        {"version": "1.0.16", "module": "data", "file_name": "File"},
    ]
```

---

## 컴포넌트 기능 테스트

기본 구조가 정의되면 컴포넌트 기능에 대한 테스트 메서드를 구현합니다:

1. 테스트 메서드 이름은 설명적이고 스네이크 케이스를 사용하며 `test_<case_name>` 패턴을 따릅니다.
2. 각 테스트는 **준비(Arrange), 실행(Act), 검증(Assert)** 패턴을 따릅니다.

### 예시

```python
def test_file_component_processing(self, component_class, default_kwargs):
    # Arrange: 데이터 준비
    component = component_class(**default_kwargs)

    # Act: 컴포넌트 실행
    frontend_node = component.to_frontend_node()

    # Assert: 결과 검증
    node_data = frontend_node["data"]["node"]
    assert node_data["template"]["path"]["file_path"] == "/tmp/test.txt"
    assert "path" in node_data["template"]
    assert node_data["display_name"] == "File"
```

---

## 참고 항목

- [Langflow에 기여하기](./contribute.md)
- [컴포넌트 기여](./contribute-components.md)

---

*원문: https://docs.langflow.org/next/contributing-component-tests*
