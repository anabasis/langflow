# Run Flow

> 원문: https://docs.langflow.org/next/run-flow

**Run Flow** 컴포넌트는 다른 Langflow 플로우를 현재 플로우의 서브프로세스로 실행합니다.

이 컴포넌트를 사용하여 여러 플로우를 연쇄적으로 연결하거나, 조건부로 플로우를 실행하거나, 필요에 따라 실행되는 [에이전트용 도구](https://docs.langflow.org/agents-tools)로 [**Agent** 컴포넌트](https://docs.langflow.org/components-agents)에 플로우를 연결할 수 있습니다.

에이전트와 함께 사용할 때, 에이전트가 도구를 등록하는 데 사용하는 `name`과 `description` 메타데이터는 자동으로 생성됩니다.

**Run Flow** 컴포넌트에서 플로우를 선택하면, 대상 플로우의 그래프 구조를 사용하여 **Run Flow** 컴포넌트에 입력 및 출력 필드를 동적으로 생성합니다.

warning

대상 플로우는 Human-in-the-Loop를 사용할 수 없습니다. 연결된 **Human Input** 노드가 포함된 플로우나 승인이 필요한 에이전트 도구는, 중첩 실행이 결정을 위해 일시 중지될 수 없기 때문에 오류와 함께 거부됩니다. 승인 단계는 상위 플로우에 배치하세요.

## Run Flow 파라미터[​](#run-flow-parameters "Direct link to Run Flow parameters")

기본적으로 일부 파라미터는 시각적 편집기에서 숨겨져 있습니다.
컴포넌트를 선택했을 때 표시되는 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-inspection-panel)을 통해 모든 컴포넌트 파라미터를 수정할 수 있습니다.

| Name                 | Type                                              | Description                                                                                                           |
| -------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| flow\_name\_selected | Dropdown                                          | 입력 파라미터. 실행할 플로우의 이름입니다.                                                                                         |
| session\_id          | String                                            | 입력 파라미터. 서브플로우에 커스텀 세션 ID를 전달하고 싶은 경우, 플로우 실행에 사용할 세션 ID입니다.            |
| flow\_tweak\_data    | Dict                                              | 입력 파라미터. 플로우의 동작을 사용자 지정하기 위한 조정값(tweak) 딕셔너리입니다. 사용 가능한 조정값은 선택한 플로우에 따라 다릅니다. |
| dynamic inputs       | Various                                           | 입력 파라미터. 선택한 플로우를 기준으로 추가 입력이 생성됩니다.                                                                          |
| run\_outputs         | A `List` of types (`JSON`, `Message`, or `Table`) | 출력 파라미터. 플로우를 실행하여 생성된 모든 출력입니다.                                                                    |
