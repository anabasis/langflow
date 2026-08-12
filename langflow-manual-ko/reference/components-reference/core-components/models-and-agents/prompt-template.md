# 프롬프트 템플릿

> 원문: https://docs.langflow.org/next/components-prompts

**Prompt Template** 코어 컴포넌트를 사용하면 채팅 메시지나 파일 업로드 같은 다른 입력과 별도로, LLM이나 에이전트에 지시문과 컨텍스트를 제공하는 *프롬프트*를 만들 수 있습니다.

프롬프트는 자연어, 고정 값, 동적 변수를 사용하여 LLM에 기본 컨텍스트를 제공하는 구조화된 입력입니다.
예를 들면 다음과 같습니다.

- 사용자 쿼리에 일관된 구조를 정의하여 LLM이 이해하고 적절히 응답하기 쉽게 만듭니다.
- LLM을 위한 특정 출력 형식(JSON 또는 구조화된 텍스트 등)을 정의합니다.
- `You are a helpful assistant` 또는 `You are an expert in microbiology`와 같이 LLM의 역할을 정의합니다.
- LLM이 채팅 메모리를 참조할 수 있도록 합니다.

**Prompt Template** 컴포넌트는 플로우 내 이후 단계의 다른 컴포넌트로 변수 지시문을 출력할 수도 있습니다.

## 프롬프트 템플릿 매개변수[​](#prompt-template-parameters "Direct link to Prompt Template parameters")

