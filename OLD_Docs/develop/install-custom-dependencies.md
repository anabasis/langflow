# 커스텀 종속성 설치

Langflow는 Langflow 기능을 확장하기 위한 선택적 종속성 그룹과 커스텀 종속성 지원을 제공합니다. 이 가이드는 Langflow Desktop과 Langflow OSS를 포함한 다양한 Langflow 설치에 종속성을 추가하는 방법을 다룹니다.

Langflow 코드베이스는 각각 자체 `pyproject.toml` 파일이 있는 세 개의 패키지를 사용합니다:
- **`main` 패키지** (`langflow`): 루트 레벨 `pyproject.toml`에서 관리되며 Langchain, OpenAI 등 엔드유저 기능 및 주요 애플리케이션 코드를 포함합니다. `main` 패키지는 `base` 패키지에 의존합니다.
- **`base` 패키지** (`langflow-base`): `src/backend/base/pyproject.toml`에서 관리되며 FastAPI 웹 프레임워크 등 핵심 인프라를 포함합니다. `base` 패키지는 `lfx` 패키지에 의존합니다.
- **`lfx` 패키지**: `src/lfx/pyproject.toml`에서 관리되는 Langflow 플로우 실행 및 서빙을 위한 경량 CLI 도구입니다.

---

## Langflow Desktop에 커스텀 종속성 설치

Langflow Desktop에 종속성을 추가하려면 애플리케이션의 `requirements.txt` 파일에 패키지 항목을 추가합니다:
- macOS: `/Users/USER/.langflow/data/requirements.txt`
- Windows: `C:\Users\USER\AppData\Roaming\com.Langflow\data\requirements.txt`

각 종속성을 `DEPENDENCY==VERSION` 형식(예: `matplotlib==3.10.0`)으로 `requirements.txt`에 한 줄씩 추가합니다.

Langflow Desktop을 재시작하면 종속성이 설치됩니다.

---

## Langflow OSS에 커스텀 종속성 설치

Langflow 환경에 커스텀 종속성을 설치하려면 패키지 관리자를 사용합니다.

클론된 Langflow 저장소 내에서 작업하는 경우 `uv add`로 종속성을 추가합니다:

```bash
uv add DEPENDENCY
```

### `langflow`에 대한 선택적 종속성 그룹 설치

`langflow` 패키지는 기능을 확장하는 선택적 종속성 그룹을 제공합니다. 기본적으로 엑스트라 없이 `langflow`를 설치하면 `[project.dependencies]` 섹션에 나열된 모든 종속성이 포함됩니다.

pip의 `[extras]` 구문을 사용하여 종속성 그룹을 설치합니다. 예를 들어 `postgresql` 종속성 그룹과 함께 `langflow`를 설치하려면:

```bash
uv pip install "langflow[postgresql]"
```

여러 엑스트라를 설치하려면 쉼표로 구분합니다:

```bash
uv pip install "langflow[postgresql,openai]"
```

### `langflow-base`에 대한 선택적 종속성 그룹 설치

`langflow-base`는 특정 종속성만으로 Langflow를 배포하려는 경우에 권장됩니다. `langflow-base` 패키지는 `langflow`와 동일한 코드베이스를 포함하지만, `langflow`는 `langflow-base`를 종속성으로 포함하고 그 위에 많은 추가 종속성을 추가합니다.

```bash
uv pip install "langflow-base[postgresql]"

# 모든 선택적 종속성 설치
uv pip install "langflow-base[complete]"
```

### 가상 환경을 사용하여 커스텀 종속성 테스트

로컬에서 테스트할 때 가상 환경을 사용하여 종속성을 격리하고 다른 Python 프로젝트와의 충돌을 방지합니다:

```bash
# 가상 환경 생성 및 활성화
uv venv YOUR_LANGFLOW_VENV
source YOUR_LANGFLOW_VENV/bin/activate

# langflow와 추가 종속성 설치
uv pip install langflow matplotlib
```

---

## Langflow 코드베이스에 종속성 추가

Langflow 코드베이스에 기여할 때 종속성을 추가해야 할 수 있습니다.

**`main` 패키지에 종속성 추가:**

```bash
uv add matplotlib
```

**`base` 패키지에 종속성 추가:**

```bash
cd src/backend/base && uv add DEPENDENCY
```

**개발 종속성 추가:**

```bash
cd src/backend/base && uv add --group dev DEPENDENCY
```

`make add`를 사용하는 방법:

```bash
# main 패키지에 추가 (uv add matplotlib과 동일)
make add main="matplotlib"

# 개발 종속성으로 추가 (cd src/backend/base && uv add --group dev matplotlib과 동일)
make add devel="matplotlib"

# base 패키지에 추가
make add base="matplotlib"
```

---

## 참고 항목

- [Langflow 애플리케이션 컨테이너화](../deploy/deployment-overview.md)
- [커스텀 Python 컴포넌트 만들기](../components-reference/components-overview.md)

---

*원문: https://docs.langflow.org/next/install-custom-dependencies*
