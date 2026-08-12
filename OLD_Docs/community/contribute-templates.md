# 템플릿 기여하기

Langflow에 템플릿을 제출할 때 이러한 모범 사례를 따릅니다.

템플릿 형식 예시는 Langflow 저장소의 [`/starter_projects`](https://github.com/langflow-ai/langflow/tree/main/src/backend/base/langflow/initial_setup/starter_projects)를 참조하세요.

---

## 템플릿 제출을 위한 PR 만들기

1. GitHub에서 [Langflow 저장소](https://github.com/langflow-ai/langflow)를 포크합니다.
2. 포크에서 `/starter_projects`에 `template.json` 파일을 추가합니다.
3. [템플릿 제출에 필요한 항목](#템플릿-제출에-필요한-항목)을 포함합니다.
4. 포크에서 메인 Langflow 저장소로 풀 리퀘스트(PR)를 만듭니다.
5. PR에 템플릿의 스크린샷을 포함합니다.

---

## 템플릿 제출에 필요한 항목

### 이름

템플릿 이름은 간결하고 세 단어 이하여야 합니다. 각 단어의 첫 글자만 대문자로 합니다. 예: **Blog Writer** 또는 **Travel Planning Agent**.

### 설명

사용자가 템플릿의 목적과 사용 사례를 이해하는 데 도움이 되는 간결하고 유익한 설명입니다:

```json
"description": "지침과 참조 기사에서 맞춤화된 블로그 게시물을 자동 생성합니다."
```

### 아이콘

[Lucide](https://lucide.dev/icons/) 아이콘 라이브러리의 아이콘을 사용합니다.

### 플로우

**Core 컴포넌트** 및 **Bundles**만 사용합니다. Langflow 코드베이스에 없는 커스텀 컴포넌트는 사용하지 않습니다.

**Note**에 간략한 README, 빠른 시작 또는 기타 필수 세부 정보를 포함합니다. Note는 Markdown 구문을 지원합니다.

### 형식

JSON 형식으로 템플릿을 제출합니다.

### 태그

다음 카테고리 중 하나에 템플릿을 할당합니다:

- Assistants
- Classification
- Coding
- Content Generation
- Q&A
- Prompting
- RAG
- Agents

---

*원문: https://docs.langflow.org/next/contributing-templates*
