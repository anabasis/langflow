# 전역 변수

> 원문: https://docs.langflow.org/next/configuration-global-variables

전역 변수를 사용하여 모든 플로우에서 자격 증명과 일반 값을 저장하고 재사용하세요.
전역 변수는 일반적으로 플로우 안의 컴포넌트에서 사용되며, 전역 변수 아이콘이 있는 모든 필드에서 사용할 수 있습니다.

이와 대조적으로, [환경 변수](https://docs.langflow.org/environment-variables)(`LANGFLOW_PORT`, `LANGFLOW_LOG_LEVEL` 등)는 일반적으로 Langflow가 실행되는 방식을 구성하는 더 넓은 범위의 설정에 사용됩니다.
그러나 Langflow는 환경 변수로부터 전역 변수를 가져올 수도 있습니다.

Langflow는 전역 변수를 내부 데이터베이스에 저장하며, 비밀 키를 사용해 값을 암호화합니다.

## 전역 변수 생성[​](#create-a-global-variable "Direct link to Create a global variable")

새 전역 변수를 생성하려면 다음 단계를 따르세요.

1. Langflow 헤더에서 프로필 아이콘을 클릭한 다음 **Settings**를 선택합니다.

2. **Global Variables**를 클릭합니다.

3. **Add New**를 클릭합니다.

4. **Create Variable** 대화 상자에서 **Variable Name** 필드에 변수 이름을 입력합니다.

5. 선택 사항: 전역 변수의 **Type**을 선택합니다. 사용 가능한 유형은 **Generic**(기본값)과 **Credential**입니다.

    Langflow는 **Generic**과 **Credential** 유형의 전역 변수를 모두 암호화합니다.
    그러나 **Generic** 변수는 시각적 편집기에서 마스킹되지 않는 반면, **Credential** 변수는 마스킹됩니다. **Session ID** 필드는 **Credential**(마스킹된) 변수를 허용하지 않습니다.

6. 전역 변수의 **Value**를 입력합니다.

7. 선택 사항: **Apply To Fields** 메뉴를 사용하여 Langflow가 전역 변수를 자동으로 적용할 하나 이상의 필드를 선택합니다. 예를 들어, **OpenAI API Key**를 선택하면 Langflow는 모든 **OpenAI API Key** 필드에 해당 변수를 자동으로 적용합니다.

8. **Save Variable**을 클릭합니다.

이제 **Globe** 아이콘이 표시되는 모든 텍스트 입력 필드에서 전역 변수를 선택할 수 있습니다.

## 전역 변수 편집[​](#edit-a-global-variable "Direct link to Edit a global variable")

1. Langflow 헤더에서 프로필 아이콘을 클릭한 다음 **Settings**를 선택합니다.

2. **Global Variables**를 클릭합니다.

3. 편집하려는 전역 변수를 클릭합니다.

4. **Update Variable** 대화 상자에서 **Variable Name**, **Value**, **Apply To Fields** 필드를 편집할 수 있습니다.

5. **Update Variable**을 클릭합니다.

## 전역 변수 삭제[​](#delete-a-global-variable "Direct link to Delete a global variable")

전역 변수를 삭제하면 데이터베이스에서 값이 영구적으로 삭제됩니다.
삭제된 전역 변수를 참조하는 플로우는 실패합니다.

1. Langflow 헤더에서 프로필 아이콘을 클릭한 다음 **Settings**를 선택합니다.

2. **Global Variables**를 클릭합니다.

3. 삭제하려는 전역 변수 옆의 체크박스를 클릭합니다.

4. **Delete**를 클릭합니다.

전역 변수가 데이터베이스에서 삭제됩니다.

## 환경으로부터 사용자 정의 전역 변수 추가[​](#add-custom-global-variables-from-the-environment "Direct link to Add custom global variables from the environment")

Langflow는 런타임 환경으로부터 사용자 정의 전역 변수를 가져올 수 있습니다.
Langflow가 환경 변수를 감지하고 적용하는 방법에 대한 정보는 [Langflow 환경 변수](https://docs.langflow.org/environment-variables)를 참조하세요.

Langflow는 일치하는 환경 변수를 감지하면 [`constants.py`](https://github.com/langflow-ai/langflow/blob/main/src/lfx/src/lfx/services/settings/constants.py)를 기반으로 전역 변수를 자동으로 생성합니다.
예를 들어, 런타임 환경에 `OPENAI_API_KEY`를 설정하면 Langflow는 해당 값을 사용해 전역 변수를 자동으로 생성합니다.

`LANGFLOW_VARIABLES_TO_GET_FROM_ENVIRONMENT`에 추가 변수를 선언할 수 있습니다.
예를 들어, `LANGFLOW_VARIABLES_TO_GET_FROM_ENVIRONMENT=WATSONX_PROJECT_ID,WATSONX_API_KEY`는 Langflow 데이터베이스에 `WATSONX_PROJECT_ID`와 `WATSONX_API_KEY`라는 이름의 전역 변수를 생성합니다.
이후 컴포넌트 설정에서 필요한 곳 어디서든 이 변수들을 사용할 수 있습니다.

- 로컬
- Docker

Langflow를 로컬에 설치했다면, Langflow `.env` 파일에서 `LANGFLOW_VARIABLES_TO_GET_FROM_ENVIRONMENT`를 설정하세요.

1. Langflow `.env` 파일을 생성하거나 편집합니다.

2. 다음과 같이 `LANGFLOW_VARIABLES_TO_GET_FROM_ENVIRONMENT` 환경 변수를 추가합니다.

    변수는 공백 없는 쉼표 구분 문자열이나 JSON 목록 형식으로 지정할 수 있습니다.

  ```
  # Option 1: Comma-separated string (no spaces)
  LANGFLOW_VARIABLES_TO_GET_FROM_ENVIRONMENT=VARIABLE1,VARIABLE2
  
  # Option 2: JSON list format
  LANGFLOW_VARIABLES_TO_GET_FROM_ENVIRONMENT=["VARIABLE1", "VARIABLE2"]
  ```
    `VARIABLE1,VARIABLE2`를 Langflow가 환경에서 가져오길 원하는 추가 변수(예: `CUSTOM_API_KEY,INTERNAL_SERVICE_URL` 또는 `["CUSTOM_API_KEY", "INTERNAL_SERVICE_URL"]`)로 교체하세요.

3. 파일을 저장하고 닫습니다.

4. `.env` 파일로 Langflow를 시작합니다.

  ```
  uv run langflow run --env-file .env
  ```
    또는, 명령줄에서 직접 환경 변수를 설정할 수도 있습니다.

  ```
  VARIABLE1="VALUE1" VARIABLE2="VALUE2" uv run langflow run --env-file .env
  ```
    명령줄 변수는 `.env` 파일의 일치하는 변수를 재정의합니다.
    자신의 환경에 가장 적합한 방식으로 Langflow에 환경 변수를 노출하세요.

5. Langflow가 환경에서 전역 변수를 성공적으로 가져왔는지 확인합니다.

  1. Langflow 헤더에서 프로필 아이콘을 클릭한 다음 **Settings**를 선택합니다.

  2. **Global Variables**를 클릭하고, 환경 변수가 **Global Variables** 목록에 나타나는지 확인합니다.

Docker 옵션의 경우, 명령줄에서 직접 지정합니다.

```
-p 7860:7860 \
-e LANGFLOW_VARIABLES_TO_GET_FROM_ENVIRONMENT="VARIABLE1,VARIABLE2" \
-e VARIABLE1="VALUE1" \
-e VARIABLE2="VALUE2" \
langflowai/langflow:latest
```

또는 `.env` 파일을 사용하는 경우:

```
docker run -it --rm \
   -p 7860:7860 \
   --env-file .env \
   -e VARIABLE1="VALUE1" \
   -e VARIABLE2="VALUE2" \
   langflowai/langflow:latest
```

`LANGFLOW_VARIABLES_TO_GET_FROM_ENVIRONMENT`의 목록에는 변수 이름만 포함됩니다.
이 환경 변수들이 `-e` 옵션 등을 통해 Docker 환경에 정의되어 있는지 확인해야 합니다.

Langflow를 시작한 후, Langflow **Settings**로 이동하여 변수가 생성되었는지 확인하세요.

환경에서는 **Name**과 **Value**만 가져옵니다.
**Apply To Fields**와 같은 추가 옵션을 구성하고 싶다면 Langflow **Settings**에서 변수를 편집할 수 있습니다.

환경에서 가져온 전역 변수는 **Credential** 유형으로 지정되어 시각적 편집기에서 값이 마스킹됩니다.
그러나 Langflow는 데이터베이스에 저장된 *모든* 전역 변수를 자동으로 암호화합니다.

## 환경으로부터의 전역 변수 비허용[​](#disallow-global-variables-from-the-environment "Direct link to Disallow global variables from the environment")

Langflow가 환경으로부터 전역 변수를 가져오지 못하도록 명시적으로 막고 싶다면, `.env` 파일에서 `LANGFLOW_STORE_ENVIRONMENT_VARIABLES=False`를 설정하세요.

## 누락된 전역 변수에 환경 변수 사용[​](#use-environment-variables-for-missing-global-variables "Direct link to Use environment variables for missing global variables")

전역 변수의 대체 값을 환경 변수로 자동 설정하려면, `.env` 파일에서 `LANGFLOW_FALLBACK_TO_ENV_VAR=True`를 설정하세요.
이 설정이 활성화되면, 전역 변수를 찾을 수 없을 때 Langflow는 대체 수단으로 동일한 이름의 환경 변수를 사용하려고 시도합니다.

예를 들어, 다음과 같은 Langflow `.env` 구성이 있고, 플로우의 컴포넌트가 `WATSONX_API_KEY` 전역 변수를 요구한다고 가정해 보겠습니다.

```
LANGFLOW_FALLBACK_TO_ENV_VAR=True
WATSONX_PROJECT_ID=your_project_id
WATSONX_API_KEY=your_api_key
```

플로우를 실행할 때, `WATSONX_API_KEY`라는 전역 변수가 없으면 Langflow는 `WATSONX_API_KEY`라는 환경 변수를 찾습니다.
이 예시에서는 Langflow가 `.env`의 `WATSONX_API_KEY` 값을 사용하여 플로우를 실행합니다.
