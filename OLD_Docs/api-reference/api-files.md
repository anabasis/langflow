# 파일 엔드포인트

`/files` 엔드포인트를 사용하여 로컬 머신과 Langflow 간에 파일을 이동합니다.

모든 `/files` 엔드포인트 (`/v1/files` 및 `/v2/files` 모두)는 Langflow API 키로 인증이 필요합니다. 슈퍼유저라도 자신의 사용자 계정에 속한 파일에만 접근할 수 있습니다.

---

## `/v1/files`와 `/v2/files`의 차이점

`/v2/files`는 `/v1/files`에 비해 다음과 같은 개선사항을 제공합니다:

- `/v2` 파일은 `flow_id` 대신 `user_id`로 구성됩니다. 파일이 사용자에 의해 소유되어 특정 플로우에 연결되지 않습니다.
- `/v2` 파일은 Langflow 데이터베이스에서 추적됩니다.
- `/v2`는 대량 업로드 및 삭제를 지원합니다.
- `/v2` 응답에는 더 설명적인 메타데이터가 포함됩니다.

단, `/v2/files`는 이미지 파일을 지원하지 않습니다. 이미지 파일을 보내려면 v1 엔드포인트를 사용하세요.

---

## Files/V1 엔드포인트

### 파일 업로드 (v1)

`v1/files/upload/$FLOW_ID` 엔드포인트에 파일을 업로드합니다:

```python
import os
import requests

url = f"{os.getenv('LANGFLOW_URL', '')}/api/v1/files/upload/{os.getenv('FLOW_ID', '')}"

headers = {
    "accept": "application/json",
    "x-api-key": f"{os.getenv('LANGFLOW_API_KEY', '')}",
}

files = {
    "file": open("your_file.txt", "rb"),
}

response = requests.request("POST", url, headers=headers, files=files)
response.raise_for_status()
print(response.text)
```

**결과:**

```json
{
  "flowId": "92f9a4c5-cfc8-4656-ae63-1f0881163c28",
  "file_path": "92f9a4c5-cfc8-4656-ae63-1f0881163c28/2024-12-30_15-19-43_your_file.txt"
}
```

### 이미지 파일 업로드 (v1)

이미지 파일을 Langflow에 보내어 플로우에서 사용합니다. 기본 파일 크기 제한은 1024MB입니다.

```python
import os
import requests

url = f"{os.getenv('LANGFLOW_URL', '')}/api/v1/files/upload/{os.getenv('FLOW_ID', '')}"

headers = {
    "x-api-key": f"{os.getenv('LANGFLOW_API_KEY', '')}",
}

files = {
    "file": open("image_file.png", "rb"),
}

response = requests.request("POST", url, headers=headers, files=files)
response.raise_for_status()
print(response.text)
```

**결과:**

```json
{
  "flowId": "a430cc57-06bb-4c11-be39-d3d4de68d2c4",
  "file_path": "a430cc57-06bb-4c11-be39-d3d4de68d2c4/2024-11-27_14-47-50_image-file.png"
}
```

### 파일 목록 조회 (v1)

특정 플로우와 연관된 모든 파일을 나열합니다:

```python
url = f"{os.getenv('LANGFLOW_URL', '')}/api/v1/files/list/{os.getenv('FLOW_ID', '')}"
response = requests.request("GET", url, headers=headers)
```

**결과:**

```json
{
  "files": ["2024-12-30_15-19-43_your_file.txt"]
}
```

### 파일 다운로드 (v1)

특정 플로우에서 특정 파일을 다운로드합니다.

```python
download = requests.get(
    f"{base}/api/v1/files/download/{flow_id}/{file_name}",
    headers=headers,
)
```

### 파일 삭제 (v1)

특정 플로우에서 특정 파일을 삭제합니다:

```python
url = f"{os.getenv('LANGFLOW_URL', '')}/api/v1/files/delete/{os.getenv('FLOW_ID', '')}/2024-12-30_15-19-43_your_file.txt"
response = requests.request("DELETE", url, headers=headers)
```

---

## Files/V2 엔드포인트

### 파일 업로드 (v2)

사용자 계정에 파일을 업로드합니다. 파일은 여러 플로우에서 사용할 수 있습니다.

```python
import os
import requests

url = f"{os.getenv('LANGFLOW_URL', '')}/api/v2/files"

headers = {
    "accept": "application/json",
    "x-api-key": f"{os.getenv('LANGFLOW_API_KEY', '')}",
}

files = {
    "file": open("your_file.txt", "rb"),
}

response = requests.request("POST", url, headers=headers, files=files)
response.raise_for_status()
print(response.text)
```

**결과:**

```json
{
  "id": "d44dc2e1-9ae9-4cf6-9114-8d34a6126c94",
  "name": "engine_manual",
  "path": "07e5b864-e367-4f52-b647-a48035ae7e5e/d44dc2e1-9ae9-4cf6-9114-8d34a6126c94.pdf",
  "size": 851160,
  "provider": null
}
```

### 플로우에 파일 보내기 (v2)

1. `/api/v2/files` 엔드포인트에 파일을 POST합니다.
2. 플로우에 **Read File** 컴포넌트를 추가합니다.
3. `tweaks` 객체에 파일 경로를 전달하여 플로우를 실행합니다:

```python
payload = {
    "input_value": "무엇이 보이나요?",
    "output_type": "chat",
    "input_type": "text",
    "tweaks": {
        "Read-File-1olS3": {
            "path": ["07e5b864-e367-4f52-b647-a48035ae7e5e/3a290013-fe1e-4d3d-a454-cacae81288f3.pdf"]
        }
    },
}

response = requests.request("POST", run_url, headers=headers, json=payload)
```

### 파일 목록 조회 (v2)

사용자 계정과 연관된 모든 파일을 나열합니다:

```python
url = f"{os.getenv('LANGFLOW_URL', '')}/api/v2/files"
response = requests.request("GET", url, headers=headers)
```

**결과:**

```json
[
  {
    "id": "c7b22c4c-d5e0-4ec9-af97-5d85b7657a34",
    "name": "your_file",
    "path": "6f17a73e-97d7-4519-a8d9-8e4c0be411bb/c7b22c4c-d5e0-4ec9-af97-5d85b7657a34.txt",
    "size": 1234,
    "provider": null
  }
]
```

### 파일 다운로드 (v2)

ID와 파일 확장자로 특정 파일을 다운로드합니다:

```python
download = requests.get(f"{base}/api/v2/files/{file_id}", headers=headers)
```

### 파일 이름 편집 (v2)

파일 이름을 변경합니다:

```python
url = f"{base}/api/v2/files/{file_id}?name={new_name}"
response = requests.put(url, headers=headers)
```

### 파일 삭제 (v2)

ID로 특정 파일을 삭제합니다:

```python
url = f"{os.getenv('LANGFLOW_URL', '')}/api/v2/files/{os.getenv('FILE_ID', '')}"
response = requests.request("DELETE", url, headers=headers)
```

**결과:**

```json
{
  "message": "File deleted successfully"
}
```

### 모든 파일 삭제 (v2)

사용자 계정과 연관된 모든 파일을 삭제합니다:

```python
url = f"{os.getenv('LANGFLOW_URL', '')}/api/v2/files"
response = requests.request("DELETE", url, headers=headers)
```

**결과:**

```json
{
  "message": "All files deleted successfully"
}
```

---

## 참고 항목

- [파일 관리](https://docs.langflow.org/concepts-file-management)

---

*원문: https://docs.langflow.org/next/api-files*
