# 권한 부여

> 원문: https://docs.langflow.org/next/authorization

Langflow는 플로우, 프로젝트, 배포, 파일, 변수, 지식 베이스에 대한 역할 기반 접근 제어(RBAC)를 위해 플러그인 방식의 권한 부여 계층을 포함합니다.

권한 부여 인프라는 모든 Langflow 배포에 존재하지만, 오픈소스 빌드는 인증된 모든 사용자의 모든 작업을 **항상 허용**하는 통과(pass-through) 서비스를 등록합니다.

강제 적용 플러그인(enforcement plugin) 없이 `LANGFLOW_AUTHZ_ENABLED=true`를 설정해도 접근이 제한되지 **않습니다**. 경로 가드는 여전히 실행되고 감사 행(audit row)도 계속 기록될 수 있지만, 어떤 정책도 적용되지 않습니다.

리소스 단위 RBAC를 적용하려면 등록된 권한 부여 플러그인이 필요합니다.
Langflow OSS에는 등록된 권한 부여 플러그인이 포함되어 있지 **않습니다**.

## 강제 적용 플러그인으로 RBAC 활성화[​](#enable-rbac-with-an-enforcement-plugin "Direct link to Enable RBAC with an enforcement plugin")

다음 단계는 등록된 강제 적용 플러그인이 있는 경우에 적용됩니다.

