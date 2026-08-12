# lfx prewarm으로 LFX 예열하기

> 원문: https://docs.langflow.org/next/lfx-prewarm

`lfx prewarm`은 핵심 컴포넌트 임포트와(선택적으로) 특정 플로우를 예열하여, fork나 스냅샷 이후 첫 빌드나 실행에서 콜드 지연 임포트(lazy-import) 비용을 건너뛰도록 합니다.

tip

`lfx prewarm`은 단발성 `lfx run` 호출에는 이점이 없습니다. 워커를 fork하거나 warm 스냅샷을 캡처하려는 장기 실행 프로세스에서 사용하세요.

예열은 두 계층으로 작동합니다.

핵심 임포트 예열(Core import warm-up)은 내장 컴포넌트 클래스를 임포트하고, 네트워크나 스레드 없이 작은 플로우를 실행하여 그래프 실행 메커니즘을 준비합니다.

플로우 예열(Flow warm-up)은 특정 플로우 JSON을 빌드하거나 완전히 실행하여 해당 플로우에 대한 예열도를 최대화합니다.

## 성능[​](#performance "Direct link to Performance")

아래 표는 캐시된 임포트가 없는 완전히 새로운 환경에서 간단한 플로우에 대해 측정된 타이밍을 보여줍니다.

| 단계             | 콜드 (중앙값) | 예열됨 (중앙값) | 속도 향상 |
| ----------------- | ------------- | ------------------ | ------- |
| Import            | 4448 ms       | 5.6 ms             | 790×    |
| Build             | 260 ms        | 58 ms              | 4×      |
| Run               | 2.6 ms        | 1.9 ms             | ~1×     |
| 요청당 총계 | 4709 ms       | 66 ms              | 71×     |

이 수치는 예열이 제공할 수 있는 상한선을 나타냅니다.
핵심(core)이 아닌 임포트를 사용하는 컴포넌트가 포함된 플로우는 첫 실행 시 여전히 해당 임포트 비용이 발생하여 실질적인 속도 향상이 줄어듭니다.

## lfx prewarm 명령어[​](#lfx-prewarm-commands "Direct link to lfx prewarm commands")

```bash
# 핵심 임포트만 예열  
lfx prewarm  

# 핵심 임포트와 특정 플로우 예열  
lfx prewarm --flow my-flow.json  

# 예열 후 fork 간 copy-on-write 공유를 위해 힙을 고정(freeze)  
lfx prewarm --freeze  
```

## 옵션[​](#options "Direct link to Options")

| 옵션                              | 설명                                                                                     |
| ----------------------------------- | ----------------------------------------------------------------------------------------------- |
| `--flow`                            | 예열할 플로우 JSON 파일 경로. 여러 플로우에 대해 반복 사용 가능.                           |
| `--freeze`                          | 예열 후 `gc.freeze()`를 호출하여 fork 간 copy-on-write 힙 공유를 활성화.             |
| `--skip-run`                        | 헤르메틱(hermetic) 예열 실행을 건너뜀(임포트만 수행).                                                                   |
| `--unsafe-run-may-leak-connections` | 각 `--flow`를 완전히 실행(최대 예열도). 연결이 살아있게 남으며 fork에 **안전하지 않음**. |
| `--verbose`                         | 컴포넌트별 임포트 결과와 타이밍을 출력.                                                  |

## 참고 자료[​](#see-also "Direct link to See also")

- [LFX 소개](https://docs.langflow.org/next/lfx-overview)
- [LFX로 플로우 실행하기](https://docs.langflow.org/next/lfx-run)
- [LFX로 플로우 서비스하기](https://docs.langflow.org/next/lfx-serve)
