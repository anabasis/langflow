# Nginx와 SSL로 Langflow 배포하기
> 원문: https://docs.langflow.org/next/deployment-nginx-ssl

Nginx를 리버스 프록시로, Let's Encrypt를 SSL 인증서로, Certbot을 자동 인증서 관리 도구로 사용해 Linux 기반 서버에 Langflow를 배포합니다.

이 설정은 사용자와 Langflow 서버 간의 모든 통신을 암호화합니다. SSL 인증서는 민감한 데이터를 도청과 변조로부터 보호하며, Certbot을 통한 자동 인증서 관리는 수동 SSL 구성의 복잡함을 없애줍니다.

## 사전 요구 사항[​](#prerequisites "사전 요구 사항으로 바로 가기")

- 듀얼 코어 CPU와 최소 2GB RAM을 갖춘 Ubuntu 또는 Debian 기반 Linux 서버.
이 예시에서는 호스팅에 [Digital Ocean 클라우드](https://www.digitalocean.com)를 사용합니다. 실제 배포 환경은 다를 수 있습니다.
- 외부 DNS 관리 권한이 있는 도메인 이름.
- 도메인이 서버의 외부 IP 주소를 가리키도록 구성된 DNS 레코드.
예를 들어 서버 IP가 `203.0.113.1`이라면 다음과 같이 DNS를 구성합니다.

    ```
    Type: A
    Name: langflow.example.com
    Value: 203.0.113.1
    ```

## SSH로 서버에 연결하기[​](#connect-to-your-server-with-ssh "SSH로 서버에 연결하기로 바로 가기")

1. 서버에 원격으로 연결할 SSH 키를 생성합니다.
예를 들면 다음과 같습니다.

    ```
    ssh-keygen -t ed25519 -C "DANA@EXAMPLE.COM"
    ```
    `DANA@EXAMPLE.COM`을 SSH 키에 연결할 이메일 주소로 바꾸세요.

2. 터미널에서 안내에 따라 SSH 키 쌍을 생성합니다.
이렇게 하면 개인 키와 공개 키가 모두 생성됩니다.
터미널에서 공개 키를 복사하려면 다음 명령을 입력하세요.

    ```
    cat ~/Downloads/host-lf.pub | pbcopy
    ```

3. 서버에 앞 단계에서 복사한 SSH 키를 추가합니다.
예를 들어 Digital Ocean 클라우드 서버를 사용한다면, 서버 생성 시 또는 [Digital Ocean 제어판](https://docs.digitalocean.com/products/droplets/how-to/add-ssh-keys/)에서 이 SSH 키를 추가하세요.

4. SSH로 서버에 연결하려면 다음 명령을 입력하세요.

    ```
    ssh -i PATH_TO_PRIVATE_KEY/PRIVATE_KEY_NAME root@SERVER_IP_ADDRESS
    ```
    다음을 바꾸세요.

    - `PATH_TO_PRIVATE_KEY/PRIVATE_KEY_NAME`: 서버에 추가한 공개 키와 짝을 이루는 개인 SSH 키 파일 경로
    - `SERVER_IP_ADDRESS`: 서버의 IP 주소

5. 키 지문(fingerprint)을 확인하라는 메시지가 나오면 `yes`를 입력하세요.
터미널 출력에 연결 성공 또는 실패 여부가 표시됩니다.
다음은 Digital Ocean 클라우드 서버에 연결한 후 반환된 응답의 예시입니다.

    ```
     System information as of Wed Oct  8 21:40:43 UTC 2025

      System load:  0.02              Processes:             103
      Usage of /:   4.1% of 47.35GB   Users logged in:       1
      Memory usage: 10%               IPv4 address for eth0: 165.227.176.236
      Swap usage:   0%                IPv4 address for eth0: 10.17.0.5
    ```

## 서버에 Langflow 설치하기[​](#install-langflow-on-your-server "서버에 Langflow 설치하기로 바로 가기")

서버에 Langflow를 설치하려면 다음을 수행하세요.

1. 시스템 패키지를 업데이트합니다.

    ```
    sudo apt update && sudo apt upgrade -y
    ```

2. Python과 pip를 설치합니다.

    ```
    sudo apt install python3 python3-pip python3-venv -y
    ```

3. Python 패키지를 관리할 uv를 설치합니다.
Langflow는 더 빠른 설치를 위해 uv 사용을 권장합니다.

    ```
    pip install uv
    ```

4. Langflow용 가상 환경을 생성합니다.

    ```
    uv venv langflow-venv
    source langflow-venv/bin/activate
    ```

5. uv로 Langflow를 설치합니다.

    ```
    uv pip install langflow
    ```

6. 선택 사항으로 Langflow를 시작합니다.

    ```
    uv run langflow run --host 127.0.0.1 --port 7860 &
    ```
    `http://YOUR_PUBLIC_IP:7860`으로 접근을 테스트해 보세요.
Langflow가 `localhost`에서 실행 중이므로 접근에 성공하지 못할 것입니다.
다음 단계에서 외부 접근을 처리할 리버스 프록시로 Nginx를 설치하고, 안전한 HTTPS 접근을 위한 SSL을 구성할 Certbot을 설치합니다.

## Nginx 설치하기[​](#install-nginx "Nginx 설치하기로 바로 가기")

Nginx는 외부 요청을 받아 Langflow 서버로 전달하는 리버스 프록시입니다. SSL 종료(termination) 외에도 Nginx는 로드 밸런싱과 보안 기능을 제공합니다. 자세한 내용은 [Nginx 문서](https://nginx.org/en/docs/)를 참조하세요.

1. 서버에 Nginx를 설치합니다.

    ```
    sudo apt install nginx -y
    ```

2. 서버에서 Nginx를 시작하고 활성화합니다.

    ```
    sudo systemctl start nginx
    sudo systemctl enable nginx
    ```

3. Nginx 구성 파일을 만듭니다.
**DOMAIN_NAME**을 `langflow.example.com`과 같은 실제 도메인 이름으로 바꾸세요.

    ```
    sudo nano /etc/nginx/sites-available/DOMAIN_NAME
    ```

4. `/etc/nginx/sites-available/DOMAIN_NAME`에 생성한 구성 파일에 다음 내용을 붙여넣으세요.

    **DOMAIN_NAME**을 `langflow.example.com`과 같은 실제 도메인 이름으로 바꾸세요.

    ```
    server {
        listen 80;
        server_name DOMAIN_NAME;

        # Increase client body size for file uploads
        client_max_body_size 100M;

        location / {
            proxy_pass http://127.0.0.1:7860/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # WebSocket support for Langflow
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";

            # Timeout settings for long-running flows
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 300s;

            # Buffer settings
            proxy_buffering off;
            proxy_request_buffering off;
        }
    }
    ```
    이 구성은 표준 HTTP를 위해 포트 80에서 수신 대기합니다. 이후 단계에서 Certbot을 설치하면 HTTPS를 위한 포트 443을 추가하도록 이 구성이 수정됩니다.

5. 사이트 구성을 활성화하려면 `/sites-available`과 `/sites-enabled` 디렉터리 사이에 심볼릭 링크를 만드세요. `/sites-available`은 모든 사이트 구성을 저장하고, `/sites-enabled`는 Nginx가 읽어들이는 활성 구성만 저장합니다. 이 심볼릭 링크를 만들면 해당 구성이 켜집니다(ON).

    ```
    sudo ln -s /etc/nginx/sites-available/DOMAIN_NAME /etc/nginx/sites-enabled/DOMAIN_NAME
    ```

6. Nginx 구성 파일의 문법을 확인합니다.

    ```
    sudo nginx -t
    ```

7. Nginx를 재시작합니다.

    ```
    sudo systemctl restart nginx
    ```

## Certbot 설치 및 SSL 인증서 발급받기[​](#install-certbot-and-obtain-ssl-certificates "Certbot 설치 및 SSL 인증서 발급받기로 바로 가기")

Nginx가 트래픽 암호화 및 복호화를 통해 SSL 종료를 처리하는 동안, Certbot은 Let's Encrypt로부터 SSL 인증서를 자동으로 발급받아 Nginx가 이를 사용하도록 구성합니다.

Certbot 클라이언트는 [Let's Encrypt에서 권장](https://letsencrypt.org/getting-started/#selecting-and-operating-an-acme-client-yourself)하는 자동화된 인증서 관리 도구입니다. 자세한 내용은 [Certbot 문서](https://certbot.eff.org/)를 참조하세요.

인증서를 관리할 Certbot 클라이언트를 서버에 설치하고, Certbot이 서버의 Nginx 구성을 수정할 수 있도록 [`python3-certbot-nginx` 플러그인](https://packages.ubuntu.com/source/jammy/python-certbot-nginx)을 설치하세요.

1. Certbot과 `python3-certbot-nginx` 플러그인을 설치합니다.

    ```
    sudo apt install certbot python3-certbot-nginx -y
    ```

2. Let's Encrypt로부터 `DOMAIN_NAME`에 대한 SSL 인증서를 발급받습니다.

    ```
    sudo certbot --nginx -d DOMAIN_NAME
    ```
    다음 결과는 Certbot이 성공했음을 나타냅니다.

    ```
    Successfully received certificate.
    Certificate is saved at: /etc/letsencrypt/live/DOMAIN_NAME/fullchain.pem
    Key is saved at: /etc/letsencrypt/live/DOMAIN_NAME/privkey.pem
    ```
    `--nginx`를 사용하면 Certbot이 Nginx 구성에 `ssl_certificate`와 `ssl_certificate_key` 경로를 자동으로 주입합니다.

3. 가상 환경에서 Langflow를 시작합니다.

    a. 가상 환경을 활성화합니다.

    ```
    source langflow-venv/bin/activate
    ```
    b. 백그라운드에서 Langflow를 시작합니다.

    ```
    uv run langflow run --host 127.0.0.1 --port 7860 &
    ```

4. 배포를 테스트하려면 브라우저에서 `https://DOMAIN_NAME`으로 이동하세요.

5. SSL 인증서가 정상적으로 동작하는지 확인하세요. URL이 `http://`가 아니라 `https://`인지 확인하세요.
브라우저 주소창에  **Lock**(자물쇠) 아이콘이 표시되어야 합니다.
 **Lock**을 클릭하면 SSL 인증서 세부 정보를 볼 수 있습니다.

## 참고[​](#see-also "참고로 바로 가기")

- [Caddy로 원격 서버에 Langflow 배포하기](https://docs.langflow.org/deployment-caddyfile)
- [Docker에 Langflow 배포하기](https://docs.langflow.org/deployment-docker)
