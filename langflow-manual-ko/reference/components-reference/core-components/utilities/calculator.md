# 계산기

> 원문: https://docs.langflow.org/next/calculator

**계산기(Calculator)** 컴포넌트는 수학 표현식에 대해 기본적인 산술 연산을 수행합니다.
덧셈, 뺄셈, 곱셈, 나눗셈, 거듭제곱 연산을 지원합니다.

플로우에서 이 컴포넌트를 사용하는 예시는 [**Python 인터프리터** 컴포넌트](https://docs.langflow.org/python-interpreter)를 참고하세요.

## 계산기 파라미터[​](#calculator-parameters "Calculator parameters 항목으로 바로 가기")

| Name       | Type   | Description                                                                                                     |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------------------- |
| expression | String | 입력 파라미터. `4*4*(33/22)+12-20`와 같이 평가할 산술 표현식입니다.                            |
| result     | JSON   | 출력 파라미터. 평가된 표현식을 포함하는 [`JSON` 객체](https://docs.langflow.org/data-types) 형태의 계산 결과입니다. |
