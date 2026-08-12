# 외부 인증

> 원문: https://docs.langflow.org/next/external-authentication

외부 인증을 사용하면 업스트림 ID 공급자, OIDC 프록시, 또는 사내 SSO 게이트웨이가 로그인을 처리할 수 있습니다. Langflow는 프록시가 전달하는 토큰을 수락하고, ID 공급자의 JWKS 엔드포인트에 대해 이를 검증한 다음, 로컬 사용자를 자동으로 프로비저닝합니다.
이는 OIDC 프록시, API 게이트웨이, 또는 사내 SSO 시스템처럼 이미 인증을 처리하는 게이트웨이 뒤에 Langflow가 배포되어 있을 때 유용합니다.

내장된 Langflow JWT 경로가 항상 먼저 시도됩니다. 실패하면 외부 경로가 대안(fallback)으로 시도되므로, 기존 Langflow 자격 증명은 외부 자격 증명과 함께 계속 작동합니다.

외부 인증을 활성화하려면 `LANGFLOW_EXTERNAL_AUTH_ENABLED=true`를 설정하고 최소 하나의 검증 모드를 구성하세요.

다음 예시는 JWKS 검증을 사용하여 Langflow를 [Keycloak](https://www.keycloak.org/)에 연결합니다.
동일한 패턴이 다른 OIDC ID 공급자에도 적용됩니다.
클라이언트를 생성하고, Langflow를 ID 공급자의 JWKS URL과 발급자(issuer)를 가리키도록 설정하고, 예상되는 대상(audience)을 설정한 다음, `Authorization` 헤더로 액세스 토큰을 전달합니다.

## 사전 준비 사항[​](#prerequisites "Direct link to Prerequisites")

- [Docker](https://docs.docker.com/get-docker/) 또는 [Podman](https://docs.podman.io/)이 설치되어 실행 중이어야 합니다.

### Keycloak 렐름 및 OIDC 클라이언트 생성[​](#create-a-keycloak-realm-and-oidc-client "Direct link to Create a Keycloak realm and OIDC client")

1. Keycloak 컨테이너를 개발 모드로 시작하고 **두** 포트를 모두 게시합니다.

    관리 콘솔, 토큰 엔드포인트, JWKS URL에 대해 `localhost`에서 HTTP를 허용하려면 Keycloak을 `start-dev`로 실행해야 합니다. 프로덕션 모드는 HTTPS를 요구합니다.
    Langflow가 호스트에서 접근 가능하려면 Keycloak 컨테이너에 포트 `7860`이 게시되어 있어야 합니다. 이 Docker 예시에서는 Langflow가 Keycloak의 네트워크 네임스페이스를 공유합니다.

  ```bash
  docker run -d --name keycloak \  
    -p 8080:8080 -p 7860:7860 \  
    -e KC_BOOTSTRAP_ADMIN_USERNAME=admin \  
    -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin \  
    quay.io/keycloak/keycloak:latest start-dev  
  ```

2. `http://localhost:8080/admin`에서 Keycloak 관리 콘솔을 열고, `admin` / `admin`으로 로그인합니다.

3. `langflow`라는 이름의 새 렐름(realm)을 생성합니다.

4. **Clients**를 클릭한 다음, `langflow-app`이라는 이름의 OpenID Connect 클라이언트를 생성합니다.

5. **Client authentication**을 **On**으로 설정합니다.

6. **Capability config**를 클릭한 다음 **Direct access grants**를 활성화합니다.

    이 예시에서는 비밀번호 그랜트로 `curl`을 사용해 토큰을 요청할 것이므로 리디렉션 URI가 필요하지 않습니다.
    사용자가 OIDC 프록시를 통해 로그인할 예정이라면, 나중에 `http://localhost:7860/*`와 같은 리디렉션 URI를 설정하세요.

7. **Credentials** 탭에서 클라이언트 시크릿을 복사합니다.
    이후 액세스 토큰 요청을 구성할 때 사용합니다.

### 액세스 토큰에 대상(audience) 매퍼 추가[​](#add-an-audience-mapper-to-the-access-token "Direct link to Add an audience mapper to the access token")

Langflow는 토큰의 `aud` 클레임이 `LANGFLOW_EXTERNAL_AUTH_AUDIENCE`와 일치할 것을 요구합니다.
Keycloak 액세스 토큰은 기본적으로 `aud`에 클라이언트 ID를 포함하지 않으므로, 매퍼를 추가해야 합니다.

1. **langflow-app** 클라이언트를 열고, **Client scopes** > **langflow-app-dedicated** > **Add mapper** > **By configuration**을 클릭합니다.

2. **Audience**를 선택합니다.

3. **Included Client Audience**를 `langflow-app`으로 설정합니다.

4. **Add to access token**을 활성화합니다.

5. **Create**를 클릭합니다.

    이제 `langflow-app`에 발급된 액세스 토큰에는 `aud` 클레임에 `langflow-app`이 포함됩니다.

### 테스트 사용자 생성[​](#create-a-test-user "Direct link to Create a test user")

1. `langflow` 렐름에서 **Users** > **Create new user**를 클릭합니다.
2. **Username**을 `alice`로, **Email**을 `alice@example.com`으로 설정하고, **Email verified**를 활성화합니다.
3. **Credentials** 탭을 열고 비밀번호를 설정한 다음 **Temporary**를 끕니다.

### Langflow를 Keycloak에 연결[​](#connect-langflow-to-keycloak "Direct link to Connect Langflow to Keycloak")

1. Langflow `.env` 파일에 다음 값을 추가합니다.

  ```bash
  LANGFLOW_AUTO_LOGIN=False  
  LANGFLOW_EXTERNAL_AUTH_ENABLED=true  
  LANGFLOW_EXTERNAL_AUTH_PROVIDER=keycloak  
  LANGFLOW_EXTERNAL_AUTH_TOKEN_HEADER=Authorization  

  # Keycloak realm endpoints (http is allowed for localhost in development)  
  LANGFLOW_EXTERNAL_AUTH_JWKS_URL=http://localhost:8080/realms/langflow/protocol/openid-connect/certs  
  LANGFLOW_EXTERNAL_AUTH_ISSUER=http://localhost:8080/realms/langflow  
  LANGFLOW_EXTERNAL_AUTH_AUDIENCE=langflow-app  
  ```

2. Langflow 컨테이너를 시작합니다.

  ```bash
  docker run -d --name langflow \  
    --network container:keycloak \  
    -e LANGFLOW_AUTO_LOGIN=False \  
    -e LANGFLOW_EXTERNAL_AUTH_ENABLED=true \  
    -e LANGFLOW_EXTERNAL_AUTH_PROVIDER=keycloak \  
    -e LANGFLOW_EXTERNAL_AUTH_TOKEN_HEADER=Authorization \  
    -e LANGFLOW_EXTERNAL_AUTH_JWKS_URL=http://127.0.0.1:8080/realms/langflow/protocol/openid-connect/certs \  
    -e LANGFLOW_EXTERNAL_AUTH_ISSUER=http://localhost:8080/realms/langflow \  
    -e LANGFLOW_EXTERNAL_AUTH_AUDIENCE=langflow-app \  
    langflowai/langflow-nightly:latest  
  ```

3. 테스트 사용자에 대한 토큰을 요청합니다.

  ```bash
  curl -s -X POST "http://localhost:8080/realms/langflow/protocol/openid-connect/token" \  
    -H "Content-Type: application/x-www-form-urlencoded" \  
    --data-urlencode "client_id=langflow-app" \  
    --data-urlencode "client_secret=YOUR_CLIENT_SECRET" \  
    --data-urlencode "grant_type=password" \  
    --data-urlencode "username=YOUR_USERNAME" \  
    --data-urlencode "password=YOUR_USER_PASSWORD"  
  ```

    `YOUR_CLIENT_SECRET`, `YOUR_USERNAME`, `YOUR_USER_PASSWORD`를 Keycloak의 실제 값으로 교체하세요.

    Keycloak은 다음과 같은 JSON 객체를 반환합니다.

  ```json
  {  
    "access_token": "eyJhbG...t5",  
    "token_type": "Bearer",  
    "not-before-policy": 0,  
    "session_state": "...",  
    "scope": "email profile"  
  }  
  ```

  tip
      기본적으로 Keycloak 액세스 토큰은 5분 후 만료됩니다.
    만료된 토큰은 HTTP 상태 `401`과 함께 `{"detail":"Invalid token"}`을 반환합니다.
    이 오류가 발생하면 새 토큰을 요청하세요.

4. `access_token` 값을 복사합니다. Langflow는 이를 `Authorization: Bearer` 헤더로 기대합니다.

5. 응답의 `access_token`을 터미널 환경 변수로 저장하려면 다음을 실행합니다.

  ```bash
  export KEYCLOAK_TOKEN="ey..."  
  ```

6. Langflow가 접근 가능한지 확인하려면, Keycloak 토큰을 사용해 `whoami` 엔드포인트로 요청을 보냅니다.

  ```bash
  curl -s http://localhost:7860/health  
  curl -s "http://localhost:7860/api/v1/users/whoami" \  
    -H "Authorization: Bearer $KEYCLOAK_TOKEN"  
  ```

    첫 번째 성공적인 요청에서, Langflow는 토큰 클레임으로부터 로컬 사용자를 JIT(즉시) 프로비저닝합니다.
    이후 요청은 해당 사용자로 인증됩니다.

  ```json
  {  
    "id": "a5d2f129-ef52-481d-a92f-e1f3fccda3ec",  
    "username": "alice",  
    "profile_image": null,  
    "store_api_key": null,  
    "is_active": true,  
    "is_superuser": false,  
    "create_at": "2026-06-26T17:24:13.733158",  
    "updated_at": "2026-06-26T17:24:13.733165",  
    "last_login_at": "2026-06-26T17:24:13.526866",  
    "optins": {  
      "github_starred": false,  
      "dialog_dismissed": false,  
      "discord_clicked": false  
    }  
  }  
  ```

    인증에 실패하면, `aud` 또는 `iss` 값 불일치가 가장 흔한 원인입니다.
    선택적으로 [jwt.io](https://jwt.io/)에서 토큰을 디코딩하여 `iss`, `aud`, `exp`가 대상 매퍼와 일치하는지 확인하세요.
    `aud` 배열에는 대상 매퍼에서 설정한 `langflow-app`이 포함되어야 합니다.

## 외부 인증 환경 변수 구성[​](#configure-external-authentication-environment-variables "Direct link to Configure external authentication environment variables")

| 변수 | 설명 | 기본값 |
| --- | --- | --- |
| `LANGFLOW_​EXTERNAL_​AUTH_​ENABLED` | 외부 인증과 JIT 사용자 프로비저닝을 활성화합니다. | `false` |
| `LANGFLOW_​EXTERNAL_​AUTH_​PROVIDER` | 외부 공급자를 식별하기 위해 사용자 프로필에 기록되는 고정 키. 외부 사용자에 대한 API 키 제한을 연결하는 데 사용됩니다. | `external` |
| `LANGFLOW_​EXTERNAL_​AUTH_​TOKEN_​HEADER` | 자격 증명을 추출할 HTTP 헤더. `Bearer` 접두사가 붙은 값을 지원합니다. | `Authorization` |
| `LANGFLOW_​EXTERNAL_​AUTH_​TOKEN_​COOKIE` | 자격 증명을 추출할 선택적 쿠키 이름. 헤더가 먼저 확인됩니다. | *(없음)* |

### JWKS 서명 검증[​](#jwks-signature-verification "Direct link to JWKS signature verification")

| 변수 | 설명 | 기본값 |
| --- | --- | --- |
| `LANGFLOW_​EXTERNAL_​AUTH_​JWKS_​URL` | IdP의 JWKS 엔드포인트 HTTPS URL. 신뢰 기반 디코드(trusted-decode) 모드가 활성화되지 않은 한 필수입니다. | *(없음)* |
| `LANGFLOW_​EXTERNAL_​AUTH_​AUDIENCE` | 예상되는 `aud` 클레임 값. 쉼표로 구분된 여러 값도 허용됩니다. 서비스 간 토큰 재사용을 방지하기 위해 JWKS와 함께 필수입니다. | *(없음)* |
| `LANGFLOW_​EXTERNAL_​AUTH_​ISSUER` | 예상되는 `iss` 클레임 값. 발급자 검증을 건너뛰려면 비워 두세요. | *(없음)* |
| `LANGFLOW_​EXTERNAL_​AUTH_​ALGORITHMS` | 허용되는 JWT 서명 알고리즘의 쉼표 구분 목록. | `RS256` |

warning

`LANGFLOW_EXTERNAL_AUTH_JWKS_URL`은 `https`를 사용해야 합니다. `http` URL은 개발 환경의 `localhost`와 루프백 주소에 대해서만 허용됩니다. 암호화되지 않은 JWKS 엔드포인트는 네트워크 공격자가 서명 키를 교체하고 토큰을 위조할 수 있게 만들기 때문입니다.

### 신뢰 기반 디코드 모드[​](#trusted-decode-mode "Direct link to Trusted-decode mode")

| 변수 | 설명 | 기본값 |
| --- | --- | --- |
| `LANGFLOW_​EXTERNAL_​AUTH_​TRUSTED_​JWT_​DECODE` | 서명을 검증하지 않고 JWT를 디코드합니다. Langflow가 이미 토큰을 검증한 신뢰할 수 있는 프록시 뒤에 있을 때만 활성화하세요. | `false` |

danger

신뢰 기반 디코드 모드는 모든 암호화 검증을 건너뜁니다. Langflow가 인터넷에서 직접 접근 불가능하고, 업스트림 프록시가 토큰 검증을 책임지는 경우에만 활성화하세요.

### JIT 사용자 프로비저닝 클레임 매핑[​](#jit-user-provisioning-claim-mapping "Direct link to JIT user provisioning claim mapping")

Langflow는 프로비저닝된 계정을 생성하거나 업데이트할 때 JWT 클레임을 로컬 사용자 속성에 매핑합니다.

| 변수 | 설명 | 기본값 |
| --- | --- | --- |
| `LANGFLOW_​EXTERNAL_​AUTH_​SUBJECT_​CLAIM` | 안정적인 외부 사용자 식별자로 사용되는 JWT 클레임. | `sub` |
| `LANGFLOW_​EXTERNAL_​AUTH_​USERNAME_​CLAIM` | 로컬 Langflow 사용자 이름으로 우선 사용되는 JWT 클레임. 이메일, 이름, 또는 결정적 해시로 대체됩니다. | `preferred_​username` |
| `LANGFLOW_​EXTERNAL_​AUTH_​EMAIL_​CLAIM` | 사용자의 이메일 주소를 담고 있는 JWT 클레임. | `email` |
| `LANGFLOW_​EXTERNAL_​AUTH_​NAME_​CLAIM` | 사용자의 표시 이름을 담고 있는 JWT 클레임. | `name` |

## JWT 클레임으로부터 접근 상한(access ceiling) 구성[​](#configure-an-access-ceiling-from-jwt-claims "Direct link to Configure an access ceiling from JWT claims")

접근 상한은 JWT 클레임 값을 `viewer`, `editor`, `admin` 세 가지 접근 수준 중 하나로 매핑하는 거칠고 거부 전용(deny-only)인 메커니즘입니다.
완전한 RBAC 엔진은 아닙니다.
활성화되면, 상한이 요구되는 수준보다 낮은 외부 사용자의 요청은 리소스에 도달하기 전에 거부됩니다.

| 변수 | 설명 | 기본값 |
| --- | --- | --- |
| `LANGFLOW_​EXTERNAL_​AUTH_​ACCESS_​CEILING_​ENABLED` | 외부 사용자에 대한 클레임 기반 접근 상한을 활성화합니다. | `false` |
| `LANGFLOW_​EXTERNAL_​AUTH_​ACCESS_​CLAIM` | 접근 수준을 도출할 JWT 클레임 이름. | *(없음)* |
| `LANGFLOW_​EXTERNAL_​AUTH_​ACCESS_​CLAIM_​MAPPING` | 외부 클레임 값을 `viewer`, `editor`, `admin`에 매핑하는 JSON 객체 또는 쉼표로 구분된 `claim_​value:level` 쌍. 이 값이 설정되면 우선 적용되며 — 매핑에 없는 값은 내장 별칭으로 해석되지 않고 기본 수준으로 대체됩니다. | *(없음)* |
| `LANGFLOW_​EXTERNAL_​AUTH_​DEFAULT_​ACCESS_​LEVEL` | 접근 클레임이 없거나 매핑되지 않은 경우 사용되는 대체 수준. | `viewer` |
| `LANGFLOW_​EXTERNAL_​AUTH_​DISABLE_​API_​KEYS_​FOR_​EXTERNAL_​USERS` | 외부 공급자를 통해 프로비저닝된 사용자에 대해 Langflow API 키 인증을 거부하여, API 키가 JWT 클레임 상한을 우회하지 못하도록 합니다. | `true` |

**내장 접근 수준 별칭** (명시적 매핑이 구성되지 않은 경우 사용):

| 클레임 값 | 매핑 대상 |
| --- | --- |
| `view`, `viewer`, `read`, `readonly`, `read_​only`, `read-only` | `viewer` |
| `edit`, `editor`, `write`, `developer` | `editor` |
| `admin`, `administrator` | `admin` |

**매핑 예시:**

```bash
# JSON object  
LANGFLOW_EXTERNAL_AUTH_ACCESS_CLAIM_MAPPING='{"read_access":"viewer","write_access":"editor","superadmin":"admin"}'  

# Comma-separated  
LANGFLOW_EXTERNAL_AUTH_ACCESS_CLAIM_MAPPING="read_access:viewer,write_access:editor,superadmin:admin"  
```

## 사용자 정의 신원 리졸버(identity resolver) 사용[​](#use-a-custom-identity-resolver "Direct link to Use a custom identity resolver")

기본적으로 Langflow는 자격 증명을 JWT로 검증하고 그 결과 클레임을 로컬 신원에 매핑합니다.
`LANGFLOW_EXTERNAL_AUTH_IDENTITY_RESOLVER`를 Python 임포트 경로로 지정하여 이 로직을 사용자 정의 리졸버로 교체할 수 있습니다.

```bash
LANGFLOW_EXTERNAL_AUTH_IDENTITY_RESOLVER="mypackage.auth:MyResolver"  
```

리졸버는 비동기 `resolve(token, auth_settings)` 메서드를 가진 클래스이거나, 동일한 시그니처를 가진 일반 비동기 호출 가능 객체여야 합니다.
`ExternalIdentity` 인스턴스 또는 Langflow가 표준 클레임 설정을 사용해 매핑하는 클레임 딕셔너리 중 하나를 반환해야 합니다.

```python
from langflow.services.auth.external import ExternalIdentity  
from lfx.services.settings.auth import AuthSettings  

class MyResolver:  
    async def resolve(self, token: str, auth_settings: AuthSettings) -> ExternalIdentity:  
        # Validate token against your IdP and return identity  
        return ExternalIdentity(  
            provider="my-idp",  
            subject="user-id-from-idp",  
            username="alice",  
            email="alice@example.com",  
        )  
```

## 예시: OIDC 프록시 설정[​](#example-oidc-proxy-setup "Direct link to Example: OIDC proxy setup")

일반적인 배포에서는 Langflow를 OIDC 인식 리버스 프록시(oauth2-proxy 또는 `auth_request`를 사용하는 Nginx 등) 뒤에 배치합니다.
프록시는 OIDC 토큰을 검증하고 원본 JWT(또는 신원 헤더)를 Langflow로 전달합니다.

```bash
# The proxy forwards the IdP-issued JWT in Authorization  
LANGFLOW_EXTERNAL_AUTH_ENABLED=true  
LANGFLOW_EXTERNAL_AUTH_TOKEN_HEADER=Authorization  

# Validate signatures against the IdP's JWKS  
LANGFLOW_EXTERNAL_AUTH_JWKS_URL=https://idp.example.com/.well-known/jwks.json  
LANGFLOW_EXTERNAL_AUTH_ISSUER=https://idp.example.com  
LANGFLOW_EXTERNAL_AUTH_AUDIENCE=langflow  

# Map the IdP role claim to an access level  
LANGFLOW_EXTERNAL_AUTH_ACCESS_CEILING_ENABLED=true  
LANGFLOW_EXTERNAL_AUTH_ACCESS_CLAIM=role  
LANGFLOW_EXTERNAL_AUTH_ACCESS_CLAIM_MAPPING='{"viewer":"viewer","editor":"editor","admin":"admin"}'  
```

## 예시: 신뢰 기반 프록시 설정[​](#example-trusted-proxy-setup "Direct link to Example: trusted-proxy setup")

Langflow가 인터넷에서 직접 접근할 수 없고 프록시가 이미 토큰을 검증한 경우:

```bash
LANGFLOW_EXTERNAL_AUTH_ENABLED=true  
LANGFLOW_EXTERNAL_AUTH_TRUSTED_JWT_DECODE=true  
LANGFLOW_EXTERNAL_AUTH_TOKEN_HEADER=X-Forwarded-User-Token  
```

## SSO 공급자 통합[​](#sso-provider-integrations "Direct link to SSO provider integrations")

공급자별 전체 SSO(OIDC, SAML, LDAP)는 플러그인(`SSO_ENABLED`, `SSO_PROVIDER`, `SSO_CONFIG_FILE`)으로 제공됩니다.
위의 외부 인증 설정은 SSO 플러그인과 독립적으로 작동하며, OIDC 프록시 뒤에 배포할 때 시작점으로 권장됩니다.
SSO 플러그인에 대한 정보는 Langflow 계정 담당팀에 문의하세요.

## 참고 자료[​](#see-also "Direct link to See also")

- [API 키와 인증 — JWT 토큰 서명 구성](https://docs.langflow.org/api-keys-and-authentication#configure-jwt-token-signing)
- [API 키와 인증](https://docs.langflow.org/api-keys-and-authentication)
- [권한 부여](https://docs.langflow.org/next/authorization)
- [보안](https://docs.langflow.org/security)
