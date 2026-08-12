# 텔레메트리

> 원문: https://docs.langflow.org/next/contributing-telemetry

Langflow는 기능 사용량과 성능에 대한 통계를 수집하기 위해 익명 텔레메트리를 사용합니다.
Langflow 팀은 이 데이터를 활용해 인기 있는 기능과 실제 사용 패턴에 기반해 개선이 필요한 영역을 파악합니다.
이는 가장 영향력 있는 변경 사항과 인기 있는 기능에 개발 노력을 우선적으로 투입하는 데 도움이 됩니다.

## 개인정보 보호

Langflow 팀은 사용자의 프라이버시를 존중하며, 데이터를 보호하는 데 최선을 다하고 있습니다.

Langflow 텔레메트리는 개인 정보나 민감한 데이터를 수집하지 않습니다.
모든 텔레메트리 데이터는 익명화되며 오직 Langflow 개선을 위해서만 사용됩니다.

## 텔레메트리 옵트아웃

텔레메트리를 옵트아웃하려면 Langflow를 시작하기 전에 [Langflow 환경 변수](https://docs.langflow.org/environment-variables)에서 `DO_NOT_TRACK=True`를 설정하세요. 이렇게 하면 텔레메트리 데이터 수집이 비활성화됩니다.

## Langflow가 수집하는 데이터

Langflow 텔레메트리는 플로우 실행, 환경, 컴포넌트 사용에 대한 데이터를 수집합니다.

### Run

이 텔레메트리 이벤트는 플로우가 실행될 때마다 전송됩니다.

- **IsWebhook**: 웹훅으로 작업이 트리거되었는지 여부를 나타냅니다.
- **Seconds**: 작업이 지속된 시간(초)으로, 성능에 대한 통찰을 제공합니다.
- **Success**: 작업 성공 여부를 나타내는 불리언 값으로, 잠재적인 오류나 문제를 식별하는 데 도움이 됩니다.
- **ErrorMessage**: 작업이 실패한 경우 오류 메시지 세부 정보를 제공하여 문제 해결과 개선에 도움을 줍니다.

### Shutdown

이 텔레메트리 이벤트는 애플리케이션 생명주기와 런타임 지속 시간에 대한 정보를 캡처합니다.

- **TimeRunning**: 종료 전까지의 총 실행 시간으로, 애플리케이션 생명주기를 이해하고 가동 시간을 최적화하는 데 유용합니다.

### Version

이 텔레메트리 이벤트는 텔레메트리 서비스가 시작될 때 한 번 전송됩니다.

- **Version**: 사용 중인 Langflow의 특정 버전으로, 기능 채택과 호환성을 추적하는 데 도움이 됩니다.
- **Platform**: 호스트 머신의 운영체제로, 개발과 테스트 노력에서 가장 인기 있는 플랫폼을 파악하는 데 도움이 됩니다.
- **Python**: 사용 중인 Python 버전으로, 다양한 Python 버전에 대한 호환성과 지원을 유지하는 데 도움이 됩니다.
- **Arch**: x86, ARM 등 시스템의 아키텍처로, Langflow 코드베이스에서 하드웨어 최적화와 테스트의 우선순위를 정하는 데 도움이 됩니다.
- **AutoLogin**: 자동 로그인 기능의 활성화 여부를 나타내며, 사용자 설정 선호도를 반영합니다.
- **CacheType**: 사용 중인 캐싱 메커니즘 유형으로, 성능과 효율성에 영향을 미칩니다.
- **BackendOnly**: Langflow가 백엔드 전용 모드로 실행 중인지 나타내는 불리언으로, 배포 구성을 이해하는 데 유용합니다.
- **Desktop**: Langflow가 데스크톱 모드(Langflow Desktop)로 실행 중인지 나타내며, 배포 유형별 사용 패턴을 이해하는 데 도움이 됩니다.

### Email

이 텔레메트리 이벤트는 Langflow Desktop에 등록된 이메일 주소를 추적하기 위해 전송됩니다. 이 이벤트는 두 가지 경우에 트리거됩니다.

- POST `/api/v2/registration/` 엔드포인트를 통해 새 이메일 주소가 등록될 때마다.

- 이메일 주소가 등록된 *이후*에 Langflow Desktop을 시작할 때마다.

    Langflow Desktop을 처음 시작하고 이메일 주소를 등록하면, 해당 이벤트는 POST `/api/v2/registration/` 엔드포인트 호출에 의해 보고됩니다.

이 텔레메트리 이벤트에는 다음 정보가 포함됩니다.

- **Email**: 등록된 이메일 주소로, 사용자 등록을 추적하고 Langflow Desktop 사용자 기반을 이해하는 데 도움이 됩니다.
- **ClientType**: "desktop" 또는 "oss"일 수 있는 클라이언트 유형을 나타냅니다.

Langflow Desktop에서 `DO_NOT_TRACK` 환경 변수로 텔레메트리를 비활성화하더라도 이메일 주소 입력은 계속 요청되지만, 해당 이메일 주소는 로컬 Langflow 데이터베이스에만 저장됩니다.

### Playground

이 텔레메트리 이벤트는 **Playground** 환경의 성능과 사용 패턴을 모니터링합니다.

- **Seconds**: **Playground** 실행 시간(초)으로, 테스트나 실험 단계에서의 성능에 대한 통찰을 제공합니다.
- **ComponentCount**: **Playground**에서 사용된 컴포넌트 수로, 복잡도와 사용 패턴을 이해하는 데 도움이 됩니다.
- **Success**: **Playground** 작업의 성공 상태로, 실험적 기능의 안정성을 파악하는 데 도움이 됩니다.

### Component

이 텔레메트리 이벤트는 각 컴포넌트 실행마다 전송됩니다.

- **Name**: 컴포넌트를 식별하여, 어떤 컴포넌트가 가장 많이 사용되거나 문제가 발생하기 쉬운지에 대한 데이터를 제공합니다.
- **Seconds**: 컴포넌트 실행에 걸린 시간으로, 성능 지표를 제공합니다.
- **Success**: 컴포넌트가 성공적으로 동작했는지 여부로, 품질 관리에 도움이 됩니다.
- **ErrorMessage**: 발생한 오류에 대한 세부 정보로, 디버깅과 개선에 매우 중요합니다.

### Exception

이 텔레메트리 이벤트는 Langflow의 생명주기 또는 전역 예외 핸들러가 처리되지 않은 예외를 포착했을 때 전송됩니다.

- **Type**: `ValueError`와 같은 예외 클래스 이름입니다.
- **Message**: 발생한 예외 메시지입니다.
- **Context**: 경로, 컴포넌트, 작업 세부 정보 등 예외가 발생한 위치와 관련된 추가 컨텍스트 정보(있는 경우).
- **StackTraceHash**: 유사한 예외를 그룹화하여 분석을 쉽게 하기 위한 스택 트레이스의 해시입니다.

### Deployment provider

이 텔레메트리 이벤트는 생성, 삭제, 업데이트 등 배포 제공자 계정에 대한 다양한 생명주기 작업 시 전송됩니다.

- **DeploymentAction**: `provider.create`, `provider.delete` 등 수행된 특정 작업입니다.
- **DeploymentProvider**: `watsonx-orchestrate` 등 사용된 배포 제공자입니다.
- **DeploymentSeconds**: 작업 소요 시간(초)으로, 성능에 대한 통찰을 제공합니다.
- **DeploymentSuccess**: 작업 성공 여부를 나타내는 불리언 값입니다.
- **DeploymentErrorMessage**: 작업이 실패한 경우 오류 메시지 세부 정보입니다.
- **WxoTenantId**: `watsonx-orchestrate` 배포에만 채워지는 테넌트 고유 식별자로, 개인 정보를 수집하지 않고 다중 테넌트 사용 패턴을 이해하는 데 사용됩니다.

### Deployment

이 텔레메트리 이벤트는 생성, 삭제, 업데이트 등 배포 리소스에 대한 다양한 생명주기 작업 시 전송됩니다.

- **DeploymentAction**: `deployment.create` 등 수행된 특정 작업입니다.
- **DeploymentProvider**: `watsonx-orchestrate` 등 사용된 배포 제공자입니다.
- **DeploymentSeconds**: 작업 소요 시간(초)으로, 성능에 대한 통찰을 제공합니다.
- **DeploymentSuccess**: 작업 성공 여부를 나타내는 불리언 값입니다.
- **DeploymentErrorMessage**: 작업이 실패한 경우 오류 메시지 세부 정보입니다.
- **WxoTenantId**: `watsonx-orchestrate` 배포에만 채워지는 테넌트 고유 식별자로, 개인 정보를 수집하지 않고 다중 테넌트 사용 패턴을 이해하는 데 사용됩니다.
