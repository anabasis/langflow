# Kubernetes에서의 Langflow 아키텍처

Langflow 배포에는 두 가지 광범위한 유형이 있습니다:

- **Langflow IDE (개발)**: Langflow 비주얼 에디터(프론트엔드)와 API(백엔드)를 모두 배포합니다. 일반적으로 개발자가 비주얼 에디터를 사용하여 플로우를 만들고 관리하는 개발 환경에 사용됩니다.

- **Langflow 런타임 (프로덕션)**: 프로덕션 플로우를 위한 Langflow 런타임을 배포합니다. 비주얼 에디터 없이 Langflow API 제공에 중점을 둔 헤드리스(백엔드 전용) 서비스입니다.

> **팁**: `LANGFLOW_BACKEND_ONLY` 환경 변수로 헤드리스 모드에서 Langflow를 시작할 수 있습니다.

---

## Kubernetes에 Langflow를 배포하는 이점

- **확장성**: Kubernetes를 통해 워크로드 요구에 맞게 Langflow 서비스를 확장할 수 있습니다.
- **가용성 및 복원력**: 자동 장애 조치 및 자가 복구와 같은 내장 복원력 기능을 제공합니다.
- **보안**: 역할 기반 액세스 제어 및 네트워크 격리와 같은 보안 기능을 제공합니다.
- **이식성**: AWS EKS, Google GKE, Azure AKS 등 모든 Kubernetes 클러스터에 배포할 수 있습니다.

---

## Langflow 배포 구성 요소

일반적인 Langflow 배포에는 다음이 포함됩니다:

- **Langflow 서비스**: Langflow API 및 IDE 배포의 경우 비주얼 에디터
- **Kubernetes 클러스터**: Langflow 및 지원 서비스를 배포하고 관리하는 플랫폼
- **영구 저장소**: 플로우 데이터 저장에 사용
- **인그레스 컨트롤러**: Langflow 서비스로의 트래픽 단일 진입점 제공
- **로드 밸런서**: 여러 Langflow 복제본에 트래픽 분산
- **벡터 데이터베이스**: RAG를 사용하는 경우 통합 가능

---

## 환경 격리

개발과 프로덕션 환경을 분리하여 실행하는 것을 권장합니다:

- **개발 환경**: IDE 배포 — 개발자가 새 플로우를 프로토타입하고 테스트합니다.
- **프로덕션 환경**: 런타임 배포 — 플로우를 독립 서비스로 제공합니다.

이 분리는 보안 강화, 체계적인 소프트웨어 개발 파이프라인 지원, 인프라 리소스 할당 최적화를 위해 설계되었습니다.

---

## 다음 단계

- [Kubernetes의 Langflow 모범 사례](https://docs.langflow.org/deployment-prod-best-practices)
- [개발 환경용 Kubernetes 배포](https://docs.langflow.org/deployment-kubernetes-dev)
- [프로덕션 환경용 Kubernetes 배포](https://docs.langflow.org/deployment-kubernetes-prod)
- [Langflow Helm Charts 저장소](https://github.com/langflow-ai/langflow-helm-charts)

---

*원문: https://docs.langflow.org/next/deployment-architecture*
