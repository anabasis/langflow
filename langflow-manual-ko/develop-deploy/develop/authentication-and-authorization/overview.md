# 인증과 권한 부여 개요

> 원문: https://docs.langflow.org/next/authentication-overview

Langflow는 *인증(authentication)*을 사용하여 접근을 허용하기 전에 사용자가 누구인지 확인하고, *권한 부여(authorization)*를 사용하여 인증된 사용자가 수행할 수 있는 작업을 제어합니다.

인증과 권한 부여는 독립적으로 구성됩니다. 대부분의 배포 환경에서는 인증만 필요합니다. 권한 부여는 서버에 역할 기반 접근 제어(RBAC)를 추가하는 선택적 플러그인입니다.

Langflow 서버에 대한 인증과 권한 부여를 구성하려면, 아래에서 사용할 인증 경로를 선택하고 해당 문서를 따르세요.

- Langflow의 내장 인증을 사용하여 사용자 계정과 API 키로 Langflow 서버를 보호하려면 [API 키와 인증](https://docs.langflow.org/next/api-keys-and-authentication)을 참조하세요.
  내장 인증은 항상 사용 가능하며 기본 설정입니다. 사용자는 사용자 이름과 비밀번호로 로그인하고, Langflow는 수명이 짧은 JWT 세션 토큰을 발급하며 자체 데이터베이스에 대해 Langflow API 키를 검증합니다.

- Langflow를 회사의 SSO, OIDC, 또는 자체 ID 공급자(identity provider)에 연결하려면 [외부 인증](https://docs.langflow.org/next/external-authentication)을 참조하세요.
  외부 인증을 사용하면 업스트림 ID 공급자, OIDC 프록시, 또는 사내 SSO 게이트웨이가 로그인을 처리할 수 있습니다. Langflow는 프록시가 전달하는 토큰을 수락하고, ID 공급자의 JWKS 엔드포인트에 대해 이를 검증한 다음, 로컬 사용자를 자동으로 프로비저닝합니다.

- Langflow 서버에 RBAC를 구성하려면 [권한 부여](https://docs.langflow.org/next/authorization)를 참조하세요.
  사용자가 위의 인증 경로 중 하나를 통해 인증된 후, 권한 부여 계층이 해당 사용자가 수행할 수 있는 작업을 결정합니다.
  RBAC를 적용하려면 등록된 권한 부여 플러그인이 필요합니다.

여러 자격 증명이 동시에 존재하는 경우, Langflow는 내장 JWT, 외부 토큰, Langflow API 키 순서로 각 자격 증명을 시도합니다.

## 참고 자료[​](#see-also "Direct link to See also")

- [환경 변수](https://docs.langflow.org/environment-variables)
- [보안](https://docs.langflow.org/security)
