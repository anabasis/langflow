# Arize

> 원문: https://docs.langflow.org/next/integrations-arize

Arize는 LLM 애플리케이션을 모니터링하고 최적화하기 위해 [OpenTelemetry](https://opentelemetry.io/)와 [OpenInference](https://docs.arize.com/phoenix/reference/open-inference)를 기반으로 구축된 도구입니다.

Arize 트레이싱을 활성화하려면 Langflow 배포 환경에 필요한 Arize 환경 변수를 설정하세요.
Arize는 자동으로 LLM 애플리케이션에서 텔레메트리 데이터를 모니터링하고 수집하기 시작합니다.

팁

Langflow와 Arize 통합에 대한 안내는 Arize 문서에서도 확인할 수 있습니다.

- [Arize Platform으로 Langflow 트레이싱하기](https://arize.com/docs/ax/integrations/frameworks-and-platforms/langflow/langflow-tracing)
- [Arize Phoenix로 Langflow 트레이싱하기](https://arize.com/docs/phoenix/integrations/langflow/langflow-tracing)

## 사전 준비 사항

- [표준 Arize platform](https://docs.arize.com/arize)을 사용하는 경우 **Arize Space ID**와 **Arize API Key**가 필요합니다.
- 오픈소스인 [Arize Phoenix platform](https://docs.arize.com/phoenix)을 사용하는 경우 **Arize Phoenix API key**가 필요합니다.

## Langflow에 Arize 연결하기

- Arize Platform
- Arize Phoenix

1. [Arize 대시보드](https://app.arize.com/)에서 **Space ID**와 [**API Key(Ingestion Service Account Key)**](https://arize.com/docs/ax/security-and-settings/api-keys)를 복사합니다.

2. Langflow 애플리케이션의 루트에서 기존 Langflow `.env` 파일을 편집하거나 새로 만듭니다.

3. `ARIZE_SPACE_ID`와 `ARIZE_API_KEY` 환경 변수를 추가합니다.

```text
ARIZE_SPACE_ID=SPACE_ID
ARIZE_API_KEY=API_KEY
```

    `SPACE_ID`와 `API_KEY`를 Arize 플랫폼에서 복사한 값으로 교체하세요.

    표준 Arize platform을 사용하는 경우 Arize 프로젝트 이름을 별도로 지정할 필요는 없습니다.

4. `.env` 파일로 Langflow 애플리케이션을 시작합니다.

```text
uv run langflow run --env-file .env
```

`API_KEY`를 Arize Phoenix 플랫폼에서 복사한 Arize Phoenix API key로 교체하세요.

- `.env` 파일로 Langflow 애플리케이션을 시작합니다.

```text
uv run langflow run --env-file .env
```

## 플로우 실행 및 Arize에서 지표 보기

1. Langflow에서 **Agent** 컴포넌트나 다른 언어 모델 컴포넌트처럼 LLM 기반 컴포넌트가 포함된 플로우를 실행합니다.
Arize가 트레이스를 수집할 수 있도록 플로우와 채팅하거나 LLM을 트리거해야 합니다.

    예를 들어 **Simple Agent** 템플릿으로 플로우를 만들고, **Agent** 컴포넌트에 OpenAI API 키를 추가한 다음, **Playground**를 클릭해 플로우와 채팅하며 트래픽을 생성할 수 있습니다.

2. Arize에서 프로젝트 대시보드를 열고 Arize가 데이터를 처리할 때까지 기다립니다.
몇 분 정도 걸릴 수 있습니다.

3. 플로우에 대한 지표를 보려면 **LLM Tracing** 탭으로 이동합니다.

    각 Langflow 실행은 Arize에서 두 개의 트레이스를 생성합니다.

  - `AgentExecutor` 트레이스는 LangChain의 `AgentExecutor`에 대한 Arize 트레이스입니다.
  - `UUID` 트레이스는 Langflow 컴포넌트에 대한 트레이스입니다.

4. 트레이스를 보려면 **Traces** 탭으로 이동합니다.

    *트레이스*는 여러 *스팬*으로 이루어진 요청의 전체 여정입니다.

5. 스팬을 보려면 **Spans** 탭으로 이동합니다.

    *스팬*은 트레이스 내의 단일 작업입니다.
예를 들어 OpenAI에 대한 단일 API 호출이나 커스텀 도구에 대한 단일 함수 호출이 하나의 *스팬*이 될 수 있습니다.

    Arize의 트레이싱 지표에 대한 자세한 내용은 [Arize LLM 트레이싱 문서](https://docs.arize.com/arize/llm-tracing/tracing)를 참고하세요.

6. 스팬을 [데이터셋](https://docs.arize.com/arize/llm-datasets-and-experiments/datasets-and-experiments)에 추가하려면 **Add to Dataset**을 클릭합니다.

    **LLM Tracing** 탭의 모든 지표를 데이터셋에 추가할 수 있습니다.

7. 데이터셋을 보려면 **Datasets** 탭을 클릭한 다음 원하는 데이터셋을 선택합니다.
