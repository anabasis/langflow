# LangWatch

> 원문: https://docs.langflow.org/next/integrations-langwatch

[LangWatch](https://app.langwatch.ai/)는 모니터링, 관측성, 분석, 평가, 알림 기능을 제공하여 사용자 인사이트를 얻고 LLM 워크플로우를 개선할 수 있게 해주는 올인원 LLMOps 플랫폼입니다.

## LangWatch 관측성 통합하기

기본 Docker 이미지에서는 LangWatch를 사용할 수 없습니다

공식 Langflow Docker 이미지(`langflowai/langflow`, `langflowai/langflow-nightly`)는 Python 3.14에서 실행되는데, `langwatch` 패키지는 아직 Python 3.14를 지원하지 않습니다(요구 사항은 Python `<3.14`). 따라서 `LANGWATCH_API_KEY`가 설정되어 있더라도 **기본 Docker 이미지에서는 LangWatch 트레이싱을 사용할 수 없습니다**. Langflow는 첫 플로우 실행 시 경고를 기록하고 LangWatch 트레이싱 없이 계속 진행합니다.

LangWatch를 사용하려면 PyPI 배포판(`pip install langflow`)이나 Langflow desktop 앱과 같이 Python 3.10~3.13에서 Langflow를 실행하세요. 컨테이너가 필요하다면 Python 3.10~3.13 베이스로 커스텀 이미지를 빌드하세요.

Langflow와 통합하려면 LangWatch API 키를 Langflow 환경 변수로 추가하세요.

1. LangWatch 계정에서 LangWatch API 키를 발급받습니다.

2. Langflow `.env` 파일에 키를 추가합니다.

```shell
LANGWATCH_API_KEY="API_KEY_STRING"
```

    또는 터미널 세션에서 환경 변수를 설정할 수도 있습니다.

```shell
export LANGWATCH_API_KEY="API_KEY_STRING"
```

3. Langflow `.env`를 수정했다면 `.env` 파일로 Langflow를 재시작합니다.

```text
langflow run --env-file .env
```

4. 플로우를 실행합니다.

5. 모니터링 및 관측성을 위해 LangWatch 대시보드를 확인합니다.

![LangWatch dashboard](https://docs.langflow.org/assets/images/langwatch-dashboard-5f33bb25bb4d9022e08a4dab2592ca86.png)

## LangWatch Evaluator 사용하기

플로우에서 **LangWatch Evaluator** 컴포넌트를 사용하면 LangWatch의 평가 엔드포인트로 모델의 성능을 평가할 수 있습니다.
이 컴포넌트는 **LangWatch** [번들](https://docs.langflow.org/components-bundle-components)에서 제공됩니다.
