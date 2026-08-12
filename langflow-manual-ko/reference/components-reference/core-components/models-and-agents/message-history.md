# 메시지 기록

> 원문: https://docs.langflow.org/next/message-history

**Message History** 컴포넌트는 채팅 기록과 메시지 저장 기능을 결합하여 제공합니다.
[Langflow 저장소](https://docs.langflow.org/memory) *또는* Mem0나 Redis와 같은 전용 채팅 메모리 데이터베이스에서 채팅 메시지를 저장하고 검색할 수 있습니다.

팁

**Agent** 컴포넌트에는 기본적으로 활성화되어 Langflow 저장소를 사용하는 내장 채팅 메모리가 있습니다.
이 내장 채팅 메모리 기능은 대부분의 사용 사례에 충분합니다.

**Message History** 컴포넌트는 다음과 같은 사용 사례에 활용하세요.

- (에이전트가 아닌) 언어 모델 컴포넌트를 위해 채팅 메모리를 저장하고 검색해야 하는 경우.
- 최근 저장된 메모리를 검색하고 분석하는 감정 분석 플로우처럼, 채팅 맥락 밖에서 채팅 메모리를 검색해야 하는 경우.
- Langflow 저장소와는 별개인 특정 데이터베이스에 메모리를 저장하고 싶은 경우.

자세한 내용은 [채팅 메모리 저장하기](https://docs.langflow.org/memory#store-chat-memory)를 참조하세요.

## 플로우에서 Message History 컴포넌트 사용하기[​](#use-the-message-history-component-in-a-flow "Direct link to Use the Message History component in a flow")

**Message History** 컴포넌트에는 플로우 내에서 사용하려는 위치에 따라 두 가지 모드가 있습니다.

- **Retrieve 모드**: 컴포넌트가 Langflow 데이터베이스나 외부 메모리에서 채팅 메시지를 검색합니다.
- **Store 모드**: 컴포넌트가 Langflow 데이터베이스나 외부 메모리에 채팅 메시지를 저장합니다.

즉, 플로우에서 채팅 메시지를 저장하고 검색하는 것을 모두 수행하려면 여러 개의 **Message History** 컴포넌트가 필요합니다.

- Langflow 저장소 사용
- 외부 채팅 메모리 사용

다음 단계는 Langflow 설치의 데이터베이스에서 채팅 메모리를 저장하고 검색하기 위해 **Message History** 컴포넌트를 사용하는 채팅 기반 플로우를 만드는 방법을 설명합니다.

1. 채팅 메모리를 사용하고자 하는 플로우를 만들거나 편집합니다.

2. 플로우 초입에 **Message History** 컴포넌트를 추가한 다음, **Retrieve** 모드로 설정합니다.

3. 선택 사항: 메모리 정렬, 필터링, 제한 매개변수를 활성화하려면 **Message History** 컴포넌트를 클릭하여 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-menus)을 엽니다.

4. **Prompt Template** 컴포넌트를 추가하고, **Template** 필드에 `{memory}` 변수를 추가한 다음, **Message History** 출력을 **memory** 입력에 연결합니다.

    **Prompt Template** 컴포넌트는 **Chat Input** 컴포넌트를 통해 전달되는 채팅 메시지와는 별도로 LLM에 지시문과 컨텍스트를 제공합니다.
템플릿에는 LLM에 제공하려는 임의의 텍스트와 변수를 포함할 수 있습니다. 예를 들면 다음과 같습니다.

  
  ```
  You are a helpful assistant that answers questions.

  Use markdown to format your answer, properly embedding images and urls.

  History:

  {memory}
  ```

    템플릿 내 변수(`{variable}`)는 **Prompt Template** 컴포넌트에 필드를 동적으로 추가하여, 플로우가 다른 컴포넌트, Langflow 전역 변수, 런타임 입력 등 다른 출처로부터 해당 값의 정의를 받을 수 있게 합니다.
자세한 내용은 [프롬프트에서 변수 정의하기](https://docs.langflow.org/components-prompts#define-variables-in-prompts)를 참조하세요.

    이 예시에서 `{memory}` 변수는 검색된 채팅 메모리로 채워지며, 이는 **Language Model** 또는 **Agent** 컴포넌트에 전달되어 LLM에 추가 컨텍스트를 제공합니다.

5. **Prompt Template** 컴포넌트의 출력을 **Language Model** 컴포넌트의 **System Message** 입력에 연결합니다.

    이 예시에서는 **Language Model** 코어 컴포넌트를 중앙 채팅 드라이버로 사용하지만, 다른 언어 모델 컴포넌트나 **Agent** 컴포넌트를 사용할 수도 있습니다.

6. **Chat Input** 컴포넌트를 추가한 다음 **Language Model** 컴포넌트의 **Input** 필드에 연결합니다.

7. **Language Model** 컴포넌트의 출력을 **Chat Output** 컴포넌트에 연결합니다.

8. 플로우의 끝에 또 다른 **Message History** 컴포넌트를 추가한 다음 **Store** 모드로 설정합니다.

    두 번째 **Message History** 컴포넌트에서 필요한 추가 매개변수를 구성하되, 이 특정 컴포넌트는 메시지를 검색하는 것이 아니라 저장한다는 점을 고려하세요.

9. **Chat Output** 컴포넌트의 출력을 **Message History** 컴포넌트의 **Message** 입력에 연결합니다.

    LLM의 각 응답은 **Language Model** 컴포넌트에서 **Chat Output** 컴포넌트로 출력된 다음, 최종 **Message History** 컴포넌트에 의해 채팅 메모리로 저장됩니다.

```
Use markdown to format your answer, properly embedding images and urls.

History:

{memory}
```

템플릿 내 변수(`{variable}`)는 **Prompt Template** 컴포넌트에 필드를 동적으로 추가하여, 플로우가 다른 컴포넌트, Langflow 전역 변수, 런타임 입력 등 다른 출처로부터 해당 값의 정의를 받을 수 있게 합니다.
자세한 내용은 [프롬프트에서 변수 정의하기](https://docs.langflow.org/components-prompts#define-variables-in-prompts)를 참조하세요.

이 예시에서 `{memory}` 변수는 검색된 채팅 메모리로 채워지며, 이는 **Language Model** 또는 **Agent** 컴포넌트에 전달되어 LLM에 추가 컨텍스트를 제공합니다.

- **Prompt Template** 컴포넌트의 출력을 **Language Model** 컴포넌트의 **System Message** 입력에 연결합니다.

    이 예시에서는 **Language Model** 코어 컴포넌트를 중앙 채팅 드라이버로 사용하지만, 다른 언어 모델 컴포넌트나 **Agent** 컴포넌트를 사용할 수도 있습니다.

- **Chat Input** 컴포넌트를 추가한 다음 **Language Model** 컴포넌트의 **Input** 입력에 연결합니다.

- **Language Model** 컴포넌트의 출력을 **Chat Output** 컴포넌트에 연결합니다.

- 플로우의 끝에 **Message History**와 **Redis Chat Memory** 컴포넌트 쌍을 추가로 추가합니다.

  1. **Redis Chat Memory** 컴포넌트를 Redis 데이터베이스에 연결하도록 구성합니다.

  2. **Message History** 컴포넌트를 **Store** 모드로 설정합니다.

  3. **Message History**의 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-menus)에서 **External Memory**를 활성화합니다.

        이 컴포넌트는 메시지를 검색하는 것이 아니라 저장한다는 점을 고려하여 필요한 추가 매개변수를 구성하세요.

  4. **Redis Chat Memory** 컴포넌트를 **Message History** 컴포넌트의 **External Memory** 입력에 연결합니다.

- **Chat Output** 컴포넌트의 출력을 **Message History** 컴포넌트의 **Message** 입력에 연결합니다.

    LLM의 각 응답은 **Language Model** 컴포넌트에서 **Chat Output** 컴포넌트로 출력된 다음, 최종 **Message History**와 **Redis Chat Memory** 컴포넌트로 전달되어 채팅 메모리로 저장됩니다.

![Message History와 Redis Chat Memory 컴포넌트가 포함된 플로우](https://docs.langflow.org/assets/images/component-message-history-external-memory-7e32402d0b6e819f5539adfbfbd3620f.png)

## Message History 매개변수[​](#message-history-parameters "Direct link to Message History parameters")

일부 매개변수는 비주얼 에디터에서 기본적으로 숨겨져 있습니다.
컴포넌트를 선택했을 때 나타나는 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-inspection-panel)을 통해 모든 컴포넌트 매개변수를 수정할 수 있습니다.

사용 가능한 매개변수는 컴포넌트가 **Retrieve** 모드인지 **Store** 모드인지에 따라 달라집니다.

- Retrieve 모드
- Store 모드

| 이름                                  | 유형            | 설명                                                                                                                                            |
| ------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Template** (`template`)             | String          | 입력 매개변수. 데이터 형식을 지정하는 데 사용할 템플릿입니다. `{text}`, `{sender}` 또는 메시지 데이터 내 다른 어떤 키든 포함할 수 있습니다.       |
| **External Memory** (`memory`)        | External Memory | 입력 매개변수. 외부 메모리에서 메시지를 검색합니다. 비어 있으면 Langflow 저장소가 사용됩니다.                                                        |
| **Number of Messages** (`n_messages`) | Integer         | 입력 매개변수. 검색할 메시지 수입니다. 기본값: 100.                                                                                                     |
| **Order** (`order`)                   | String          | 입력 매개변수. 메시지의 순서입니다. 기본값: `Ascending`.                                                                                                      |
| **Sender Type** (`sender_type`)       | String          | 입력 매개변수. 발신자 유형으로 필터링합니다. `User`, `Machine`, 또는 (기본값인) `Machine and User` 중 하나입니다.                                                     |
| **Session ID** (`session_id`)         | String          | 입력 매개변수. 검색할 채팅 메모리의 [세션 ID](https://docs.langflow.org/session-id)입니다. 생략하거나 비워 두면 플로우 실행의 현재 세션 ID가 사용됩니다. |

## Message History 출력[​](#message-history-output "Direct link to Message History output")

메모리는 다음 두 형식 중 하나로 검색할 수 있습니다.

- **Message**: 메모리를 `Message` 객체로 검색합니다. 검색된 채팅 메시지 텍스트를 담은 `messages_text`가 포함됩니다.
이는 메모리를 *채팅 메시지로서* 다른 컴포넌트에 전달하는 데 사용되는 일반적인 출력 형식입니다.

- **DataFrame**: 메시지 데이터를 담은 `Table`로 메모리를 반환합니다.
채팅 메시지가 아니라 표 형식으로 메모리를 검색해야 하는 경우에 유용합니다.

컴포넌트의 출력 포트 근처에서 출력 유형을 설정할 수 있습니다.
