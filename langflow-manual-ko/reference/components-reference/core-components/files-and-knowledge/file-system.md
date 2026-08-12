# File System

> 원문: https://docs.langflow.org/next/file-system

**File System** 컴포넌트는 에이전트에게 샌드박스 처리된 파일시스템 접근을 제공합니다.
에이전트를 위한 다섯 가지 파일 I/O 도구가 포함되어 있습니다.

- `read_file`
- `write_file`
- `edit_file`
- `glob_search`
- `grep_search`

모든 작업은 [`LANGFLOW_FS_TOOL_BASE_DIR`](https://docs.langflow.org/environment-variables) 환경 변수로 지정된 기본 디렉터리로 범위가 제한됩니다. 기본 위치는 `~/.langflow/fs_tool/fs_sandbox`입니다.
다른 디렉터리를 사용하려면 `.env` 파일에서 `LANGFLOW_FS_TOOL_BASE_DIR`에 위치를 설정하세요.

[`LANGFLOW_AUTO_LOGIN`](https://docs.langflow.org/api-keys-and-authentication#langflow-auto-login)이 `true`로 설정되어 있으면 모든 에이전트가 `LANGFLOW_FS_TOOL_BASE_DIR/shared/`에 있는 단일 작업 공간을 공유합니다.
`LANGFLOW_AUTO_LOGIN`이 `false`로 설정되어 있으면, 인증된 각 사용자는 `LANGFLOW_FS_TOOL_BASE_DIR/users/HASH/`에 개별 작업 공간을 갖게 되며, 여기서 `HASH`는 HMAC 기반으로 파생된 불투명한 식별자입니다. 익명 요청은 거부됩니다. `LANGFLOW_AUTO_LOGIN`의 기본값은 `true`이므로 공유 모드가 기본 동작입니다.

도구 오류는 처리되지 않은 예외로 발생하지 않습니다.
도구 오류는 구조화된 JSON 형태로 에이전트에 반환됩니다.

```
{"error":"File not found: DOC.md","path":"DOC.md"}
```

## 플로우에서 File System 컴포넌트 사용하기[​](#use-the-file-system-component-in-a-flow "Direct link to Use the File System component in a flow")

1. **File System** 컴포넌트를 **Agent** 컴포넌트의 **Tools** 입력에 연결합니다.

2. **File System** 컴포넌트에서 **Tool Mode**를 활성화하여 `read_file`, `write_file`, `edit_file`, `glob_search`, `grep_search`를 에이전트에 노출합니다.

3. 선택적으로 **Workspace Sub-path**를 설정하여 에이전트를 샌드박스 내 특정 하위 폴더로 제한할 수 있습니다.
하위 폴더는 최초 사용 시 자동으로 생성됩니다.
필드를 비워 두면 에이전트가 전체 샌드박스 루트에 접근할 수 있습니다.

    예를 들어 **Workspace Sub-path** 필드에 `projects/my-application`을 입력하면 모든 파일 작업이 `LANGFLOW_FS_TOOL_BASE_DIR/shared/projects/my-application/`로 제한됩니다.

    `LANGFLOW_AUTO_LOGIN`이 `false`로 설정된 경우, 에이전트의 범위가 제한된 하위 폴더는 `LANGFLOW_FS_TOOL_BASE_DIR/users/$HASH/projects/my-application`에 위치합니다.

4. 선택적으로 **Read Only**를 선택하여 `write_file` 및 `edit_file` 작업을 비활성화할 수 있습니다.

5. **Playground**에서 연결을 테스트하기 위해 메시지를 보냅니다. 예를 들어 `List all files in my workspace`를 입력합니다.

    에이전트는 `**/*`를 인자로 `glob_search`를 호출하고 샌드박스 디렉터리의 내용을 반환합니다.

## File System 파라미터[​](#file-system-parameters "Direct link to File System parameters")

| 이름         | 유형    | 설명                                                                                                                                                                                              |
| ------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `root_​path` | String  | 입력 파라미터. 샌드박스 처리된 작업 공간 내의 하위 폴더입니다. 작업 공간 루트를 사용하려면 비워 둡니다.                                                                                             |
| `read_​only` | Boolean | 입력 파라미터. `true`이면 `write_​file`과 `edit_​file`이 비활성화되고 에이전트에 등록되지 않습니다. 기본값: `false`.                                                                             |
| `metadata`   | Data    | 출력 파라미터. 빌드 시점의 샌드박스 구성을 설명하는, 특정 파일 작업과는 무관한 고정 구조의 `JSON` 객체입니다. 필드는 `root_​path`, `read_​only`, `tools_​registered`, `auto_​login`, `mode`(`shared`, `isolated`, `refused` 중 하나), `effective_​root`, `resolution_​error`입니다. |

## Docker 배포[​](#docker-deployment "Direct link to Docker deployment")

Docker에서 Langflow를 실행할 때는 샌드박스 디렉터리를 영구적인 볼륨으로 마운트해야 합니다.
이는 사용자별 네임스페이스 해시를 파생시키는 데 사용되는 pepper 파일이 컨테이너 재시작 후에도 유지되도록 보장합니다.

```
services:
  langflow:
    environment:
      - LANGFLOW_FS_TOOL_BASE_DIR=/data/fs_sandbox
    volumes:
      - lfx-fs-data:/data/fs_sandbox

volumes:
  lfx-fs-data:
```
