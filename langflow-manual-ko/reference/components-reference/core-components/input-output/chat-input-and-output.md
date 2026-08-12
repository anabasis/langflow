# Chat Input과 Output

> 원문: https://docs.langflow.org/next/chat-input-and-output

warning

**Chat Input**과 **Chat Output** 컴포넌트는 **Playground**에서 플로우와 채팅하기 위해 반드시 필요합니다.
자세한 내용은 [Playground에서 플로우 테스트하기](https://docs.langflow.org/concepts-playground)를 참고하세요.

**Chat Input**과 **Chat Output** 컴포넌트는 Langflow에서 대화형 상호작용을 처리하도록 설계되었습니다.

## Chat Input[​](#chat-input "Direct link to Chat Input")

**Chat Input** 컴포넌트는 채팅 메시지나 파일과 같은 텍스트 및 파일 입력을 받습니다.
이 데이터는 발신자, 세션 ID, 타임스탬프, 첨부 파일 등의 관련 채팅 메타데이터와 함께 제공된 입력을 담은 [`Message` 데이터](https://docs.langflow.org/data-types)로 다른 컴포넌트에 전달됩니다.

초기 입력은 완전한 `Message` 객체 형태로 제공되어서는 *안 됩니다*. **Chat Input** 컴포넌트가 `Message` 객체를 생성한 후 이를 플로우 내 다른 컴포넌트로 전달하기 때문입니다.

### Chat Input 파라미터[​](#chat-input-parameters "Direct link to Chat Input parameters")

일부 파라미터는 시각적 편집기에서 기본적으로 숨겨져 있습니다.
컴포넌트를 선택했을 때 나타나는 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-inspection-panel)을 통해 모든 컴포넌트 파라미터를 수정할 수 있습니다.

| Name                   | Display Name     | Info                                                                                                             |
| ---------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| input\_value           | Input Text       | 입력 파라미터. 입력으로 전달할 메시지 텍스트 문자열입니다.                                                                  |
| sender                 | Sender Type      | 입력 파라미터. 발신자를 `User` 또는 `Language Model`로 식별합니다.                                                     |
| sender\_name           | Sender Name      | 입력 파라미터. 발신자의 이름입니다. 지정하지 않으면 기본값으로 `User` 또는 `Language Model`이 사용됩니다.                 |
| session\_id            | Session ID       | 입력 파라미터. 채팅 세션의 고유 식별자입니다. 비어 있으면 현재 세션 ID 파라미터가 사용됩니다. |
| files                  | Files            | 입력 파라미터. 메시지와 함께 전송할 파일입니다.                                                                          |
| background\_color      | Background Color | 입력 파라미터. 아이콘의 배경색입니다.                                                               |
| chat\_icon             | Icon             | 입력 파라미터. 메시지의 아이콘입니다.                                                                      |
| should\_store\_message | Store Messages   | 입력 파라미터. 메시지를 채팅 기록에 저장할지 여부입니다.                                                   |
| text\_color            | Text Color       | 입력 파라미터. 이름의 텍스트 색상입니다.                                                                   |

결과로 생성되는 `Message` 객체에 대한 정보, 그리고 `Message` 속성에 직접 매핑되는 입력 파라미터에 대한 정보는 [`Message` 데이터](https://docs.langflow.org/data-types#message)를 참고하세요.

**Chat Input을 위한 Message 메서드**

`ChatInput` 클래스는 입력 파라미터를 기반으로 `Message` 객체를 생성하고 저장하는 비동기 메서드를 제공합니다.
`Message` 객체는 `ChatInput` 클래스의 `message_response` 메서드에서 `Message.create()` 팩토리 메서드를 사용해 생성됩니다.

```python
message = await Message.create(  
    text=self.input_value,  
    sender=self.sender,  
    sender_name=self.sender_name,  
    session_id=self.session_id,  
    files=self.files,  
    properties={  
        "background_color": background_color,  
        "text_color": text_color,  
        "icon": icon,  
    },  
)  
```

## Chat Output[​](#chat-output "Direct link to Chat Output")

**Chat Output** 컴포넌트는 다른 컴포넌트로부터 `Message`, `JSON`, `Table` 데이터를 받아 필요한 경우 `Message` 데이터로 변환한 다음, 최종 출력을 채팅 메시지로 내보냅니다.
이러한 데이터 유형에 대한 자세한 내용은 [Langflow 데이터 유형 사용하기](https://docs.langflow.org/data-types)를 참고하세요.

**Playground**에서 채팅 출력은 텍스트 응답, 발신자 이름, 첨부 파일과 같이 채팅 인터페이스와 관련된 `Message` 객체의 일부로 제한됩니다.
채팅 메시지와 관련된 메타데이터를 확인하려면 **Playground**에서 메시지 로그를 검사하세요.

Langflow API를 사용할 때 API 응답에는 플로우 실행의 다른 응답 데이터와 함께 **Chat Output**의 `Message` 객체가 포함됩니다.
Langflow API 응답은 매우 장황할 수 있으므로, 애플리케이션에는 응답에서 사용자에게 반환할 관련 데이터를 추출하는 코드가 포함되어야 합니다.
예시는 [Langflow 퀵스타트](https://docs.langflow.org/get-started-quickstart)를 참고하세요.

### Chat Output 파라미터[​](#chat-output-parameters "Direct link to Chat Output parameters")

일부 파라미터는 시각적 편집기에서 기본적으로 숨겨져 있습니다.
컴포넌트를 선택했을 때 나타나는 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-inspection-panel)을 통해 모든 컴포넌트 파라미터를 수정할 수 있습니다.

| Name                   | Display Name     | Info                                                                                                                                                                           |
| ---------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| input\_value           | Inputs           | 입력 파라미터. 출력으로 전달할 메시지 텍스트 문자열입니다.                                                                                                               |
| should\_store\_message | Store Messages   | 입력 파라미터. 메시지를 채팅 기록에 저장할지 여부입니다.                                                                                                                 |
| sender                 | Sender Type      | 입력 파라미터. 발신자를 `User` 또는 `Language Model`로 식별합니다.                                                                                                   |
| sender\_name           | Sender Name      | 입력 파라미터. 발신자의 이름입니다. 지정하지 않으면 기본값으로 `User` 또는 `Language Model`이 사용됩니다.                                                               |
| session\_id            | Session ID       | 입력 파라미터. 채팅 세션의 고유 식별자입니다. 비어 있으면 현재 세션 ID 파라미터가 사용됩니다.                                                               |
| data\_template         | Data Template    | 입력 파라미터. [`JSON` 입력](https://docs.langflow.org/data-types#json)을 `text`로 변환하기 위한 템플릿입니다. 비어 있으면 `JSON` 객체의 `text` 키를 기준으로 동적으로 설정됩니다.                        |
| background\_color      | Background Color | 입력 파라미터. 아이콘의 배경색입니다.                                                                                                                             |
| chat\_icon             | Icon             | 입력 파라미터. 메시지의 아이콘입니다.                                                                                                                                      |
| text\_color            | Text Color       | 입력 파라미터. 이름의 텍스트 색상입니다.                                                                                                                                   |
| clean\_data            | Basic Clean Data | 입력 파라미터. 활성화하면 [`Table` 입력](https://docs.langflow.org/data-types#table)이 텍스트로 변환될 때 정리됩니다. 정리 과정에서는 빈 행, 셀 내의 빈 줄, 여러 개의 개행 문자가 제거됩니다. |

결과로 생성되는 `Message` 객체에 대한 정보, 그리고 `Message` 속성에 직접 매핑되는 입력 파라미터에 대한 정보는 [`Message` 데이터](https://docs.langflow.org/data-types#message)를 참고하세요.

## 플로우에서 Chat Input과 Output 컴포넌트 사용하기[​](#use-chat-input-and-output-components-in-a-flow "Direct link to Use Chat Input and Output components in a flow")

플로우에서 **Chat Input**과 **Chat Output** 컴포넌트를 사용하려면, [`Message` 데이터](https://docs.langflow.org/data-types#message)를 받거나 내보내는 컴포넌트에 연결하세요.

예를 들어 다음 플로우는 **Chat Input**과 **Chat Output**을 **Language Model** 컴포넌트에 연결하여 간단한 LLM 기반 채팅 플로우를 만듭니다.

![Chat Input과 Output 컴포넌트가 OpenAI 컴포넌트에 연결된 모습](https://docs.langflow.org/assets/images/component-chat-io-ae6252ae1ebc69b9c7ce74f33c251699.png)

tip

플로우 안에서 **Chat Input과 Output** 컴포넌트를 사용하는 자세한 예시는 다음을 참고하세요.

- [Langflow 퀵스타트](https://docs.langflow.org/get-started-quickstart): 기본적인 에이전트 플로우를 생성하고 실행합니다.
- **Basic Prompting** 템플릿: 채팅 입력과 함께, LLM에 대한 추가 지시 사항이 포함된 프롬프트를 받는 LLM 기반 채팅 플로우를 생성합니다. 다른 많은 Langflow 템플릿에서도 **Chat Input과 Output** 컴포넌트를 사용합니다.
- [애플리케이션을 에이전트에 연결하기](https://docs.langflow.org/agent-tutorial): 외부 애플리케이션에서 에이전트 플로우를 트리거하는 것을 포함하여, 에이전트 플로우와 프롬프트에 관한 좀 더 심화된 개념을 살펴봅니다.

### Langflow API로 채팅 입력 보내기[​](#send-chat-input-with-the-langflow-api "Direct link to Send chat input with the Langflow API")

Langflow API를 사용하여 **Chat Input** 컴포넌트에 입력을 보내 플로우를 실행할 수 있습니다.

```bash
curl --request POST \  
  --url "http://$LANGFLOW_SERVER_ADDRESS/api/v1/run/$FLOW_ID" \  
  --header "Content-Type: application/json" \  
  --header "x-api-key: $LANGFLOW_API_KEY" \  
  --data '{  
  "input_value": "What's the recommended way to install Docker on Mac M1?",  
  "output_type": "chat",  
  "input_type": "chat"  
}'  
```

Langflow API로 플로우를 트리거할 때 페이로드에는 `input_value`와 같은 **Chat Input** 컴포넌트의 입력 파라미터 값이 포함되어야 합니다.

요청에 모든 파라미터를 지정할 필요는 없습니다.
예를 들어 `session_id`가 생략되면 플로우의 기본 세션 ID가 사용됩니다.
커스텀 세션 ID를 사용하려면 요청에 `session_id`를 포함하세요.

```bash
curl --request POST \  
  --url "http://$LANGFLOW_SERVER_ADDRESS/api/v1/run/$FLOW_ID" \  
  --header "Content-Type: application/json" \  
  --header "x-api-key: $LANGFLOW_API_KEY" \  
  --data '{  
  "input_value": "Whats the recommended way to install Docker on Mac M1",  
  "session_id": "$USER_ID",  
  "output_type": "chat",  
  "input_type": "chat"  
}'  
```

자세한 내용은 [Langflow API로 플로우 트리거하기](https://docs.langflow.org/concepts-publish)를 참고하세요.
