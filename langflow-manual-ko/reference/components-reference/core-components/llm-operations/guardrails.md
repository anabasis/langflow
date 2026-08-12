# Guardrails

> 원문: https://docs.langflow.org/next/guardrails

**Guardrails** 컴포넌트는 언어 모델(LLM)에 프롬프트를 전달하여 위반 사항을 확인함으로써 입력 텍스트를 보안 및 안전 가드레일에 대해 검증합니다.

다음 가드레일에 대해 검증할 수 있습니다.

- **PII**: 이름, 주소, 전화번호, 이메일 주소, 사회보장번호, 신용카드 번호 또는 기타 개인정보와 같은 개인 식별 정보를 탐지합니다.
- **Tokens/Passwords**: API 토큰, 비밀번호, API 키, 액세스 키, 시크릿 키, 인증 자격 증명 또는 기타 민감한 자격 증명을 탐지합니다.
- **Jailbreak**: AI 안전 지침을 우회하거나, 모델의 동작을 조작하거나, 지침을 무시하게 만드는 시도를 탐지합니다.
- **Offensive Content**: 공격적이거나 혐오적이거나 차별적이거나 폭력적이거나 부적절한 콘텐츠를 탐지합니다.
- **Malicious Code**: 잠재적으로 악의적인 코드, 스크립트, 익스플로잇 또는 유해한 명령을 탐지합니다.
- **Prompt Injection**: 악의적인 프롬프트를 주입하거나, 시스템 지침을 재정의하거나, 내장된 지침을 통해 AI의 동작을 조작하려는 시도를 탐지합니다.

검증을 통과하면 입력은 **Pass** 출력을 통해 계속 진행됩니다.
검증에 실패하면 입력은 차단되고 실패 사유를 설명하는 근거와 함께 **Fail** 출력을 통해 전송됩니다.

**Jailbreak**와 **Prompt Injection** 가드레일은 먼저 추가적인 휴리스틱 탐지를 수행한 다음, 필요한 경우 LLM 검증으로 넘어갑니다. 이 추가 단계는 명확한 패턴을 빠르게 식별하여 명백한 위반에 대한 불필요한 LLM 호출을 피함으로써 API 비용을 절감합니다.

**Guardrails** 컴포넌트는 언어 모델을 사용하여 입력을 분석하며, 오탐(false positive)을 만들거나 일부 위반 사항을 놓칠 수 있습니다.
이 컴포넌트는 유일한 안전장치로 사용하기보다는, 담당자 교육이나 리터럴 값 또는 정규식 패턴을 확인하는 스크립트와 같은 다른 데이터 정제 모범 사례와 **함께** 사용하세요.

## 플로우에서 Guardrails 컴포넌트 사용하기[​](#use-the-guardrails-component-in-a-flow "Direct link to Use the Guardrails component in a flow")

