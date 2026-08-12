# API 키 및 인증

> **경고**
>
> 적절한 보안 조치 없이 Langflow 포트를 인터넷에 직접 노출하지 마세요.
> `LANGFLOW_AUTO_LOGIN=False`로 설정하고, 기본값이 아닌 `LANGFLOW_SECRET_KEY`를 사용하며, 인증이 활성화된 리버스 프록시 뒤에 Langflow 서버를 배포하세요.

인증 자격증명은 Langflow 서버, 플로우, 컴포넌트를 통해 연결된 서비스에 대한 무단 접근을 방지하는 데 도움이 됩니다.

Langflow에서 사용하는 세 가지 유형의 자격증명이 있습니다:

- [Langflow API 키](#langflow-api-키) — Langflow API 인증 및 플로우 실행, 파일 업로드 등 서버 사이드 Langflow 작업 승인용
- [컴포넌트 API 키](#컴포넌트-api-키) — 모델 제공자나 서드파티 API 등 컴포넌트를 통해 연결된 서비스와 Langflow 간의 인증용
- [인증 환경 변수](#인증-환경-변수) — Langflow가 사용자 인증 및 권한 부여를 처리하는 방식 구성용

---

## Langflow API 키

Langflow API 키를 사용하여 Langflow와 프로그래밍 방식으로 상호작용할 수 있습니다.

기본적으로 `/v1/run/$FLOW_ID`와 같은 대부분의 Langflow API 엔드포인트는 Langflow API 키를 사용한 인증이 필요합니다.

### Langflow API 키 권한

Langflow API 키는 생성한 사용자의 권한을 상속합니다.
즉, 생성한 API 키는 사용자와 동일한 권한을 가지며, 플로우, 컴포넌트, Langflow 데이터베이스에 대한 접근을 포함합니다.

### Langflow API 키 만들기

**Langflow Settings에서:**

1. Langflow 헤더에서 프로필 아이콘을 클릭하고 **Settings**를 선택합니다.
2. **Langflow API Keys**를 클릭하고 **Add New**를 클릭합니다.
3. 키 이름을 지정하고 **Create API Key**를 클릭합니다.
4. API 키를 복사하여 안전하게 저장합니다.

### Langflow API 키 사용

Langflow API 요청을 인증하려면 `x-api-key` 헤더 또는 쿼리 파라미터로 API 키를 전달합니다.

**HTTP 헤더 방식:**

```bash
curl -X POST \
  "http://$LANGFLOW_SERVER_ADDRESS/api/v1/run/$FLOW_ID?stream=false" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $LANGFLOW_API_KEY" \
  -d '{"inputs": {"text":""}, "tweaks": {}}'
```

**쿼리 파라미터 방식:**

```bash
curl -X POST \
  "http://$LANGFLOW_SERVER_ADDRESS/api/v1/run/$FLOW_ID?x-api-key=$LANGFLOW_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"inputs": {"text":""}, "tweaks": {}}'
```

### API 키 사용 추적

기본적으로 Langflow는 `total_uses` 및 `last_used_at` 레코드를 통해 API 키 사용을 추적합니다.

API 키 추적을 비활성화하려면 [Langflow 환경 변수](./environment-variables.md)에서 `LANGFLOW_DISABLE_TRACK_APIKEY_USAGE=True`로 설정합니다.

### API 키 취소

1. Langflow 헤더에서 프로필 아이콘을 클릭하고 **Settings**를 선택합니다.
2. **Langflow API Keys**를 클릭합니다.
3. 삭제할 키를 선택하고 **Delete**를 클릭합니다.

---

## 컴포넌트 API 키

컴포넌트 API 키는 플로우의 컴포넌트가 호출하는 외부 서비스(예: 모델 제공자, 데이터베이스, 서드파티 API)에 대한 접근을 승인합니다.

Langflow에서 컴포넌트 API 키를 **Settings**의 전역 변수에 저장하거나 런타임 환경에서 가져올 수 있습니다.
자세한 내용은 [전역 변수](./global-variables.md)를 참조하세요.

---

## 인증 환경 변수

### LANGFLOW_AUTO_LOGIN

이 변수는 비주얼 에디터, API, Langflow CLI를 포함한 Langflow 서버 접근에 인증이 필요한지를 제어합니다:

- `LANGFLOW_AUTO_LOGIN=False`: 자동 로그인이 비활성화됩니다. 사용자는 비주얼 에디터에 로그인하고 Langflow API 요청에 API 키를 사용해야 합니다.
- `LANGFLOW_AUTO_LOGIN=True` (기본값): 모든 API 요청은 API 키 인증이 필요하지만, 비주얼 에디터는 모든 사용자를 슈퍼유저로 자동 로그인합니다.

### LANGFLOW_ENABLE_SUPERUSER_CLI

Langflow CLI에서 `langflow superuser` 명령어의 가용성을 제어합니다. 기본값은 `true`이지만 무제한 슈퍼유저 생성을 방지하기 위해 `false`를 권장합니다.

### LANGFLOW_SUPERUSER 및 LANGFLOW_SUPERUSER_PASSWORD

Langflow 서버의 슈퍼유저에 대한 사용자 이름과 비밀번호를 지정합니다.

```bash
LANGFLOW_SUPERUSER=administrator
LANGFLOW_SUPERUSER_PASSWORD=securepassword
```

`LANGFLOW_AUTO_LOGIN=False`인 경우 필수입니다.

### LANGFLOW_SECRET_KEY

API 키 등 민감한 데이터 암호화와 HS256 알고리즘 사용 시 JWT 서명에 사용되는 비밀 키를 저장합니다.

비밀 키 생성 방법:

**macOS:**
```bash
python3 -c "from secrets import token_urlsafe; print(f'LANGFLOW_SECRET_KEY={token_urlsafe(32)}')" | pbcopy
```

**Linux:**
```bash
python3 -c "from secrets import token_urlsafe; print(f'LANGFLOW_SECRET_KEY={token_urlsafe(32)}')" | xclip -selection clipboard
```

`.env` 파일에 값을 붙여넣습니다:
```bash
LANGFLOW_SECRET_KEY=dBuu...2kM2_fb
```

### LANGFLOW_NEW_USER_IS_ACTIVE

`LANGFLOW_NEW_USER_IS_ACTIVE=False` (기본값): 슈퍼유저가 만든 계정은 기본적으로 비활성화됩니다.
`LANGFLOW_NEW_USER_IS_ACTIVE=True`: 슈퍼유저가 만든 계정이 자동으로 활성화됩니다.

### LANGFLOW_API_KEY_SOURCE

Langflow가 API 키를 검증하는 방식을 제어합니다.

| 값 | 설명 |
|----|------|
| `db` (기본값) | 데이터베이스에 저장된 Langflow API 키에 대해 검증합니다. |
| `env` | `LANGFLOW_API_KEY` 환경 변수에 대해 검증합니다. Kubernetes 배포, CI/CD 파이프라인 등에 유용합니다. |

### LANGFLOW_CORS_* 

CORS 구성 변수:

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `LANGFLOW_CORS_ALLOW_CREDENTIALS` | `True` | CORS 요청에서 쿠키, 인증 헤더 등 자격증명 허용 여부 |
| `LANGFLOW_CORS_ALLOW_HEADERS` | `*` | 허용된 CORS 요청 헤더 |
| `LANGFLOW_CORS_ALLOW_METHODS` | `*` | 허용된 HTTP 메서드 |
| `LANGFLOW_CORS_ORIGINS` | `*` | 허용된 CORS 오리진 |

> **위험**: 기본 CORS 설정은 프로덕션 환경에서 보안 위험이 될 수 있습니다. 프로덕션 배포에서는 `LANGFLOW_CORS_ORIGINS`에 정확한 오리진을 지정하세요.

### SSRF 보호

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `LANGFLOW_SSRF_PROTECTION_ENABLED` | `False` | **API Request** 컴포넌트의 SSRF 보호 활성화 |
| `LANGFLOW_SSRF_ALLOWED_HOSTS` | 미설정 | SSRF 보호 검사를 우회할 수 있는 허용된 호스트 목록 |

### 로그인 속도 제한

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `LANGFLOW_RATE_LIMIT_PER_MINUTE` | `5` | 단일 IP 주소에서 분당 허용되는 최대 로그인 시도 횟수 |
| `LANGFLOW_RATE_LIMIT_STORAGE_URI` | `memory://` | 속도 제한 카운터의 저장 백엔드 |
| `LANGFLOW_RATE_LIMIT_TRUST_PROXY` | `False` | `true`이면 직접 연결 IP 대신 `X-Forwarded-For` 헤더 항목에서 클라이언트 IP를 읽습니다 |

### LANGFLOW_WEBHOOK_AUTH_ENABLE

웹훅 엔드포인트에 API 키 인증이 필요한지를 제어합니다.

| 값 | 설명 |
|----|------|
| `True` (기본값) | 웹훅 엔드포인트는 API 키 인증을 요구합니다 |
| `False` | 웹훅 엔드포인트에 인증이 필요하지 않습니다 (신뢰할 수 있는 환경에서만 사용) |

---

## 인증이 활성화된 Langflow 서버 시작

### 서버 시작

1. 다음 변수로 `.env` 파일을 만듭니다:

```bash
LANGFLOW_AUTO_LOGIN=False
LANGFLOW_SUPERUSER=
LANGFLOW_SUPERUSER_PASSWORD=
LANGFLOW_SECRET_KEY=
LANGFLOW_NEW_USER_IS_ACTIVE=False
LANGFLOW_ENABLE_SUPERUSER_CLI=False
```

2. 자격증명을 설정합니다:

```bash
LANGFLOW_AUTO_LOGIN=False
LANGFLOW_SUPERUSER=administrator
LANGFLOW_SUPERUSER_PASSWORD=securepassword
LANGFLOW_SECRET_KEY=dBuu...2kM2_fb
LANGFLOW_NEW_USER_IS_ACTIVE=False
LANGFLOW_ENABLE_SUPERUSER_CLI=False
```

3. `.env` 파일 구성으로 Langflow를 시작합니다:

```bash
uv run langflow run --env-file .env
```

4. 서버가 실행 중인지 확인합니다. 기본 위치는 `http://localhost:7860`입니다.

### 관리자로서 사용자 관리

1. `http://localhost:7860/login`으로 이동하여 슈퍼유저로 처음 로그인합니다.

2. `.env`에 설정한 슈퍼유저 자격증명으로 로그인합니다.

3. 서버의 사용자를 관리하려면 `/admin`(예: `http://localhost:7860/admin`)으로 이동합니다.

4. 사용자를 추가하려면 **New User**를 클릭하고 사용자 계정 양식을 작성합니다.

---

## 참고 항목

- [Langflow 환경 변수](./environment-variables.md)
- [Langflow 보안 정책](https://github.com/langflow-ai/langflow/blob/main/SECURITY.md)

---

*원문: https://docs.langflow.org/next/api-keys-and-authentication*
