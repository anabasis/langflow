# 템플릿 기여하기

> 원문: https://docs.langflow.org/next/contributing-templates

Langflow에 템플릿을 제출할 때는 다음 모범 사례를 따르세요.

템플릿 형식 예시는 Langflow 저장소의 [`/starter_projects`](https://github.com/langflow-ai/langflow/tree/main/src/backend/base/langflow/initial_setup/starter_projects)를 참고하세요.

## 템플릿 제출을 위한 PR 만들기[​](#create-a-pr-to-submit-your-template "Direct link to Create a PR to submit your template")

템플릿을 제출하려면 다음 단계를 따르세요.

1. GitHub에서 [Langflow 저장소](https://github.com/langflow-ai/langflow)를 포크합니다.
2. 여러분의 포크에서, `template.json` 파일을 `/starter_projects`에 추가합니다.
3. [템플릿 제출을 위한 필수 항목](#required-items-for-template-submission)을 포함합니다.
4. 여러분의 포크에서 메인 Langflow 저장소로 풀 리퀘스트(PR)를 만듭니다.
5. PR에 템플릿의 스크린샷을 포함합니다.

Langflow 팀이 여러분의 PR을 검토하고, 피드백을 제공하며, 승인되면 템플릿을 병합합니다.

## 템플릿 제출을 위한 필수 항목[​](#required-items-for-template-submission "Direct link to Required items for template submission")

템플릿을 제출할 때는 다음 항목을 포함하고 이 지침을 따르세요.

### 이름[​](#name "Direct link to Name")

템플릿 이름은 간결해야 하며 세 단어를 넘지 않아야 합니다.
각 단어의 첫 글자만 대문자로 표기하세요.
예: **Blog Writer** 또는 **Travel Planning Agent**.

### 설명[​](#description "Direct link to Description")

사용자가 템플릿의 목적과 사용 사례를 이해하는 데 도움이 되도록 비주얼 에디터에 표시되는 간결하고 유익한 설명.
예를 들면 다음과 같습니다.

```json
   "description": "Auto-generate a customized blog post from instructions and referenced articles.",
```

### 아이콘[​](#icons "Direct link to Icons")

[Lucide](https://lucide.dev/icons/) 아이콘 라이브러리의 아이콘을 사용하세요.

### 플로우[​](#flow "Direct link to Flow")

**Core components**와 **Bundles**만 사용하세요.
Langflow 코드베이스에 포함되지 않은 커스텀 컴포넌트는 사용하지 마세요.

**Note**에 간단한 README, 퀵스타트 또는 기타 필수 세부 사항을 포함하세요. Note는 Markdown 문법을 지원합니다.
예를 들면 다음과 같습니다.

```
# Financial Assistant Agents

The Financial Assistant Agent retrieves web content and writes reports about finance.

## Prerequisites

* [OpenAI API key](https://platform.openai.com/api-keys)
* [Tavily AI Search key](https://docs.tavily.com/welcome)
* [Sambanova API key](https://sambanova.ai/)

## Quickstart

1. In both **Agent** components, add your OpenAI API key.
2. In the **Model Provider** field, select **Sambanova**, and select a model.
3. In the **Sambanova** component, add your **Sambanova API key**.
4. In the **Tavily Search** component, add your **Tavily API key**.
5. Click the **Playground** and ask `Why did Nvidia stock drop in January?`
```

### 형식[​](#format "Direct link to Format")

템플릿은 JSON 형식으로 제출하세요.

### 태그[​](#tags "Direct link to Tags")

템플릿을 다음 카테고리 중 하나에 지정하세요.

- Assistants
- Classification
- Coding
- Content Generation
- Q&A
- Prompting
- RAG
- Agents

자세한 내용은 Langflow 저장소의 [템플릿 카테고리](https://github.com/langflow-ai/langflow/blob/main/src/frontend/src/modals/templatesModal/index.tsx#L27-L57)를 참고하세요.
