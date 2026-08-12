# LFX 소개

> 원문: https://docs.langflow.org/next/lfx-overview

**LFX**(Langflow Executor)는 전체 Langflow 애플리케이션 없이도 Langflow 플로우를 실행할 수 있는 경량 CLI 및 Python 라이브러리입니다.

플로우는 Langflow 비주얼 빌더에서 제작되며, 이후 해당 플로우 JSON 파일을 LFX로 실행합니다.
LFX는 최소한의 의존성으로, 데이터베이스나 UI 없이 JSON 파일로부터 상태를 저장하지 않는(stateless) 방식으로 플로우를 실행합니다.

LFX는 `--backend-only` 옵션으로 Langflow를 실행하는 것과 유사하지만, 전체 Langflow 패키지와 그 의존성을 설치할 필요가 없어 더욱 가볍습니다.

`uv pip install langflow` 설치 방식으로 Langflow에서 플로우를 빌드하고 있다면 LFX를 별도로 알아볼 필요는 없을 가능성이 높지만, 다른 애플리케이션이나 환경에서 JSON 파일로부터 플로우를 배포하고 실행하는 경우라면 LFX가 강력한 도구가 되어줄 것입니다.

Langflow OSS 버전 1.6 이상을 설치했다면 `lfx`는 이미 환경에 포함되어 있습니다.

## LFX와 Langflow의 차이점[​](#how-lfx-differs-from-langflow "Direct link to How LFX differs from Langflow")

Langflow에서는 비주얼 빌더에서 플로우를 빌드하고 테스트하며, 전체 애플리케이션은 플로우, 메시지, 사용자를 데이터베이스에 저장합니다.
동일한 Langflow 서버는 이미 LFX를 플로우 런타임으로 사용하고 있습니다.
LFX를 독립적으로 설치하면 런타임을 Langflow UI 및 데이터베이스로부터 분리할 수 있습니다. [`lfx run`](https://docs.langflow.org/next/lfx-run)은 커맨드라인에서 플로우를 한 번 실행하고 결과를 출력하며, [`lfx serve`](https://docs.langflow.org/next/lfx-serve)는 하나 이상의 플로우를 지속적인 HTTP 엔드포인트로 노출합니다.
플로우는 여전히 Langflow 비주얼 빌더에서 작성하고 JSON 파일로 내보냅니다.
독립형 LFX는 Langflow 서버를 시작하거나 비주얼 에디터를 열지 않고 플로우 JSON 파일을 실행하기 위한 것입니다.

내부적으로 LFX는 실제 데이터베이스 대신 no-op 데이터베이스 인터페이스([`NoopSession`](https://github.com/langflow-ai/langflow/blob/main/src/lfx/src/lfx/services/session.py))를 사용합니다. `langflow.db` 파일이 없으며, 플로우 저장, 메시지 저장, 사용자 관리 같은 상태 유지 작업은 지속되지 않습니다. `langflow.db`에 의존하는 작업은 전체 Langflow 애플리케이션에서와 같이 동작하지 않습니다.

## LFX 명령어[​](#lfx-commands "Direct link to LFX commands")

LFX는 두 가지 명령어 집합을 제공합니다.

**런타임 명령어**로 플로우를 로컬에서 실행하고 서비스합니다.

| 명령어                            | 설명                                                                  |
| ---------------------------------- | ---------------------------------------------------------------------------- |
| [`lfx serve`](https://docs.langflow.org/next/lfx-serve)     | 하나 이상의 플로우를 `/flows/{flow_​id}/run`에서 FastAPI 엔드포인트로 서비스     |
| [`lfx run`](https://docs.langflow.org/next/lfx-run)         | 플로우를 로컬에서 실행하고 결과를 `stdout`으로 스트리밍                        |
| [`lfx prewarm`](https://docs.langflow.org/next/lfx-prewarm) | fork나 스냅샷 이전에 핵심 컴포넌트 임포트와(선택적으로) 플로우를 예열(pre-warm) |
| [`lfx-mcp`](https://docs.langflow.org/next/lfx-mcp)         | 실행 중인 Langflow 인스턴스에 연결하는 MCP 서버 시작             |

LFX 런타임 명령어에 대해서는 [LFX로 플로우 실행하기](https://docs.langflow.org/next/lfx-run) 및 [LFX로 플로우 서비스하기](https://docs.langflow.org/next/lfx-serve)를 참고하세요.

**Flow DevOps SDK 명령어**로 플로우의 버전 관리, 테스트, 배포를 수행합니다.

| 명령어            | 설명                                                      |
| ------------------ | ---------------------------------------------------------------- |
| `lfx init`         | CI 템플릿이 포함된 버전 관리형 플로우 프로젝트 스캐폴딩              |
| `lfx login`        | 원격 Langflow 인스턴스에 대해 자격 증명 검증          |
| `lfx create`       | 내장 또는 커스텀 템플릿으로 새 플로우 JSON 생성        |
| `lfx validate`     | 푸시하기 전에 플로우 JSON 검증                |
| `lfx requirements` | 플로우의 컴포넌트 의존성으로부터 `requirements.txt` 생성 |
| `lfx status`       | 로컬 플로우 파일을 원격 Langflow 인스턴스와 비교      |
| `lfx push`         | 안정적인 ID로 원격 인스턴스에 플로우를 푸시            |
| `lfx pull`         | 원격 인스턴스에서 로컬 파일로 플로우를 풀              |
| `lfx export`       | 깔끔한 git diff를 위해 플로우 JSON을 정규화             |

Flow DevOps SDK 명령어에 대해서는 [Flow DevOps Toolkit SDK](https://docs.langflow.org/flow-devops-sdk)를 참고하세요.

## 참고 자료[​](#see-also "Direct link to See also")

- [LFX 설치하기](https://docs.langflow.org/next/lfx-install)
- [LFX로 플로우 실행하기](https://docs.langflow.org/next/lfx-run)
- [LFX로 플로우 서비스하기](https://docs.langflow.org/next/lfx-serve)
- [LFX 예열하기](https://docs.langflow.org/next/lfx-prewarm)
- [LFX MCP 서버로 플로우 빌드하기](https://docs.langflow.org/next/lfx-mcp)
- [Flow DevOps Toolkit SDK](https://docs.langflow.org/next/flow-devops-sdk)
- [LFX와 Langflow 버전 호환성](https://docs.langflow.org/next/lfx-compatibility)
- [확장 기능 개요](https://docs.langflow.org/next/extensions-overview)
