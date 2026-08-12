# Grafana와 Loki

Langflow는 [Grafana Loki](https://grafana.com/oss/loki/)에서 수집할 수 있는 구조화된 JSON 로그를 생성할 수 있습니다.

---

## 사전 요구사항

- [Langflow 저장소 클론](./contribute.md) — 참조 Grafana 스택에 접근하기 위해
- [Docker와 Docker Compose](https://docs.docker.com/)

---

## 환경 변수 구성

1. Langflow 애플리케이션의 루트 폴더에서 기존 `.env` 파일을 편집하거나 새로 만듭니다.

2. 다음 환경 변수를 추가합니다:

```
LANGFLOW_LOG_ENV=container
LANGFLOW_LOG_LEVEL=INFO
LANGFLOW_LOG_FILE=/var/log/langflow/langflow.log
LANGFLOW_SERVICE_NAME=langflow
LANGFLOW_VERSION=1.10.0
LANGFLOW_ENVIRONMENT=production
```

`LANGFLOW_LOG_ENV=container`를 설정하면 structlog의 터미널 프로세서가 `JSONRenderer`로 전환되어 stdout에 쓰이는 모든 줄이 JSON 객체가 됩니다.

3. 저장소에서 참조 Loki + Promtail + Grafana 스택을 시작합니다:

```bash
cd deploy/observability/grafana-loki
export LANGFLOW_LOG_DIR=/var/log/langflow
docker compose up -d
```

4. `.env` 파일로 Langflow를 시작합니다:

```bash
uv run langflow run --env-file .env
```

5. Langflow에서 플로우를 실행하여 로그 트래픽을 생성합니다.

6. `http://localhost:3000`에서 Grafana를 열고 **Dashboards** > **Langflow Logs**로 이동하여 구조화된 로그 출력을 봅니다.

---

## 참고 항목

- [로그](./logging.md)
- [로그 엔드포인트](../api-reference/api-logs.md)

---

*원문: https://docs.langflow.org/next/observability-grafana-loki*
