# Langflow 배포 개요
> 원문: https://docs.langflow.org/next/deployment-overview

이 섹션에서는 로컬에서 만든 플로우를 세상에 공개하는 다양한 방법을 다룹니다.

- ngrok 게이트웨이를 통해 로컬 서버를 셀프 호스팅하려면 [공개 Langflow 서버 배포](https://docs.langflow.org/deployment-public-server)를 참조하세요.
이 방법은 [ngrok](https://ngrok.com/docs/getting-started/)을 사용해 트래픽을 포워딩하고 로컬 Langflow 서버를 인터넷에 공유하며, 클라우드 제공업체에 배포하거나 네트워크를 직접 노출하지 않습니다.

- 플로우 파일을 포함하는 Langflow 컨테이너를 빌드하고 배포하려면 [Langflow 애플리케이션 컨테이너화](https://docs.langflow.org/next/develop-application)를 참조하세요.
이 방법은 플로우와 의존성을 이식 가능하고 재현 가능한 Docker 이미지로 묶어 다양한 환경에 쉽게 배포할 수 있게 합니다.

- Docker와 Caddy를 사용해 원격 서버에 Langflow 서버를 배포하려면 [원격 서버에 Langflow 배포](https://docs.langflow.org/deployment-caddyfile)를 참조하세요.
이 방법은 Docker 컨테이너와 리버스 프록시로 Caddy를 사용해 HTTPS를 지원하는 안전한 웹 접근으로 자체 Langflow 인스턴스를 호스팅하는 데 적합합니다.

- Nginx와 자동 SSL 인증서로 Langflow를 배포하려면 [Nginx와 Let's Encrypt로 Langflow 배포](https://docs.langflow.org/deployment-nginx-ssl)를 참조하세요.
이 방법은 리버스 프록시로 Nginx를, 자동 HTTPS 인증서 관리에는 Let's Encrypt를 사용하여 Docker *없이* 안전한 배포를 제공합니다.

- Kubernetes에 Langflow를 배포하려면 [Langflow Kubernetes 아키텍처 및 모범 사례](https://docs.langflow.org/deployment-prod-best-practices)를 참조하세요. 이 방법은 고가용성, 확장성, 견고한 오케스트레이션을 갖춘 프로덕션급 배포를 구성합니다.

- 클라우드 제공업체별 배포 가이드는 해당 클라우드 제공업체의 문서를 참조하세요.
Langflow 문서는 [Google Cloud Platform](https://docs.langflow.org/deployment-gcp)과 [Hugging Face Spaces](https://docs.langflow.org/deployment-hugging-face-spaces) 등 몇 가지 예시를 제공하여 시작을 돕습니다.
