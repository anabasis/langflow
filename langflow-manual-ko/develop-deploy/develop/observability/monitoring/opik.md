# Opik

> 원문: https://docs.langflow.org/next/integrations-opik

[Opik](https://www.comet.com/site/products/opik/)은 대형 언어 모델(LLM) 애플리케이션을 평가, 테스트, 모니터링하기 위해 설계된 오픈소스 플랫폼입니다. Comet이 개발했으며, LLM 기반 애플리케이션에 대한 더 직관적인 협업, 테스트, 모니터링을 지원하는 것을 목표로 합니다.

Langflow가 플로우 실행에 대한 [트레이싱](https://www.comet.com/docs/opik/tracing/log_traces) 데이터를 수집하여 자동으로 Opik으로 전송하도록 구성할 수 있습니다.

## 사전 준비 사항

- [Open-Source Opik 서버 또는 Opik Cloud 계정](https://www.comet.com/docs/opik/faq#what-is-the-difference-between-opik-cloud-and-the-open-source-opik-platform-)
- 트레이싱하려는 [플로우](https://docs.langflow.org/concepts-flows)가 있는 [실행 중인 Langflow 서버](https://docs.langflow.org/get-started-installation)

팁

Opik 통합을 테스트할 플로우가 필요하다면 [Langflow 퀵스타트](https://docs.langflow.org/get-started-quickstart)를 참고하세요.

## Langflow에 Opik 통합하기

1. Opik Cloud를 사용하는 경우 [Opik API 키](https://www.comet.com/docs/opik/faq#where-can-i-find-my-opik-api-key-)를 발급받습니다.

    Open-Source Opik 서버에서는 API 키가 필요하지 않습니다.

2. Langflow를 실행하는 것과 동일한 환경에서 `opik configure` CLI를 호출하여 Opik 구성을 저장합니다.

```bash
opik configure
```

    자체 호스팅 Opik의 경우 다음 Opik CLI 명령을 사용할 수도 있습니다.

```bash
opik configure --use_local
```

    자세한 내용은 [Opik SDK 구성 문서](https://www.comet.com/docs/opik/tracing/sdk_configuration)를 참고하세요.

3. 환경 변수를 설정한 것과 동일한 터미널 또는 환경에서 Langflow를 시작합니다.

```bash
uv run langflow run
```

4. Langflow에서 플로우를 실행하여 Opik이 트레이싱할 활동을 생성합니다.

5. Opik 프로젝트 대시보드로 이동하여 수집된 트레이싱 데이터를 확인합니다.

## Opik 통합 비활성화

Opik 통합을 비활성화하려면 `opik configure`로 설정한 환경 변수를 제거한 다음 Langflow를 재시작하세요.
