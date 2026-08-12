# 로그 엔드포인트

Langflow 플로우 및 서버의 로그를 검색합니다.

---

## 로그 검색 활성화

`/logs` 엔드포인트는 Langflow 인스턴스에서 로그 검색이 활성화되어 있어야 합니다.

로그 검색을 활성화하려면 Langflow `.env` 파일에 다음 [환경 변수](../develop/environment-variables.md)를 설정합니다:

```
LANGFLOW_ENABLE_LOG_RETRIEVAL=True
LANGFLOW_LOG_RETRIEVER_BUFFER_SIZE=10000  # 0보다 커야 함
LANGFLOW_LOG_LEVEL=DEBUG  # DEBUG, ERROR, INFO, WARNING, CRITICAL 중 하나
```

그런 다음 `uv run langflow run --env-file .env`로 Langflow를 시작합니다.

---

## 로그 스트리밍

서버 전송 이벤트(SSE)를 사용하여 실시간으로 로그를 스트리밍합니다:

```python
import os
import requests

base = os.environ.get("LANGFLOW_URL") or os.environ.get("LANGFLOW_SERVER_URL", "")
api_key = os.environ.get("LANGFLOW_API_KEY", "")

url = f"{base}/logs-stream"
headers = {"accept": "text/event-stream", "x-api-key": api_key}

response = requests.get(url, headers=headers, stream=True, timeout=30)
response.raise_for_status()

events_read = 0
for line in response.iter_lines(decode_unicode=True):
    if line:
        print(line)
        events_read += 1
        if events_read >= 3:
            break

response.close()
```

**결과:**

```
keepalive

{"1736355791151": "2025-01-08T12:03:11.151218-0500 DEBUG Building Chat Input\n"}

{"1736355791485": "2025-01-08T12:03:11.485380-0500 DEBUG consumed event add_message-153bcd5d\n"}
```

---

## 선택적 파라미터로 로그 검색

선택적 쿼리 파라미터로 로그를 검색합니다:

- `lines_before`: 타임스탬프 이전 또는 마지막 로그 이전의 로그 수
- `lines_after`: 타임스탬프 이후의 로그 수
- `timestamp`: 로그 가져오기를 시작할 타임스탬프

모든 파라미터의 기본값은 `0`입니다. 기본값으로 엔드포인트는 마지막 10줄의 로그를 반환합니다.

```python
import os
import requests

url = f"{os.getenv('LANGFLOW_URL', '')}/logs?lines_before=0&lines_after=0&timestamp=0"

headers = {
    "accept": "application/json",
    "x-api-key": f"{os.getenv('LANGFLOW_API_KEY', '')}",
}

response = requests.request("GET", url, headers=headers)
response.raise_for_status()
print(response.text)
```

**결과:**

```json
{
  "1736354770500": "2025-01-08T11:46:10.500363-0500 DEBUG Creating starter project Document Q&A\n",
  "1736354770511": "2025-01-08T11:46:10.511146-0500 DEBUG Creating starter project Image Sentiment Analysis\n",
  "1736354770521": "2025-01-08T11:46:10.521018-0500 DEBUG Creating starter project SEO Keyword Generator\n"
}
```

---

## 참고 항목

- [로그 구성](../develop/logging.md)
- [환경 변수](../develop/environment-variables.md)

---

*원문: https://docs.langflow.org/next/api-logs*
