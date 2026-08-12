# Nginx와 SSL로 Langflow 배포

Nginx를 리버스 프록시로, Let's Encrypt를 SSL 인증서로, Certbot을 자동 인증서 관리로 사용하여 Linux 기반 서버에 Langflow를 배포합니다.

---

## 사전 요구사항

- 듀얼 코어 CPU와 최소 2GB RAM이 있는 Ubuntu 또는 Debian 기반 Linux 서버
- 외부 DNS 관리 액세스가 있는 도메인 이름
- 서버의 외부 IP 주소를 가리키도록 구성된 DNS 레코드

```
Type: A
Name: langflow.example.com
Value: 203.0.113.1
```

---

## SSH로 서버에 연결

1. SSH 키 생성:

```bash
ssh-keygen -t ed25519 -C "YOUR@EMAIL.COM"
```

2. 서버에 공개 키 추가합니다.

3. SSH로 서버에 연결:

```bash
ssh -i PATH_TO_PRIVATE_KEY/PRIVATE_KEY_NAME root@SERVER_IP_ADDRESS
```

---

## 서버에 Langflow 설치

```bash
# 시스템 패키지 업데이트
sudo apt update && sudo apt upgrade -y

# Python 설치
sudo apt install python3 python3-pip python3-venv -y

# uv 설치
pip install uv

# 가상 환경 생성
uv venv langflow-venv
source langflow-venv/bin/activate

# Langflow 설치
uv pip install langflow

# 선택 사항: Langflow 시작 테스트
uv run langflow run --host 127.0.0.1 --port 7860 &
```

---

## Nginx 설치

```bash
# Nginx 설치 및 시작
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# Nginx 구성 파일 생성 (DOMAIN_NAME을 실제 도메인으로 교체)
sudo nano /etc/nginx/sites-available/DOMAIN_NAME
```

다음 내용을 붙여넣습니다:

```nginx
server {
    listen 80;
    server_name DOMAIN_NAME;

    # 파일 업로드를 위한 클라이언트 본문 크기 증가
    client_max_body_size 100M;

    location / {
        proxy_pass http://127.0.0.1:7860/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Langflow를 위한 WebSocket 지원
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # 장시간 실행 플로우를 위한 타임아웃 설정
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 300s;

        # 버퍼 설정
        proxy_buffering off;
        proxy_request_buffering off;
    }
}
```

```bash
# 사이트 구성 활성화
sudo ln -s /etc/nginx/sites-available/DOMAIN_NAME /etc/nginx/sites-enabled/DOMAIN_NAME

# 구성 확인 및 재시작
sudo nginx -t
sudo systemctl restart nginx
```

---

## Certbot 설치 및 SSL 인증서 획득

```bash
# Certbot 설치
sudo apt install certbot python3-certbot-nginx -y

# SSL 인증서 획득 (DOMAIN_NAME을 실제 도메인으로 교체)
sudo certbot --nginx -d DOMAIN_NAME
```

성공 시:

```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/DOMAIN_NAME/fullchain.pem
Key is saved at: /etc/letsencrypt/live/DOMAIN_NAME/privkey.pem
```

```bash
# 가상 환경 활성화 후 Langflow 시작
source langflow-venv/bin/activate
uv run langflow run --host 127.0.0.1 --port 7860 &
```

브라우저에서 `https://DOMAIN_NAME`으로 접속하여 배포를 테스트합니다. 주소 표시줄의 **잠금** 아이콘을 클릭하여 SSL 인증서 세부 정보를 확인합니다.

---

## 참고 항목

- [Caddy로 원격 서버에 Langflow 배포](https://docs.langflow.org/deployment-caddyfile)
- [Docker로 Langflow 배포](https://docs.langflow.org/deployment-docker)

---

*원문: https://docs.langflow.org/next/deployment-nginx-ssl*
