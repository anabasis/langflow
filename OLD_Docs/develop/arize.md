# Arize 모니터링

Arize는 LLM 애플리케이션을 모니터링하고 최적화하기 위한 [OpenTelemetry](https://opentelemetry.io/) 및 [OpenInference](https://docs.arize.com/phoenix/reference/open-inference) 기반 도구입니다.

Arize 추적을 활성화하려면 Langflow 배포에서 필요한 Arize 환경 변수를 설정합니다. Arize는 자동으로 LLM 애플리케이션의 텔레메트리 데이터 모니터링 및 수집을 시작합니다.

> **팁**: Arize 문서에서도 Langflow와 Arize 통합 지침을 제공합니다:
> - [Arize Platform과 Langflow 추적](https://arize.com/docs/ax/integrations/frameworks-and-platforms/langflow/langflow-tracing)
> - [Arize Phoenix와 Langflow 추적](https://arize.com/docs/phoenix/integrations/langflow/langflow-tracing)

---

## 사전 요구사항

- **표준 Arize 플랫폼**: Arize Space ID와 API Key 필요
- **오픈 소스 Arize Phoenix 플랫폼**: Arize Phoenix API 키 필요

---

## Arize를 Langflow에 연결

### Arize Platform

1. [Arize 대시보드](https://app.arize.com/)에서 **Space ID**와 **API Key**를 복사합니다.

2. Langflow `.env` 파일에 환경 변수를 추가합니다:

```
ARIZE_SPACE_ID=SPACE_ID
ARIZE_API_KEY=API_KEY
```

3. `.env` 파일로 Langflow를 시작합니다:

```bash
uv run langflow run --env-file .env
```

### Arize Phoenix

```
ARIZE_PHOENIX_API_KEY=API_KEY
```

---

## 플로우 실행 및 Arize에서 메트릭 보기

1. Langflow에서 LLM 기반 컴포넌트가 있는 플로우를 실행합니다 (예: **Simple Agent** 템플릿으로 플로우 만들기 → Agent에 OpenAI API 키 추가 → Playground에서 채팅).

2. Arize에서 프로젝트 대시보드를 열고 데이터 처리를 기다립니다 (몇 분 소요).

3. **LLM Tracing** 탭에서 플로우 메트릭을 확인합니다.

각 Langflow 실행은 Arize에서 두 개의 추적을 생성합니다:
- `AgentExecutor` 추적: LangChain의 `AgentExecutor` Arize 추적
- `UUID` 추적: Langflow 컴포넌트 추적

4. **Traces** 탭에서 추적을 확인합니다.
5. **Spans** 탭에서 스팬을 확인합니다. 스팬은 추적 내의 단일 작업입니다.

---

## 참고 항목

- [추적 (Traces)](./traces.md)
- [환경 변수](./environment-variables.md)

---

*원문: https://docs.langflow.org/next/integrations-arize*
