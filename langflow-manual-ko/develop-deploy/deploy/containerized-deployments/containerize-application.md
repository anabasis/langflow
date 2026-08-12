# Langflow 애플리케이션 컨테이너화하기
> 원문: https://docs.langflow.org/next/develop-application

tip

Podman은 여기에 표시된 모든 명령에서 Docker 대신 사용할 수 있습니다. 자세한 내용은 [Podman 문서](https://podman.io/docs)를 참조하세요.

시각적 편집기에서 플로우를 설계하는 것은 Langflow를 사용하는 애플리케이션을 구축하는 첫 번째 단계일 뿐입니다.

기능하는 플로우가 있으면, 웹사이트나 모바일 앱과 같은 더 큰 애플리케이션에서 해당 플로우를 사용할 수 있습니다.
Langflow는 IDE이자 런타임이기 때문에, 로컬에서 플로우를 빌드하고 테스트한 다음 프로덕션 환경에서 플로우를 패키징하고 서비스할 수 있습니다.

이 가이드는 초기 설정부터 패키징 및 배포까지 Langflow를 사용한 애플리케이션 개발을 소개합니다.
이 문서는 완전한 애플리케이션을 작성하는 방법을 설명하지 않으며, 더 큰 애플리케이션의 맥락에서 Langflow를 포함하는 방법만 설명합니다.

## 디렉터리 구조[​](#directory-structure "Direct link to Directory structure")

다음 예제는 최소한의 Langflow 애플리케이션에 대한 디렉터리 구조를 보여줍니다.

```
LANGFLOW-APPLICATION/
├── docker.env
├── Dockerfile
├── flows/
│   ├── flow1.json
│   └── flow2.json
├── langflow-config-dir/
├── README.md
```

이 디렉터리에는 다음이 포함됩니다.

- [`docker.env`](#docker-env): 이 파일은 컨테이너 루트에 `.env` 파일로 Docker 이미지에 복사됩니다.
- [`Dockerfile`](#dockerfile): 이 파일은 Langflow 이미지가 빌드되는 방식을 제어합니다.
- [`/flows`](#flows): 이 폴더에는 애플리케이션이 사용하는, 호스팅하려는 플로우들이 들어 있습니다.
- `/langflow-config-dir`: 이 폴더는 Langflow 배포의 구성 파일, 데이터베이스, 로그의 위치로 Dockerfile에서 참조됩니다.
- `README.md`: 애플리케이션 문서를 위한 일반적인 README 파일입니다.

이는 Langflow 애플리케이션 디렉터리의 최소 예시입니다.
사용자의 애플리케이션에는 커스텀 컴포넌트를 위한 `/components` 폴더나 추가 의존성을 위한 `pyproject.toml` 파일 등 추가 파일과 폴더가 있을 수 있습니다.

### 패키지 관리[​](#package-management "Direct link to Package management")

기본 Langflow Docker 이미지는 부모 이미지로 `langflowai/langflow:latest`를 사용하기 때문에 Langflow 핵심 의존성을 포함합니다.

애플리케이션에 추가 의존성이 필요한 경우, 추가 의존성을 위한 [`pyproject.toml`](https://packaging.python.org/en/latest/guides/writing-pyproject-toml) 파일을 생성하세요.
자세한 내용은 [커스텀 의존성 설치](https://docs.langflow.org/install-custom-dependencies)를 참조하세요.

추가 의존성이 있는 애플리케이션을 Docker에 배포하려면 `pyproject.toml`과 `uv.lock` 파일을 Docker 이미지에 복사해야 합니다.
이를 위해 Langflow 애플리케이션의 Dockerfile에 다음을 추가하세요.

```
COPY pyproject.toml uv.lock /app/
```

### 환경 변수[​](#docker-env "Direct link to Environment variables")

`docker.env` 파일은 Docker 이미지에 로드되는 `.env` 파일입니다.
이 파일에는 인증, 데이터베이스 스토리지, API 키, 서버 구성 등 플로우에서 사용되거나 Langflow의 동작을 제어하는 [Langflow 환경 변수](https://docs.langflow.org/environment-variables)가 포함됩니다.
예를 들면 다음과 같습니다.

```
LANGFLOW_AUTO_LOGIN=True
LANGFLOW_SAVE_DB_IN_CONFIG_DIR=True
LANGFLOW_BASE_URL=http://0.0.0.0:7860
OPENAI_API_KEY=sk-...
```

Dockerfile에서도 환경 변수를 설정할 수 있습니다.
다만 `docker.env`와 Dockerfile 양쪽에 환경 변수를 설정하면, Langflow는 `docker.env`에 설정된 값을 사용합니다.

Langflow는 또한 [환경 변수로부터 전역 변수를 생성](https://docs.langflow.org/configuration-global-variables#add-custom-global-variables-from-the-environment)하거나, [누락된 전역 변수의 백업으로 환경 변수를 사용](https://docs.langflow.org/configuration-global-variables#use-environment-variables-for-missing-global-variables)할 수 있습니다.

### 비밀 정보(Secrets)[​](#secrets "Direct link to Secrets")

Langflow 문서의 예제는 간결함을 위해 API 키 및 기타 민감한 값에 대한 직접 참조를 사용할 수 있습니다.
사용자의 애플리케이션에서는 환경 변수나 비밀 관리 도구 사용과 같이 비밀 정보 관리에 대한 업계 모범 사례를 항상 따라야 합니다.

Langflow에서 인증 키를 생성하고 비밀 정보를 관리하는 방법에 대한 자세한 내용은 [API 키 및 인증](https://docs.langflow.org/api-keys-and-authentication)을 참조하세요.

### 스토리지[​](#storage "Direct link to Storage")

기본적으로 Langflow는 스토리지에 [SQLite](https://www.sqlite.org/) 데이터베이스를 사용합니다.
PostgreSQL을 사용하려면 [외부 PostgreSQL 데이터베이스 구성](https://docs.langflow.org/configuration-custom-database)을 참조하세요.

캐시 및 메모리를 포함한 스토리지에 대한 자세한 내용은 [메모리 관리 옵션](https://docs.langflow.org/memory)을 참조하세요.

### 플로우[​](#flows "Direct link to Flows")

로컬 Langflow 인스턴스에는 다양한 애플리케이션을 위한 많은 플로우가 있을 수 있습니다.
Langflow를 애플리케이션의 의존성으로 패키징할 때는 애플리케이션이 사용하는 플로우만 포함하고자 할 것입니다.

1. 애플리케이션과 관련된 플로우를 [내보내기(export)](https://docs.langflow.org/concepts-flows-import)합니다.

    체인된 플로우(다른 플로우를 트리거하는 플로우)가 있는 경우, 필요한 *모든* 플로우를 내보냈는지 확인하세요.

2. 내보낸 Langflow JSON 파일을 애플리케이션 디렉터리의 `/flows` 폴더에 추가합니다.

### 컴포넌트[​](#components "Direct link to Components")

Langflow 시각적 편집기에서 보이는 **코어 컴포넌트**와 **번들**은 기본 Langflow Docker 이미지에 자동으로 포함됩니다.

애플리케이션을 위한 [커스텀 컴포넌트](https://docs.langflow.org/components-custom-components)가 있다면 애플리케이션 디렉터리에 포함하세요.
커스텀 컴포넌트는 기본 디렉터리에 바로 두지 말고 카테고리 폴더 안에 배치해야 합니다.

1. 애플리케이션 디렉터리에 `/components` 폴더를 생성합니다.

2. `/components` 내부에 카테고리 하위 폴더를 생성합니다(예: `/components/data`, `/components/tools`).

3. 커스텀 컴포넌트 파일을 적절한 카테고리 폴더에 추가합니다.

4. `/components` 폴더를 Docker 이미지에 복사하고 `LANGFLOW_COMPONENTS_PATH` 환경 변수를 설정합니다.

  ```
  COPY components /app/components
  ENV LANGFLOW_COMPONENTS_PATH=/app/components
  ```

## Langflow Dockerfile[​](#dockerfile "Direct link to Langflow Dockerfile")

Dockerfile은 의존성, 플로우, 컴포넌트, 구성 파일을 포함하여 Langflow 이미지가 빌드되는 방식을 결정합니다.

최소한, 기본 Langflow 이미지를 지정하고, 컨테이너 내에 필요한 폴더를 생성하고, 폴더와 파일을 컨테이너에 복사하고, 시작 명령을 제공해야 합니다.

```
# Use the latest version of the base Langflow image
FROM langflowai/langflow:latest

# Create folders and set the working directory in the container
RUN mkdir /app/flows
RUN mkdir /app/langflow-config-dir
WORKDIR /app

# Copy flows, langflow-config-dir, and docker.env to the container
COPY flows /app/flows
COPY langflow-config-dir /app/langflow-config-dir
COPY docker.env /app/.env

# Optional: Copy custom components to the container
COPY components /app/components

# Optional: Use custom dependencies
COPY pyproject.toml uv.lock /app/

# Set environment variables if not set in docker.env
ENV PYTHONPATH=/app
ENV LANGFLOW_LOAD_FLOWS_PATH=/app/flows
ENV LANGFLOW_CONFIG_DIR=/app/langflow-config-dir
ENV LANGFLOW_COMPONENTS_PATH=/app/components
ENV LANGFLOW_LOG_ENV=container

# Command to run the Langflow server on port 7860
EXPOSE 7860
CMD ["langflow", "run", "--backend-only", "--env-file","/app/.env","--host", "0.0.0.0", "--port", "7860"]
```

이 Dockerfile에서 직접 설정된 환경 변수는 Langflow의 리소스 경로를 지정합니다.
이러한 변수가 `docker.env`에도 설정되어 있으면, `docker.env`의 값이 Dockerfile에 설정된 값을 재정의합니다.

이 예제에서 `ENV LANGFLOW_LOG_ENV=container`는 컨테이너화된 환경에서 애플리케이션의 동작을 추적하기 위해 직렬화된 JSON을 `stdout`으로 보내는 로깅 동작을 설정합니다. 자세한 내용은 [로깅](https://docs.langflow.org/logging)을 참조하세요.

### 백엔드 전용 모드[​](#backend-only-mode "Direct link to Backend-only mode")

`CMD`의 `--backend-only` 플래그는 Langflow를 백엔드 전용 모드로 시작하며, 이는 프로그래밍 방식의 접근만 제공합니다.
시각적 편집기에 대한 접근이 필요하지 않은 애플리케이션의 의존성으로 Langflow를 실행하는 경우 권장됩니다.

Langflow 시각적 편집기 *및* 백엔드를 함께 서비스하려면 `--backend-only`를 생략하세요.

자세한 내용은 [Docker에서 Langflow 배포](https://docs.langflow.org/deployment-docker)를 참조하세요.

## Langflow Docker 이미지 테스트[​](#test-your-langflow-docker-image "Direct link to Test your Langflow Docker image")

Langflow Docker 이미지를 빌드하고 실행하여 테스트하세요.

이 예제는 컨테이너를 로컬에서 실행합니다.
Docker Hub에 이미지를 게시하고 원격으로 Langflow 컨테이너를 실행하는 방법에 대한 정보는 [Docker Hub 및 Kubernetes에 배포](#deploy-docker)를 참조하세요.

1. Docker 이미지 빌드:

  ```
  docker build -t langflow-pokedex:1.2.0 .
  ```

2. Docker 컨테이너를 실행하여 Langflow 서버를 시작합니다.

  ```
  docker run -p 7860:7860 langflow-pokedex:1.2.0
  ```

3. 컨테이너가 예상대로 플로우를 서비스하고 있는지 확인하려면 Langflow API를 사용하여 플로우를 실행하세요.

  1. 애플리케이션의 `/flows` 폴더에 있는 JSON 파일 중 하나를 열고, [추가 메타데이터 및 프로젝트 정보](https://docs.langflow.org/concepts-flows-import#additional-metadata-and-project-information)에서 플로우의 `id`를 찾습니다.

        여러 `id` 값이 있으므로, 개별 컴포넌트의 ID가 아니라 전체 플로우의 ID를 가져와야 합니다.
플로우가 복잡한 경우, 일반적으로 플로우의 `id` 근처에 있는 플로우 이름으로 검색해 보세요.

  ```
  "name": "Basic Prompting",
  "description": "Perform basic prompting with an OpenAI model.",
  "id": "e4167236-938f-4aca-845b-21de3f399858",
  ```

  2. 이전 단계에서 얻은 플로우 ID를 사용하여 [`/v1/run/$FLOW_ID`](https://docs.langflow.org/api-flows-run#run-flow) 엔드포인트로 POST 요청을 보냅니다.

        다음 예제는 채팅 입력 문자열에 응답하는 간단한 LLM 채팅 플로우를 실행합니다.
필요한 경우 플로우에 맞게 페이로드를 수정하세요.
예를 들어 플로우에 **Chat Input** 컴포넌트가 없다면, 플로우가 기대하는 입력을 제공하도록 페이로드를 수정해야 합니다.

  ```
  curl --request POST \
    --url 'http://localhost:7860/api/v1/run/e4167236-938f-4aca-845b-21de3f399858?stream=true' \
    --header 'Content-Type: application/json' \
    --data '{
        "input_value": "Tell me about Charizard.",
        "output_type": "chat",
        "input_type": "chat",
        "session_id": "charizard_test_request"
  }'
  ```

**이 예제에 대하여**

  이 명령은 **Pokédex** 템플릿 플로우를 실행합니다.
특정 포켓몬에 대한 채팅 입력을 제공하고, 선택적으로 커스텀 `session_id`를 사용하며, `?stream=true`로 응답 스트리밍을 활성화합니다.

        기본 [세션 ID](https://docs.langflow.org/session-id)는 플로우 ID입니다.
커스텀 세션 ID는 LLM의 컨텍스트를 깔끔하게 유지하기 위해 고유한 대화 스레드를 분리하는 데 도움이 되며, 디버깅을 쉽게 하기 위해 플로우 로그에서 특정 대화를 식별하는 데도 도움이 됩니다.

        이 명령은 Pokédex 플로우가 많은 양의 텍스트를 반환할 수 있기 때문에 응답 스트리밍을 사용합니다.
배칭을 사용하려면 `?stream=false`로 설정하세요.

  3. 실행한 특정 플로우에 따라 요청이 성공하고 응답이 유효한지 확인하세요.

        이는 Langflow Docker 이미지가 올바르게 구성되었으며 이 플로우가 컨테이너에서 호스팅되는 Langflow API 서버를 통해 접근 가능하다는 것을 확인해 줍니다.
전체 애플리케이션 스택을 빌드하고 테스트할 때, 프런트엔드 애플리케이션은 이전 단계에서 수동으로 플로우를 테스트한 것과 같은 방식으로 Langflow API 요청을 사용하여 컨테이너에서 서비스되는 플로우를 트리거할 수 있습니다.

        이 예제는 채팅 입력을 `/v1/run/$FLOW_ID` 엔드포인트로 전송하여 플로우를 트리거했습니다.
더 많은 플로우 트리거 예제는 [웹훅으로 플로우 트리거하기](https://docs.langflow.org/webhook)와 [파일을 수집할 수 있는 챗봇 만들기](https://docs.langflow.org/chat-with-files) 튜토리얼을 참조하세요.

## Docker Hub 및 Kubernetes에 배포[​](#deploy-docker "Direct link to Deploy to Docker Hub and Kubernetes")

애플리케이션을 세상에 공유할 준비가 되면, Langflow를 프로덕션 환경에서 서비스해야 합니다.
Langflow 배포에 대한 자세한 내용은 다음을 참조하세요.

- [Langflow 배포 알아보기](https://docs.langflow.org/deployment-overview)
- [Docker에서 Langflow 배포](https://docs.langflow.org/deployment-docker)
- [Kubernetes에 Langflow 프로덕션 환경 배포](https://docs.langflow.org/deployment-kubernetes-prod)
