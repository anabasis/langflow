# 파일 관리

> 원문: https://docs.langflow.org/next/concepts-file-management

각 Langflow 서버에는 플로우에서 사용할 파일을 저장할 수 있는 파일 관리 시스템이 있습니다.

Langflow 파일 관리에 업로드된 파일은 Langflow의 [스토리지 백엔드(로컬 또는 AWS S3)](#파일-스토리지-구성)에 저장되며, 모든 플로우에서 사용할 수 있습니다.

Langflow 파일 관리에 파일을 업로드하면 파일을 한 곳에 보관할 수 있고, 반복적으로 수동 업로드하지 않고도 여러 플로우에서 파일을 재사용할 수 있습니다.

## 파일 관리 UI 사용하기[​](#use-the-file-management-ui "Direct link to Use the file management UI")

파일 관리 UI를 사용하면 로컬 머신의 파일을 자신의 Langflow 서버에 업로드할 수 있습니다.
또한 Langflow 서버에 업로드된 모든 파일을 관리할 수 있습니다.

1. Langflow 파일 관리로 이동합니다.

  - **Langflow Desktop**: Langflow에서 [**Projects** 페이지](https://docs.langflow.org/concepts-flows#projects)의 프로젝트 목록 아래에 있는 **My Files**를 클릭합니다.
  - **Langflow OSS**: 브라우저에서 Langflow 서버의 `/files` 엔드포인트(예: `http://localhost:7860/files`)로 이동합니다. Langflow 서버에 맞게 기본 URL을 수정하세요.
  - **백엔드 전용**: 프로그래밍 방식으로 파일을 관리하려면 [Langflow API files 엔드포인트](https://docs.langflow.org/api-files)를 사용하세요. 다만 아래 단계는 파일 관리 UI를 사용한다고 가정합니다.

2. **My Files** 페이지에서 **Upload**를 클릭합니다.

3. 업로드할 파일을 하나 이상 선택합니다.

파일을 업로드한 후에는 파일 관리 UI 내에서 파일 이름 변경, 다운로드, 복사, 삭제를 할 수 있습니다.
파일을 삭제하려면 파일 아이콘 위에 마우스를 올리고 선택한 다음 **Delete**를 클릭합니다.
한 번에 여러 파일을 삭제할 수 있습니다.
파일을 다운로드하려면 파일 아이콘 위에 마우스를 올리고 선택한 다음 **Download**를 클릭합니다.
한 번에 여러 파일을 다운로드하면 zip 파일로 함께 저장됩니다.

## Langflow API로 파일 업로드 및 관리하기[​](#upload-and-manage-files-with-the-langflow-api "Direct link to Upload and manage files with the Langflow API")

Langflow API를 사용하면 Langflow 파일 관리에서 파일을 업로드하고 관리할 수 있으며, 런타임에 프로그래밍 방식으로 플로우에 파일을 전송할 수 있습니다.

자세한 내용과 예제는 [Files 엔드포인트](https://docs.langflow.org/api-files)와 [파일을 수집하는 챗봇 만들기](https://docs.langflow.org/chat-with-files)를 참고하세요.

## 최대 파일 크기 설정[​](#set-the-maximum-file-size "Direct link to Set the maximum file size")

기본적으로 최대 파일 크기는 1024MB입니다.
이 값을 수정하려면 `LANGFLOW_MAX_FILE_SIZE_UPLOAD` [환경 변수](https://docs.langflow.org/environment-variables)를 변경하세요.

## 플로우에서 파일 사용하기[​](#use-files-in-a-flow "Direct link to Use files in a flow")

Langflow 파일 관리 시스템에 있는 파일을 플로우에서 사용하려면, **Read File** 컴포넌트와 같이 파일 입력을 받는 컴포넌트를 플로우에 추가하세요.

예를 들어 플로우에 **Read File** 컴포넌트를 추가하고 **Select files**를 클릭한 다음, **My Files** 목록에서 파일을 선택합니다.

이 목록에는 서버의 파일 관리 시스템에 있는 모든 파일이 포함되지만, [**Read File** 컴포넌트가 지원하는 파일 형식](https://docs.langflow.org/read-file)만 선택할 수 있습니다.
다른 파일 형식이 필요하다면 해당 파일 형식을 지원하는 다른 컴포넌트를 사용하거나, 업로드하기 전에 지원되는 형식으로 변환해야 합니다.

**Read File** 컴포넌트 및 기타 데이터 로딩 컴포넌트에 대한 자세한 내용은 [**Read file** 컴포넌트](https://docs.langflow.org/read-file)를 참고하세요.

### 런타임에 파일 로드하기[​](#load-files-at-runtime "Direct link to Load files at runtime")

플로우에서 미리 로드된 파일을 사용할 수도 있고, 플로우가 파일 입력을 받는 경우 런타임에 파일을 로드할 수도 있습니다.
플로우에서 파일 입력을 활성화하려면 다음을 수행하세요.

1. 플로우에 [**Read File** 컴포넌트](https://docs.langflow.org/read-file)를 추가합니다.

2. **Share**를 클릭하고 **API access**를 선택한 다음 **Input Schema**를 클릭하여 플로우에서 자동 생성된 코드 스니펫의 요청 페이로드에 [`tweaks`](https://docs.langflow.org/concepts-publish#input-schema)를 추가합니다.

3. **File** 섹션을 확장하고 **Files** 행을 찾은 다음 **Expose Input**을 활성화하여 해당 파라미터를 Langflow API를 통해 런타임에 설정할 수 있도록 합니다.

4. **Input Schema** 패널을 닫고 **API access** 패널로 돌아갑니다.
이제 각 코드 스니펫의 페이로드에는 **Read File** 컴포넌트의 ID와 **Input Schema**에서 활성화한 `path` 키를 포함하는 `tweaks`가 포함됩니다.

  ```
  "tweaks": {
      "File-qYD5w": {
  	    "path": []
      }
  }
  ```

5. 이 플로우를 프로그래밍 방식으로 실행할 때는, 스크립트가 Langflow 파일 관리에 파일을 업로드한 다음 반환된 `file_path`를 `/run` 요청의 `path` tweak에 전달해야 합니다.

  ```
  "tweaks": {
      "FILE_COMPONENT_ID": {
          "path": [ "file_path" ]
      }
  }
  ```
    전체 예제는 [파일을 수집하는 챗봇 만들기](https://docs.langflow.org/chat-with-files)와 [Files 엔드포인트](https://docs.langflow.org/api-files)를 참고하세요.

    여러 파일을 업로드하려면 `path` 배열에 여러 개의 `file_path` 값을 전달할 수 있습니다(예: `[ "path1", "path2" ]`).

## 이미지 업로드[​](#upload-images "Direct link to Upload images")

Langflow는 다음 형식의 base64 이미지를 지원합니다.

- PNG
- JPG/JPEG
- GIF
- BMP
- WebP

**Playground** 채팅 인터페이스에 이미지를 업로드하거나, Langflow API를 통해 런타임 입력으로 업로드할 수 있습니다.

- **Playground**에서는 채팅 입력 영역에 이미지를 드래그 앤 드롭하거나, **Attach image** 아이콘을 클릭하여 업로드할 이미지를 선택할 수 있습니다.

- `/api/v1/run/$FLOW_ID` 엔드포인트로 플로우를 트리거할 때는 `files` 파라미터를 사용하여 base64로 인코딩된 문자열로 이미지 데이터를 첨부할 수 있습니다.

  ```
  curl -X POST "http://$LANGFLOW_SERVER_ADDRESS/api/v1/run/$FLOW_ID" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $LANGFLOW_API_KEY" \
  -d '{
     "session_id": "custom_session_123",
     "input_value": "What is in this image?",
     "input_type": "chat",
     "output_type": "chat",
     "files": ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."]
  }'
  ```

보다 전문적인 이미지 처리가 필요하다면 [**Bundles**]를 살펴보거나 [직접 컴포넌트를 만들어 보세요](https://docs.langflow.org/components-custom-components).

## 동영상 파일 다루기[​](#work-with-video-files "Direct link to Work with video files")

동영상의 경우 **Twelve Labs** 및 **YouTube** [**Bundles**](https://docs.langflow.org/components-bundle-components)를 참고하세요.

## 파일 스토리지 구성[​](#configure-file-storage "Direct link to Configure file storage")

Langflow는 파일 관리를 위한 두 가지 스토리지 백엔드를 지원합니다.

- **로컬 스토리지**: Langflow의 기본 스토리지 백엔드입니다. 파일은 [Langflow 구성 디렉터리](https://docs.langflow.org/memory)에 로컬로 저장됩니다. 로컬 스토리지를 사용하려면 `LANGFLOW_STORAGE_TYPE=local`로 설정하거나 값을 설정하지 않은 상태로 두세요.

- **S3 스토리지**: 파일이 AWS S3 버킷에 저장됩니다.
Langflow는 [boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) 라이브러리를 사용하여 S3와 상호작용합니다.

S3를 파일 스토리지 백엔드로 사용하려면 `.env` 파일에 다음 구성을 추가하세요.

```

# S3 Storage Configuration

LANGFLOW_STORAGE_TYPE=s3

LANGFLOW_OBJECT_STORAGE_BUCKET_NAME=S3_BUCKET_NAME

LANGFLOW_OBJECT_STORAGE_PREFIX=S3_BUCKET_DIRECTORY

# AWS Credentials (required for S3)

AWS_ACCESS_KEY_ID=S3_ACCESS_KEY

AWS_SECRET_ACCESS_KEY=S3_ACCESS_SECRET_KEY

AWS_DEFAULT_REGION=S3_REGION

```

다음 자리 표시자를 여러분의 S3 인스턴스에 맞는 실제 값으로 바꾸세요.

- `S3_BUCKET_NAME`: S3 버킷의 이름입니다.
- `S3_BUCKET_DIRECTORY`: 파일이 저장되는 버킷 내의 선택적 폴더 경로입니다(예: `s3://S3_BUCKET_NAME/S3_BUCKET_DIRECTORY`).
- `S3_ACCESS_KEY`: AWS Access Key ID입니다.
- `S3_ACCESS_SECRET_KEY`: AWS Secret Access Key입니다.
- `S3_REGION`: 버킷이 위치한 AWS 리전입니다(예: `us-east-2`).

AWS 자격 증명에는 사용 사례에 필요한 S3 작업(예: S3에서 파일 읽기, 쓰기, 삭제)을 수행할 수 있는 권한이 있어야 합니다.
다음 예제 정책은 S3 객체에 대한 기본적인 CRUD 작업을 허용합니다.

```

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

                "s3:PutObjectTagging",

            ],

            "Resource": [

                "arn:aws:s3:::S3_BUCKET_NAME",

                "arn:aws:s3:::S3_BUCKET_NAME/S3_BUCKET_DIRECTORY/*"

            ]

        }

    ]

}

```

다음 자리 표시자를 IAM 정책 및 S3 인스턴스에 맞는 실제 값으로 바꾸세요.

- `S3_BUCKET_NAME`: S3 버킷의 이름입니다.
- `S3_BUCKET_DIRECTORY`: 파일이 저장되는 버킷 내의 선택적 폴더 경로입니다(예: `s3://S3_BUCKET_NAME/S3_BUCKET_DIRECTORY`).

자세한 내용은 [AWS 문서](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_change-permissions.html)를 참고하세요.

**Google Drive** 스토리지는 [**Read File**](https://docs.langflow.org/read-file) 및 [**Write file**](https://docs.langflow.org/write-file) 컴포넌트를 통해 사용할 수 있지만, 환경 변수로는 구성할 수 없습니다.

## 파일 스토리지 환경 변수[​](#file-storage-environment-variables "Direct link to File storage environment variables")

다음 환경 변수는 Langflow 파일 관리 시스템의 파일 스토리지 백엔드를 구성합니다.

| 변수 | 형식 | 기본값 | 설명 |
| ----------------------------------------- | ----------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LANGFLOW_​STORAGE_​TYPE`                 | String      | `local` | 파일 스토리지 백엔드를 설정합니다. 지원되는 값: `local`(파일이 Langflow 구성 디렉터리에 저장됨) 또는 `s3`(파일이 AWS S3에 저장됨). S3 스토리지를 사용하려면 AWS 자격 증명 및 버킷 설정도 구성해야 합니다. |
| `LANGFLOW_​OBJECT_​STORAGE_​BUCKET_​NAME` | String      | 설정되지 않음 | 파일 스토리지에 사용할 S3 버킷의 이름입니다. `LANGFLOW_​STORAGE_​TYPE=s3`일 때 필수입니다. |
| `LANGFLOW_​OBJECT_​STORAGE_​PREFIX`       | String      | 설정되지 않음 | 파일이 저장되는 S3 버킷 내의 선택적 접두사/폴더 경로입니다. 설정하지 않으면 파일은 버킷의 루트에 저장됩니다. |
| `LANGFLOW_​OBJECT_​STORAGE_​TAGS`         | JSON object | 설정되지 않음 | `LANGFLOW_​STORAGE_​TYPE=s3`일 때 저장된 파일에 적용되는 선택적 S3 객체 태그입니다. 로컬 스토리지에서는 무시됩니다. 문자열 키와 문자열 값의 JSON 맵으로 제공합니다(예: `{"env": "prod", "owner": "data-team"}`). |

## 참고 자료[​](#see-also "Direct link to See also")

- [컴포넌트 레퍼런스](https://docs.langflow.org/concepts-components)
