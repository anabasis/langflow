# 외부 PostgreSQL 데이터베이스 구성

> 원문: https://docs.langflow.org/next/configuration-custom-database

Langflow의 기본 데이터베이스는 [SQLite](https://www.sqlite.org/docs.html)이지만, Langflow가 대신 PostgreSQL을 사용하도록 구성할 수 있습니다.

이 가이드는 기본 SQLite 연결 문자열 `sqlite:///./langflow.db`를 로컬 환경과 컨테이너화된 환경 모두에서 PostgreSQL로 교체하여, Langflow에 외부 데이터베이스를 설정하는 방법을 안내합니다.

SQLite 경로는 절대 경로여야 합니다

`LANGFLOW_DATABASE_URL`을 SQLite 연결 문자열로 설정하는 경우, `sqlite:////absolute/path/to/langflow.db`(맨 앞에 슬래시 4개가 있는 점에 유의)처럼 **절대** 경로를 사용하거나, Windows에서는 `sqlite:///C:/path/to/langflow.db`를 사용하세요.

`sqlite:///./langflow.db`와 같은 상대 경로는 Langflow를 시작한 디렉터리를 기준으로 해석되므로, 다른 디렉터리에서 실행하면 서로 다른 데이터베이스 파일을 가리키게 되어(플로우가 "사라진" 것처럼 보일 수 있음), 아직 존재하지 않는 하위 디렉터리를 포함하는 상대 경로는 시작 시 실패합니다. SQLite는 중간 디렉터리를 자동으로 생성하지 않기 때문입니다.

이 구성에서는 플로우, 메시지 기록, 로그를 포함한 Langflow의 모든 구조화된 애플리케이션 데이터가 PostgreSQL에 의해 관리됩니다.
PostgreSQL은 동시 사용자에 대한 견고한 지원, 고급 데이터 무결성 기능, 확장성 덕분에 프로덕션 환경에 더 적합합니다.
Langflow는 PostgreSQL을 데이터베이스로 사용함으로써 더 많은 사용자와 더 큰 작업량을 더 효율적으로 처리할 수 있습니다.

## 사전 준비 사항[​](#prerequisites "Direct link to Prerequisites")

- [PostgreSQL](https://www.pgadmin.org/download/) 데이터베이스 버전 15 이상

## Langflow를 로컬 PostgreSQL 데이터베이스에 연결하기[​](#connect-langflow-to-a-local-postgresql-database "Direct link to Connect Langflow to a local PostgreSQL database")

1. Langflow가 실행 중이면 `Ctrl+C`로 중지합니다.

2. PostgreSQL 데이터베이스의 연결 문자열을 `postgresql://user:password@host:port/dbname` 형식으로 찾습니다.

    연결 문자열의 호스트명은 PostgreSQL을 실행하는 방식에 따라 다릅니다.

  - 머신에서 PostgreSQL을 직접 실행 중이라면 `localhost`를 사용하세요.
  - Docker Compose에서 PostgreSQL을 실행 중이라면 `postgres`와 같은 서비스 이름을 사용하세요.
  - `docker run`으로 별도의 Docker 컨테이너에서 PostgreSQL을 실행 중이라면 컨테이너의 IP 주소나 네트워크 별칭을 사용하세요.
  - 클라우드 호스팅 PostgreSQL을 사용 중이라면, 프로바이더가 사용자 이름과 비밀번호가 포함된 연결 문자열을 제공할 것입니다.

3. Langflow `.env` 파일을 편집하거나 생성합니다.

  ```
  touch .env
  ```
    Langflow 저장소의 [`.env.example`](https://github.com/langflow-ai/langflow/blob/main/.env.example) 파일을 자신의 `.env` 파일을 위한 템플릿으로 사용할 수 있습니다.

4. `.env` 파일에서 `LANGFLOW_DATABASE_URL`을 PostgreSQL 연결 문자열로 설정합니다.

  ```
  LANGFLOW_DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
  ```
    Langflow는 [psycopg](https://www.psycopg.org/) 드라이버와 함께 [SQLAlchemy](https://www.sqlalchemy.org/)를 사용하여 SSL 파라미터를 PostgreSQL 연결에 직접 전달합니다.

  PostgreSQL 드라이버 호환성
      Langflow는 PostgreSQL 드라이버로 `psycopg2-binary` 또는 `psycopg[binary]`가 필요합니다. `asyncpg` 드라이버는 더 엄격한 타임존 처리 요구사항으로 인해 Langflow의 현재 데이터베이스 스키마와 호환되지 않습니다.

    다음 SSL 모드가 지원됩니다.

  - **`sslmode=require`**: SSL 연결을 요구하지만 서버 인증서를 검증하지는 않습니다. 이 옵션은 가장 안전성이 낮지만 대부분의 사용 사례에서 허용 가능합니다.

    ```
    LANGFLOW_DATABASE_URL="postgresql://user:password@localhost:5432/dbname?sslmode=require"
    ```

  - **`sslmode=verify-ca`**: SSL을 요구하고 인증 기관(CA)에 대해 서버 인증서를 검증합니다. 연결 문자열에 인증서 경로를 추가하세요.

    ```
    LANGFLOW_DATABASE_URL="postgresql://user@localhost:5432/dbname?sslmode=verify-ca&sslcert=/path/to/client.crt&sslkey=/path/to/client.key&sslrootcert=/path/to/ca.crt"
    ```

  - **`sslmode=verify-full`**: SSL을 요구하고, 서버 인증서를 검증하며, 요청 호스트명을 인증서 호스트명과 대조합니다. 이 예시의 `db.example.com` 호스트명은 서버 인증서의 CN과 일치해야 합니다. 이 옵션이 가장 안전합니다.

    ```
    LANGFLOW_DATABASE_URL="postgresql://user@db.example.com:5432/dbname?sslmode=verify-full&sslcert=/path/to/client.crt&sslkey=/path/to/client.key&sslrootcert=/path/to/ca.crt"
    ```
        PostgreSQL 인증서에는 Langflow 환경 변수 [`LANGFLOW_SSL_CERT_FILE`](https://docs.langflow.org/environment-variables#server)과 [`LANGFLOW_SSL_KEY_FILE`](https://docs.langflow.org/environment-variables#server)을 사용하지 마세요. 이 변수들은 Langflow 서버에서 HTTPS를 활성화하기 위한 것이며, PostgreSQL 데이터베이스 연결을 위한 것이 아닙니다.

        PostgreSQL에서 SSL 인증서를 관리하는 방법에 대한 자세한 내용은 [PostgreSQL 문서](https://www.postgresql.org/docs/9.1/ssl-tcp.html)를 참고하세요.

5. 변경 사항을 저장한 다음, `.env` 파일과 함께 Langflow를 시작합니다.

  ```
  uv run langflow run --env-file .env
  ```
    선택적인 연결 풀링 및 타임아웃 설정은 [외부 메모리 구성](https://docs.langflow.org/memory#configure-external-memory)을 참고하세요.

6. Langflow에서 아무 플로우나 실행하여 트래픽을 생성합니다.

7. PostgreSQL 데이터베이스의 테이블과 활동을 확인하여, 플로우를 실행한 후 새 테이블과 트래픽이 생성되었는지 검증합니다.

## docker-compose.yml로 Langflow와 PostgreSQL 컨테이너 배포하기[​](#deploy-langflow-and-postgresql-containers-with-docker-composeyml "Direct link to Deploy Langflow and PostgreSQL containers with docker-compose.yml")

Langflow와 PostgreSQL 컨테이너를 동일한 Docker 네트워크에서 실행하면 서비스 간의 적절한 연결성이 보장됩니다.
예시는 Langflow 저장소의 [`docker-compose.yml`](https://github.com/langflow-ai/langflow/blob/main/docker_example/docker-compose.yml) 파일을 참고하세요.

예시 `docker-compose.yml`의 구성은 Langflow와 PostgreSQL 데이터를 위한 영구 볼륨도 설정합니다.
영구 볼륨은 컨테이너 내부의 디렉터리를 호스트 머신의 스토리지에 매핑하므로, 컨테이너를 재시작해도 데이터가 유지됩니다.

Docker Compose는 `docker-compose.yml`에 정의된 모든 서비스를 위한 격리된 네트워크를 생성합니다. 이를 통해 서비스들은 데이터베이스 URL의 `postgres`와 같이 자신의 서비스 이름을 호스트명으로 사용하여 서로 통신할 수 있습니다.
반대로 `docker run`으로 PostgreSQL을 별도로 실행하면, Langflow 컨테이너와는 다른 네트워크에서 실행되므로, Langflow가 서비스 이름을 사용해 PostgreSQL에 연결하는 것을 방해합니다.

예시 Docker Compose 파일로 Langflow와 PostgreSQL 서비스를 시작하려면 `langflow/docker_example` 디렉터리로 이동한 다음 `docker-compose up`을 실행하세요.
다른 `docker-compose.yml` 파일을 사용하는 경우, `docker-compose.yml` 파일과 동일한 디렉터리에서 `docker-compose up` 명령을 실행하세요.

## 공유 PostgreSQL 데이터베이스로 여러 Langflow 인스턴스 배포하기[​](#deploy-multiple-langflow-instances-with-a-shared-postgresql-database "Direct link to Deploy multiple Langflow instances with a shared PostgreSQL database")

동일한 PostgreSQL 데이터베이스를 공유하는 여러 Langflow 인스턴스를 구성하려면, `docker-compose.yml` 파일을 수정하여 여러 Langflow 서비스를 포함시키세요.

이 예시는 `docker-compose.yml`의 값을 Langflow `.env` 파일의 값으로 채웁니다.
이 방식을 사용하면 여러 파일에 값을 복사하는 대신, 하나의 파일에서만 배포 변수를 관리하면 됩니다.

1. `.env` 파일에 PostgreSQL 데이터베이스 값을 업데이트합니다.

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
    선택적인 연결 풀링 및 타임아웃 설정은 [외부 메모리 구성](https://docs.langflow.org/memory#configure-external-memory)을 참고하세요.

2. `docker-compose.yml`에서 이 변수들을 참조합니다.
예시:

  ```
  services:
    postgres:
      # Pinned to a specific Debian base (trixie) so the postgres:16 tag does
      # not silently roll its OS, which triggers a glibc collation mismatch
      # warning on existing volumes. See https://github.com/langflow-ai/langflow/issues/9608
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
      pull_policy: always
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
      pull_policy: always
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

3. `docker-compose up`으로 파일을 배포합니다.
첫 번째 Langflow 인스턴스는 `http://localhost:7860`에서, 두 번째 Langflow 인스턴스는 `http://localhost:7861`에서 접근할 수 있습니다.

4. 두 인스턴스가 동일한 데이터베이스를 사용하고 있는지 확인하려면, `docker exec` 명령을 실행하여 PostgreSQL 컨테이너에서 `psql`을 시작합니다.
컨테이너 이름은 다를 수 있습니다.

  ```
  docker exec -it docker-test-postgres-1 psql -U langflow -d langflow
  ```

5. 활성 연결에 대해 데이터베이스를 쿼리합니다.

  ```
  langflow=# SELECT * FROM pg_stat_activity WHERE datname = 'langflow';
  ```

6. 쿼리 결과에서 서로 다른 `client_addr` 값(예: `172.21.0.3`과 `172.21.0.4`)을 가진 여러 연결을 확인합니다.
각 Langflow 인스턴스는 Docker 네트워크에서 자신의 컨테이너로 실행되므로, 서로 다른 수신 IP 주소를 사용하는 것은 두 인스턴스가 모두 PostgreSQL 데이터베이스에 활발히 연결되어 있음을 확인해줍니다.

7. `psql`을 종료하려면 `quit`을 입력하세요.

## 참고 자료[​](#see-also "Direct link to See also")

- [엔터프라이즈 DBA를 위한 Langflow 데이터베이스 가이드](https://docs.langflow.org/enterprise-database-guide)
- [메모리 관리 옵션](https://docs.langflow.org/memory)
- [로그](https://docs.langflow.org/logging)
