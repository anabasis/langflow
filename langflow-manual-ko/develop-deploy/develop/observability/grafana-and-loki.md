# Grafana와 Loki

> 원문: https://docs.langflow.org/next/observability-grafana-loki

Langflow는 [Grafana Loki](https://grafana.com/oss/loki/)에서 수집할 수 있도록 구조화된 JSON 로그를 출력할 수 있습니다.

이 페이지는 Langflow 저장소에 포함된 [참조 Grafana 스택](https://github.com/langflow-ai/langflow/tree/main/deploy/observability/grafana-loki)에 Langflow를 연결하는 방법을 보여줍니다.
자세한 내용은 [README](https://github.com/langflow-ai/langflow/tree/main/deploy/observability/grafana-loki)를 참고하세요.

다른 수집 도구로 Langflow의 구조화된 로그를 수집하려면 [로그](https://docs.langflow.org/logging)를 참고하세요.

## 사전 준비 사항

- [참조 Grafana 스택](https://github.com/langflow-ai/langflow/tree/main/deploy/observability/grafana-loki)에 접근하려면 [Langflow 저장소를 클론](https://docs.langflow.org/contributing-how-to-contribute#install-langflow-from-source)하세요. 자체 Grafana 및 Loki 인스턴스를 사용하는 경우 저장소를 클론할 필요는 없습니다.
- [Docker와 Docker Compose](https://docs.docker.com/)

## 환경 변수 구성

1. Langflow 애플리케이션의 루트 폴더에서 기존 `.env` 파일을 편집하거나 새로 만듭니다.

2. 다음 환경 변수를 추가합니다. 자신의 배포 환경에 맞는 값으로 자리표시자를 교체하세요.

```text
LANGFLOW_LOG_ENV=container
LANGFLOW_LOG_LEVEL=INFO
LANGFLOW_LOG_FILE=/var/log/langflow/langflow.log
LANGFLOW_SERVICE_NAME=langflow
LANGFLOW_VERSION=1.10.0
LANGFLOW_ENVIRONMENT=production
```

    `LANGFLOW_LOG_ENV=container`를 설정하면 structlog의 터미널 프로세서가 [`JSONRenderer`](https://www.structlog.org/en/stable/api.html#structlog.processors.JSONRenderer)로 전환되어, stdout에 기록되는 모든 줄이 이벤트 메시지, 레벨, 타임스탬프, 로거 이름, 예외 구조, 서비스 메타데이터를 포함하는 JSON 객체가 됩니다. 자세한 내용은 [로그](https://docs.langflow.org/logging)를 참고하세요.

    제공되는 Promtail 구성은 stdout이 아니라 디렉터리에서 `*.log` 파일을 스크레이핑합니다. `LANGFLOW_LOG_FILE`은 Promtail이 감시하는 디렉터리 내의 파일을 가리켜야 합니다. Langflow가 올바른 위치에 파일을 생성하도록 `LANGFLOW_LOG_DIR`을 동일한 디렉터리로 설정하세요.

3. 저장소에서 제공하는 Loki + Promtail + Grafana 참조 스택을 시작합니다.

```text
cd deploy/observability/grafana-loki
export LANGFLOW_LOG_DIR=/var/log/langflow
docker compose up -d
```

4. `.env` 파일로 Langflow를 실행합니다.

```text
uv run langflow run --env-file .env
```

5. Langflow에서 플로우를 실행하여 로그 트래픽을 생성합니다.

6. `http://localhost:3000`에서 Grafana를 열고 **Dashboards** > **Langflow Logs**로 이동하여 구조화된 로그 출력을 확인합니다. 여기에는 구조화된 트레이스백, PII 마스킹, 표준 라이브러리 출력, 서비스/환경/버전 커버리지에 대한 패널이 포함됩니다.

## 참고 자료

- [로그](https://docs.langflow.org/logging)
- [Logs 엔드포인트](https://docs.langflow.org/api-logs)
