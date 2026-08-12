# Langflow 배포 개요

이 섹션에는 로컬에서 빌드한 플로우를 세상에 공개하는 다양한 방법이 포함되어 있습니다.

## 배포 옵션

- **ngrok 게이트웨이를 통한 로컬 서버 자체 호스팅**: [공개 Langflow 서버 배포](./deployment-public-server.md)를 참조하세요.
  이 방법은 [ngrok](https://ngrok.com/docs/getting-started/)을 사용하여 트래픽을 전달하고 클라우드 제공자에 배포하거나 네트워크를 직접 노출하지 않고 인터넷에서 로컬 Langflow 서버를 공유합니다.

- **플로우 파일을 포함한 Langflow 컨테이너 빌드 및 배포**: [Langflow 애플리케이션 컨테이너화](./containerize.md)를 참조하세요.
  이 방법은 플로우와 종속성을 다양한 환경에서 쉽게 배포할 수 있는 이식성 있고 재현 가능한 Docker 이미지로 번들합니다.

- **Docker와 Caddy를 사용하여 원격 서버에 Langflow 서버 배포**: [원격 서버에 Langflow 배포](https://docs.langflow.org/deployment-caddyfile)를 참조하세요.
  이 방법은 HTTPS 지원을 위한 리버스 프록시로 Docker 컨테이너와 Caddy를 사용하여 원격 서버에서 자체 Langflow 인스턴스를 호스팅하는 데 적합합니다.

- **Nginx와 자동 SSL 인증서로 Langflow 배포**: [Nginx와 Let's Encrypt로 Langflow 배포](./deployment-nginx-ssl.md)를 참조하세요.
  이 방법은 자동 HTTPS 인증서 관리를 위해 Let's Encrypt와 함께 Nginx를 리버스 프록시로 사용하여 Docker 없이 안전한 배포를 제공합니다.

- **Kubernetes에서 Langflow 배포**: [Langflow Kubernetes 아키텍처 및 모범 사례](https://docs.langflow.org/deployment-prod-best-practices)를 참조하세요.
  이 방법은 고가용성, 확장성, 강력한 오케스트레이션을 갖춘 프로덕션 수준의 배포를 만듭니다.

- **클라우드 제공자별 배포 가이드**: 클라우드 제공자의 문서를 참조하세요.
  Langflow 문서에는 시작에 도움이 되는 몇 가지 예제(예: [Google Cloud Platform](./cloud-platforms.md), [Hugging Face Spaces](https://docs.langflow.org/deployment-hugging-face-spaces))가 포함되어 있습니다.

---

## 하위 페이지

- [공개 Langflow 서버 배포](./deployment-public-server.md)
- [Nginx와 SSL로 Langflow 배포](./deployment-nginx-ssl.md)
- [watsonx Orchestrate에서 플로우 배포](./deployment-wxo.md)
- [컨테이너화된 배포](./containerize.md)
- [클라우드 플랫폼](./cloud-platforms.md)
- [멀티 워커로 Langflow 배포](./deployment-multi-worker.md)
- [LFX와 Langflow 버전 호환성](./lfx-compatibility.md)
- [커스텀 컴포넌트 차단](./deployment-block-custom-components.md)
- [보안](./security.md)

---

*원문: https://docs.langflow.org/next/deployment-overview*
