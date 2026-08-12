# 원격 서버에 Langflow 배포

Docker와 Caddy를 사용하여 보안 웹 접근이 가능한 원격 서버에 Langflow를 배포하는 방법을 알아봅니다.

---

## 사전 요구사항

- 듀얼 코어 CPU와 최소 2GB RAM이 있는 서버

---

## SSH로 원격 서버에 연결

```bash
# SSH 키 생성
ssh-keygen -t ed25519 -C "YOUR@EMAIL.COM"

# 서버에 연결
ssh -i PATH_TO_PRIVATE_KEY/PRIVATE_KEY_NAME root@SERVER_IP_ADDRESS
```

---

## 서버에 Langflow 배포

1. 서버에 Docker 설치 (Ubuntu 예시):

```bash
snap install docker
```

2. `docker-compose.yml` 파일 생성:

```bash
touch docker-compose.yml && nano docker-compose.yml
```

다음 내용 추가:

```yaml
version: "3.8"

services:
  langflow:
    image: langflowai/langflow:latest
    ports:
      - "7860:7860"
    environment:
      - LANGFLOW_HOST=0.0.0.0
      - LANGFLOW_PORT=7860

  caddy:
    image: caddy:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - langflow

volumes:
  caddy_data:
  caddy_config:
```

3. `Caddyfile` 생성:

```bash
touch Caddyfile && nano Caddyfile
```

다음 내용 추가 (포트 80을 Langflow 포트 7860으로 포워딩):

```
:80 {
    reverse_proxy langflow:7860
}
```

4. 서버 배포:

```bash
docker-compose up
```

`Welcome to Langflow` 메시지가 나타나면 Langflow가 실행 중입니다. 서버의 공개 IP 주소로 접속합니다: `http://YOUR_SERVER_IP`

---

## HTTPS 활성화

1. 도메인의 A 레코드를 서버 IP 주소로 설정합니다:

```
Type: A
Name: langflow
Value: YOUR_SERVER_IP
```

2. 서버를 중지합니다.

3. Caddyfile을 수정하여 포트 443을 추가합니다:

```
:80, :443 {
    reverse_proxy langflow:7860
}
```

4. 서버를 다시 시작합니다. Caddy가 자동으로 HTTPS 인증서를 처리합니다.

---

## 참고 항목

- [Langflow 애플리케이션 컨테이너화](./containerize.md)
- [Nginx와 SSL로 배포](./nginx-ssl.md)

---

*원문: https://docs.langflow.org/next/deployment-caddyfile*
