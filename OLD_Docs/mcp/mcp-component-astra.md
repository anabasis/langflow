# Astra DB MCP 서버를 Langflow에 연결

이 가이드는 **MCP Tools** 컴포넌트를 사용하여 에이전트 플로우에서 [DataStax Astra DB MCP 서버](https://github.com/datastax/astra-db-mcp)를 실행함으로써 [Langflow를 MCP 클라이언트로 사용](./mcp-client.md)하는 방법을 보여줍니다.

---

## 설정 단계

1. [Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)의 LTS 릴리스를 설치합니다.

   > **팁**: `uvx`는 Langflow 패키지에 `uv`와 함께 포함되어 있습니다. `npx` 서버 명령을 사용하려면 먼저 Node.js의 LTS 릴리스를 설치해야 합니다. Docker에서 Langflow를 실행하는 경우 컨테이너 이미지 내부에 Node.js를 설치하고 다시 빌드하여 `npx` 기반 MCP 서버가 런타임에 사용 가능하게 합니다.

2. [OpenAI](https://platform.openai.com/) API 키를 만듭니다.

3. 아직 없다면 [Astra DB Serverless(벡터) 데이터베이스](https://docs.datastax.com/en/astra-db-serverless/databases/create-database.html#create-vector-database)를 만듭니다.

4. 데이터베이스의 Astra DB API 엔드포인트와 **Database Administrator** 역할을 가진 Astra 애플리케이션 토큰을 가져옵니다.

5. 이 가이드를 따라하려면 **Simple Agent** 템플릿을 기반으로 플로우를 만듭니다.

6. 플로우에서 **URL** 도구를 제거합니다.

7. **MCP** 사이드바에서 Astra DB MCP 서버를 등록하고 **MCP Tools**를 캔버스에 추가합니다. 다음 값을 사용합니다:

   1. **Name** 필드에 MCP 서버의 이름을 입력합니다.

   2. **Command** 필드에 Astra DB MCP 서버에 연결하는 다음 코드를 추가합니다:

   ```
   npx -y @datastax/astra-db-mcp
   ```

   3. **Environment Variables** 필드에 Astra 데이터베이스의 값으로 `ASTRA_DB_APPLICATION_TOKEN` 및 `ASTRA_DB_API_ENDPOINT` 변수를 추가합니다.

   > **참고**: Langflow `.env` 파일에 선언된 환경 변수는 MCP 서버 명령에서 참조할 수 있지만, Langflow에서 선언된 전역 변수는 참조할 수 없습니다.
   >
   > `ASTRA_DB_APPLICATION_TOKEN`과 `ASTRA_DB_API_ENDPOINT`에 변수를 사용하려면 Langflow의 `.env` 파일에 추가하고 Langflow를 재시작하세요.

   각 변수를 별도로 추가합니다. 다른 변수 필드를 추가하려면 **Add More**를 클릭합니다:

   ```
   ASTRA_DB_APPLICATION_TOKEN=AstraCS:...
   ```

   ```
   ASTRA_DB_API_ENDPOINT=https://...-us-east-2.apps.astra.datastax.com
   ```

8. **Agent** 컴포넌트에 OpenAI API 키를 추가합니다.

   기본 모델은 OpenAI 모델입니다. 다른 모델을 사용하려면 **Model Provider**, **Model Name**, **API Key** 필드를 적절히 편집합니다.

9. **Playground**를 열고 에이전트에게 `What collections are available?`라고 물어봅니다.

   Langflow가 MCP 서버를 통해 Astra DB 데이터베이스에 연결되어 있으므로 에이전트는 올바른 도구를 선택하고 데이터베이스에 연결하여 답변을 검색합니다:

   ```
   The available collections in your database are:
   collection_002
   hardware_requirements
   load_collection
   nvidia_collection
   software_requirements
   ```

---

## 참고 항목

- [Langflow를 MCP 클라이언트로 사용](./mcp-client.md)
- [Langflow를 MCP 서버로 사용](./mcp-server.md)

---

*원문: https://docs.langflow.org/next/mcp-component-astra*
