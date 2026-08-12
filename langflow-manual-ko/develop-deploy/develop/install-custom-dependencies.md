# 사용자 정의 의존성 설치

> 원문: https://docs.langflow.org/next/install-custom-dependencies

Langflow는 Langflow 기능을 확장할 수 있도록 선택적 의존성 그룹과 사용자 정의 의존성 지원을 제공합니다. 이 가이드는 Langflow Desktop과 Langflow OSS를 포함한 다양한 Langflow 설치 환경에 의존성을 추가하는 방법을 다룹니다.

Langflow 코드베이스는 각각 자체 `pyproject.toml` 파일을 가진 세 개의 패키지를 사용합니다.

- `main` 패키지(`langflow`)는 루트 레벨의 `pyproject.toml`로 관리되며, Langchain 및 OpenAI와 같은 최종 사용자 기능과 메인 애플리케이션 코드를 포함합니다. `main` 패키지는 `base` 패키지에 의존합니다.
- `base` 패키지(`langflow-base`)는 `src/backend/base/pyproject.toml`에서 관리되며, FastAPI 웹 프레임워크와 같은 핵심 인프라를 포함합니다. `base` 패키지는 `lfx` 패키지에 의존합니다.
- `lfx` 패키지는 `src/lfx/pyproject.toml`에서 관리됩니다. LFX는 Langflow 플로우를 실행하고 서빙하기 위한 경량 CLI 도구입니다. `lfx` 패키지는 최종 사용자를 위한 선택적 의존성 그룹을 제공하지 않습니다.

## Langflow Desktop에 사용자 정의 의존성 설치[​](#langflow-desktop "Direct link to Install custom dependencies in Langflow Desktop")

Langflow Desktop에 의존성을 추가하려면, 애플리케이션의 `requirements.txt` 파일에 패키지 항목을 추가하세요.

- macOS에서는 파일이 `/Users/USER/.langflow/data/requirements.txt`에 있습니다.
- Windows에서는 파일이 `C:\Users\USER\AppData\Roaming\com.Langflow\data\requirements.txt`에 있습니다.

각 의존성을 `DEPENDENCY==VERSION` 형식으로 `requirements.txt`의 각 줄에 추가하세요. 예: `matplotlib==3.10.0`.

의존성을 설치하려면 Langflow Desktop을 재시작하세요.

사용자 정의 의존성을 변경하거나 제거해야 하는 경우, `requirements.txt` 파일을 수정한 다음 Langflow Desktop을 재시작하세요.

## Langflow OSS에 사용자 정의 의존성 설치[​](#install-custom-dependencies-in-langflow-oss "Direct link to Install custom dependencies in Langflow OSS")

Langflow 환경에 자신만의 사용자 정의 의존성을 설치하려면, 패키지 관리자를 사용해 추가하세요.

복제한(cloned) Langflow 저장소 내에서 작업 중이라면, uv가 참조할 `pyproject.toml` 파일이 이미 존재하므로 `uv add`로 의존성을 추가하세요.

```
uv add DEPENDENCY
```

### `langflow`용 선택적 의존성 그룹 설치[​](#install-optional-dependency-groups-for-langflow "Direct link to install-optional-dependency-groups-for-langflow")

`langflow` 패키지(main)는 기능을 확장하는 선택적 의존성 그룹을 제공합니다.

기본적으로 추가 옵션 없이 `langflow`를 설치하면 `[project.dependencies]` 섹션에 나열된 모든 의존성이 포함됩니다. 선택적 의존성 그룹은 기본적으로 설치되지 않으며 명시적으로 요청해야 합니다.

