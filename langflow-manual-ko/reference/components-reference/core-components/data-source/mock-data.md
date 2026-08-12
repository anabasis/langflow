# Mock Data

> 원문: https://docs.langflow.org/next/mock-data

**Mock Data** 컴포넌트는 테스트와 개발을 위한 샘플 데이터를 생성합니다.
다음 출력 유형 중에서 선택할 수 있습니다.

- `message_output`: Lorem Ipsum 샘플 텍스트를 담은 [Message(텍스트)](https://docs.langflow.org/data-types#message) 출력입니다.
- `data_output`: `records` 아래에 하나의 샘플 레코드와 `summary` 섹션을 포함하는 JSON 구조의 [Data(JSON)](https://docs.langflow.org/data-types#json) 객체입니다.
- `dataframe_output`: `customer_id`, `first_name`, `last_name` 등의 컬럼을 포함하는 50개의 목(mock) 레코드를 담은 [DataFrame(테이블 형식)](https://docs.langflow.org/data-types#table)입니다.
