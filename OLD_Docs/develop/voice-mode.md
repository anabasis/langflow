# 보이스 모드 사용

> **경고**: 보이스 모드는 Langflow 1.10부터 더 이상 사용되지 않습니다(deprecated).
>
> **플레이그라운드**의 **마이크** 버튼은 이제 음성-텍스트 변환만 활성화하며 추가 보이스 모드 기능은 없습니다. 음성-텍스트 변환은 음성을 플레이그라운드의 채팅 입력 필드로 텍스트로 변환하지만 Langflow UI와의 음성 상호작용이나 텍스트 음성 변환 응답은 제공하지 않습니다.

> **참고**: 보이스 모드는 Langflow Desktop에서 사용할 수 없습니다. 보이스 모드를 사용하려면 [Langflow OSS Python 패키지를 설치](../get-started/installation.md)하세요.

보이스 모드를 사용하여 마이크와 스피커를 통해 음성으로 플로우와 상호작용할 수 있습니다.

---

## 사전 요구사항

보이스 모드에는 다음이 필요합니다:

- **Chat Input**, **Language Model**, **Chat Output** 컴포넌트가 있는 플로우
- [OpenAI](https://platform.openai.com/) 계정 및 OpenAI API 키 (Langflow가 음성 입력 처리 및 응답 생성에 OpenAI API를 사용합니다)
- 선택 사항: LLM 응답에 더 많은 음성 옵션을 사용하려면 [ElevenLabs](https://elevenlabs.io) API 키
- 마이크 및 스피커 (최적의 음성 인식을 위해 고품질 마이크와 최소한의 배경 소음 권장)

---

## 플레이그라운드에서 보이스 모드 테스트

**플레이그라운드**에서 **마이크** 아이콘을 클릭하여 보이스 모드를 활성화하고 마이크와 스피커를 통해 플로우와 음성으로 상호작용합니다.

다음 단계는 **Simple Agent** 템플릿을 사용하여 보이스 모드를 활성화하는 방법을 보여줍니다:

1. **Simple Agent** 템플릿을 기반으로 플로우를 만듭니다.
2. **Agent** 컴포넌트에 **OpenAI API 키** 자격 증명을 추가합니다.
3. **Playground**를 클릭합니다.
4. **마이크** 아이콘을 클릭하여 **보이스 모드** 대화 상자를 엽니다.
5. OpenAI API 키를 입력하고 **Save**를 클릭합니다.
6. 마이크 액세스 허용을 요청받으면 반드시 허용해야 합니다.
7. **Audio Input**에서 보이스 모드에 사용할 입력 장치를 선택합니다.
8. 선택 사항: LLM 응답에 더 많은 음성을 사용하려면 ElevenLabs API 키를 추가합니다.
9. **Preferred Language**에서 사용할 언어를 선택합니다.
10. 마이크에 대고 말하여 채팅을 시작합니다.

---

## 웹소켓 엔드포인트를 사용한 애플리케이션 개발

Langflow는 플로우에 대한 OpenAI Realtime API 호환 웹소켓 엔드포인트를 제공합니다. [OpenAI Realtime API 웹소켓](https://platform.openai.com/docs/guides/realtime#connect-with-websockets)과 같은 방식으로 이 엔드포인트를 기반으로 애플리케이션을 구축할 수 있습니다.

Langflow API의 웹소켓 엔드포인트는 인증을 위해 OpenAI API 키가 필요하며 ElevenLabs API 키로 선택적인 ElevenLabs 통합을 지원합니다.

### 음성-텍스트 오디오 전사

`/ws/flow_tts/$FLOW_ID` 엔드포인트는 [OpenAI Realtime 음성 전사](https://platform.openai.com/docs/guides/realtime-transcription)를 사용하여 오디오를 텍스트로 변환한 다음 각 전사에 대해 지정된 플로우를 직접 호출합니다.

### 웹소켓 엔드포인트의 세션 ID

엔드포인트는 대화의 고유 ID를 제공하기 위한 선택적 `/$SESSION_ID` 경로 매개변수를 허용합니다. 생략하면 Langflow는 플로우 ID를 세션 ID로 사용합니다.

---

## 참고 항목

- [플레이그라운드에서 플로우 테스트](../flows/test-flows.md)
- [문제 해결](../community/troubleshoot.md)

---

*원문: https://docs.langflow.org/next/concepts-voice-mode*
