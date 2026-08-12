# 외부 PostgreSQL 데이터베이스 구성

Langflow의 기본 데이터베이스는 [SQLite](https://www.sqlite.org/docs.html)이지만, 대신 PostgreSQL을 사용하도록 구성할 수 있습니다.

PostgreSQL은 동시 사용자 지원, 고급 데이터 무결성 기능 및 확장성으로 인해 프로덕션 환경에 더 적합합니다.

---

## 사전 요구사항

- PostgreSQL 버전 15 이상

---

## 로컬 PostgreSQL 데이터베이스에 Langflow 연결

1. Langflow가 실행 중인 경우 `Ctrl+C`로 중지합니다.

2. PostgreSQL 데이터베이스의 연결 문자열 확인: `postgresql://user:password@host:port/dbname`

3. Langflow `.env` 파일을 편집하거나 새로 만듭니다:

```
touch .env
```

4. `.env` 파일에서 `LANGFLOW_DATABASE_URL`을 PostgreSQL 연결 문자열로 설정합니다:

```
LANGFLOW_DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

**SSL 모드 옵션:**

```bash
# SSL 필요 (인증서 검증 없음)
LANGFLOW_DATABASE_URL="postgresql://user:password@localhost:5432/dbname?sslmode=require"

# CA 검증 포함 SSL
LANGFLOW_DATABASE_URL="postgresql://user@localhost:5432/dbname?sslmode=verify-ca&sslcert=/path/to/client.crt&sslkey=/path/to/client.key&sslrootcert=/path/to/ca.crt"

# 호스트명 검증 포함 SSL (가장 안전)
LANGFLOW_DATABASE_URL="postgresql://user@db.example.com:5432/dbname?sslmode=verify-full&sslcert=/path/to/client.crt&sslkey=/path/to/client.key&sslrootcert=/path/to/ca.crt"
```

> **참고**: Langflow는 PostgreSQL 드라이버로 `psycopg2-binary` 또는 `psycopg[binary]`가 필요합니다. `asyncpg` 드라이버는 호환되지 않습니다.

5. `.env` 파일로 Langflow 시작:

```bash
uv run langflow run --env-file .env
```

---

## docker-compose.yml로 Langflow와 PostgreSQL 컨테이너 배포

Langflow와 PostgreSQL 컨테이너를 동일한 Docker 네트워크에서 실행하면 서비스 간 연결이 보장됩니다. 예시 `docker-compose.yml`은 [Langflow 저장소](https://github.com/langflow-ai/langflow/blob/main/docker_example/docker-compose.yml)에서 확인하세요.

```bash
cd langflow/docker_example
docker-compose up
```

---

## 공유 PostgreSQL 데이터베이스로 여러 Langflow 인스턴스 배포

여러 Langflow 인스턴스가 동일한 PostgreSQL 데이터베이스를 공유하도록 구성하려면 `docker-compose.yml`을 수정합니다:

1. `.env` 파일 업데이트:

```
POSTGRES_USER=langflow
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=langflow
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
LANGFLOW_CONFIG_DIR=app/langflow
LANGFLOW_PORT_1=7860
LANGFLOW_PORT_2=7861
LANGFLOW_HOST=0.0.0.0
```

2. `docker-compose.yml`에서 이 변수들을 참조:

```yaml
services:
  postgres:
    image: postgres:16-trixie
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    ports:
      - "${POSTGRES_PORT}:5432"
    volumes:
      - langflow-postgres:/var/lib/postgresql/data

  langflow-1:
    image: langflowai/langflow:latest
    ports:
      - "${LANGFLOW_PORT_1}:7860"
    depends_on:
      - postgres
    environment:
      - LANGFLOW_DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}
      - LANGFLOW_CONFIG_DIR=${LANGFLOW_CONFIG_DIR}
      - LANGFLOW_HOST=${LANGFLOW_HOST}
      - PORT=7860
    volumes:
      - langflow-data-1:/app/langflow

  langflow-2:
    image: langflowai/langflow:latest
    ports:
      - "${LANGFLOW_PORT_2}:7860"
    depends_on:
      - postgres
    environment:
      - LANGFLOW_DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}
      - LANGFLOW_CONFIG_DIR=${LANGFLOW_CONFIG_DIR}
      - LANGFLOW_HOST=${LANGFLOW_HOST}
      - PORT=7860
    volumes:
      - langflow-data-2:/app/langflow

volumes:
  langflow-postgres:
  langflow-data-1:
  langflow-data-2:
```

3. `docker-compose up`으로 배포합니다.
   - 첫 번째 Langflow 인스턴스: `http://localhost:7860`
   - 두 번째 Langflow 인스턴스: `http://localhost:7861`

---

## 참고 항목

- [메모리 관리 옵션](./memory.md)
- [로그](./logging.md)

---

*원문: https://docs.langflow.org/next/configuration-custom-database*
