# LLM Selector

> 원문: https://docs.langflow.org/next/llm-selector

tip

Langflow 1.7 이전에는 이 컴포넌트가 **LLM Router**라고 불렸습니다.

**LLM Selector** 컴포넌트는 [OpenRouter](https://openrouter.ai/docs/quickstart) 모델 사양을 기반으로 요청을 가장 적절한 LLM으로 라우팅합니다.

플로우에서 이 컴포넌트를 사용하려면, 여러 언어 모델 컴포넌트를 **LLM Selector** 컴포넌트에 연결합니다.
그중 하나의 모델은 입력 메시지를 분석하여 평가 컨텍스트를 파악하고, 연결된 다른 LLM 중 가장 적절한 모델을 선택한 다음, 입력을 선택된 모델로 라우팅하는 심사(judge) LLM입니다.
선택된 모델은 입력을 처리한 다음 생성된 응답을 반환합니다.

다음 예제 플로우에는 세 개의 언어 모델 컴포넌트가 있습니다.
하나는 심사 LLM이고, 나머지 두 개는 요청 라우팅을 위한 LLM 풀에 있습니다.
입력 및 출력 컴포넌트는 매끄러운 채팅 상호작용을 만들어, 메시지를 보내고 응답을 받는 과정에서 사용자가 기저의 라우팅을 인식하지 못하게 합니다.

![LLM Selector 컴포넌트](https://docs.langflow.org/assets/images/component-llm-router-1b417082a0208a70065bc177a78fab67.png)

## LLM Selector 파라미터[​](#llm-selector-parameters "Direct link to LLM Selector parameters")

기본적으로 일부 파라미터는 시각적 편집기에서 숨겨져 있습니다.
컴포넌트를 선택했을 때 표시되는 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-inspection-panel)을 통해 모든 컴포넌트 파라미터를 수정할 수 있습니다.

| Name                     | Display Name                | Info                                                                                                                                                                                                     |
| ------------------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `models`                 | **Language Models**         | 입력 파라미터. 여러 [언어 모델 컴포넌트](https://docs.langflow.org/components-models)에서 [`LanguageModel`](https://docs.langflow.org/data-types#languagemodel) 출력을 연결하여 모델 풀을 구성합니다. `judge_​llm`은 요청을 라우팅할 때 이 풀에서 모델을 선택합니다. 모델 선택이나 라우팅에 문제가 있는 경우, 처음 연결한 모델이 기본 모델로 사용됩니다. |
| `input_​value`           | **Input**                   | 입력 파라미터. 심사 LLM이 선택한 모델로 라우팅될 수신 쿼리입니다.                                                                                                                 |
| `judge_​llm`             | **Judge LLM**               | 입력 파라미터. *하나*의 **Language Model** 컴포넌트에서 `LanguageModel` 출력을 연결하여 요청 라우팅을 위한 심사 LLM으로 사용합니다.                                                                   |
| `optimization`           | **Optimization**            | 입력 파라미터. 심사 LLM이 모델을 선택할 때 선호할 특성을 설정합니다. 옵션은 `quality`(최고 응답 품질), `speed`(최고 응답 속도), `cost`(가장 비용 효율적인 모델), `balanced`(품질, 속도, 비용에 동일한 가중치)입니다. 기본값: `balanced` |
| `use_​openrouter_​specs` | **Use OpenRouter Specs**    | 입력 파라미터. OpenRouter API에서 모델 사양을 가져올지 여부입니다. `false`이면 심사 LLM에는 모델 이름만 제공됩니다. 기본값: 활성화(`true`)                                  |
| `timeout`                | **API Timeout**             | 입력 파라미터. 라우터가 수행하는 API 요청의 타임아웃 시간(초)을 설정합니다. 기본값: `10`                                                                                                    |
| `fallback_​to_​first`    | **Fallback to First Model** | 입력 파라미터. 라우팅이 선택된 모델에 도달하지 못한 경우, `models`의 첫 번째 LLM을 백업으로 사용할지 여부입니다. 기본값: 활성화(`true`)                                                            |

## LLM Selector 출력[​](#llm-selector-outputs "Direct link to LLM Selector outputs")

**LLM Selector** 컴포넌트는 세 가지 출력 옵션을 제공합니다.
컴포넌트의 출력 포트 근처에서 원하는 출력 타입을 설정할 수 있습니다.

- **Output**: 선택된 LLM이 생성한 원본 쿼리에 대한 응답이 포함된 `Message`입니다.
일반적인 채팅 상호작용에 이 출력을 사용하세요.

- **Selected Model Info**: 선택된 모델의 이름과 버전 등의 정보가 포함된 `JSON` 객체입니다.

- **Routing Decision**: 심사 모델이 특정 모델을 선택한 이유(입력 쿼리 길이, 고려된 모델 수 포함)를 담은 `Message`입니다.
예:

  
  

```text
Model Selection Decision:  
- Selected Model Index: 0  
- Selected Langflow Model Name: gpt-4o-mini  
- Selected API Model ID (if resolved): openai/gpt-4o-mini  
- Optimization Preference: cost  
- Input Query Length: 27 characters (~5 tokens)  
- Number of Models Considered: 2  
- Specifications Source: OpenRouter API  
```

    심사 모델이 최선의 모델을 선택하지 못한다고 느껴질 때 디버깅에 유용합니다.
