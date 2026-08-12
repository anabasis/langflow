# 엔터프라이즈 관리자를 위한 데이터베이스 가이드

> 원문: https://docs.langflow.org/next/enterprise-database-guide

Langflow 데이터베이스는 시작, 플로우 실행, 사용자 상호작용, 관리 작업을 포함한 대부분의 Langflow 운영에 필수적인 데이터를 저장합니다.
이 데이터베이스는 프런트엔드(비주얼 에디터)와 백엔드(API) 작업을 모두 지원하므로, 그 가용성은 Langflow의 안정성과 기능에 매우 중요합니다.
데이터베이스 스키마에 대한 자세한 내용은 [메모리 관리 옵션](https://docs.langflow.org/memory)을 참고하세요.

이 가이드는 프로덕션 환경에서 Langflow를 배포하고 관리하는 책임을 맡은 엔터프라이즈 데이터베이스 관리자(DBA)와 운영자를 위해 작성되었습니다.
고가용성(HA) 및 액티브-액티브 구성을 포함하여 Langflow가 PostgreSQL을 사용하도록 구성하는 방법과, 모니터링, 유지 관리, 보안에 대한 모범 사례를 설명합니다.

## PostgreSQL로 Langflow 구성하기[​](#configure-langflow-with-postgresql "Direct link to Configure Langflow with PostgreSQL")

Langflow의 기본 데이터베이스는 SQLite입니다.
그러나 확장성, 성능, 견고함 덕분에 프로덕션 배포에는 PostgreSQL이 권장됩니다.

다음 단계는 독립형 배포 또는 컨테이너화된 배포에서 Langflow가 PostgreSQL을 사용하도록 구성하는 방법을 설명합니다.
자세한 내용은 [외부 PostgreSQL 데이터베이스 구성](https://docs.langflow.org/configuration-custom-database)을 참고하세요.

1. PostgreSQL을 설정합니다.

  1. 로컬 서버, Docker, 또는 관리형 클라우드 서비스를 사용하여 PostgreSQL 인스턴스(버전 15 이상)를 배포합니다.
  2. Langflow를 위한 데이터베이스를 생성합니다.
  3. Langflow 테이블에 대해 CREATE, SELECT, INSERT, UPDATE, DELETE와 같이 데이터베이스를 관리하고 쓸 수 있는 적절하고 최소한의 권한을 가진 PostgreSQL 사용자를 생성합니다.

2. `postgresql://user:password@host:port/dbname` 형식의 연결 문자열을 얻습니다(예: `postgresql://langflow:securepassword@postgres:5432/langflow`).

    고가용성을 위해서는 직접적인 데이터베이스 호스트 대신 가상 IP 또는 프록시 호스트명을 사용하세요.
자세한 내용은 [PostgreSQL을 위한 고가용성](#high-availability-for-postgresql)을 참고하세요.

3. `.env` 또는 `docker-compose.yml` 파일로 Langflow를 구성합니다.

  - .env
  - docker-compose.yml

  1. `langflow` 디렉터리에 `.env` 파일을 생성합니다.

  ```shell
  touch .env
  ```

  2. `.env` 파일에 연결 문자열을 추가합니다.

  ```text
  LANGFLOW_DATABASE_URL="postgresql://langflow:securepassword@postgres:5432/langflow"
  ```
    더 많은 환경 변수는 Langflow 저장소의 `.env.example` 파일을 참고하세요.

- PostgreSQL 연결과 함께 Langflow를 시작합니다.

  - .env
  - docker-compose.yml

  ```shell
  uv run langflow run --env-file .env
  ```

- 선택 사항: 마이그레이션을 실행합니다.

    Langflow는 마이그레이션을 사용하여 데이터베이스 스키마를 관리합니다.
PostgreSQL에 처음 연결하면 Langflow는 필요한 테이블을 생성하기 위해 자동으로 마이그레이션을 실행합니다.

    스키마를 직접 수정하면 Langflow의 내장 스키마 관리와 충돌이 발생할 수 있습니다.
스키마를 업데이트해야 하는 경우, Langflow CLI로 마이그레이션을 수동으로 실행할 수 있습니다.

  1. `langflow migration`을 실행하여 변경 사항을 미리 확인합니다.

  2. 변경 사항을 검토하여 마이그레이션을 진행해도 안전한지 확인합니다.

  3. `langflow migration --fix`를 실행하여 마이그레이션을 실행하고 변경 사항을 영구적으로 적용합니다.

        이는 데이터를 삭제할 수 있는 파괴적인 작업입니다.
자세한 내용은 [`langflow migration`](https://docs.langflow.org/configuration-cli#langflow-migration)을 참고하세요.

- 구성을 검증하려면 Langflow 비주얼 에디터나 API를 사용해 아무 플로우나 생성한 다음, 데이터베이스를 쿼리하여 테이블과 활동이 기록되었는지 확인하세요. 플로우의 내용은 중요하지 않으며, 플로우가 PostgreSQL 데이터베이스에 저장되었는지만 확인하면 됩니다.
다음 두 가지 방법으로 데이터베이스를 쿼리할 수 있습니다.

  - 데이터베이스 컨테이너를 쿼리합니다.

  ```text
  docker exec -it <postgres-container> psql -U langflow -d langflow
  ```

  - SQL을 사용합니다.

  ```text
  SELECT * FROM pg_stat_activity WHERE datname = 'langflow';
  ```

### PostgreSQL을 위한 고가용성[​](#high-availability-for-postgresql "Direct link to High Availability for PostgreSQL")

성능, 안정성, 확장성을 더욱 향상시키려면 고가용성(HA) 또는 액티브-액티브 HA PostgreSQL 구성을 사용하세요.
이는 특히 여러 Langflow 인스턴스가 동일한 데이터베이스에 의존하는 경우, 데이터베이스 서버 장애 시 다운타임을 최소화하고 지속적인 운영을 보장하기 위해 프로덕션 배포에 권장됩니다.

- 고가용성(HA)
- 액티브-액티브 HA

1. 스트리밍 복제를 설정합니다.

  1. 쓰기를 위한 하나의 프라이머리 데이터베이스를 구성합니다.

  2. 읽기 및 페일오버를 위한 하나 이상의 레플리카를 구성합니다.

        지연 시간 및 일관성 요구사항에 따라 동기 또는 비동기 복제 중에서 선택하세요.

2. 다음 옵션 중 하나를 사용하여 자동 페일오버를 구현합니다.

  - [Patroni](https://patroni.readthedocs.io/en/latest/), etcd 또는 [Consul](https://developer.hashicorp.com/consul), [HAProxy](https://www.haproxy.org/)와 같은 HA 오케스트레이터, 분산 구성 저장소, 트래픽 라우터를 사용합니다.
  - [Pgpool-II](https://www.pgpool.net/docs/46/en/html/index.html)를 단독으로 사용하거나, 더 견고한 HA 지원을 위해 지원 서비스를 추가합니다.
  - AWS RDS나 Google Cloud SQL과 같이 자동 페일오버가 내장된 관리형 서비스를 사용합니다.

3. PostgreSQL 연결 문자열을 HA 설정을 가리키도록 업데이트합니다.
다중 인스턴스 배포인 경우, 모든 Langflow 인스턴스가 동일한 HA PostgreSQL 데이터베이스에 연결되도록 하세요.

    사용하는 연결 문자열은 HA 구성 및 서비스에 따라 다릅니다.

  - `postgresql://langflow:securepassword@db-proxy:5432/langflow?sslmode=require`와 같이 현재 프라이머리 데이터베이스로 확인되는 가상 IP 또는 DNS 이름을 사용하세요.
  - `langflow.cluster-xyz.us-east-1.rds.amazonaws.com`과 같이 관리형 서비스에서 제공하는 엔드포인트를 사용하세요.

4. 선택 사항: 읽기 위주의 워크로드에 대해 로드 밸런싱을 구현합니다.

  1. [PgBouncer](https://www.pgbouncer.org/)와 같은 연결 풀러를 사용하여 읽기 쿼리를 레플리카 간에 분산시킵니다.
  2. 프라이머리 PostgreSQL 데이터베이스 또는 프록시를 가리키는 단일 연결 문자열을 사용하도록 Langflow를 구성합니다.

HA 또는 액티브-액티브 HA를 구현한 후에는 페일오버 이벤트를 모니터링하고 레플리카가 동기화되어 있는지 확인하세요.
Langflow는 [SQLAlchemy](https://docs.sqlalchemy.org/en/20/)를 통해 `LANGFLOW_DATABASE_CONNECTION_RETRY=True`인 경우 재연결 시도를 지원하며, 이를 통해 페일오버 후 복구가 보장되고 데이터베이스가 다시 온라인 상태가 되면 중단이 줄어듭니다.

PostgreSQL은 동시 연결을 잘 처리하지만, 높은 부하 상황에서는 경합, 데드락, 기타 성능 저하를 계속 모니터링해야 합니다.

## 데이터베이스 장애의 영향[​](#impact-of-database-failure "Direct link to Impact of database failure")

PostgreSQL 데이터베이스를 사용할 수 없게 되면 다음 Langflow 기능이 실패합니다.

- **플로우 검색**: 데이터베이스에서 신규 또는 기존 플로우를 로드할 수 없습니다.
- **플로우 저장**: 신규 플로우나 기존 플로우에 대한 업데이트를 저장할 수 없습니다.
- **사용자 인증**: 로그인 및 사용자 관리 기능이 실패합니다.
- **프로젝트 컬렉션 액세스**: 커뮤니티/커스텀 프로젝트 컬렉션에 액세스하거나 공유할 수 없습니다.
- **구성 검색**: 애플리케이션 설정을 로드할 수 없습니다.
- **구성 업데이트**: 설정 변경 사항을 저장할 수 없습니다.
- **실행 로그 액세스**: 과거 플로우 실행 로그를 검색할 수 없습니다.
- **로그 작성**: 새로운 실행 또는 시스템 활동 로그를 기록할 수 없습니다.
- **다중 사용자 협업**: 여러 사용자 간 플로우 또는 프로젝트 공유가 실패합니다.
- **API 플로우 로딩**: 신규 플로우(캐시되지 않은)를 로드하는 API 요청이 실패합니다.

이미 메모리에 로드된 플로우는 캐시된 구성으로 계속 작동할 수 있습니다.
그러나 데이터베이스 액세스가 필요한 모든 작업은 데이터베이스가 복구될 때까지 실패합니다.
예를 들어 캐시된 플로우는 실행될 수 있지만, 로그나 메시지 기록을 데이터베이스에 기록하지는 않습니다.

데이터베이스 장애의 가능성과 영향을 최소화하려면 [HA 구성](#high-availability-for-postgresql)을 사용하고 정기적으로 백업을 기록하세요.
예를 들어 `pg_dump`를 사용해 논리적 백업을 생성하거나, 시점 복구를 위해 WAL(write-ahead log)로 지속적인 아카이빙을 설정할 수 있습니다.
재해 복구 시나리오에서 팀이 이를 실행하는 방법을 이해하고 있는지 확인하기 위해, 복구 절차를 정기적으로 테스트하세요.

## 데이터베이스 모니터링[​](#database-monitoring "Direct link to Database monitoring")

최적의 성능과 안정성을 보장하기 위해 PostgreSQL 데이터베이스를 모니터링하세요.

- pgAdmin, PostgreSQL exporter가 포함된 Prometheus, 또는 클라우드 기반 PostgreSQL 모니터링 같은 도구를 사용하세요.
- CPU, 메모리, 디스크 I/O 사용량 등의 성능 지표를 추적하세요.
- 레플리카의 상태, 가용성, 지연, 동기화를 모니터링하세요.
예를 들어 `pg_stat_activity`를 사용하여 연결 수와 경합을 모니터링하세요.
- 높은 지연, 페일오버 이벤트, 복제 문제에 대한 알림 및 통지를 설정하세요.
- 액세스와 변경 사항을 추적하기 위해 `log_connections`, `log_statements`와 같은 PostgreSQL 로깅을 활성화하세요.

## 참고 자료[​](#see-also "Direct link to See also")

- [외부 PostgreSQL 데이터베이스 구성](https://docs.langflow.org/configuration-custom-database)
- [Kubernetes에서의 Langflow 아키텍처](https://docs.langflow.org/deployment-architecture)
- [Kubernetes에 Langflow 프로덕션 환경 배포하기](https://docs.langflow.org/deployment-kubernetes-prod)
