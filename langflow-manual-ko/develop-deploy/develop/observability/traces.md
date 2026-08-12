# 트레이스

> 원문: https://docs.langflow.org/next/traces

Langflow의 **Traces** 기능은 플로우와 컴포넌트에 대한 상세한 실행 트레이스를 기록하여, 외부 관측성(observability) 서비스에 의존하지 않고도 문제를 디버깅하고, 지연 시간을 측정하고, 토큰 사용량을 추적할 수 있게 해줍니다.

트레이스 데이터는 Langflow 데이터베이스의 `trace` 및 `span` 테이블에 저장됩니다.
트레이스 데이터는 UI의 **Flow Activity** 및 **Trace Details** 페이지에 표시되며, `/monitor/traces` API 엔드포인트를 통해 조회할 수도 있습니다.

트레이스는 기본적으로 활성화되어 있습니다.
Langflow의 트레이싱을 비활성화하고 다른 트레이싱 제공자를 사용하려면 `LANGFLOW_NATIVE_TRACING`을 `false`로 설정하세요.

## 트레이스가 기록하는 내용

트레이서는 다음을 기록합니다.

- **플로우 수준 트레이스**: 총 실행 시간과 상태를 포함한 각 플로우 실행에 대한 트레이스.
- **컴포넌트 스팬**: 입력, 출력, 지연 시간, 오류를 포함한 플로우 내 각 컴포넌트에 대한 스팬.
- **LangChain 스팬**: 체인, 도구, 리트리버, LLM 호출에 대한 더 세부적인 스팬으로, 가능한 경우 모델 이름과 토큰 사용량을 포함합니다.

각 스팬에는 다음이 포함됩니다.

- **이름**과 **유형**(예: chain, LLM, tool, retriever)
- **시작 및 종료 시간**과 **지연 시간(ms)**
- **입력 및 출력**(직렬화됨)
- 스팬이 실패한 경우 **오류 세부 정보**
- 토큰 수, 모델 메타데이터 등 **속성**

## UI에서 트레이스 보기

Langflow UI에서 트레이스를 보려면 다음 절차를 따르세요.

1. [퀵스타트](https://docs.langflow.org/get-started-quickstart)의 Simple Agent 시작 템플릿 같은 플로우를 실행합니다.
2. **Traces**를 클릭합니다.
**Flow Activity** 페이지가 열립니다.
각 플로우 실행은 해당 실행의 모든 스팬을 포함하는 하나의 트레이스로 표시됩니다.
플로우 실행은 세션 ID, 상태, 시간 범위로 추가 정렬할 수 있습니다.
선택적으로 **Download**를 클릭하여 해당 플로우의 트레이스를 JSON 파일로 로컬에 다운로드할 수 있습니다.
3. 플로우 실행을 클릭하면 **Trace Details** 패널이 열립니다.
**Trace Details** 패널은 전체 실행에 대한 플로우 수준 스팬과 각 컴포넌트에 대한 스팬 등, 해당 플로우 실행의 스팬을 표시합니다.
개별 컴포넌트 스팬에는 컴포넌트의 입력과 출력, 타이밍, 토큰 사용량이 포함됩니다.

## API로 트레이스 조회

트레이스를 프로그래밍 방식으로 조회하려면 `/monitor/traces` 엔드포인트를 사용하세요.
Python, TypeScript, curl에 대한 전체 파라미터 세부 정보와 코드 예제는 [Monitor 엔드포인트: 트레이스 조회](https://docs.langflow.org/api-monitor#get-traces)를 참고하세요.

## 참고 자료

- [로그](https://docs.langflow.org/logging)
- [Monitor 엔드포인트](https://docs.langflow.org/api-monitor)
