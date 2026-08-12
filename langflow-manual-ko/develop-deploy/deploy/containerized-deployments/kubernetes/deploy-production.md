# Kubernetes에 Langflow 프로덕션 환경 배포하기
> 원문: https://docs.langflow.org/next/deployment-kubernetes-prod

[Langflow 런타임 Helm 차트](https://github.com/langflow-ai/langflow-helm-charts/blob/main/charts/langflow-runtime)는 프로덕션 환경에 애플리케이션을 배포하기 위해 맞춤화되어 있습니다. 애플리케이션이 안정적이고 효율적으로 실행되도록 안정성, 성능, 격리, 보안에 중점을 둡니다.

warning

보안상의 이유로, 기본 Langflow 런타임 Helm 차트는 [`readOnlyRootFilesystem: true`](https://github.com/langflow-ai/langflow-helm-charts/blob/main/charts/langflow-runtime/values.yaml#L46)를 설정합니다. 이 설정은 런타임에 컨테이너의 루트 파일 시스템에 대한 수정을 방지하며, 프로덕션 환경에서 권장되는 보안 조치입니다.

`readOnlyRootFilesystem`이 비활성화(`false`)되면 배포의 보안 상태가 저하됩니다. 보안적 함의를 이해하고 다른 보안 조치를 구현한 경우에만 이 설정을 비활성화하세요.

자세한 내용은 [Kubernetes 문서](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/)를 참조하세요.

## 사전 준비 사항[​](#prerequisites "Direct link to Prerequisites")

- [Kubernetes](https://kubernetes.io/docs/setup/) 서버
- [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)
- [Helm](https://helm.sh/docs/intro/install/)

## Langflow 런타임 Helm 차트 설치하기[​](#install-the-langflow-runtime-helm-chart "Direct link to Install the Langflow runtime Helm chart")

1. Helm에 저장소를 추가합니다.

  ```shell
  helm repo add langflow https://langflow-ai.github.io/langflow-helm-charts
  helm repo update
  ```

2. `langflow` 네임스페이스에 기본 옵션으로 Langflow 앱을 설치합니다.

  - Install chart with custom image
  - Install chart and download flow

  [플로우가 패키징된 커스텀 이미지](https://docs.langflow.org/deployment-docker#package-your-flow-as-a-docker-image)가 있는 경우, `--set` 플래그로 기본 [`values.yaml`](https://github.com/langflow-ai/langflow-helm-charts/blob/main/charts/langflow-runtime/values.yaml)을 재정의하여 Langflow를 배포할 수 있습니다.

  ```shell
  helm install my-langflow-app langflow/langflow-runtime -n langflow --create-namespace --set image.repository=myuser/langflow-hello-world --set image.tag=1.0.0
  ```

    셸에서 대괄호 이스케이프가 필요한 경우, 필요에 따라 `--set` 경로를 수정하세요.
예를 들어 `--set 'downloadFlows.flows\[0\].url=https://raw.githubusercontent.com/langflow-ai/langflow/dev/tests/data/basic_example.json'`과 같이 사용합니다.

- 파드의 상태를 확인합니다.

  ```shell
  kubectl get pods -n langflow
  ```

## Langflow 런타임에 접근하기[​](#access-the-langflow-runtime "Direct link to Access the Langflow runtime")

1. 서비스 이름을 확인합니다.

  ```shell
  kubectl get svc -n langflow
  ```

    서비스 이름은 릴리스 이름 뒤에 `-langflow-runtime`이 붙은 형태입니다. 예를 들어 `helm install my-langflow-app-with-flow`를 사용했다면, 서비스 이름은 `my-langflow-app-with-flow-langflow-runtime`입니다.

2. 로컬 머신에서 Langflow에 접근할 수 있도록 포트 포워딩을 활성화합니다.

  ```shell
  kubectl port-forward -n langflow svc/my-langflow-app-with-flow-langflow-runtime 7860:7860
  ```

3. `http://localhost:7860/api/v1/flows/`를 호출하여 API에 접근할 수 있는지 확인합니다.

  ```shell
  curl -v http://localhost:7860/api/v1/flows/
  ```

    성공적인 요청은 플로우 목록을 반환합니다.

4. 패키징된 플로우를 실행합니다.
다음 예제는 플로우 목록에서 첫 번째 플로우 ID를 가져온 다음, 해당 플로우를 실행합니다.

  ```shell
  # Get flow ID
  id=$(curl -s "http://localhost:7860/api/v1/flows/" | jq -r '.[0].id')

  # Run flow
  curl -X POST \
      "http://localhost:7860/api/v1/run/$id?stream=false" \
      -H 'Content-Type: application/json' \
      -d '{
        "input_value": "Hello!",
        "output_type": "chat",
        "input_type": "chat"
      }'
  ```

## 비밀 정보 및 환경 변수 구성하기[​](#configure-secrets-and-environment-variables "Direct link to Configure secrets and environment variables")

Langflow 런타임 Helm 차트의 [`values.yaml`](https://github.com/langflow-ai/langflow-helm-charts/blob/main/charts/langflow-runtime/values.yaml) 파일의 `.env` 섹션을 사용하여 Langflow 배포를 위한 환경 변수를 정의하세요.
여기에는 내장 [Langflow 환경 변수](https://docs.langflow.org/environment-variables)뿐 아니라 플로우에서 사용되는 [전역 변수](https://docs.langflow.org/configuration-global-variables)도 포함됩니다.

Langflow는 `values.yaml`에서 참조되는 Kubernetes 시크릿과 같은 런타임 환경으로부터 전역 변수를 가져올 수 있습니다.
예를 들어, Langflow 런타임 Helm 차트의 [예제 플로우 JSON](https://raw.githubusercontent.com/langflow-ai/langflow-helm-charts/refs/heads/main/examples/flows/basic-prompting-hello-world.json)은 비밀인 전역 변수를 사용합니다.
Kubernetes 배포에서 이 플로우를 실행하려면, 런타임 구성에 해당 비밀을 포함해야 합니다.

tip

플로우를 JSON 파일로 내보낼 때는 비밀 정보를 생략하는 것이 권장됩니다.
비밀 정보가 포함되는지 여부는 플로우에서 비밀을 어떻게 선언했는지와 **Save with my API keys** 옵션을 사용했는지에 따라 달라집니다.
자세한 내용은 [플로우 가져오기 및 내보내기](https://docs.langflow.org/concepts-flows-import)를 참조하세요.

### 비밀 정보 설정하기[​](#set-secrets "Direct link to Set secrets")

민감한 값과 자격 증명을 저장하는 데는 Kubernetes 시크릿이 권장되는 방법입니다.

`values.yaml`에서 Kubernetes 시크릿을 참조하려면 `secretKeyRef`를 사용하세요.

```yaml
env:
  - name: OPENAI_API_KEY
    valueFrom:
      secretKeyRef:
        name: openai-credentials
        key: openai-key
```

**`kubectl`과 `helm`으로 비밀 정보 생성 및 설정하기**

`kubectl`과 `helm` 명령을 사용하여 비밀 정보를 생성하고 설정할 수 있습니다.

1. 시크릿을 생성합니다.

  ```shell
  kubectl create secret generic openai-credentials \
    --namespace langflow \
    --from-literal=OPENAI_API_KEY=sk...
  ```

2. 시크릿이 존재하는지 확인합니다.

  ```shell
  kubectl get secrets -n langflow openai-credentials
  ```

    결과는 암호화되어 있습니다.

3. Helm 릴리스를 업그레이드하여 시크릿을 사용하도록 합니다.

  ```shell
  helm upgrade my-langflow-app-image langflow/langflow-runtime -n langflow \
    --reuse-values \
    --set "extraEnv[0].name=OPENAI_API_KEY" \
    --set "extraEnv[0].valueFrom.secretKeyRef.name=openai-credentials" \
    --set "extraEnv[0].valueFrom.secretKeyRef.key=OPENAI_API_KEY"
  ```

    셸에서 필요한 경우 대괄호를 이스케이프하세요.

### 로그 레벨 및 기타 구성 변수 설정하기[​](#set-the-log-level-and-other-configuration-variables "Direct link to Set the log level and other configuration variables")

`LANGFLOW_LOG_LEVEL`과 같이 민감하지 않은 변수의 경우, `values.yaml`에서 직접 값을 설정할 수 있습니다.

```yaml
env:
  - name: LANGFLOW_LOG_LEVEL
    value: "INFO"
```

## 스케일링 구성하기[​](#configure-scaling "Direct link to Configure scaling")

Langflow 런타임 Helm 차트의 [`values.yaml`](https://github.com/langflow-ai/langflow-helm-charts/blob/main/charts/langflow-runtime/values.yaml) 파일에서 `replicaCount`와 `resources`를 사용하여 스케일링을 구성하세요.

- **수평 확장**: `replicaCount`를 사용하여 Langflow 배포의 복제본 수를 설정합니다.

  ```yaml
  replicaCount: 3
  ```

- **수직 확장**: 애플리케이션의 필요에 따라 파드 리소스를 조정하려면 `resources` 섹션을 사용합니다.

  ```yaml
  resources:
    requests:
      memory: "2Gi"
      cpu: "1000m"
  ```

## 참고 자료[​](#see-also "Direct link to See also")

- [Kubernetes에서의 Langflow 모범 사례](https://docs.langflow.org/deployment-prod-best-practices)
- [Langflow Helm Charts 저장소](https://github.com/langflow-ai/langflow-helm-charts)
