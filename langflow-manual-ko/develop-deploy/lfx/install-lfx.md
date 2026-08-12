# LFX 설치하기

> 원문: https://docs.langflow.org/next/lfx-install

LFX는 PyPI에서 설치하거나, Langflow 저장소를 클론하거나, 설치 없이 `uvx`로 실행할 수 있습니다.

Langflow OSS 버전 1.6 이상을 설치했다면 `lfx`는 이미 환경에 포함되어 있습니다.

## 사전 준비[​](#prerequisites "Direct link to Prerequisites")

- [Python](https://www.python.org/downloads/) 3.10–3.14
- [uv](https://docs.astral.sh/uv/getting-started/installation/) 0.4 이상

## PyPI에서 설치하기[​](#install-from-pypi "Direct link to Install from PyPI")

1. 가상 환경을 생성하고 활성화합니다.

```bash
uv venv lfx-venv  
source lfx-venv/bin/activate  
```

2. LFX를 설치합니다.

```bash
uv pip install lfx  
```

    최신 nightly(사전 릴리스) 버전을 설치하려면:

```bash
uv pip install --pre lfx  
```

## 번들 컴포넌트와 함께 설치하기[​](#install-with-bundle-components "Direct link to Install with bundle components")

LFX 엔진과 플로우에 필요한 제공자(provider) 확장을 설치합니다.

`uv pip install langflow`는 번들 컴포넌트를 자동으로 설치합니다.

`uv pip install lfx`는 핵심 LFX 실행기만 설치하며, 제공자 번들은 포함되지 않습니다.

플로우가 번들 컴포넌트를 사용한다면, 동일한 가상 환경에 필요한 패키지를 설치하세요.

일부 컴포넌트는 추가로 [torch 옵트인 설치](https://docs.langflow.org/next/components-bundle-components#torch-opt-in)가 필요합니다.

*롱테일 번들(long-tail bundle)*은 벡터 스토어나 모델 제공자 같은 서드파티 제공자 통합으로, `lfx-bundles` 패키지에 함께 제공됩니다.

*독립형 번들(standalone bundle)*은 OpenAI, Anthropic, Exa처럼 자체 릴리스 주기를 가진 성숙(graduated)한 제공자입니다.

롱테일 제공자 하나를 설치하려면:

```bash
uv pip install "lfx-bundles[<bundle>]"  
```

모든 롱테일 제공자를 설치하려면:

```bash
uv pip install "lfx[bundles]"  
```

`lfx[bundles]`는 `lfx` 플러스 `lfx-bundles[all]`과 동일합니다.
이는 `lfx-openai` 같은 성숙한 독립형 패키지는 설치하지 **않습니다**.

독립형 제공자 패키지를 설치하려면:

```bash
uv pip install lfx-<provider>  
```

예를 들면:

```bash
uv pip install lfx-openai  
```

전체 번들-패키지 매핑은 [번들 목록](https://docs.langflow.org/next/extensions-bundle-list)을 참고하세요.

번들 검색(discovery)은 시작 시 이루어집니다. 설치 후에는 Langflow나 LFX 서버를 재시작하세요.

현재 로드된 확장 기능을 확인하려면 다음을 실행합니다.

```bash
lfx extension list  
```

## Langflow 저장소 클론하기[​](#clone-the-langflow-repository "Direct link to Clone the Langflow repository")

PyPI 설치 없이 소스에서 LFX를 실행하려면:

1. Langflow 저장소를 클론합니다.

```bash
git clone https://github.com/langflow-ai/langflow  
```

2. `src/lfx` 디렉터리로 이동합니다.

```bash
cd langflow/src/lfx  
```

3. `uv run`을 사용해 `lfx` 명령어를 실행합니다.

```bash
uv run lfx serve my-flow.json  
```

`src/lfx`에서 `uv run lfx`를 실행하면 LFX 엔진만 설치됩니다.
번들 컴포넌트는 별도로 설치해야 합니다.
번들 컴포넌트를 사용하려면 [번들 컴포넌트와 함께 설치하기](#install-with-bundle-components)를 참고하거나, 저장소 루트에서 `make init`을 실행해 전체 Langflow 개발 워크스페이스를 설치하세요.

## 설치 없이 실행하기[​](#run-without-installing "Direct link to Run without installing")

영구적인 설치 없이 임시 환경에서 LFX를 실행하려면 `uvx`를 사용합니다.

```bash
uvx lfx serve my-flow.json  
```

`uvx`는 LFX를 자동으로 다운로드하고 캐시합니다.
가상 환경을 관리하고 싶지 않은 일회성 플로우 실행이나 CI 파이프라인에 유용합니다.

## 설치 확인하기[​](#verify-the-installation "Direct link to Verify the installation")

설치 후 LFX를 사용할 수 있는지 확인합니다.

```bash
lfx --version  
```

사용 가능한 명령어 목록을 확인하려면:

```bash
lfx --help  
```

## 참고 자료[​](#see-also "Direct link to See also")

- [LFX 소개](https://docs.langflow.org/next/lfx-overview)
- [LFX로 플로우 실행하기](https://docs.langflow.org/next/lfx-run)
- [LFX로 플로우 서비스하기](https://docs.langflow.org/next/lfx-serve)
- [Flow DevOps Toolkit SDK](https://docs.langflow.org/next/flow-devops-sdk)
- [확장 기능 개요](https://docs.langflow.org/next/extensions-overview)
