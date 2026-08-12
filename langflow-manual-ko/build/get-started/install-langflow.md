# Langflow 설치
> 원문: https://docs.langflow.org/get-started-installation

Langflow는 여러 방법으로 설치할 수 있습니다. 아래 옵션 중 하나를 선택하여 해당 단계로 이동하세요.

[Langflow Desktop (권장) – 의존성 관리와 간단한 업그레이드를 제공하는 독립 실행형 앱입니다.](#install-and-run-langflow-desktop)
[Docker – 격리된 컨테이너에서 Langflow를 실행합니다.](#install-and-run-langflow-docker)
[Python 패키지 – 환경, 의존성, 버전 관리에 대한 완전한 제어권을 제공합니다.](#install-and-run-the-langflow-oss-python-package)
[소스에서 설치 – Langflow에 기여하거나 로컬 클론에서 작업합니다.](https://docs.langflow.org/contributing-how-to-contribute#install-langflow-from-source)

## Langflow Desktop 설치 및 실행[​](#install-and-run-langflow-desktop)

Langflow Desktop은 의존성 관리와 업그레이드를 단순화한 Langflow의 데스크톱 버전입니다.
다만 **Shareable Playground**나 **Voice Mode**와 같은 일부 기능은 Langflow Desktop에서 사용할 수 없습니다.

- macOS
- Windows

Langflow Desktop은 macOS 13 이상이 필요합니다.

1. [Langflow Desktop](https://www.langflow.org/desktop) 페이지로 이동합니다.
2. **Download Langflow**를 클릭하고, 연락처 정보를 입력한 다음 **Download**를 클릭합니다.
3. Langflow 애플리케이션을 마운트하고 설치합니다.
4. 설치가 완료되면 Langflow 애플리케이션을 열고 [Quickstart](https://docs.langflow.org/get-started-quickstart)로 첫 플로우를 만들어 보세요.

Windows에서 Langflow Desktop을 설치하려면 시스템에 없을 수 있는 C++ 컴파일러가 필요합니다. `C++ Build Tools Required!` 오류가 표시되면 화면의 안내에 따라 Microsoft C++ Build Tools를 설치하거나 [Microsoft Visual Studio를 설치](https://visualstudio.microsoft.com/downloads/)하세요.

- 설치가 완료되면 Langflow 애플리케이션을 열고 [Quickstart](https://docs.langflow.org/get-started-quickstart)로 첫 플로우를 만들어 보세요.

업그레이드 관련 정보는 [Release notes](https://docs.langflow.org/release-notes)를 참조하세요.

Langflow Desktop에서 의존성을 관리하는 방법은 [Install custom dependencies in Langflow Desktop](https://docs.langflow.org/install-custom-dependencies#langflow-desktop)을 참조하세요.

## Docker로 Langflow 설치 및 실행[​](#install-and-run-langflow-docker)

Langflow Docker 이미지를 사용하여 Langflow 컨테이너를 시작할 수 있습니다.
자세한 내용은 [Deploy Langflow on Docker](https://docs.langflow.org/deployment-docker)를 참조하세요.

1. [Docker](https://docs.docker.com/)를 설치하고 시작합니다.

2. 최신 [Langflow Docker 이미지](https://hub.docker.com/r/langflowai/langflow)를 pull하여 시작합니다.

```bash
docker run -p 7860:7860 \
  -e LANGFLOW_AUTO_LOGIN=false \
  -e LANGFLOW_SUPERUSER_PASSWORD=SUPERUSER_PASSWORD \
  langflowai/langflow:latest
```

    공식 Docker 이미지는 기본적으로 `LANGFLOW_AUTO_LOGIN=false`로 설정됩니다.

    `SUPERUSER_PASSWORD`를 Langflow 슈퍼유저를 위한 강력한 비밀번호로 교체하세요.

    자세한 내용은 [Docker image defaults](https://docs.langflow.org/deployment-docker#docker-image-security-defaults)를 참조하세요.

3. Langflow에 접속하려면 `http://localhost:7860/`으로 이동하세요.

4. [Quickstart](https://docs.langflow.org/get-started-quickstart)로 첫 플로우를 만들어 보세요.

## Langflow OSS Python 패키지 설치 및 실행[​](#install-and-run-the-langflow-oss-python-package)

1. 필요한 의존성과 인프라를 확인하세요.

  - [Python](https://www.python.org/downloads/release/python-3100/) 3.10 ~ 3.14 버전
  - [uv](https://docs.astral.sh/uv/getting-started/installation/)
  - 충분한 인프라:
    * 최소 사양: 듀얼 코어 CPU, 2GB RAM
    * 권장 사양: 멀티 코어 CPU, 4GB 이상 RAM
  - 브라우저:
    * Google Chrome을 권장하지만 필수는 아닙니다

2. [uv](https://docs.astral.sh/uv/pip/environments)로 가상 환경을 만듭니다.

**가상 환경 관련 도움이 필요하신가요?**

  가상 환경을 사용하면 Langflow가 격리된 새 환경에 설치되는 것을 보장할 수 있습니다.
새 가상 환경을 만들려면 다음 절차를 따르세요.

  - Linux 또는 macOS
  - Windows

  1. 가상 환경을 생성하고자 하는 위치로 이동한 다음 `uv`로 가상 환경을 생성합니다.

```shell
uv venv VENV_NAME
```

        `VENV_NAME`을 가상 환경의 이름으로 교체하세요.

  2. 가상 환경을 시작합니다.

```shell
source VENV_NAME/bin/activate
```

        셸 프롬프트가 변경되어 현재 가상 환경 내에서 작업 중임을 표시합니다.

```text
(VENV_NAME) ➜  langflow git:(main) ✗
```

  3. 가상 환경을 비활성화하고 일반 셸로 돌아가려면 `deactivate`를 입력하세요.

        활성화되면 가상 환경은 일시적으로 `PATH` 변수를 수정하여 가상 환경 내에 설치된 패키지를 우선시합니다.
다른 프로젝트와의 충돌을 피하기 위해 작업이 끝나면 가상 환경을 비활성화하는 것이 좋습니다.

        가상 환경을 삭제하려면 `rm -rf VENV_NAME`을 입력하세요.
이렇게 하면 가상 환경 디렉터리와 그 안의 내용이 완전히 제거됩니다.

    `VENV_NAME`을 가상 환경의 이름으로 교체하세요.

3. 가상 환경을 시작합니다.

```shell
VENV_NAME\Scripts\activate
```

    셸 프롬프트가 변경되어 현재 가상 환경 내에서 작업 중임을 표시합니다.

```text
(VENV_NAME) PS C:/users/username/langflow-dir>
```

4. 가상 환경을 비활성화하고 일반 셸로 돌아가려면 `deactivate`를 입력하세요.

    활성화되면 가상 환경은 일시적으로 `PATH` 변수를 수정하여 가상 환경 내에 설치된 패키지를 우선시합니다.
다른 프로젝트와의 충돌을 피하기 위해 작업이 끝나면 가상 환경을 비활성화하는 것이 좋습니다.

    가상 환경을 삭제하려면 `Remove-Item VENV_NAME`을 입력하세요.
이렇게 하면 가상 환경 디렉터리와 그 안의 내용이 완전히 제거됩니다.

- 가상 환경 안에서 Langflow를 설치합니다.

```bash
uv pip install langflow
```

- Langflow를 시작합니다.

```bash
uv run langflow run
```

    Langflow가 시작되기까지 몇 분 정도 걸릴 수 있습니다.

- 로컬 Langflow 인스턴스가 실행 중인지 확인하려면 기본 Langflow URL인 `http://127.0.0.1:7860`으로 이동하세요.

- [Quickstart](https://docs.langflow.org/get-started-quickstart)로 첫 플로우를 만들어 보세요.

### Langflow OSS 버전 관리[​](#manage-the-langflow-oss-version)

Langflow를 최신 버전으로 업그레이드하려면 `uv pip install langflow -U`를 실행하세요.
다만 Langflow 팀은 업그레이드 전에 기존 설치를 백업하는 것을 권장합니다.
자세한 내용은 [Prepare to upgrade](https://docs.langflow.org/release-notes#prepare-to-upgrade)를 참조하세요.

특정 버전의 Langflow 패키지를 설치하려면 `uv pip install langflow==1.4.22`처럼 명령어에 원하는 버전을 추가하세요.

Langflow와 모든 의존성을 재설치하려면 `uv pip install langflow --force-reinstall`을 실행하세요.

## 다음 단계[​](#next-steps)

- [Quickstart](https://docs.langflow.org/get-started-quickstart): 몇 분 만에 첫 플로우를 빌드하고 실행합니다.
- [Build flows](https://docs.langflow.org/concepts-flows): 플로우 빌드에 대해 알아봅니다.
- [Troubleshoot Langflow](https://docs.langflow.org/troubleshoot): 일반적인 Langflow 설치 및 시작 문제에 대한 도움을 받습니다.
