# Kubernetes에서의 Langflow 아키텍처
> 원문: https://docs.langflow.org/next/deployment-architecture

Langflow 배포에는 크게 두 가지 유형이 있습니다.

- **Langflow IDE(개발)**: Langflow 시각적 편집기(프런트엔드)와 API(백엔드)를 모두 배포합니다. 일반적으로 개발자가 시각적 편집기를 사용하여 플로우를 생성하고 관리한 다음, 이를 패키징하여 프로덕션 런타임 배포를 통해 서비스하기 전 개발 환경에서 사용됩니다.

    Langflow 저장소의 예제 [`docker-compose.yml`](https://github.com/langflow-ai/langflow/blob/main/docker_example/docker-compose.yml) 파일은 Langflow IDE 이미지를 빌드합니다.

    Kubernetes에서의 IDE 배포에 대한 정보는 [Kubernetes에 Langflow 개발 환경 배포하기](https://docs.langflow.org/deployment-kubernetes-dev)를 참조하세요.

- **Langflow 런타임(프로덕션)**: 프로덕션 플로우를 위한 Langflow 런타임을 배포합니다. 이는 Langflow API 서비스에 집중된 헤드리스(백엔드 전용) 서비스입니다. 시각적 편집기 없이 플로우가 프로그래밍 방식으로 실행되는 프로덕션 환경에서 사용됩니다. 서버는 플로우를 엔드포인트로 노출하고, 각 플로우를 서비스하는 데 필요한 프로세스만 실행합니다.

    기본 SQLite 데이터베이스에 비해 확장성과 안정성을 향상시키기 위해, 이러한 배포 유형에는 외부 PostgreSQL 데이터베이스가 강력히 권장됩니다.

    Kubernetes에서의 런타임 배포에 대한 정보는 [Kubernetes에 Langflow 프로덕션 환경 배포하기](https://docs.langflow.org/deployment-kubernetes-prod)를 참조하세요.

  tip
      `LANGFLOW_BACKEND_ONLY` [환경 변수](https://docs.langflow.org/environment-variables)를 사용하여 Langflow를 헤드리스 모드로 시작할 수 있습니다.

또한 [Docker에서 Langflow IDE와 런타임을 배포](https://docs.langflow.org/deployment-docker)할 수도 있습니다.

## Kubernetes에 Langflow를 배포하는 이점[​](#benefits-of-deploying-langflow-on-kubernetes "Direct link to Benefits of deploying Langflow on Kubernetes")

Kubernetes에 배포하면 다음과 같은 이점이 있습니다.

- **확장성**: Kubernetes를 사용하면 워크로드의 요구를 충족하도록 Langflow 서비스를 확장할 수 있습니다.

- **가용성 및 복원력**: Kubernetes는 자동 장애 조치(failover) 및 자가 복구와 같은 내장 복원력 기능을 제공하여 Langflow 서비스가 항상 사용 가능하도록 보장합니다.

- **보안**: Kubernetes는 Langflow 서비스와 그 데이터를 보호하기 위해 역할 기반 접근 제어 및 네트워크 격리와 같은 보안 기능을 제공합니다.

- **이식성**: Kubernetes는 이식 가능한 플랫폼이므로, 온프레미스든 클라우드든 어떤 Kubernetes 클러스터에도 Langflow 서비스를 배포할 수 있습니다.

    Langflow는 AWS EKS, Google GKE, Azure AKS와 같은 클라우드 플랫폼에 배포할 수 있습니다. 자세한 내용은 [Langflow Helm charts 저장소](https://github.com/langflow-ai/langflow-helm-charts)를 참조하세요.

## Langflow 배포[​](#langflow-deployment "Direct link to Langflow deployment")

일반적인 Langflow 배포에는 다음이 포함됩니다.

- **Langflow 서비스**: Langflow API와, IDE 배포의 경우, 시각적 편집기.
- **Kubernetes 클러스터**: Kubernetes 클러스터는 Langflow와 그 지원 서비스를 배포하고 관리하기 위한 플랫폼을 제공합니다.
- **영구 스토리지**: 영구 스토리지는 모델 및 학습 데이터와 같은 Langflow 서비스의 데이터를 저장하는 데 사용됩니다.
- **인그레스 컨트롤러**: 인그레스 컨트롤러는 Langflow 서비스로의 트래픽에 대한 단일 진입점을 제공합니다.
- **로드 밸런서**: 여러 Langflow 복제본에 걸쳐 트래픽을 분산합니다.
- **벡터 데이터베이스**: RAG에 Langflow를 사용하는 경우, Astra Serverless의 벡터 데이터베이스와 통합할 수 있습니다.

![Kubernetes에서의 Langflow 참조 아키텍처](https://docs.langflow.org/assets/images/langflow-reference-architecture-49ff76b7f84ce43f5626edd5cb3fa7fa.png)

## 환경 격리[​](#environment-isolation "Direct link to Environment isolation")

Langflow의 개발 환경과 프로덕션 환경을 분리하여 배포하고 실행하는 것이 권장됩니다.

- 개발자가 새로운 플로우를 프로토타이핑하고 테스트하는 개발 환경에는 IDE를 배포합니다.
- 플로우를 독립 실행형 서비스로 서비스하는 프로덕션 환경에는 런타임을 배포합니다.

![Langflow 환경](https://docs.langflow.org/assets/images/langflow-env-f22dcd672ba806af9fec3968171a4700.png)

이러한 분리는 보안을 강화하고, 체계적인 소프트웨어 개발 파이프라인을 지원하며, 인프라 리소스 할당을 최적화하도록 설계되었습니다.

- **격리**: 개발 환경과 프로덕션 환경을 분리함으로써 애플리케이션 라이프사이클의 여러 단계를 더 잘 격리할 수 있습니다. 이러한 격리는 개발 관련 문제가 프로덕션 환경에 영향을 미칠 위험을 최소화합니다.
- **접근 제어**: 각 환경에 서로 다른 보안 정책과 접근 제어를 적용할 수 있습니다. 개발자는 테스트와 디버깅을 위해 IDE에서 더 넓은 접근 권한이 필요할 수 있는 반면, 런타임 환경은 더 엄격한 보안 조치로 잠글 수 있습니다.
- **공격 표면 축소**: 런타임 환경은 필수 구성 요소만 포함하도록 구성되어 공격 표면과 잠재적 취약점을 줄입니다.
- **최적화된 리소스 사용 및 비용 효율성**: 두 환경을 분리함으로써 리소스를 더 효과적으로 할당할 수 있습니다. 각 플로우를 독립적으로 배포할 수 있어 세밀한 리소스 제어가 가능합니다.
- **확장성**: 런타임 환경은 개발 환경에 영향을 주지 않고 애플리케이션 부하와 성능 요구 사항에 따라 독립적으로 확장할 수 있습니다.

## 다음 단계[​](#next-steps "Direct link to Next steps")

- [Kubernetes에서 Langflow를 위한 모범 사례](https://docs.langflow.org/deployment-prod-best-practices)
- [Kubernetes에 Langflow 개발 환경 배포하기](https://docs.langflow.org/deployment-kubernetes-dev)
- [Kubernetes에 Langflow 프로덕션 환경 배포하기](https://docs.langflow.org/deployment-kubernetes-prod)
