# Langfuse

> 원문: https://docs.langflow.org/next/integrations-langfuse

[Langfuse](https://langfuse.com)는 LLM 관측성(observability)을 위한 오픈소스 플랫폼입니다. AI 애플리케이션에 대한 트레이싱과 모니터링 기능을 제공하여 개발자가 AI 시스템을 디버깅, 분석, 최적화할 수 있도록 돕습니다. Langfuse는 Langflow와 같은 워크플로우 빌더 및 런타임을 포함한 다양한 도구 및 프레임워크와 통합됩니다.

이 가이드는 플로우 실행에 대한 [트레이싱](https://langfuse.com/docs/tracing) 데이터를 수집하고 이를 자동으로 Langfuse로 전송하도록 Langflow를 구성하는 방법을 설명합니다.

## 사전 준비 사항

- [Langfuse Cloud](https://cloud.langfuse.com) 또는 [Langfuse 자체 호스팅](https://langfuse.com/self-hosting) 인스턴스의 계정
- 트레이싱하려는 [플로우](https://docs.langflow.org/concepts-flows)가 있는 [실행 중인 Langflow 서버](https://docs.langflow.org/get-started-installation)

팁

Langfuse 통합을 테스트할 플로우가 필요하다면 [Langflow 퀵스타트](https://docs.langflow.org/get-started-quickstart)를 참고하세요.

## Langfuse 자격 증명을 환경 변수로 설정하기

1. [Langfuse API 키](https://langfuse.com/faq/all/where-are-langfuse-api-keys) 세트를 생성합니다.

2. 다음 API 키 정보를 복사합니다.

  - Secret key
  - Public key
  - Base URL

  팁
      Langflow는 이전에 Langfuse base URL을 위해 `LANGFUSE_HOST`를 사용했습니다.
이는 하위 호환성을 위해 여전히 지원되지만, 이제 `LANGFUSE_BASE_URL`이 선호되는 환경 변수이며 두 값이 모두 설정된 경우 이 값이 사용됩니다.

3. Langfuse 프로젝트 자격 증명을 환경 변수로 설정합니다.

    아래 예제에서 `SECRET_KEY`, `PUBLIC_KEY`, `LANGFUSE_BASE_URL`을 Langfuse에서 확인한 자신의 API 키 정보로 교체하세요.
`.env` 파일에 다음 항목을 추가합니다.

```bash
LANGFUSE_SECRET_KEY=sk-...
LANGFUSE_PUBLIC_KEY=pk-...
LANGFUSE_BASE_URL=https://us.cloud.langfuse.com
```

4. `.env` 파일의 구성으로 Langflow를 시작합니다.

```bash
uv run langflow run --env-file .env
```

5. 플로우를 실행합니다.

    Langflow는 플로우 실행에 대한 트레이싱 데이터를 자동으로 수집하여 Langfuse로 전송합니다.

6. [Langfuse 대시보드](https://langfuse.com/docs/analytics/overview)에서 수집된 데이터를 확인합니다.

    Langfuse는 [공개 실시간 트레이스 예시 대시보드](https://cloud.langfuse.com/project/cm0nywmaa005c3ol2msoisiho/traces/f016ae6d-4527-43f5-93ba-9d78388cd3d9)도 제공합니다.

## Langfuse 트레이싱 비활성화

Langfuse 통합을 비활성화하려면 [Langfuse 환경 변수](#langfuse-자격-증명을-환경-변수로-설정하기)를 제거한 다음 Langflow를 재시작하세요.

## Docker Compose로 Langfuse와 Langflow 실행하기

앞서 설명한 설정의 대안으로, 특히 자체 호스팅 Langfuse의 경우 Docker Compose로 두 서비스를 함께 실행할 수 있습니다.

1. [Langfuse API 키](https://langfuse.com/faq/all/where-are-langfuse-api-keys) 세트를 생성합니다.

2. 다음 API 키 정보를 복사합니다.

  - Secret key
  - Public key
  - Base URL

  팁
      Langflow는 이전에 Langfuse base URL을 위해 `LANGFUSE_HOST`를 사용했습니다. `LANGFUSE_HOST`는 하위 호환성을 위해 여전히 지원되지만, `LANGFUSE_BASE_URL`이 선호되는 환경 변수입니다.
두 값이 모두 설정된 경우 `LANGFLOW_BASE_URL`이 사용됩니다.

3. Langflow `docker-compose.yml` 파일의 `environment` 섹션에 Langflow 자격 증명을 추가합니다.

    다음 예제는 [예시 `docker-compose.yml`](https://github.com/langflow-ai/langflow/blob/main/docker_example/docker-compose.yml)을 기반으로 합니다.

```yml
services:
  langflow:
    image: langflowai/langflow:latest # https://hub.docker.com/r/langflowai/langflow 에서 다른 버전 태그 확인 가능
    pull_policy: always               # 'latest' 이미지를 사용할 때는 'always'로 설정
    ports:
      - "7860:7860"
    depends_on:
      - postgres
    environment:
      - LANGFLOW_DATABASE_URL=postgresql://langflow:langflow@postgres:5432/langflow
      # 이 변수는 로그, 파일 저장소, 모니터 데이터, 비밀 키가 저장되는 위치를 정의합니다.
      - LANGFLOW_CONFIG_DIR=app/langflow
      - LANGFUSE_SECRET_KEY=sk-...
      - LANGFUSE_PUBLIC_KEY=pk-...
      - LANGFUSE_BASE_URL=https://us.cloud.langfuse.com
    volumes:
      - langflow-data:/app/langflow

  postgres:
    # 기존 볼륨에서 glibc 콜레이션 불일치 경고를 유발하는 postgres:16 태그의
    # OS 자동 변경을 막기 위해 특정 Debian 베이스(trixie)로 고정합니다.
    # https://github.com/langflow-ai/langflow/issues/9608 참고
    image: postgres:16-trixie
    environment:
      POSTGRES_USER: langflow
      POSTGRES_PASSWORD: langflow
      POSTGRES_DB: langflow
    ports:
      - "5432:5432"
    volumes:
      - langflow-postgres:/var/lib/postgresql/data

volumes:
  langflow-postgres:
  langflow-data:
```

4. Docker 컨테이너를 시작합니다.

```text
docker-compose up
```

5. Langfuse가 Langflow 컨테이너에 연결되었는지 확인하려면 다음 명령을 실행합니다.

```sh
docker compose exec langflow python -c "import requests, os; addr = os.environ.get('LANGFUSE_BASE_URL'); print(addr); res = requests.get(addr, timeout=5); print(res.status_code)"
```

    오류가 발생하면 `docker-compose.yml` 파일에 `LANGFUSE_BASE_URL` 환경 변수를 설정했는지 확인하세요.

    다음과 유사한 출력이 나타나면 성공한 것입니다.

```text
https://us.cloud.langfuse.com
200
```

## 참고 자료

- [Langfuse GitHub 저장소](https://github.com/langfuse/langfuse)
