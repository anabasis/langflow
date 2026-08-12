# API Request

> 원문: https://docs.langflow.org/next/api-request

**API Request** 컴포넌트는 URL이나 curl 명령을 사용하여 HTTP 요청을 구성하고 전송합니다.

- **URL 모드**: 쉼표로 구분된 하나 이상의 URL을 입력하고, 각 URL에 대한 요청 메서드를 선택합니다.
- **curl 모드**: 실행할 curl 명령을 입력합니다.

컴포넌트의 파라미터에서 추가 요청 옵션과 필드를 활성화할 수 있습니다.

응답을 포함하는 [`JSON` 객체](https://docs.langflow.org/data-types#json)를 반환합니다.

제공업체별 API 컴포넌트에 대해서는 [**번들**](https://docs.langflow.org/components-bundle-components)을 참고하세요.

## API Request 파라미터[​](#api-request-parameters "Direct link to API Request parameters")

일부 파라미터는 비주얼 에디터에서 기본적으로 숨겨져 있습니다.
컴포넌트를 선택했을 때 나타나는 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-inspection-panel)을 통해 모든 컴포넌트 파라미터를 수정할 수 있습니다.

| 이름                     | 표시 이름           | 설명                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------ | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| mode                     | Mode                   | 입력 파라미터. 모드를 **URL** 또는 **curl** 중 하나로 설정합니다.                                                                                                                                                                                                                                                                                                                                                       |
| urls                     | URL                    | 입력 파라미터. 요청에 사용할 하나 이상의 쉼표로 구분된 URL을 입력합니다.                                                                                                                                                                                                                                                                                                                                            |
| curl                     | curl                   | 입력 파라미터. **curl 모드**에서만 사용됩니다. 완전한 curl 명령을 입력합니다. 다른 컴포넌트 파라미터는 해당 명령의 인자로부터 자동으로 채워집니다.                                                                                                                                                                                                                                                                    |
| method                   | Method                 | 입력 파라미터. 사용할 HTTP 메서드입니다.                                                                                                                                                                                                                                                                                                                                                                             |
| query\_params            | Query Parameters       | 입력 파라미터. URL에 추가할 쿼리 파라미터입니다.                                                                                                                                                                                                                                                                                                                                                                     |
| body                     | Body                   | 입력 파라미터. POST, PATCH, PUT 요청과 함께 딕셔너리 형태로 전송할 본문입니다.                                                                                                                                                                                                                                                                                                                                       |
| headers                  | Headers                | 입력 파라미터. 요청과 함께 딕셔너리 형태로 전송할 헤더입니다.                                                                                                                                                                                                                                                                                                                                                          |
| timeout                  | Timeout                | 입력 파라미터. 요청에 사용할 타임아웃 값입니다.                                                                                                                                                                                                                                                                                                                                                                       |
| follow\_redirects        | Follow Redirects       | 입력 파라미터. HTTP 리다이렉트를 따를지 여부입니다. Langflow 버전 1.7부터 공개 URL이 내부 리소스로 리다이렉트되는 SSRF 우회 공격을 방지하기 위해 **Follow Redirects** 파라미터는 기본값이 비활성화(`false`)로 설정됩니다. 대상 서버를 신뢰하는 경우에만 리다이렉트를 활성화하세요. 자세한 내용은 [SSRF 보호 환경 변수](https://docs.langflow.org/api-keys-and-authentication#ssrf-protection)를 참고하세요. |
| save\_to\_file           | Save to File           | 입력 파라미터. API 응답을 임시 파일로 저장할지 여부입니다. 기본값: 비활성화(`false`)                                                                                                                                                                                                                                                                                                                                 |
| include\_httpx\_metadata | Include HTTPx Metadata | 입력 파라미터. 출력에 `headers`, `status_code`, `response_headers`, `redirection_history`와 같은 속성을 포함할지 여부입니다. 기본값: 비활성화(`false`)                                                                                                                                                                                                                                                              |
