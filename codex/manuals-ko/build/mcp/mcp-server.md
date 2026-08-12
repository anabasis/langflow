---
title: "Langflow를 MCP 서버로 사용"
source_url: "https://docs.langflow.org/next/mcp-server"
source_commit: "3ec070e99af5196fdb187546de2c4f29a35ebe46"
source_file: "Agents/mcp-server.mdx"
translation_type: "한국어 요약 번역"
---

# Langflow를 MCP 서버로 사용

Langflow에서 **Langflow를 MCP 서버로 사용** 기능을 이해하고 구성·실행·검증하기 위한 한국어 안내서임.

> 이 문서는 공식 Langflow 문서를 바탕으로 작성한 한국어 요약 매뉴얼임. 버전별 옵션과 전체 예제는 아래 공식 원문 확인 필요.

## 문서 정보

- 공식 문서: [https://docs.langflow.org/next/mcp-server](https://docs.langflow.org/next/mcp-server)
- 원본 소스: [Agents/mcp-server.mdx](https://github.com/langflow-ai/langflow/blob/3ec070e99af5196fdb187546de2c4f29a35ebe46/docs/docs/Agents/mcp-server.mdx)
- 기준 커밋: `3ec070e99af5196fdb187546de2c4f29a35ebe46`

## 주요 내용

- 사전 요구 사항 (Prerequisites)
- Serve flows as MCP tools (Serve flows as MCP tools {#select-flows-to-serve})
- Prevent automatic MCP server configuration for Langflow projects
- Selectively enable and disable MCP servers for Langflow projects
- Edit flow tool names and descriptions
- tool execution timeouts 구성 (Configure tool execution timeouts)
- Connect clients to your Langflow MCP server (Connect clients to your Langflow MCP server {#connect-clients-to-use-the-servers-actions})
- MCP server authentication (MCP server authentication {#authentication})
- Deploy your Langflow MCP server externally (Deploy your Langflow MCP server externally {#deploy-your-server-externally})
- MCP Inspector to test and debug flows 사용 (Use MCP Inspector to test and debug flows {#test-and-debug-flows})
- Restrict MCP server management to superusers (Restrict MCP server management to superusers {#restrict-mcp-server-management})
- MCP server environment variables
- Troubleshoot Langflow MCP servers (Troubleshoot Langflow MCP servers {#troubleshooting-mcp-server})
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

설정 필드, 전체 코드 예제, 버전별 제한 사항과 화면 이미지는 [공식 문서](https://docs.langflow.org/next/mcp-server) 및 [GitHub 원본](https://github.com/langflow-ai/langflow/blob/3ec070e99af5196fdb187546de2c4f29a35ebe46/docs/docs/Agents/mcp-server.mdx)에서 확인 가능.
