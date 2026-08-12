# flow 빌드하기
> 원문: https://docs.langflow.org/concepts-flows

*flow*는 애플리케이션 워크플로우를 기능적으로 표현한 것입니다.
flow는 입력을 받아 처리하고 출력을 생성합니다.

flow는 애플리케이션 워크플로우의 개별 단계를 나타내는 *컴포넌트*들로 구성됩니다.

![Basic Prompting flow in the workspace](https://docs.langflow.org/assets/images/workspace-basic-prompting-c16e2f001725aa6dc1bc479f22aa11df.png)

Langflow의 flow는 완전히 직렬화가 가능하며, Langflow가 설치된 파일 시스템에서 저장하거나 불러올 수 있습니다.

팁

몇 분 안에 flow를 빌드하고 실행해보려면 [Langflow 퀵스타트](https://docs.langflow.org/get-started-quickstart)를 참고하세요.

## flow 생성하기[​](#create-a-flow "Direct link to Create a flow")

[**Projects** 페이지](#projects)에서 flow를 생성하는 방법은 네 가지입니다.

- **빈 flow 생성**: 프로젝트를 선택하고 **New Flow**를 클릭한 다음 **Blank Flow**를 클릭합니다.

- **템플릿으로 flow 생성**: 프로젝트를 선택하고 **New Flow**를 클릭한 다음 사용하려는 템플릿을 클릭합니다.

**템플릿이란 무엇인가요?**

  
      템플릿은 자신만의 flow를 만들기 위한 시작점으로 사용할 수 있는 사전 빌드된 flow입니다.
컴포넌트 몇 개로 구성된 기본 flow부터 많은 컴포넌트와 하위 flow로 구성된 복잡한 flow까지 다양합니다.

    예를 들어 **Basic Prompting** 템플릿은 채팅 입력과 사전 정의된 지시사항(프롬프트)을 모두 LLM에 전달하는 작은 flow를 보여줍니다.
반면 **Vector Store RAG** 템플릿은 검색 증강 생성(RAG) 챗봇을 만드는 방법을 보여주는 두 개의 하위 flow로 구성됩니다. 한 하위 flow는 벡터 저장소에 문맥과 관련된 데이터와 임베딩을 채우고, 다른 하위 flow는 사용자 질문에 답하기 위해 벡터 저장소에서 유사한 데이터를 조회합니다.

    Langflow 코드베이스에 [템플릿을 기여](https://docs.langflow.org/contributing-templates)할 수도 있습니다.

- **기존 flow 복제**: 복사하려는 flow를 찾은 다음 **More**를 클릭하고 **Duplicate**를 선택합니다.

- **flow 가져오기**: [flow 가져오기 및 내보내기](https://docs.langflow.org/concepts-flows-import)를 참고하세요.

[Langflow API](https://docs.langflow.org/api-flows)로도 flow를 생성할 수 있지만, flow 생성에 익숙해지기 전까지는 Langflow 팀은 [시각적 편집기](https://docs.langflow.org/concepts-overview) 사용을 권장합니다.

### 컴포넌트 추가하기[​](#add-components "Direct link to Add components")

flow는 [워크스페이스](https://docs.langflow.org/concepts-overview#workspace)에서 구성하고 연결하는 노드인 [컴포넌트](https://docs.langflow.org/concepts-components)로 구성됩니다.
각 컴포넌트는 AI 모델 제공이나 데이터 소스 연결과 같은 특정 작업을 수행합니다.

**Core components**와 **Bundles** 메뉴에서 컴포넌트를 드래그 앤 드롭하여 flow에 추가합니다.
그런 다음 컴포넌트 설정을 구성하고 컴포넌트들을 서로 연결합니다.

![Chat Input and Output connected to a Language Model component](https://docs.langflow.org/assets/images/connect-component-beccd1ed73b0f526547622f3c592fa45.png)

각 컴포넌트에는 구성 설정과 옵션이 있습니다. 일부는 모든 컴포넌트에 공통적이며, 일부는 특정 컴포넌트에 고유합니다.

일관된 flow를 구성하려면 컴포넌트를 *edge*(엣지) 또는 *port*(포트)로 연결하는데, 이들은 주고받는 특정 데이터 타입을 가지고 있습니다.
예를 들어 메시지 포트는 컴포넌트 간에 텍스트 문자열을 전송합니다.

포트 타입과 기반 컴포넌트 코드를 포함한 컴포넌트 구성에 대한 자세한 내용은 [컴포넌트 개요](https://docs.langflow.org/concepts-components)를 참고하세요.

### flow 실행하기[​](#run-a-flow "Direct link to Run a flow")

프로토타입 flow를 빌드한 후에는 [**Playground**](https://docs.langflow.org/concepts-playground)에서 테스트할 수 있습니다.
애플리케이션 개발에 Langflow를 사용할 준비가 되면, [Langflow API로 flow 트리거하기](https://docs.langflow.org/concepts-publish)를 익히고, [커스텀 의존성](https://docs.langflow.org/install-custom-dependencies)과 같은 더 고급 구성 옵션을 살펴보고, 최종적으로 [Langflow 애플리케이션을 컨테이너화](https://docs.langflow.org/develop-application)하세요.

프로덕션으로 넘어가거나 퍼블릭 인터넷을 통한 접근을 위해 Langflow MCP 서버를 배포할 준비가 되면 [Langflow 배포 개요](https://docs.langflow.org/deployment-overview)를 참고하세요.

#### flow 그래프[​](#flow-graphs "Direct link to Flow graphs")

flow가 실행되면 Langflow는 노드(컴포넌트)와 엣지(연결)로부터 방향성 비순환 그래프(DAG) 객체를 빌드하고, 실행 순서를 결정하기 위해 노드를 정렬합니다.

그래프 빌드는 노드를 검증하고 준비하기 위해 각 컴포넌트의 `def_build` 함수를 호출합니다.
이 그래프는 이후 의존성 순서대로 처리됩니다.
각 노드는 순차적으로 빌드되고 실행되며, 빌드된 각 노드의 결과는 해당 노드의 결과에 의존하는 노드로 전달됩니다.

## 프로젝트에서 flow 관리하기[​](#projects "Direct link to Manage flows in projects")

**Projects** 페이지는 Langflow를 실행할 때 도착하는 곳입니다. 여기서 flow와 프로젝트의 [MCP 서버](https://docs.langflow.org/mcp-server)를 관리할 수 있습니다.

Langflow 프로젝트는 관련된 flow를 정리하는 데 사용할 수 있는 폴더와 같습니다.
기본 프로젝트는 **Starter Project**이며, 다른 프로젝트를 생성하지 않는 한 flow는 여기에 저장됩니다.
프로젝트를 생성하려면 **Create new project**를 클릭하세요.

![Projects page with multiple flows in a project](https://docs.langflow.org/assets/images/my-projects-3b70ec6a7f8c05b3b3bab95795a611c0.png)

팁

flow를 편집한 후 **Projects** 페이지로 돌아가려면 프로젝트 이름이나 Langflow 헤더의 아이콘을 클릭하세요.

### flow 세부 정보 편집하기[​](#edit-flow-details "Direct link to Edit flow details")

1. **Projects** 페이지에서 편집하려는 flow를 찾습니다.
2. **More**를 클릭한 다음 **Edit details**를 선택합니다.
3. **Name**과 **Description**을 편집한 다음 **Save**를 클릭합니다.

### flow 버전 저장 및 복원하기[​](#save-and-restore-flow-versions "Direct link to Save and restore flow versions")

flow 편집기의 **Version History** 메뉴에서 flow의 버전을 저장할 수 있습니다.

1. 버전을 지정하려는 flow를 엽니다.
2. flow 편집기 사이드바에서 **Version History**를 클릭합니다.
3. **Current**에서 **Save**를 클릭해 flow의 현재 상태를 저장된 버전으로 캡처합니다.
4. 이전에 저장된 버전을 선택하면 읽기 전용 모드로 flow를 미리 볼 수 있습니다.
5. 선택한 버전으로 현재 초안을 대체하려면 **Restore**를 클릭합니다.

저장된 버전의 메뉴에서 해당 버전을 **Export**하거나 **Delete**할 수도 있습니다.

저장된 flow 버전은 Langflow 배포에 구성된 데이터베이스에 저장됩니다.

저장된 버전을 복원할 때 **Save current draft before restoring**가 활성화되어 있으면, 선택한 버전이 현재 작업을 대체하기 전에 Langflow가 현재 작업의 백업을 생성합니다.

[flow 자동 저장](https://docs.langflow.org/environment-variables#visual-editor-and-playground-behavior)과 flow 버전은 서로 다른 목적을 갖습니다.
자동 저장은 현재 flow 초안을 백그라운드에서 최신 상태로 유지하지만 버전 항목을 생성하지는 않습니다.
저장된 *버전*은 복원 지점을 원할 때 명시적으로 생성하는 스냅샷입니다.

저장된 버전을 미리 보는 동안, 미리보기가 현재 초안을 덮어쓰지 않도록 Langflow는 일시적으로 자동 저장을 중지합니다.

### flow 잠금[​](#lock-a-flow "Direct link to Lock a flow")

flow에 대한 변경을 방지하려면 잠글 수 있습니다.

1. **Projects** 페이지에서 잠그려는 flow를 찾습니다.
2. **More**를 클릭한 다음 **Edit details**를 선택합니다.
3. **Lock Flow**를 활성화한 다음 **Save**를 클릭합니다.

**Lock Flow**를 비활성화하여 flow의 잠금을 해제하려면 같은 단계를 반복합니다.

flow를 편집할 때 **Lock Status**는 flow가 **Locked**인지 **Unlocked**인지를 나타냅니다.
flow를 편집하는 동안에는 잠금 상태를 변경할 수 없습니다.

### flow 이동하기[​](#move-a-flow "Direct link to Move a flow")

flow를 한 프로젝트에서 다른 프로젝트로 이동하려면 다음을 수행합니다.

1. **Projects** 페이지에서 이동하려는 flow를 찾습니다.
2. flow 목록에서 프로젝트 목록의 대상 프로젝트 이름으로 flow를 클릭한 채로 드래그합니다.

### flow 삭제하기[​](#delete-a-flow "Direct link to Delete a flow")

1. **Projects** 페이지에서 삭제하려는 flow를 찾습니다.
2. **More**를 클릭한 다음 **Delete**를 선택합니다.

## flow 저장소와 로그[​](#flow-storage-and-logs "Direct link to Flow storage and logs")

기본적으로 flow와 flow 실행 데이터는 Langflow 데이터베이스에 저장되고, flow 로그는 Langflow 설정 디렉터리에 다른 Langflow 로그와 함께 저장됩니다.
자세한 내용은 [메모리 관리 옵션](https://docs.langflow.org/memory)과 [로깅](https://docs.langflow.org/logging)을 참고하세요.

## 참고 자료[​](#see-also "Direct link to See also")

- [flow 공유 및 임베드하기](https://docs.langflow.org/concepts-publish)
- [flow 가져오기 및 내보내기](https://docs.langflow.org/concepts-flows-import)
- [Langflow 환경 변수](https://docs.langflow.org/environment-variables)
