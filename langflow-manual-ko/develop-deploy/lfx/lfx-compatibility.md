# LFX와 Langflow 버전 호환성

> 원문: https://docs.langflow.org/next/lfx-compatibility

Langflow와 LFX는 동일한 `major.minor` 라인으로 함께 버전 관리되므로, 어떤 LFX 릴리스가 어떤 플로우를 실행하는지 항상 파악할 수 있습니다.

## 호환성 계약[​](#compatibility-contract "Direct link to Compatibility contract")

**LFX `X.Y.N`은 Langflow `X.Y.M`에서 내보낸 모든 플로우와 호환성이 보장됩니다.**

major와 minor 번호는 반드시 일치해야 합니다.
LFX의 패치 `.N`과 Langflow의 패치 `.M`은 독립적으로 릴리스됩니다. LFX 패치 수정이 Langflow 패치 릴리스를 요구하지 않으며, 그 반대도 마찬가지입니다.

LFX와 플로우가 동일한 `major` 버전을 공유하지만 `minor`가 다른 경우(예: Langflow 1.9.x에서 내보낸 플로우를 LFX 1.10.x로 실행하는 경우), 플로우가 저장된 이후 개별 컴포넌트가 업데이트되었을 수 있습니다.
이러한 플로우를 실행하거나 서비스하기 전에 `lfx upgrade`를 사용하여 호환성을 확인하고 안전한 자동 수정을 적용하세요.
자세한 내용은 [lfx upgrade로 플로우 확인 및 업그레이드하기](#check-and-upgrade-flows-with-lfx-upgrade)를 참고하세요.

## 호환성 매트릭스[​](#compatibility-matrix "Direct link to Compatibility matrix")

| Langflow 버전 | 호환되는 LFX 버전 | 참고                                                                                                              |
| ---------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 1.10.x           | 1.10.x                 | 완전히 호환됩니다. 동일한 `major.minor` 라인.                                                                         |
| 1.11.x           | 1.11.x                 | 완전히 호환됩니다. 동일한 `major.minor` 라인.                                                                         |
| 1.9.x 이하 | 1.10.x                 | 실행하기 전에 `lfx upgrade --upgrade-flow=safe`로 안전한 컴포넌트 스키마 업그레이드를 적용하세요.                      |
| 모든 1.x.x        | 0.5.x                  | LFX 0.5.x는 버전 정렬 이전의 독립형 릴리스였습니다. 더 이상 Langflow 1.10 이상의 플로우와 호환되지 않습니다. |

## `lfx upgrade`로 플로우 확인 및 업그레이드하기[​](#check-and-upgrade-flows-with-lfx-upgrade "Direct link to check-and-upgrade-flows-with-lfx-upgrade")

`lfx upgrade` 명령어는 내장 컴포넌트 레지스트리에 대해 플로우를 검사하고, 호환되지 않게 되었거나 안전한 자동 업그레이드가 가능한 컴포넌트를 보고합니다.

`lfx upgrade`는 플로우의 각 컴포넌트를 LFX 릴리스에 포함된 `_assets/component_index.json`의 번들 인덱스와 비교합니다.

플래그 없이 실행하면 읽기 전용 호환성 보고서를 얻습니다. 이 명령어는 플로우 JSON을 읽고, 모든 컴포넌트 노드를 순회하며, 각 노드의 상태를 한 줄씩 출력합니다. 파일을 수정하지는 않습니다.

```bash
lfx upgrade my-flow.json  
```

출력 예시:

```text
[SAFE] Agent (AgentComponent) - id: abc123  
[OK] Chat Output (ChatOutput) - id: def456  
```

| CLI 출력   | 의미                                                                                                                         | 예시                                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `[OK]`       | 컴포넌트가 현재 레지스트리와 일치합니다.                                                                                               | 조치가 필요하지 않습니다.                                                                                             |
| `[SAFE]`     | 컴포넌트 코드가 변경되었지만, 플로우가 사용하는 포트와 필드는 여전히 일치합니다. `lfx upgrade --write`로 이 업데이트를 자동 적용할 수 있습니다. | 이전에는 `Message`만 출력하던 출력이 이제 `Data`도 지원합니다.                                                    |
| `[BREAKING]` | 플로우가 의존하는 포트나 필드가 제거되었습니다.                                                                                       | `Message`와 `Data`를 받던 입력이 이제 `Message`만 받으며 플로우가 `Data` 컴포넌트를 사용 중입니다. |
| `[BLOCKED]`  | 컴포넌트 타입이 이 LFX 빌드에 더 이상 존재하지 않습니다.                                                                                | 번들 전용 컴포넌트가 환경에 설치되어 있지 않습니다.                                                                    |

수정을 적용하거나 더 엄격한 검사를 강제하려면 다음을 실행합니다.

```bash
# 모든 안전한 업그레이드를 적용하고 파일을 덮어쓰기  
lfx upgrade my-flow.json --write  

# 대기 중인 안전한 업그레이드가 있으면 실패(--write 실행 전 드라이런 이후 사용)  
lfx upgrade my-flow.json --strict  
```

## `--upgrade-flow`로 인라인 호환성 검사하기[​](#inline-compatibility-checking-with---upgrade-flow "Direct link to inline-compatibility-checking-with---upgrade-flow")

`lfx run`과 `lfx serve` 모두 `--upgrade-flow` 옵션을 받아, 별도의 `lfx upgrade` 단계 없이 실행 시 호환성 검사를 적용할 수 있습니다.

```bash
# 확인만 함 — 컴포넌트가 차단되면 실패  
lfx run my-flow.json --upgrade-flow=check "Hello world"  

# 메모리 상에서 안전한 업그레이드를 적용한 뒤 실행  
lfx run my-flow.json --upgrade-flow=safe "Hello world"  

# serve에도 동일한 옵션 적용  
lfx serve my-flow.json --upgrade-flow=safe  
```

| 모드    | 동작                                                                                                           |
| ------- | ------------------------------------------------------------------------------------------------------------------ |
| `check` | 호환성 문제를 보고하고, 컴포넌트가 차단되면 0이 아닌 코드로 종료합니다. 디스크에 변경 사항이 기록되지 않습니다.       |
| `safe`  | 메모리 상에서 모든 안전한 업그레이드를 적용한 뒤 플로우를 실행하거나 서비스합니다. 차단된 컴포넌트는 여전히 0이 아닌 코드로 종료됩니다. |

## 버전 고정하기[​](#pin-versions "Direct link to Pin versions")

`requirements.txt`에서 `lfx~=1.10.0`을 고정하면, 다음 minor 버전으로 자동으로 넘어가지 않으면서 해당 Langflow minor 버전의 모든 패치 릴리스를 추적할 수 있습니다.

```text
# requirements.txt — 1.10.1, 1.10.2 등은 허용하지만 1.11.0은 허용하지 않음  
lfx~=1.10.0  
```

## LFX 0.5.x에서 1.10.0으로 마이그레이션하기[​](#migrating-from-lfx-05x-to-1100 "Direct link to Migrating from LFX 0.5.x to 1.10.0")

LFX는 독립형 `0.5.x` 라인에서 Langflow의 `major.minor` 라인으로 재정렬되었으므로, 버전 번호가 한 릴리스에서 `0.5.0`에서 `1.10.0`으로 건너뜁니다. 이는 버전 번호 매기기 변경이지, 95개의 minor 릴리스에 걸친 신규 기능이 아닙니다.

이 도약은 기존 의존성 고정에 예상치 못한 영향을 줄 수 있습니다.

| 고정 방식                   | 영향                                                |
| ---------------------------- | ----------------------------------------------------- |
| `lfx==0.5.x` 또는 `lfx<1.0`   | 업그레이드되지 않습니다. 배포는 0.5.x에 머무릅니다.      |
| `lfx>=0.5,<1`               | 업그레이드되지 않습니다. 상한이 1.10.0을 제외합니다.    |
| `lfx>=0.5`(상한 없음) | 다음 설치 시 자동으로 1.10.0으로 업그레이드됩니다. |

이제부터는 `lfx~=1.10.0`으로 고정하여 minor 라인을 알아채지 못한 채로 넘어가지 않으면서 호환되는 패치를 받으세요.

## 엔진 전용 LFX와 `lfx[bundles]`[​](#engine-only-lfx-and-lfxbundles "Direct link to engine-only-lfx-and-lfxbundles")

`pip install lfx`는 엔진만 설치합니다. 컴포넌트 번들은 포함되지 않습니다.
전체 Langflow 서버 없이 제공자 컴포넌트를 사용해 플로우를 실행하는 헤드리스나 서버리스 배포의 경우, 엔진과 함께 롱테일 번들 패키지를 설치하세요.

```bash
uv pip install "lfx[bundles]"  
```

이는 `lfx` 플러스 `lfx-bundles[all]`을 설치하는 것과 동일하며, torch를 끌어오는 롱테일 제공자인 **CUGA**와 **Code Agents**도 포함합니다.
`lfx-openai`나 `lfx-exa` 같은 성숙한 독립형 패키지는 설치하지 **않습니다**. 대신 `uv pip install langflow`는 `lfx-bundles[all-no-torch]`와 개별 `lfx-*` 패키지에 의존하므로, Langflow는 기본적으로 torch-free 상태를 유지합니다.
더 가벼운 이미지를 원한다면 배포가 실제로 실행하는 제공자 패키지만 설치하세요. 예를 들면 `uv pip install lfx lfx-openai "lfx-bundles[qdrant]"`입니다.
`lfx[all]` extra는 `uv pip install langflow`와 동일하기 때문에 의도적으로 존재하지 않습니다.
일부 컴포넌트는 [torch 옵트인 설치](https://docs.langflow.org/next/components-bundle-components#torch-opt-in)가 필요합니다.
