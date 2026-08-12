# Web Search

> 원문: https://docs.langflow.org/next/web-search

**Web Search** 컴포넌트는 **Web Search**, **News Search**, **RSS Reader** 컴포넌트를 하나의 컴포넌트로 통합하고, 서로 다른 검색 모드를 위한 탭을 제공합니다. DuckDuckGo를 통한 웹 검색, Google News 검색, RSS 피드 읽기를 모두 하나의 컴포넌트에서 수행할 수 있습니다.

다른 검색 API에 대해서는 [**번들**](https://docs.langflow.org/components-bundle-components)을 참고하세요.

정보

**Web Search** 컴포넌트는 웹 스크래핑을 사용하며, 이는 요청 빈도 제한(rate limit)의 영향을 받을 수 있습니다.

프로덕션 환경에서는 제공업체별 번들과 같이 더 견고한 API를 지원하는 다른 검색 컴포넌트를 사용하는 것을 고려하세요.

## 플로우에서 Web Search 컴포넌트 사용하기[​](#use-the-web-search-component-in-a-flow "Direct link to Use the Web Search component in a flow")

다음은 플로우에서 **Web Search** 컴포넌트를 사용하는 한 가지 방법을 보여줍니다.

1. **Basic Prompting** 템플릿을 기반으로 플로우를 생성합니다.

2. **Web Search** 컴포넌트를 추가하고, 원하는 **Search Mode**(Web, News, RSS)를 선택한 뒤 검색어 또는 RSS 피드 URL을 입력합니다.

3. [**Type Convert** 컴포넌트](https://docs.langflow.org/type-convert)를 추가하고 **Output Type**을 **Message**로 설정한 뒤, **Web Search** 컴포넌트의 출력을 **Type Convert** 컴포넌트의 입력에 연결합니다.

    기본적으로 **Web Search** 컴포넌트는 `Table`을 출력합니다.
**Prompt Template** 컴포넌트는 `Message` 데이터만 받아들이므로, 플로우가 검색 결과를 **Prompt Template** 컴포넌트에 전달할 수 있도록 이 변환이 필요합니다.
자세한 내용은 [Web Search 출력](#web-search-output)을 참고하세요.

4. **Prompt Template** 컴포넌트의 **Template** 필드에 `{searchresults}` 또는 `{context}`와 같은 변수를 추가합니다.

    이렇게 하면 변환된 검색 결과를 프롬프트에 전달하는 데 사용할 수 있는 필드가 **Prompt Template** 컴포넌트에 추가됩니다.
자세한 내용은 [프롬프트에서 변수 정의하기](https://docs.langflow.org/components-prompts#define-variables-in-prompts)를 참고하세요.

5. **Type Convert** 컴포넌트의 출력을 **Prompt Template** 컴포넌트의 새 변수 필드에 연결합니다.

    ![Type convert web search output to chat](https://docs.langflow.org/assets/images/component-type-convert-and-web-search-39a09775930134090eb60ff7f536b70e.png)

6. **Language Model** 컴포넌트에 OpenAI API 키를 추가하거나, 다른 제공업체와 모델을 선택합니다.

7. **Playground**를 클릭하고 쿼리를 입력합니다.

    LLM은 **Prompt Template** 컴포넌트를 통해 전달된 컨텍스트를 포함하여 요청을 처리하고, **Playground** 채팅 인터페이스에 응답을 출력합니다.

**결과**

다음은 가능한 응답의 예시입니다.
실제 응답은 웹의 현재 상태, 구체적인 쿼리, 모델 등 여러 요인에 따라 달라질 수 있습니다.

```
Here are some of the latest news articles related to the environment:

Ozone Pollution and Global Warming: A recent study highlights that ozone pollution is a significant global environmental concern, threatening human health and crop production while exacerbating global warming. Read more

...
```

## 파라미터[​](#parameters "Direct link to Parameters")

일부 파라미터는 비주얼 에디터에서 기본적으로 숨겨져 있습니다.
컴포넌트를 선택했을 때 나타나는 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-inspection-panel)을 통해 모든 컴포넌트 파라미터를 수정할 수 있습니다.

- Web Search Mode
- News Search Mode
- RSS Reader Mode

| 이름         | 표시 이름 | 설명                                                                                                                                                       |
| ------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| search\_mode | Search Mode  | 입력 파라미터. 검색 모드를 선택합니다: Web(DuckDuckGo), News(Google News), RSS(Feed Reader). 기본값: `Web`.                                             |
| query        | Search Query | 입력 파라미터. 검색할 키워드입니다.                                                                                                                     |
| timeout      | Timeout      | 입력 파라미터. 웹 검색 요청의 타임아웃(초). 기본값: `5`.                                                                                                |
| results      | Results      | 출력 파라미터. `title`, `link`, `snippet`, `content`를 포함하는 `Table`을 반환합니다. 자세한 내용은 [Web Search 출력](#web-search-output)을 참고하세요. |

## Web Search 출력[​](#web-search-output "Direct link to Web Search output")

**Web Search** 컴포넌트는 검색 모드에 따라 서로 다른 컬럼을 가진 [`Table`](https://docs.langflow.org/data-types#table)을 출력합니다.

- Web Search Mode
- News Search Mode
- RSS Reader Mode

**Web** 검색 모드를 사용할 경우, 컴포넌트는 다음을 포함하는 `Table`을 반환합니다.

- `title`: 검색 결과의 제목
- `link`: 검색 결과의 URL
- `snippet`: 검색 결과에서 발췌한 짧은 스니펫
- `content`: 페이지의 전체 콘텐츠(가져오기에 성공한 경우)