이러한 선택적 의존성은 [langflow `pyproject.toml`](https://github.com/langflow-ai/langflow/blob/main/pyproject.toml) 파일의 `[project.optional-dependencies]` 아래에 나열되어 있습니다.

pip의 `[extras]` 문법을 사용해 의존성 그룹을 설치하세요. 예를 들어, `postgresql` 의존성 그룹과 함께 `langflow`를 설치하려면 다음 명령을 입력하세요.

```
uv pip install "langflow[postgresql]"
```

여러 extras를 설치하려면 쉼표로 각 의존성 그룹을 구분하세요.

```
uv pip install "langflow[postgresql,openai]"
```

### `langflow-base`용 선택적 의존성 그룹 설치[​](#install-optional-dependency-groups-for-langflow-base "Direct link to install-optional-dependency-groups-for-langflow-base")

`langflow-base`는 특정 의존성만으로 Langflow를 배포하고 싶을 때 권장됩니다.
`langflow`와 동일한 코드베이스를 포함하지만, `langflow`는 `langflow-base`를 의존성으로 포함하고 그 위에 많은 추가 의존성을 더합니다.

`langflow-base` 패키지는 `langflow` 패키지와는 별개의 자체 선택적 의존성 그룹을 제공합니다. `langflow-base` 패키지는 이러한 선택적 의존성 그룹과 함께 독립 패키지로 설치할 수 있습니다.

기본적으로 추가 옵션 없이 `langflow-base`를 설치하면 `[project.dependencies]` 섹션에 나열된 모든 의존성이 포함됩니다. 선택적 의존성 그룹은 기본적으로 설치되지 않으며 명시적으로 요청해야 합니다.
이러한 선택적 의존성 그룹은 [langflow-base `pyproject.toml`](https://github.com/langflow-ai/langflow/blob/main/src/backend/base/pyproject.toml) 파일의 `[project.optional-dependencies]` 아래에 나열되어 있습니다.

pip의 `[extras]` 문법을 사용해 선택적 의존성 그룹과 함께 `langflow-base`를 설치하세요. 예를 들어, `postgresql` 의존성 그룹과 함께 `langflow-base`를 설치하려면 다음과 같이 하세요.

```
uv pip install "langflow-base[postgresql]"
```

여러 extras를 설치하려면 쉼표로 각 의존성 그룹을 구분하세요.

```
uv pip install "langflow-base[postgresql,openai]"
```

`langflow-base`의 모든 선택적 의존성을 설치하려면 `complete` extra를 사용하세요.

```
uv pip install "langflow-base[complete]"
```

### 가상 환경을 사용해 사용자 정의 의존성 테스트[​](#use-a-virtual-environment-to-test-custom-dependencies "Direct link to Use a virtual environment to test custom dependencies")

로컬에서 테스트할 때는 가상 환경을 사용하여 의존성을 격리하고 다른 Python 프로젝트와의 충돌을 방지하세요.

예를 들어, Langflow와 함께 `matplotlib` 같은 사용자 정의 의존성을 실험하고 싶다면 다음과 같이 하세요.

```
# Create and activate a virtual environment
uv venv YOUR_LANGFLOW_VENV
source YOUR_LANGFLOW_VENV/bin/activate

# Install langflow and your additional dependency
uv pip install langflow matplotlib
```

가상 환경에 특정 선택적 의존성 그룹과 함께 `langflow-base`를 설치할 수도 있습니다.

```
# Install langflow-base with only the dependencies you need
uv pip install "langflow-base[postgresql,openai]" matplotlib
```

복제한 Langflow 저장소 내에서 작업 중이라면, 기존 `pyproject.toml` 파일을 참조하도록 `uv add`로 의존성을 추가하세요.

```
uv add matplotlib
```

`uv add` 명령은 해당 위치의 `uv.lock` 파일을 자동으로 업데이트합니다.

## Langflow 코드베이스에 의존성 추가[​](#add-dependencies-to-the-langflow-codebase "Direct link to Add dependencies to the Langflow codebase")

Langflow 코드베이스에 기여할 때, Langflow에 의존성을 추가해야 할 수 있습니다.

`main` 패키지에 의존성을 추가하려면, 프로젝트 루트에서 `uv add DEPENDENCY`를 실행하세요.
예:

```
uv add matplotlib
```

의존성은 `main` 패키지에 `[project.dependencies]`의 일반 의존성으로 추가하거나 `[project.optional-dependencies]`의 선택적 의존성으로 추가할 수 있습니다.

`base` 패키지에 의존성을 추가하려면, `src/backend/base`로 이동한 다음 다음을 실행하세요.

```
uv add DEPENDENCY
```

테스트, 린팅, 디버깅을 위한 개발 의존성을 추가하려면, `src/backend/base`로 이동한 다음 다음을 실행하세요.

```
cd src/backend/base && uv add --group dev DEPENDENCY
```

의존성은 `base` 패키지에 `[project.dependencies]`의 일반 의존성, `[dependency-groups.dev]`의 개발 의존성, 또는 `[project.optional-dependencies]`의 선택적 의존성으로 추가할 수 있습니다.

`uv add` 대신 `make add`를 사용할 수도 있습니다.

```
# Equivalent to: uv add matplotlib
make add main="matplotlib"

# Equivalent to: cd src/backend/base && uv add --group dev matplotlib
make add devel="matplotlib"

# Equivalent to: cd src/backend/base && uv add matplotlib
make add base="matplotlib"
```

또는, 해당 `pyproject.toml` 파일에 이러한 의존성을 수동으로 추가할 수도 있습니다.

```
[project]
dependencies = [
    "matplotlib>=3.8.0"
]
```

또는 main 패키지의 선택적 의존성으로:

```
[project.optional-dependencies]
plotting = [
    "matplotlib>=3.8.0",
]
```

또는 base 패키지의 개발 의존성으로:

```
[dependency-groups]
dev = [
    "matplotlib>=3.8.0",
]
```

## 참고 자료[​](#see-also "Direct link to See also")

- [Langflow 애플리케이션 컨테이너화](https://docs.langflow.org/develop-application)
- [사용자 정의 Python 컴포넌트 생성](https://docs.langflow.org/components-custom-components)
