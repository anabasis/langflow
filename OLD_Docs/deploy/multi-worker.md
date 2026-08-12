# 멀티 워커로 Langflow 배포

기본적으로 Langflow는 단일 워커 프로세스로 실행되고 빌드 작업 상태를 메모리에 저장합니다.

단일 워커 프로세스는 개발에는 적합하지만 워커를 둘 이상 실행할 때는 확장되지 않습니다. 워커 **A**에서 시작된 플로우 빌드는 인메모리 작업 큐가 *프로세스별*이기 때문에 워커 **B**에서 폴링하거나 스트리밍할 수 없습니다.

멀티 워커 배포는 동일한 호스트에서 둘 이상의 워커 프로세스를 실행합니다. `LANGFLOW_WORKERS`를 늘려 동시성을 높일 수 있지만, 공유 저장소를 추가하지 않으면 각 프로세스는 자체 인메모리 빌드 큐를 유지합니다.

Redis 기반 작업 큐는 [Redis Streams](https://redis.io/docs/latest/develop/data-types/streams/)에 빌드 이벤트를 저장하므로 어느 워커도 작업 이벤트를 선택하고 제공할 수 있습니다.

---

## 사전 요구사항

- 모든 Langflow 워커 프로세스에서 접근 가능한 **Redis 6 이상**
- 동일한 `LANGFLOW_JOB_QUEUE_TYPE`으로 구성된 모든 워커
- 작업 큐 전용 Redis 데이터베이스 인덱스 (캐시 기본값 DB `0`, 작업 큐 기본값 DB `1`)

---

## Redis 작업 큐 활성화

모든 워커에서 다음 환경 변수를 설정합니다:

```
LANGFLOW_WORKERS=3  # 1보다 큰 값
LANGFLOW_JOB_QUEUE_TYPE=redis
LANGFLOW_REDIS_QUEUE_URL=redis://your-redis-host:6379/1
```

Redis 인증 및 TLS는 `LANGFLOW_REDIS_QUEUE_URL`을 통해서만 지원됩니다.

---

## 예시: 멀티 워커 Docker Compose

세 개의 Langflow 워커가 Redis 작업 큐와 PostgreSQL 데이터베이스를 공유하는 예시:

```yaml
services:
  langflow:
    image: langflowai/langflow:1.10.0
    pull_policy: always
    ports:
      - "7860:7860"
    depends_on:
      redis:
        condition: service_healthy
      postgres:
        condition: service_started
    environment:
      - LANGFLOW_DATABASE_URL=postgresql://langflow:langflow@postgres:5432/langflow
      - LANGFLOW_CONFIG_DIR=/app/langflow
      - LANGFLOW_WORKERS=3
      - LANGFLOW_GUNICORN_PRELOAD=true
      - LANGFLOW_JOB_QUEUE_TYPE=redis
      - LANGFLOW_REDIS_QUEUE_URL=redis://redis:6379/1
      - LANGFLOW_SUPERUSER=admin
      - LANGFLOW_SUPERUSER_PASSWORD=changeme
      - LANGFLOW_AUTO_LOGIN=False
    volumes:
      - langflow-data:/app/langflow

  redis:
    image: redis:7-alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

  postgres:
    image: postgres:16-trixie
    environment:
      POSTGRES_USER: langflow
      POSTGRES_PASSWORD: langflow
      POSTGRES_DB: langflow
    volumes:
      - langflow-postgres:/var/lib/postgresql/data

volumes:
  langflow-postgres:
  langflow-data:
```

서비스를 시작합니다:

```bash
docker compose up -d
```

로그를 통해 Langflow 준비 상태를 확인합니다:

```bash
docker compose logs -f langflow
```

---

## 구성 참조

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `LANGFLOW_JOB_QUEUE_TYPE` | `asyncio` | 작업 큐 백엔드. 크로스 워커 큐를 활성화하려면 `redis`로 설정 |
| `LANGFLOW_REDIS_QUEUE_URL` | 미설정 | 전체 Redis 연결 URL. 인증 또는 TLS가 있는 Redis에 사용 |
| `LANGFLOW_REDIS_QUEUE_HOST` | `LANGFLOW_REDIS_HOST` | 작업 큐용 Redis 호스트 |
| `LANGFLOW_REDIS_QUEUE_PORT` | `LANGFLOW_REDIS_PORT` | 작업 큐용 Redis 포트 |
| `LANGFLOW_REDIS_QUEUE_DB` | `1` | 작업 큐용 Redis 데이터베이스 인덱스 |
| `LANGFLOW_REDIS_QUEUE_TTL` | `3600` | Redis의 작업 스트림 및 소유권 키의 TTL(초) |
| `LANGFLOW_WORKERS` | `1` | Gunicorn 워커 프로세스 수 |
| `LANGFLOW_WORKER_TIMEOUT` | `300` | 워커 타임아웃(초) |
| `LANGFLOW_GUNICORN_PRELOAD` | `False` | 워커 포크 전에 Gunicorn 마스터에서 앱 로드 (메모리 절약) |

---

## 작업 큐 모니터링

`GET /monitor/job_queue` 엔드포인트는 실행 중인 워커의 메트릭 스냅샷을 반환합니다 (슈퍼유저 인증 필요):

```bash
curl -H "Authorization: Bearer $LANGFLOW_SUPERUSER_TOKEN" \
  http://localhost:7860/api/v1/monitor/job_queue
```

응답 예시:

```json
{
  "backend": "redis",
  "active_jobs": 2,
  "bridge_count": 1,
  "consumer_wrapper_count": 1,
  "background_task_count": 0,
  "cancel_dispatcher_running": true,
  "cancel_stats": {
    "published": 5,
    "marker_hit": 1,
    "dispatched_owned": 3,
    "dispatched_foreign": 2,
    "publish_errors": 0
  }
}
```

`dispatched_foreign`가 0이 아닌 경우 크로스 워커 취소가 작동 중임을 확인합니다.

---

## 권장 Gunicorn 설정 (Linux 전용)

서버 메모리에 맞는 설정을 `.env` 파일에 추가합니다:

**소형/개발 (4–8 GB RAM):**
```
LANGFLOW_WORKERS=5
LANGFLOW_WORKER_TIMEOUT=120
LANGFLOW_GUNICORN_PRELOAD=true
GUNICORN_CMD_ARGS="--max-requests 100 --max-requests-jitter 20"
```

**표준 API (12 GB RAM):**
```
LANGFLOW_WORKERS=9
LANGFLOW_WORKER_TIMEOUT=300
LANGFLOW_GUNICORN_PRELOAD=true
GUNICORN_CMD_ARGS="--max-requests 250 --max-requests-jitter 50"
```

**대규모 멀티 에이전트 (24 GB+ RAM):**
```
LANGFLOW_WORKERS=13
LANGFLOW_WORKER_TIMEOUT=600
LANGFLOW_GUNICORN_PRELOAD=true
GUNICORN_CMD_ARGS="--max-requests 150 --max-requests-jitter 30"
```

---

*원문: https://docs.langflow.org/next/deployment-multi-worker*