1. `LANGFLOW_AUTHZ_AUDIT_ENABLED=true`를 설정하고 스테이징 환경에서 Langflow를 실행합니다. 강제 적용을 켜기 전에 어떤 결정이 내려질지 이해하기 위해 [감사 로그](#audit-log-api)를 검토하세요.

2. 강제 적용 플러그인의 설정 가이드에 따라 설치하고 등록합니다.

3. `LANGFLOW_AUTHZ_ENABLED=true`를 설정합니다. 플러그인은 역할 및 공유 테이블을 읽고 자체 정책을 적용합니다.

4. [역할 API](#roles-api)와 [역할 할당 API](#role-assignments-api)를 사용하여 내장된 `viewer`, `developer`, `admin` 역할을 사용자에게 할당하거나, 사용자 정의 역할을 생성합니다.

5. 필요한 경우 [공유 API](#shares-api)를 사용해 사용자 간 교차 접근을 부여합니다.

## 권한 부여 환경 변수 구성[​](#configure-authorization-environment-variables "Direct link to Configure authorization environment variables")

| 변수 | 설명 | 기본값 |
| --- | --- | --- |
| `LANGFLOW_​AUTHZ_​ENABLED` | 권한 부여 강제 적용을 활성화합니다. 등록된 강제 적용 플러그인이 필요합니다. `false`인 경우 역할이나 공유와 관계없이 모든 요청이 통과합니다. | `false` |
| `LANGFLOW_​AUTHZ_​SUPERUSER_​BYPASS` | `true`인 경우 활성 슈퍼유저는 권한 부여 검사를 우회합니다. 플러그인은 여전히 해당 결정을 감사할 수 있습니다. | `true` |
| `LANGFLOW_​AUTHZ_​AUDIT_​ENABLED` | 모든 권한 부여 결정과 공유 관리 작업에 대해 감사 로그 행을 기록합니다. `LANGFLOW_​AUTHZ_​ENABLED`와 독립적으로 작동합니다 — 강제 적용을 활성화하기 전에 트래픽을 관찰하려면 강제 적용이 꺼져 있는 동안 이 값을 `true`로 설정하세요. | `false` |
| `LANGFLOW_​AUTHZ_​AUDIT_​RETENTION_​DAYS` | 감사 로그 행을 보존할 일수. 자동 정리를 비활성화하려면 `0`으로 설정하세요. | `90` |
| `LANGFLOW_​AUTHZ_​AUDIT_​CLEANUP_​INTERVAL` | 보존 정리(sweep) 실행 사이의 간격(초). 시작 시에도 정리가 한 번 실행됩니다. 최소값은 `300`입니다. | `86400` |

## 시스템 역할[​](#system-roles "Direct link to System roles")

Langflow는 강제 적용 플러그인이 정책 동기화의 시작점으로 사용하는 세 가지 내장 시스템 역할을 미리 생성해 둡니다. 이 역할들은 삭제할 수 없습니다.

| 역할 | 권한 슬러그 |
| --- | --- |
| `viewer` | `flow:read`, `project:read`, `deployment:read`, `file:read`, `variable:read`, `knowledge_​base:read` |
| `developer` | `viewer` 권한에 더해 `flow:write`, `flow:execute`, `file:write`, `variable:write` |
| `admin` | 모든 리소스 유형에 대한 모든 작업 |

[역할 API](#roles-api)를 사용하여 추가 역할을 생성할 수 있습니다. 역할 할당은 강제 적용 플러그인이 등록된 후에만 실제로 적용됩니다.

## 권한 부여 API 참조[​](#authorization-api-reference "Direct link to Authorization API reference")

모든 권한 부여 엔드포인트는 `/api/v1/authz/` 아래에 있습니다. 쓰기 작업에는 슈퍼유저 권한이 필요합니다.

이 엔드포인트들은 RBAC 데이터 모델을 관리합니다. 강제 적용 플러그인은 요청을 평가할 때 역할, 할당, 공유를 참조합니다. 플러그인이 없으면 API 응답은 성공하지만 접근은 제한되지 않습니다.

### 유효 권한(effective permissions)[​](#effective-permissions "Direct link to Effective permissions")

`POST /api/v1/authz/me/permissions`

403 응답을 유발할 개별 리소스 요청 없이, 현재 사용자에 대한 여러 리소스의 허용된 작업을 반환합니다. 프런트엔드는 강제 적용 플러그인이 활성화되어 있을 때 UI 컨트롤을 활성화하거나 비활성화하는 데 이를 사용합니다.

**요청 본문:**

| 필드 | 유형 | 설명 |
| --- | --- | --- |
| `resource_​type` | string | `flow`, `deployment`, `project`, `knowledge_​base`, `variable`, `file`, `component` 중 하나 |
| `resource_​ids` | UUID[] | 평가할 리소스 ID. 요청당 최대 500개. |
| `actions` | string[] | 확인할 작업. 기본값은 `read`, `write`, `execute`, `delete`, `create`. 최대 10개. |
| `domain` | string | 권한 부여 도메인. 일반적으로 `project:{folder_​id}` 또는 `*`. 기본값은 `*`. |

**응답:**

```json
{  
  "resource_type": "flow",  
  "permissions": {  
    "3fa85f64-5717-4562-b3fc-2c963f66afa6": ["read", "execute"]  
  }  
}  
```

### 공유 API[​](#shares-api "Direct link to Shares API")

`/api/v1/authz/shares`

공유(share)는 사용자 경계를 넘어 리소스에 대한 접근을 부여합니다. 리소스 소유자나 슈퍼유저는 자신의 리소스에 대한 공유를 관리할 수 있습니다.

| 메서드 | 경로 | 설명 |
| --- | --- | --- |
| `POST` | `/api/v1/authz/shares` | 공유 생성 |
| `GET` | `/api/v1/authz/shares` | 현재 사용자에게 보이는 공유 목록 조회 |
| `GET` | `/api/v1/authz/shares/{share_​id}` | 특정 공유 조회 |
| `PATCH` | `/api/v1/authz/shares/{share_​id}` | 공유 업데이트 |
| `DELETE` | `/api/v1/authz/shares/{share_​id}` | 공유 삭제 |

각 공유 쓰기 작업은 캐시된 정책을 새로 고치도록 권한 부여 플러그인에 무효화(invalidation) 호출을 발생시킵니다.

### 역할 API[​](#roles-api "Direct link to Roles API")

`/api/v1/authz/roles` — 쓰기는 슈퍼유저만 가능

| 메서드 | 경로 | 설명 |
| --- | --- | --- |
| `GET` | `/api/v1/authz/roles` | 역할 목록 조회. `is_​system` 또는 `name` 부분 문자열로 필터링 가능. |
| `GET` | `/api/v1/authz/roles/{role_​id}` | 특정 역할 조회 |
| `POST` | `/api/v1/authz/roles` | 사용자 정의 역할 생성 |
| `PATCH` | `/api/v1/authz/roles/{role_​id}` | 역할 이름, 설명, 권한 업데이트 |
| `DELETE` | `/api/v1/authz/roles/{role_​id}` | 사용자 정의 역할 삭제 (시스템 역할은 삭제 불가) |

### 역할 할당 API[​](#role-assignments-api "Direct link to Role assignments API")

`/api/v1/authz/role-assignments` — 쓰기는 슈퍼유저만 가능

| 메서드 | 경로 | 설명 |
| --- | --- | --- |
| `GET` | `/api/v1/authz/role-assignments` | 역할 할당 목록 조회 |
| `POST` | `/api/v1/authz/role-assignments` | 사용자에게 역할 할당 |
| `DELETE` | `/api/v1/authz/role-assignments/{assignment_​id}` | 역할 할당 제거 |

### 팀 API[​](#teams-api "Direct link to Teams API")

`/api/v1/authz/teams` — 쓰기는 슈퍼유저만 가능

| 메서드 | 경로 | 설명 |
| --- | --- | --- |
| `GET` | `/api/v1/authz/teams` | 팀 목록 조회 |
| `GET` | `/api/v1/authz/teams/{team_​id}` | 특정 팀 조회 |
| `POST` | `/api/v1/authz/teams` | 팀 생성 |
| `PATCH` | `/api/v1/authz/teams/{team_​id}` | 팀 업데이트 |
| `DELETE` | `/api/v1/authz/teams/{team_​id}` | 팀 삭제 |
| `GET` | `/api/v1/authz/teams/{team_​id}/members` | 팀 구성원 목록 조회 |
| `POST` | `/api/v1/authz/teams/{team_​id}/members` | 팀에 구성원 추가 |
| `DELETE` | `/api/v1/authz/teams/{team_​id}/members/{user_​id}` | 팀에서 구성원 제거 |

### 감사 로그 API[​](#audit-log-api "Direct link to Audit log API")

`GET /api/v1/authz/audit` — 슈퍼유저 전용

권한 부여 감사 로그에 대해 페이지네이션과 필터링이 가능한 뷰를 반환합니다.

**쿼리 파라미터:**

| 파라미터 | 유형 | 설명 |
| --- | --- | --- |
| `user_​id` | UUID | 작업을 수행한 사용자로 필터링 |
| `resource_​type` | string | 리소스 유형 슬러그로 필터링 (예: `flow`) |
| `resource_​id` | UUID | 리소스 UUID로 필터링 |
| `action` | string | 작업 문자열로 필터링 (예: `flow:read` 또는 `share:create`) |
| `result` | string | 결정 결과로 필터링: `allow`, `deny`, 또는 `owner_​override` |
| `since` | datetime | 타임스탬프 하한 (포함) |
| `until` | datetime | 타임스탬프 상한 (제외) |

페이지 크기는 최대 200행으로 제한됩니다.

## 참고 자료[​](#see-also "Direct link to See also")

- [인증과 권한 부여 개요](https://docs.langflow.org/next/authentication-overview)
- [API 키와 인증](https://docs.langflow.org/api-keys-and-authentication)
- [외부 인증](https://docs.langflow.org/next/external-authentication)
- [JWT 인증](https://docs.langflow.org/api-keys-and-authentication#configure-jwt-token-signing)
- [보안](https://docs.langflow.org/security)
