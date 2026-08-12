# 사용자 엔드포인트

`/users` 엔드포인트를 사용하여 Langflow의 사용자 계정을 관리합니다.

---

## 사용자 추가

주어진 사용자 이름과 비밀번호로 새 사용자 계정을 만듭니다. Langflow 서버에 인증이 활성화된 경우 슈퍼유저로 인증이 필요합니다.

```python
import os
import uuid
import requests

base = os.environ.get("LANGFLOW_URL", "")
api_key = os.environ.get("LANGFLOW_API_KEY", "")

headers = {"Content-Type": "application/json", "x-api-key": api_key}

payload = {
    "username": f"docsuser_{uuid.uuid4().hex[:12]}",
    "password": "securepassword123",
}

response = requests.post(f"{base}/api/v1/users/", headers=headers, json=payload)
response.raise_for_status()
print(response.text)
```

**결과:**

```json
{
  "id": "10c1c6a2-ab8a-4748-8700-0e4832fd5ce8",
  "username": "newuser2",
  "is_active": false,
  "is_superuser": false,
  "create_at": "2025-05-29T16:02:20.132436"
}
```

---

## 현재 사용자 가져오기

인증된 사용자에 대한 정보를 검색합니다:

```python
url = f"{os.getenv('LANGFLOW_URL', '')}/api/v1/users/whoami"
response = requests.request("GET", url, headers=headers)
```

**결과:**

```json
{
  "id": "07e5b864-e367-4f52-b647-a48035ae7e5e",
  "username": "langflow",
  "is_active": true,
  "is_superuser": true
}
```

---

## 모든 사용자 목록

시스템의 모든 사용자의 페이지네이션된 목록을 가져옵니다. 슈퍼유저로 인증이 필요합니다:

```python
url = f"{os.getenv('LANGFLOW_URL', '')}/api/v1/users/?skip=0&limit=10"
response = requests.request("GET", url, headers=headers)
```

**결과:**

```json
{
  "total_count": 3,
  "users": [
    {
      "id": "07e5b864-e367-4f52-b647-a48035ae7e5e",
      "username": "langflow",
      "is_active": true,
      "is_superuser": true
    }
  ]
}
```

---

## 사용자 업데이트

PATCH 요청으로 기존 사용자의 정보를 수정합니다. 슈퍼유저로 인증이 필요합니다:

```python
payload = {"is_active": True}

response = requests.patch(f"{base}/api/v1/users/{user_id}", headers=headers, json=payload)
```

---

## 비밀번호 재설정

지정된 사용자의 비밀번호를 새 값으로 변경합니다. 대상 사용자로 인증이 필요합니다:

```python
payload = {"password": "NewSecurePassword2025!"}

response = requests.patch(
    f"{base}/api/v1/users/{user_id}/reset-password",
    headers=headers,
    json=payload,
)
```

---

## 사용자 삭제

시스템에서 사용자 계정을 제거합니다. 슈퍼유저로 인증이 필요합니다:

```python
response = requests.delete(f"{base}/api/v1/users/{user_id}", headers=headers)
```

**결과:**

```json
{
  "detail": "User deleted"
}
```

---

*원문: https://docs.langflow.org/next/api-users*
