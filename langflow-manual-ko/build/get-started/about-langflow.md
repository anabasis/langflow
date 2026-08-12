# Langflow란 무엇인가요?
> 원문: https://docs.langflow.org/

Langflow는 AI 애플리케이션을 구축하기 위한 오픈소스 Python 기반 커스터마이징 가능 프레임워크입니다.
에이전트, Model Context Protocol(MCP)과 같은 중요한 AI 기능을 지원하며, 특정 대규모 언어 모델(LLM)이나 벡터 스토어를 사용하도록 강제하지 않습니다.

비주얼 에디터는 애플리케이션 워크플로우의 프로토타이핑을 단순화하여 개발자가 자신의 아이디어를 강력하고 실제적인 솔루션으로 빠르게 전환할 수 있도록 돕습니다.

**직접 사용해 보기**

몇 분 만에 첫 플로우를 빌드하고 실행해 보세요. [Install Langflow](https://docs.langflow.org/get-started-installation)로 설치한 다음 [Quickstart](https://docs.langflow.org/get-started-quickstart)를 따라 해 보세요.

[Quickstart – 몇 분 만에 첫 플로우를 빌드하고 실행합니다.](https://docs.langflow.org/get-started-quickstart)
[Components – 사용 가능한 모든 컴포넌트와 통합을 살펴봅니다.](https://docs.langflow.org/concepts-components)
[Deploy – Langflow를 프로덕션 환경에 배포합니다.](https://docs.langflow.org/deployment-overview)

## 애플리케이션 개발 및 프로토타이핑[​](#application-development-and-prototyping)

Langflow는 챗봇, 문서 분석 시스템, 콘텐츠 생성기, 에이전틱 애플리케이션 등 다양한 AI 애플리케이션 개발을 도와줍니다.

Langflow에는 그대로 사용하거나 필요에 맞게 커스터마이징할 수 있는 여러 사전 빌드된 템플릿이 포함되어 있습니다.

### 몇 분 만에 플로우 만들기[​](#create-flows-in-minutes)

Langflow의 주요 목적은 애플리케이션 워크플로우를 기능적으로 표현한 플로우를 생성하고 서비스하는 것입니다.

[플로우를 빌드](https://docs.langflow.org/concepts-flows)하려면 컴포넌트 노드를 연결하고 구성합니다. 각 컴포넌트는 워크플로우의 단일 단계입니다.

Langflow의 [비주얼 에디터](https://docs.langflow.org/concepts-overview)를 사용하면 컴포넌트를 드래그 앤 드롭하여 기능적인 AI 애플리케이션 워크플로우를 빠르게 빌드하고 테스트할 수 있습니다.
예를 들어 LLM과 제품 데이터 스토어를 사용하여 고객이 매장의 제품에 대해 질문할 수 있는 이커머스 매장용 챗봇 플로우를 만들 수 있습니다.

![Langflow의 Basic Prompting 플로우](https://docs.langflow.org/assets/images/workspace-basic-prompting-c16e2f001725aa6dc1bc479f22aa11df.png)

### 실시간으로 플로우 테스트하기[​](#test-flows-in-real-time)

[**Playground**](https://docs.langflow.org/concepts-playground)를 사용하면 전체 애플리케이션 스택을 빌드하지 않고도 플로우를 테스트할 수 있습니다.
플로우와 상호작용하며 플로우 로직과 응답 생성에 대한 실시간 피드백을 받을 수 있습니다.

또한 개별 컴포넌트를 실행하여 의존성을 독립적으로 테스트할 수도 있습니다.

### 플로우 실행 및 서비스하기[​](#run-and-serve-flows)

플로우를 더 정식적인 애플리케이션 개발을 위한 프로토타입으로 사용할 수도 있고, Langflow API를 사용하여 플로우를 애플리케이션 코드에 임베드할 수도 있습니다.

더 광범위한 개발을 위해서는 Langflow를 의존성으로 빌드하거나 Langflow 서버를 배포하여 공개 인터넷을 통해 플로우를 서비스할 수 있습니다.

[Trigger flows with the API – Langflow API를 사용하여 애플리케이션 코드에서 플로우를 실행합니다.](https://docs.langflow.org/concepts-publish)
[Containerize your app – Langflow를 컨테이너화된 애플리케이션으로 빌드하고 배포합니다.](https://docs.langflow.org/develop-application)

## 무한한 수정과 통합[​](#endless-modifications-and-integrations)

Langflow는 AI 애플리케이션에 필요한 다양한 서비스, 도구, 기능을 지원하는 [컴포넌트](https://docs.langflow.org/concepts-components)를 제공합니다.

일부 컴포넌트는 입력, 출력, 데이터 스토어와 같이 범용적입니다.
다른 컴포넌트는 에이전트, 언어 모델, 임베딩 제공자와 같이 전문화되어 있습니다.

모든 컴포넌트는 고정값 또는 변수값으로 설정할 수 있는 파라미터를 제공합니다. 또한 tweaks를 사용하여 런타임에 플로우 설정을 일시적으로 오버라이드할 수 있습니다.

### 에이전트 및 MCP 지원[​](#agent-and-mcp-support)

[Langflow Agents – Langflow로 AI 에이전트를 빌드하고 구성합니다.](https://docs.langflow.org/agents)
[Agent tools – 컴포넌트와 플로우를 에이전트 도구로 사용합니다.](https://docs.langflow.org/agents-tools)
[MCP server – Langflow를 MCP 서버로 노출합니다.](https://docs.langflow.org/mcp-server)
[MCP client – Langflow를 외부 MCP 서버에 연결합니다.](https://docs.langflow.org/mcp-client)

### 확장성[​](#extensibility)

핵심 컴포넌트 외에도 Langflow는 커스텀 컴포넌트를 지원합니다.

다른 사람이 개발한 커스텀 컴포넌트를 사용할 수 있으며, 개인적인 용도나 다른 Langflow 사용자와 공유하기 위해 직접 커스텀 컴포넌트를 개발할 수도 있습니다.

[Contribute – Langflow 개발에 참여합니다.](https://docs.langflow.org/contributing-how-to-contribute)
[Custom components – 나만의 Python 컴포넌트를 만듭니다.](https://docs.langflow.org/components-custom-components)
[Get help – 개선 사항을 요청하고 이슈를 보고합니다.](https://docs.langflow.org/contributing-github-issues)

## 다음 단계[​](#next-steps)

- [Install Langflow](https://docs.langflow.org/get-started-installation)
- [Quickstart](https://docs.langflow.org/get-started-quickstart)
