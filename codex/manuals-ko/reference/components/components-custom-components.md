---
title: "사용자 정의 Python 컴포넌트 만들기"
source_url: "https://docs.langflow.org/next/components-custom-components"
source_commit: "3ec070e99af5196fdb187546de2c4f29a35ebe46"
source_file: "Components/components-custom-components.mdx"
translation_type: "한국어 요약 번역"
---

# 사용자 정의 Python 컴포넌트 만들기

Langflow 비주얼 편집기에서 **사용자 정의 Python 컴포넌트 만들기** 컴포넌트를 연결하고 설정할 때 필요한 핵심 항목을 안내하는 문서임.

> 이 문서는 공식 Langflow 문서를 바탕으로 작성한 한국어 요약 매뉴얼임. 버전별 옵션과 전체 예제는 아래 공식 원문 확인 필요.

## 문서 정보

- 공식 문서: [https://docs.langflow.org/next/components-custom-components](https://docs.langflow.org/next/components-custom-components)
- 원본 소스: [Components/components-custom-components.mdx](https://github.com/langflow-ai/langflow/blob/3ec070e99af5196fdb187546de2c4f29a35ebe46/docs/docs/Components/components-custom-components.mdx)
- 기준 커밋: `3ec070e99af5196fdb187546de2c4f29a35ebe46`

## 주요 내용

- Custom component quickstart (Custom component quickstart {#quickstart})
- a Python file 만들기 (Create a Python file)
- Save the custom component (Save the custom component {#custom-component-path})
- the `__init__.py` file 만들기 (Create the `__init__.py` file)
- Load your component
- Docker deployment
- How components execute
- Inputs and outputs
- Inputs
- Outputs
- Tool mode
- Typed annotations
- Common return types
- Enable dynamic fields

## 사용 절차

1. 비주얼 편집기에서 해당 컴포넌트를 플로에 추가.
2. 필수 입력값과 연결 포트의 데이터 타입 확인.
3. 자격 증명과 실행 옵션 구성.
4. Playground 또는 API 실행으로 출력 검증.
5. 오류 발생 시 컴포넌트 출력과 서버 로그를 함께 확인.

## 적용 시 주의 사항

- 명령어, API 경로, JSON 키, 환경 변수명 및 컴포넌트 이름은 원문 표기를 유지할 것.
- 실행 전 설치 버전과 공식 문서의 지원 범위를 확인할 것.
- 입력·출력 포트의 데이터 타입과 필수 필드를 연결 전에 확인할 것.

## 원문 세부 내용 확인

설정 필드, 전체 코드 예제, 버전별 제한 사항과 화면 이미지는 [공식 문서](https://docs.langflow.org/next/components-custom-components) 및 [GitHub 원본](https://github.com/langflow-ai/langflow/blob/3ec070e99af5196fdb187546de2c4f29a35ebe46/docs/docs/Components/components-custom-components.mdx)에서 확인 가능.
