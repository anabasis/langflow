# 텔레메트리

Langflow는 기능 사용량 및 성능에 관한 통계를 수집하기 위해 익명 텔레메트리를 사용합니다. Langflow 팀은 이 데이터를 사용하여 인기 기능과 개선이 필요한 영역을 파악합니다.

---

## 개인 정보 보호

Langflow 텔레메트리는 개인 정보나 민감한 데이터를 수집하지 않습니다. 모든 텔레메트리 데이터는 익명화되어 Langflow 개선에만 사용됩니다.

---

## 텔레메트리 비활성화

텔레메트리를 비활성화하려면 Langflow를 시작하기 전에 [환경 변수](./environment-variables.md)에서 `DO_NOT_TRACK=True`를 설정합니다.

---

## Langflow가 수집하는 데이터

### 실행 (Run)

플로우가 실행될 때마다 전송되는 이벤트:
- **IsWebhook**: 웹훅으로 트리거되었는지 여부
- **Seconds**: 작업 소요 시간(초)
- **Success**: 작업 성공 여부
- **ErrorMessage**: 실패 시 오류 메시지

### 종료 (Shutdown)

- **TimeRunning**: 종료 전 총 실행 시간

### 버전 (Version)

텔레메트리 서비스 시작 시 한 번 전송:
- **Version**: 사용 중인 Langflow 버전
- **Platform**: 호스트 머신의 운영 체제
- **Python**: 사용 중인 Python 버전
- **Arch**: 시스템 아키텍처 (x86, ARM 등)
- **AutoLogin**: 자동 로그인 기능 활성화 여부
- **CacheType**: 사용 중인 캐싱 메커니즘 유형
- **BackendOnly**: 백엔드 전용 모드로 실행 중인지 여부
- **Desktop**: Langflow Desktop으로 실행 중인지 여부

### 플레이그라운드 (Playground)

- **Seconds**: 플레이그라운드 실행 소요 시간(초)
- **ComponentCount**: 플레이그라운드에서 사용된 컴포넌트 수
- **Success**: 플레이그라운드 작업 성공 여부

### 컴포넌트 (Component)

각 컴포넌트 실행 시 전송:
- **Name**: 컴포넌트 이름
- **Seconds**: 컴포넌트 실행 소요 시간
- **Success**: 컴포넌트 작동 성공 여부
- **ErrorMessage**: 오류 발생 시 세부 정보

### 예외 (Exception)

처리되지 않은 예외 발생 시:
- **Type**: 예외 클래스 이름 (예: `ValueError`)
- **Message**: 발생한 예외 메시지
- **Context**: 예외가 발생한 위치에 대한 추가 컨텍스트 정보
- **StackTraceHash**: 스택 추적의 해시 (유사한 예외 그룹화용)

---

## 참고 항목

- [환경 변수](./environment-variables.md)

---

*원문: https://docs.langflow.org/next/contributing-telemetry*
