# API 키와 인증

> 원문: https://docs.langflow.org/next/api-keys-and-authentication

warning

Langflow 포트를 적절한 보안 조치 없이 인터넷에 직접 노출하지 마세요.
`LANGFLOW_AUTO_LOGIN=False`를 설정하고, 기본값이 아닌 `LANGFLOW_SECRET_KEY`를 사용하며, 인증이 활성화된 리버스 프록시 뒤에 Langflow 서버를 배포하세요.
자세한 내용은 [인증이 활성화된 Langflow 서버 시작하기](#start-a-langflow-server-with-authentication-enabled)를 참조하세요.

인증 자격 증명은 Langflow 서버, 플로우, 그리고 컴포넌트를 통해 연결된 서비스에 대한 무단 접근을 방지하는 데 도움이 됩니다.

Langflow에서 사용하는 자격 증명에는 세 가지 유형이 있습니다.

- [Langflow API 키](#langflow-api-keys): Langflow API 인증과 플로우 실행, 파일 업로드 등 서버 측 Langflow 작업을 승인하는 데 사용됩니다.
- [컴포넌트 API 키](#component-api-keys): Langflow와 컴포넌트를 통해 연결된 서비스(모델 제공자나 서드파티 API 등) 간의 인증에 사용됩니다.
- [인증 환경 변수](#authentication-environment-variables): 이 환경 변수들은 Langflow가 사용자 인증과 권한 부여를 처리하는 방식을 구성합니다.

## Langflow API 키[​](#langflow-api-keys "Direct link to Langflow API keys")

Langflow API 키를 사용하여 프로그래밍 방식으로 Langflow와 상호작용할 수 있습니다.

기본적으로 `/v1/run/$FLOW_ID`와 같은 대부분의 Langflow API 엔드포인트는 Langflow API 키를 통한 인증이 필요합니다.

Langflow는 기본적으로 데이터베이스에 저장된 키에 대해 API 키를 검증하지만, 환경 변수에 대해 API 키를 검증하도록 Langflow를 구성할 수도 있습니다.
자세한 내용은 [`LANGFLOW_API_KEY_SOURCE`](#langflow-api-key-source)를 참조하세요.

웹훅 엔드포인트는 기본적으로 API 키 인증을 필요로 합니다. 웹훅 엔드포인트에 대한 인증을 비활성화하려면 [`LANGFLOW_WEBHOOK_AUTH_ENABLE`](https://docs.langflow.org/webhook#require-authentication-for-webhooks) 환경 변수를 사용하세요.
Langflow MCP 서버에 대한 인증을 구성하려면 [Langflow를 MCP 서버로 사용하기](https://docs.langflow.org/mcp-server)를 참조하세요.

### Langflow API 키 권한[​](#langflow-api-key-permissions "Direct link to Langflow API key permissions")

Langflow API 키는 이를 생성한 사용자의 권한을 그대로 갖습니다.
즉, 사용자가 생성한 API 키는 사용자 본인과 동일한 권한과 접근 범위를 가지며, 여기에는 사용자의 플로우, 컴포넌트, Langflow 데이터베이스에 대한 접근도 포함됩니다.
Langflow API 키는 자신의 Langflow 서버 외부의 리소스에 접근하는 데 사용할 수 없습니다.

단일 사용자 환경에서는 항상 슈퍼유저이며, Langflow API 키도 항상 슈퍼유저 권한을 갖습니다.

다중 사용자 환경에서는 슈퍼유저가 아닌 사용자는 자신의 API 키를 사용하여 다른 사용자의 리소스에 접근할 수 없습니다.
슈퍼유저는 자신의 플로우만 실행할 수 있으며, 다른 사용자가 소유한 플로우를 실행할 수 없습니다.
슈퍼유저가 사용자를 관리하고 슈퍼유저가 아닌 계정을 생성할 수 있도록 하려면 [인증이 활성화된 상태로 Langflow 서버를 시작](#start-a-langflow-server-with-authentication-enabled)해야 합니다.

### Langflow API 키 생성[​](#create-a-langflow-api-key "Direct link to Create a Langflow API key")

Langflow **설정**에서 또는 Langflow CLI를 사용하여 Langflow API 키를 생성할 수 있습니다.

Langflow 서버가 `--backend-only` 모드로 실행 중인 경우에는 CLI 방식이 필수입니다.

- Langflow 설정
- Langflow CLI

1. Langflow 헤더에서 프로필 아이콘을 클릭한 다음 **Settings**를 선택합니다.
2. **Langflow API Keys**를 클릭한 다음 **Add New**를 클릭합니다.
3. 키 이름을 지정한 다음 **Create API Key**를 클릭합니다.
4. API 키를 복사하여 안전하게 보관합니다.

Langflow CLI로 생성한 모든 API 키는 슈퍼유저 권한을 가집니다. 이 명령어는 슈퍼유저 인증을 요구하며, Langflow API 키는 이를 생성한 사용자의 권한을 그대로 갖기 때문입니다.

### Langflow API 키 사용[​](#use-a-langflow-api-key "Direct link to Use a Langflow API key")

Langflow API 요청을 인증하려면, Langflow API 키를 `x-api-key` 헤더 또는 쿼리 파라미터로 전달하세요.

- HTTP 헤더
- 쿼리 파라미터

```
curl -X POST \
  "http://$LANGFLOW_SERVER_ADDRESS/api/v1/run/$FLOW_ID?stream=false" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $LANGFLOW_API_KEY" \
  -d '{"inputs": {"text":""}, "tweaks": {}}'
```

```
"http://$LANGFLOW_SERVER_ADDRESS/api/v1/run/$FLOW_ID?x-api-key=$LANGFLOW_API_KEY" \
-H "Content-Type: application/json" \
-d '{"inputs": {"text":""}, "tweaks": {}}'
```

Langflow API 요청을 구성하는 방법에 대한 자세한 내용은 [Langflow API 시작하기](https://docs.langflow.org/api-reference-api-examples)와 [Langflow API로 플로우 트리거하기](https://docs.langflow.org/concepts-publish)를 참조하세요.

### API 키 사용 추적[​](#track-api-key-usage "Direct link to Track API key usage")

기본적으로 Langflow는 [Langflow 데이터베이스](https://docs.langflow.org/memory)에서 `total_uses` 및 `last_used_at` 기록을 통해 API 키 사용을 추적합니다.

API 키 추적을 비활성화하려면, [Langflow 환경 변수](https://docs.langflow.org/environment-variables)에서 `LANGFLOW_DISABLE_TRACK_APIKEY_USAGE=True`를 설정하세요.
이는 동시성이 높은 기간 동안 데이터베이스 경합을 피하는 데 도움이 될 수 있습니다.

### API 키 폐기[​](#revoke-an-api-key "Direct link to Revoke an API key")

API 키를 폐기하고 삭제하려면 다음을 수행하세요.

1. Langflow 헤더에서 프로필 아이콘을 클릭한 다음 **Settings**를 선택합니다.
2. **Langflow API Keys**를 클릭합니다.
3. 삭제하려는 키를 선택한 다음 **Delete**를 클릭합니다.

이 작업은 즉시 해당 키를 무효화하여 다시 사용할 수 없도록 합니다.

## 컴포넌트 API 키[​](#component-api-keys "Direct link to Component API keys")

컴포넌트 API 키는 플로우 안의 컴포넌트가 호출하는 외부 서비스(모델 제공자, 데이터베이스, 서드파티 API 등)에 대한 접근을 승인합니다.
이는 Langflow API 키나 일반적인 애플리케이션 자격 증명이 아닙니다.

Langflow에서는 컴포넌트 API 키를 **설정**의 전역 변수로 저장하거나 런타임 환경에서 가져올 수 있습니다.
자세한 내용은 [전역 변수](https://docs.langflow.org/configuration-global-variables)를 참조하세요.

컴포넌트 API 키는 서비스 제공자의 플랫폼 내에서 직접 생성하고 관리합니다.
Langflow는 암호화된 키 값이나 다른 곳에 저장된 키에 대한 안전한 참조만 저장할 뿐, 실제 자격 증명을 원본에서 관리하지 않습니다.
즉, Langflow에서 전역 변수를 삭제해도 서비스 제공자 시스템에 있는 실제 API 키는 삭제되거나 무효화되지 않습니다.
컴포넌트 API 키는 서비스 제공자의 인터페이스나 API를 통해 직접 삭제하거나 교체해야 합니다.

추가 보안을 위해 `LANGFLOW_REMOVE_API_KEYS=True`를 설정하면 [Langflow 데이터베이스](https://docs.langflow.org/memory)의 플로우 데이터에서 API 키와 토큰을 생략할 수 있습니다.
또한 [플로우를 내보낼 때](https://docs.langflow.org/concepts-flows-import), 내보낸 플로우 JSON에서 API 키를 생략하도록 선택할 수 있습니다.

## 인증 환경 변수[​](#authentication-environment-variables "Direct link to Authentication environment variables")

이 섹션에서는 사용 가능한 인증 구성 변수를 설명합니다.

Langflow 저장소의 [`.env.example`](https://github.com/langflow-ai/langflow/blob/main/.env.example) 파일을 자신의 `.env` 파일 템플릿으로 사용할 수 있습니다.

알고리즘 선택 및 키 관리를 포함한 JWT 인증 구성에 대해서는 [JWT 인증](https://docs.langflow.org/jwt-authentication)을 참조하세요.

### LANGFLOW_AUTO_LOGIN[​](#langflow-auto-login "Direct link to LANGFLOW_AUTO_LOGIN")

이 변수는 시각적 편집기, API, Langflow CLI를 포함하여 Langflow 서버에 접근하는 데 인증이 필요한지 여부를 제어합니다.

- `LANGFLOW_AUTO_LOGIN=False`인 경우 자동 로그인이 비활성화됩니다. 사용자는 시각적 편집기에 로그인해야 하고, 특정 Langflow CLI 명령을 실행하려면 슈퍼유저로 인증해야 하며, Langflow API 요청에는 Langflow API 키를 사용해야 합니다.
  `false`인 경우, Langflow 팀은 안전하지 않은 기본값을 사용하지 않도록 [`LANGFLOW_SUPERUSER`와 `LANGFLOW_SUPERUSER_PASSWORD`](#langflow-superuser)도 명시적으로 설정할 것을 권장합니다.

- `LANGFLOW_AUTO_LOGIN=True`(기본값)인 경우, 모든 API 요청은 Langflow API 키로 인증해야 하지만, 시각적 편집기는 모든 사용자를 자동으로 슈퍼유저로 로그인시키며, Langflow는 오직 기본 [슈퍼유저 자격 증명](https://docs.langflow.org/api-keys-and-authentication#langflow-superuser)만 사용합니다.
  모든 사용자는 비밀번호 보호 없이 동일한 시각적 편집기 환경에 접근하며, 슈퍼유저로서 모든 Langflow CLI 명령을 실행할 수 있고, Langflow는 사용자의 슈퍼유저 권한을 기반으로 백엔드와 프런트엔드 사이의 내부 요청을 자동으로 인증합니다.
  다른 우회된 인증에 더해 Langflow API 요청에 대한 인증도 우회하고 싶다면 [`LANGFLOW_SKIP_AUTH_AUTO_LOGIN`](https://docs.langflow.org/api-keys-and-authentication#langflow-skip-auth-auto-login)을 참조하세요.

Langflow는 여러 사용자가 동일한 플로우를 실시간으로 동시 편집하는 것을 허용하지 않습니다.
두 사용자가 동일한 플로우를 편집하는 경우, Langflow는 해당 사용자의 [워크스페이스](https://docs.langflow.org/concepts-overview#workspace) 상태를 기준으로 가장 최근에 편집한 사용자의 작업만 저장합니다. 그 사이에 다른 사용자가 수행한 변경 사항은 덮어쓰여집니다.

#### 기본 인증 강제 적용과 LANGFLOW_SKIP_AUTH_AUTO_LOGIN[​](#langflow-skip-auth-auto-login "Direct link to Default authentication enforcement and LANGFLOW_SKIP_AUTH_AUTO_LOGIN")

Langflow 버전 1.6에서 기본 설정은 `LANGFLOW_AUTO_LOGIN=True`와 `LANGFLOW_SKIP_AUTH_AUTO_LOGIN=False`입니다.
이는 앞에서 설명한 대로 API 요청에 대해서만 인증을 강제합니다.

임시 하위 호환성을 위해, 두 변수를 모두 `true`로 설정하여 이전 버전의 완전히 인증되지 않은 동작으로 되돌릴 수 있습니다.
그러나 향후 릴리스에서는 `LANGFLOW_AUTO_LOGIN=False`를 기본값으로 설정하고 `LANGFLOW_SKIP_AUTH_AUTO_LOGIN`을 제거할 예정입니다.
그 시점부터 Langflow는 API 요청에 대해 API 키 인증을 엄격하게 강제하며, 시각적 편집기와 같은 일부 기능에 대한 인증은 `LANGFLOW_AUTO_LOGIN=True`를 설정하여 수동으로 비활성화할 수 있습니다.

**이전 버전의 인증 강제 적용**

Langflow 버전 1.5는 `LANGFLOW_AUTO_LOGIN` 값과 관계없이 Langflow API 요청에 대해 인증을 강제할 수 있었던 첫 번째 버전입니다.
하위 호환성을 위한 임시 우회 수단으로, 이 버전에서는 `LANGFLOW_SKIP_AUTH_AUTO_LOGIN` 환경 변수를 추가했고 두 변수를 기본적으로 `true`로 설정하여 이전 버전의 완전히 인증되지 않은 동작을 유지했습니다.
이를 통해 사용자는 인증 동작의 변경 없이 버전 1.5로 업그레이드할 수 있었습니다.

1.5보다 이전 버전의 Langflow에서는 Langflow API 요청에 인증이 필요하지 않았습니다.
또한 `LANGFLOW_AUTO_LOGIN=True`라는 기본 설정은 시각적 편집기에서 모든 사용자에게 자동으로 슈퍼유저 권한을 부여했으며, 모든 사용자가 모든 Langflow CLI 명령을 슈퍼유저로 실행할 수 있도록 허용했습니다.

### LANGFLOW_ENABLE_SUPERUSER_CLI[​](#langflow-enable-superuser-cli "Direct link to LANGFLOW_ENABLE_SUPERUSER_CLI")

Langflow CLI에서 `langflow superuser` 명령의 사용 가능 여부를 제어합니다.
기본값은 `true`이지만, 무제한 슈퍼유저 생성을 방지하기 위해 `false`를 권장합니다.
자세한 내용은 [`langflow superuser`](https://docs.langflow.org/configuration-cli#langflow-superuser)를 참조하세요.

### LANGFLOW_SUPERUSER 및 LANGFLOW_SUPERUSER_PASSWORD[​](#langflow-superuser "Direct link to LANGFLOW_SUPERUSER and LANGFLOW_SUPERUSER_PASSWORD")

이 변수들은 Langflow 서버의 슈퍼유저에 대한 사용자 이름과 비밀번호를 지정합니다.

```
LANGFLOW_SUPERUSER=administrator
LANGFLOW_SUPERUSER_PASSWORD=securepassword
```

`LANGFLOW_AUTO_LOGIN=False`인 경우 이 변수들이 필수입니다.
그렇지 않은 경우에는 관련이 없습니다.

[인증이 활성화된 상태로 Langflow 서버를 시작](#start-a-langflow-server-with-authentication-enabled)할 때, 이 변수들이 필수이지만 설정되지 *않은* 경우, Langflow는 기본값인 `langflow`와 `langflow`를 사용합니다.
이 기본값은 Langflow CLI 명령인 [`langflow superuser`](https://docs.langflow.org/configuration-cli#langflow-superuser)에는 적용되지 않습니다.

### LANGFLOW_SECRET_KEY[​](#langflow-secret-key "Direct link to LANGFLOW_SECRET_KEY")

이 환경 변수는 API 키와 같은 민감한 데이터를 암호화하고 HS256 알고리즘 사용 시 JWT 서명을 위한 비밀 키를 저장합니다.
Langflow는 비밀 키 암호화에 [Fernet](https://pypi.org/project/cryptography/) 라이브러리를 사용합니다.
JWT 관련 구성에 대해서는 [JWT 인증](https://docs.langflow.org/jwt-authentication)을 참조하세요.

비밀 키가 제공되지 않으면 Langflow가 자동으로 하나를 생성합니다.

그러나 프로덕션 환경에서는 자체 키를 생성하여 명시적으로 설정해야 합니다.
이는 Kubernetes와 같은 다중 인스턴스 배포에서 인스턴스 전반에 걸쳐 일관된 암호화를 보장하는 데 특히 중요합니다.

`LANGFLOW_SECRET_KEY`용 비밀 암호화 키를 생성하려면 다음을 수행하세요.

1. 비밀 키를 생성하여 클립보드에 복사하는 명령을 실행합니다.

  - macOS 또는 Linux
  - Windows

  - **macOS**: 비밀 키를 생성하여 클립보드에 복사합니다.

    ```
    python3 -c "from secrets import token_urlsafe; print(f'LANGFLOW_SECRET_KEY={token_urlsafe(32)}')" | pbcopy
    ```

  - **Linux**: 비밀 키를 생성하여 클립보드에 복사합니다.

    ```
    python3 -c "from secrets import token_urlsafe; print(f'LANGFLOW_SECRET_KEY={token_urlsafe(32)}')" | xclip -selection clipboard
    ```

  - **Unix**: 비밀 키를 생성하여 터미널에 출력하고 직접 복사합니다.

    ```
    python3 -c "from secrets import token_urlsafe; print(f'LANGFLOW_SECRET_KEY={token_urlsafe(32)}')"
    ```

- 비밀 키를 생성하여 터미널에 출력하고 직접 복사합니다.

  ```
  # Or just print
  python -c "from secrets import token_urlsafe; print(f'LANGFLOW_SECRET_KEY={token_urlsafe(32)}')"
  ```

- 값을 `.env` 파일에 붙여넣습니다.

  ```
  LANGFLOW_SECRET_KEY=dBuu...2kM2_fb
  ```
  Docker에서 Langflow를 실행하는 경우, `docker-compose.yml` 파일에서 `.env` 파일의 `LANGFLOW_SECRET_KEY`를 다음과 같이 참조하세요.

  ```
  environment:
    - LANGFLOW_SECRET_KEY=${LANGFLOW_SECRET_KEY}
  ```

#### 비밀 키 교체[​](#rotating-the-secret-key "Direct link to Rotate the secret key")

키가 유출되었을 가능성이 있는 경우와 정기적인 자격 증명 관리 관행의 일환으로 `LANGFLOW_SECRET_KEY`를 교체하세요.
Langflow는 저장된 자격 증명과 기타 민감한 데이터를 새 키로 다시 암호화하는 마이그레이션 스크립트를 제공하므로, 접근 권한을 잃지 않고 교체할 수 있습니다.

자세한 내용은 Langflow 보안 정책의 [비밀 키 교체](https://github.com/langflow-ai/langflow/blob/main/SECURITY.md#secret-key-rotation)를 참조하세요.

### LANGFLOW_NEW_USER_IS_ACTIVE[​](#langflow-new-user-is-active "Direct link to LANGFLOW_NEW_USER_IS_ACTIVE")

`LANGFLOW_NEW_USER_IS_ACTIVE=False`(기본값)인 경우, 슈퍼유저가 생성한 계정은 기본적으로 비활성 상태이며 사용자가 시각적 편집기에 로그인하려면 명시적으로 활성화해야 합니다.
슈퍼유저는 필요에 따라 사용자 계정을 비활성화할 수도 있습니다.

`LANGFLOW_NEW_USER_IS_ACTIVE=True`인 경우, 슈퍼유저가 생성한 계정은 자동으로 활성화됩니다.

```
LANGFLOW_NEW_USER_IS_ACTIVE=False
```

Langflow 서버에서는 슈퍼유저만 사용자 계정을 관리할 수 있지만, 사용자 관리는 서버에서 인증이 활성화된 경우에만 의미가 있습니다.
자세한 내용은 [인증이 활성화된 Langflow 서버 시작하기](#start-a-langflow-server-with-authentication-enabled)를 참조하세요.

### LANGFLOW_API_KEY_SOURCE[​](#langflow-api-key-source "Direct link to LANGFLOW_API_KEY_SOURCE")

이 변수는 Langflow가 API 키를 검증하는 방식을 제어합니다.

| 값 | 설명 |
| --- | --- |
| `db` (기본값) | 데이터베이스에 저장된 [Langflow API 키](#langflow-api-keys)에 대해 API 키를 검증합니다. 사용자가 Langflow UI 또는 CLI를 통해 API 키를 생성하고 관리하는 표준 동작입니다. |
| `env` | `LANGFLOW_​API_​KEY` 환경 변수에 대해 API 키를 검증합니다. 데이터베이스 구성 없이 미리 정의된 API 키를 주입하고 싶은 Kubernetes 배포, CI/CD 파이프라인 또는 기타 환경에 유용합니다. |

기본적으로 Langflow는 `LANGFLOW_API_KEY_SOURCE=db`로 Langflow 데이터베이스에 대해 `x-api-key` 헤더를 검증합니다.
데이터베이스 기반 검증을 사용하면 사용자별 권한을 가진 여러 키를 생성하고, 사용량을 추적하며, Langflow UI나 CLI를 통해 키를 관리할 수 있습니다.

`LANGFLOW_API_KEY_SOURCE=env`인 경우, Langflow는 `LANGFLOW_API_KEY` 환경 변수 값에 대해 `x-api-key` 헤더를 검증합니다.
이는 LFX나 Kubernetes 시크릿 같은 상태 비저장(stateless) 환경에서도 Langflow가 안전하게 실행됨을 의미합니다.

`LANGFLOW_API_KEY_SOURCE=env`인 경우, 배포에는 단일 API 키만 사용할 수 있습니다. 모든 인증된 요청은 동일한 API 키를 사용하며, 인증에 성공하면 슈퍼유저 권한이 부여됩니다.
이 모드는 서로 다른 사용자가 서로 다른 접근 수준을 필요로 하는 다중 사용자 환경이 아니라, 단일 테넌트 배포나 자동화된 시스템을 위해 설계되었습니다. 키를 교체하려면 환경 변수를 업데이트하고 Langflow 서버를 재시작하세요.

환경 변수 기반 API 키 검증을 활성화하려면 다음을 수행하세요.

1. Langflow `.env` 파일에서 API 키 소스를 `env`로 설정합니다.

  ```
  LANGFLOW_API_KEY_SOURCE=env
  ```

2. Langflow `.env` 파일에서 API 키 값을 설정합니다.

  ```
  LANGFLOW_API_KEY=your-secure-api-key
  ```

3. 요청에서 API 키를 사용합니다.

  ```
  curl -X POST \
    "http://LANGFLOW_SERVER_ADDRESS/api/v1/run/FLOW_ID?stream=false" \
    -H "Content-Type: application/json" \
    -H "x-api-key: LANGFLOW_API_KEY" \
    -d '{"inputs": {"text":""}, "tweaks": {}}'
  ```
  `LANGFLOW_SERVER_ADDRESS`, `FLOW_ID`, `LANGFLOW_API_KEY`를 배포 환경의 값으로 교체하세요.

**Kubernetes 배포 예시**

Kubernetes 시크릿에서 환경 변수 기반 API 키를 구성하려면 다음을 수행하세요.

1. API 키가 포함된 Kubernetes 시크릿을 생성합니다.

  ```
  apiVersion: v1
  kind: Secret
  metadata:
    name: langflow-api-key
  type: Opaque
  stringData:
    api-key: "YOUR_API_KEY"
  ```
  `YOUR_API_KEY`를 Langflow `.env` 파일의 `LANGFLOW_API_KEY` 값으로 교체하세요.

2. Kubernetes 배포에서 `langflow-api-key` 시크릿을 참조합니다.

  ```
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: langflow
  spec:
    template:
      spec:
        containers:
        - name: langflow
          image: langflowai/langflow:latest
          env:
          - name: LANGFLOW_API_KEY_SOURCE
            value: "env"
          - name: LANGFLOW_API_KEY
            valueFrom:
              secretKeyRef:
                name: langflow-api-key
                key: api-key
  ```

**Docker Compose 예시**

Docker Compose에서 환경 변수 기반 API 키를 구성하려면 다음을 수행하세요.

1. Langflow `.env` 파일에서 API 키를 설정합니다.

  ```
  LANGFLOW_API_KEY=your-secure-api-key
  ```
  `YOUR_API_KEY`를 실제 Langflow API 키 값으로 교체하세요.

2. `docker-compose.yml` 파일을 생성하거나 업데이트하여 `LANGFLOW_API_KEY_SOURCE=env`를 설정하고 `LANGFLOW_API_KEY`를 참조합니다.

  ```
  services:
    langflow:
      image: langflowai/langflow:latest
      environment:
        - LANGFLOW_API_KEY_SOURCE=env
        - LANGFLOW_API_KEY=${LANGFLOW_API_KEY}
      ports:
        - "7860:7860"
  ```

### LANGFLOW_CORS_*[​](#cors-configuration-for-authentication "Direct link to LANGFLOW_CORS_*")

CORS(Cross-Origin Resource Sharing) 구성은 Langflow 프런트엔드와 백엔드가 서로 다른 출처(origin)에서 제공될 때 인증 자격 증명이 처리되는 방식을 제어합니다.
다음 `LANGFLOW_CORS_*` 환경 변수를 사용할 수 있습니다.

| 변수 | 형식 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `LANGFLOW_​CORS_​ALLOW_​CREDENTIALS` | Boolean | `True` | CORS 요청에서 쿠키, Authorization 헤더와 같은 자격 증명을 허용할지 여부. |
| `LANGFLOW_​CORS_​ALLOW_​HEADERS` | List[String] 또는 String | `*` | CORS 요청에서 허용되는 헤더. 쉼표로 구분된 헤더 목록을 제공하거나 모든 헤더를 허용하려면 `*`를 사용하세요. |
| `LANGFLOW_​CORS_​ALLOW_​METHODS` | List[String] 또는 String | `*` | CORS 요청에서 허용되는 HTTP 메서드. 쉼표로 구분된 메서드 목록을 제공하거나 모든 메서드를 허용하려면 `*`를 사용하세요. |
| `LANGFLOW_​CORS_​ORIGINS` | String | `*` | 허용되는 CORS 출처. 쉼표로 구분된 출처 목록을 제공하거나 모든 출처를 허용하려면 `*`를 사용하세요. |

기본 구성은 CORS 자격 증명을 활성화하며, 모든 출처, 헤더, 메서드를 허용하는 와일드카드(`*`)를 사용합니다.

```
LANGFLOW_CORS_ORIGINS=*
LANGFLOW_CORS_ALLOW_CREDENTIALS=True
LANGFLOW_CORS_ALLOW_HEADERS=*
LANGFLOW_CORS_ALLOW_METHODS=*
```

danger

Langflow의 기본 CORS 설정은 프로덕션 환경에서 보안 위험이 될 수 있습니다. 어떤 웹사이트든 Langflow API에 요청을 보낼 수 있고, 인증 쿠키나 Authorization 헤더를 포함한 자격 증명을 교차 출처 요청에 포함할 수 있기 때문입니다.

프로덕션 배포에서는 `LANGFLOW_CORS_ORIGINS`에 정확한 출처를 지정하세요.
필요한 경우 허용할 헤더와 메서드도 지정할 수 있습니다.
예시:

```
LANGFLOW_CORS_ORIGINS=["https://yourdomain.com","https://app.yourdomain.com"]
LANGFLOW_CORS_ALLOW_CREDENTIALS=True
LANGFLOW_CORS_ALLOW_HEADERS=["Content-Type","Authorization"]
LANGFLOW_CORS_ALLOW_METHODS=["GET","POST","PUT"]
```

### SSRF 방지[​](#ssrf-protection "Direct link to SSRF protection")

다음 환경 변수는 [**API Request** 컴포넌트](https://docs.langflow.org/api-request)에 대한 SSRF(Server-Side Request Forgery) 방지를 구성합니다.
SSRF 방지는 사설 IP 대역, 루프백 주소, 클라우드 메타데이터 엔드포인트와 같은 내부 또는 사설 네트워크 리소스에 대한 요청을 차단합니다.

| 변수 | 형식 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `LANGFLOW_​SSRF_​PROTECTION_​ENABLED` | Boolean | `False` | **API Request** 컴포넌트에 대한 SSRF 방지를 활성화합니다. 활성화하면 컴포넌트는 사설 IP 주소로의 요청을 차단합니다. 비활성화하면 요청이 차단되지 않습니다. |
| `LANGFLOW_​SSRF_​ALLOWED_​HOSTS` | List[String] | 설정되지 않음 | SSRF 방지 검사를 우회할 수 있는, 쉼표로 구분된 허용 호스트, IP 주소, 또는 CIDR 범위 목록. 예: `192.168.1.0/24,10.0.0.5,*.internal.company.local`. |

### 로그인 속도 제한[​](#login-rate-limiting "Direct link to Login rate limiting")

다음 환경 변수는 무차별 대입 공격(brute-force attack)을 방지하기 위해 `/login` 엔드포인트에 대한 IP 기반 속도 제한을 구성합니다.
한도를 초과하면 Langflow는 `Retry-After: 60` 헤더와 함께 HTTP 429를 반환합니다.

| 변수 | 형식 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `LANGFLOW_​RATE_​LIMIT_​PER_​MINUTE` | Integer | `5` | 단일 IP 주소에서 분당 허용되는 최대 로그인 시도 횟수. |
| `LANGFLOW_​RATE_​LIMIT_​STORAGE_​URI` | String | `memory://` | 속도 제한 카운터의 저장 백엔드. 단일 서버 배포에는 `memory://`를, 인스턴스 전반에 걸쳐 한도를 공유해야 하는 다중 서버 배포에는 `redis://host:port`를 사용하세요. |
| `LANGFLOW_​RATE_​LIMIT_​TRUST_​PROXY` | Boolean | `False` | `true`인 경우, Langflow는 직접 연결 IP 대신 가장 오른쪽의 `X-Forwarded-For` 헤더 항목에서 클라이언트 IP를 읽습니다. Langflow가 신뢰할 수 있는 리버스 프록시나 로드 밸런서 뒤에 있을 때만 활성화하세요. 사용자가 Langflow에 직접 접근할 수 있는 경우에는 헤더 스푸핑이 가능해지므로 활성화하지 마세요. |

### LANGFLOW_WEBHOOK_AUTH_ENABLE[​](#langflow-webhook-auth-enable "Direct link to LANGFLOW_WEBHOOK_AUTH_ENABLE")

이 변수는 웹훅 엔드포인트에 API 키 인증이 필요한지 여부를 제어합니다.

| 변수 | 형식 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `LANGFLOW_​WEBHOOK_​AUTH_​ENABLE` | Boolean | `True` | `True`인 경우, 웹훅 엔드포인트는 API 키 인증을 요구하고 인증된 사용자가 실행되는 플로우의 소유자인지 확인합니다. `False`인 경우, Langflow API 키가 필요하지 않으며 웹훅 엔드포인트로 전송된 모든 요청은 플로우 소유자가 보낸 것으로 처리됩니다. |

기본적으로 웹훅은 `LANGFLOW_WEBHOOK_AUTH_ENABLE=True`로 API 키 인증을 요구합니다.

인증 없이 웹훅을 실행하도록 허용하려면(권장하지 않음, 신뢰할 수 있는 환경에서만 사용), Langflow `.env` 파일에서 `LANGFLOW_WEBHOOK_AUTH_ENABLE=False`를 설정하세요.

웹훅 인증이 활성화된 경우, 각 웹훅 요청에 HTTP 헤더나 쿼리 파라미터로 Langflow API 키를 제공해야 합니다. 자세한 내용은 [웹훅 인증 필수 설정](https://docs.langflow.org/webhook#require-authentication-for-webhooks)을 참조하세요.

## 인증이 활성화된 Langflow 서버 시작하기[​](#start-a-langflow-server-with-authentication-enabled "Direct link to Start a Langflow server with authentication enabled")

이 섹션에서는 [인증 환경 변수](https://docs.langflow.org/api-keys-and-authentication#authentication-environment-variables)를 사용하여 인증이 활성화된 Langflow 서버를 배포하는 방법을 설명합니다.
여기에는 자동 로그인 비활성화, 슈퍼유저 자격 증명 설정, 비밀 암호화 키 생성, 사용자 관리 활성화가 포함됩니다.

이 구성은 Langflow가 공유 네트워크나 공개 네트워크에 노출되는 배포, 또는 여러 사용자가 동일한 Langflow 서버에 접근하는 배포에 권장됩니다.

인증이 활성화되면, 모든 사용자는 유효한 자격 증명으로 시각적 편집기에 로그인해야 하며, API 요청은 Langflow API 키로 인증해야 합니다.
또한 사용자 관리와 슈퍼유저 권한을 가진 [Langflow API 키 생성](#create-a-langflow-api-key)을 하려면 슈퍼유저로 로그인해야 합니다.

### Langflow 서버 시작[​](#start-the-langflow-server "Direct link to Start the Langflow server")

1. 다음 변수가 포함된 `.env` 파일을 생성합니다.

  ```
  LANGFLOW_AUTO_LOGIN=False
  LANGFLOW_SUPERUSER=
  LANGFLOW_SUPERUSER_PASSWORD=
  LANGFLOW_SECRET_KEY=
  LANGFLOW_NEW_USER_IS_ACTIVE=False
  LANGFLOW_ENABLE_SUPERUSER_CLI=False
  ```
  `.env` 파일에는 다른 환경 변수도 포함될 수 있습니다.
  이 예시는 인증 변수에 초점을 맞춥니다.

2. `LANGFLOW_SUPERUSER`와 `LANGFLOW_SUPERUSER_PASSWORD`를 원하는 슈퍼유저 자격 증명으로 설정합니다.

    일회성 테스트라면 `administrator`, `password`와 같은 기본 자격 증명을 사용할 수 있습니다.
    실제 개발 및 프로덕션 환경에서는 강력하고 안전하게 저장된 자격 증명을 권장합니다.

3. 권장: 민감한 데이터를 암호화하기 위한 `LANGFLOW_SECRET_KEY`를 생성하고 설정합니다.

    비밀 키를 설정하지 않으면 Langflow가 자동으로 생성하지만, 프로덕션 환경에서는 권장되지 않습니다.

    비밀 키 생성 및 설정 방법에 대한 지침은 [`LANGFLOW_SECRET_KEY`](#langflow-secret-key)를 참조하세요.

4. 값을 채운 `.env` 파일을 저장합니다. 예시:

  ```
  LANGFLOW_AUTO_LOGIN=False
  LANGFLOW_SUPERUSER=administrator
  LANGFLOW_SUPERUSER_PASSWORD=securepassword
  LANGFLOW_SECRET_KEY=dBuu...2kM2_fb
  LANGFLOW_NEW_USER_IS_ACTIVE=False
  LANGFLOW_ENABLE_SUPERUSER_CLI=False
  ```

5. `.env` 파일의 구성으로 Langflow를 시작합니다.

  ```
  uv run langflow run --env-file .env
  ```
  `.env` 파일로 Langflow를 시작하면 `LANGFLOW_SUPERUSER`와 `LANGFLOW_SUPERUSER_PASSWORD`에 설정된 슈퍼유저로 자동 인증됩니다.
  이 변수들을 명시적으로 설정하지 않은 경우, 시스템 자동 로그인의 기본값은 `langflow`와 `langflow`입니다.

6. 서버가 실행 중인지 확인합니다. 기본 위치는 `http://localhost:7860`입니다.

이제 다른 사람과 플로우를 협업하기 위해 Langflow 서버에 사용자를 추가할 수 있습니다.

### 관리자로서 사용자 관리하기[​](#manage-users-as-an-administrator "Direct link to Manage users as an administrator")

1. 슈퍼유저로서 첫 로그인을 완료하려면 `http://localhost:7860/login`으로 이동합니다.

    기본 위치를 사용하지 않는 경우, `localhost:7860`을 서버 주소로 바꾸세요.

2. `.env`에 설정한 슈퍼유저 자격 증명(`LANGFLOW_SUPERUSER`와 `LANGFLOW_SUPERUSER_PASSWORD`)으로 로그인합니다.

3. 서버의 사용자를 관리하려면 `http://localhost:7860/admin`과 같은 `/admin`으로 이동하거나, 프로필 아이콘을 클릭한 다음 **Admin Page**를 클릭합니다.

    슈퍼유저는 사용자를 추가하고, 권한을 설정하고, 비밀번호를 재설정하고, 계정을 삭제할 수 있습니다.

4. 사용자를 추가하려면 **New User**를 클릭한 다음 사용자 계정 양식을 작성합니다.

  1. 사용자 이름과 비밀번호를 입력합니다.
  2. 계정을 즉시 활성화하려면 **Active**를 선택합니다. 비활성 사용자는 로그인할 수 없으며 비활성화되기 전에 생성한 플로우에도 접근할 수 없습니다.
  3. 사용자에게 전체 관리 권한을 부여하고 싶지 않다면 **Superuser** 선택을 해제합니다.
  4. **Save**를 클릭합니다. 새 사용자가 **Admin Page**에 나타납니다.

5. 사용자가 Langflow에 로그인할 수 있도록 자격 증명을 전달합니다. 계정 생성 시 슈퍼유저가 초기 비밀번호를 설정하므로, 사용자는 슈퍼유저로부터 로그인 자격 증명을 받아야 합니다.

6. 새 사용자의 접근 권한을 테스트하려면 Langflow에서 로그아웃한 다음 새 사용자의 자격 증명으로 로그인합니다.

    `/admin` 페이지에 접근을 시도해 보세요.
    새 사용자가 슈퍼유저가 아니라면 `/flows` 페이지로 리디렉션됩니다.

## 참고 자료[​](#see-also "Direct link to See also")

- [Langflow 환경 변수](https://docs.langflow.org/environment-variables)
- [Langflow 보안 정책](https://github.com/langflow-ai/langflow/blob/main/SECURITY.md) — 취약점 보고, 보안 구성, [비밀 키 교체](https://github.com/langflow-ai/langflow/blob/main/SECURITY.md#secret-key-rotation)
