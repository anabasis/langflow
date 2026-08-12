# Human-in-the-Loop
> 원문: https://docs.langflow.org/next/human-in-the-loop

Human-in-the-Loop(HITL)는 flow를 일시 정지하고, 체크포인트를 생성한 다음, 사람의 결정을 기다립니다.

승인하거나 거부한 후 flow 실행은 선택된 분기를 사용해 체크포인트부터 재개됩니다.
이전에 완료된 단계는 다시 실행되지 않습니다.

flow에 HITL 게이트를 포함하려면 [**Human Input** 컴포넌트](https://docs.langflow.org/next/human-input)를 추가하거나, Agent 컴포넌트를 구성해 [에이전트 도구에 대한 승인을 요구](https://docs.langflow.org/next/agents-tools#require-approval-for-agent-tools)하도록 하세요.

예를 들어 Python 코드를 작성하는 에이전트를 빌드하는 중이고, 그 도구 중 하나가 Git에 코드를 커밋할 수 있다고 가정해봅시다.

**Human Input** 컴포넌트는 컴포넌트를 배치한 위치에서 flow를 일시 정지하고, 구성된 **User Action**마다 하나의 출력 분기를 생성합니다.
코드 생성 단계 이후에 컴포넌트를 배치하면, 사람이 **Approve** 또는 **Reject** 사용자 작업을 선택합니다.
사람이 **Approve**를 선택하면 flow는 커밋 단계로 계속되고, **Reject**를 선택하면 flow는 초안을 수정을 위해 되돌려 보냅니다.
자세한 내용은 [**Human Input** 컴포넌트](https://docs.langflow.org/next/human-input)를 참고하세요.

**Agent** 도구 승인은 Git 커밋 도구에 대해서만 **Requires approval**을 활성화합니다.
에이전트가 해당 도구를 호출하려고 할 때 실행이 일시 정지되지만 분기는 추가되지 않습니다.
자세한 내용은 [에이전트 도구에 대한 승인 요구하기](https://docs.langflow.org/next/agents-tools#require-approval-for-agent-tools)를 참고하세요.

## flow에서 HITL 사용하기[​](#use-hitl-in-a-flow "Direct link to Use HITL in a flow")

비디오 예시는 [Langflow 1.11 릴리스 블로그](https://www.langflow.org/blog/langflow-1-11)를 참고하세요.

## 참고 자료[​](#see-also "Direct link to See also")

- [Human Input 컴포넌트](https://docs.langflow.org/next/human-input)
- [에이전트](https://docs.langflow.org/next/components-agents)
