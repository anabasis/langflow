# JWT 인증

Langflow는 사용자 인증 및 권한 부여를 위해 대칭 또는 비대칭 JSON Web Token(JWT)을 지원합니다.

JWT는 JSON 객체로 당사자 간에 정보를 안전하게 전송하기 위한 [오픈 표준](https://tools.ietf.org/html/rfc7519)입니다. JWT를 사용하면 자동으로 만료되는 자격증명을 만들고, 데이터베이스 저장 없이 상태 없는 인증을 활성화하고, 분산 시스템 전반에서 작동할 수 있습니다.

HS256 알고리즘을 사용한 JWT 인증은 기본적으로 활성화되어 있지만 `LANGFLOW_ALGORITHM` 환경 변수로 더 구성할 수 있습니다.

**JWT 구조 및 내용**

사용자가 `/api/v1/login` 엔드포인트에서 사용자 이름과 비밀번호로 로그인하면 Langflow는 자격증명을 검증하고 사용자 신원과 만료 시간이 포함된 JWT 토큰을 생성합니다. 이 토큰은 이후 API 요청에서 각 요청마다 자격증명을 보내는 대신 사용됩니다.

JWT는 점(`.`)으로 구분된 세 부분으로 구성됩니다:
- **헤더**: 토큰 유형과 서명 알고리즘
- **페이로드**: 사용자 정보 및 만료 시간에 대한 토큰 데이터인 *클레임*
- **서명**: 토큰이 변조되지 않았음을 보장하는 비밀 키

각 부분은 Base64URL로 인코딩됩니다.

---

## JWT 환경 변수 구성

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `LANGFLOW_ALGORITHM` | JWT 서명 알고리즘 (`HS256`, `RS256`, 또는 `RS512`) | `HS256` |
| `LANGFLOW_SECRET_KEY` | HS256 서명용 비밀 키 | 자동 생성 |
| `LANGFLOW_PRIVATE_KEY` | RS256/RS512 서명용 RSA 개인 키 | 자동 생성 |
| `LANGFLOW_PUBLIC_KEY` | RS256/RS512 검증용 RSA 공개 키 | 개인 키에서 파생 |
| `LANGFLOW_ACCESS_TOKEN_EXPIRE_SECONDS` | 액세스 토큰 만료 시간 | `3600` (1시간) |
| `LANGFLOW_REFRESH_TOKEN_EXPIRE_SECONDS` | 갱신 토큰 만료 시간 | `604800` (7일) |

---

## 서명 알고리즘 구성

Langflow는 여러 서명 알고리즘과 대칭(HS256) 및 비대칭(RS256, RS512) JWT를 모두 지원합니다.

### HS256 (기본값)

HS256은 기본 JWT 알고리즘으로, 단일 서버 배포에 적합한 보안 수준을 제공합니다. Langflow는 자동으로 비밀 키를 생성하고 유지합니다.

커스텀 보안 키를 생성하려면:

```bash
# Python 사용
python -c "import secrets; print(secrets.token_urlsafe(32))"

# OpenSSL 사용
openssl rand -base64 32
```

`.env` 파일에 설정:

```
LANGFLOW_ALGORITHM="HS256"
LANGFLOW_SECRET_KEY="your-custom-secret-key"
```

### RS256

RS256 서명 알고리즘은 개인 키와 공개 키 쌍을 사용하여 프로덕션 배포에 더 나은 보안을 제공합니다.

`LANGFLOW_ALGORITHM="RS256"`을 Langflow `.env`에 설정하면 Langflow가 시작할 때 자동으로 키를 생성합니다.

수동으로 RSA 키 쌍을 생성하려면:

```bash
# 2048비트 개인 키 생성
openssl genrsa -out private_key.pem 2048

# 개인 키에서 공개 키 추출
openssl rsa -in private_key.pem -pubout -out public_key.pem
```

커스텀 키 쌍 사용:

```
LANGFLOW_ALGORITHM=RS256
LANGFLOW_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEF...
-----END PRIVATE KEY-----"
LANGFLOW_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOC...
-----END PUBLIC KEY-----"
```

### RS512

RS512는 RS256과 동일한 RSA 형식의 개인 키 및 공개 키를 사용하지만 더 높은 보안을 위해 SHA-512 해싱 알고리즘을 사용합니다.

---

## Docker 및 Kubernetes 배포 구성

### Docker with HS256

```yaml
version: "3.8"
services:
  langflow:
    image: langflowai/langflow:latest
    environment:
      - LANGFLOW_ALGORITHM=HS256
      - LANGFLOW_SECRET_KEY=${JWT_SECRET_KEY}
    volumes:
      - langflow_data:/app/langflow

volumes:
  langflow_data:
```

### Docker with RS256

자동 생성 키 쌍 사용:

```yaml
version: "3.8"
services:
  langflow:
    image: langflowai/langflow:latest
    environment:
      - LANGFLOW_ALGORITHM=RS256
    volumes:
      - langflow_data:/app/langflow

volumes:
  langflow_data:
```

기존 키 쌍 마운트:

```yaml
version: "3.8"
services:
  langflow:
    image: langflowai/langflow:latest
    environment:
      - LANGFLOW_ALGORITHM=RS256
    volumes:
      - ./keys/private_key.pem:/app/langflow/private_key.pem:ro
      - ./keys/public_key.pem:/app/langflow/public_key.pem:ro
      - langflow_data:/app/langflow

volumes:
  langflow_data:
```

### Kubernetes with RS256

```yaml
# jwt-secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: langflow-jwt-keys
type: Opaque
stringData:
  algorithm: "RS256"
  private-key: |
    -----BEGIN PRIVATE KEY-----
    MIIEvgIBADANBgkqhkiG9w0BAQEF...
    -----END PRIVATE KEY-----
  public-key: |
    -----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOC...
    -----END PUBLIC KEY-----
```

---

## 토큰 만료 구성

```
LANGFLOW_ACCESS_TOKEN_EXPIRE_SECONDS=3600   # 1시간
LANGFLOW_REFRESH_TOKEN_EXPIRE_SECONDS=604800  # 7일
```

액세스 토큰은 API 요청을 인증하며 일반적으로 15분에서 1시간 내에 만료됩니다.

갱신 토큰은 사용자가 다시 로그인하지 않고도 새 액세스 토큰을 얻는 데 사용됩니다. 일반적으로 7일에서 30일 내에 만료됩니다.

액세스 토큰이 만료되면 클라이언트는 갱신 토큰을 사용하여 `/api/v1/refresh` 엔드포인트에서 새 액세스 토큰을 가져올 수 있습니다.

---

## 참고 항목

- [Langflow API 키 및 인증](./api-keys-and-authentication.md)
- [JWT.io](https://jwt.io/)
- [RFC 7519 사양](https://tools.ietf.org/html/rfc7519)

---

*원문: https://docs.langflow.org/next/jwt-authentication*
