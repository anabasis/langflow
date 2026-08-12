# Langflow 애플리케이션 컨테이너화

비주얼 에디터에서 플로우를 설계하는 것은 Langflow를 사용하는 애플리케이션을 구축하는 첫 번째 단계일 뿐입니다.

플로우가 완성되면 웹사이트나 모바일 앱과 같은 더 큰 애플리케이션에서 그 플로우를 사용할 수 있습니다.

> **팁**: 여기서 표시된 모든 명령에서 Docker 대신 Podman을 사용할 수 있습니다.

---

## 디렉토리 구조

최소한의 Langflow 애플리케이션 디렉토리 구조 예시:

```
LANGFLOW-APPLICATION/
├── docker.env
├── Dockerfile
├── flows/
│   ├── flow1.json
│   └── flow2.json
├── langflow-config-dir/
└── README.md
```

각 파일/폴더:
- `docker.env`: 컨테이너 루트에 `.env`로 복사되는 환경 변수 파일
- `Dockerfile`: Langflow 이미지 빌드 방법 제어
- `/flows`: 호스팅할 플로우 파일
- `/langflow-config-dir`: 구성 파일, 데이터베이스, 로그 위치
- `README.md`: 애플리케이션 문서

---

## 패키지 관리

기본 Langflow Docker 이미지에는 Langflow 핵심 의존성이 포함되어 있습니다.

추가 의존성이 필요한 경우 `pyproject.toml` 파일을 만들고 Dockerfile에 추가합니다:

```dockerfile
COPY pyproject.toml uv.lock /app/
```

---

## 환경 변수 (docker.env)

`docker.env` 파일에는 Langflow 환경 변수가 포함됩니다:

```
LANGFLOW_AUTO_LOGIN=True
LANGFLOW_SAVE_DB_IN_CONFIG_DIR=True
LANGFLOW_BASE_URL=http://0.0.0.0:7860
OPENAI_API_KEY=sk-...
```

---

## 플로우

1. 애플리케이션에 관련된 [플로우를 내보냅니다](../flows/import-export-flows.md).
2. 내보낸 Langflow JSON 파일을 `/flows` 폴더에 추가합니다.

---

## Langflow Dockerfile

```dockerfile
# 기본 Langflow 이미지 사용
FROM langflowai/langflow:latest

# 컨테이너에 폴더 생성 및 작업 디렉토리 설정
RUN mkdir /app/flows
RUN mkdir /app/langflow-config-dir
WORKDIR /app

# flows, langflow-config-dir, docker.env를 컨테이너에 복사
COPY flows /app/flows
COPY langflow-config-dir /app/langflow-config-dir
COPY docker.env /app/.env

# 선택 사항: 커스텀 컴포넌트 복사
COPY components /app/components

# 선택 사항: 커스텀 의존성 사용
COPY pyproject.toml uv.lock /app/

# docker.env에 설정되지 않은 경우 환경 변수 설정
ENV PYTHONPATH=/app
ENV LANGFLOW_LOAD_FLOWS_PATH=/app/flows
ENV LANGFLOW_CONFIG_DIR=/app/langflow-config-dir
ENV LANGFLOW_COMPONENTS_PATH=/app/components
ENV LANGFLOW_LOG_ENV=container

# 포트 7860에서 Langflow 서버 실행
EXPOSE 7860
CMD ["langflow", "run", "--backend-only", "--env-file","/app/.env","--host", "0.0.0.0", "--port", "7860"]
```

### 백엔드 전용 모드

`CMD`의 `--backend-only` 플래그는 프로그래밍 방식 접근만 제공하는 백엔드 전용 모드로 Langflow를 시작합니다. 비주얼 에디터 없이 애플리케이션의 의존성으로 Langflow를 실행할 때 권장됩니다.

---

## Langflow Docker 이미지 테스트

1. Docker 이미지 빌드:

```bash
docker build -t my-langflow-app:1.0.0 .
```

2. Docker 컨테이너 실행:

```bash
docker run -p 7860:7860 my-langflow-app:1.0.0
```

3. 플로우 JSON 파일에서 `id`를 찾아 API 요청으로 확인:

```bash
curl --request POST \
  --url 'http://localhost:7860/api/v1/run/FLOW_ID?stream=true' \
  --header 'Content-Type: application/json' \
  --data '{
    "input_value": "안녕하세요",
    "output_type": "chat",
    "input_type": "chat"
  }'
```

---

## 참고 항목

- [Langflow 배포 개요](./deployment-overview.md)
- [Docker 이미지로 Langflow 배포](./containerize.md)
- [Kubernetes 배포](https://docs.langflow.org/next/deployment-architecture)

---

*원문: https://docs.langflow.org/next/develop-application*
