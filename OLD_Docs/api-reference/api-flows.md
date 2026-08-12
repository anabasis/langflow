# 플로우 관리 엔드포인트

`/flows` 엔드포인트를 사용하여 플로우를 생성, 읽기, 업데이트, 삭제합니다.

Langflow API를 사용하여 플로우를 실행하려면 [플로우 트리거 엔드포인트](./api-flows-run.md)를 참조하세요.

---

## 플로우 생성

새 플로우를 만듭니다:

```python
import os
import requests

url = f"{os.getenv('LANGFLOW_URL', '')}/api/v1/flows/"

headers = {
    "accept": "application/json",
    "Content-Type": "application/json",
    "x-api-key": f"{os.getenv('LANGFLOW_API_KEY', '')}",
}

payload = {
    "name": "새 플로우",
    "description": "설명",
    "icon": "string",
    "icon_bg_color": "#FF0000",
    "data": {},
    "is_component": False,
    "webhook": False,
    "endpoint_name": "string",
    "tags": ["string"],
}

response = requests.request("POST", url, headers=headers, json=payload)
response.raise_for_status()
print(response.text)
```

**결과:**

```json
{
  "name": "새 플로우",
  "description": "설명",
  "id": "e8d81c37-714b-49ae-ba82-e61141f020ee",
  "user_id": "f58396d4-a387-4bb8-b749-f40825c3d9f3",
  "project_id": "1415de42-8f01-4f36-bf34-539f23e47466"
}
```

---

## 여러 플로우 생성

여러 새 플로우를 만들어 플로우 객체 배열을 반환합니다:

```python
payload = {"flows": [flow_doc_a, flow_doc_b]}
response = requests.post(f"{base}/api/v1/flows/batch/", headers=headers, json=payload)
```

---

## 플로우 읽기

ID로 특정 플로우를 검색합니다:

```python
url = f"{os.getenv('LANGFLOW_URL', '')}/api/v1/flows/{os.getenv('FLOW_ID', '')}"
response = requests.request("GET", url, headers=headers)
```

**결과:**

```json
{
  "name": "Basic Prompting",
  "description": "OpenAI 모델로 기본 프롬프팅 수행",
  "data": {
    "nodes": [...]
  }
}
```

---

## 플로우 목록 읽기

플로우 목록이 포함된 JSON 객체를 반환합니다:

```python
# 페이지네이션으로 모든 플로우 검색
url = f"{os.getenv('LANGFLOW_URL', '')}/api/v1/flows/?remove_example_flows=false&components_only=false&get_all=true&page=1&size=50"

# 특정 프로젝트의 플로우 검색
url = f"{os.getenv('LANGFLOW_URL', '')}/api/v1/flows/?project_id={os.getenv('PROJECT_ID', '')}&page=1&size=1"
```

---

## 샘플 플로우 읽기

샘플 플로우 목록을 검색합니다:

```python
url = f"{os.getenv('LANGFLOW_URL', '')}/api/v1/flows/basic_examples/"
response = requests.request("GET", url, headers=headers)
```

---

## 플로우 업데이트

ID로 기존 플로우를 업데이트합니다:

```python
payload = {
    "name": "업데이트된 플로우 이름",
    "description": "API 문서 Python 예제로 업데이트",
    "locked": False,
}

response = requests.patch(f"{base}/api/v1/flows/{flow_id}", headers=headers, json=payload)
```

**결과:**

```json
{
  "name": "업데이트된 플로우 이름",
  "endpoint_name": "my_new_endpoint_name",
  "id": "01ce083d-748b-4b8d-97b6-33adbb6a528a"
}
```

---

## 플로우 삭제

ID로 특정 플로우를 삭제합니다:

```python
response = requests.delete(f"{base}/api/v1/flows/{flow_id}", headers=headers)
```

**결과:**

```json
{
  "message": "Flow deleted successfully"
}
```

---

## 플로우 내보내기

지정된 플로우를 ZIP 파일로 내보냅니다. 각 플로우 ID에 대해 Langflow JSON 파일이 포함된 ZIP 파일을 다운로드합니다:

```python
payload = [flow_id_1, flow_id_2]
response = requests.post(f"{base}/api/v1/flows/download/", headers=headers, json=payload)

with open("langflow-flows.zip", "wb") as f:
    f.write(response.content)
```

---

## 플로우 가져오기

Langflow 호환 JSON 파일을 업로드하여 플로우를 가져옵니다:

```python
url = f"{os.getenv('LANGFLOW_URL', '')}/api/v1/flows/upload/?folder_id={os.getenv('FOLDER_ID', '')}"

files = {
    "file": open("agent-with-astra-db-tool.json", "rb"),
}

response = requests.request("POST", url, headers=headers, files=files)
```

특정 프로젝트에 플로우를 지정하려면 `folder_id` 쿼리 파라미터를 포함합니다. 대상 `folder_id`는 업로드 전에 이미 존재해야 합니다.

---

*원문: https://docs.langflow.org/next/api-flows*
