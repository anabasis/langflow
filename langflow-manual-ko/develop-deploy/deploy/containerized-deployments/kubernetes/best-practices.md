# Kubernetes에서의 Langflow 모범 사례
> 원문: https://docs.langflow.org/next/deployment-prod-best-practices

이 가이드는 Kubernetes의 프로덕션 환경에서 Langflow를 배포하기 위한 모범 사례를 제공합니다.

## 리소스와 스케일링[​](#resources-and-scaling "Direct link to Resources and scaling")

Langflow의 최소 리소스 요구 사항은 배포 유형에 따라 다릅니다.

- **IDE(개발)**: Langflow 시각적 편집기(프런트엔드)와 API(백엔드)를 모두 배포합니다. 일반적으로 개발자가 시각적 편집기를 사용하여 플로우를 생성하고 관리한 다음, 이를 패키징하여 프로덕션 런타임 배포를 통해 서비스하기 전 개발 환경에서 사용됩니다.

    프런트엔드 서비스는 인스턴스당 최소 512Mi RAM, 0.3 CPU, 1개의 복제본이 필요합니다.

    백엔드 서비스는 인스턴스당 최소 1Gi RAM, 0.5 CPU, 1개의 복제본이 필요합니다.

- **런타임(프로덕션)**: 프로덕션 플로우를 위한 Langflow 런타임을 배포합니다. 이는 Langflow API 서비스에 집중된 헤드리스(백엔드 전용) 서비스입니다. 시각적 편집기 없이 플로우가 프로그래밍 방식으로 실행되는 프로덕션 환경에서 사용됩니다.

    최소 요구 사항은 인스턴스당 2Gi RAM, 1000m(1 CPU), 3개의 복제본입니다.

