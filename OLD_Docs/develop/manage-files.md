# 파일 관리

각 Langflow 서버에는 플로우에서 사용할 파일을 저장할 수 있는 파일 관리 시스템이 있습니다.

Langflow 파일 관리에 업로드된 파일은 Langflow 저장소 백엔드(로컬 또는 AWS S3)에 저장되며, 모든 플로우에서 사용할 수 있습니다.

---

## 파일 관리 UI 사용

1. Langflow 파일 관리로 이동:
   - **Langflow Desktop**: **Projects** 페이지에서 **My Files** 클릭
   - **Langflow OSS**: 브라우저에서 `http://localhost:7860/files` 접속
   - **백엔드 전용**: [파일 API 엔드포인트](../api-reference/api-files.md) 사용

2. **My Files** 페이지에서 **Upload** 클릭

3. 업로드할 파일 선택

파일 업로드 후 파일 관리 UI에서 이름 변경, 다운로드, 복사, 삭제를 할 수 있습니다.

---

## 최대 파일 크기 설정

기본 최대 파일 크기는 1024MB입니다. `LANGFLOW_MAX_FILE_SIZE_UPLOAD` 환경 변수로 변경할 수 있습니다.

---

## 플로우에서 파일 사용

**Read File** 컴포넌트와 같이 파일 입력을 허용하는 컴포넌트를 플로우에 추가합니다. **Select files**를 클릭하고 **My Files** 목록에서 파일을 선택합니다.

### 런타임에 파일 로드

1. 플로우에 **Read File** 컴포넌트 추가
2. **Share** → **API access** → **Input Schema**에서 **Files** 행의 **Expose Input** 활성화
3. 이제 페이로드에 `tweaks`가 포함됩니다:

```json
"tweaks": {
    "File-qYD5w": {
        "path": []
    }
}
```

4. 스크립트 실행 시 파일을 Langflow 파일 관리에 업로드한 다음 반환된 `file_path`를 `path` 트위크에 전달:

```json
"tweaks": {
    "FILE_COMPONENT_ID": {
        "path": ["file_path"]
    }
}
```

---

## 이미지 업로드

Langflow는 다음 형식의 base64 이미지를 지원합니다: PNG, JPG/JPEG, GIF, BMP, WebP

플로우를 `/api/v1/run/$FLOW_ID` 엔드포인트로 트리거할 때 `files` 파라미터를 사용하여 base64 인코딩 문자열로 이미지 데이터를 첨부합니다:

```bash
curl -X POST "http://$LANGFLOW_SERVER_ADDRESS/api/v1/run/$FLOW_ID" \
-H "Content-Type: application/json" \
-H "x-api-key: $LANGFLOW_API_KEY" \
-d '{
   "session_id": "custom_session_123",
   "input_value": "이 이미지에 무엇이 있나요?",
   "input_type": "chat",
   "output_type": "chat",
   "files": ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."]
}'
```

---

## 파일 저장소 구성

### 로컬 저장소 (기본값)

```
LANGFLOW_STORAGE_TYPE=local
```

### S3 저장소

```
LANGFLOW_STORAGE_TYPE=s3
LANGFLOW_OBJECT_STORAGE_BUCKET_NAME=S3_BUCKET_NAME
LANGFLOW_OBJECT_STORAGE_PREFIX=S3_BUCKET_DIRECTORY
AWS_ACCESS_KEY_ID=S3_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=S3_ACCESS_SECRET_KEY
AWS_DEFAULT_REGION=S3_REGION
```

AWS 자격 증명에는 다음 S3 작업 권한이 필요합니다:
- `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject`, `s3:ListBucket`, `s3:PutObjectTagging`

---

## 파일 저장소 환경 변수

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `LANGFLOW_STORAGE_TYPE` | `local` | 파일 저장소 백엔드: `local` 또는 `s3` |
| `LANGFLOW_OBJECT_STORAGE_BUCKET_NAME` | 미설정 | S3 버킷 이름 (`s3` 사용 시 필수) |
| `LANGFLOW_OBJECT_STORAGE_PREFIX` | 미설정 | S3 버킷 내 선택적 접두사/폴더 경로 |
| `LANGFLOW_OBJECT_STORAGE_TAGS` | 미설정 | S3 개체 태그 (JSON 맵) |

---

## 참고 항목

- [파일 API 엔드포인트](../api-reference/api-files.md)
- [파일을 수집하는 챗봇 만들기](../get-started/chat-with-files.md)

---

*원문: https://docs.langflow.org/next/concepts-file-management*
