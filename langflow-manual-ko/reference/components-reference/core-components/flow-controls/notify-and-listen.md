# Notify and Listen

> 원문: https://docs.langflow.org/next/notify-and-listen

**Notify**와 **Listen** 컴포넌트는 함께 사용됩니다.

**Notify** 컴포넌트는 현재 플로우의 컨텍스트로부터 알림을 생성하며, 여기에는 특정 데이터 콘텐츠와 상태 식별자가 포함됩니다.

생성된 알림은 **Listen** 컴포넌트로 전송됩니다.
알림 데이터는 이후 [**If-Else** 컴포넌트](https://docs.langflow.org/if-else)와 같은 플로우 내 다른 컴포넌트로 전달될 수 있습니다.
