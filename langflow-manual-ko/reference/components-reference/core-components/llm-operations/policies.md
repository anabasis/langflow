# Policies (Beta)

> 원문: https://docs.langflow.org/next/policies

**Policies** 컴포넌트는 [ToolGuard](https://github.com/AgentToolkit/toolguard)를 활용하여, 정의된 비즈니스 정책에 대해 도구 실행을 검증하는 가드 코드를 자동으로 생성합니다.

이 컴포넌트를 사용하면 개발자는 자연어로 비즈니스 정책을 정의하고 정책 시행을 에이전트 워크플로우에 통합할 수 있습니다. 이 컴포넌트는 해당 정책으로부터 도구에 대한 검증 코드를 자동으로 생성하고, 런타임에 정책 준수를 시행하여 도구 실행을 보호하며, 성능 향상을 위해 생성된 가드 코드를 캐싱합니다.

이 컴포넌트는 정책으로부터 새로운 가드 코드를 생성하기 위해 ToolGuard의 빌드타임 플로우를 실행하는 **Generate** 활동과, 더 빠른 실행을 위해 이전에 생성된 가드 코드를 재사용하는 **Guard** 활동을 지원합니다.

## 플로우에서 컴포넌트 사용하기[​](#use-the-component-in-a-flow "Direct link to Use the component in a flow")

`enabled`가 `true`인 경우, 가드를 생성하기 전에 최소 하나의 정책을 제공해야 합니다.
생성된 가드 코드는 `tmp_toolguard/{project_name}/` 아래에 작성되며, **Step 1**은 `Step_1/`에서 정책으로부터 가드 사양을 생성하고, **Step 2**는 해당 사양을 `Step_2/`에서 실행 가능한 가드 코드로 변환합니다.
캐시된 가드를 적용하는 **Guard**로 전환하는 경우, 프로젝트 디렉토리에는 이미 유효한 생성된 가드 코드가 있어야 합니다. 컴포넌트는 모듈 캐싱과 정리를 자동으로 처리합니다.

자세한 내용은 [ToolGuard GitHub 저장소](https://github.com/AgentToolkit/toolguard)를 참고하세요.

## Policies 파라미터[​](#policies-parameters "Direct link to Policies parameters")

| Name           | Type         | Description                                                                                                                                  |
| -------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| enabled        | Boolean      | 입력 파라미터. `true`이면 도구 실행 전에 ToolGuard가 실행되고, `false`이면 정책 검증이 건너뛰어집니다.                                  |
| mode           | String       | 입력 파라미터. **Activity**: **Generate**는 빌드타임을 실행하여 가드 코드를 생성하고, **Guard**는 프로젝트 폴더에서 기존 가드를 로드합니다. |
| project        | String       | 입력 파라미터. `tmp_toolguard/` 아래 생성된 코드의 폴더 이름입니다(기본값 `my_project`).                                               |
| in\_tools      | List[Tool]   | 입력 파라미터. 에이전트가 사용할 수 있는 도구이며, 활성화된 경우 정책 가드로 래핑됩니다.                                                  |
| policies       | List[String] | 입력 파라미터. 하나 이상의 명확하고 자체 완결적인 비즈니스 정책 문자열입니다. 가드를 생성할 때 필수입니다.                                                 |
| model          | Model        | 입력 파라미터. Policies 빌드타임에 사용되는 LLM입니다. Anthropic Claude Sonnet을 권장합니다. 가드를 생성할 때 필수입니다.                   |
| api\_key       | String       | 입력 파라미터. 모델 제공자 API 키입니다(고급). 가드를 생성할 때 필수입니다.                                                         |
| guarded\_tools | List[Tool]   | 출력 파라미터. 정책 시행이 적용된 도구입니다. 컴포넌트가 비활성화된 경우 원본 도구를 반환합니다.                          |
