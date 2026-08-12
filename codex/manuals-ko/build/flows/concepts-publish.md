---
title: "Langflow API로 플로 실행"
source_url: "https://docs.langflow.org/next/concepts-publish"
source_commit: "3ec070e99af5196fdb187546de2c4f29a35ebe46"
source_file: "Flows/concepts-publish.mdx"
translation_type: "한국어 요약 번역"
---

# Langflow API로 플로 실행

Langflow에서 **Langflow API로 플로 실행** 기능을 이해하고 구성·실행·검증하기 위한 한국어 안내서임.

> 이 문서는 공식 Langflow 문서를 바탕으로 작성한 한국어 요약 매뉴얼임. 버전별 옵션과 전체 예제는 아래 공식 원문 확인 필요.

## 문서 정보

- 공식 문서: [https://docs.langflow.org/next/concepts-publish](https://docs.langflow.org/next/concepts-publish)
- 원본 소스: [Flows/concepts-publish.mdx](https://github.com/langflow-ai/langflow/blob/3ec070e99af5196fdb187546de2c4f29a35ebe46/docs/docs/Flows/concepts-publish.mdx)
- 기준 커밋: `3ec070e99af5196fdb187546de2c4f29a35ebe46`

## 주요 내용

- the Langflow API to run flows 사용 (Use the Langflow API to run flows {#api-access})
- Generate API code snippets
- Langflow API authentication
- Tweaks (API inputs) (Tweaks (API inputs) {#input-schema})
- a flow ID alias 사용 (Use a flow ID alias)
- Embed a flow into a website (Embed a flow into a website {#embedded-chat-widget})
- Get a langflow-chat snippet
- Embed the chat widget with React, Angular, or HTML (Embed the chat widget with React, Angular, or HTML {#embed-the-chat-widget})
- the langflow-chat web component 구성 (Configure the langflow-chat web component {#configure-the-langflow-chat-web-component})
- Serve flows through a Langflow MCP server
- flows with the OpenAI Responses compatible endpoint 실행 (Run flows with the OpenAI Responses compatible endpoint {#openai-responses-api})
- See also

## 사용 절차

1. 공식 문서의 사전 요구 사항과 지원 버전 확인.
2. 원문 순서에 따라 설정값과 연결 관계 구성.
3. 최소 예제로 기능 동작 확인.
4. 로그와 출력값을 기준으로 오류 여부 검증.
5. 운영 적용 전 보안·성능·복구 기준 점검.

## 적용 시 주의 사항

- 명령어, API 경로, JSON 키, 환경 변수명 및 컴포넌트 이름은 원문 표기를 유지할 것.
- 실행 전 설치 버전과 공식 문서의 지원 범위를 확인할 것.

## 원문 세부 내용 확인

설정 필드, 전체 코드 예제, 버전별 제한 사항과 화면 이미지는 [공식 문서](https://docs.langflow.org/next/concepts-publish) 및 [GitHub 원본](https://github.com/langflow-ai/langflow/blob/3ec070e99af5196fdb187546de2c4f29a35ebe46/docs/docs/Flows/concepts-publish.mdx)에서 확인 가능.