| 이름                  | 표시 이름        | 설명                                                                                                                                                                                              |
| --------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| template              | Template            | 입력 매개변수. `{VARIABLE_​NAME}`과 같이 중괄호로 감싼 동적 변수를 포함하는 프롬프트 템플릿을 만듭니다.<br>템플릿에 리터럴 텍스트와 변수가 함께 포함되어 있다면, 이중 중괄호를 사용하여 템플릿 내 리터럴 중괄호를 이스케이프하고 해당 텍스트가 변수로 해석되지 않도록 할 수 있습니다. 예: `This is a template with {{literal text in curly braces}} and a {variable}`.<br>JSON 구조와 같이 템플릿에 리터럴 중괄호가 많이 포함되어 있다면, 대신 Mustache 템플릿 사용을 고려하세요. 자세한 내용은 [프롬프트 템플릿에서 Mustache 템플릿 사용하기](https://docs.langflow.org/components-prompts#use-mustache-templating-in-prompt-templates)를 참조하세요. |
| use\_double\_brackets | Use Double Brackets | 활성화하면 f-string 문법 `{variable}` 대신 Mustache 문법 `{{variable}}`을 사용합니다. 자세한 내용은 [프롬프트 템플릿에서 Mustache 템플릿 사용하기](#use-mustache-templating-in-prompt-templates)를 참조하세요. |

## 프롬프트에서 변수 정의하기[​](#define-variables-in-prompts "Direct link to Define variables in prompts")

**Prompt Template** 컴포넌트의 변수는 컴포넌트에 필드를 동적으로 추가하여, 플로우가 다른 컴포넌트, Langflow 전역 변수, 또는 고정 입력으로부터 해당 값의 정의를 받을 수 있도록 합니다.

예를 들어 [**Message History** 컴포넌트](https://docs.langflow.org/message-history)와 함께 `{memory}` 변수를 사용하면 채팅 기록을 프롬프트에 전달할 수 있습니다.
다만 **Agent** 컴포넌트에는 기본적으로 활성화된 내장 채팅 메모리 기능이 있습니다. 자세한 내용은 [메모리 관리 옵션](https://docs.langflow.org/memory)을 참조하세요.

다음 단계는 **Prompt Template** 컴포넌트에 변수를 추가하는 방법을 보여줍니다.

1. **Basic prompting** 템플릿을 기반으로 플로우를 만듭니다.

    이 템플릿에는 이미 **Prompt Template** 컴포넌트가 있지만, 템플릿에는 다음 자연어 지시문만 포함되어 있습니다: `Answer the user as if you were a GenAI expert, enthusiastic about helping them get started building something fresh.`

    이 프롬프트는 LLM의 채팅 상호작용에서의 역할을 정의하지만, 사용자와 환경이 달라지는 등 변화하는 맥락에 동적으로 적응하는 프롬프트를 만드는 데 도움이 되는 변수는 포함하고 있지 않습니다.

2. **Prompt Template** 컴포넌트를 클릭한 다음, **Template** 필드에 변수를 몇 개 추가합니다.

    변수는 `{variable_name}`처럼 변수 이름을 중괄호로 감싸서 선언합니다.
예를 들어 다음 템플릿은 `context`와 `user_question` 변수를 만듭니다.

  
  

```text
Given the context:  

{context}  

Answer the question:  

{user_question}  
```

    템플릿에 리터럴 텍스트와 변수가 함께 포함되어 있다면, 이중 중괄호를 사용하여 템플릿 내 리터럴 중괄호를 이스케이프하고 해당 텍스트가 변수로 해석되지 않도록 할 수 있습니다.
예: `This is a template with {{literal text in curly braces}} and a {variable}`.

    JSON 구조와 같이 템플릿에 리터럴 중괄호가 많이 포함되어 있다면, 대신 Mustache 템플릿 사용을 고려하세요.
자세한 내용은 [프롬프트 템플릿에서 Mustache 템플릿 사용하기](https://docs.langflow.org/components-prompts#use-mustache-templating-in-prompt-templates)를 참조하세요.

3. **Check & Save**를 클릭하여 템플릿을 저장합니다.

    템플릿에 변수를 추가하면, 각 변수에 대해 **Prompt Template** 컴포넌트에 새 필드가 추가됩니다.

4. 변수 필드에 입력을 제공합니다.

  - 필드를 다른 컴포넌트에 연결하여 해당 컴포넌트의 출력을 변수로 전달합니다.
  - Langflow 전역 변수를 사용합니다.
  - 필드에 직접 고정 값을 입력합니다.

템플릿에는 원하는 만큼 변수를 추가할 수 있습니다.
예를 들어 `{references}`와 `{instructions}` 변수를 추가한 다음, **Text Input**, **URL**, **Read File** 컴포넌트 등 다른 컴포넌트에서 해당 정보를 공급할 수 있습니다.

### 프롬프트 템플릿에서 Mustache 템플릿 사용하기[​](#use-mustache-templating-in-prompt-templates "Direct link to Use Mustache templating in prompt templates")

F-string 이스케이프는 동일한 템플릿 내에서 이스케이프된 중괄호와 변수를 혼용할 때 헷갈릴 수 있습니다.
예를 들면 다음과 같습니다.

```text
Generate a response in this JSON format:  
{{"name": "{name}", "age": {age}, "city": "{city}"}}  

The user's name is {name}, age is {age}, and they live in {city}.  
```

`{{`와 `}}` 문자는 JSON 구조를 위한 이스케이프된 리터럴 중괄호이지만, `{name}`은 변수입니다.
이는 프롬프트를 오류에 취약하고 파싱하기 어렵게 만들 수 있습니다.
프롬프트 템플릿에서 [Mustache](https://mustache.github.io)를 사용하면 이러한 차이를 더 명확하게 만들 수 있습니다.

Mustache 템플릿을 활성화하려면 다음을 수행합니다.

1. **Prompt Template** 컴포넌트에서 **Use Double Brackets**를 활성화합니다.

2. 프롬프트 템플릿에서 변수를 `{variable}`에서 `{{variable}}`로 변경합니다.
Mustache는 리터럴 중괄호에 `{` `}`를, 변수에 `{{variable}}`을 사용합니다.

  
  

```text
Generate a response in this JSON format:  
{"name": "{{name}}", "age": {{age}}, "city": "{{city}}"}  

The user's name is {{name}}, age is {{age}}, and they live in {{city}}.  
```

3. **Check & Save**를 클릭합니다.
컴포넌트가 템플릿 코드를 린트하고, 오류가 없으면 **Prompt is ready**를 반환합니다.
이제 프롬프트를 플로우에서 사용할 준비가 되었습니다.

Langflow는 이중 중괄호를 이용한 변수 치환을 지원하지만, 전체 Mustache 엔진은 지원하지 않습니다.
프롬프트 컴포넌트의 검증 로직은 루프나 조건문과 같은 다른 Mustache 기능의 문법을 거부합니다.

## 참고 자료[​](#see-also "Direct link to See also")

- [**LangChain Prompt Hub** 컴포넌트](https://docs.langflow.org/bundles-langchain#prompt-hub)
- [프로세싱 컴포넌트](https://docs.langflow.org/concepts-components)
