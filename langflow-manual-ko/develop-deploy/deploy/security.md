# 보안
> 원문: https://docs.langflow.org/next/security

Langflow UI는 IDE이자 코드 실행 플랫폼이며, 이는 곧 Langflow가 개발자가 제공한 임의 코드를 실행할 수 있는 능력을 본질적으로 가지고 있음을 의미합니다.
설계상 Langflow UI에는 개발자가 임의의 Python 코드를 작성하고 실행할 수 있는 코드 편집기가 포함되어 있으며, 이 코드는 Langflow 백엔드 프로세스, 파일 시스템, 네트워크에 대한 전체 접근 권한을 갖고 실행됩니다.
또한 일부 컴포넌트는 코드 실행을 래핑하여 사용하며, 여기에는 사용자 입력을 기반으로 AI 모델이 실행할 코드를 생성하는 경우도 포함됩니다.

Langflow는 단일 Langflow 프로세스 내에서 사용자 간 격리를 강제하지 않으며, 로컬 디스크나 네트워크 리소스에 대한 접근을 제한하지도 않습니다. 플로우 가시성과 사용자 접근 제어는 보안 강제가 아니라 사용성을 위해 설계되었습니다. 사용자는 기본 데이터베이스 연결과 시스템 리소스에 직접 접근할 수 있습니다. 멀티테넌트 배포의 경우, Langflow는 애플리케이션 수준의 격리가 아니라 인프라 수준의 보안에 의존하므로, 테넌트 격리를 강제하는 것은 사용자의 책임입니다.

경고

다음 사항은 사용자의 책임입니다.

- 포괄적인 인프라 수준 격리를 강제하는 것
- 특히 LLM이 생성한 코드나 사용자 제출 코드가 포함될 수 있는 사용자 입력을 사용하는 플로우를 안전하게 실행하는 것
- Langflow 기반 API와의 최종 사용자 상호작용이 저장 데이터와 전송 중인 데이터를 포함해 전 과정에서 안전하도록 보장하는 것

## 로컬 개발 환경에서 Langflow 보안 강화하기[​](#secure-langflow-during-local-development "Direct link to Secure Langflow during local development")

Langflow는 로컬 시스템에 대한 전체 접근 권한을 가진 코드 실행 플랫폼입니다.
실행하는 플로우의 안전성을 보장하는 것은 사용자의 책임입니다.

Langflow가 신뢰할 수 없는 코드나 LLM이 생성한 코드를 실행할 가능성이 있는 경우, [커스텀 컴포넌트 실행 차단](https://docs.langflow.org/next/deployment-block-custom-components)을 고려하고 Langflow를 격리되고 컨테이너화된 실행 환경에서 실행하세요.
자세한 내용은 [Langflow 애플리케이션 컨테이너화하기](https://docs.langflow.org/develop-application)를 참조하세요.

## 퍼스트파티 배포 보안 강화하기[​](#secure-first-party-deployments "Direct link to Secure first-party deployments")

사용자 본인 또는 소속 조직이 작성한 플로우를 기반으로 API를 제공하는 경우, Langflow 기반 API가 최종 사용자에게 보안을 제공하도록 보장하는 것은 사용자의 책임입니다.

API에 대한 업계 모범 사례를 따르세요.

- 인증과 권한 부여를 제공하는 안전한 API 게이트웨이를 사용하세요
- 사용자 데이터가 적절히 격리되도록 하세요
- XSS 및 인젝션 공격에 대비해 입력과 출력을 살균(sanitize)하고, ReDoS 취약점을 방지하기 위한 정규식 패턴을 포함시키세요


리버스 프록시 설정에 대한 자세한 내용은 [Nginx와 SSL로 Langflow 배포하기](https://docs.langflow.org/deployment-nginx-ssl)를 참조하세요.
인증 설정에 대한 자세한 내용은 [API 키와 인증](https://docs.langflow.org/api-keys-and-authentication)을 참조하세요.

## 서드파티 배포 보안 강화하기[​](#secure-third-party-deployments "Direct link to Secure third-party deployments")

Langflow를 서드파티에게 서비스 형태로 제공하는 경우, Langflow가 실행하는 코드가 잠재적으로 악의적일 수 있다고 가정해야 합니다.

Langflow는 테넌트 간 격리를 제공하지 않으므로, 인프라 수준에서 격리를 강제하는 것은 사용자의 책임입니다.

- 프로세스 수준 격리를 사용해 테넌트가 단일 Langflow 프로세스를 공유하지 않도록 하세요
- 디스크 수준 격리를 사용해 쓰기 가능한 영구 저장소를 공유 접근하지 못하도록 하세요
- 네트워크 수준 격리를 사용해 사설 네트워크에 대한 접근을 차단하세요
- 데이터베이스 수준 격리를 사용해 공유 데이터베이스 리소스에 대한 접근이나 수정을 차단하세요


인증과 권한 부여는 Langflow 컨테이너 외부에서 제공되고 강제되어야 합니다.
데이터베이스와 같은 공유 서비스의 경우, 자격 증명과 보안 정책을 통해 외부에서 접근 제한을 강제하세요.

자세한 내용은 [Kubernetes에서 Langflow 운영을 위한 모범 사례](https://docs.langflow.org/deployment-prod-best-practices)를 참조하세요.

## 보안 공지[​](#security-bulletin "Direct link to Security bulletin")

자세한 내용은 [Langflow 보안 정책](https://github.com/langflow-ai/langflow/blob/main/SECURITY.md)을 참조하세요.
</content>
