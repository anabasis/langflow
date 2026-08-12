# Openlayer

> 원문: https://docs.langflow.org/next/integrations-openlayer

[Openlayer](https://www.openlayer.com/)는 LLM 애플리케이션을 위한 테스트 및 평가 플랫폼입니다. 포괄적인 관측성, 테스트, 모니터링 기능을 제공하여 고품질 AI 시스템을 자신 있게 배포할 수 있도록 돕습니다.

Langflow가 플로우 실행에 대한 트레이싱 데이터를 수집하여 분석, 모니터링, 평가를 위해 자동으로 Openlayer로 전송하도록 구성할 수 있습니다.

## 사전 준비 사항

- [Openlayer 계정](https://www.openlayer.com/)
- 트레이싱하려는 [플로우](https://docs.langflow.org/concepts-flows)가 있는 [실행 중인 Langflow 서버](https://docs.langflow.org/get-started-installation)
- Openlayer inference pipeline

팁

Openlayer 통합을 테스트할 플로우가 필요하다면 [Langflow 퀵스타트](https://docs.langflow.org/get-started-quickstart)를 참고하세요.

## Openlayer 자격 증명을 환경 변수로 설정하기

1. Openlayer 계정에서 [Openlayer API 키](https://app.openlayer.com/settings/api-keys)를 발급받습니다.

2. Openlayer에서 inference pipeline을 생성하고 pipeline ID를 복사합니다.

3. Langflow를 실행하는 것과 동일한 환경에서 Openlayer 자격 증명을 환경 변수로 설정합니다.

    아래 예제에서 `YOUR_API_KEY`와 `YOUR_PIPELINE_ID`를 실제 Openlayer 자격 증명으로 교체하세요.

  - Linux 또는 macOS
  - Windows

      다음 명령은 Linux 또는 macOS 터미널 세션에서 환경 변수를 설정합니다.

```bash
export OPENLAYER_API_KEY="YOUR_API_KEY"
export OPENLAYER_INFERENCE_PIPELINE_ID="YOUR_PIPELINE_ID"
```

## Langflow 시작 및 Openlayer에서 트레이스 보기

1. Openlayer 환경 변수를 설정한 것과 동일한 환경에서 Langflow를 시작합니다.

```bash
uv run langflow run
```

2. Langflow에서 플로우를 실행합니다.

    Langflow는 다음을 포함해 플로우 실행에 대한 트레이싱 데이터를 자동으로 수집하여 Openlayer로 전송합니다.

  - 컴포넌트 입력 및 출력
  - 실행 타이밍 및 지연 시간
  - LLM 호출 및 중첩된 작업
  - 사용자 및 세션 컨텍스트

3. [Openlayer 대시보드](https://app.openlayer.com/)에서 수집된 데이터를 확인합니다.

    각 플로우 실행은 모든 컴포넌트와 그 하위 작업을 계층적으로 보여주는 트레이스로 표시됩니다.

## 고급 구성

### 플로우별 파이프라인

플로우별 환경 변수를 사용하여 서로 다른 플로우에 다른 Openlayer inference pipeline을 구성할 수 있습니다.

```bash
export OPENLAYER_PIPELINE_MY_FLOW_NAME="pipeline-id-1"
export OPENLAYER_PIPELINE_ANOTHER_FLOW="pipeline-id-2"
```

플로우 이름은 대문자로 변환되며 영숫자가 아닌 문자는 밑줄로 대체됩니다. 예를 들어 "My Flow-Name"은 `OPENLAYER_PIPELINE_MY_FLOW_NAME`이 됩니다.

### JSON 매핑

또는 JSON 매핑을 사용하여 여러 플로우를 한 번에 구성할 수 있습니다.

- Linux 또는 macOS
- Windows

```bash
export OPENLAYER_LANGFLOW_MAPPING='{"Flow Name 1":"pipeline-id-1","Flow Name 2":"pipeline-id-2"}'
```

### 구성 우선순위

Openlayer 구성은 다음 순서(가장 높은 우선순위부터)로 해석됩니다.

1. 플로우별 환경 변수: `OPENLAYER_PIPELINE_<FLOW_NAME>`
2. JSON 매핑: `OPENLAYER_LANGFLOW_MAPPING`
3. 기본 환경 변수: `OPENLAYER_INFERENCE_PIPELINE_ID`

이를 통해 모든 플로우에 대한 기본 파이프라인을 설정하고 필요에 따라 특정 플로우에 대해 이를 재정의할 수 있습니다.

## Openlayer 트레이싱 비활성화

Openlayer 통합을 비활성화하려면 `OPENLAYER_API_KEY` 환경 변수를 제거한 다음 Langflow를 재시작하세요.

## 기능

Openlayer 통합은 자동으로 다음을 캡처합니다.

- **컴포넌트 계층 구조**: 부모-자식 관계를 포함한 모든 플로우 컴포넌트
- **LangChain 콜백**: 중첩된 LLM 호출과 도구 실행이 부모 컴포넌트 내에 표시됩니다
- **타이밍 지표**: 각 컴포넌트의 시작 시간, 종료 시간, 지연 시간
- **입력 및 출력**: 자동 타입 변환이 적용된 컴포넌트 입력 및 출력
- **사용자 컨텍스트**: 더 나은 분석을 위한 사용자 ID 및 세션 ID 전달
- **오류 추적**: 컴포넌트 메타데이터에 캡처된 오류 및 로그

## 참고 자료

- [Openlayer 문서](https://docs.openlayer.com/)
- [Openlayer GitHub 저장소](https://github.com/openlayer-ai/openlayer-python)
