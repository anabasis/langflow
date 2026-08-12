# 프로젝트 엔드포인트

`/projects` 엔드포인트를 사용하여 [Langflow 프로젝트](https://docs.langflow.org/concepts-flows#projects)를 생성, 읽기, 업데이트, 삭제합니다.

---

## 프로젝트 읽기

프로젝트 ID, 이름, 설명을 포함한 Langflow 프로젝트 목록을 가져옵니다:

```python
import os
import requests

url = f"{os.getenv('LANGFLOW_URL', '')}/api/v1/projects/"

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
[
  {
    "name": "Starter Project",
    "description": "자신의 프로젝트를 관리합니다.",
    "id": "1415de42-8f01-4f36-bf34-539f23e47466",
    "parent_id": null
  }
]
```

---

## 프로젝트 생성

새 프로젝트를 만듭니다:

```python
payload = {
    "name": "new_project_name",
    "description": "string",
    "components_list": [],
    "flows_list": []
}

response = requests.request("POST", url, headers=headers, json=payload)
```

**결과:**

```json
{
  "name": "new_project_name",
  "description": "string",
  "id": "b408ddb9-6266-4431-9be8-e04a62758331",
  "parent_id": null
}
```

> **참고**: 플로우를 프로젝트에 추가하면 플로우가 이전 위치에서 이동됩니다. 복사되지 않습니다.

---

## 특정 프로젝트 읽기

특정 프로젝트의 세부 정보를 검색합니다:

```python
url = f"{os.getenv('LANGFLOW_URL', '')}/api/v1/projects/{os.getenv('PROJECT_ID', '')}"
response = requests.request("GET", url, headers=headers)
```

---

## 프로젝트 업데이트

`PATCH` 요청으로 특정 프로젝트의 정보를 업데이트합니다. 요청에 포함한 필드만 업데이트됩니다:

```python
payload = {
    "name": "새 프로젝트 이름",
    "description": "API 문서 Python 예제로 업데이트",
}

response = requests.patch(
    f"{base}/api/v1/projects/{project_id}",
    headers=headers,
    json=payload
)
```

---

## 프로젝트 삭제

특정 프로젝트를 삭제합니다:

```python
response = requests.delete(f"{base}/api/v1/projects/{project_id}", headers=headers)
```

**결과:** `204 No Content`

---

## 프로젝트 내보내기

프로젝트의 모든 플로우를 ZIP 파일로 다운로드합니다:

```python
url = f"{os.getenv('LANGFLOW_URL', '')}/api/v1/projects/download/{os.getenv('PROJECT_ID', '')}"
response = requests.request("GET", url, headers=headers)

with open("langflow-project.zip", "wb") as f:
    f.write(response.content)
```

---

## 프로젝트 가져오기

Langflow 프로젝트 ZIP 파일을 업로드하여 프로젝트와 플로우를 가져옵니다:

```python
files = {"file": (import_path.name, import_path.read_bytes(), "application/json")}
response = requests.post(f"{base}/api/v1/projects/upload/", headers=headers, files=files)
```

---

*원문: https://docs.langflow.org/next/api-projects*
