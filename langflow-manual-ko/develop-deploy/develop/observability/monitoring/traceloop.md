# Traceloop

> 원문: https://docs.langflow.org/next/integrations-instana-traceloop

Traceloop SDK는 LLM 애플리케이션을 위해 설계된 경량 계측 툴킷입니다.
개발자가 LLM 기반 워크플로우에서 트레이스, 지표, 주요 관측성 신호를 자동으로 캡처하고 내보낼 수 있게 해줍니다.

Instana와 결합하면 Traceloop에서 내보낸 텔레메트리 데이터가 엔드투엔드 가시성을 제공하여, 트레이스를 시각화하고, 성능 병목 지점을 분석하고, LLM 기반 애플리케이션의 안정적인 운영을 보장할 수 있습니다.

이 가이드는 Traceloop SDK를 사용하여 Instana 관측성 플랫폼을 Langflow 애플리케이션과 통합해 LLM 성능을 모니터링하고 분석하는 방법을 보여줍니다.

## 사전 준비 사항

- [Traceloop API 키](https://app.traceloop.com/settings/api-key) 생성
- [Instana endpoint와 Instana key](https://www.ibm.com/docs/en/instana-observability/1.0.302) 생성
- [Langflow 설치](https://docs.langflow.org/get-started-installation)

## 환경 변수 구성

1. Langflow 애플리케이션의 루트 폴더에서 기존 Langflow `.env` 파일을 편집하거나 새로 만듭니다.

2. 다음 환경 변수를 입력하고, 자신의 배포 환경이나 요구 사항에 맞는 값으로 자리표시자를 교체합니다.

```text
TRACELOOP_API_KEY=tl_dummy_1234567890abcdef1234567890abcdef
TRACELOOP_BASE_URL=https://otlp-magenta-saas.instana.rocks:4318
TRACELOOP_HEADERS="x-instana-key=INSTANA_KEY"
OTEL_EXPORTER_OTLP_INSECURE=false
TRACELOOP_METRICS_ENDPOINT=HOST:8000
TRACELOOP_METRICS_ENABLED=true
OTEL_METRIC_EXPORT_INTERVAL=10000
```

    각 환경 변수에 필요한 값을 설정하세요.

  - **`TRACELOOP_API_KEY`**: 애플리케이션을 Traceloop의 모니터링 서비스에 인증하기 위한 Traceloop API 키입니다.
Traceloop 계정 대시보드에서 발급받을 수 있습니다.

        이 통합은 계측을 위해 Traceloop SDK를 사용하며, 이는 올바르게 초기화되기 위해 Traceloop API 키가 필요합니다.
Traceloop API 키가 없다면 위 예시의 자리표시자 API 키로 진행할 수 있습니다.

  - **`TRACELOOP_BASE_URL`**: 텔레메트리 데이터 수집을 위한 Instana 엔드포인트 URL로, `https://otlp-magenta-saas.instana.rocks:4318`처럼 Instana 백엔드 엔드포인트입니다.
Instana 구성에서 확인하거나 Instana 관리자에게 문의하여 얻을 수 있습니다.

  - **`TRACELOOP_HEADERS`**: Instana 데이터 수집을 위한 인증 헤더입니다. `"x-instana-key=INSTANA_KEY"`로 설정하고, `INSTANA_KEY`를 Instana 설정의 Instana key로 교체하세요.

  - **`OTEL_EXPORTER_OTLP_INSECURE`**: OpenTelemetry Protocol 연결의 보안 설정입니다. 안전한 HTTPS/TLS 연결을 위해 `false`로 설정합니다. 프로덕션 환경의 Instana SaaS 엔드포인트에는 이 값을 권장합니다. 로컬 개발 시 안전하지 않은 HTTP 연결을 사용하려면 `true`로 설정합니다.

  - **`TRACELOOP_METRICS_ENDPOINT`**: `OTEL_DC_LLM_HOST:8000` 형태의 별도 지표 엔드포인트 구성입니다. 일반적으로 Docker 환경에서는 `host.docker.internal:8000`으로 설정합니다. 배포 환경에 맞게 호스트와 포트를 조정하세요.

  - **`TRACELOOP_METRICS_ENABLED`**: 지표 수집을 활성화하는 불리언 값입니다. 지표 수집을 활성화하려면 `true`로 설정합니다.

  - **`OTEL_METRIC_EXPORT_INTERVAL`**: 지표 내보내기 주기(밀리초)입니다. 10초 간격으로 내보내려면 `10000`으로 설정하거나, 모니터링 요구 사항에 맞게 조정하세요.

3. OpenTelemetry Data Collector(OTel DC)가 실행 중이고 올바르게 구성되어 있는지 확인합니다.
Collector의 `config.yaml` 파일을 열어 다음 구성을 입력하고, 자신의 데이터 수집기 설정이나 요구 사항에 맞는 값으로 자리표시자를 교체합니다.

```yaml
llm.application: "LLM_DC"
instances:
   -  otel.agentless.mode: true
      # 예시 엔드포인트: https://otlp-magenta-saas.instana.rocks:4318
      otel.backend.url: "INSTANA_ENDPOINT"
      otel.backend.using.http: false
      callback.interval: 10
      otel.service.name: "DC1"
      otel.service.port: 8000
      currency: "USD"
```

    이 구성은 OTel Collector가 에이전트 없는(agentless) 모드로 동작하고, 적절한 서비스 식별과 수집 주기로 텔레메트리 데이터를 Instana 백엔드로 라우팅하여 효과적인 모니터링 통합을 가능하게 합니다.

## Traceloop 환경 변수로 Langflow 시작하기

`.env` 파일로 Langflow 애플리케이션을 실행합니다.

```bash
uv run langflow run --env-file .env
```

Traceloop는 자동으로 LLM 애플리케이션의 텔레메트리 데이터를 모니터링하고 수집하기 시작합니다.

## 통합 확인하기

관측성이 올바르게 작동하는지 확인하려면 다음을 수행하세요.

1. Langflow에서 플로우를 실행하여 트래픽을 생성합니다.

2. Instana에서 트레이스를 보려면 Instana를 열고 **Applications**를 클릭합니다.

3. **Services**에서 `Langflow`를 검색합니다.

4. **Langflow**를 클릭하여 관련 호출을 보고 분석합니다.

    ![Instana Traces dashboard](https://docs.langflow.org/assets/images/instana-traces-dashboard-7a5ce59fac982187ad0c164ecc8c1a88.png)

5. Instana에서 지표를 보려면 Instana를 열고 **Infrastructure**를 클릭합니다.

6. **Analyze Infrastructure**에서 **Otel LLMonitor**를 클릭합니다.

7. Metrics 대시보드를 보려면 `LLM:DC1@your_machine_name.local`을 클릭합니다.

    ![Instana Metrics dashboard](https://docs.langflow.org/assets/images/instana-metrics-dashboard-851f26fbc752c3c8e382f7a2513a7db8.png)

## 참고 자료

- [Traceloop 문서](https://www.traceloop.com/docs/introduction)
- [Instana 설정 문서](https://www.ibm.com/docs/en/instana-observability/1.0.300?topic=started-instana-setup)
- [Otel DC 설정 문서](https://www.ibm.com/docs/en/instana-observability/1.0.300?topic=started-install-otel-data-collector-llm-odcl)
