# Flow DevOps Toolkit SDK

> 원문: https://docs.langflow.org/next/flow-devops-sdk

Flow DevOps Toolkit SDK를 사용하여 플로우의 버전 관리, 테스트, 배포를 수행합니다.

Langflow UI에서 플로우 JSON 파일을 수동으로 내보내고 공유하고 가져오는 대신, Flow DevOps 툴킷은 버전 관리, 환경 변수, 테스트, 배포를 위한 터미널 기반 워크플로우를 제공합니다.

## 사전 준비[​](#prerequisites "Direct link to Prerequisites")

- [Langflow 설치 및 시작](https://docs.langflow.org/get-started-installation)

- [Langflow API 키](https://docs.langflow.org/api-keys-and-authentication) 생성

- Langflow `lfx` 패키지 설치

    PyPI에서 `lfx` 패키지를 설치하려면 다음을 수행하세요.

  1. 가상 환경을 생성합니다.

```bash
uv venv VENV_NAME
```

  2. 가상 환경을 활성화합니다.

```bash
source VENV_NAME/bin/activate
```

  3. 가상 환경에 Langflow LFX 패키지를 설치합니다.

```bash
uv pip install lfx
```

  4. LFX가 설치된 가상 환경에서 Flow DevOps Toolkit 명령어를 실행합니다.

        또는 `uvx lfx` 명령어를 실행하거나, 클론한 Langflow 저장소의 `src/lfx` 디렉터리에서 LFX를 실행할 수도 있습니다.
자세한 내용은 [Langflow LFX README](https://github.com/langflow-ai/langflow/blob/main/src/lfx/README.md)를 참고하세요.

## 프로젝트 생성 및 플로우 버전 관리[​](#create-a-project-and-version-a-flow "Direct link to Create a project and version a flow")

1. [Quickstart](https://docs.langflow.org/get-started-quickstart)의 Simple Agent 스타터 플로우 같은 플로우를 Langflow UI에서 생성합니다.

2. `lfx`가 설치된 가상 환경 안에서 터미널 세션을 엽니다.

3. 프로젝트를 초기화하려면 다음을 실행합니다.

```bash
lfx init PROJECT_NAME
```

    `PROJECT_NAME`을 프로젝트 폴더 이름으로 바꾸세요. `lfx init`은 프로젝트의 스캐폴드를 생성합니다.
출력은 다음과 유사합니다.

```text
demo-project/
├── .github/
│   └── workflows/
│       ├── langflow-push.yml       # CI workflow
│       ├── langflow-test.yml       # CI workflow
│       └── langflow-validate.yml   # CI workflow
├── .gitignore                      # ignores legacy credentials file
├── .lfx/
│   └── environments.yaml           # edit with your instance URLs + API key env var names (safe to commit)
├── ci/
│   ├── ci-push.sh                  # generic CI script
│   ├── ci-test.sh                  # generic CI script
│   └── ci-validate.sh              # generic CI script
├── flows/
│   └── .gitkeep                    # versioned empty directory
└── tests/
    ├── __init__.py
    └── test_flows.py               # flow_runner example tests

✔ Project scaffolded. Next steps:
  1. Edit `.lfx/environments.yaml` with your instance URL
  2. export LANGFLOW_LOCAL_API_KEY=<key>   (Settings -> API Keys)
  3. lfx pull --env local --output-dir flows/
```

    프로젝트 스캐폴드에는 플로우 빌드를 위한 다음 도구들이 포함됩니다.

  - `.github/workflows`: GitHub CI 도구.
  - `.lfx/environments.yaml`: 프로젝트의 URL과 API 키를 로컬, 스테이징, 프로덕션 환경별 환경 변수로 제어.
  - `ci/`: 플로우를 푸시, 테스트, 검증하기 위한 셸 스크립트.
  - `flows/`: 플로우 버전 관리를 위한 `.gitkeep` 파일이 포함된 빈 디렉터리.
  - `tests/test_flows.py`: 수정하여 플로우를 테스트할 수 있는 예제 테스트.

4. `.env` 파일에 Langflow API 키를 추가하거나 터미널 세션 내에서 export합니다.
Flow DevOps SDK는 로컬, 스테이징, 프로덕션 환경을 위한 `url`과 `api_key_env` 환경 변수를 포함합니다.
API 키의 변수 이름은 환경마다 다르므로 올바른 변수를 추가하고 있는지 확인하세요.
예를 들어 로컬 Langflow 서버에 Langflow API 키를 추가하려면 다음을 설정합니다.

```bash
export LANGFLOW_LOCAL_API_KEY=LANGFLOW_API_KEY
```

5. API 키로 서버 인증을 테스트하려면 다음을 실행합니다.

```bash
lfx login
```

    Flow DevOps SDK는 URL에 대해 키를 테스트하고 연결이 작동하는지 확인합니다.
`Authentication failed`가 보고되면 새 키를 생성하고 export한 뒤 다시 시도하세요.

6. 연결된 서버에서 기존 플로우를 확인하려면 다음을 실행합니다.

```bash
lfx pull
```

    Flow DevOps SDK는 서버의 플로우 목록을 표시합니다. 출력은 다음과 유사합니다(`demo-project/` 같은 프로젝트 디렉터리에서).

```text
Pulling all flows from http://localhost:7860
Pulled 'Simple Agent' -> flows/Simple_Agent.json

┌────────────────┬──────────────────────────────────────┬───────────────────────────┬──────────┐
│ Name           │ ID                                   │ File                      │ Status   │
├────────────────┼──────────────────────────────────────┼───────────────────────────┼──────────┤
│ Simple Agent   │ c2f91b01-9a73-4c62-b7f0-e15bc3bd6802 │ flows/Simple_Agent.json   │ CREATED  │
└────────────────┴──────────────────────────────────────┴───────────────────────────┴──────────┘

1 updated.
```

    `lfx pull`은 서버의 플로우 변경 사항을 프로젝트 내 `flows/`(예: `demo-project/flows`) 하위의 JSON 파일로 가져옵니다.
`lfx pull`을 다시 실행하면 Flow DevOps SDK는 Status를 `Unchanged`로 보고합니다.
다음 단계에서 변경 사항을 가져오게 됩니다.

7. Langflow UI에서 Simple Agent 플로우를 열고 플로우를 변경합니다.
예를 들어 **Chat Input**을 다른 입력 문자열로 변경합니다.
플로우를 저장합니다.

8. 터미널로 돌아가서 `lfx status`를 실행합니다.
플로우 JSON의 해시가 업데이트로 인해 변경되었으므로, Flow DevOps SDK는 플로우의 Status를 `UPDATED`로 보고합니다.

9. 보고된 변경 사항을 Langflow 서버에서 로컬 프로젝트 폴더로 가져오려면 `lfx pull`을 실행합니다.

10. `demo-project/flows`에 로컬로 저장된 플로우 변경 사항을 Langflow 서버로 *푸시*하려면 `lfx push`를 실행합니다.

## 플로우 검증하기[​](#validate-flows "Direct link to Validate flows")

Flow DevOps SDK는 `lfx validate`로 로컬 플로우가 Langflow에 푸시하기 전에 올바르게 구성되었는지 검증할 수 있습니다.

1. Simple Agent 스타터 플로우를 테스트하려면, 플로우 JSON 경로를 `lfx validate` 명령어에 전달합니다.

```bash
lfx validate flows/Simple_Agent.json
```

2. 검증이 완료되면 `lfx push`로 플로우 변경 사항을 서버에 푸시합니다.

## 플로우용 requirements.txt 생성하기[​](#generate-requirementstxt-for-flows "Direct link to Generate requirements.txt for flows")

Flow DevOps SDK는 플로우용 `requirements.txt` 파일을 생성할 수 있습니다.

플로우 JSON은 노드와 배선(wiring)을 설명하며, 컴포넌트가 실행 시 임포트하는 PyPI 패키지는 나열하지 않습니다.
`requirements.txt` 파일을 생성하여 최소한의 Python 의존성을 캡처하면, 해당 플로우에 맞는 환경을 설치할 수 있습니다.

1. 프로젝트 디렉터리에서 `lfx requirements`에 플로우 JSON 파일을 지정합니다.
요구 사항을 터미널에 출력하려면:

```bash
lfx requirements flows/Simple_Agent.json
```

    출력 대신 `requirements.txt` 파일을 작성하려면 `-o` 또는 `--output`을 사용하세요.

```bash
lfx requirements flows/Simple_Agent.json -o requirements.txt
```

2. 선택적으로, 플로우 JSON과 `requirements.txt`를 같은 환경에 유지하여 플로우를 공유하고 서비스할 수 있습니다.
Langflow UI 없이 플로우를 서비스하려면 다음을 수행하세요.

  1. 가상 환경을 생성합니다.

```bash
uv venv VENV_NAME
```
  2. 가상 환경을 활성화합니다.

```bash
source VENV_NAME/bin/activate
```
  3. 가상 환경에 `requirements.txt`의 의존성을 설치합니다.

```bash
uv pip install -r requirements.txt
```
  4. Langflow API 키를 설정하려면 다음을 실행합니다.

```bash
export LANGFLOW_API_KEY=LANGFLOW_API_KEY
```
  5. Langflow UI 없이 플로우를 서비스하려면, 플로우 JSON 경로를 `lfx serve` 명령어에 전달합니다.

```bash
lfx serve flows/Simple_Agent.json
```

    `lfx serve`는 플로우를 HTTP API 엔드포인트로 노출하는 FastAPI 앱을 시작합니다.
자세한 내용은 [Langflow LFX README](https://github.com/langflow-ai/langflow/blob/main/src/lfx/README.md)를 참고하세요.

## `environments.yaml`로 여러 환경 관리하기[​](#manage-multiple-environments-with-environmentsyaml "Direct link to manage-multiple-environments-with-environmentsyaml")

초기화 시 생성되는 `environments.yaml` 파일에는 배포 환경에 대한 세 가지 예시 항목이 포함됩니다.

```yaml
local:
  url: http://127.0.0.1:7860
  api_key_env: LANGFLOW_LOCAL_API_KEY
staging:
  url: https://staging.example.com
  api_key_env: LANGFLOW_STAGING_API_KEY
production:
  url: https://langflow.example.com
  api_key_env: LANGFLOW_PRODUCTION_API_KEY
```

각 항목에는 Langflow 기본 URL을 위한 `url`과 `api_key_env` 필드가 포함됩니다.
`api_key_env` 필드는 `export`하거나 `.env` 파일에 저장하는 환경 변수의 이름을 지정하며, 비밀 문자열 자체는 저장하지 않으므로 `environments.yaml`을 버전 관리에 커밋해도 안전합니다.

`environments.yaml`의 `local`, `staging`, `production`이라는 이름은 관례일 뿐이며, 프로젝트에 필요한 어떤 이름으로도 지정할 수 있습니다. 항목을 세 개 이상 추가할 수도 있습니다.

`environments.yaml`은 Langflow나 LFX의 `.env` 파일과는 별개입니다. `environments.yaml`은 배포 대상이 되는 원격 Langflow 인스턴스, 플로우 버전 관리, API 키를 위한 환경 변수 *이름*을 제어합니다.
`.env`는 Langflow 서버의 런타임 값을 담고 있으며, *실제 비밀 값*도 포함할 수 있으므로 `.env`는 버전 관리에 커밋되지 않아야 합니다.

`lfx pull`이나 `lfx push`처럼 Langflow 서버를 HTTP로 호출하는 명령어는 `--env ENVIRONMENT_NAME`을 사용하여 요청을 보낼 Langflow 인스턴스를 결정합니다.

예를 들어 `environments.yaml`의 `local`이라는 서버에 `push` 요청을 보내려면 다음을 실행합니다.

```bash
lfx push --env local
```

이 명령어는 `LANGFLOW_LOCAL_API_KEY`라는 이름의 Langflow API 키를 사용하여 `http://127.0.0.1:7860`의 Langflow 기본 URL로 요청을 보냅니다.
