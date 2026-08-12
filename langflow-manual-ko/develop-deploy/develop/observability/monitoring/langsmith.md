# LangSmith

> 원문: https://docs.langflow.org/next/integrations-langsmith

LangSmith는 모니터링과 관측성(observability)을 제공하는 LangChain의 풀 라이프사이클 DevOps 서비스입니다. Langflow와 통합하려면 LangChain API 키와 구성을 Langflow 환경 변수로 추가한 다음 Langflow를 시작하세요.

1. [https://smith.langchain.com](https://smith.langchain.com/)에서 LangChain API 키를 발급받습니다.

2. Langflow `.env` 파일에 다음 환경 변수를 설정하고, `LANGCHAIN_API_KEY`와 `LANGSMITH_PROJECT_NAME`을 자신의 값으로 교체합니다.

```text
LANGSMITH_TRACING=True
LANGSMITH_ENDPOINT=https://api.smith.langchain.com/
LANGSMITH_API_KEY=LANGCHAIN_API_KEY
LANGSMITH_PROJECT=LANGSMITH_PROJECT_NAME
```

    또는 `.env` 파일에 추가하는 대신 터미널에서 환경 변수를 export할 수도 있습니다.

```bash
export LANGSMITH_TRACING=True && export LANGSMITH_ENDPOINT="https://api.smith.langchain.com/" && export LANGSMITH_API_KEY="LANGCHAIN_API_KEY" && export LANGSMITH_PROJECT="LANGSMITH_PROJECT_NAME"
```

3. 수정한 `.env` 파일 또는 환경 변수를 설정한 터미널에서 Langflow를 재시작합니다.

```bash
langflow run --env-file .env
```

    터미널에서 환경 변수를 설정했다면 `--env-file`은 생략할 수 있습니다.
다만 Langflow는 `.env` *와* 터미널 양쪽에서 환경 변수를 가져올 수 있습니다.
자세한 내용은 [Langflow 환경 변수](https://docs.langflow.org/environment-variables)를 참고하세요.

4. Langflow에서 플로우를 실행하여 일부 활동을 생성합니다.

5. 모니터링 및 관측성을 위해 LangSmith 대시보드를 확인합니다.

    ![LangSmith dashboard](https://docs.langflow.org/assets/images/langsmith-dashboard-ce13945c95550300648084dda81408fd.png)
