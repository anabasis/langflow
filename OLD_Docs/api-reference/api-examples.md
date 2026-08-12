# Langflow API 시작하기

Langflow API는 다음과 같은 Langflow와의 프로그래밍 방식 상호작용에 사용할 수 있습니다:

- 파일 관리를 포함한 플로우 만들기 및 편집
- 플로우를 사용하는 애플리케이션 개발
- 커스텀 컴포넌트 개발
- 더 큰 애플리케이션, 코드베이스 또는 서비스의 의존성으로 Langflow 구축

Langflow 배포의 `/docs` 엔드포인트 (예: `http://localhost:7860/docs`)에서 OpenAPI 명세를 통해 사용 가능한 모든 엔드포인트를 보고 테스트할 수 있습니다.

---

## Langflow API 요청 구성

기본 요청 예시 (Python):

```python
import os
import requests

base = os.environ.get("LANGFLOW_URL") or os.environ.get("LANGFLOW_SERVER_URL", "")
flow_id = os.environ.get("FLOW_ID", "")
api_key = os.environ.get("LANGFLOW_API_KEY", "")

url = f"{base}/api/v1/run/{flow_id}?stream=false"

headers = {
    "Content-Type": "application/json",
    "x-api-key": api_key,
}

payload = {
    "input_value": "hello world!",
    "output_type": "chat",
    "input_type": "chat",
}

response = requests.post(url, headers=headers, json=payload, timeout=60)
response.raise_for_status()
print(response.text)
```

### 기본 URL

- 로컬: `http://localhost:7860/api`
- 원격: `http://IP_OR_DNS/api` 또는 `http://IP_OR_DNS:LANGFLOW_PORT/api`

`LANGFLOW_PORT` 환경 변수로 포트 번호를 구성할 수 있습니다.

### 인증

Langflow 1.5 이상에서 대부분의 API 엔드포인트는 `x-api-key` 헤더 또는 쿼리 매개변수의 Langflow API 키로 인증이 필요합니다.

### API 버전

Langflow API는 `/v1` 및 `/v2` 엔드포인트를 제공합니다.

---

## 환경 변수 설정

```bash
export LANGFLOW_API_KEY="${LANGFLOW_API_KEY:-sk-local-placeholder}"
export LANGFLOW_SERVER_URL="${LANGFLOW_SERVER_URL:-http://localhost:7860}"
export FLOW_ID="${FLOW_ID:-359cd752-07ea-46f2-9d3b-a4407ef618da}"

curl --request POST \
  --url "$LANGFLOW_SERVER_URL/api/v1/run/$FLOW_ID?stream=false" \
  --header "Content-Type: application/json" \
  --header "x-api-key: $LANGFLOW_API_KEY" \
  --data '{
  "input_value": "hello world!",
  "output_type": "chat",
  "input_type": "chat"
}'
```

---

## 기본 API 요청 시도

### 헬스 체크

```bash
curl http://localhost:7860/health_check
```

결과:
```json
{
  "status": "ok",
  "chat": "ok",
  "db": "ok"
}
```

### 버전 가져오기

```bash
curl http://localhost:7860/api/v1/version
```

결과:
```json
{
  "version": "1.6.0",
  "main_version": "1.6.0",
  "package": "Langflow"
}
```

### 구성 가져오기

```bash
curl -H "x-api-key: $LANGFLOW_API_KEY" \
  http://localhost:7860/api/v1/config
```

---

## 사용 가능한 엔드포인트

### 플로우 트리거

- `POST /v1/run/{flow_id_or_name}`: 플로우 실행
- `POST /v1/run/advanced/{flow_id}`: 고급 실행
- `POST /v1/webhook/{flow_id_or_name}`: 웹훅 페이로드로 플로우 트리거

### 파일 관리

- `POST /v2/files`: 파일 업로드
- `GET /v2/files`: 파일 목록 조회
- `DELETE /v2/files/{file_id}`: 파일 삭제

### 플로우 관리

- `POST /v1/flows/`: 플로우 만들기
- `GET /v1/flows/`: 플로우 목록 조회
- `GET /v1/flows/{flow_id}`: 플로우 읽기
- `PATCH /v1/flows/{flow_id}`: 플로우 업데이트
- `DELETE /v1/flows/{flow_id}`: 플로우 삭제
- `POST /v1/flows/upload/`: JSON 파일에서 플로우 가져오기
- `POST /v1/flows/download/`: 플로우를 ZIP 파일로 내보내기

### 프로젝트 관리

- `POST /v1/projects/`: 프로젝트 만들기
- `GET /v1/projects/`: 프로젝트 목록 조회
- `GET /v1/projects/{project_id}`: 프로젝트 읽기
- `DELETE /v1/projects/{project_id}`: 프로젝트 삭제
- `GET /v1/projects/download/{project_id}`: 프로젝트 내보내기 (ZIP)

### API 키

- `GET /v1/api_key/`: API 키 목록 조회
- `POST /v1/api_key/`: 새 API 키 만들기
- `DELETE /v1/api_key/{api_key_id}`: API 키 삭제

### 사용자 관리

- `GET /v1/users/whoami`: 현재 사용자 정보 조회
- `GET /v1/users/`: 모든 사용자 목록 조회 (슈퍼유저 필요)

---

## 다음 단계

- [Langflow API로 플로우 실행](./api-flows-run.md)
- [Langflow API로 파일 업로드](./api-files.md)
- [Langflow API 명세](https://docs.langflow.org/api) 탐색

---

*원문: https://docs.langflow.org/next/api-reference-api-examples*
