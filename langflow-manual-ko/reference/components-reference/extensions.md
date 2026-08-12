# Langflow 익스텐션 개요

> 원문: https://docs.langflow.org/next/extensions-overview

Langflow는 서드파티 제공자 통합을 **익스텐션(extension)** 형태로 제공합니다.
익스텐션은 Langflow가 시작될 때 컴포넌트를 등록하는 `pip`로 설치 가능한 패키지입니다.

각 익스텐션은 하나 이상의 **번들(bundle)**을 노출합니다.
번들은 `openai`, `qdrant`, `duckduckgo`와 같이 이름이 지정된 제공자입니다.
이 번들은 시각적 편집기에서 관련 컴포넌트가 나열되는 그룹과 동일합니다.

모든 통합이 `langflow`에 내장되는 대신, 필요한 익스텐션만 설치할 수 있습니다. 저장된 플로우는 pip 패키지 이름이 아니라 안정적인 ID(`ext:<bundle>:<Class>@official`)로 번들을 참조하므로, 제공자가 패키지를 이동해도 플로우가 깨지지 않습니다.

익스텐션 및 번들 컴포넌트를 설치하는 방법은 [번들 컴포넌트가 포함된 LFX 설치](https://docs.langflow.org/next/lfx-install#install-with-bundle-components)를 참고하세요.

자신만의 익스텐션을 만들려면 [첫 번째 익스텐션 만들기](https://docs.langflow.org/next/extensions-quickstart)를 참고하세요.

## 참고 자료[​](#see-also "See also 항목으로 바로 가기")

- [LFX 소개](https://docs.langflow.org/next/lfx-overview)
- [LFX 설치](https://docs.langflow.org/next/lfx-install)
- [번들 목록](https://docs.langflow.org/next/extensions-bundle-list)
- [첫 번째 익스텐션 만들기](https://docs.langflow.org/next/extensions-quickstart)
- [매니페스트 레퍼런스](https://docs.langflow.org/next/extensions-manifest)
- [LFX로 플로우 실행하기](https://docs.langflow.org/next/lfx-run)
- [LFX로 플로우 서빙하기](https://docs.langflow.org/next/lfx-serve)
