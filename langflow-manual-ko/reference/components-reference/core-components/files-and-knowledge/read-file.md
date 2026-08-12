# Read File

> 원문: https://docs.langflow.org/next/read-file

Langflow 버전 1.7.0에서 이 컴포넌트는 **File**에서 **Read File**로 이름이 변경되었습니다.

**Read File** 컴포넌트는 파일을 로드하고 파싱하여 콘텐츠를 `JSON`, `Table`, `Message` 객체로 변환합니다.
여러 파일 유형을 지원하며, 병렬 처리와 오류 처리를 위한 파라미터를 제공하고, Docling 라이브러리를 사용한 고급 파싱을 지원합니다.

비주얼 에디터에서 또는 실행 시점에 **Read File** 컴포넌트에 파일을 추가할 수 있으며, 여러 파일을 한 번에 업로드할 수도 있습니다.
파일 업로드와 플로우에서 파일 다루는 방법에 대해 자세히 알아보려면 [파일 관리](https://docs.langflow.org/concepts-file-management)와 [파일을 수집할 수 있는 챗봇 만들기](https://docs.langflow.org/chat-with-files)를 참고하세요.

**Read File** 컴포넌트는 로컬 Langflow 데이터베이스, **AWS S3**, **Google Drive**에서 파일을 읽어올 수 있습니다.
자세한 내용은 [파일 스토리지 구성](https://docs.langflow.org/concepts-file-management#configure-file-storage)을 참고하세요.

## 파일 유형 및 크기 제한[​](#file-type-and-size-limits "Direct link to File type and size limits")

기본적으로 최대 파일 크기는 1024MB입니다.
이 값을 수정하려면 [환경 변수](https://docs.langflow.org/environment-variables)인 `LANGFLOW_MAX_FILE_SIZE_UPLOAD`를 변경하세요.

**지원되는 파일 유형**

다음 파일 유형은 **Read File** 컴포넌트에서 지원됩니다.
여러 파일을 함께 묶으려면 아카이브 및 압축 형식을 사용하거나, 디렉터리 내 모든 파일을 로드하려면 [**Directory** 컴포넌트](https://docs.langflow.org/directory)를 사용하세요.

- `.bz2`
- `.csv`
- `.docx`
- `.gz`
- `.htm`
- `.html`
- `.json`
- `.js`
- `.md`
- `.mdx`
- `.pdf`
- `.py`
- `.sh`
- `.sql`
- `.tar`
- `.tgz`
- `.ts`
- `.tsx`
- `.txt`
- `.xml`
- `.yaml`
- `.yml`
- `.zip`

지원되지 않는 파일 유형을 로드해야 하는 경우, 해당 파일 유형을 지원하는 다른 컴포넌트를 사용하여 Langflow 외부에서 파싱하거나, 업로드 전에 지원되는 유형으로 변환해야 합니다.

이미지는 [이미지 업로드](https://docs.langflow.org/concepts-file-management#upload-images)를 참고하세요.

동영상은 **Twelve Labs**와 **YouTube** [**번들**](https://docs.langflow.org/components-bundle-components)을 참고하세요.

## File 파라미터[​](#file-parameters "Direct link to File parameters")

일부 파라미터는 비주얼 에디터에서 기본적으로 숨겨져 있습니다.
컴포넌트를 선택했을 때 나타나는 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-inspection-panel)을 통해 모든 컴포넌트 파라미터를 수정할 수 있습니다.

| 이름                                    | 표시 이름                        | 설명                                                                                                                                                                                                                                                    |
| --------------------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| path                                    | Files                               | 입력 파라미터. 로드할 파일의 경로입니다. 로컬 파일이거나 [Langflow 파일 관리](https://docs.langflow.org/concepts-file-management) 내 파일일 수 있습니다. 개별 파일과 번들 아카이브를 모두 지원합니다.                                                                                   |
| file\_path                              | Server File Path                    | 입력 파라미터. [Langflow 파일 관리](https://docs.langflow.org/concepts-file-management) 내 파일을 가리키는 `file_path` 속성을 가진 `JSON` 객체이거나, 파일 경로를 가진 `Message` 객체입니다. **Files**(`path`)보다 우선하지만 동일한 파일 유형을 지원합니다. |
| separator                               | Separator                           | 입력 파라미터. `Message` 형식에서 여러 출력 사이에 사용할 구분자입니다.                                                                                                                                                                                     |
| silent\_errors                          | Silent Errors                       | 입력 파라미터. `true`이면 컴포넌트에서 발생한 오류가 예외를 발생시키지 않습니다. 기본값: 비활성화(`false`).                                                                                                                                              |
| delete\_server\_file\_after\_processing | Delete Server File After Processing | 입력 파라미터. `true`(기본값)이면 처리 후 **Server File Path**(`file_path`)가 삭제됩니다.                                                                                                                                                               |
| ignore\_unsupported\_extensions         | Ignore Unsupported Extensions       | 입력 파라미터. 활성화(`true`)하면 지원되지 않는 확장자를 가진 파일이 허용되지만 처리되지는 않습니다. 비활성화(`false`)하면 지원되지 않는 파일 유형이 제공될 경우 **Read File** 컴포넌트가 오류를 발생시킬 수 있습니다. 기본값은 `true`입니다.    |
| ignore\_unspecified\_files              | Ignore Unspecified Files            | 입력 파라미터. `true`이면 `file_path` 속성이 없는 `JSON`은 무시됩니다. `false`(기본값)이면 파일이 지정되지 않은 경우 컴포넌트가 오류를 발생시킵니다.                                                                                                     |
| concurrency\_multithreading             | Processing Concurrency              | 입력 파라미터. 여러 파일이 업로드된 경우 동시에 처리할 파일 수입니다. 기본값은 1입니다. 1보다 큰 값은 2개 이상의 파일에 대해 병렬 처리를 활성화합니다. 단일 파일 업로드와 고급 파싱에서는 무시됩니다.                                                                    |
| advanced\_parser                        | Advanced Parser                     | 입력 파라미터. `true`이면 [고급 파싱](#advanced-parsing)을 활성화합니다. 호환되는 파일 유형의 단일 파일 업로드에서만 사용할 수 있습니다. 기본값: 비활성화(`false`).                                                                                     |

## 고급 파싱[​](#advanced-parsing "Direct link to Advanced parsing")

Langflow 버전 1.6부터, **Read File** 컴포넌트는 지원되는 파일 유형에 대해 [Docling](https://docling-project.github.io/docling/) 라이브러리를 사용한 고급 문서 파싱을 지원합니다.

고급 파싱을 사용하려면 다음을 수행하세요.

1. 해당되는 경우 다음 사전 준비 사항을 완료합니다.

  - **Langflow 버전 1.6 이상 설치**: 이전 버전에서는 **Read File** 컴포넌트의 고급 파싱을 지원하지 않습니다. 업그레이드 안내는 [릴리스 노트](https://docs.langflow.org/release-notes)를 참고하세요.

  - **macOS Intel(x86_64)에 Docling 의존성 설치**: macOS Intel(x86_64)에서는 Docling 의존성이 기본으로 설치되지 않습니다. [Docling 설치 가이드](https://docling-project.github.io/docling/installation/)를 사용하여 Docling 의존성을 설치하세요.

        다른 모든 운영체제에서는 Docling 의존성이 기본으로 설치됩니다.

  - **Docker/Linux 시스템 의존성**: Linux의 Docker 컨테이너에서 Langflow를 실행하는 경우, 문서 처리를 위해 추가 시스템 패키지를 설치해야 할 수 있습니다. 자세한 내용은 [Docker 컨테이너에서의 문서 처리 오류](https://docs.langflow.org/troubleshoot#document-processing-errors-in-docker-containers)를 참고하세요.

  - **Windows용 개발자 모드 활성화**:

    Windows에서 Langflow Desktop을 실행하는 경우, Docling 컴포넌트를 사용하려면 [개발자 모드를 활성화](https://learn.microsoft.com/en-us/windows/apps/get-started/enable-your-device-for-development#activate-developer-mode)해야 합니다.
이 설정의 위치는 Windows OS 버전에 따라 다릅니다.
Windows 설정에서 **개발자용**을 찾거나 Windows 검색창에서 "개발자"를 검색한 뒤 **개발자 모드**를 활성화하세요.
변경 사항을 적용하려면 컴퓨터나 Langflow를 재시작해야 할 수 있습니다.

    Windows용 Langflow OSS에서는 개발자 모드가 필요하지 않습니다.

2. **Read File** 컴포넌트에 유효한 파일 하나를 추가합니다.

  고급 파싱의 제약 사항

  - 고급 파싱은 파일 하나만 처리합니다.
여러 파일을 선택하면 **Read File** 컴포넌트는 첫 번째 파일만 처리하고 나머지 파일은 무시합니다.
고급 파싱으로 여러 파일을 처리하려면 각 파일을 별도의 **Read File** 컴포넌트에 전달하거나, 전용 [**Docling** 컴포넌트](https://docs.langflow.org/bundles-docling)를 사용하세요.

  - 고급 파싱은 PDF에서 텍스트를 추출하는 등 문서 처리를 위해 설계되었으므로, `.csv`, `.xlsx`, `.parquet` 파일을 제외한 **Read File** 컴포넌트가 지원하는 모든 파일 유형을 처리할 수 있습니다.
구조화된 데이터 분석에는 [**Parser** 컴포넌트](https://docs.langflow.org/parser)를 사용하세요.

3. **Advanced Parsing**을 활성화합니다.

4. 고급 파싱 파라미터를 구성하려면 컴포넌트를 클릭하여 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-menus)을 엽니다.

    | 이름                         | 표시 이름                    | 설명                                                                                                                                                                                                                                                                                                                                       |
    | ---------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | pipeline                     | Pipeline                        | 입력 파라미터, 고급 파싱. 사용할 Docling 파이프라인으로, `standard`(기본값, 권장) 또는 `vlm`(결과가 일관되지 않을 수 있음) 중 하나입니다.                                                                                                                                                                                                                                     |
    | ocr\_engine                  | OCR Engine                      | 입력 파라미터, 고급 파싱. `pipeline`이 `standard`인 경우 사용할 OCR 파서입니다. 옵션은 `None`(기본값) 또는 [`EasyOCR`](https://pypi.org/project/easyocr/)입니다. `None`은 OCR 엔진을 사용하지 않음을 의미하며, 일부 문서에서는 결과가 일관되지 않거나 손상될 수 있습니다. 이 설정은 `vlm` 파이프라인에는 영향을 미치지 않습니다. |
    | md\_image\_placeholder       | Markdown Image Placeholder      | 입력 파라미터, 고급 파싱. 출력 유형이 **Markdown**인 경우 이미지 파일에 사용할 플레이스홀더를 정의합니다. 기본값: `<!-- image -->`.                                                                                                                                                                                                                                  |
    | md\_page\_break\_placeholder | Markdown Page Break Placeholder | 입력 파라미터, 고급 파싱. 출력 유형이 **Markdown**인 경우 페이지 나눔에 사용할 플레이스홀더를 정의합니다. 기본값: `""`(빈 문자열).                                                                                                                                                                                                                               |
    | doc\_key                     | Document Key                    | 입력 파라미터, 고급 파싱. 소스 문서에서 추출된 구조화된 정보를 담는 `DoclingDocument` 컬럼에 사용할 키입니다. 자세한 내용은 [Docling Document](https://docling-project.github.io/docling/concepts/docling_document/)를 참고하세요. 기본값: `doc`.                                                                                                                                   |

  팁
      추가적인 Docling 기능, 다른 컴포넌트, OCR 파서에 대해서는 [**Docling** 번들](https://docs.langflow.org/bundles-docling)을 사용하세요.

## File 출력[​](#file-output "Direct link to File output")

**Read File** 컴포넌트의 출력은 로드된 파일 수와 고급 파싱 활성화 여부에 따라 달라집니다.
여러 옵션이 있는 경우, 컴포넌트의 출력 포트 근처에서 출력 유형을 설정할 수 있습니다.

- No files
- One file without advanced parsing
- One file with advanced parsing
- Multiple files

**Read File** 컴포넌트를 파일을 선택하지 않고 실행하면 오류가 발생하며, **Silent Errors**가 활성화되어 있으면 출력이 생성되지 않습니다.
