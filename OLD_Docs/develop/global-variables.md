# 전역 변수

전역 변수를 사용하여 모든 플로우에서 자격증명과 일반 값을 저장하고 재사용합니다. 전역 변수는 일반적으로 플로우의 컴포넌트에서 사용되며, 전역 변수 아이콘이 있는 모든 필드에서 사용할 수 있습니다.

대조적으로 `LANGFLOW_PORT`나 `LANGFLOW_LOG_LEVEL`과 같은 [환경 변수](./environment-variables.md)는 일반적으로 Langflow 실행 방법을 구성하는 더 광범위한 설정을 위한 것입니다. 그러나 Langflow는 환경 변수에서 전역 변수를 가져올 수도 있습니다.

Langflow는 전역 변수를 내부 데이터베이스에 저장하고 비밀 키를 사용하여 값을 암호화합니다.

---

## 전역 변수 만들기

1. Langflow 헤더에서 프로필 아이콘을 클릭하고 **Settings**를 선택합니다.
2. **Global Variables**를 클릭합니다.
3. **Add New**를 클릭합니다.
4. **Create Variable** 대화상자에서 **Variable Name** 필드에 변수 이름을 입력합니다.
5. (선택 사항) 전역 변수의 **Type**을 선택합니다. **Generic**(기본값)과 **Credential** 두 가지 유형을 사용할 수 있습니다.

   Langflow는 **Generic** 및 **Credential** 유형 전역 변수를 모두 암호화합니다. 그러나 **Generic** 변수는 비주얼 에디터에서 마스킹되지 않는 반면 **Credential** 변수는 마스킹됩니다. **Session ID** 필드는 **Credential**(마스킹된) 변수를 허용하지 않습니다.

6. 전역 변수의 **Value**를 입력합니다.
7. (선택 사항) **Apply To Fields** 메뉴를 사용하여 Langflow가 전역 변수를 자동으로 적용할 하나 이상의 필드를 선택합니다. 예를 들어 **OpenAI API Key**를 선택하면 Langflow가 자동으로 모든 **OpenAI API Key** 필드에 변수를 적용합니다.
8. **Save Variable**을 클릭합니다.

**Globe** 아이콘이 표시되는 텍스트 입력 필드에서 전역 변수를 선택할 수 있습니다.

---

## 전역 변수 편집

1. Langflow 헤더에서 프로필 아이콘을 클릭하고 **Settings**를 선택합니다.
2. **Global Variables**를 클릭합니다.
3. 편집할 전역 변수를 클릭합니다.
4. **Update Variable** 대화상자에서 **Variable Name**, **Value**, **Apply To Fields**를 편집할 수 있습니다.
5. **Update Variable**을 클릭합니다.

---

## 전역 변수 삭제

전역 변수를 삭제하면 데이터베이스에서 값이 영구적으로 삭제됩니다. 삭제된 전역 변수를 참조하는 플로우는 실패합니다.

1. Langflow 헤더에서 프로필 아이콘을 클릭하고 **Settings**를 선택합니다.
2. **Global Variables**를 클릭합니다.
3. 삭제할 전역 변수 옆의 체크박스를 클릭합니다.
4. **Delete**를 클릭합니다.

---

## 환경에서 커스텀 전역 변수 추가

Langflow는 런타임 환경에서 커스텀 전역 변수를 가져올 수 있습니다.

Langflow는 일치하는 환경 변수를 감지하면 [`constants.py`](https://github.com/langflow-ai/langflow/blob/main/src/backend/base/langflow/services/settings/constants.py)를 기반으로 전역 변수를 자동으로 생성합니다. 예를 들어 런타임 환경에 `OPENAI_API_KEY`를 설정하면 Langflow가 자동으로 해당 값을 사용하여 전역 변수를 생성합니다.

`LANGFLOW_VARIABLES_TO_GET_FROM_ENVIRONMENT`에 추가 변수를 선언할 수 있습니다:

```
# 쉼표로 구분된 문자열 (공백 없음)
LANGFLOW_VARIABLES_TO_GET_FROM_ENVIRONMENT=VARIABLE1,VARIABLE2

# 또는 JSON 목록 형식
LANGFLOW_VARIABLES_TO_GET_FROM_ENVIRONMENT=["VARIABLE1", "VARIABLE2"]
```

Langflow를 `.env` 파일로 시작하려면:

```bash
uv run langflow run --env-file .env
```

**Docker에서:**

```bash
docker run -it --rm \
   -p 7860:7860 \
   -e LANGFLOW_VARIABLES_TO_GET_FROM_ENVIRONMENT="VARIABLE1,VARIABLE2" \
   -e VARIABLE1="VALUE1" \
   -e VARIABLE2="VALUE2" \
   langflowai/langflow:latest
```

환경에서 가져온 전역 변수는 **Credential** 유형으로 할당되어 비주얼 에디터에서 값이 마스킹됩니다.

---

## 환경에서 전역 변수 비허용

환경에서 전역 변수를 가져오는 것을 명시적으로 방지하려면 `.env` 파일에서 `LANGFLOW_STORE_ENVIRONMENT_VARIABLES=False`를 설정합니다.

---

## 누락된 전역 변수에 환경 변수 사용

전역 변수에 대한 대체 값을 환경 변수로 자동 설정하려면 `.env` 파일에서 `LANGFLOW_FALLBACK_TO_ENV_VAR=True`를 설정합니다. 이 설정이 활성화되면 전역 변수가 없을 때 Langflow는 동일한 이름의 환경 변수를 백업으로 사용하려고 합니다.

예를 들어 다음 Langflow `.env` 구성이 있고 플로우에 `WATSONX_API_KEY` 전역 변수를 예상하는 컴포넌트가 있는 경우:

```
LANGFLOW_FALLBACK_TO_ENV_VAR=True
WATSONX_PROJECT_ID=your_project_id
WATSONX_API_KEY=your_api_key
```

플로우를 실행할 때 `WATSONX_API_KEY`라는 전역 변수가 없으면 Langflow는 `WATSONX_API_KEY`라는 환경 변수를 찾습니다.

---

## 참고 항목

- [환경 변수](./environment-variables.md)
- [API 키 및 인증](./api-keys-and-authentication.md)

---

*원문: https://docs.langflow.org/next/configuration-global-variables*
