# 커스텀 컴포넌트 차단

커스텀 컴포넌트와 컴포넌트 코드 편집기를 사용하면 Langflow 사용자가 Langflow 런타임에서 Python 코드를 만들고 실행할 수 있습니다. 이 자유는 Langflow의 기능이지만, 일부 배포에서는 임의의 코드 실행을 방지하기 위해 커스텀 Langflow 컴포넌트 생성을 차단할 수 있습니다.

---

## 커스텀 컴포넌트 차단

Langflow 서버에서 커스텀 컴포넌트 생성을 차단하려면 다음 [환경 변수](../develop/environment-variables.md)를 설정합니다:

```
LANGFLOW_ALLOW_CUSTOM_COMPONENTS=false
```

`false`로 설정하면 Langflow는 비주얼 에디터에서 커스텀 컴포넌트 생성 및 코드 변경을 차단합니다.

미설정이거나 `true`이면 커스텀 코드를 허용합니다.

> **참고**: 이 환경 변수는 베타 기능이며 프로덕션 환경에서 유일한 보안 수단이 되어서는 안 됩니다.

---

## 슈퍼유저로 커스텀 컴포넌트 생성 제한

비슈퍼유저가 내장 컴포넌트를 기능적으로 유지하면서 슈퍼유저로 커스텀 컴포넌트 생성을 제한하려면:

```
LANGFLOW_CUSTOM_COMPONENT_ADMIN_ONLY=true
```

`true`로 설정하면 일반 사용자는 플로우에서 커스텀 컴포넌트를 보고 사용할 수 있지만 새 커스텀 컴포넌트를 만들거나 코드를 편집할 수 없습니다.

---

## 커스텀 컴포넌트 허용 목록 구성

`LANGFLOW_ALLOW_CUSTOM_COMPONENTS`는 선택적 경로와 함께 작동합니다:

- **`LANGFLOW_COMPONENTS_PATH`**: 이 디렉토리에 나열된 디렉토리는 커스텀 컴포넌트로 로드됩니다. `LANGFLOW_ALLOW_CUSTOM_COMPONENTS=false`로 설정해도 이 경로의 컴포넌트는 **허용됩니다**.

일부 컴포넌트는 허용하고 다른 컴포넌트는 차단하려면 허용된 커스텀 컴포넌트 디렉토리를 `LANGFLOW_COMPONENTS_PATH`에 포함하고 `LANGFLOW_ALLOW_CUSTOM_COMPONENTS=false`를 설정합니다.

### 허용 목록 바이패스 비활성화

```
LANGFLOW_ALLOW_COMPONENTS_PATHS_OVERRIDE=false
```

`false`이고 `LANGFLOW_ALLOW_CUSTOM_COMPONENTS=false`인 경우, `LANGFLOW_COMPONENTS_PATH`와 `LANGFLOW_COMPONENTS_INDEX_PATH`가 제공하는 컴포넌트는 무시되어 차단을 더 이상 우회하지 않습니다.

---

## 참고 항목

- [환경 변수](../develop/environment-variables.md)
- [보안](./security.md)

---

*원문: https://docs.langflow.org/next/deployment-block-custom-components*
