# 다중 워커로 Langflow 배포하기
> 원문: https://docs.langflow.org/next/deployment-multi-worker

기본적으로 Langflow는 단일 워커 프로세스로 실행되며, 빌드 작업 상태를 메모리에 저장합니다.

단일 워커 프로세스는 개발 환경에서는 문제가 없지만, 하나 이상의 워커를 실행하면 확장성이 떨어집니다.
워커 **A**에서 시작된 플로우 빌드는 워커 **B**에서 폴링하거나 스트리밍할 수 없는데, 이는 메모리 내 작업 큐가 *프로세스별로* 존재하기 때문입니다.

다중 워커 배포는 동일한 호스트에서 둘 이상의 워커 프로세스를 실행합니다. `LANGFLOW_WORKERS` 값을 늘려 동시성을 높일 수 있지만, 공유 저장소를 추가하지 않는 한 각 프로세스는 자체적인 메모리 내 빌드 큐를 유지합니다.

Redis 기반 작업 큐는 빌드 이벤트를 [Redis Streams](https://redis.io/docs/latest/develop/data-types/streams/)에 저장하므로, 어떤 워커든 어떤 작업의 이벤트든 가져와서 처리할 수 있습니다.
다중 워커 Langflow 프로세스를 구성하려면 Redis 작업 큐를 활성화하는 단계를 따르세요.

Redis 작업 큐를 구성한 후에는 선택적으로 [권장 Gunicorn 설정](#recommended-gunicorn-settings)을 따라 메모리 사용량을 줄이고 워커의 상태를 건강하게 유지할 수 있습니다. 이 튜닝은 Linux 프로덕션 호스트에만 적용됩니다. Windows와 macOS에서는 `langflow run`이 단일 Uvicorn 프로세스를 사용합니다.

## 사전 준비 사항[​](#prerequisites "Direct link to Prerequisites")

- **Redis 6 이상**이 필요하며, 모든 Langflow 워커 프로세스에서 접근할 수 있어야 합니다.
- 모든 워커는 동일한 `LANGFLOW_JOB_QUEUE_TYPE`으로 구성되어야 합니다. 혼합 모드 배포(일부 워커는 `asyncio`, 다른 워커는 `redis` 사용)는 지원되지 않습니다.
- 작업 큐 전용 Redis 데이터베이스 인덱스가 필요합니다. 캐시는 기본적으로 DB `0`을 사용하며, 작업 큐는 기본적으로 DB `1`을 사용합니다. 두 용도에 동일한 인덱스를 사용하면 키 충돌이 발생합니다.

## Redis 작업 큐 활성화하기[​](#enable-the-redis-job-queue "Direct link to Enable the Redis job queue")

Redis 작업 큐를 활성화하려면 모든 워커에 다음 환경 변수를 설정하세요.

```text
LANGFLOW_WORKERS=3  # any value > 1  
LANGFLOW_JOB_QUEUE_TYPE=redis  
LANGFLOW_REDIS_QUEUE_URL=redis://your-redis-host:6379/1  
```

Redis 인증과 TLS는 오직 `LANGFLOW_REDIS_QUEUE_URL`을 통해서만 지원됩니다.
개별 호스트/포트 설정인 `LANGFLOW_REDIS_QUEUE_HOST`와 `LANGFLOW_REDIS_QUEUE_PORT`는 인증이 없는 일반(plain) 연결만 생성합니다.
인증이나 TLS를 사용하는 관리형 Redis 서비스를 사용하는 경우, 반드시 `LANGFLOW_REDIS_QUEUE_URL`을 사용해야 합니다.

## 예제: 다중 워커 Docker Compose[​](#example-multi-worker-docker-compose "Direct link to Example: multi-worker Docker Compose")

이 예제는 Redis 작업 큐와 PostgreSQL 데이터베이스를 공유하는 세 개의 Langflow 워커를 실행합니다.

이 예제를 실행하려면 다음이 필요합니다.

- [Docker](https://docs.docker.com/get-started/get-docker/)와 [Docker Compose](https://docs.docker.com/compose/install/) (또는 [Podman Desktop](https://podman-desktop.io/))
- 컨테이너 런타임에 최소 4GB의 메모리와 2개의 CPU를 사용할 수 있어야 함

tip

Podman Desktop을 사용하는 경우, 기본 머신은 이 스택을 실행하기에 리소스가 충분하지 않을 수 있습니다. 시작하기 전에 머신의 CPU와 메모리 할당을 늘리세요.

```bash
podman machine stop  
podman machine set --cpus 4 --memory 4096  
podman machine start  
```

1. 다음 예제를 `docker-compose.yml`이라는 이름의 Docker Compose 파일에 붙여넣으세요.

  
  

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
      - LANGFLOW_WORKERS=3  # any value > 1  
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

2. 서비스를 시작하세요.

  
  

```bash
docker compose up -d  
```

3. Langflow가 준비될 때까지 로그를 확인하세요.

  
  

```bash
docker compose logs -f langflow  
```

    다음 로그 라인들은 다중 워커 부팅이 성공했음을 확인해 줍니다.

  
  

```text
[preload] initializing services in master  
[preload] master preload complete; workers will inherit shared state via COW  
✓ Launching Langflow...  
```

4. Docker Compose 파일에 설정한 `username`과 `password`를 사용해 슈퍼유저 토큰을 생성하세요.

  
  

```bash
TOKEN=$(curl -s -X POST http://localhost:7860/api/v1/login \  
  -H "Content-Type: application/x-www-form-urlencoded" \  
  -d "username=admin&password=changeme" \  
  | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")  
```

5. 같은 터미널 세션에서 Redis 큐가 활성화되어 있는지 확인하세요.

  
  

```bash
curl -s -H "Authorization: Bearer $TOKEN" \  
  http://localhost:7860/api/v1/monitor/job_queue | python3 -m json.tool  
```

    응답은 다음과 같습니다.

  
  

```json
{  
  "backend": "redis",  
  "active_jobs": 0,  
  "bridge_count": 0,  
  "consumer_wrapper_count": 0,  
  "background_task_count": 0,  
  "cancel_dispatcher_running": true,  
  "cancel_stats": {  
    "published": 0,  
    "marker_hit": 0,  
    "dispatched_owned": 0,  
    "dispatched_foreign": 0,  
    "publish_errors": 0,  
    "dispatcher_reconnects": 0,  
    "dispatcher_internal_errors": 0,  
    "polling_watchdog_kills": 0,  
    "activity_touch_errors": 0,  
    "activity_get_errors": 0,  
    "activity_parse_errors": 0  
  }  
}  
```

    `backend: redis`는 큐가 Redis를 사용하고 있음을 확인해 주며, `cancel_dispatcher_running: true`는 워커 간 취소(cancel) 채널이 활성 상태임을 확인해 줍니다.

6. 같은 터미널 세션에서 `monitor/job_queue` 엔드포인트를 폴링하세요.

  
  

```bash
while true; do  
  clear  
  curl -s -H "Authorization: Bearer $TOKEN" \  
    http://localhost:7860/api/v1/monitor/job_queue | python3 -m json.tool  
  sleep 1  
done  
```

7. Langflow UI를 열고 **Playground**에서 플로우에 메시지를 보내 플로우를 빌드해 보세요.
`monitor/job_queue` 엔드포인트가 보고하는 `active_jobs` 수치가 증가하면, Redis 큐가 정상적으로 동작하고 있는 것입니다.

### 워커 간 취소 확인하기[​](#verify-cross-worker-cancellation "Direct link to Verify cross-worker cancellation")

워커 간 취소가 동작하는지 확인하려면, API로 빌드를 트리거해 `job_id`를 확보한 다음 이를 취소해 보세요.

1. API를 사용해 `flow_id`로 플로우를 빌드하세요.

  
  

```bash
curl -s -X POST "http://localhost:7860/api/v1/build/af7dc029-279e-4742-8419-1ac23898afdd/flow" \  
  -H "Authorization: Bearer $TOKEN" \  
  -H "Content-Type: application/json" \  
  -d '{"inputs": {"input_value": "hello"}, "stream": false}' | python3 -m json.tool  
```

    응답:

  
  

```json
{  
    "job_id": "1af960e9-12d5-48ec-9860-8a90a16f0b55"  
}  
```

    반환된 `job_id`는 큐 내의 빌드 작업을 취소하는 데 사용할 수 있습니다.

2. 빌드 작업을 취소하려면 `job_id`를 포함한 요청을 보내세요.

  
  

```bash
curl -s -X POST http://localhost:7860/api/v1/build/1af960e9-12d5-48ec-9860-8a90a16f0b55/cancel \  
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool  
```

    응답:

  
  

```json
{  
    "success": true,  
    "message": "Flow build cancelled successfully"  
}  
```

3. `monitor/job_queue` 엔드포인트가 취소를 반영해 보고하는지 확인하세요.

  
  

```json
{  
    "backend": "redis",  
    "active_jobs": 0,  
    "bridge_count": 0,  
    "consumer_wrapper_count": 0,  
    "background_task_count": 0,  
    "cancel_dispatcher_running": true,  
    "cancel_stats": {  
        "published": 1,  
        "marker_hit": 0,  
        "dispatched_owned": 0,  
        "dispatched_foreign": 2,  
        "publish_errors": 0,  
        "dispatcher_reconnects": 0,  
        "dispatcher_internal_errors": 0,  
        "polling_watchdog_kills": 0,  
        "activity_touch_errors": 0,  
        "activity_get_errors": 0,  
        "activity_parse_errors": 0  
    }  
}  
```

    `dispatched_foreign`은 취소 신호가 다른 워커가 소유한 작업으로 전달될 때 증가하며, 이는 워커 간 취소 경로가 정상 동작함을 확인해 줍니다.

    자세한 내용은 [작업 큐 모니터링하기](#monitor-the-job-queue)를 참조하세요.

## 문제 해결[​](#troubleshoot "Direct link to Troubleshoot")

[다중 워커 배포 문제 해결](https://docs.langflow.org/next/troubleshoot#multi-worker-deployments)을 참조하세요.

## 구성 참조[​](#configuration-reference "Direct link to Configuration reference")

| 변수                                                 | 기본값                 | 설명                                                                                                                                                                                              |
| -------------------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LANGFLOW_​JOB_​QUEUE_​TYPE`                             | `asyncio`               | 작업 큐 백엔드. 워커 간 큐를 활성화하려면 `redis`로 설정하세요.                                                                                                                                      |
| `LANGFLOW_​REDIS_​QUEUE_​URL`                            | 설정 안 됨                 | 전체 Redis 연결 URL. 설정 시 `HOST`/`PORT`/`DB`보다 우선 적용됩니다. 인증 또는 TLS가 필요한 모든 Redis 인스턴스에는 이 값을 사용하세요.                                                                                                         |
| `LANGFLOW_​REDIS_​QUEUE_​HOST`                           | `LANGFLOW_​REDIS_​HOST` | 작업 큐용 Redis 호스트. 설정하지 않으면 일반 Redis 호스트 설정을 따릅니다. 인증이나 TLS를 지원하지 않으므로(보안이 필요한 인스턴스에는 대신 `LANGFLOW_​REDIS_​QUEUE_​URL`을 사용하세요).                              |
| `LANGFLOW_​REDIS_​QUEUE_​PORT`                           | `LANGFLOW_​REDIS_​PORT` | 작업 큐용 Redis 포트. 설정하지 않으면 일반 Redis 포트 설정을 따릅니다.                                                                                                                              |
| `LANGFLOW_​REDIS_​QUEUE_​DB`                             | `1`                     | 작업 큐용 Redis 데이터베이스 인덱스. 키 충돌을 피하려면 캐시 데이터베이스 인덱스(기본값 `0`)와 달라야 합니다.                                                                                                 |
| `LANGFLOW_​REDIS_​QUEUE_​TTL`                            | `3600`                  | Redis 내 작업 스트림 및 소유권 키의 TTL(초).                                                                                                                                               |
| `LANGFLOW_​REDIS_​QUEUE_​STARTUP_​GRACE_​S`              | `30.0`                  | 컨슈머가 프로듀서의 첫 기록을 기다리는 시간(초)으로, 이 시간이 지나면 존재하지 않는 스트림을 스트림 종료(EOF)로 간주합니다. 워커의 콜드 스타트가 느리다면 이 값을 늘리세요. `0`으로 설정하면 유예 기간이 없어져 아직 생성되지 않은 스트림을 즉시 EOF로 처리합니다. |
| `LANGFLOW_​REDIS_​QUEUE_​CANCEL_​CHANNEL_​ENABLED`       | `True`                  | `true`일 때, 각 워커는 Redis pub/sub 디스패처를 실행하여 `POST /build/{id}/cancel`이 요청을 받은 워커뿐 아니라 어떤 워커에서든 빌드를 취소할 수 있게 합니다. 브라우저 탭을 닫는 동작도 워커 간 취소 신호를 보냅니다. |
| `LANGFLOW_​REDIS_​QUEUE_​CANCEL_​MARKER_​TTL`            | `60`                    | 취소 마커(cancel-marker) 키의 TTL(초). 이 마커는 대상 워커의 디스패처가 구독을 시작하기 전에 취소 신호가 발행되는 경합(race) 상황을 해소합니다. 0 이하의 값은 시작 시 거부됩니다. |
| `LANGFLOW_​REDIS_​QUEUE_​POLLING_​STALE_​THRESHOLD_​S`   | `90.0`                  | 워치독이 방치된 폴링 빌드를 취소하기 전까지 클라이언트 활동 없이 대기하는 시간(초). 워치독을 완전히 비활성화하려면 `0`으로 설정하세요.                                                                                     |
| `LANGFLOW_​REDIS_​QUEUE_​POLLING_​WATCHDOG_​INTERVAL_​S` | `15.0`                  | 워치독이 오래된(stale) 작업을 스캔하는 주기(초). 값을 낮추면 리소스를 더 빠르게 회수하지만 Redis 읽기 횟수가 늘어납니다.                                                                                           |
| `LANGFLOW_​GUNICORN_​PRELOAD`                            | `False`                 | **실험적 기능.** 워커가 포크되기 전에 Gunicorn 마스터 프로세스에서 앱을 미리 로드하여 워커당 시작 오버헤드를 줄입니다. `LANGFLOW_​WORKERS`와 함께 사용하면 효과적입니다. Windows에서는 지원되지 않습니다.                         |

note

레이트 리밋(rate limit) 카운터는 기본적으로 *프로세스별로* 저장됩니다.
모든 워커에서 카운터를 공유하려면 `LANGFLOW_RATE_LIMIT_STORAGE_URI`를 동일한 Redis 인스턴스로 지정하세요.

```text
LANGFLOW_RATE_LIMIT_STORAGE_URI=redis://your-redis-host:6379/2  
```

자세한 내용은 [로그인 레이트 리밋](https://docs.langflow.org/api-keys-and-authentication#login-rate-limiting)을 참조하세요.

## 작업 큐 모니터링하기[​](#monitor-the-job-queue "Direct link to Monitor the job queue")

`GET /monitor/job_queue` 엔드포인트는 실행 중인 워커에 대한 메트릭 스냅샷을 반환합니다. 이 엔드포인트는 슈퍼유저 인증을 필요로 하며, 그렇지 않으면 HTTP 403을 반환합니다.

```bash
curl -H "Authorization: Bearer $LANGFLOW_SUPERUSER_TOKEN" \  
  http://localhost:7860/api/v1/monitor/job_queue  
```

Redis 백엔드의 응답 예시:

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
    "publish_errors": 0,  
    "dispatcher_reconnects": 0,  
    "dispatcher_internal_errors": 0,  
    "polling_watchdog_kills": 0,  
    "activity_touch_errors": 0,  
    "activity_get_errors": 0,  
    "activity_parse_errors": 0  
  }  
}  
```

메모리 내(`asyncio`) 백엔드의 경우 `backend`와 `active_jobs`만 반환됩니다.

### 응답 본문[​](#response-body "Direct link to Response body")

Redis 백엔드 응답에는 다음 필드가 포함됩니다.

| 필드                                        | 설명                                                                                                                                                                                              |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `backend`                                    | 활성 작업 큐 백엔드: `redis` 또는 `asyncio`.                                                                                                                                                      |
| `active_​jobs`                               | 현재 이 워커가 소유한 작업 수.                                                                                                                                                                           |
| `bridge_​count`                              | 이 워커에서 활성화된 Redis 스트림 브리지 작업 수. 브리지는 로컬 `asyncio.Queue`에서 이벤트를 읽어 Redis Streams에 기록하여 어떤 워커든 소비할 수 있게 합니다.                         |
| `consumer_​wrapper_​count`                   | 이 워커에서 활성화된 Redis 스트림 컨슈머 래퍼 수. 컨슈머 래퍼는 워커 간 폴링 또는 스트리밍 요청을 위해 Redis Stream에서 이벤트를 읽습니다.                                      |
| `background_​task_​count`                    | 현재 실행 중인 파이어 앤 포겟(fire-and-forget) 백그라운드 작업 수(취소 정리, 마커 확인).                                                                                                            |
| `cancel_​dispatcher_​running`                | 워커별 Redis pub/sub 디스패처가 활성 상태인지 여부. `false`이면 이 워커는 워커 간 취소 신호를 받을 수 없습니다. 디스패처는 지수 백오프(최대 30초)로 자동 재연결되므로, Redis 재시작 중 잠시 `false`가 표시되는 것은 정상입니다. |
| `cancel_​stats.published`                    | 이 워커가 Redis pub/sub 채널로 발행한 취소 신호 수.                                                                                                                                          |
| `cancel_​stats.marker_​hit`                  | 취소 마커 키가 발견된 횟수로, 디스패처와 경합한 취소 신호를 포착합니다.                                                                                                                               |
| `cancel_​stats.dispatched_​owned`            | 이 워커가 소유한 작업으로 전달된 취소 신호 수.                                                                                                                                        |
| `cancel_​stats.dispatched_​foreign`          | 다른 워커가 소유한 작업으로 전달된 취소 신호 수. 0이 아닌 값은 워커 간 취소가 정상 동작함을 확인해 줍니다.                                                                                 |
| `cancel_​stats.publish_​errors`              | 취소 발행 경로에서 발생한 Redis 오류 수. 지속적으로 0이 아닌 값이 나타나면 Redis 연결 문제를 나타냅니다.                                                                                                     |
| `cancel_​stats.dispatcher_​reconnects`       | 취소 디스패처가 Redis pub/sub 오류 후 재연결한 횟수.                                                                                                                                       |
| `cancel_​stats.dispatcher_​internal_​errors` | 취소 디스패처 내부에서 발생한 예기치 않은 오류 수(Redis 연결 끊김 제외). 0이 아닌 값은 버그를 나타내므로 로그를 확인하세요.                                                                                |
| `cancel_​stats.polling_​watchdog_​kills`     | 워치독이 회수한 방치된 폴링 빌드 수. 부하가 있을 때는 0이 아닌 값이 정상입니다. 값이 매우 높으면 클라이언트 연결 끊김이 잦다는 의미일 수 있으니(`LANGFLOW_​REDIS_​QUEUE_​POLLING_​STALE_​THRESHOLD_​S` 값을 늘리는 것을 고려하세요). |
| `cancel_​stats.activity_​touch_​errors`      | 클라이언트 하트비트 키를 Redis에 기록하는 중 발생한 오류 수.                                                                                                                                              |
| `cancel_​stats.activity_​get_​errors`        | 클라이언트 하트비트 키를 Redis에서 읽는 중 발생한 오류 수.                                                                                                                                        |
| `cancel_​stats.activity_​parse_​errors`      | 워치독이 발견한 손상된 하트비트 값의 수.                                                                                                                                              |

## 권장 Gunicorn 설정[​](#recommended-gunicorn-settings "Direct link to Recommended Gunicorn settings")

tip

이 튜닝은 선택 사항이며 Linux에만 적용됩니다. Redis 작업 큐를 대체하는 것은 아닙니다.

Windows와 macOS에서는 `langflow run`이 하나의 Uvicorn 프로세스를 사용하므로, `LANGFLOW_GUNICORN_PRELOAD`와 `GUNICORN_CMD_ARGS`는 아무런 효과가 없습니다.

이 권장값들은 Linux 다중 워커 배포에 대한 Langflow 엔지니어링팀의 벤치마크에서 도출한 출발점입니다.
이 값들을 적용한 후 성능을 모니터링하고, 플로우를 실행하면서 `htop`이나 `btop`을 이용해 조정하세요.

[Redis 작업 큐](#enable-the-redis-job-queue) 설정 뒤에 서버의 `.env` 파일에 시작 값을 추가하고 Langflow를 재시작하세요. 서버 사양에 가장 잘 맞는 블록을 복사하세요.

- 소규모 / 개발용 (4~8GB RAM)
- 표준 API (12GB RAM)
- 대규모 멀티에이전트 (24GB+ RAM)

Langflow와 로컬 데이터베이스가 OOM에 빠지지 않도록 워커 수를 적게 시작하세요.

```text
LANGFLOW_WORKERS=5  
LANGFLOW_WORKER_TIMEOUT=120  
LANGFLOW_GUNICORN_PRELOAD=true  
GUNICORN_CMD_ARGS="--max-requests 100 --max-requests-jitter 20"  
```

- **`LANGFLOW_WORKERS`** — 동시성을 위해 실행되는 Gunicorn 워커 프로세스 수.
- **`LANGFLOW_WORKER_TIMEOUT`** — Gunicorn이 워커를 강제 종료하기 전, 워커가 단일 요청을 처리할 수 있는 최대 시간. 긴 에이전트 실행이 예상된다면 값을 늘리세요.
- **`LANGFLOW_GUNICORN_PRELOAD`** — 워커가 포크되기 전에 Gunicorn 마스터에서 앱을 한 번 로드하여, Linux가 Copy-on-Write를 통해 워커 간 메모리를 공유할 수 있게 합니다. 메모리 절약을 위해 다중 워커 배포에서 활성화해 두는 것을 권장합니다. `false`로 두어도 안전하며, 이 경우 이전 릴리스와 동일하게 동작합니다.
- **`GUNICORN_CMD_ARGS`** — 지정된 요청 수를 처리한 후 워커를 재활용하여 메모리 사용량이 계속 누적되지 않도록 합니다. `--max-requests`는 워커가 그 수만큼 요청을 처리한 후 재시작하도록 하며, `--max-requests-jitter`는 각 워커마다 0~N개의 임의 추가 요청을 그 한도에 더합니다. 재시작을 시간에 걸쳐 분산시키면 모든 워커가 한꺼번에 재로드되는 것을 방지할 수 있습니다. RAM 사용량이 시간이 지남에 따라 늘어난다면, 워커 수를 줄이기 전에 `--max-requests` 값을 먼저 낮추세요.

자세한 내용은 [Langflow 확장하기 블로그 게시물](https://www.langflow.org/blog/scaling-langflow)을 참조하세요.
</content>
