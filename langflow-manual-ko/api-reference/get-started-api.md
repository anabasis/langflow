# Langflow API 시작하기
> 원문: https://docs.langflow.org/next/api-reference-api-examples

프로그래밍 방식으로 Langflow와 상호작용하려면 Langflow API를 사용할 수 있습니다. 예를 들면 다음과 같은 작업이 가능합니다.

- 플로우 생성 및 편집(플로우용 파일 관리 포함)
- 플로우를 사용하는 애플리케이션 개발
- 커스텀 컴포넌트 개발
- Langflow를 더 큰 애플리케이션, 코드베이스, 서비스의 의존성으로 빌드
- Langflow 코드베이스 전반에 기여

사용 가능한 모든 엔드포인트를 보고 테스트하려면, Langflow 배포 환경의 `/docs` 엔드포인트(예: `http://localhost:7860/docs`)에서 Langflow API의 OpenAPI 스펙에 접근할 수 있습니다.

직접 해보기

스크립트에서 Langflow API를 사용하는 예시는 [Langflow 퀵스타트](https://docs.langflow.org/get-started-quickstart)를 참고하십시오.

퀵스타트에서는 플로우에 대한 코드 스니펫을 자동으로 생성하는 방법, 스크립트로 플로우를 실행하는 방법, Langflow API 응답에서 데이터를 추출하는 방법을 보여줍니다.

## Langflow API 요청 구성하기[​](#form-langflow-api-requests "Direct link to Form Langflow API requests")

엔드포인트마다 개별 옵션은 다르지만, 모든 Langflow API 요청은 URL, 메서드, 파라미터, 인증 등 몇 가지 공통 요소를 공유합니다.

Langflow API 요청의 예로, 다음 curl 명령은 `/v1/run` 엔드포인트를 호출하며 플로우의 **Chat Output** 컴포넌트에 런타임 오버라이드(`tweaks`)를 전달합니다.

- Python
- JavaScript
- curl

```
1import os
2
3import requests
4
5base = os.environ.get("LANGFLOW_URL") or os.environ.get("LANGFLOW_SERVER_URL", "")
6flow_id = os.environ.get("FLOW_ID", "")
7api_key = os.environ.get("LANGFLOW_API_KEY", "")
8
9url = f"{base}/api/v1/run/{flow_id}?stream=false"
10
11headers = {
12    "Content-Type": "application/json",
13    "x-api-key": api_key,
14}
15
16payload = {
17    "input_value": "hello world!",
18    "output_type": "chat",
19    "input_type": "chat",
20}
21
22response = requests.post(url, headers=headers, json=payload, timeout=60)
23response.raise_for_status()
24print(response.text)
```

### 기본 URL(Base URL)[​](#base-url "Direct link to Base URL")

기본적으로 로컬 배포 환경은 `http://localhost:7860/api`에서 Langflow API를 제공합니다.

원격으로 호스팅되는 Langflow 배포 환경은 호스팅 서비스가 설정한 도메인(예: `http://IP_OR_DNS/api` 또는 `http://IP_OR_DNS:LANGFLOW_PORT/api`)에서 사용할 수 있습니다.

`LANGFLOW_PORT` [환경 변수](https://docs.langflow.org/environment-variables)에서 Langflow 포트 번호를 설정할 수 있습니다.

- `https://UUID.ngrok.app/api`
- `http://IP_OR_DNS/api`
- `http://IP_OR_DNS:LANGFLOW_PORT/api`

### 인증(Authentication)[​](#authentication "Direct link to Authentication")

Langflow 1.5 버전 이상에서는 대부분의 API 엔드포인트가 `x-api-key` 헤더 또는 쿼리 파라미터를 통한 Langflow API 키 인증을 요구합니다.
자세한 내용은 [API 키 및 인증](https://docs.langflow.org/api-keys-and-authentication)을 참고하십시오.

다른 API와 마찬가지로, 민감한 자격 증명을 저장하고 참조할 때는 업계 모범 사례를 따르십시오.
예를 들어, API 키를 위한 [환경 변수를 설정](#set-environment-variables)하고, API 요청에서 해당 환경 변수를 참조할 수 있습니다.

### 메서드, 경로, 파라미터[​](#methods-paths-and-parameters "Direct link to Methods, paths, and parameters")

Langflow API 요청은 다양한 메서드, 경로, 경로 파라미터, 쿼리 파라미터, 본문 파라미터를 사용합니다.
구체적인 요구 사항과 옵션은 호출하려는 엔드포인트에 따라 다릅니다.

예를 들어 플로우를 생성하려면 JSON 형식의 플로우 정의를 `POST /v1/flows`로 전달합니다.
그런 다음 플로우를 실행하려면 요청 본문에 선택적 실행 파라미터를 포함해 `POST /v1/run/$FLOW_ID`를 호출합니다.

### API 버전[​](#api-versions "Direct link to API versions")

Langflow API는 `/v1`과 `/v2` 엔드포인트를 제공합니다.

일부 엔드포인트는 하나의 버전에서만 존재하고, 일부는 `/v1`과 `/v2` 버전 모두에 존재합니다.

요청이 실패하거나 예상치 못한 결과가 나오는 경우, 엔드포인트 경로에 올바른 버전이 지정되어 있는지 확인하십시오.

## 환경 변수 설정하기[​](#set-environment-variables "Direct link to Set environment variables")

재사용을 쉽게 하고, 토큰 교체를 간소화하며, 민감한 값을 안전하게 참조하기 위해 자주 사용하는 값을 환경 변수에 저장할 수 있습니다.

`export`, `.env`, `zshrc`, `.curlrc` 등 원하는 방법으로 환경 변수를 설정할 수 있습니다.
그런 다음 API 요청에서 해당 환경 변수를 참조합니다. 예를 들면 다음과 같습니다.

```
1# Set environment variables (allow callers/wrappers to override defaults)
2export LANGFLOW_API_KEY="${LANGFLOW_API_KEY:-sk-local-placeholder}"
3export LANGFLOW_SERVER_URL="${LANGFLOW_SERVER_URL:-http://localhost:7860}"
4export FLOW_ID="${FLOW_ID:-359cd752-07ea-46f2-9d3b-a4407ef618da}"
5export PROJECT_ID="${PROJECT_ID:-1415de42-8f01-4f36-bf34-539f23e47466}"
6
7# Use environment variables in API requests
8curl --request POST \
9  --url "$LANGFLOW_SERVER_URL/api/v1/run/$FLOW_ID?stream=false" \
10  --header "Content-Type: application/json" \
11  --header "x-api-key: $LANGFLOW_API_KEY" \
12  --data '{
13  "input_value": "hello world!",
14  "output_type": "chat",
15  "input_type": "chat",
16  "tweaks": {
17    "ChatOutput-6zcZt": {
18      "should_store_message": true
19    }
20  }
21}'
```

Langflow API 요청에서 자주 사용하는 값에는 [Langflow 서버 URL](#base-url), [Langflow API 키](#authentication), 플로우 ID, [프로젝트 ID](https://docs.langflow.org/api-projects#read-projects) 등이 있습니다.

[**API access** 패널](https://docs.langflow.org/concepts-publish#api-access), 플로우의 URL, 그리고 [`GET /flows`](https://docs.langflow.org/api-flows#read-flows)를 통해 플로우 ID를 조회할 수 있습니다.

## Langflow API 요청 시도해보기[​](#try-some-langflow-api-requests "Direct link to Try some Langflow API requests")

Langflow 서버 URL을 확보했다면, Langflow 메타데이터를 반환하는 다음 엔드포인트들을 호출해보십시오.

### 헬스 체크(Health check)[​](#health-check "Direct link to Health check")

Langflow 데이터베이스와 채팅 서비스의 상태를 반환합니다.

- Python
- JavaScript
- curl

```
1import os
2
3import requests
4
5url = f"{os.getenv('LANGFLOW_SERVER_URL', '')}/health_check"
6
7headers = {
8    "accept": "application/json",
9}
10
11response = requests.request("GET", url, headers=headers)
12response.raise_for_status()
13
14print(response.text)
```

**결과(Result)**

```
1{
2  "status": "ok",
3  "chat": "ok",
4  "db": "ok"
5}
```

Langflow는 추가로 `GET /health` 엔드포인트를 제공합니다.
이 엔드포인트는 Langflow가 완전히 초기화되기 전에 uvicorn이 제공하므로, Langflow 서비스의 상태를 확인하는 데는 신뢰할 수 없습니다.

### 버전 조회(Get version)[​](#get-version "Direct link to Get version")

현재 Langflow API 버전을 반환합니다.

- Python
- JavaScript
- curl

```
1import os
2
3import requests
4
5url = f"{os.getenv('LANGFLOW_SERVER_URL', '')}/api/v1/version"
6
7headers = {
8    "accept": "application/json",
9}
10
11response = requests.request("GET", url, headers=headers)
12response.raise_for_status()
13
14print(response.text)
```

**결과(Result)**

```
1{
2    "version": "1.6.0",
3    "main_version": "1.6.0",
4    "package": "Langflow"
5}
```

### 설정 조회(Get configuration)[​](#get-configuration "Direct link to Get configuration")

Langflow 배포 환경에 대한 설정 정보를 반환합니다.
[Langflow API 키](https://docs.langflow.org/api-keys-and-authentication)가 필요합니다.

- Python
- JavaScript
- curl

```
1import os
2
3import requests
4
5url = f"{os.getenv('LANGFLOW_SERVER_URL', '')}/api/v1/config"
6
7headers = {
8    "accept": "application/json",
9    "x-api-key": f"{os.getenv('LANGFLOW_API_KEY', '')}",
10}
11
12response = requests.request("GET", url, headers=headers)
13response.raise_for_status()
14
15print(response.text)
```

**결과(Result)**

```
1{
2  "feature_flags": {
3    "mvp_components": false
4  },
5  "serialization_max_items_length": 1000,
6  "serialization_max_text_length": 6000,
7  "frontend_timeout": 0,
8  "auto_saving": true,
9  "auto_saving_interval": 1000,
10  "health_check_max_retries": 5,
11  "max_file_size_upload": 1024,
12  "webhook_polling_interval": 5000,
13  "public_flow_cleanup_interval": 3600,
14  "public_flow_expiration": 86400,
15  "event_delivery": "streaming",
16  "webhook_auth_enable": true,
17  "voice_mode_available": false,
18  "default_folder_name": "Starter Project",
19  "hide_getting_started_progress": false
20}
```

### 모든 컴포넌트 조회(Get all components)[​](#get-all-components "Direct link to Get all components")

Langflow의 모든 컴포넌트로 구성된 딕셔너리를 반환합니다.
[Langflow API 키](https://docs.langflow.org/api-keys-and-authentication)가 필요합니다.

- Python
- JavaScript
- curl

```
1import os
2
3import requests
4
5url = f"{os.getenv('LANGFLOW_SERVER_URL', '')}/api/v1/all"
6
7headers = {
8    "accept": "application/json",
9    "x-api-key": f"{os.getenv('LANGFLOW_API_KEY', '')}",
10}
11
12response = requests.request("GET", url, headers=headers)
13response.raise_for_status()
14
15print(response.text)
```

## 사용 가능한 엔드포인트[​](#available-endpoints "Direct link to Available endpoints")

Langflow는 IDE(프런트엔드+백엔드) 또는 런타임(헤드리스, 백엔드 전용)으로 모두 실행할 수 있으므로, 프런트엔드와 백엔드 작업을 지원하는 엔드포인트를 함께 제공합니다.
많은 엔드포인트는 프런트엔드와 백엔드 간의 오케스트레이션, Langflow 데이터베이스에 대한 읽기/쓰기, 또는 **Playground**와 같은 프런트엔드 기능 지원을 위한 것입니다.
Langflow 코드베이스에 기여하는 것이 아니라면, 대부분의 Langflow 엔드포인트를 직접 호출할 일은 없을 것입니다.

애플리케이션 개발에서 가장 흔히 사용되는 엔드포인트는 `/run`과 `/webhook` [플로우 트리거 엔드포인트](https://docs.langflow.org/api-flows-run)입니다.
일부 사용 사례에서는 플로우에서 파일을 사용하기 위한 `/files` 엔드포인트와 같은 다른 엔드포인트를 사용할 수도 있습니다.

사용 가능한 엔드포인트를 탐색하는 데 도움이 되도록, 아래 목록은 주요 사용 사례별로 정렬되어 있습니다. 다만 일부 엔드포인트는 여러 사용 사례를 지원할 수도 있습니다.

- 애플리케이션 개발
- 코드베이스 개발
- 지원 종료(Deprecated)

다음 엔드포인트는 Langflow로 애플리케이션을 개발하고, 하나 이상의 사용자를 가진 Langflow 배포 환경을 관리하는 데 유용합니다.
가장 자주 사용하게 될 것은 플로우 트리거 엔드포인트입니다.
그 밖의 엔드포인트는 시각적 편집기가 없는 런타임 배포 환경에서의 관리 및 플로우 관리와 같은 특정 사용 사례에 도움이 됩니다.

- [플로우 트리거 엔드포인트](https://docs.langflow.org/api-flows-run):

  * POST `/v1/run/{flow_id_or_name}`: 플로우를 실행합니다.
  * POST `/v1/run/advanced/{flow_id}`: `inputs`, `outputs`, `tweaks`를 명시적으로 지정하고 선택적으로 `session_id`를 사용하는 고급 실행입니다.
  * POST `/v1/webhook/{flow_id_or_name}`: 웹훅 페이로드로 플로우를 트리거합니다.

- [OpenAI Responses API](https://docs.langflow.org/api-openai-responses):

  * POST `/v1/responses`: OpenAI 호환 요청 형식으로 플로우를 실행합니다.

- 배포 세부 정보:

  * GET `/v1/version`: Langflow 버전을 반환합니다. [버전 조회](https://docs.langflow.org/api-reference-api-examples#get-version) 참고.
  * GET `/v1/config`: 배포 설정을 반환합니다. [설정 조회](https://docs.langflow.org/api-reference-api-examples#get-configuration) 참고.
  * GET `/health_check`: 데이터베이스와 채팅 서비스 연결을 검증하는 헬스 체크 엔드포인트입니다. 서비스가 사용 불가능하면 500 상태를 반환합니다.

- [프로젝트 엔드포인트](https://docs.langflow.org/api-projects):

  * POST `/v1/projects/`: 프로젝트를 생성합니다.
  * GET `/v1/projects/`: 프로젝트 목록을 조회합니다.
  * GET `/v1/projects/{project_id}`: 프로젝트를 조회합니다(페이지네이션된 플로우 지원 포함).
  * PATCH `/v1/projects/{project_id}`: 프로젝트 정보 및 멤버십을 업데이트합니다.
  * DELETE `/v1/projects/{project_id}`: 프로젝트를 삭제합니다.
  * GET `/v1/projects/download/{project_id}`: 프로젝트 내 모든 플로우를 ZIP으로 내보냅니다.
  * POST `/v1/projects/upload/`: 프로젝트 ZIP을 가져옵니다(프로젝트와 플로우 생성).
  * GET `/v1/starter-projects/`: 템플릿 목록을 반환합니다.

- [파일 엔드포인트](https://docs.langflow.org/api-files):

  * Files (v1)
    + POST `/v1/files/upload/{flow_id}`: 특정 플로우에 파일을 업로드합니다.
    + GET `/v1/files/download/{flow_id}/{file_name}`: 플로우에서 파일을 다운로드합니다.
    + GET `/v1/files/images/{flow_id}/{file_name}`: 플로우의 이미지를 스트리밍합니다.
    + GET `/v1/files/profile_pictures/{folder_name}/{file_name}`: 프로필 사진 자산을 가져옵니다.
    + GET `/v1/files/profile_pictures/list`: 사용 가능한 프로필 사진 자산 목록을 가져옵니다.
    + GET `/v1/files/list/{flow_id}`: 플로우의 파일 목록을 가져옵니다.
    + DELETE `/v1/files/delete/{flow_id}/{file_name}`: 플로우에서 파일을 삭제합니다.
  * Files (v2)
    + POST `/v2/files`(별칭 `/v2/files/`): 현재 사용자가 소유한 파일을 업로드합니다.
    + GET `/v2/files`(별칭 `/v2/files/`): 현재 사용자가 소유한 파일 목록을 조회합니다.
    + DELETE `/v2/files/batch/`: ID로 여러 파일을 삭제합니다.
    + POST `/v2/files/batch/`: ID로 여러 파일을 ZIP으로 다운로드합니다.
    + GET `/v2/files/{file_id}`: ID로 파일을 다운로드합니다(내부적으로 원본 콘텐츠를 반환할 수도 있음).
    + PUT `/v2/files/{file_id}`: ID로 파일 이름을 수정합니다.
    + DELETE `/v2/files/{file_id}`: ID로 파일을 삭제합니다.
    + DELETE `/v2/files`(별칭 `/v2/files/`): 현재 사용자의 모든 파일을 삭제합니다.

- [API 키 및 인증](https://docs.langflow.org/api-keys-and-authentication):

  * GET `/v1/api_key/`: 현재 사용자의 API 키 목록을 조회합니다.
  * POST `/v1/api_key/`: 새 API 키를 생성합니다.
  * DELETE `/v1/api_key/{api_key_id}`: API 키를 삭제합니다.
  * POST `/v1/api_key/store`: 암호화된 Store API 키를 저장합니다(쿠키 설정).

- [플로우 관리 엔드포인트](https://docs.langflow.org/api-flows):

  * POST `/v1/flows/`: 플로우를 생성합니다.
  * GET `/v1/flows/`: 플로우 목록을 조회합니다(페이지네이션 및 필터 지원).
  * GET `/v1/flows/{flow_id}`: ID로 플로우를 조회합니다.
  * GET `/v1/flows/public_flow/{flow_id}`: ID로 공개 플로우를 조회합니다.
  * PATCH `/v1/flows/{flow_id}`: 플로우를 업데이트합니다.
  * DELETE `/v1/flows/{flow_id}`: 플로우를 삭제합니다.
  * POST `/v1/flows/batch/`: 여러 플로우를 생성합니다.
  * POST `/v1/flows/upload/`: JSON 파일에서 플로우를 가져옵니다.
  * DELETE `/v1/flows/`: ID로 여러 플로우를 삭제합니다.
  * POST `/v1/flows/download/`: 플로우를 ZIP 파일로 내보냅니다.
  * GET `/v1/flows/basic_examples/`: 기본 예제 플로우 목록을 조회합니다.

- [사용자 엔드포인트](https://docs.langflow.org/api-users):

  * POST `/v1/users/`: 사용자를 추가합니다(인증이 활성화된 경우 슈퍼유저 필요).
  * GET `/v1/users/whoami`: 현재 인증된 사용자를 반환합니다.
  * GET `/v1/users/`: 모든 사용자를 조회합니다(슈퍼유저 필요).
  * PATCH `/v1/users/{user_id}`: 사용자를 업데이트합니다(역할 확인 포함).
  * PATCH `/v1/users/{user_id}/reset-password`: 본인 비밀번호를 재설정합니다.
  * DELETE `/v1/users/{user_id}`: 사용자를 삭제합니다(본인 계정은 삭제할 수 없음).

- 커스텀 컴포넌트: 자신의 용도로 커스텀 Langflow 컴포넌트를 개발하거나 Langflow 커뮤니티와 공유하기 위해 개발할 때 다음 엔드포인트를 사용할 수 있습니다.

  * GET `/v1/all`: 사용 가능한 모든 Langflow 컴포넌트 유형을 반환합니다. [모든 컴포넌트 조회](https://docs.langflow.org/api-reference-api-examples#get-all-components) 참고.
  * POST `/v1/custom_component`: 코드에서 커스텀 컴포넌트를 빌드하고 해당 노드를 반환합니다.
  * POST `/v1/custom_component/update`: 기존 커스텀 컴포넌트의 빌드 설정과 출력을 업데이트합니다.
  * POST `/v1/validate/code`: 커스텀 컴포넌트용 파이썬 코드 스니펫을 검증합니다.
  * POST `/v1/validate/prompt`: 프롬프트 페이로드를 검증합니다.

## 다음 단계[​](#next-steps "Direct link to Next steps")

- Langflow API로 [플로우 실행하기](https://docs.langflow.org/api-flows-run).
- Langflow API로 [파일 업로드하기](https://docs.langflow.org/api-files).
- Langflow API로 [플로우 로그 가져오기](https://docs.langflow.org/api-logs).
- [Langflow API 스펙](https://docs.langflow.org/api)에서 모든 엔드포인트를 살펴보십시오.
