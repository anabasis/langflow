# Docker로 Langflow 배포

Docker 컨테이너에서 애플리케이션을 실행하면 서로 다른 시스템에서 일관된 동작이 보장되고 의존성 충돌이 해소됩니다.

> **팁**: 여기서 표시된 모든 명령에서 Docker 대신 Podman을 사용할 수 있습니다.

---

## 빠른 시작: 기본값으로 Langflow 컨테이너 시작

```bash
docker run -p 7860:7860 langflowai/langflow:latest
```

`http://localhost:7860/`에서 Langflow에 접속합니다.

---

## 저장소를 클론하여 Docker Compose로 실행

Docker Compose를 사용하면 환경 변수 사용자 정의, 영구 PostgreSQL 데이터베이스 서비스 사용 등 더 많은 제어가 가능합니다.

기본 Docker Compose 배포에는 다음이 포함됩니다:
- **Langflow 서비스**: 최신 Langflow 이미지를 PostgreSQL 데이터베이스와 함께 실행
- **PostgreSQL 서비스**: 플로우, 사용자, 설정을 위한 영구 데이터 저장소
- **영구 볼륨**: 컨테이너 재시작 후에도 데이터 유지

```bash
# Langflow 저장소 클론
git clone https://github.com/langflow-ai/langflow.git

# docker_example 디렉토리로 이동
cd langflow/docker_example

# Docker Compose 실행
docker compose up
```

`http://localhost:7860/`에서 Langflow에 접속합니다.

### 배포 사용자 정의

`.env` 파일을 사용하여 데이터베이스 자격 증명을 구성할 수 있습니다:

```
# 데이터베이스 자격 증명
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=langflow

# Langflow 구성
LANGFLOW_DATABASE_URL=postgresql://myuser:mypassword@postgres:5432/langflow
LANGFLOW_CONFIG_DIR=/app/langflow
```

---

## 플로우를 Docker 이미지로 패키지화

```bash
# 프로젝트 디렉토리 생성
mkdir langflow-custom && cd langflow-custom

# 플로우 JSON 파일 추가
cp /path/to/your/flow.json .

# Dockerfile 생성
cat > Dockerfile << 'EOF'
FROM langflowai/langflow:latest
RUN mkdir /app/flows
COPY ./*.json /app/flows/
ENV LANGFLOW_LOAD_FLOWS_PATH=/app/flows
EOF

# 이미지 빌드 및 테스트
docker build -t myuser/langflow-custom:1.0.0 .
docker run -p 7860:7860 myuser/langflow-custom:1.0.0

# Docker Hub에 푸시 (선택 사항)
docker push myuser/langflow-custom:1.0.0
```

---

## Langflow Docker 이미지 업그레이드

데이터베이스나 플로우를 잃지 않고 업그레이드하는 방법:

1. **영구 볼륨에 데이터 유지**: 컨테이너 재시작 후에도 데이터가 유지되도록 Docker 볼륨이나 바인드 마운트를 사용합니다.

2. **새 이미지 풀 및 태그 업데이트**:

```bash
# Docker Compose 방식
docker compose pull
docker compose up -d

# docker run 방식
docker pull langflowai/langflow:1.8.0
docker run -p 7860:7860 -v langflow-data:/app/langflow langflowai/langflow:1.8.0
```

---

## 참고 항목

- [Langflow 애플리케이션 컨테이너화](./containerize.md)
- [원격 서버에 Langflow 배포](./caddyfile.md)
- [PostgreSQL 데이터베이스 구성](../develop/custom-database.md)

---

*원문: https://docs.langflow.org/next/deployment-docker*
