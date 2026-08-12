# Langflow 설치

Langflow는 여러 가지 방법으로 설치할 수 있습니다. 아래에서 원하는 옵션을 선택하세요.

- [Langflow Desktop (권장)](#langflow-desktop-설치-및-실행) — 종속성 관리와 간단한 업그레이드를 제공하는 독립형 앱
- [Docker](#docker로-langflow-설치-및-실행) — 격리된 컨테이너에서 Langflow 실행
- [Python 패키지](#langflow-oss-python-패키지-설치-및-실행) — 환경, 종속성, 버전 관리를 완전히 제어
- [소스에서 설치](../community/contribute.md) — Langflow에 기여하거나 로컬 클론에서 작업

---

## Langflow Desktop 설치 및 실행

Langflow Desktop은 종속성 관리와 업그레이드를 단순화하는 데스크톱 버전의 Langflow입니다.
단, **공유 가능한 플레이그라운드**와 **음성 모드** 같은 일부 기능은 Langflow Desktop에서 사용할 수 없습니다.

### macOS

Langflow Desktop은 macOS 13 이상이 필요합니다.

1. [Langflow Desktop](https://www.langflow.org/desktop)으로 이동합니다.
2. **Download Langflow**를 클릭하고 연락처 정보를 입력한 후 **Download**를 클릭합니다.
3. Langflow 애플리케이션을 마운트하고 설치합니다.
4. 설치가 완료되면 Langflow 애플리케이션을 열고 [빠른 시작](./quickstart.md)으로 첫 번째 플로우를 만드세요.

### Windows

Windows에서 Langflow Desktop 설치 시 C++ 컴파일러가 필요할 수 있습니다. `C++ Build Tools Required!` 오류가 발생하면 화면의 안내에 따라 Microsoft C++ Build Tools를 설치하거나 [Microsoft Visual Studio를 설치](https://visualstudio.microsoft.com/downloads/)하세요.

설치가 완료되면 Langflow 애플리케이션을 열고 [빠른 시작](./quickstart.md)으로 첫 번째 플로우를 만드세요.

업그레이드 정보는 [릴리스 노트](https://docs.langflow.org/release-notes)를 참조하세요.

---

## Docker로 Langflow 설치 및 실행

Langflow Docker 이미지를 사용하여 Langflow 컨테이너를 시작할 수 있습니다.

1. [Docker](https://docs.docker.com/)를 설치하고 시작합니다.

2. 최신 [Langflow Docker 이미지](https://hub.docker.com/r/langflowai/langflow)를 풀(pull)하고 시작합니다:

```bash
docker run -p 7860:7860 langflowai/langflow:latest
```

3. Langflow에 접근하려면 `http://localhost:7860/`으로 이동합니다.

4. [빠른 시작](./quickstart.md)으로 첫 번째 플로우를 만드세요.

---

## Langflow OSS Python 패키지 설치 및 실행

1. 필요한 종속성 및 인프라가 있는지 확인합니다:

   - [Python](https://www.python.org/downloads/release/python-3100/) 버전 3.10 ~ 3.14
   - [uv](https://docs.astral.sh/uv/getting-started/installation/)
   - 충분한 인프라:
     - 최소: 듀얼 코어 CPU 및 2GB RAM
     - 권장: 멀티 코어 CPU 및 최소 4GB RAM
   - 브라우저: Google Chrome 권장 (필수는 아님)

2. [uv](https://docs.astral.sh/uv/pip/environments)로 가상 환경을 만듭니다.

   **가상 환경이 필요한 이유**
   
   가상 환경은 Langflow가 격리된 새 환경에 설치되도록 보장합니다.

   **Linux 또는 macOS:**

   ```bash
   # 가상 환경 생성
   uv venv VENV_NAME
   
   # 가상 환경 활성화
   source VENV_NAME/bin/activate
   ```

   **Windows:**

   ```bash
   # 가상 환경 생성 (위와 동일)
   uv venv VENV_NAME
   
   # 가상 환경 활성화
   VENV_NAME\Scripts\activate
   ```
   
   비활성화하려면 `deactivate`를 입력하세요. 가상 환경을 삭제하려면 해당 디렉토리를 삭제하세요.

3. 가상 환경에서 Langflow를 설치합니다:

```bash
uv pip install langflow
```

4. Langflow를 시작합니다:

```bash
uv run langflow run
```

Langflow 시작에 몇 분이 걸릴 수 있습니다.

5. 로컬 Langflow 인스턴스가 실행 중인지 확인하려면 기본 Langflow URL `http://127.0.0.1:7860`으로 이동합니다.

6. [빠른 시작](./quickstart.md)으로 첫 번째 플로우를 만드세요.

### Langflow OSS 버전 관리

- **최신 버전으로 업그레이드:** `uv pip install langflow -U`를 실행합니다. 업그레이드 전에 기존 설치를 백업하는 것을 권장합니다.
- **특정 버전 설치:** `uv pip install langflow==1.4.22`와 같이 버전을 지정합니다.
- **Langflow 재설치:** `uv pip install langflow --force-reinstall`을 실행합니다.

---

## 다음 단계

- [빠른 시작](./quickstart.md) — 몇 분 안에 첫 번째 플로우를 빌드하고 실행합니다.
- [플로우 빌드](../flows/build-flows.md) — 플로우 빌드에 대해 알아봅니다.
- [Langflow 문제 해결](../community/troubleshoot.md) — 일반적인 Langflow 설치 및 시작 문제 해결 방법을 알아봅니다.

---

*원문: https://docs.langflow.org/next/get-started-installation*
