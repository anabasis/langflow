# 파일 관리

각 Langflow 서버에는 플로우에서 사용할 파일을 저장할 수 있는 파일 관리 시스템이 있습니다.

Langflow 파일 관리에 업로드된 파일은 Langflow의 스토리지 백엔드(로컬 또는 AWS S3)에 저장되며 모든 플로우에서 사용할 수 있습니다.

파일을 Langflow 파일 관리에 업로드하면 중앙 위치에 파일을 보관하고 반복적인 수동 업로드 없이 플로우 전반에서 파일을 재사용할 수 있습니다.

---

## 파일 관리 UI 사용

파일 관리 UI를 사용하여 로컬 머신에서 Langflow 서버로 파일을 업로드하고 관리할 수 있습니다.

1. Langflow 파일 관리로 이동합니다:
   - **Langflow Desktop**: **Projects** 페이지에서 프로젝트 목록 아래의 **My Files**를 클릭합니다.
   - **Langflow OSS**: 브라우저에서 Langflow 서버의 `/files` 엔드포인트(예: `http://localhost:7860/files`)로 이동합니다.
   - **백엔드 전용**: 프로그래밍 방식의 파일 관리를 위해 Langflow API 파일 엔드포인트를 사용합니다.

2. **My Files** 페이지에서 **Upload**를 클릭합니다.

3. 업로드할 파일을 하나 이상 선택합니다.

파일 관리 UI 내에서 파일을 이름 변경, 다운로드, 복사, 삭제할 수 있습니다.

---

## Langflow API로 파일 업로드 및 관리

Langflow API를 사용하면 Langflow 파일 관리에서 파일을 업로드하고 관리하고 런타임에 플로우에 프로그래밍 방식으로 파일을 보낼 수 있습니다.

---

## 최대 파일 크기 설정

기본적으로 최대 파일 크기는 1024MB입니다. 이 값을 수정하려면 `LANGFLOW_MAX_FILE_SIZE_UPLOAD` [환경 변수](./environment-variables.md)를 변경합니다.

---

## 플로우에서 파일 사용

Langflow 파일 관리 시스템의 파일을 플로우에서 사용하려면 **Read File** 컴포넌트와 같이 파일 입력을 허용하는 컴포넌트를 플로우에 추가합니다.

예를 들어 플로우에 **Read File** 컴포넌트를 추가하고 **Select files**를 클릭한 다음 **My Files** 목록에서 파일을 선택합니다.

### 런타임에 파일 로드

런타임에 파일을 로드하려면:

1. 플로우에 **Read File** 컴포넌트를 추가합니다.
2. **Share**, **API access**를 선택하고 **Input Schema**를 클릭하여 요청 페이로드에 `tweaks`를 추가합니다.
3. **File** 섹션을 확장하고 **Files** 행을 찾아 **Expose Input**을 활성화합니다.
4. **Input Schema** 패인을 닫습니다. 코드 스니펫에 이제 `tweaks`가 포함됩니다:

```json
"tweaks": {
    "File-qYD5w": {
        "path": []
    }
}
```

5. 플로우를 프로그래밍 방식으로 실행할 때 스크립트는 파일을 Langflow 파일 관리에 업로드한 다음 반환된 `file_path`를 `/run` 요청의 `path` tweak에 전달해야 합니다:

```json
"tweaks": {
    "FILE_COMPONENT_ID": {
        "path": [ "file_path" ]
    }
}
```

---

## 이미지 업로드

Langflow는 다음 형식의 base64 이미지를 지원합니다: PNG, JPG/JPEG, GIF, BMP, WebP

- **플레이그라운드에서**: 채팅 입력 영역에 이미지를 드래그 앤 드롭하거나 **Attach image** 아이콘을 클릭하여 업로드합니다.

- **Langflow API에서**: `/api/v1/run/$FLOW_ID` 엔드포인트로 플로우를 트리거할 때 `files` 파라미터를 사용하여 base64로 인코딩된 문자열로 이미지 데이터를 첨부합니다:

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

## 파일 스토리지 구성

Langflow는 파일 관리를 위해 두 가지 스토리지 백엔드를 지원합니다.

### 로컬 스토리지 (기본값)

파일은 Langflow 구성 디렉토리에 로컬로 저장됩니다. `LANGFLOW_STORAGE_TYPE=local`로 설정하거나 설정하지 않으면 로컬 스토리지를 사용합니다.

### S3 스토리지

파일은 AWS S3 버킷에 저장됩니다. S3를 파일 스토리지 백엔드로 사용하려면 `.env` 파일에 다음 구성을 추가합니다:

```
# S3 스토리지 구성
LANGFLOW_STORAGE_TYPE=s3
LANGFLOW_OBJECT_STORAGE_BUCKET_NAME=S3_BUCKET_NAME
LANGFLOW_OBJECT_STORAGE_PREFIX=S3_BUCKET_DIRECTORY

# AWS 자격증명 (S3에 필요)
AWS_ACCESS_KEY_ID=S3_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=S3_ACCESS_SECRET_KEY
AWS_DEFAULT_REGION=S3_REGION
```

필요한 IAM 정책 예시:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "LangflowS3StorageAccess",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:ListBucket",
                "s3:PutObjectTagging"
            ],
            "Resource": [
                "arn:aws:s3:::S3_BUCKET_NAME",
                "arn:aws:s3:::S3_BUCKET_NAME/S3_BUCKET_DIRECTORY/*"
            ]
        }
    ]
}
```

---

## 파일 스토리지 환경 변수

| 변수 | 형식 | 기본값 | 설명 |
|------|------|--------|------|
| `LANGFLOW_STORAGE_TYPE` | String | `local` | 파일 스토리지 백엔드. `local` 또는 `s3` |
| `LANGFLOW_OBJECT_STORAGE_BUCKET_NAME` | String | 미설정 | 파일 스토리지에 사용할 S3 버킷 이름 |
| `LANGFLOW_OBJECT_STORAGE_PREFIX` | String | 미설정 | S3 버킷 내의 선택적 폴더 경로 |
| `LANGFLOW_OBJECT_STORAGE_TAGS` | JSON object | 미설정 | S3 객체 태그 |

---

## 참고 항목

- [컴포넌트 참조](../components-reference/components-overview.md)

---

*원문: https://docs.langflow.org/next/concepts-file-management*
