# Docker에서 Langflow 배포하기
> 원문: https://docs.langflow.org/next/deployment-docker

tip

Podman은 여기에 표시된 모든 명령에서 Docker 대신 사용할 수 있습니다. 자세한 내용은 [Podman 문서](https://podman.io/docs)를 참조하세요.

Docker 컨테이너에서 애플리케이션을 실행하면 서로 다른 시스템 간에 일관된 동작을 보장하고 의존성 충돌을 없앨 수 있습니다.

Langflow Docker 이미지를 사용하여 Langflow 컨테이너를 시작할 수 있습니다.

이 가이드는 [Docker](https://docs.docker.com/)와 [Docker Compose](https://docs.docker.com/compose/)를 사용하여 Langflow를 배포하는 여러 방법을 보여줍니다.

- [빠른 시작](#quickstart): 기본값으로 Langflow 컨테이너를 시작합니다.
- [Docker Compose 사용](#clone): Langflow 저장소를 클론한 다음, Docker Compose를 사용하여 Langflow Docker 컨테이너를 빌드합니다.
이 옵션은 기본 Langflow Docker 이미지를 사용하면서도 영구적인 PostgreSQL 데이터베이스 서비스를 포함한 구성에 대해 더 많은 제어권을 제공합니다.
- [커스텀 플로우 이미지 생성](#package-your-flow-as-a-docker-image): Dockerfile을 사용하여 플로우를 Docker 이미지로 패키징합니다.
- [커스텀 Langflow 이미지 생성](#customize-the-langflow-docker-image): Dockerfile을 사용하여 자체 코드, 커스텀 의존성 또는 기타 수정 사항을 포함하는 커스텀 Langflow Docker 이미지를 패키징합니다.
- [Langflow Docker 이미지 업그레이드](#upgrade-the-langflow-docker-image): 영구 볼륨을 사용하고 컨테이너만 교체하여 데이터베이스나 플로우를 잃지 않고 새 이미지로 업그레이드합니다.

## 빠른 시작: 기본값으로 Langflow 컨테이너 시작하기[​](#quickstart "Direct link to Quickstart: Start a Langflow container with default values")

시스템에 Docker가 설치되어 실행 중인 상태에서 다음 명령을 실행합니다.

```
docker run -p 7860:7860 langflowai/langflow:latest
```

그런 다음 `http://localhost:7860/`에서 Langflow에 접근합니다.

이 컨테이너는 기본 설정으로 사전 빌드된 Docker 이미지를 실행합니다.
구성에 대한 더 많은 제어가 필요하면 [저장소를 클론하고 Langflow Docker 컨테이너 실행하기](#clone)를 참조하세요.

## 저장소를 클론하고 Langflow Docker 컨테이너 실행하기[​](#clone "Direct link to Clone the repo and run the Langflow Docker container")

Langflow 저장소를 클론하고 Docker Compose를 사용하면 환경 변수를 커스터마이즈하고, (기본 SQLite 데이터베이스 대신) 영구적인 PostgreSQL 데이터베이스 서비스를 사용하며, 커스텀 의존성을 포함하는 등 구성에 대해 더 많은 제어권을 얻을 수 있습니다.

Docker Compose를 사용한 기본 배포에는 다음이 포함됩니다.

- **Langflow 서비스**: PostgreSQL을 데이터베이스로 사용하여 최신 Langflow 이미지를 실행합니다.
- **PostgreSQL 서비스**: 플로우, 사용자, 설정에 대한 영구 데이터 스토리지를 제공합니다.
- **영구 볼륨**: 컨테이너를 재시작해도 데이터가 유지되도록 보장합니다.

전체 Docker Compose 구성은 `docker_example/docker-compose.yml`에서 확인할 수 있습니다.

1. Langflow 저장소를 클론합니다.

  ```
  git clone https://github.com/langflow-ai/langflow.git
  ```

2. `docker_example` 디렉터리로 이동합니다.

  ```
  cd langflow/docker_example
  ```

3. Docker Compose 파일을 실행합니다.

  ```
  docker compose up
  ```

4. `http://localhost:7860/`에서 Langflow에 접근합니다.

### 배포 커스터마이즈[​](#customize-your-deployment "Direct link to Customize your deployment")

특정 배포에 맞게 Docker Compose 구성을 커스터마이즈할 수 있습니다.

예를 들어, `.env` 파일을 사용하여 컨테이너의 데이터베이스 자격 증명을 구성하려면 다음을 수행하세요.

1. `docker-compose.yml`과 같은 디렉터리에 데이터베이스 자격 증명이 포함된 `.env` 파일을 생성합니다.

  ```
  # Database credentials
  POSTGRES_USER=myuser
  POSTGRES_PASSWORD=mypassword
  POSTGRES_DB=langflow

  # Langflow configuration
  LANGFLOW_DATABASE_URL=postgresql://myuser:mypassword@postgres:5432/langflow
  LANGFLOW_CONFIG_DIR=/app/langflow
  ```

2. `langflow`와 `postgres` 서비스 모두에서 `.env` 파일을 참조하도록 `docker-compose.yml` 파일을 수정합니다.

  ```
  services:
    langflow:
      environment:
        - LANGFLOW_DATABASE_URL=${LANGFLOW_DATABASE_URL}
        - LANGFLOW_CONFIG_DIR=${LANGFLOW_CONFIG_DIR}
    postgres:
      environment:
        - POSTGRES_USER=${POSTGRES_USER}
        - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
        - POSTGRES_DB=${POSTGRES_DB}
  ```

사용 가능한 환경 변수의 전체 목록은 [Langflow 환경 변수](https://docs.langflow.org/environment-variables)를 참조하세요.

더 많은 커스터마이즈 옵션은 [자체 코드로 Langflow Docker 이미지 커스터마이즈](#customize-the-langflow-docker-image)를 참조하세요.

## 플로우를 Docker 이미지로 패키징하기[​](#package-your-flow-as-a-docker-image "Direct link to Package your flow as a Docker image")

이 섹션은 Langflow 플로우를 포함하는 Docker 이미지를 빌드하는 Dockerfile을 생성하는 방법을 보여줍니다. 이 방법은 특정 플로우를 독립 실행형 컨테이너로 배포하거나 Kubernetes와 같은 환경에 배포하려는 경우에 유용합니다.

사전 빌드된 이미지를 사용하는 이전 섹션과 달리, 이 방법은 플로우가 내장된 커스텀 이미지를 빌드합니다.

1. 프로젝트 디렉터리를 생성하고 해당 디렉터리로 이동합니다.

  ```
  mkdir langflow-custom && cd langflow-custom
  ```

2. 디렉터리에 플로우의 JSON 파일을 추가합니다. 예제를 다운로드하거나 자신의 것을 사용할 수 있습니다.

  ```
  # Download an example flow
  wget https://raw.githubusercontent.com/langflow-ai/langflow-helm-charts/refs/heads/main/examples/flows/basic-prompting-hello-world.json

  # Or copy your own flow file
  cp /path/to/your/flow.json .
  ```

3. 커스텀 이미지를 빌드할 Dockerfile을 생성합니다.

  ```
  FROM langflowai/langflow:latest
  RUN mkdir /app/flows
  COPY ./*.json /app/flows/
  ENV LANGFLOW_LOAD_FLOWS_PATH=/app/flows
  ```

이 Dockerfile은 공식 Langflow 이미지를 기반 이미지로 사용하고, 플로우를 위한 디렉터리를 생성하고, JSON 플로우 파일을 해당 디렉터리에 복사하며, Langflow가 플로우를 찾을 위치를 알려주는 환경 변수를 설정합니다.

4. 커스텀 이미지를 빌드하고 테스트합니다.

  ```
  docker build -t myuser/langflow-custom:1.0.0 .
  docker run -p 7860:7860 myuser/langflow-custom:1.0.0
  ```

5. (선택 사항) 이미지를 Docker Hub에 푸시합니다.

  ```
  docker push myuser/langflow-custom:1.0.0
  ```

이제 커스텀 이미지에는 플로우가 포함되어 있으며 Docker가 실행되는 어디에나 배포할 수 있습니다. Kubernetes 배포에 대해서는 [Kubernetes에 Langflow 프로덕션 환경 배포](https://docs.langflow.org/deployment-kubernetes-prod)를 참조하세요.

## 자체 코드로 Langflow Docker 이미지 커스터마이즈하기[​](#customize-the-langflow-docker-image "Direct link to Customize the Langflow Docker image with your own code")

이전 섹션이 Docker 이미지와 함께 플로우를 패키징하는 방법을 보여줬다면, 이 섹션은 Langflow 애플리케이션 자체를 커스터마이즈하는 방법을 보여줍니다. 이는 커스텀 Python 패키지나 의존성을 추가하거나, Langflow의 구성이나 설정을 수정하거나, 커스텀 컴포넌트나 도구를 포함하거나, Langflow의 기능을 확장하기 위해 자체 코드를 추가해야 할 때 유용합니다.

이 예제는 **Message History** 컴포넌트를 커스터마이즈하는 방법을 보여주지만, 동일한 방식을 모든 코드 수정에 사용할 수 있습니다.

```
FROM langflowai/langflow:latest

# Set working directory
WORKDIR /app

# Copy your modified memory component
COPY src/lfx/src/lfx/components/helpers/memory.py /tmp/memory.py

# Find the site-packages directory where langflow is installed
RUN python -c "import site; print(site.getsitepackages()[0])" > /tmp/site_packages.txt

# Replace the file in the site-packages location
RUN SITE_PACKAGES=$(cat /tmp/site_packages.txt) && \
    echo "Site packages at: $SITE_PACKAGES" && \
    mkdir -p "$SITE_PACKAGES/langflow/components/helpers" && \
    cp /tmp/memory.py "$SITE_PACKAGES/langflow/components/helpers/"

# Clear Python cache in the site-packages directory only
RUN SITE_PACKAGES=$(cat /tmp/site_packages.txt) && \
    find "$SITE_PACKAGES" -name "*.pyc" -delete && \
    find "$SITE_PACKAGES" -name "__pycache__" -type d -exec rm -rf {} +

# Expose the default Langflow port
EXPOSE 7860

# Command to run Langflow
CMD ["python", "-m", "langflow", "run", "--host", "0.0.0.0", "--port", "7860"]
```

이 커스텀 Dockerfile을 사용하려면 다음을 수행하세요.

1. 커스텀 Langflow 설정을 위한 디렉터리를 생성합니다.

  ```
  mkdir langflow-custom && cd langflow-custom
  ```

2. 커스텀 코드에 필요한 디렉터리 구조를 생성합니다.
이 예제에서 Langflow는 `memory.py`가 `/helpers` 디렉터리에 존재하기를 기대하므로, 해당 위치에 디렉터리를 생성합니다.

  ```
  mkdir -p src/lfx/src/lfx/components/helpers
  ```

3. 수정한 `memory.py` 파일을 `/helpers` 디렉터리에 배치합니다.

4. `langflow-custom` 디렉터리에 `Dockerfile`이라는 새 파일을 생성하고, 위에 표시된 Dockerfile 내용을 복사해 넣습니다.

5. 이미지를 빌드하고 실행합니다.

  ```
  docker build -t myuser/langflow-custom:1.0.0 .
  docker run -p 7860:7860 myuser/langflow-custom:1.0.0
  ```

이 방식은 파일 경로와 컴포넌트 이름을 수정하여 Langflow에 추가하고자 하는 다른 모든 컴포넌트나 커스텀 코드에 맞게 적용할 수 있습니다.

## Langflow Docker 이미지 업그레이드하기[​](#upgrade-the-langflow-docker-image "Direct link to Upgrade the Langflow Docker image")

데이터베이스나 플로우를 잃지 않고 Langflow Docker 배포를 업그레이드하려면 다음을 수행하세요.

1. 데이터를 영구 볼륨에 유지하여, Langflow를 업그레이드할 때 컨테이너 이미지만 교체하도록 합니다.
Langflow 데이터와 데이터베이스에 컨테이너 외부에서 유지되도록 Docker 볼륨이나 바인드 마운트를 사용하세요.
예를 들어 다음 Docker Compose 파일은 Langflow 데이터(호스트의 `./langflow-data`)에는 바인드 마운트를, PostgreSQL 데이터베이스(`langflow-postgres`)에는 명명된 볼륨을 사용합니다.

  ```yaml
  services:
    langflow:
      image: langflowai/langflow:1.8.0
      environment:
        - LANGFLOW_CONFIG_DIR=/app/langflow
      volumes:
        - ./langflow-data:/app/langflow
    postgres:
      # Pinned to a specific Debian base (trixie) so the postgres:16 tag does
      # not silently roll its OS, which triggers a glibc collation mismatch
      # warning on existing volumes. See https://github.com/langflow-ai/langflow/issues/9608
      image: postgres:16-trixie
      volumes:
        - langflow-postgres:/var/lib/postgresql/data

  volumes:
    langflow-postgres:
  ```
    추가 예제는 [Docker Compose 구성](#clone)과 [docker_example 컴포즈 파일](https://github.com/langflow-ai/langflow/blob/main/docker_example/docker-compose.yml)을 참조하세요.

2. 새 이미지를 가져오고 `docker-compose.yml` 또는 `docker run` 명령에서 이미지 태그를 업데이트합니다.

    Docker Compose를 사용하는 경우, 컴포즈 파일에서 `image: langflowai/langflow:1.8.0`과 같이 이미지를 설정한 다음 가져옵니다.

  ```
  docker compose pull
  ```
    `docker run`을 사용하는 경우, 이미지를 가져옵니다.

  ```
  docker pull langflowai/langflow:1.8.0
  ```

3. 컨테이너를 재시작합니다. 동일한 볼륨이 다시 연결되므로 데이터베이스와 플로우가 유지됩니다.

    Docker Compose를 사용하는 경우:

  ```
  docker compose up -d
  ```
    `docker run`을 사용하는 경우, 동일한 볼륨 마운트와 새 이미지 태그를 사용합니다.

  ```
  docker run -p 7860:7860 -v langflow-data:/app/langflow langflowai/langflow:1.8.0
  ```

이 방식은 영구 볼륨을 Langflow 컨테이너와 분리하여, 데이터를 잃지 않고도 Langflow 애플리케이션을 업그레이드할 수 있게 합니다.

Langflow 릴리스 기반의 커스텀 이미지로 업그레이드해야 하는 경우, 예를 들어 `1.8.0`에 `uv`를 추가해야 하는 경우, 먼저 공식 이미지로부터 파생된 이미지를 빌드한 다음 위와 동일한 단계를 따르세요.
컴포즈 파일이나 `docker run`에 커스텀 이미지를 설정한 다음 가져오고 재시작합니다.

1.8.0 이미지에 `uv`를 추가하는 최소 Dockerfile은 [릴리스 노트](https://docs.langflow.org/release-notes)("Docker image no longer includes uv or uvx")를 참조하세요.