Langflow 배포 유형에 대한 자세한 내용은 [Kubernetes에서의 Langflow 아키텍처](https://docs.langflow.org/deployment-architecture)를 참조하세요.

### 추정, 테스트, 조정[​](#estimate-test-and-adjust "Direct link to Estimate, test, and adjust")

최소 권장 리소스와 복제본으로 시작한 다음, 배포의 요구 사항과 성능 테스트 결과에 따라 모니터링하고 필요에 맞게 확장하세요.
리소스 추정과 성능 테스트에서 다음 요소들을 고려하세요.

- 플로우의 복잡성.

- 동시 사용자 및 요청의 양.

    IDE(개발) 배포의 경우, 프런트엔드 활동도 백엔드 서비스에 핑(ping)을 보내므로 일반적으로 프런트엔드와 백엔드를 함께 확장해야 한다는 점을 고려하세요.

- 요청 페이로드의 내용과 크기, 특히 프로덕션 배포에서의 파일 업로드.

- 캐시, 파일 관리, Langflow 데이터베이스를 위한 스토리지 요구 사항.

    프로덕션 배포에는 [외부 PostgreSQL 데이터베이스](#use-an-external-postgresql-database)가 권장됩니다.

- 멀티 코어 CPU와 같이 더 많은 리소스가 필요할 수 있는 인프라 옵션.

### 외부 PostgreSQL 데이터베이스 사용[​](#use-an-external-postgresql-database "Direct link to Use an external PostgreSQL database")

기본 SQLite 데이터베이스에 비해 확장성과 안정성을 향상시키기 위해, 프로덕션 배포에는 외부 PostgreSQL 데이터베이스가 권장됩니다.

리소스 할당과 복제 전략은 PostgreSQL 서비스와 스토리지를 지원할 수 있어야 합니다.
예를 들어 런타임(프로덕션) 배포의 경우, 고가용성을 위해 4Gi RAM, 2 CPU, 여러 복제본을 할당할 수 있습니다.
리소스 요구 사항과 사용량 지표에 따라 `work_mem`, `shared_buffers`와 같은 PostgreSQL 파라미터를 필요에 맞게 조정하세요.

권장 구성은 다음과 같습니다.

- 컨테이너 종료 시 데이터 손실을 방지하기 위한 영구 스토리지
- 자동 장애 조치, 확장, 로드 밸런싱을 위한 고가용성(HA) 또는 액티브-액티브 구성
- 다중 인스턴스 배포를 위한 공유 데이터베이스
- `/opt/langflow/data/`와 같이 디스크에 저장된 대용량 파일에 다중 인스턴스 배포가 접근할 수 있도록 하는 NFS나 클라우드 스토리지 같은 공유 스토리지

자세한 내용은 [외부 PostgreSQL 데이터베이스 구성](https://docs.langflow.org/configuration-custom-database)과 [엔터프라이즈 DBA를 위한 Langflow 데이터베이스 가이드](https://docs.langflow.org/enterprise-database-guide)를 참조하세요.

### 동적 스케일링을 위한 HPA 사용[​](#use-hpa-for-dynamic-scaling "Direct link to Use HPA for dynamic scaling")

런타임(프로덕션) 배포에는 로드 밸런싱과 동적 스케일링이 권장됩니다.

예를 들어, CPU 또는 메모리 사용량에 따라 동적으로 확장하기 위해 Kubernetes의 Horizontal Pod Autoscaler(HPA) 사용을 고려하세요.
다음 예제는 CPU 기반 스케일링을 사용한 Langflow HPA 구성을 보여줍니다.

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: langflow-runtime-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: langflow-runtime
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 80
```

## 장애 지점[​](#failure-points "Direct link to Failure points")

프로덕션 환경에서 Langflow의 안정성은 데이터베이스, 파일 시스템, 인스턴스 가용성을 중심으로 한 주요 장애 지점을 완화하는 데 달려 있습니다.

- **데이터베이스 장애**: [엔터프라이즈 DBA를 위한 Langflow 데이터베이스 가이드](https://docs.langflow.org/enterprise-database-guide)를 참조하세요.
- **파일 시스템 장애**: `/app/data/.cache`와 같은 파일 캐싱에서의 동시성 문제는 다중 인스턴스 설정에서 IO 오류를 일으킬 수 있습니다.
이를 방지하려면 공유되는 POSIX 호환 파일 시스템이나 클라우드 스토리지를 사용하세요.
컨테이너 종료 시 데이터 손실을 초래하는 램디스크(ramdisk) 솔루션 대신 영구 볼륨을 사용하세요.
- **인스턴스 장애**: 단일 인스턴스 장애 시 서비스 중단을 피하기 위해 여러 복제본을 배포하세요. 실패한 파드를 감지하고 교체하기 위해 헬스 체크를 사용하세요.
- **네트워크 및 의존성 장애**: 플로우에서 사용되는 외부 API나 서비스가 실패하여 플로우 오류를 일으킬 수 있습니다. 플로우나 애플리케이션 코드에 재시도 로직과 오류 처리를 구현하세요. 네트워크 지연과 의존성 상태를 모니터링하세요.

## 모니터링[​](#monitoring "Direct link to Monitoring")

효과적인 모니터링은 Langflow가 다양한 부하 상황에서도 안정적으로 작동하고 성능을 발휘하도록 보장합니다.

- **데이터베이스 모니터링**: [엔터프라이즈 DBA를 위한 Langflow 데이터베이스 가이드](https://docs.langflow.org/enterprise-database-guide)를 참조하세요.

- **애플리케이션 로그**: 오류, 경고, 플로우 실행 문제에 대한 로그를 수집하고 분석하세요. ELK Stack이나 Fluentd와 같은 도구를 사용하여 로그를 중앙 집중화하세요. [Langflow 로그](https://docs.langflow.org/logging)를 직접 확인할 수도 있습니다.

- **리소스 사용량**: Langflow 인스턴스의 CPU, 메모리, 디스크 사용량을 추적하세요. Kubernetes에서 실시간 지표 수집과 모니터링을 위해 Prometheus와 Grafana를 사용하세요.

    Langflow 서버의 Prometheus 지표를 노출하려면 `LANGFLOW_PROMETHEUS_ENABLED=True`를 설정하세요(기본값은 `false`입니다).
Prometheus 지표의 기본 포트는 9090입니다.
포트를 변경하려면 `LANGFLOW_PROMETHEUS_PORT`를 설정하세요.

- **API 성능**: 응답 시간, 오류율, 요청 처리량을 모니터링하세요. 높은 지연 시간이나 오류 급증에 대해 알림을 설정하세요.

- **관찰 가능성(Observability) 도구**: 상세한 플로우 추적과 지표를 위해 [LangWatch](https://docs.langflow.org/integrations-langwatch)나 [Opik](https://docs.langflow.org/integrations-opik)과 통합하세요. 이러한 도구를 사용하여 플로우 성능을 디버깅하고 실행을 최적화하세요.

## 보안[​](#security "Direct link to Security")

프로덕션에서 Langflow를 실행하려면 애플리케이션, 데이터, 사용자를 보호하기 위한 견고한 보안 조치가 필요합니다.
업계 모범 사례를 따르고 다음과 같은 안전한 Langflow 구성을 사용하세요.

- **컨테이너 보안**: 컨테이너화된 애플리케이션에 대한 보안 모범 사례를 적용하세요. 예를 들어, 무단 수정을 방지하기 위해 런타임(프로덕션) 컨테이너에서 `readOnlyRootFilesystem: true`를 설정하세요. 승인되지 않은 사용자에게 노출되어서는 안 되는 민감한 데이터와 구성 파일을 포함하는 파일 및 코드베이스에 대한 접근을 제한하세요.
- **비밀 정보 관리**: API 키와 PostgreSQL 자격 증명과 같은 민감한 데이터는 Kubernetes 시크릿이나 HashiCorp Vault와 같은 외부 비밀 관리자에 저장하세요.
- **인증, 권한 부여, 접근 제어**: [API 키 및 인증](https://docs.langflow.org/api-keys-and-authentication)에서 설명한 대로 인증을 활성화한 상태로 Langflow 서버를 시작하세요. 방화벽, 네트워크 정책, 네트워크 보안 그룹, VPC로 네트워크 및 리소스 접근을 제한하세요. 예를 들어, PostgreSQL 데이터베이스 접근을 Langflow 인스턴스로 제한하세요.
- **암호화 및 개인정보 보호**: GDPR 요구 사항, HTTPS, TLS, SSL을 포함하여 데이터 개인정보 보호 및 전송 중/저장 중 데이터 암호화에 대한 업계 모범 사례와 법적 요구 사항을 따르세요. 예를 들어, 데이터베이스 연결에 SSL을 활성화하려면 유효한 SSL 인증서로 PostgreSQL을 구성하고 연결 문자열에 `?sslmode=require` 또는 `?sslmode=verify-full`을 추가하세요.
- **보안 상태 유지**: 정기적인 보안 감사를 실시하고, 소프트웨어 업데이트를 최신 상태로 유지하며, 침입 탐지 시스템을 사용하여 의심스러운 활동을 모니터링하세요.

## 참고 자료[​](#see-also "Direct link to See also")

- [Kubernetes에 Langflow 프로덕션 환경 배포하기](https://docs.langflow.org/deployment-kubernetes-prod)
- [Langflow Helm Charts 저장소](https://github.com/langflow-ai/langflow-helm-charts)
- [Langflow 환경 변수](https://docs.langflow.org/environment-variables)
