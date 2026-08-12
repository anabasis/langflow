# Kubernetes에 Langflow 개발 환경 배포하기
> 원문: https://docs.langflow.org/next/deployment-kubernetes-dev

[Langflow 통합 개발 환경(IDE) Helm 차트](https://github.com/langflow-ai/langflow-helm-charts/tree/main/charts/langflow-ide)는 개발자가 플로우를 생성, 테스트, 디버깅할 수 있는 완전한 환경을 제공하도록 설계되었습니다. 여기에는 Langflow API와 시각적 편집기가 모두 포함됩니다.

## 사전 준비 사항[​](#prerequisites "Direct link to Prerequisites")

- [Kubernetes](https://kubernetes.io/docs/setup/) 클러스터
- [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)
- [Helm](https://helm.sh/docs/intro/install/)

## Kubernetes 클러스터 준비하기[​](#prepare-a-kubernetes-cluster "Direct link to Prepare a Kubernetes cluster")

이 예제는 [Minikube](https://minikube.sigs.k8s.io/docs/start/)를 사용하지만, 어떤 Kubernetes 클러스터든 사용할 수 있습니다.

1. Minikube에 Kubernetes 클러스터를 생성합니다.

  ```shell
  minikube start
  ```

2. `kubectl`이 Minikube를 사용하도록 설정합니다.

  ```shell
  kubectl config use-context minikube
  ```

## Langflow IDE Helm 차트 설치하기[​](#install-the-langflow-ide-helm-chart "Direct link to Install the Langflow IDE Helm chart")

1. Helm에 저장소를 추가한 다음 업데이트합니다.

  ```shell
  helm repo add langflow https://langflow-ai.github.io/langflow-helm-charts
  helm repo update
  ```

2. `langflow` 네임스페이스에 기본 옵션으로 Langflow를 설치합니다.

  ```shell
  helm install langflow-ide langflow/langflow-ide -n langflow --create-namespace
  ```

3. 파드의 상태를 확인합니다.

  ```shell
  kubectl get pods -n langflow
  ```

## Langflow IDE에 접근하기[​](#access-the-langflow-ide "Direct link to Access the Langflow IDE")

로컬 머신에서 Langflow에 접근할 수 있도록 로컬 포트 포워딩을 활성화하세요.

1. 로컬 머신의 7860 포트에서 Langflow API에 접근할 수 있도록 합니다.

  ```shell
  kubectl port-forward -n langflow svc/langflow-service-backend 7860:7860
  ```

2. 로컬 머신의 8080 포트에서 시각적 편집기에 접근할 수 있도록 합니다.

  ```shell
  kubectl port-forward -n langflow svc/langflow-service 8080:8080
  ```

이제 다음을 수행할 수 있습니다.

- `http://localhost:7860`에서 Langflow API에 접근
- `http://localhost:8080`에서 시각적 편집기에 접근

## Langflow IDE 배포 수정하기[​](#modify-your-langflow-ide-deployment "Direct link to Modify your Langflow IDE deployment")

Langflow IDE Helm 차트의 [`values.yaml`](https://github.com/langflow-ai/langflow-helm-charts/blob/main/charts/langflow-ide/values.yaml) 파일을 수정하여 배포를 커스터마이즈할 수 있습니다.
다음 섹션은 몇 가지 일반적인 수정 사항을 설명합니다.

비밀 정보를 설정해야 하는 경우, Kubernetes 시크릿을 사용하는 것이 권장됩니다.

### 다른 Langflow 버전 배포하기[​](#deploy-a-different-langflow-version "Direct link to Deploy a different Langflow version")

Langflow IDE Helm 차트는 기본적으로 최신 Langflow 버전을 배포합니다.

다른 Langflow 버전을 지정하려면, `langflow.backend.image.tag`와 `langflow.frontend.image.tag` 값을 원하는 버전으로 설정하세요.
예를 들면 다음과 같습니다.

```yaml
langflow:
  backend:
    image:
      tag: "1.0.0a59"
  frontend:
    image:
      tag: "1.0.0a59"
```

### Langflow 데이터베이스에 외부 스토리지 사용하기[​](#use-external-storage-for-the-langflow-database "Direct link to Use external storage for the Langflow database")

Langflow IDE Helm 차트는 기본 Langflow 데이터베이스 구성, 구체적으로는 로컬 영구 디스크에 저장된 SQLite 데이터베이스를 사용합니다.

[외부 PostgreSQL 데이터베이스](https://docs.langflow.org/configuration-custom-database)를 사용하려면, `values.yaml`에서 `postgresql` 차트 또는 `externalDatabase`를 사용하여 데이터베이스 연결을 구성하세요.

- postgresql
- externalDatabase

내장 PostgreSQL 차트 사용:

```yaml
postgresql:
  enabled: true
  auth:
    username: "langflow"
    password: "langflow-postgres"
    database: "langflow-db"
```

### 스케일링 구성하기[​](#configure-scaling "Direct link to Configure scaling")

Langflow IDE Helm 차트 배포에 대해 스케일링을 구성하려면, `langflow.backend`와 `langflow.frontend` 모두에 대해 `replicaCount`(수평 확장)와 `resources`(수직 확장)를 설정해야 합니다.

플로우가 [내장 채팅 메모리](https://docs.langflow.org/memory)와 같은 공유 상태에 의존하는 경우, 수평으로 확장할 때 공유 데이터베이스도 함께 설정해야 합니다.

```yaml
langflow:
  backend:
    replicaCount: 1
    resources:
      requests:
        cpu: 0.5
        memory: 1Gi
      # limits:
      #   cpu: 0.5
      #   memory: 1Gi

  frontend:
    enabled: true
    replicaCount: 1
    resources:
      requests:
        cpu: 0.3
        memory: 512Mi
      # limits:
      #   cpu: 0.3
      #   memory: 512Mi
```

## 참고 자료[​](#see-also "Direct link to See also")

- [Kubernetes에서의 Langflow 모범 사례](https://docs.langflow.org/deployment-prod-best-practices)
- [Kubernetes에 Langflow 프로덕션 환경 배포하기](https://docs.langflow.org/deployment-kubernetes-prod)
- [Langflow Helm Charts 저장소](https://github.com/langflow-ai/langflow-helm-charts)
