# watsonx Orchestrate에 플로우 배포하기
> 원문: https://docs.langflow.org/next/deployment-wxo

팁

Langflow 1.10.x 기준으로 IBM watsonx Orchestrate 배포 기능은 피처 플래그(feature flag) 뒤에 있습니다. 이를 활성화하려면 Langflow를 시작하기 전에 다음 환경 변수를 설정하세요.

```bash
LANGFLOW_FEATURE_WXO_DEPLOYMENTS=true  
```

플로우를 생성하고 [IBM watsonx Orchestrate](https://www.ibm.com/docs/en/watsonx/watson-orchestrate/base?topic=getting-started-watsonx-orchestrate)에 배포합니다.

IBM watsonx Orchestrate에 플로우를 배포하는 것은 다른 Langflow 배포 옵션과는 다릅니다.
이 워크플로우는 완전한 기능을 갖춘 Langflow 서버와 플로우 빌더 UI를 배포하는 것이 **아닙니다**.
대신 Langflow는 선택한 플로우와 플로우 버전을 패키징하여 IBM watsonx Orchestrate에 wxO Tool로 게시하며, wxO Agent가 이를 실행할 수 있습니다.
Langflow는 플로우를 빌드하고 구성하는 데 사용되고, IBM watsonx Orchestrate는 wxO Agent 경험을 호스팅하며 해당 wxO Agent의 도구 모음 일부로서 배포된 플로우를 호출합니다.

## 사전 요구 사항[​](#prerequisites "사전 요구 사항으로 바로 가기")

팁

Langflow 1.11.x 기준으로 `ibm-watsonx-orchestrate-core`와 `ibm-watsonx-orchestrate-clients` 패키지가 버전 2.12로 업그레이드되어 Python 3.14와 호환됩니다.
IBM watsonx Orchestrate는 더 이상 Python 3.14 설치에서 제외되지 않습니다.

- [Langflow 설치 및 시작](https://docs.langflow.org/get-started-installation)
- [OpenAI API 키](https://platform.openai.com/api-keys) 생성
- [IBM watsonx Orchestrate 인스턴스](https://www.ibm.com/docs/en/watsonx/watson-orchestrate/base?topic=getting-started-watsonx-orchestrate) 생성

## 플로우 생성 및 배포하기[​](#create-and-deploy-a-flow "플로우 생성 및 배포하기로 바로 가기")

1. [퀵스타트](https://docs.langflow.org/get-started-quickstart)의 Simple Agent 스타터 플로우처럼 Langflow UI에서 플로우를 만듭니다.

2. 이 플로우를 watsonx Orchestrate에 배포하려면  **Deploy**를 클릭하세요.
**Provider** 패널이 열립니다.

3. IBM watsonx Orchestrate 인스턴스의 **Name**, **Service Instance URL**, **API Key**를 입력합니다.
이 값들은 IBM watsonx Orchestrate 인스턴스의 **Settings** 페이지에서 확인할 수 있습니다.

    - **Name**: `YOUR_DEPLOYMENT_NAME`
    - **Service Instance URL**: `https://api.dl.watson-orchestrate.ibm.com/instances/80194572-4421-6735-91ab-55c0d8e4f962`
    - **API Key**: `YOUR_WATSONX_ORCHESTRATE_API_KEY`

    Service Instance URL의 마지막 세그먼트는 IBM watsonx Orchestrate 테넌트 ID이며, watsonx Orchestrate 배포에서 확인할 수 있습니다.
이 예시에서 테넌트 ID는 `80194572-4421-6735-91ab-55c0d8e4f962`입니다.

4. **Next**를 클릭합니다.
**Deployment Type** 패널이 열립니다.

5. wxO Agent의 **Type**, **Name**, **Model**, **Description**을 입력한 다음 **Next**를 클릭하세요.

    **Type**은 항상 **Agent**입니다. 배포된 플로우는 wxO Agent가 호출할 수 있는 wxO Tool로서 플로우를 제공하는 wxO Agent입니다.

    **Model** 목록은 Langflow가 아니라 연결된 watsonx Orchestrate 인스턴스에서 채워집니다.

6. **Flows** 패널의 **Available** 목록에서 배포할 플로우와 플로우 버전을 선택하세요.
이 예시에서는 앞서 만든 simple agent 플로우를 선택합니다.
기본적으로 플로우는 버전 1입니다.

    선택 사항으로, 추가 버전을 첨부하려면 목록에서 같은 플로우를 다시 선택하고 다른 버전을 고르세요.
동일한 플로우의 여러 버전을 하나의 wxO Agent에 연결할 수 있습니다.
각 플로우 버전은 watsonx Orchestrate 내에서 이름 충돌을 방지하기 위해 고유한 이름을 가진 별도의 wxO Tool로 배포됩니다.

7. watsonx Orchestrate 연결을 구성하려면 **Create Connection**을 클릭하세요.
이 탭에서는 새 연결을 만들거나 기존 연결을 선택해 플로우에 연결할 수 있습니다.

    새 연결을 만들려면 다음을 수행하세요.

    1. **Connection Name**과 플로우에 필요한 모든 환경 변수(예: simple agent 플로우의 `OPENAI_API_KEY`)를 입력합니다.
Langflow는 플로우 JSON 파일에서 글로벌 변수를 자동으로 감지합니다.
추가 환경 변수를 더하려면  **Add variable**을 클릭하세요.

    2. 새 연결을 사용 가능한 연결 목록에 추가하려면 **Create Connection**을 클릭하세요.

    3. 사용 가능한 연결 목록에서 새 연결을 선택한 다음 **Attach Connection to Flow**를 클릭하세요.

    팁
        환경 변수 바인딩 없이 연결을 플로우에 바인딩하려면 **Skip**을 클릭한 다음 **Next**를 클릭하세요.

8. **Next**를 클릭합니다. **Review & Confirm** 패널이 열립니다.

9. 배포 값이 올바른지 확인한 다음  **Deploy**를 클릭하세요.

    Langflow는 필요한 추가 의존성을 watsonx Orchestrate 테넌트에 자동으로 설치합니다.

    Langflow UI에 `Deployment successful`이 표시되면 배포에 성공한 것입니다.

    팁
        wxO Tool 이름이 이미 배포에 존재한다는 오류가 발생하면  **Edit**을 클릭해 wxO Tool 이름을 변경하세요.

10. **Test**를 클릭하면 watsonx Orchestrate에서 wxO Agent와 채팅 창을 열 수 있습니다.
질문을 입력하면 wxO Agent가 연결된 플로우를 wxO Tool로 사용해 응답합니다.

11. IBM watsonx Orchestrate 배포에서 **Agent chat** > **Manage Agents**로 이동하여 Langflow 플로우가 연결된 새 wxO Agent가 목록에 있는지 확인하세요.

12. watsonx Orchestrate에서 wxO Agent를 테스트하려면 **Talk to agent**를 클릭한 다음 질문을 입력하세요.
wxO Agent가 Langflow 플로우를 wxO Tool로 사용해 응답합니다.

13. wxO Agent를 실제 환경(live environment)에 배포하려면 **Deploy**를 클릭하세요.

14. 선택 사항으로 **Activate agent monitoring**을 클릭하세요.

15. wxO Agent의 메트릭을 보려면 **Agent chat** > **Agent analytics**를 클릭한 다음 wxO Agent를 선택하세요.
이 페이지에는 총 메시지 수(Total messages), 실패한 메시지 수(Failed messages), 평균 지연 시간(Latency average) 등 wxO Agent의 메트릭이 포함됩니다.
각 wxO Agent 요청의 추적 정보를 보려면 **Trace Detail**을 클릭하세요.
자세한 내용은 [에이전트 모니터링](https://www.ibm.com/docs/en/watsonx/watson-orchestrate/base?topic=monitoring-agents)을 참조하세요.

## Langflow에서 배포 관리하기[​](#manage-deployments-in-langflow "Langflow에서 배포 관리하기로 바로 가기")

**Projects** 페이지에서 **Deployments**를 클릭하면 배포 관리 화면이 열립니다.

- **Deployments**:

    **Deployment**는 하나 이상의 Langflow 플로우를 wxO Tool로 갖춘 게시된 wxO Agent입니다. 배포 세부 정보에는 wxO Agent 이름, 타입, 연결된 플로우, 모델, 소속된 IBM watsonx Orchestrate 환경이 포함됩니다.

    Langflow에서 플로우 배포를 생성, 업데이트, 조회, 삭제하려면 **Deployments** 탭을 사용하세요.

- **Deployment Environments**:

    **Deployment Environment**는 Langflow가 배포할 수 있는 저장된 watsonx Orchestrate 대상입니다. 환경은 watsonx Orchestrate 테넌트의 연결 정보를 저장합니다.

    Langflow에서 IBM watsonx Orchestrate 환경을 연결, 조회, 연결 해제하려면 **Deployment Environments** 탭을 사용하세요.

    테넌트 자체를 관리하려면 IBM watsonx Orchestrate 대시보드를 사용하세요.

## 플로우에 요청 보내기[​](#send-requests-to-your-flow "플로우에 요청 보내기로 바로 가기")

플로우를 IBM watsonx Orchestrate에 배포한 후에는 Langflow 배포 실행 엔드포인트를 통해 wxO Agent와 채팅할 수 있습니다.

IBM watsonx Orchestrate에 배포된 플로우에는 `/run` 엔드포인트를 사용하지 마세요.
대신 실행을 시작하려면 `POST /api/v1/deployments/{deployment_id}/runs`를, 상태를 확인하려면 `GET /api/v1/deployments/{deployment_id}/runs/{run_id}`를 사용하세요.

엔드포인트 경로에는 `http://localhost:7860`과 같은 Langflow 서버 URL을 접두어로 붙여야 합니다.

`deployment_id`를 찾으려면 **Projects** 페이지로 이동해 **Deployments**를 클릭하고 배포를 선택하세요. 배포 세부 정보에 ID가 표시됩니다.

이 엔드포인트들은 `x-api-key` 헤더로 전달되는 Langflow API 키가 필요합니다. 생성 방법은 [API 키 및 인증](https://docs.langflow.org/api-keys-and-authentication)을 참조하세요.

### 배포 실행 생성 엔드포인트[​](#create-deployment-run-endpoint "배포 실행 생성 엔드포인트로 바로 가기")

**엔드포인트:** `POST /api/v1/deployments/{deployment_id}/runs`

**설명:** 배포된 wxO Agent의 실행을 시작하고, 상태를 폴링(poll)할 수 있는 제공자(provider) 소유의 실행 ID를 반환합니다.

#### 요청 예시[​](#example-request "요청 예시로 바로 가기")

- Python
- JavaScript
- curl

```python
import requests  

url = "http://LANGFLOW_SERVER_ADDRESS/api/v1/deployments/DEPLOYMENT_ID/runs"  

payload = {  
    "provider_data": {  
        "input": "Summarize today's tickets",  
        "thread_id": "thread-123"  
    }  
}  

headers = {  
    "Content-Type": "application/json",  
    "x-api-key": "LANGFLOW_API_KEY"  
}  

response = requests.post(url, json=payload, headers=headers)  
response.raise_for_status()  

print(response.json())  
```

#### 요청 본문[​](#request-body "요청 본문으로 바로 가기")

| 필드 | 타입 | 필수 여부 | 설명 |
| --------------------------- | -------- | -------- | ------------------------------------------------------------------ |
| `provider_data.input`      | `string` | 예      | 배포된 wxO Agent에 보낼 프롬프트나 메시지 내용입니다. |
| `provider_data.thread_id` | `string` | 아니오      | 기존 대화를 이어가기 위한 선택적 스레드 식별자입니다. |

#### 응답 예시[​](#example-response "응답 예시로 바로 가기")

```json
{  
  "deployment_id": "3ea34379-1f72-4a33-9f6e-9e3ca88365b5",  
  "provider_data": {  
    "id": "run-42",  
    "agent_id": "agent-123",  
    "thread_id": "thread-123",  
    "status": "accepted",  
    "result": null,  
    "started_at": null,  
    "completed_at": null,  
    "failed_at": null,  
    "cancelled_at": null,  
    "last_error": null  
  }  
}  
```

#### 응답 본문[​](#response-body "응답 본문으로 바로 가기")

응답에는 Langflow `deployment_id`와 제공자 소유의 실행 메타데이터를 담은 `provider_data` 객체가 반환됩니다.
실행 상태를 확인할 때 `run_id`로 `provider_data.id`를 사용하세요.

### 배포 실행 상태 조회 엔드포인트[​](#get-deployment-run-status-endpoint "배포 실행 상태 조회 엔드포인트로 바로 가기")

**엔드포인트:** `GET /api/v1/deployments/{deployment_id}/runs/{run_id}`

**설명:** 배포 실행의 현재 상태와 결과를 조회합니다.

#### 요청 예시[​](#example-request-1 "요청 예시로 바로 가기")

- Python
- JavaScript
- curl

```python
import requests  

url = "http://LANGFLOW_SERVER_ADDRESS/api/v1/deployments/DEPLOYMENT_ID/runs/RUN_ID"  

headers = {  
    "Content-Type": "application/json",  
    "x-api-key": "LANGFLOW_API_KEY"  
}  

response = requests.get(url, headers=headers)  
response.raise_for_status()  

print(response.json())  
```

#### 경로 매개변수[​](#path-parameters "경로 매개변수로 바로 가기")

| 매개변수 | 타입 | 필수 여부 | 설명 |
| ---------------- | -------- | -------- | ---------------------------------------------------------- |
| `deployment_id` | `uuid`   | 예      | 배포된 플로우의 Langflow 배포 ID입니다. |
| `run_id`        | `string` | 예      | `provider_data.id`로 반환된 제공자 소유의 실행 ID입니다. |

#### 응답 예시[​](#example-response-1 "응답 예시로 바로 가기")

```json
{  
  "deployment_id": "3ea34379-1f72-4a33-9f6e-9e3ca88365b5",  
  "provider_data": {  
    "id": "run-42",  
    "agent_id": "agent-123",  
    "thread_id": "thread-123",  
    "status": "completed",  
    "result": {  
      "output": "Here is your summary..."  
    },  
    "started_at": "2026-04-03T12:40:00Z",  
    "completed_at": "2026-04-03T12:40:05Z",  
    "failed_at": null,  
    "cancelled_at": null,  
    "last_error": null  
  }  
}  
```

#### 응답 본문[​](#response-body-1 "응답 본문으로 바로 가기")

실행이 아직 처리 중인지 완료되었는지 확인하려면 `provider_data.status`를 확인하세요.
상태가 `completed`이면 `provider_data.result`에서 출력을 읽으세요.

`provider_data.status`가 `failed`인 경우, `provider_data.failed_at` 타임스탬프와 `provider_data.last_error` 필드에서 문제의 원인에 대한 세부 정보를 확인할 수 있습니다.
