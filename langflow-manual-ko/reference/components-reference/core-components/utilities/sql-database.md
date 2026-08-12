# SQL 데이터베이스

> 원문: https://docs.langflow.org/next/sql-database

**SQL 데이터베이스(SQL Database)** 컴포넌트는 [SQLAlchemy 호환 데이터베이스](https://docs.sqlalchemy.org/en/20/)에서 SQL 쿼리를 실행합니다.
PostgreSQL, MySQL, SQLite 등 SQLAlchemy와 호환되는 모든 데이터베이스를 지원합니다.

CQL 쿼리는 [**DataStax** 번들](https://docs.langflow.org/bundles-datastax)을 참고하세요.

## 자연어 프롬프트로 SQL 데이터베이스 쿼리하기[​](#query-an-sql-database-with-natural-language-prompts "Query an SQL database with natural language prompts 항목으로 바로 가기")

다음 예시는 플로우에서 **SQL 데이터베이스** 컴포넌트를 사용하는 방법을 보여주고, **Agent** 컴포넌트를 통해 자연어 쿼리를 지원하도록 컴포넌트를 수정하는 방법을 설명합니다.

이를 통해 수동으로 입력한 단일 쿼리로 제한하거나 사용자, 애플리케이션, 또는 다른 컴포넌트가 올바른 SQL 문법의 입력을 제공하도록 요구하는 대신, 어떤 쿼리에도 동일한 **SQL 데이터베이스** 컴포넌트를 사용할 수 있습니다.
**Agent** 컴포넌트가 사용자의 자연어 프롬프트를 SQL 쿼리로 변환하고, 그 쿼리를 **SQL 데이터베이스** 컴포넌트에 전달한 다음, 결과를 사용자에게 반환하기 때문에 사용자는 SQL 문법을 마스터할 필요가 없습니다.

또한 애플리케이션이나 다른 컴포넌트로부터의 입력을 정확한 SQL 쿼리로 추출하고 변환할 필요가 없습니다.
대신 에이전트가 들어오는 데이터에 따라 SQL 쿼리를 생성하고 실행해야 한다는 것을 이해할 수 있을 만큼의 맥락만 제공하면 됩니다.

1. 자체 샘플 데이터베이스를 사용하거나 테스트 데이터베이스를 만듭니다.

**테스트 SQL 데이터베이스 생성**

  1. `test.db`라는 데이터베이스를 생성합니다.

    ```
    sqlite3 test.db
    ```

  2. 데이터베이스에 값을 추가합니다.

    ```
    sqlite3 test.db "
    CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name TEXT,
        email TEXT,
        age INTEGER
    );

    INSERT INTO users (name, email, age) VALUES
        ('John Doe', 'john@example.com', 30),
        ('Jane Smith', 'jane@example.com', 25),
        ('Bob Johnson', 'bob@example.com', 35);
    "
    ```

  3. 데이터베이스가 생성되었고 데이터가 포함되어 있는지 확인합니다.

    ```
    sqlite3 test.db "SELECT * FROM users;"
    ```
        결과에는 이전 단계에서 입력한 텍스트 데이터가 나열됩니다.

    ```
    1|John Doe|john@example.com
    2|Jane Smith|jane@example.com
    3|John Doe|john@example.com
    4|Jane Smith|jane@example.com
    ```

2. 플로우에 **SQL 데이터베이스** 컴포넌트를 추가합니다.

3. **Database URL** 필드에 `sqlite:///test.db`와 같이 데이터베이스의 연결 문자열을 추가합니다.

    이 시점에서 **SQL Query** 필드에 직접 SQL 쿼리를 입력하거나, [포트](https://docs.langflow.org/concepts-components#component-ports)를 사용하여 **Chat Input** 컴포넌트와 같은 다른 컴포넌트에서 쿼리를 전달할 수 있습니다.
더 넓은 공간이 필요하면 **Expand**를 클릭하여 전체 화면 텍스트 필드를 엽니다.

    하지만 에이전트 환경에서 이 컴포넌트를 더 동적으로 사용하려면, 다음 단계에서 설명하는 것처럼 **Agent** 컴포넌트를 사용하여 자연어 입력을 SQL 쿼리로 변환하세요.

4. **SQL 데이터베이스** 컴포넌트를 클릭하여 [컴포넌트 헤더 메뉴](https://docs.langflow.org/concepts-components#component-menus)를 표시한 다음, **Tool Mode**를 활성화합니다.

    이제 이 컴포넌트를 에이전트의 도구로 사용할 수 있습니다.
**Tool Mode**에서는 에이전트가 사용자의 요청을 완료하기 위해 이 도구가 필요하다고 판단하면 쿼리를 생성하여 전송하기 때문에, **SQL 데이터베이스** 컴포넌트에 쿼리를 설정하지 않습니다.
자세한 내용은 [에이전트용 도구 구성](https://docs.langflow.org/agents-tools)을 참고하세요.

5. 플로우에 **Agent** 컴포넌트를 추가하고 OpenAI API 키를 입력합니다.

    기본 모델은 OpenAI 모델입니다.
다른 모델을 사용하려면 **Model Provider**, **Model Name**, **API Key** 필드를 그에 맞게 수정하세요.

    고도로 특화된 쿼리를 실행해야 한다면, 고급 SQL 쿼리와 같은 작업에 맞게 훈련된 모델을 선택하는 것을 고려하세요.
선호하는 모델이 **Agent** 컴포넌트의 내장 모델 목록에 없다면, **Model Provider**를 **Connect other models**로 설정한 다음 원하는 [언어 모델 컴포넌트](https://docs.langflow.org/components-models)를 연결하세요.

6. **SQL 데이터베이스** 컴포넌트의 **Toolset** 출력을 **Agent** 컴포넌트의 **Tools** 입력에 연결합니다.

    ![Agent 컴포넌트에 연결된 SQL 데이터베이스 컴포넌트](https://docs.langflow.org/assets/images/component-sql-database-3d2c985aee2dd9970874cb85e1d2b570.png)

7. **Playground**를 클릭한 다음, 데이터베이스의 데이터에 관해 `Which users are in my database?`와 같은 질문을 에이전트에게 합니다.

    에이전트는 질문에 답하기 위해 데이터베이스를 쿼리해야 한다고 판단하고, LLM을 사용해 SQL 쿼리를 생성한 다음, **SQL 데이터베이스** 컴포넌트의 `RUN_SQL_QUERY` 액션을 사용하여 데이터베이스에서 쿼리를 실행합니다.
마지막으로 원본 결과나 다른 형식으로 반환하라는 지시가 없는 한, 대화 형식으로 결과를 반환합니다.

    다음 예시는 데이터가 적은 테스트 데이터베이스를 쿼리했지만, 더 풍부한 데이터셋을 사용하면 더 상세하거나 복잡한 질문을 할 수 있습니다.

```
Here are the users in your database:

1. **John Doe** - Email: john@example.com
2. **Jane Smith** - Email: jane@example.com
3. **John Doe** - Email: john@example.com
4. **Jane Smith** - Email: jane@example.com

It seems there are duplicate entries for the users.
```

## SQL 데이터베이스 파라미터[​](#sql-database-parameters "SQL Database parameters 항목으로 바로 가기")

일부 파라미터는 시각적 편집기에서 기본적으로 숨겨져 있습니다.
컴포넌트를 선택했을 때 표시되는 [컴포넌트 검사 패널](https://docs.langflow.org/concepts-components#component-inspection-panel)을 통해 모든 컴포넌트 파라미터를 수정할 수 있습니다.

| Name             | Display Name    | Info                                                                                                                                                                                |
| ---------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| database_url    | Database URL    | 입력 파라미터. SQLAlchemy와 호환되는 데이터베이스 연결 URL입니다.                                                                                                                                 |
| query            | SQL Query       | 입력 파라미터. 실행할 SQL 쿼리로, 직접 입력하거나 다른 컴포넌트에서 전달받거나, **Tool Mode**에서는 **Agent** 컴포넌트가 자동으로 제공합니다. |
| include_columns | Include Columns | 입력 파라미터. 결과에 열 이름을 포함할지 여부입니다. 기본값은 활성화(`true`)입니다.                                                                                                    |
| add_error       | Add Error       | 입력 파라미터. 활성화하면 오류 메시지가 반환될 경우 결과에 추가합니다. 기본값은 비활성화(`false`)입니다.                                                                                                         |
| run_sql_query  | Result Table    | 출력 파라미터. [`Table`](https://docs.langflow.org/data-types#table) 형태의 쿼리 결과입니다.                                                                                                              |
