# Google Cloud Platform에 Langflow 배포

이 가이드는 Google Cloud Platform(GCP)에 Langflow를 배포하는 방법을 설명합니다. Cloud Shell 스크립트를 사용하여 Langflow 패키지, Nginx 및 필요한 구성이 포함된 Debian 기반 VM을 설정하는 과정을 안내합니다.

이 스크립트를 사용하려면 리소스를 생성할 수 있는 권한이 있는 Google Cloud 프로젝트가 필요합니다.

---

## 배포 단계

1. 다음 링크를 클릭하여 Langflow 저장소의 GCP 배포 스크립트로 Cloud Shell을 시작합니다:

   [Google Cloud에 배포](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/langflow-ai/langflow&working_dir=scripts/gcp&shellonly=true&tutorial=walkthroughtutorial.md)

2. **Trust repo**를 클릭합니다.

3. **Start**를 클릭하고 튜토리얼을 따라 Langflow를 배포합니다.

> **참고**: 이 배포는 비용 효율적인 옵션으로 [스팟(선점형) 인스턴스](https://cloud.google.com/compute/docs/instances/preemptible)를 사용합니다. 스팟 인스턴스의 특성상 Google Cloud가 리소스를 회수해야 할 때 VM이 언제든지 종료될 수 있습니다.
>
> 보다 안정적인 배포를 위해서는 스팟 인스턴스 대신 일반 VM 인스턴스를 사용하는 것을 고려하세요.

---

## 참고 항목

- [Langflow 배포 개요](./deployment-overview.md)
- [컨테이너화된 배포](./containerize.md)

---

*원문: https://docs.langflow.org/next/deployment-gcp*
