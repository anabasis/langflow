# Split Text

> 원문: https://docs.langflow.org/next/split-text

**Split Text** 컴포넌트는 청크 크기와 구분자 같은 파라미터를 기준으로 데이터를 청크(chunk)로 분할합니다.
주로 벡터 데이터베이스에 토큰화하고 임베딩할 데이터를 청크로 나눌 때 사용됩니다.
예시는 [플로우에서 임베딩 모델 컴포넌트 사용하기](https://docs.langflow.org/components-embedding-models#use-embedding-model-components-in-a-flow)와 [벡터 RAG 챗봇 만들기](https://docs.langflow.org/chat-with-rag)를 참고하세요.

![Split Text 컴포넌트를 사용하여 데이터를 청크로 분할하는 임베딩 생성 플로우](https://docs.langflow.org/assets/images/component-split-text-fec2b1abb28e0852c8a172bbeb164b2c.png)

이 컴포넌트는 `Message`, `JSON`, `Table`을 입력으로 받아 **Chunks** 또는 **DataFrame**을 출력합니다.
**Chunks** 출력은 개별 텍스트 청크를 담은 [`JSON`](https://docs.langflow.org/data-types#json) 객체의 목록을 반환합니다.
**DataFrame** 출력은 청크 목록을 `text`와 `metadata` 열이 추가된 구조화된 [`Table`](https://docs.langflow.org/data-types#table)로 반환합니다.

## Split Text 파라미터[​](#split-text-parameters "Direct link to Split Text parameters")

**Split Text** 컴포넌트의 파라미터, 구체적으로는 `chunk_size`, `chunk_overlap`, `separator` 파라미터가 텍스트가 청크로 분할되는 방식을 제어합니다.

청킹 동작을 테스트하려면 청크로 나눌 샘플 데이터가 있는 **Text Input** 또는 **Read File** 컴포넌트를 추가하고, **Split Text** 컴포넌트에서 **Run component**를 클릭한 다음 **Inspect output**을 클릭하여 청크 목록과 그 메타데이터를 확인하세요. **text** 열에는 청킹 설정에 따라 생성된 실제 텍스트 청크가 담겨 있습니다.
청크가 예상과 다르게 분할되었다면 파라미터를 조정한 다음 컴포넌트를 다시 실행하고 새 출력을 확인하세요.

일부 파라미터는 시각적 편집기에서 기본적으로 숨겨져 있습니다.
컴포넌트를 선택했을 때 나타나는 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-inspection-panel)을 통해 모든 컴포넌트 파라미터를 수정할 수 있습니다.

| Name            | Display Name   | Info                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data\_inputs    | Input          | 입력 파라미터. 분할할 데이터입니다. 입력은 `Message`, `JSON`, `Table` 형식이어야 합니다.                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| chunk\_overlap  | Chunk Overlap  | 입력 파라미터. 청크 간에 겹치도록 할 문자 수입니다. 청크 간 문맥을 유지하는 데 도움이 됩니다. 구분자를 만나면 겹침이 구분자 지점에서 적용되어, 다음 청크가 이전 청크의 마지막 *n*개 문자를 포함하게 됩니다. 기본값: `200`.                                                                                                                                                                                                                                         |
| chunk\_size     | Chunk Size     | 입력 파라미터. 분할 후 각 청크의 목표 길이입니다. 데이터는 먼저 구분자로 분할된 다음, `chunk_size`보다 작은 청크들이 이 한도까지 합쳐집니다. 다만 초기 구분자 분할 결과 `chunk_size`보다 큰 청크가 생기면, 해당 청크는 더 세분화되거나 다른 작은 청크와 합쳐지지 않고 `chunk_size`를 초과한 채로 그대로 출력됩니다. 기본값: `1000`. 중요한 고려 사항은 [청크 크기로 인한 토큰화 오류](#chunk-size)를 참고하세요. |
| separator       | Separator      | 입력 파라미터. 분할 기준이 되는 문자를 정의하는 문자열입니다. 예를 들어 개행 문자로 분할하려면 `\n`, 문단 구분으로 분할하려면 `\n\n`, JSON 객체의 끝에서 분할하려면 `},`를 사용할 수 있습니다. 구분자 문자열을 직접 입력하거나 다른 컴포넌트로부터 `Message` 입력으로 구분자 문자열을 전달받을 수 있습니다.                                                                                                                                                                                                                                    |
| text\_key       | Text Key       | 입력 파라미터. 입력에서 추출한 다음 분할할 텍스트 열에 사용할 키입니다. 기본값: `text`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| keep\_separator | Keep Separator | 입력 파라미터. 출력 청크에서 구분자를 어떻게 처리할지 선택합니다. `False`인 경우 출력 청크에서 구분자가 제거됩니다. 옵션은 `False`(구분자 제거), `True`(위치에 대한 선호 없이 청크 내에 구분자 유지), `Start`(청크 시작 부분에 구분자 배치), `End`(청크 끝 부분에 구분자 배치)입니다. 기본값: `False`.                                                                                                                                                                                                                                                              |

### 청크 크기로 인한 토큰화 오류[​](#chunk-size "Direct link to Tokenization errors due to chunk size")

**Split Text**를 임베딩 모델(특히 `nvidia/nv-embed-v1`과 같은 NVIDIA 모델)과 함께 사용할 때는, 모델이 더 큰 토큰 한도를 지원하더라도 더 작은 청크 크기(`500` 이하)를 사용해야 할 수 있습니다.
**Split Text** 컴포넌트는 설정한 정확한 청크 크기를 항상 강제하지는 않으며, 개별 청크가 지정한 한도를 초과할 수 있습니다.
토큰화 오류가 발생한다면, 청크 크기를 줄이거나, 겹침 길이를 변경하거나, 더 일반적인 구분자를 사용하는 방식으로 텍스트 분할 전략을 수정하세요.
그런 다음 플로우를 실행하고 컴포넌트의 출력을 확인하여 설정을 테스트하세요.

### 다른 텍스트 스플리터[​](#other-text-splitters "Direct link to Other text splitters")

[LangChain 텍스트 스플리터 컴포넌트](https://docs.langflow.org/bundles-langchain#text-splitters)를 참고하세요.
