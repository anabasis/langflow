# Google Cloud Platform에 Langflow 배포하기
> 원문: https://docs.langflow.org/next/deployment-gcp

이 가이드는 Cloud Shell 스크립트를 사용해 [Google Cloud Platform](https://console.cloud.google.com/)에 Langflow를 배포하는 방법을 설명합니다. 이 스크립트는 Langflow 패키지, Nginx, 그리고 GCP에서 Langflow 개발 환경을 실행하는 데 필요한 설정을 갖춘 Debian 기반 VM을 구성하는 과정을 안내합니다.

이 스크립트를 사용하려면 리소스를 생성할 수 있는 필요한 권한을 가진 Google Cloud 프로젝트가 있어야 합니다.

1. 다음 링크를 따라 Langflow 저장소의 GCP 배포 스크립트로 Cloud Shell을 실행하세요.

    [![Deploy to Google Cloud](https://gstatic.com/cloudssh/images/open-btn.svg)](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/langflow-ai/langflow&working_dir=scripts/gcp&shellonly=true&tutorial=walkthroughtutorial.md)

2. **Trust repo**를 클릭하세요.

    일부 `gcloud` 명령은 임시(ephemeral) Cloud Shell 환경에서 실행되지 않을 수 있습니다.

3. **Start**를 클릭한 다음, 튜토리얼을 따라 Langflow를 배포하세요.

info

이 배포는 Langflow를 GCP에 배포하는 방법을 보여주기 위한 비용 효율적인 방식으로 [스팟(선점형) 인스턴스](https://cloud.google.com/compute/docs/instances/preemptible)를 사용합니다.
다만 스팟 인스턴스의 특성상, Google Cloud가 리소스를 회수해야 할 경우 VM이 언제든지 종료될 수 있습니다.

더 안정적인 배포가 필요하다면 스팟 인스턴스 대신 일반 VM 인스턴스 사용을 고려하세요.

자세한 내용은 [GCP 가격 계산기](https://cloud.google.com/products/calculator?hl=en)를 참조하세요.
</content>
