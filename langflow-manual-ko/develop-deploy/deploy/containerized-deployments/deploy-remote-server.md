# 원격 서버에 Langflow 배포하기
> 원문: https://docs.langflow.org/next/deployment-caddyfile

안전한 웹 접근을 통해 자체 원격 서버에 Langflow를 배포하는 방법을 알아봅니다.
이 가이드는 [Docker](https://docs.docker.com/)를 사용하여 원격 서버에 Langflow를 설정하고, [Caddy](https://caddyserver.com/docs/)를 사용하여 안전한 웹 접근을 구성하는 과정을 안내합니다.

## 사전 준비 사항[​](#prerequisites "Direct link to Prerequisites")

- 듀얼 코어 CPU와 최소 2GB RAM을 갖춘 서버.
이 예제는 호스팅에 [Hetzner cloud](https://www.hetzner.com/)를 사용합니다. 사용자의 배포 환경은 다를 수 있습니다.

## SSH로 원격 서버에 연결하기[​](#connect-to-your-remote-server-with-ssh "Direct link to Connect to your remote server with SSH")

1. 서버에 원격으로 연결하기 위한 SSH 키를 생성합니다.
예를 들면 다음과 같습니다.

  ```
  ssh-keygen -t ed25519 -C "DANA@EXAMPLE.COM"
  ```
    `DANA@EXAMPLE.COM`을 SSH 키와 연결하려는 이메일 주소로 바꾸세요.

2. 터미널에서 지침에 따라 SSH 키 쌍을 생성합니다.
이렇게 하면 개인 키와 공개 키가 모두 생성됩니다.
터미널에서 공개 키를 복사하려면 다음 명령을 입력하세요.

  ```
  cat ~/Downloads/host-lf.pub | pbcopy
  ```

3. 원격 서버에서, 이전 단계에서 복사한 SSH 키를 추가합니다.
예를 들어 Hetzner cloud 서버를 사용하는 경우, **Server**를 클릭한 다음 **SSH keys**를 선택하여 SSH 키를 추가합니다.

4. SSH로 서버에 연결하려면 다음 명령을 입력하세요.

  ```
  ssh -i PATH_TO_PRIVATE_KEY/PRIVATE_KEY_NAME root@SERVER_IP_ADDRESS
  ```
    다음을 바꾸세요.

  - `PATH_TO_PRIVATE_KEY/PRIVATE_KEY_NAME`: 서버에 추가한 공개 키와 짝을 이루는 개인 SSH 키 파일의 경로
  - `SERVER_IP_ADDRESS`: 서버의 IP 주소

5. 키 지문(fingerprint)을 확인하라는 메시지가 표시되면 `yes`를 입력하세요.

터미널 출력은 연결이 성공했는지 실패했는지를 나타냅니다.
다음은 Hetzner cloud 서버에 연결한 후 반환된 응답의 예시입니다.

```
System information as of Mon May 19 04:34:44 PM UTC 2025

System load:  0.0               Processes:             129
Usage of /:   1.5% of 74.79GB   Users logged in:       0
Memory usage: 5%                IPv4 address for eth0: 5.161.250.132
Swap usage:   0%                IPv6 address for eth0: 2a01:4ff:f0:4de7::1
```

## 서버에 Langflow 배포하기[​](#deploy-langflow-on-your-server "Direct link to Deploy Langflow on your server")

이제 로컬 머신이 SSH로 원격 서버에 연결되었으므로, Docker를 설치하고 `docker-compose.yml` 파일을 생성한 다음, Caddy와 같은 리버스 프록시로 공개적으로 서비스할 수 있습니다.

1. 서버에 Docker를 설치합니다.

    이 예제 서버는 Ubuntu 서버이므로 snap 패키지를 설치할 수 있습니다.
Ubuntu를 사용하지 않거나 다른 설치 방법을 선호하는 경우, 운영 체제에 맞는 지침은 [공식 Docker 설치 가이드](https://docs.docker.com/get-started/get-docker/)를 참조하세요.

  ```
  snap install docker
  ```

2. `docker-compose.yml`이라는 파일을 생성하고 텍스트 편집기에서 엽니다.

  ```
  touch docker-compose.yml && nano docker-compose.yml
  ```

3. `docker-compose.yml`에 다음 값을 추가하고 파일을 저장합니다.

    다음 예제는 `langflow:latest` 이미지로부터 Langflow 서비스를, 그리고 Langflow를 리버스 프록시로 노출하는 Caddy 서비스를 정의합니다.

  tip
      [host-langflow](https://github.com/datastax/host-langflow) 저장소는 이 `docker-compose.yml`과 `Caddyfile`을 사전 빌드된 형태로 제공하므로, 서버에 저장소를 포크하고 싶다면 참고하세요.

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

4. `Caddyfile`이라는 파일을 생성합니다.

  ```
  touch Caddyfile && nano Caddyfile
  ```

5. `Caddyfile`에 다음 값을 추가하고 파일을 저장합니다.

    이 Caddyfile은 Caddy가 포트 80에서 리스닝하고, 포트 80으로 들어오는 모든 요청을 포트 7860의 Langflow 서비스로 전달하도록 구성합니다.

  ```
  :80 {
      reverse_proxy langflow:7860
  }
  ```

6. 서버를 배포하려면 `docker-compose up`을 실행하세요.

    `Welcome to Langflow` 메시지가 나타나면, Langflow가 실행 중이며 Docker 네트워크 내부에서 `http://0.0.0.0:7860`으로 접근할 수 있는 상태입니다.

7. 공용 인터넷을 통해 Langflow 서버에 접근하려면 서버의 공용 IP 주소, 예를 들어 `http://5.161.250.132`로 이동합니다.
아직 HTTPS가 활성화되지 않았기 때문에 이 주소는 HTTP를 사용합니다.

8. 권장: HTTPS를 활성화합니다.

  1. 도메인의 A 레코드를 서버의 IP 주소를 가리키도록 수정합니다. 예를 들면 다음과 같습니다.

  ```
  Type: A
  Name: langflow
  Value: 5.161.250.132  # Set to your server's IP address
  ```

  2. 서버를 중지합니다.

  3. Caddy가 HTTP(포트 80)와 HTTPS(포트 443) 요청 모두를 Langflow 서비스로 전달할 수 있도록 Caddyfile에 포트 `443`을 포함하도록 수정합니다.

  ```
  :80, :443 {
      reverse_proxy langflow:7860
  }
  ```

  4. 서버를 시작합니다.

        사용자가 도메인을 방문하면, Caddy가 들어오는 트래픽을 인식하고 안전하게 암호화된 연결로 서버에 자동으로 라우팅합니다.

9. SSH 세션을 종료하려면 `exit`를 입력하세요.

## 참고 자료[​](#see-also "Direct link to See also")

로컬 플로우를 커스텀 Docker 이미지로 패키징하는 방법은 [Langflow 애플리케이션 컨테이너화하기](https://docs.langflow.org/develop-application)를 참조하세요.

[fly.io](https://fly.io/)와 [Flightcontrol.dev](https://www.flightcontrol.dev/)로의 배포를 포함하여 Langflow 배포에 대한 단계별 가이드는 [How to Host Langflow Anywhere](https://www.youtube.com/watch?v=q4qt5hSnte4)를 참조하세요.
