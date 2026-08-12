# 커스텀 컴포넌트 차단하기
> 원문: https://docs.langflow.org/next/deployment-block-custom-components

커스텀 컴포넌트와 컴포넌트 코드 편집기를 사용하면 Langflow 사용자가 Langflow 런타임에서 Python 코드를 작성하고 실행할 수 있습니다.
이러한 자유도는 Langflow의 기능이지만, 일부 배포 환경에서는 임의 코드 실행을 방지하기 위해 커스텀 Langflow 컴포넌트 생성을 차단하고 싶을 수 있습니다.

Langflow 서버에서 커스텀 컴포넌트 생성을 차단하려면 다음 [환경 변수](https://docs.langflow.org/environment-variables)를 설정하세요.

```
LANGFLOW_ALLOW_CUSTOM_COMPONENTS=false
```

`false`로 설정하면 Langflow는 커스텀 컴포넌트 생성과 비주얼 편집기에서의 코드 변경을 차단합니다.

설정하지 않거나 `true`로 설정하면 Langflow는 커스텀 코드를 허용합니다.
기존 Langflow 설치본은 이 제한을 명시적으로 활성화(opt-in)하기 전까지는 기본값인 `true` 동작을 유지합니다.

이 환경 변수는 베타 기능이며, 프로덕션 환경에서 유일한 안전장치로 사용해서는 안 됩니다.

Langflow가 신뢰할 수 없는 코드나 LLM이 생성한 코드를 실행할 가능성이 있는 경우, 격리되고 컨테이너화된 실행 환경에서 Langflow를 실행하세요.

### 슈퍼유저로만 커스텀 컴포넌트 생성 제한하기[​](#restrict-custom-components-to-superusers "Direct link to Restrict custom component creation to superusers")

기본 제공(built-in) 컴포넌트는 일반 사용자도 계속 사용할 수 있도록 유지하면서 커스텀 컴포넌트 생성만 슈퍼유저로 제한하려면 다음 [환경 변수](https://docs.langflow.org/environment-variables)를 설정하세요.

```
LANGFLOW_CUSTOM_COMPONENT_ADMIN_ONLY=true
```

`true`로 설정하면, 슈퍼유저가 아닌 사용자도 플로우에서 커스텀 컴포넌트를 보고 사용할 수는 있지만, 새 커스텀 컴포넌트를 생성하거나 커스텀 컴포넌트 코드를 수정할 수는 없습니다.

## 커스텀 컴포넌트 허용 목록(allow-list) 구성하기[​](#configure-a-custom-component-allow-list "Direct link to Configure a custom component allow-list")

`LANGFLOW_ALLOW_CUSTOM_COMPONENTS`는 서버가 어떤 컴포넌트 템플릿을 로드할지, 그리고 어떤 코드 해시를 신뢰할지를 정의하는 선택적 경로들과 함께 동작합니다.

`LANGFLOW_COMPONENTS_PATH` 환경 변수에 나열된 디렉터리는 커스텀 컴포넌트로 로드되어 서버의 템플릿 세트에 병합됩니다.
`LANGFLOW_ALLOW_CUSTOM_COMPONENTS`가 `false`로 설정되어 있어도, `LANGFLOW_COMPONENTS_PATH` 디렉터리 내 컴포넌트는 **계속 허용**됩니다.

일부 컴포넌트는 허용하고 나머지는 차단하려면, 허용할 커스텀 컴포넌트 디렉터리를 `LANGFLOW_COMPONENTS_PATH`에 포함시키고 `LANGFLOW_ALLOW_CUSTOM_COMPONENTS`를 `false`로 설정하세요.

`LANGFLOW_COMPONENTS_INDEX_PATH`는 로컬 경로 또는 `http://` / `https://` URL에 있는 사전 빌드된 컴포넌트 인덱스 JSON 파일을 가리킵니다.
이 환경 변수는 `lfx` 패키지에 번들된 기본 인덱스를 대체합니다.
디스크의 디렉터리에서 Python 모듈을 임포트하는 것은 **아닙니다**.
커스텀 컴포넌트를 허용 목록에 등록하려면 `LANGFLOW_COMPONENTS_PATH` 환경 변수를 사용하세요.

두 환경 변수가 모두 설정된 경우, Langflow는 커스텀 인덱스와 `LANGFLOW_COMPONENTS_PATH` 양쪽에서 하나의 결합된 컴포넌트 세트를 구성합니다. 동일한 컴포넌트 카테고리 이름이 양쪽에 모두 존재하면, `LANGFLOW_COMPONENTS_PATH`가 커스텀 인덱스의 해당 카테고리 전체를 대체합니다.

### 허용 목록 우회 비활성화하기[​](#disable-the-allow-list-bypass "Direct link to Disable the allow-list bypass")

위의 허용 목록 동작은 관리자가 시작 시 설정되는 환경 변수를 통제한다는 전제를 따릅니다. 이 전제가 성립하지 않는 배포 환경에서는 다음을 설정하세요.

```
LANGFLOW_ALLOW_COMPONENTS_PATHS_OVERRIDE=false
```

이 값이 `false`이고 **동시에** `LANGFLOW_ALLOW_CUSTOM_COMPONENTS=false`인 경우, `LANGFLOW_COMPONENTS_PATH`와 `LANGFLOW_COMPONENTS_INDEX_PATH`가 제공하는 컴포넌트는 무시되며 더 이상 차단을 우회하지 못합니다.

기본값은 `true`이며, 이는 기존 동작을 그대로 유지합니다. `LANGFLOW_ALLOW_CUSTOM_COMPONENTS=true`인 동안에는 우회할 대상 자체가 없으므로 이 설정은 아무런 영향을 미치지 않습니다.

자세한 내용은 다음을 참조하세요.

- [환경 변수](https://docs.langflow.org/environment-variables#visual-editor-and-playground-behavior)
- [보안](https://docs.langflow.org/security)
</content>