1. **Chat Input** 또는 다른 텍스트 소스를 **Guardrails** 컴포넌트의 **Input Text** 포트에 연결합니다.
2. 검증에 사용할 **Language Model**을 선택합니다. 컴포넌트는 연결된 LLM을 사용하여 활성화된 가드레일에 대해 입력 텍스트를 분석합니다.
3. **Guardrails** 드롭다운에서 활성화할 하나 이상의 가드레일을 선택합니다.
예를 들어 API 키와 자격 증명을 차단하려면 **Tokens/Passwords**를 선택합니다.
4. **Pass** 출력을 검증된 입력을 받을 컴포넌트에 연결합니다.
5. 선택적으로, 차단된 입력을 처리하기 위해 [**Chat Output** 컴포넌트](https://docs.langflow.org/chat-input-and-output)나 [**Write File** 컴포넌트](https://docs.langflow.org/write-file)와 같은 것에 **Fail** 출력을 연결합니다.

## 커스텀 가드레일 생성하기[​](#create-custom-guardrails "Direct link to Create custom guardrails")

**Enable Custom Guardrail** 파라미터를 사용하여 자신만의 특정 가드레일 검증을 생성하세요.
**Custom Guardrail Description** 필드에, 탐지하고자 하는 허용되지 않는 데이터에 대한 자연어 가드레일 설명을 입력합니다.

커스텀 가드레일은 기본 제공 가드레일과 동시에 작동할 수 있으며, 동일한 검증 프로세스를 따릅니다.

예를 들어 경쟁사 이름이나 제품을 언급하는 입력을 차단하려면, **Custom Guardrail Description** 필드에 다음을 입력합니다.

```text
competitor company names, competitor product names, or references to competing services  
```

이 커스텀 가드레일이 활성화되면, LLM은 입력 텍스트를 여러분이 설정한 기준에 따라 분석합니다. 경쟁사 언급과 같이 설명과 일치하는 콘텐츠가 감지되면 검증이 실패하고 입력이 차단됩니다. 그렇지 않으면 검증이 통과되고 입력은 **Pass** 출력을 통해 계속 진행됩니다.

## Guardrails 파라미터[​](#guardrails-parameters "Direct link to Guardrails parameters")

기본적으로 일부 파라미터는 시각적 편집기에서 숨겨져 있습니다.
컴포넌트를 선택했을 때 표시되는 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-inspection-panel)을 통해 모든 컴포넌트 파라미터를 수정할 수 있습니다.

| Name                                                            | Type             | Description                                                                                                                                                                                              |
| --------------------------------------------------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Language Model (`model`)                                        | `LanguageModel`  | 입력 파라미터. 이 컴포넌트의 드라이버로 사용할 **Language Model** 컴포넌트를 연결합니다. 모델은 데이터를 검토하고 가드레일과 비교하여 어떤 데이터가 가드레일을 위반하는지 판단합니다. |
| API Key (`api_​key`)                                            | Secret String    | 입력 파라미터. 모델 제공자 API 키입니다. 모델 제공자가 인증을 요구하는 경우 필수입니다.                                                                                                                            |
| Guardrails (`enabled_​guardrails`)                              | Multiselect      | 입력 파라미터. 입력을 검증할 하나 이상의 보안 가드레일을 선택합니다. 옵션: `PII`, `Tokens/Passwords`, `Jailbreak`, `Offensive Content`, `Malicious Code`, `Prompt Injection`. 기본값: `["PII", "Tokens/Passwords", "Jailbreak"]`. |
| Input Text (`input_​text`)                                      | Multiline String | 입력 파라미터. 가드레일에 대해 검증할 텍스트입니다. `Message` 입력 타입을 허용합니다.                                                                                                                 |
| Enable Custom Guardrail (`enable_​custom_​guardrail`)           | Boolean          | 입력 파라미터. 자체 검증 기준을 가진 커스텀 가드레일을 활성화합니다. 기본값: `false`.                                                                                                          |
| Custom Guardrail Description (`custom_​guardrail_​explanation`) | Multiline String | 입력 파라미터. 커스텀 가드레일이 확인해야 할 대상을 설명합니다. 이 설명은 LLM이 입력을 검증하는 데 사용됩니다. 탐지하고자 하는 대상을 구체적이고 명확하게 작성하세요. `enable_​custom_​guardrail`이 `true`일 때만 사용됩니다. |
| Heuristic Detection Threshold (`heuristic_​threshold`)          | Slider           | 입력 파라미터. 휴리스틱 jailbreak/prompt injection 탐지를 위한 점수 임계값(0.0-1.0)입니다. "ignore instructions", "jailbreak"와 같은 강력한 패턴은 높은 가중치를 가지며, "bypass", "act as"와 같은 약한 패턴은 낮은 가중치를 가집니다. 누적 점수가 이 임계값 이상이면 입력은 즉시 실패합니다. 값이 낮을수록 더 엄격해집니다. 값이 높을수록 더 많은 경우를 LLM 검증으로 넘깁니다. 기본값: `0.7`. |
